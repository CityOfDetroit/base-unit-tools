import { Flex, Text } from "@radix-ui/themes";
import React from "react";
import CSVReader from "react-csv-reader";

export const CsvInput = ({ csv, setCsv, addresses, setAddresses }) => {
  return (
    <Flex direction="column" gap="4">
      <Flex direction="column" gap="2">

        <Text weight="medium">Upload file </Text>
        <CSVReader
          parserOptions={{ header: true }}
          onFileLoaded={(data, fileInfo) => setCsv(data)} 
          />
      </Flex>
      {csv && (
        <Flex direction="column">
          <Text weight="medium">Choose address column</Text>
          <select
            onChange={(e) => {
              setAddresses(csv.map((r) => r[e.target.value]));
            }}
          >
            <option value={`-`}>{`-`}</option>
            {Object.keys(csv[0]).map((d, i) => (
              <option value={d} key={d}>
                {d}
              </option>
            ))}
          </select>
        </Flex>
      )}
      {addresses.length > 0 && (
        <Flex direction="column">
          <Text weight="medium">Example addresses</Text>
          <Text size={"1"}>{addresses.slice(0, 3).join("; ")}</Text>
        </Flex>
      )}
    </Flex>
  );
};