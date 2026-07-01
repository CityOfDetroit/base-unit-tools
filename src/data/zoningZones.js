// Detroit zoning district reference data — ported from the atlas-detroit
// `src/content/legends/zones.yaml` legend (key, group, name, color, textColor,
// description), with the `MKT` (Market & Distribution) district added since the
// districts service publishes it but the source YAML omitted it.
//
// This drives the Atlas "zoning" theme end to end: the per-district map colors,
// the grouped legend, the zone-explorer panel, and the click popups.
//
// Matching: the map fill is colored from the vector tile's `ZONING_REV`
// attribute, which carries the district designation (R1, B4, SD4, MKT, ...).
// The districts *view* exposes the same value as `zoning_designation`.

export const ZONING_MATCH_PROPERTY = "ZONING_REV"; // vector tile attribute
export const ZONING_VIEW_FIELD = "zoning_designation"; // districts view attribute

// Display order of the district groups.
export const ZONING_GROUP_ORDER = [
  "Residential",
  "Business",
  "Industrial",
  "Special Purpose",
];

export const ZONING_ZONES = [
  // Residential
  { key: "R1", group: "Residential", name: "Single-Family Residential District", color: "#FCF3CF", textColor: "#222", description: "This district is designed to protect and preserve quiet, low-density residential areas with single-family detached dwellings." },
  { key: "R2", group: "Residential", name: "Two-Family Residential District", color: "#F9E79F", textColor: "#222", description: "The district is designed to protect and enhance areas developed with single- or two-family dwellings." },
  { key: "R3", group: "Residential", name: "Low Density Residential District", color: "#F4D03F", textColor: "#222", description: "This district is designed as a low-density multi-family district for town houses, courts, and garden apartments." },
  { key: "R4", group: "Residential", name: "Thoroughfare Residential District", color: "#F1C40F", textColor: "#222", description: "This district is designed for low-medium density residential dwellings on major or secondary thoroughfares." },
  { key: "R5", group: "Residential", name: "Medium Density Residential District", color: "#D4AC0D", textColor: "#222", description: "This district provides for a range of residential development from single-family to medium-density multiple-family dwellings." },
  { key: "R6", group: "Residential", name: "High Density Residential District", color: "#B7950B", textColor: "#222", description: "The district is designed as a high-density multiple-dwellings district adjacent to major centers." },

  // Business
  { key: "B1", group: "Business", name: "Restricted Business District", color: "#F1948A", textColor: "#222", description: "The B1 District is designed to provide an adequately controlled transition in land use from residential to business and commercial uses." },
  { key: "B2", group: "Business", name: "Local Business and Residential District", color: "#EC7063", textColor: "#222", description: "The B2 Local Business and Residential District provides for the day-to-day consumer goods and services required to serve a small residential area." },
  { key: "B3", group: "Business", name: "Shopping District", color: "#E74C3C", textColor: "#222", description: "The B3 Shopping District provides for a range of convenience and comparison shopping goods stores." },
  { key: "B4", group: "Business", name: "General Business District", color: "#A93226", textColor: "#DDD", description: "The B4 General Business District provides for business and commercial uses of a thoroughfare-oriented nature." },
  { key: "B5", group: "Business", name: "Major Business District", color: "#922B21", textColor: "#DDD", description: "This district is designed to provide adequate regulations within the Central business district and the New Center Area." },
  { key: "B6", group: "Business", name: "General Services District", color: "#7B241C", textColor: "#DDD", description: "This district provides for wholesaling, transport, food services, and similar activities essential to the commerce and health of the City." },

  // Industrial
  { key: "M1", group: "Industrial", name: "Limited Industrial District", color: "#EBDEF0", textColor: "#222", description: "This district is used primarily along major and secondary thoroughfares in blocks which contain older, vacant structures or mixed land uses." },
  { key: "M2", group: "Industrial", name: "Restricted Industrial District", color: "#C39BD3", textColor: "#222", description: "This district is designed for a wide range of industrial and related uses which can function with a minimum of undesirable effects." },
  { key: "M3", group: "Industrial", name: "General Industrial District", color: "#9B59B6", textColor: "#222", description: "This district is composed of property so situated as to be suitable for industrial development." },
  { key: "M4", group: "Industrial", name: "Intensive Industrial District", color: "#7D3C98", textColor: "#DDD", description: "This district will permit uses which are usually objectionable and is rarely located adjacent to residential districts." },
  { key: "M5", group: "Industrial", name: "Special Industrial District", color: "#4A235A", textColor: "#DDD", description: "This district is composed primarily of property located deep within other industrial districts for intensive uses." },

  // Special Purpose
  { key: "P1", group: "Special Purpose", name: "Open Parking District", color: "#CCD1D1", textColor: "#222", description: "This district is designed for off-street parking of private passenger vehicles." },
  { key: "PC", group: "Special Purpose", name: "Public Center District", color: "#884EA0", textColor: "#DDD", description: "This district includes areas used for governmental, recreational, and cultural purposes of civic importance." },
  { key: "PCA", group: "Special Purpose", name: "Restricted Central Business District", color: "#2471A3", textColor: "#DDD", description: "The Public Center Adjacent District includes property in close proximity to the Public Center District." },
  { key: "PD", group: "Special Purpose", name: "Planned Development District", color: "#3498DB", textColor: "#222", description: "This district will permit planned developments throughout the City, particularly useful in urban renewal areas." },
  { key: "PR", group: "Special Purpose", name: "Parks and Recreation", color: "#1E8449", textColor: "#DDD", description: "The intent is to retain publicly owned lands in excess of four acres for recreational uses or open space." },
  { key: "SD1", group: "Special Purpose", name: "Special Development District - Small Scale, Mixed Use", color: "#D4E6F1", textColor: "#222", description: "This district encourages a complementary mixture of small-scale, pedestrian- and transit-oriented uses." },
  { key: "SD2", group: "Special Purpose", name: "Special Development District - Mixed Use", color: "#7FB3D5", textColor: "#222", description: "This district encourages more intensive pedestrian- and transit-oriented uses for neighborhood centers." },
  { key: "SD3", group: "Special Purpose", name: "Special Development District - Technology & Research", color: "#D7BDE2", textColor: "#222", description: "The SD3 District is designed for research facility development in a campus-like setting." },
  { key: "SD4", group: "Special Purpose", name: "Special Development District - Riverfront Mixed Use", color: "#45B39D", textColor: "#222", description: "The SD4 District is intended for high intensity residential and commercial mixed-use development on the Riverfront." },
  { key: "SD5", group: "Special Purpose", name: "Special Development District - Casinos", color: "#ff8f00", textColor: "#222", description: "The SD5 District facilitates the location of licensed casinos and casino complexes." },
  { key: "TM", group: "Special Purpose", name: "Transitional - Industrial", color: "#A2D9CE", textColor: "#222", description: "This district covers areas with mixed uses transitioning to industrial uses." },
  { key: "W1", group: "Special Purpose", name: "Waterfront - Industrial", color: "#82E0AA", textColor: "#222", description: "This district provides for water-oriented uses on limited waterfront property." },
  { key: "MKT", group: "Special Purpose", name: "Market and Distribution District", color: "#E59866", textColor: "#222", description: "The MKT District provides for market, wholesale, and distribution activities, such as those in and around Eastern Market." },
];

