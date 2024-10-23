import React from "react";
import { Flex, Text, Inset, Switch } from "@radix-ui/themes";
import { DataSource } from "../components/CardLink";
import { CameraIcon } from "@radix-ui/react-icons";

const MapillarySwitch = ({ streetview, setStreetview }) => {
  return (
    <Flex direction="column" gap={"2"} className="">
      <Flex align={"center"} gap={"2"} justify={"between"}>
        <Flex align={"center"} gap={"2"}>
          <CameraIcon height="30" width="30" color="gray" />
          <Text color="gray" size={"2"}>
            Street view
          </Text>
        </Flex>
        <Switch
          size={2}
          checked={streetview}
          radius="large"
          onCheckedChange={setStreetview}
        />
      </Flex>
      <Inset>
        <Flex align={"end"} justify={"between"} p={"1"}>
          <div></div>
          <DataSource url="https://www.mapillary.com/developer/api-documentation/#retrieve-images" />
        </Flex>
      </Inset>
    </Flex>
  );
};

export default MapillarySwitch;
