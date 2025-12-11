import { getLayer, queryFeatures } from "@esri/arcgis-rest-feature-service";
import { geojsonToArcGIS } from "@terraformer/arcgis";
import { Promise } from "bluebird";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import MailerAddressSearch from "./MailerAddressSearch";
import MailerBuffer from "./MailerBuffer";
import MailerLayerSelector from "./MailerLayerSelector";
import MailerMap from "./MailerMap";
import MailerSelection from "./MailerSelection";
import MailerTable from "./MailerTable";
import Stepper from "../components/Stepper";
import Progress from "../components/Progress";
import MailerSummary from "./MailerSummary";
import {
  Button,
  Card,
  Grid,
  Text,
  Flex,
  Switch,
  RadioCards,
} from "@radix-ui/themes";
import { useAuth } from "../contexts/AuthContext";
import {
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  DownloadIcon,
} from "@radix-ui/react-icons";
import { Link } from "react-router-dom";

const Mailer = () => {
  // Step state
  const [currentStep, setCurrentStep] = useState(1);

  // object to track filters
  const allFilters = {
    "usps-deliverable": {
      activeText: "Deliverable addresses only",
      inactiveText: "All addresses, even undeliverable",
      default: true,
      filterFunction: (a) =>
        a.attributes.usps_status === "Deliverable" ||
        a.attributes.USPS_Status === "Deliverable",
    },
  };

  // this tool is principally driven by this piece of state
  // which represents represents the current selection area
  const [geom, setGeom] = useState(null);

  // use this boolean to see if the user has access to the mailing list layer
  const [access, setAccess] = useState(false);

  // keep track of mailer mode here:
  // mode 1 is centroid
  // mode 2 is parcel
  let mailerLayers = [
    `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/base_unit_mailer_points/FeatureServer/1`, // parcels
    `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/base_unit_mailer_points/FeatureServer/0`, // centroids
  ];
  const [layer, setLayer] = useState("centroid");

  // use this to set state of filter toggles
  let defaults = {};
  Object.keys(allFilters).forEach((f) => {
    defaults[f] = allFilters[f].default;
  });
  const [filters, setFilters] = useState(defaults);
  // store the selection area object IDs, all addresses, and the filtered addresses.
  const [resultIds, setResultIds] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // draw mode
  // should be one of these: https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/API.md#modes
  const [mode, setMode] = useState("simple_select");

  const [formattedData, setFormattedData] = useState(null);
  const [features, setFeatures] = useState(null);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, percent: 0 });

  let { token } = useAuth();

  // this effect runs if the user logs in or out.
  // it tests access to the mailing list layer
  useEffect(() => {
    getLayer({
      url: mailerLayers[0],
      authentication: token,
    }).then(
      () => {
        setAccess(true);
      },
      () => {
        setAccess(false);
      }
    );
  }, []);

  // this effect runs when the geom changes (or if there's a change in access)
  // it gets the objectids for all the features in the selection --
  // we just want this list so we can display a total count && generate breakpoints
  // in the fetchAddresses function
  useEffect(() => {
    setResultIds(null);
    setAddresses([]);
    setFiltered([]);
    if (geom && access) {
      setIsLoading(true);
      setProgress({ current: 0, total: 0, percent: 0 });
      queryFeatures({
        url: layer === "parcel" ? mailerLayers[0] : mailerLayers[1],
        // the key bit
        returnIdsOnly: true,
        orderByFields: "objectid",
        // intersects-with-selection parameters
        geometry: geojsonToArcGIS(geom)[0].geometry,
        geometryType: "esriGeometryPolygon",
        spatialRel: "esriSpatialRelIntersects",
        inSR: 4326,
        outSR: 4326,
        httpMethod: "POST",
        returnCentroid: layer === "parcel" ? true : false,
        authentication: token,
      }).then((d) => {
        setResultIds(d);
      });
    }
  }, [geom, access, token, layer]);

  useEffect(() => {
    // this function is what runs when we click "Download CSV"
    // we'll use the list of objectIDs to actually go get the addresses
    const fetchAddresses = () => {
      let allAddresses = [];

      // fetch this many addresses at a time. we can turn this up to 2000
      const chunkSize = 500;

      // get the "breakpoints": basically the first ID value, then every chunkSize'th value afterwards
      let breakpoints = resultIds.objectIds.filter(
        (_, i) => i === 0 || i % chunkSize === 0
      );

      // push the last ObjectID plus one onto the stack -- we still need to fetch between it
      breakpoints.push(resultIds.objectIds.slice(-1)[0] + 1);

      const totalAddresses = resultIds.objectIds.length;
      let completedChunks = 0;

      setProgress({ current: 0, total: totalAddresses, percent: 0 });

      // create a bunch of Promises for the number of queries we need
      let queryParams = breakpoints.slice(1).map((b, i) => {
        let params = {
          url: layer === "parcel" ? mailerLayers[0] : mailerLayers[1],
          orderByFields: "objectid",
          // this is confusing, but produces the correct result.
          // it has to be weird because of how BETWEEN seems to work.
          where: `objectid between ${
            i === 0 ? breakpoints[0] - 1 : breakpoints[i]
          } and ${b - 1}`,
          geometry: geojsonToArcGIS(geom)[0].geometry,
          geometryType: "esriGeometryPolygon",
          spatialRel: "esriSpatialRelIntersects",
          httpMethod: "POST",
          returnCentroid: layer === "parcel" ? true : false,
          inSR: 4326,
          outSR: 4326,
          resultRecordCount: chunkSize,
          authentication: token,
        };
        return params;
      });

      Promise.map(
        queryParams,
        (params) => {
          return queryFeatures(params).then((result) => {
            allAddresses = allAddresses.concat(result.features);
            completedChunks++;
            const processedCount = Math.min(
              completedChunks * chunkSize,
              totalAddresses
            );
            setProgress({
              current: processedCount,
              total: totalAddresses,
              percent: Math.round((processedCount / totalAddresses) * 100),
            });
            return result;
          });
        },
        { concurrency: 2 }
      ).then(() => {
        setAddresses(allAddresses);
        setIsLoading(false);
        // Auto-advance to step 2 when data is fetched
        if (allAddresses.length > 0) {
          setCurrentStep(2);
        }
      });
    };
    if (resultIds && resultIds.objectIds.length > 0) {
      fetchAddresses();
    } else if (resultIds && resultIds.objectIds.length === 0) {
      setIsLoading(false);
    }
  }, [resultIds]);

  // if our filters or addresses change,
  // run the new addresses through the new filters
  useEffect(() => {
    let filteredAddresses = addresses;
    Object.keys(filters).forEach((k) => {
      if (filters[k]) {
        filteredAddresses = filteredAddresses.filter(
          allFilters[k].filterFunction
        );
      }
    });
    setFiltered(filteredAddresses);

    let formattedData = filteredAddresses.map((r) => {
      return r.attributes;
    });
    setFormattedData(formattedData);

    let features = filteredAddresses.map((f) => {
      let prop = layer === "parcel" ? "centroid" : "geometry";

      return {
        type: "Feature",
        properties: { ...f.attributes },
        geometry: {
          type: "Point",
          coordinates: [
            parseFloat(f[prop].x.toFixed(6)),
            parseFloat(f[prop].y.toFixed(6)),
          ],
        },
      };
    });

    let featureCollection = {
      type: "FeatureCollection",
      features: features,
    };

    setFeatures(featureCollection);
  }, [filters, addresses]);

  // Check if geometry is a polygon (required to proceed)
  const geometryType = geom?.features[0]?.geometry?.type;
  const isPolygon = geometryType === "Polygon" || geometryType === "MultiPolygon";
  const needsBuffer = geom && !isPolygon;

  // Navigation helpers - must have a polygon to proceed past step 1
  const canNavigateTo = (step) => {
    if (step === 1) return true;
    if (step === 2) return geom !== null && isPolygon;
    if (step === 3) return filtered.length > 0;
    return false;
  };

  const handleNext = () => {
    if (currentStep === 1 && geom && isPolygon) {
      setCurrentStep(2);
    } else if (currentStep === 2 && filtered.length > 0) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartOver = () => {
    setGeom(null);
    setResultIds(null);
    setAddresses([]);
    setFiltered([]);
    setFormattedData(null);
    setFeatures(null);
    setIsLoading(false);
    setProgress({ current: 0, total: 0, percent: 0 });
    setCurrentStep(1);
    setMode("simple_select");
  };

  return (
    <Grid
      columns={{ initial: "1fr", sm: "1fr 3fr" }}
      gap={{ initial: "0", sm: "4" }}
      p={{ initial: "2", sm: "2", lg: "4" }}
    >
      {/* Left Sidebar */}
      <Flex direction="column" className="min-w-80" gap="3">
        <Text size="5" weight="bold" className="text-[#004445]">
          Mailer
        </Text>

        {/* Show a warning if the user doesn't have access to the layer. */}
        {!access && (
          <Card className="bg-red-100 border-red-300">
            <Flex align="center" justify={"start"} gap="2">
              <ExclamationTriangleIcon className="text-red-600" />
              <Text weight="medium" className="text-red-700">
                No access!
              </Text>
            </Flex>
            <Text size={"1"} className="text-red-600">
              Please log in, or if you are logged in,{" "}
              <Link
                to="https://app.smartsheet.com/b/form/6919c51a844448e2a6811f04a6267292"
                className="underline"
              >
                contact the team
              </Link>{" "}
              for access.
            </Text>
          </Card>
        )}

        {access && (
          <>
            <Stepper
              steps={[
                { id: 1, label: "Selection" },
                { id: 2, label: "Options" },
                { id: 3, label: "Results" },
              ]}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              canNavigateTo={canNavigateTo}
            />

            {/* Step 1: Selection */}
            {currentStep === 1 && (
              <Flex direction="column" gap="2">
                <Card>
                  <Text weight="bold" size="3" className="mb-3 block">
                    Define Selection Area
                  </Text>
                  <Text size="2" color="gray" className="mb-3 block">
                    Draw a shape, search for an address, or choose from existing
                    boundaries.
                  </Text>
                  <Flex direction="column" gap="2">
                    <Text size="2" weight="medium">
                      Draw your own shape
                    </Text>
                    <Flex align="center" gap="2" wrap="wrap">
                      <Button
                        size="1"
                        variant={mode === "draw_polygon" ? "solid" : "soft"}
                        onClick={() => setMode("draw_polygon")}
                        style={
                          mode === "draw_polygon"
                            ? { backgroundColor: "#004445" }
                            : {}
                        }
                      >
                        Polygon
                      </Button>
                      <Button
                        size="1"
                        variant={mode === "draw_line_string" ? "solid" : "soft"}
                        onClick={() => setMode("draw_line_string")}
                        style={
                          mode === "draw_line_string"
                            ? { backgroundColor: "#004445" }
                            : {}
                        }
                      >
                        Line
                      </Button>
                      <Button
                        size="1"
                        variant={mode === "draw_point" ? "solid" : "soft"}
                        onClick={() => setMode("draw_point")}
                        style={
                          mode === "draw_point"
                            ? { backgroundColor: "#004445" }
                            : {}
                        }
                      >
                        Point
                      </Button>
                    </Flex>
                  </Flex>
                </Card>
                <MailerAddressSearch {...{ geom, setGeom }} />
                <MailerLayerSelector {...{ geom, setGeom }} />

                {/* Show buffer tool in Step 1 if geometry needs buffering */}
                {needsBuffer && (
                  <>
                    <Card className="bg-yellow-50 border-yellow-200">
                      <Flex align="center" gap="2">
                        <ExclamationTriangleIcon className="text-yellow-600" />
                        <Text size="2" className="text-yellow-700">
                          Lines and points must be buffered to create a mailing area.
                        </Text>
                      </Flex>
                    </Card>
                    <MailerBuffer {...{ geom, setGeom }} />
                  </>
                )}
              </Flex>
            )}

            {/* Step 2: Options */}
            {currentStep === 2 && (
              <Flex direction="column" gap="2">
                {/* Selection mode */}
                <Card>
                  <Text weight="bold" size="3" className="mb-2 block">
                    Data Selection Method
                  </Text>
                  <RadioCards.Root
                    value={layer}
                    defaultValue="centroid"
                    onValueChange={(value) => setLayer(value)}
                    gap="2"
                  >
                    <RadioCards.Item value="centroid">
                      <Flex direction="column" gap="1">
                        <Text size="2" weight="medium">Address points</Text>
                        <Text size="1" color="gray">
                          Addresses whose location falls within the selection area. Fastest option.
                        </Text>
                      </Flex>
                    </RadioCards.Item>
                    <RadioCards.Item value="parcel">
                      <Flex direction="column" gap="1">
                        <Text size="2" weight="medium">Parcel-based</Text>
                        <Text size="1" color="gray">
                          Addresses on parcels that intersect the selection. Use this for owner notifications within a radius.
                        </Text>
                      </Flex>
                    </RadioCards.Item>
                  </RadioCards.Root>
                </Card>

                {/* Deliverability */}
                <Card>
                  <Text weight="bold" size="3" className="mb-2 block">
                    Deliverability
                  </Text>
                  <Flex gap="2" align="center">
                    <Switch
                      checked={filters["usps-deliverable"]}
                      onCheckedChange={(e) => {
                        setFilters({ ...filters, "usps-deliverable": e });
                      }}
                    />
                    <Text size="2">USPS-deliverable addresses only</Text>
                  </Flex>
                  <Text size="1" color="gray" className="mt-2 block">
                    When enabled, excludes addresses marked as undeliverable by USPS.
                  </Text>
                </Card>

                {/* Optional buffer to expand selection */}
                <MailerBuffer {...{ geom, setGeom }} />
              </Flex>
            )}

            {/* Step 3: Results Summary in Sidebar */}
            {currentStep === 3 && filtered.length > 0 && (
              <Flex direction="column" gap="2">
                <Card>
                  <Text weight="bold" size="3" className="mb-2 block">
                    Export Options
                  </Text>
                  <Flex direction="column" gap="2">
                    <CSVLink
                      data={formattedData || []}
                      filename={`mailing_list_${new Date().getTime()}.csv`}
                    >
                      <Button
                        size="2"
                        className="w-full"
                        style={{ backgroundColor: "#004445" }}
                      >
                        <DownloadIcon />
                        Download CSV ({filtered.length.toLocaleString()} rows)
                      </Button>
                    </CSVLink>
                    <Button size="2" variant="outline" asChild>
                      <a href="https://detroitmi.maps.arcgis.com/sharing/rest/content/items/da107e7b0d0e48c3b210db20fa3c30e7/data">
                        View data dictionary
                      </a>
                    </Button>
                  </Flex>
                </Card>

                <Card>
                  <Flex direction="column" gap="2">
                    <Text weight="bold" size="3">
                      Complete
                    </Text>
                    <Text size="2" color="gray">
                      View your results in the panel to the right. You can go
                      back to modify your selection or options.
                    </Text>
                    <Button
                      variant="outline"
                      size="2"
                      onClick={handleStartOver}
                      color="red"
                    >
                      Start Over
                    </Button>
                  </Flex>
                </Card>
              </Flex>
            )}

            {/* Navigation Buttons */}
            <Flex gap="2" justify="between" className="mt-2">
              {currentStep > 1 && (
                <Button variant="soft" size="2" onClick={handleBack}>
                  <ArrowLeftIcon />
                  Back
                </Button>
              )}
              {currentStep === 1 && geom && isPolygon && (
                <Button
                  size="2"
                  onClick={handleNext}
                  className="ml-auto"
                  style={{ backgroundColor: "#004445" }}
                >
                  Next: Options
                  <ArrowRightIcon />
                </Button>
              )}
              {currentStep === 2 && (
                <Button
                  size="2"
                  onClick={handleNext}
                  disabled={filtered.length === 0 || isLoading}
                  className="ml-auto"
                  style={{ backgroundColor: "#004445" }}
                >
                  {isLoading
                    ? "Loading..."
                    : `View ${filtered.length.toLocaleString()} Results`}
                  <ArrowRightIcon />
                </Button>
              )}
            </Flex>
          </>
        )}
      </Flex>

      {/* Right Column - Map and Results */}
      <Flex
        direction="column"
        gap="3"
        className="min-h-96 min-w-0 overflow-hidden"
      >
        {isLoading && (
          <Progress
            progress={progress}
            waitingText="Querying addresses..."
            activeText="Loading addresses..."
          />
        )}

        {!isLoading && filtered.length > 0 && geom && (
          <Flex gap="3" wrap="wrap">
            <div className="flex-1 min-w-64">
              <MailerSummary
                geom={geom}
                filtered={filtered}
                addresses={addresses}
              />
            </div>
            <div className="flex-1 min-w-64">
              <MailerSelection geom={geom} setGeom={setGeom} resultIds={resultIds} />
            </div>
          </Flex>
        )}

        <MailerMap {...{ geom, setGeom, filtered, mode, setMode, features }} />

        {filtered.length > 0 && !isLoading && (
          <MailerTable {...{ filtered }} />
        )}
      </Flex>
    </Grid>
  );
};

export default Mailer;
