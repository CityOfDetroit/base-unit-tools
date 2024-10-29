import { TransparencyGridIcon } from "@radix-ui/react-icons";
import { Flex, Select, Text } from "@radix-ui/themes";
import React from "react";

const BasemapSelector = ({ style, setStyle }) => {

  let allStyles = ["streets", "satellite", "linen"];

  return (
    <Flex direction="row" gap={"4"} align={"center"} justify="around">
      <Text size={"2"} color="gray">Select basemap</Text>
      <Select.Root
        value={style}
        onValueChange={(value) => setStyle(value)}
        size={"1"}
      >
        <Select.Trigger />
        <Select.Content>
          {allStyles.map((s) => (
            <Select.Item key={s} value={s}>
              {s}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Flex>
  )
}

export default BasemapSelector;