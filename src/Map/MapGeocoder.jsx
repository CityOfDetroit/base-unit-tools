import React, { useState } from "react";
import { Flex, Text, Inset, TextField } from "@radix-ui/themes";
import { DataSource } from "../components/CardLink";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { geocoderUrl } from "../hooks/useGeocoder";

const MapGeocoder = ({
  geocodeRefetch,
  geocodeError
}) => {
  const [geocodeValue, setGeocodeValue] = useState("");

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      geocodeRefetch(geocodeValue);
    }
  };

  return (
    <Flex direction="column" gap={"2"} className="sm:min-w-64">
      <Flex align={"center"} gap={"2"}>
        <MagnifyingGlassIcon height="30" width="30" color="gray" />
        <TextField.Root
          placeholder="Search for an address or parcel ID"
          onChange={(e) => setGeocodeValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex items-center w-full w-lg"
        ></TextField.Root>
      </Flex>
      <Inset>
        <Flex align={"end"} justify={"between"} p={"1"}>
          {geocodeError ? (
            <Text className="text-red-800" size={"1"} weight={"bold"}>
              {geocodeError}
            </Text>
          ) : (
            <Text></Text>
          )}
          <DataSource
            url={
              geocoderUrl +
              `/findAddressCandidates?SingleLine=${geocodeValue}&outFields=*`
            }
          />
        </Flex>
      </Inset>
    </Flex>
  );
};

export default MapGeocoder;
