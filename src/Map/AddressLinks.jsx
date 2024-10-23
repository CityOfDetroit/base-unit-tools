import React, { useState } from "react";
import { CubeIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { Button, Card, Flex, Text, Box } from "@radix-ui/themes";
import layers from "../data/layers";
import * as Collapsible from "@radix-ui/react-collapsible";
import { CaretDownIcon, CaretRightIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import { icons } from "./FeatureTable";

const AddressLinks = ({ layer, feature }) => {
  console.log(feature);

  let [open, setOpen] = useState(false);

  return (
    <>
      {feature.properties.building_id && (
        <Card style={{ backgroundColor: layers.building.bg_color }}>
          <Flex
            align={"center"}
            justify={"between"}
            className="dark:text-slate-700"
          >
            <Flex align={"center"} gap={"3"} className="dark:text-slate-100">
              {icons.building}
              <Text size="2" weight={"medium"}>
                Linked to building:
              </Text>
            </Flex>
            <Link
              to={`/map?id=${feature.properties.building_id}&layer=building`}
            >
              <Flex
                className="rounded-full text-gray-200"
                align={"center"}
                px={"2"}
                py={"1"}
                gap={"1"}
                style={{
                  backgroundColor: layers.building.bg_color,
                }}
              >
                <Text size={"2"} weight={"bold"} className="font-mono">
                  # {feature.properties.building_id}
                </Text>
                <ArrowRightIcon />
              </Flex>
            </Link>
          </Flex>
        </Card>
      )}
      {feature.properties.parcel_id && (
        <Card style={{ backgroundColor: layers.parcel.bg_color }}>
          <Flex
            align={"center"}
            justify={"between"}
            className="dark:text-slate-700"
          >
            <Flex align={"center"} gap={"3"} className="dark:text-slate-100">
              {icons.parcel}
              <Text size="2" weight={"medium"}>
                Linked to parcel:
              </Text>
            </Flex>
            <Link to={`/map?id=${feature.properties.parcel_id}&layer=parcel`}>
              <Flex
                className="rounded-full text-gray-800"
                align={"center"}
                px={"2"}
                py={"1"}
                gap={"1"}
                style={{
                  backgroundColor: layers.parcel.bg_color,
                }}
              >
                <Text size={"2"} weight={"bold"} className="font-mono">
                  {feature.properties.parcel_id}
                </Text>
                <ArrowRightIcon />
              </Flex>
            </Link>
          </Flex>
        </Card>
      )}
      {feature.properties.street_id && (
        <Card style={{ backgroundColor: layers.street.bg_color }}>
          <Flex
            align={"center"}
            justify={"between"}
            className="dark:text-slate-700"
          >
            <Flex align={"center"} gap={"3"} className="dark:text-slate-100">
              {icons.street}
              <Text size="2" weight={"medium"}>
                Linked to street:
              </Text>
            </Flex>
            <Link to={`/map?id=${feature.properties.street_id}&layer=street`}>
              <Flex
                className="rounded-full text-gray-200"
                align={"center"}
                px={"2"}
                py={"1"}
                gap={"1"}
                style={{
                  backgroundColor: layers.street.bg_color,
                }}
              >
                <Text size={"2"} weight={"bold"} className="font-mono">
                  {feature.properties.street_id}
                </Text>
                <ArrowRightIcon />
              </Flex>
            </Link>
          </Flex>
        </Card>
      )}
    </>
  );
};

export default AddressLinks;
