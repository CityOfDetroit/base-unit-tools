import { SegmentedControl } from "@radix-ui/themes";
import { CursorArrowIcon } from "@radix-ui/react-icons";
import MapControl from "./MapControl";

const ModeSelector = ({ mode, setMode }) => {
  return (
    <MapControl
      icon={<CursorArrowIcon width="15" height="15" />}
      title="Select Mode"
    >
      <SegmentedControl.Root value={mode} onValueChange={setMode} size="1">
        <SegmentedControl.Item value="all">All</SegmentedControl.Item>
        <SegmentedControl.Item value="parcel">Parcel</SegmentedControl.Item>
        <SegmentedControl.Item value="building">Building</SegmentedControl.Item>
        <SegmentedControl.Item value="street">Street</SegmentedControl.Item>
      </SegmentedControl.Root>
    </MapControl>
  );
};

export default ModeSelector;