export const ZONING_ZONES_BY_KEY = Object.fromEntries(
  ZONING_ZONES.map((z) => [z.key, z])
);

// Zones grouped for the explorer panel, in ZONING_GROUP_ORDER.
export const ZONING_GROUPS = ZONING_GROUP_ORDER.map((group) => ({
  group,
  zones: ZONING_ZONES.filter((z) => z.group === group),
}));

// MapLibre data-driven fill color: one color per district designation, matched
// on the vector tile's ZONING_REV value. Built from ZONING_ZONES so it never
// drifts from the legend/popups.
export const zoningFillColorExpression = () => [
  "match",
  ["to-string", ["coalesce", ["get", ZONING_MATCH_PROPERTY], ""]],
  ...ZONING_ZONES.flatMap((z) => [z.key, z.color]),
  "#d9d9d9", // unclassified / unknown designation
];

const escapeHtml = (v) =>
  String(v ?? "").replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
  );

// Rich click popup: designation + group + full district name + description,
// looked up from the curated zone data (falling back to the view's own fields).
export const renderZoningPopup = (attrs) => {
  const key = attrs?.[ZONING_VIEW_FIELD] ?? "";
  const zone = ZONING_ZONES_BY_KEY[key];
  const name = zone?.name || attrs?.zoning_description || "";
  const group = zone?.group || "";
  const description = zone?.description || attrs?.zoning_description || "";
  const swatch = zone?.color || "#d9d9d9";

  if (!key && !name) {
    return `<div style="font-size:12px;color:#6b7280">No zoning district here</div>`;
  }

  return `
    <div style="font-size:12px;line-height:1.45;max-width:260px">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
        <span style="width:13px;height:13px;border-radius:2px;background:${swatch};border:1px solid rgba(0,0,0,.25);flex-shrink:0"></span>
        <span style="font-weight:700">${escapeHtml(key)}</span>
        ${group ? `<span style="color:#6b7280">· ${escapeHtml(group)}</span>` : ""}
      </div>
      ${name ? `<div style="font-weight:600;margin-bottom:3px">${escapeHtml(name)}</div>` : ""}
      ${description ? `<div style="color:#374151">${escapeHtml(description)}</div>` : ""}
    </div>`;
};

export default ZONING_ZONES;
