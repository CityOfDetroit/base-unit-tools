import { Text, TextArea } from "@radix-ui/themes";
import React, { useEffect, useMemo, useState } from "react";

export const TextInput = ({ setAddresses }) => {
  // we store the user input in value
  let [value, setValue] = useState("");

  const addresses = useMemo(() => value.split("\n").filter((a) => a !== ""));

  useEffect(() => {
    setAddresses(addresses);
  }, [value]);

  return (
    <>
      <Text weight="medium">Type one address per line</Text>
      <TextArea
        value={value}
        rows={8}
        type="text"
        onChange={(e) => setValue(e.target.value)} />
    </>
  );
};
