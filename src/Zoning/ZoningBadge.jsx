import { Text } from "@radix-ui/themes";
import { ZONING_ZONES_BY_KEY } from "../data/zoningZones";

// Small colored chip showing a parcel's zoning designation (e.g. "R2"),
// colored to match the zoning-districts map overlay / legend. Renders nothing
// when the parcel has no zoning on record.
const ZoningBadge = ({ zoning }) => {
  if (!zoning) return null;
  const zone = ZONING_ZONES_BY_KEY[zoning];
  return (
    <Text
      size="1"
      title={zone ? `${zoning} — ${zone.name}` : zoning}
      style={{
        flexShrink: 0,
        backgroundColor: zone?.color || "#e5e7eb",
        color: zone?.textColor || "#222",
        border: "1px solid rgba(0,0,0,0.15)",
        borderRadius: 4,
        padding: "0 6px",
        lineHeight: "18px",
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {zoning}
    </Text>
  );
};

export default ZoningBadge;
