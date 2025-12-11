import React, { useState } from "react";
import { Flex, Text, TextField } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { geocoderUrl } from "../hooks/useGeocoder";
import MapControl from "./MapControl";

const MapGeocoder = ({
  geocodeRefetch,
  geocodeError,
  refetch
}) => {
  const [geocodeValue, setGeocodeValue] = useState("");

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {

      let parcelRegex = /^([0,1,2][0-9])([0-9]{6,})([0-9A-Z\.\-]{1,})$/;

      if (parcelRegex.test(geocodeValue)) {
        refetch(
          geocodeValue,
          "parcel",
        )
      }

      else {
        geocodeRefetch(geocodeValue);
      }


    }
  };

  return (
    <MapControl
      icon={<MagnifyingGlassIcon width="18" height="18" />}
      title="Search"
      large
      sourceUrl={geocoderUrl}
    >
      <TextField.Root
        placeholder="Address or parcel ID"
        onChange={(e) => setGeocodeValue(e.target.value)}
        onKeyDown={handleKeyDown}
        size="2"
        className="w-full"
      />
      {geocodeError && (
        <Text className="text-red-800" size="1" weight="bold">
          {geocodeError}
        </Text>
      )}
    </MapControl>
  );
};

export default MapGeocoder;
