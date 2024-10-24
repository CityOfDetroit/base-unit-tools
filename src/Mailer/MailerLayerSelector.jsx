import simplify from "@turf/simplify";
import { useEffect, useState } from "react";
import { queryFeatures } from "@esri/arcgis-rest-feature-service";
import { Card, Select, Text, Flex, Button } from "@radix-ui/themes";

const presets = {
  census_tracts: {
    name: "Census Tracts",
    singular: "Census tract",
    pickColumn: "NAMELSAD10",
    url: "https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/2010_Census_Tracts/FeatureServer/0/",
  },
  neighborhoods: {
    name: "Neighborhoods",
    singular: "neighborhood",
    pickColumn: "nhood_name",
    url: "https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/Current_City_of_Detroit_Neighborhoods/FeatureServer/0/",
  },
  historic_districts: {
    name: "Historic Districts",
    singular: "historic district",
    pickColumn: "Name",
    url: "https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/Detroit_Local_Historic_Districts/FeatureServer/0/",
  },
  master_planning_neighborhoods: {
    name: "Master Plan Neighborhoods",
    singular: "master plan neighborhood",
    pickColumn: "NHOOD",
    url: "https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/MasterPlanNeighborhood/FeatureServer/0/",
  },
  zip_codes: {
    name: "ZIP codes",
    singular: "zip code",
    pickColumn: "zipcode",
    url: `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/ZipCodes/FeatureServer/0/`,
  },
  council_districts: {
    name: "Council Districts",
    singular: "Council district",
    pickColumn: "Name",
    url: "https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/CouncilDistricts/FeatureServer/0/",
  },
  cbo: {
    name: "CBOs",
    singular: "CBO area",
    url: "https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/CBO_Impact_Areas/FeatureServer/0/",
    pickColumn: "Name",
  },
  pdd_planning_areas: {
    name: "PDD Planning Projects",
    singular: "Planning project",
    url: `https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/PDD_Planning_Projects/FeatureServer/1/`,
    pickColumn: "Proj_NAME",
  },
};

const MailerLayerSelector = ({ geom, setGeom }) => {
  const [currentLayer, setCurrentLayer] = useState("");
  const [layerFeatures, setLayerFeatures] = useState([]);
  const [currentFeature, setCurrentFeature] = useState(null);

  useEffect(() => {
    if (currentLayer !== "") {
      queryFeatures({
        url: presets[currentLayer].url,
        geometryPrecision: 5,
        f: "geojson",
      }).then((d) => {
        // setLayerFeatures(d.features)
        let features = d.features.sort(
          (a, b) =>
            a.properties[presets[currentLayer].pickColumn] >
            b.properties[presets[currentLayer].pickColumn]
        );
        setLayerFeatures(features);
      });
    }
  }, [currentLayer]);

  useEffect(() => {
    setCurrentFeature(null);
  }, [geom]);

  useEffect(() => {
    if (currentFeature) {
      let matching = layerFeatures.filter((ft) => {
        return ft.id === parseInt(currentFeature);
      });

      console.log(matching[0]);
      let simplified = simplify(matching[0], { tolerance: 0.0001 });
      setGeom({ type: "FeatureCollection", features: [simplified] });
    }
  }, [currentFeature]);

  return (
    <Card>
      <Flex direction="column" gap="1">
        <Text weight="medium">Choose from existing boundaries</Text>
        <Text size="1">Choose your layer, then choose a feature within that layer.</Text>

        <Select.Root
          onValueChange={(value) => {
            setCurrentLayer(value);
            setLayerFeatures([]);
          }}
          value={currentLayer}
        >
          <Select.Trigger />
          <Select.Content>
            {Object.keys(presets).map((l) => (
              <Select.Item value={l} key={l}>
                {presets[l].name}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
        
        {layerFeatures.length > 0 && (
          <Select.Root
            onValueChange={(value) => {
              setCurrentFeature(value);
            }}
          >
            <Select.Trigger />
            <Select.Content>
              {layerFeatures.map((ft) => (
                <Select.Item key={ft.id} value={ft.id}>
                  {ft.properties[presets[currentLayer].pickColumn].slice(0, 40)}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        )}
      </Flex>
    </Card>
  );
};

export default MailerLayerSelector;
