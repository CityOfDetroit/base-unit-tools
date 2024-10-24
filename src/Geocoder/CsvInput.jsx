import { Flex, Text, Select } from "@radix-ui/themes";
import React from "react";
import CSVReader from "react-csv-reader";
import _ from "underscore";

export const CsvInput = ({ csv, setCsv, addresses, setAddresses }) => {
  return (
    <Flex direction="column" gap="4">
      <Flex direction="column" gap="2">

        <Text weight="medium">Upload .csv</Text>
        <CSVReader
          cssClass="text-xs"
          parserOptions={{ header: true }}
          onFileLoaded={(data, fileInfo) => setCsv(data)} 
          />
      </Flex>
      {csv && (
        <Flex direction="column">
          <Text weight="medium">.csv address column:</Text>
          <Select.Root
            onValueChange={(e) => {
              setAddresses(csv.map((r) => r[e]));
            }}
          >
            	<Select.Trigger />

            <Select.Content>

            {Object.keys(csv[0]).map((d, i) => (
              <Select.Item value={d} key={d}>
                {d}
              </Select.Item>
            ))}
            </Select.Content>
          </Select.Root>
        </Flex>
      )}
      {addresses.length > 0 && (
        <Flex direction="column">
          <Text weight="medium">Sample values</Text>
          <ul className="list-disc list-inside">
            {addresses.length > 0 && _.sample(addresses, 3).map(addr=> (
              <li className="p-0 m-0">
                <Text size={"1"}>{addr}</Text>
              </li>
              )
            )}
          </ul>
        </Flex>
      )}
    </Flex>
  );
};