import { CalendarIcon } from "@radix-ui/react-icons";
import { Select, Text } from "@radix-ui/themes";
import React from "react";
import MapControl from "./MapControl";

const formatDate = (d) =>
  new Date(`${d}T00:00`).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

// captureDates: Nearmap capture dates at the map center, newest first.
// until: the picked date (city staff only), or null for the latest imagery.
const ImageryDateSelector = ({ captureDates, until, setUntil, canPick }) => {
  const shownDate = captureDates.find((d) => !until || d <= until);

  return (
    <MapControl icon={<CalendarIcon width="18" height="18" />} title="Imagery date">
      {canPick ? (
        <Select.Root
          size="1"
          value={until ? shownDate : "latest"}
          onValueChange={(v) => setUntil(v === "latest" ? null : v)}
        >
          <Select.Trigger placeholder="None on or before this date" />
          <Select.Content>
            <Select.Item value="latest">Latest ({formatDate(captureDates[0])})</Select.Item>
            <Select.Separator />
            {captureDates.map((d) => (
              <Select.Item key={d} value={d}>{formatDate(d)}</Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      ) : (
        <Text size="2">{formatDate(shownDate)}</Text>
      )}
    </MapControl>
  );
};

export default ImageryDateSelector;
