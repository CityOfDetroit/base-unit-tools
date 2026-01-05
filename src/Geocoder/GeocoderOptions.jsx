import { geocoderFields, fieldGroups } from "../data/geocoderFields";
import {
  Text,
  Button,
  Card,
  Flex,
  Checkbox,
  Tooltip,
} from "@radix-ui/themes";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon, InfoCircledIcon } from "@radix-ui/react-icons";

// Derive grouped fields from geocoderFields using their group property
const groupedFields = Object.keys(fieldGroups).reduce((acc, groupKey) => {
  acc[groupKey] = {
    label: fieldGroups[groupKey].label,
    fields: geocoderFields.filter((f) => f.group === groupKey),
  };
  return acc;
}, {});

const presets = [
  {
    id: "basic",
    label: "Basic",
    description: "Coordinates and IDs only",
    apply: (options, setOptions) => {
      const newOpts = { ...options, coords: true, ids: true, related_parcel: false };
      geocoderFields.forEach((f) => (newOpts[f.name] = false));
      setOptions(newOpts);
    },
  },
  {
    id: "all",
    label: "All Boundaries",
    description: "Include all available data",
    apply: (options, setOptions) => {
      const newOpts = { ...options, coords: true, ids: true, related_parcel: true };
      geocoderFields.forEach((f) => (newOpts[f.name] = true));
      setOptions(newOpts);
    },
  },
  {
    id: "census",
    label: "Census Only",
    description: "Census geography fields",
    apply: (options, setOptions) => {
      const newOpts = { ...options, coords: true, ids: true, related_parcel: false };
      geocoderFields.forEach((f) => {
        newOpts[f.name] = f.group === "census";
      });
      setOptions(newOpts);
    },
  },
  {
    id: "clear",
    label: "Clear All",
    description: "Reset to minimum",
    apply: (options, setOptions) => {
      const newOpts = { ...options, coords: false, ids: false, related_parcel: false };
      geocoderFields.forEach((f) => (newOpts[f.name] = false));
      setOptions(newOpts);
    },
  },
];

const GeocoderOptions = ({ options, setOptions }) => {
  return (
    <Flex direction="column" gap="3">
      {/* Presets */}
      <Card>
        <Flex direction="column" gap="2">
          <Text weight="bold" size="3">
            Quick Presets
          </Text>
          <Flex gap="2" wrap="wrap">
            {presets.map((preset) => (
              <Tooltip key={preset.id} content={preset.description}>
                <Button
                  variant="soft"
                  size="1"
                  onClick={() => preset.apply(options, setOptions)}
                >
                  {preset.label}
                </Button>
              </Tooltip>
            ))}
          </Flex>
        </Flex>
      </Card>

      {/* Basic Fields */}
      <Card>
        <Text weight="bold" size="3" className="mb-2">
          Basic Fields
        </Text>
        <Flex direction="column" gap="2" className="mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              size="1"
              checked={options.coords}
              onCheckedChange={() =>
                setOptions({ ...options, coords: !options.coords })
              }
            />
            <Text size="2">Coordinates (Lat/Lng)</Text>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              size="1"
              checked={options.ids}
              onCheckedChange={() =>
                setOptions({ ...options, ids: !options.ids })
              }
            />
            <Text size="2">Base Unit IDs</Text>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              size="1"
              checked={options.related_parcel}
              onCheckedChange={() =>
                setOptions({ ...options, related_parcel: !options.related_parcel })
              }
            />
            <Text size="2">Related Parcel</Text>
          </label>
        </Flex>
      </Card>

      {/* Boundary Groups - Accordion */}
      <Card className="p-0 overflow-hidden">
        <Accordion.Root type="multiple" defaultValue={Object.keys(groupedFields)}>
          {Object.entries(groupedFields).map(([groupKey, group]) => (
            <Accordion.Item
              key={groupKey}
              value={groupKey}
              className="border-b border-gray-200 last:border-b-0"
            >
              <Accordion.Header>
                <Accordion.Trigger className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 transition-colors group">
                  <Text size="2" weight="medium">
                    {group.label}
                  </Text>
                  <ChevronDownIcon
                    className="text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180"
                    width="16"
                    height="16"
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-3 pb-3 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
                <Flex direction="column" gap="2">
                  {group.fields.map((field) => (
                    <label
                      key={field.name}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox
                        size="1"
                        checked={options[field.name]}
                        onCheckedChange={() =>
                          setOptions({
                            ...options,
                            [field.name]: !options[field.name],
                          })
                        }
                      />
                      <Text size="2">{field.display}</Text>
                      {field.description && (
                        <Tooltip content={field.description}>
                          <InfoCircledIcon
                            width="12"
                            height="12"
                            className="text-gray-400 cursor-help"
                          />
                        </Tooltip>
                      )}
                    </label>
                  ))}
                </Flex>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </Card>
    </Flex>
  );
};

export default GeocoderOptions;
