import React from "react";
import { Flex, Text, RadioCards } from "@radix-ui/themes";
import layers from "../data/layers";

const LayerSwitcher = ({ layer, setLayer }) => {
  return (
    <Flex gap={"2"} gridArea="controls" align={"center"} p="2">
    <RadioCards.Root
      defaultValue="parcel"
      value={layer}
      onValueChange={(value) => setLayer(value)}
      columns={{ initial: "4" }}
      gap={"1"}
      size={"3"}
    >
      {Object.entries(layers).map(([key, lyr]) => {
        return (
          <RadioCards.Item
            key={key}
            value={key}
            style={{
              backgroundColor: lyr.bg_color,
              textColor: lyr.text_color,
              fontWeight: key === layer ? "bold" : "normal",
              height: "20px",
            }}
          >
            <Text>{key}</Text>
          </RadioCards.Item>
        );
      })}
    </RadioCards.Root>
  </Flex>
  );
}

export default LayerSwitcher;