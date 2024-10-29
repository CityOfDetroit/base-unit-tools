import React from "react";
import { Flex, Text, Inset, Switch } from "@radix-ui/themes";
import { DataSource } from "../components/CardLink";
import { CameraIcon } from "@radix-ui/react-icons";

const MapillarySwitch = ({ streetview, setStreetview }) => {
  return (
    <Flex direction="column" gap={"2"} className="">
      <Flex align={"center"} gap={"2"} justify={"between"} pb="1">
        <Flex align={"center"} gap={"2"}>
          <CameraIcon height="20" width="20" color="gray" />
          <Text color="gray" size={"2"}>
            Street view
          </Text>
        </Flex>
        <Switch
          size={1}
          checked={streetview}
          radius="large"
          onCheckedChange={setStreetview}
        />
      </Flex>
    </Flex>
  );
};

export default MapillarySwitch;
