import { Flex, Text, TextArea } from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";

export const TextInput = ({ setAddresses }) => {
  const [value, setValue] = useState("");

  const addresses = useMemo(
    () => value.split("\n").filter((a) => a.trim() !== ""),
    [value]
  );

  const lineCount = value.split("\n").length;
  const charCount = value.length;

  useEffect(() => {
    setAddresses(addresses);
  }, [value, addresses, setAddresses]);

  return (
    <Flex direction="column" gap="2">
      <Text size="2" weight="medium">
        Type or paste addresses
      </Text>
      <Text size="1" color="gray">
        One address per line
      </Text>
      <TextArea
        value={value}
        rows={8}
        placeholder={"2 Woodward\n1301 3rd St"}
        onChange={(e) => setValue(e.target.value)}
        className="font-mono text-sm"
      />
      <Flex justify="between" align="center" className="px-1">
        <Text size="1" color="gray">
          {charCount.toLocaleString()} characters
        </Text>
        <Flex gap="3">
          <Text size="1" color="gray">
            {lineCount} {lineCount === 1 ? "line" : "lines"}
          </Text>
          {addresses.length > 0 && (
            <Text size="1" weight="medium" style={{ color: "#279989" }}>
              {addresses.length} {addresses.length === 1 ? "address" : "addresses"}
            </Text>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
