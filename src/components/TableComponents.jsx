import { DataList, Flex, Text, Separator, Box, Button } from "@radix-ui/themes";
import * as Collapsible from "@radix-ui/react-collapsible";
import React, { useState } from "react";
import { CaretDownIcon, CaretRightIcon } from "@radix-ui/react-icons";

export const Attribute = ({ label, value, odd }) => {
  return (
    <DataList.Item align={"center"} className="py-px">
      <DataList.Label className="font-normal text-xs text-gray-500">
        {label}
      </DataList.Label>
      <DataList.Value>
        <Text
          size={"2"}
          weight={"normal"}
          className="dark:text-slate-100 text-gray-700"
        >
          {value}
        </Text>
      </DataList.Value>
    </DataList.Item>
  );
};

export const Category = ({ label, startOpen = true, children = [] }) => {
  let [open, setOpen] = useState(startOpen);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className="w-full">
      <Flex direction="column" gap="0">
        <Collapsible.Trigger as={Button}>
          <Flex className="w-full" align={"center"} justify={"between"}>
            <Text
              size={"2"}
              weight={"bold"}
              className="dark:text-slate-300 text-gray-500"
            >
              {label}
            </Text>
            {open ? <CaretDownIcon /> : <CaretRightIcon />}
          </Flex>
        </Collapsible.Trigger>
        <Separator size="4" mb={"1"} />

        <Collapsible.Content>
          <DataList.Root size={"1"}>{children}</DataList.Root>
        </Collapsible.Content>
      </Flex>
    </Collapsible.Root>
  );
};
