import { Switch, Text, Flex, RadioCards } from "@radix-ui/themes";
import React from "react";
export const InputChoice = ({ setOptions, options }) => {
  return (
    <RadioCards.Root
      value={options.mode === "manual" ? "manual" : "upload"}
      onValueChange={(value) => {
        setOptions((prev) => ({ ...prev, mode: value }));
      }}
      gap={"1"}
      size={"1"}
    >
      <RadioCards.Item value="manual">manual</RadioCards.Item>
      <RadioCards.Item value="upload">upload file</RadioCards.Item>
    </RadioCards.Root>
  );
};
