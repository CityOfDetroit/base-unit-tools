import * as Tooltip from "@radix-ui/react-tooltip";
import { geocoderFields } from "../data/geocoderFields";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import {
  Text,
  Button,
  Card,
  Flex,
  CheckboxGroup,
  Checkbox,
} from "@radix-ui/themes";

const GeocoderOptions = ({ options, setOptions }) => {
  return (
    <>
      <Card>
        <Text weight={"bold"}>Attach fields</Text>
        <Flex gap="4" pt={"1"}>
          <Text as="label" size="2">
            <Flex as="span" gap="2">
              <Checkbox
                size="1"
                defaultChecked
                onCheckedChange={() =>
                  setOptions({ ...options, coords: !options.coords })
                }
              />{" "}
              Coordinates (Lat/Lng)
            </Flex>
          </Text>
          <Text as="label" size="2">
            <Flex as="span" gap="2">
              <Checkbox
                size="1"
                defaultChecked
                onCheckedChange={() => setOptions({ ...options, ids: !options.ids })}
              />{" "}
              Base Unit IDs
            </Flex>
          </Text>
        </Flex>
      </Card>

      <Card>
        <Flex items="center" justify={"between"} pb={"2"}>
          <Text weight={"bold"}>Attach boundaries</Text>
          <div className="flex items-center gap-1">
            {[true, false].map((b) => (
              <Button
                size={"1"}
                onClick={() => {
                  let newOpts = {};
                  geocoderFields.forEach((field) => {
                    newOpts[field.name] = b;
                  });
                  setOptions({ ...options, ...newOpts });
                }}
              >
                <Text>{b ? "All" : "None"}</Text>
              </Button>
            ))}
          </div>
        </Flex>
        <CheckboxGroup.Root
          onValueChange={(value) => {
            let newOpts = {};

            geocoderFields.forEach((f) => {
              newOpts[f.name] = false;
              if (value.includes(f.name)) {
                newOpts[f.name] = true;
              }
            });
            setOptions({ ...options, ...newOpts });
          }}
        >
          {geocoderFields.map((field) => (
            <CheckboxGroup.Item
              className="checkbox-option flex items-center gap-1"
              key={field.name}
              value={field.name}
            >
              {field.display}
            </CheckboxGroup.Item>
          ))}
        </CheckboxGroup.Root>
      </Card>
    </>
  );
};

export default GeocoderOptions;
