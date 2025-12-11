import { useEffect, useState } from "react";
import { queryFeatures } from "@esri/arcgis-rest-feature-service";
import layers from "../data/layers";
import { arcgisToGeoJSON } from "@terraformer/arcgis";
import { Button, Card, TextField, Text, Flex } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import useGeocoder from "../hooks/useGeocoder";

const MailerAddressSearch = ({ geom, setGeom }) => {
  const [inputValue, setInputValue] = useState("");

  const { address, feature, loading, error, changeAddress } = useGeocoder();

  useEffect(() => {
    if (feature && !loading) {
      queryFeatures({
        url: layers.parcel.endpoint,
        where: `${layers.parcel.id_column} = '${feature.attributes.parcel_id}'`,
        outFields: "*",
        resultRecordCount: 1,
        outSR: 4326,
        f: "json",
      }).then((d) => {
        if (d.features.length > 0) {
          setGeom(arcgisToGeoJSON(d));
        } else {
          // we got a result without a parcel id
          if (feature?.score) {
            let geocodeResult = {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [feature.location.x, feature.location.y],
                  },
                },
              ],
            };
            setGeom(geocodeResult);
          } else {
            console.log(`No features found.`);
          }
        }
      });
    }
  }, [feature]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      changeAddress(inputValue);
    }
  };

  const handleSearch = () => {
    changeAddress(inputValue);
  };

  return (
    <Card>
      <Flex direction="column" gap="2">
        <Text size="2" weight="medium">
          Search for an address
        </Text>
        <Flex align="center" gap="2">
          <TextField.Root
            className="flex-1"
            placeholder="Enter an address..."
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>
          <Button
            size="2"
            onClick={handleSearch}
            disabled={!inputValue.trim() || loading}
            style={{ backgroundColor: "#004445" }}
          >
            {loading ? "..." : "Search"}
          </Button>
        </Flex>
        {error && (
          <Text size="1" color="red">
            {error}
          </Text>
        )}
        {feature && !loading && (
          <Text size="1" color="gray" className="text-green-600">
            Found: {feature.attributes?.Match_addr || address}
          </Text>
        )}
      </Flex>
    </Card>
  );
};

export default MailerAddressSearch;
