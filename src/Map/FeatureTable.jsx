import {
  AspectRatioIcon,
  CubeIcon,
  DoubleArrowRightIcon,
  SewingPinIcon,
  Link2Icon,
} from "@radix-ui/react-icons";
import { Box, Card, Flex, Inset, Text } from "@radix-ui/themes";
import React from "react";
import layers from "../data/layers";
import Address from "./Address";
import Building from "./Building";
import Parcel from "./Parcel";
import Street from "./Street";
import { DataSource, FeatureLink } from "../components/CardLink";
import { Link } from "react-router-dom";

export const icons = {
  parcel: <AspectRatioIcon style={{ height: 22, width: 22 }} />,
  building: <CubeIcon style={{ height: 22, width: 22 }} />,
  address: <SewingPinIcon style={{ height: 22, width: 22 }} />,
  street: <DoubleArrowRightIcon style={{ height: 22, width: 22 }} />,
};

const FeatureTable = ({ layer, loading, feature, refetch }) => {
  let lyr = layers[layer];

  if (!lyr) {
    return;
  }

  let dataSourceUrl =
    (lyr?.endpoint) +
    `/query?where=${lyr.id_column}='${
      feature?.properties[lyr.id_column]
    }'&outFields=*&f=html`;

  console.log(feature);

  let featureId = `${lyr.name === 'parcels' ? `` : `#`}${feature?.properties[lyr.id_column]}`;

  return (
    <Flex direction={"column"}>
      <Card
        className="dark:text-gray-800"
        style={{ backgroundColor: lyr?.bg_color, color: lyr?.text_color }}
      >
        <Flex align={"center"} justify={"start"}>
          <Box className="text-xl" mr={"3"}>
            {icons[layer]}
          </Box>
          {feature && (
            <Flex className="text-sm w-full" direction={"column"} align={"start"} >
              <Flex align="center" justify={"between"} className="w-full">
                <Text size={"2"} weight={"bold"}>
                  {lyr.label}
                </Text>
                <Box className="rounded-full py-1 px-2" style={{backgroundColor: lyr.bg_color}}>
                <Text size={"2"} className="font-mono" weight={"bold"}>
                  {loading
                    ? `loading ...`
                    : featureId}
                </Text>
                    </Box>
              </Flex>
              {!loading && lyr.label_column && (
                <Text size={"3"} weight="medium">
                  {feature.properties[lyr.label_column]}
                </Text>
              )}
            </Flex>
          )}
          {!feature && (
            <Text size={"2"}>
              {layer === "address"
                ? `Search for an address.`
                : `Select a ${layer} on the map, or search for an address.`}
            </Text>
          )}
        </Flex>
        <Inset>
          <Flex justify={"end"} gap={"4"} p={"1"} mt="3">
            {feature && (
              <FeatureLink
                url={`/map?id=${
                  feature?.properties[lyr.id_column]
                }&layer=${layer}`}
              />
            )}
            <DataSource url={dataSourceUrl} />
          </Flex>
        </Inset>
      </Card>
      {feature && (
        <Flex
          align={"start"}
          justify={"between"}
          direction={"column"}
          p={"3"}
          mt={"3"}
          gap={"4"}
          className="max-h-72 sm:max-h-[30vh] md:max-h-[45vh] lg:max-h-[60vh] xl:max-h-[70vh] overflow-y-auto"
        >
          {layer === "parcel" && <Parcel parcel={feature} loading={loading} />}
          {layer === "street" && <Street street={feature} />}
          {layer === "building" && <Building building={feature} />}
          {layer === "address" && <Address address={feature} />}
        </Flex>
      )}
    </Flex>
  );
};

export default FeatureTable;
