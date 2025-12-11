import { LayersIcon } from "@radix-ui/react-icons";
import { Select } from "@radix-ui/themes";
import React from "react";
import MapControl from "./MapControl";

const BasemapSelector = ({ style, setStyle }) => {
  const allStyles = ["streets", "satellite", "linen"];

  return (
    <MapControl
      icon={<LayersIcon width="18" height="18" />}
      title="Basemap"
    >
      <Select.Root
        value={style}
        onValueChange={(value) => setStyle(value)}
        size="1"
      >
        <Select.Trigger />
        <Select.Content>
          {allStyles.map((s) => (
            <Select.Item key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </MapControl>
  );
};

export default BasemapSelector;
