import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Card, Flex, Text } from "@radix-ui/themes";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import layers from "../data/layers";
import { icons } from "./FeatureTable";

const BuildingLinks = ({ layer, feature }) => {

  let [open, setOpen] = useState(false);

  return (
    <>
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
    </>
  );
};

export default BuildingLinks;
