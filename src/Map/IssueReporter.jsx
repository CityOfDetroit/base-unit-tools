import { useState } from "react";
import {
  Dialog,
  Button,
  Flex,
  Text,
  TextField,
  TextArea,
  Badge,
} from "@radix-ui/themes";
import { ExclamationTriangleIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import { addFeatures } from "@esri/arcgis-rest-feature-service";
import centroid from "@turf/centroid";
import { useAuth } from "../contexts/AuthContext";
import layers from "../data/layers";

const ISSUE_REPORTER_URL =
  "https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/issue_reporter/FeatureServer/0";

const layerLabels = {
  parcel: "Parcel",
  address: "Address",
  building: "Building",
  street: "Street",
};

const IssueReporter = ({ feature, layer }) => {
  const { token, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [formText, setFormText] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const lyr = layers[layer];
  const featureId = feature?.properties?.[lyr?.id_column];

  const getCoordinates = () => {
    if (!feature?.geometry) return { x: null, y: null };

    const geomType = feature.geometry.type;
    if (geomType === "Point") {
      return {
        x: feature.geometry.coordinates[0],
        y: feature.geometry.coordinates[1],
      };
    }
    // For Polygon, MultiPolygon, LineString, etc., compute centroid
    const center = centroid(feature);
    return {
      x: center.geometry.coordinates[0],
      y: center.geometry.coordinates[1],
    };
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    const { x, y } = getCoordinates();

    try {
      const result = await addFeatures({
        url: ISSUE_REPORTER_URL,
        features: [
          {
            geometry: { x, y, spatialReference: { wkid: 4326 } },
            attributes: {
              address: null,
              feature_type: layer,
              feature_id: featureId?.toString() || null,
              email: isAuthenticated ? null : email || null,
              issue: formText,
              status: "open",
            },
          },
        ],
        params: token ? { token } : {},
      });
      setResponse(result);
    } catch (err) {
      setError(err.message || "Failed to submit issue");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    // Reset form after a brief delay so user doesn't see reset
    setTimeout(() => {
      setFormText("");
      setEmail("");
      setResponse(null);
      setError(null);
    }, 200);
  };

  const isSuccess = response?.addResults?.[0]?.success;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Text
          size="1"
          weight="light"
          className="flex items-center gap-1 cursor-pointer hover:underline"
        >
          <ExclamationTriangleIcon />
          report issue
        </Text>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Report an Issue</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Report an issue with the underlying data (incorrect addresses, missing buildings, etc.). To report a city service issue such as potholes, blight, or illegal dumping, use{" "}
          <Link
            to="https://seeclickfix.com/web_portal/HqbyN8hY9UGyuhFwxK7LaZeZ/report/category"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 underline hover:text-gray-700"
          >
            Improve Detroit
            <ExternalLinkIcon />
          </Link>
          .
        </Dialog.Description>

        {!isSuccess ? (
          <Flex direction="column" gap="3">
            <Flex gap="2" align="center">
              <Badge color="gray">{layerLabels[layer]}</Badge>
              <Text size="2" className="font-mono">
                {featureId}
              </Text>
            </Flex>

            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">
                Describe the data issue
              </Text>
              <TextArea
                placeholder="What's wrong with this feature?"
                value={formText}
                onChange={(e) => setFormText(e.target.value)}
                maxLength={255}
                rows={4}
              />
              <Text size="1" color="gray" align="right">
                {formText.length}/255
              </Text>
            </Flex>

            {!isAuthenticated && (
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">
                  Your email (optional)
                </Text>
                <TextField.Root
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Flex>
            )}

            {error && (
              <Text size="2" color="red">
                {error}
              </Text>
            )}

            <Flex gap="3" mt="2" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                onClick={handleSubmit}
                disabled={!formText.trim() || submitting}
              >
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </Flex>
          </Flex>
        ) : (
          <Flex direction="column" gap="3" align="center" py="4">
            <Text size="3" weight="medium">
              Thanks for reporting this issue!
            </Text>
            <Button onClick={handleClose}>Close</Button>
          </Flex>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default IssueReporter;
