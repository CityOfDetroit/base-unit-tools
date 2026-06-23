import { Select, Text, TextArea, TextField } from "@radix-ui/themes";
import Combobox from "./Combobox";

// sentinel for the "no value" option (Radix Select items can't be empty strings)
const NONE = "__none__";

// Renders a single amendment field (label + appropriate input).
// `field` is an entry from ZONING_FIELDS.
const FieldInput = ({ field, value, onChange }) => {
  const v = value ?? "";

  let control;
  if (field.type === "textarea") {
    control = (
      <TextArea
        value={v}
        onChange={(e) => onChange(field.name, e.target.value)}
        rows={6}
      />
    );
  } else if (field.type === "select") {
    control = (
      <Select.Root
        value={v || NONE}
        onValueChange={(val) => onChange(field.name, val === NONE ? "" : val)}
      >
        <Select.Trigger className="w-full" placeholder="—" />
        <Select.Content>
          <Select.Item value={NONE}>—</Select.Item>
          {field.options.map((o) => (
            <Select.Item key={o} value={o}>
              {o}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    );
  } else if (field.type === "combobox") {
    control = (
      <Combobox
        value={v}
        options={field.options}
        onChange={(val) => onChange(field.name, val)}
      />
    );
  } else {
    control = (
      <TextField.Root
        type={field.type === "date" ? "date" : "text"}
        value={v}
        onChange={(e) => onChange(field.name, e.target.value)}
      />
    );
  }

  return (
    <label>
      <Text as="div" size="1" weight="medium" color="gray" mb="1">
        {field.label}
      </Text>
      {control}
    </label>
  );
};

export default FieldInput;
