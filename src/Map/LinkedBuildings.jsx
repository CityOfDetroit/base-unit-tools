import React, { useEffect, useState } from "react";
import layers from "../data/layers";
import { queryFeatures } from "@esri/arcgis-rest-feature-service";
import {
  ArrowRightIcon,
  CaretDownIcon,
  CaretRightIcon,
  CubeIcon,
  EnterIcon,
  PinRightIcon,
  SewingPinFilledIcon,
} from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import { Box, Button, Flex, Text, Card, Separator } from "@radix-ui/themes";
import * as Collapsible from "@radix-ui/react-collapsible";

const LinkedBuildings = ({
  layer,
  feature,
}) => {
  const [open, setOpen] = useState(true);

  let lyr = layers[layer];

  let [loading, setLoading] = useState(true);

  let [linkedBuildings, setLinkedBuildings] = useState([]);

  // // Create a "collator": https://developer.mozilla.properties.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/compare
  // let collator = new Intl.Collator(undefined, {
  //   numeric: true,
  //   sensitivity: "base",
  // });

  useEffect(() => {
    if (layer === "parcel") {
      setLoading(true);
      queryFeatures({
        url: layers.building.endpoint,
        where: `${layer === "parcel" ? "parcel_id" : lyr.id_column} = ${
          layer === "parcel"
            ? `'${feature.properties.parcel_id}'`
            : feature.properties[lyr.id_column]
        }`,
        outFields: "*",
        f: "geojson",
      }).then((r) => {
        setLinkedBuildings(r.features);
        setLoading(false)
      });
    }
    else {
      setLoading(false);
    }
  }, [feature]);
  
  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Box>
        <Card style={{ backgroundColor: layers.building.bg_color }}>
          <Flex align={"center"} gap={"2"} className="dark:text-slate-700">
            <CubeIcon />
            <Text size="2" weight={"medium"}>
              {!loading ? 
                `${linkedBuildings.length === 0 ? 'No' : linkedBuildings.length} buildings linked to this ${layer}`
                : "loading ..."
                }
            </Text>
            {linkedBuildings.length > 0 && <Collapsible.Trigger as={Button} className="ml-auto">
              {open ? <CaretDownIcon /> : <CaretRightIcon />}
            </Collapsible.Trigger>}
          </Flex>
        </Card>

        {!loading && linkedBuildings && (
          <Collapsible.Content>
            <Flex
              direction={"column"}
              gap={"1"}
              p={"2"}
              className="max-h-48 lg:max-h-96 overflow-auto"
            >
              {linkedBuildings.map((building, idx) => {
                let { properties: props } = building;
                return (
                  <div key={building.id}>
                    <Flex
                      key={building.id}
                      direction={"row"}
                      justify={"start"}
                      align={"center"}
                      gap="4"
                    >
                      <Text size="2" weight={"bold"} className="w-full">
                        {props.building_id}
                      </Text>
                      <Link to={`/map?id=${building.id}&layer=building`}>
                        <Box
                          className="rounded-full"
                          style={{
                            backgroundColor: layers.building.bg_color,
                            opacity: 0.5,
                          }}
                        >
                          <ArrowRightIcon
                            height="22"
                            width="22"
                            className="text-black p-1"
                          />
                        </Box>
                      </Link>
                    </Flex>
                    {idx + 1 < linkedBuildings.length && (
                      <Separator size={"4"} p={"2"} />
                    )}
                  </div>
                );
              })}
            </Flex>
          </Collapsible.Content>
        )}
      </Box>
    </Collapsible.Root>
  );
};

export default LinkedBuildings;
