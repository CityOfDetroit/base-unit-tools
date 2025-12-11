import { SegmentedControl, Select } from "@radix-ui/themes";
import { CursorArrowIcon } from "@radix-ui/react-icons";
import MapControl from "./MapControl";

const modeOptions = [
  { value: "all", label: "All" },
  { value: "parcel", label: "Parcel" },
  { value: "building", label: "Building" },
  { value: "street", label: "Street" },
];

const ModeSelector = ({ mode, setMode }) => {
  return (
    <MapControl
      icon={<CursorArrowIcon width="15" height="15" />}
      title="Select Mode"
    >
      {/* Mobile: Select dropdown */}
      <div className="block sm:hidden">
        <Select.Root value={mode} onValueChange={setMode} size="1">
          <Select.Trigger />
          <Select.Content>
            {modeOptions.map((opt) => (
              <Select.Item key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>

      {/* Desktop: Segmented control */}
      <div className="hidden sm:block">
        <SegmentedControl.Root value={mode} onValueChange={setMode} size="1">
          {modeOptions.map((opt) => (
            <SegmentedControl.Item key={opt.value} value={opt.value}>
              {opt.label}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
      </div>
    </MapControl>
  );
};

export default ModeSelector;
