// Configuration for the Zoning Amendment editor app.
// Front-end editor for the cpc_zoning_application feature layer.

import { geojsonToArcGIS } from "@terraformer/arcgis";
import { ZONING_GROUP_ID } from "./groups";

export { ZONING_GROUP_ID };

// The feature layer we read from / write to.
export const ZONING_LAYER_URL =
  "https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/cpc_zoning_application/FeatureServer/0";

// The layer stores geometry in Web Mercator (102100 / 3857).
export const ZONING_LAYER_WKID = 102100;

// ArcGIS Online group that gates access to this tool — see ./groups (re-exported above).

export const PORTAL_URL = "https://detroitmi.maps.arcgis.com";

// The parcel layer we pull authoritative parcel geometry from.
// (matches layers.parcel in src/data/layers.js)
export const PARCEL_LAYER_URL =
  "https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/parcel_file_current/FeatureServer/0";
export const PARCEL_ID_FIELD = "parcel_id";

// Max length of the `parcels` string field on the layer.
export const PARCELS_FIELD_MAX = 3000;

// Detroit zoning classifications, offered as suggestions on the zoning fields.
export const ZONING_OPTIONS = [
  "R1", "R2", "R3", "R4", "R5", "R6",
  "B1", "B2", "B3", "B4", "B5", "B6",
  "M1", "M2", "M3", "M4", "M5",
  "SD1", "SD2", "SD4", "SD5",
  "P1", "PC", "PCA", "PD", "PR",
  "MKT", "TM", "W1",
];

// Planners an amendment can be assigned to (issue #7964 picklist).
export const ASSIGNED_TO_OPTIONS = [
  "Kimani Jeffrey",
  "Rory Bolger",
  "Eric Fazzini",
  "Christopher Gulock",
  "Jamie Murphy",
  "Timarie DeBruhl",
];

// Editable attribute fields, in display order, with input types.
// type: "text" | "textarea" | "date" | "select" | "combobox"
export const ZONING_FIELDS = [
  { name: "file_number", label: "File number", type: "text" },
  { name: "petition_number", label: "Petition number", type: "text" },
  {
    name: "application_type",
    label: "Application type",
    type: "select",
    options: ["Rezoning", "PD / PC / PCA Zoning Change"],
    required: true,
  },
  { name: "application_description", label: "Description", type: "textarea" },
  { name: "received_date", label: "Received date", type: "date" },
  { name: "check_number", label: "Check number", type: "text" },
  {
    name: "assigned_to",
    label: "Assigned to",
    type: "select",
    options: ASSIGNED_TO_OPTIONS,
  },
  {
    name: "current_zoning",
    label: "Current zoning",
    type: "combobox",
    options: ZONING_OPTIONS,
  },
  {
    name: "proposed_zoning",
    label: "Proposed zoning",
    type: "combobox",
    options: ZONING_OPTIONS,
  },
  {
    name: "cpc_staff_proposed_zoning",
    label: "CPC staff proposed zoning",
    type: "combobox",
    options: ZONING_OPTIONS,
  },
  {
    name: "cpc_staff_recommendation",
    label: "CPC staff recommendation",
    type: "select",
    options: ["Approve", "Deny"],
  },
  { name: "cpc_staff_report_date", label: "CPC staff report date", type: "date" },
  { name: "cpc_public_hearing_date", label: "CPC public hearing date", type: "date" },
  { name: "cpc_action_date", label: "CPC action date", type: "date" },
  {
    name: "cpc_action",
    label: "CPC action",
    type: "select",
    options: ["Approve", "Deny"],
  },
  { name: "cpc_refer_to_council_date", label: "CPC refer to council date", type: "date" },
  { name: "ped_public_hearing_date", label: "PED public hearing date", type: "date" },
  {
    name: "ped_recommendation",
    label: "PED recommendation",
    type: "select",
    options: ["Approve", "Deny"],
  },
  { name: "council_action_date", label: "Council action date", type: "date" },
  {
    name: "council_action",
    label: "Council action",
    type: "select",
    options: ["Approve", "Deny"],
  },
];

export const ZONING_DATE_FIELDS = ZONING_FIELDS.filter((f) => f.type === "date").map(
  (f) => f.name
);

export const FIELD_BY_NAME = Object.fromEntries(
  ZONING_FIELDS.map((f) => [f.name, f])
);

// Field names that must be filled before an amendment can be saved.
export const REQUIRED_FIELDS = ZONING_FIELDS.filter((f) => f.required).map(
  (f) => f.name
);

// Detail fields grouped by workflow stage (application_type & description are
// shown in the map block, so they're omitted here).
export const FIELD_GROUPS = [
  {
    // file_number is the record's title, edited from the header (see AmendmentView).
    title: "Intake",
    fields: ["petition_number", "received_date", "check_number", "assigned_to"],
  },
  {
    title: "Zoning",
    fields: ["current_zoning", "proposed_zoning", "cpc_staff_proposed_zoning"],
  },
  {
    title: "CPC review",
    fields: [
      "cpc_staff_recommendation",
      "cpc_staff_report_date",
      "cpc_public_hearing_date",
      "cpc_action_date",
      "cpc_action",
      "cpc_refer_to_council_date",
    ],
  },
  {
    title: "Planning & Development (PED)",
    fields: ["ped_public_hearing_date", "ped_recommendation"],
  },
  {
    title: "City Council",
    fields: ["council_action_date", "council_action"],
  },
];

// Editor-tracking fields (system-maintained, not editable). Used for the
// card list's "last edited" sort and the read-only provenance line.
export const EDITOR_FIELDS = {
  creator: "Creator",
  created: "CreationDate",
  editor: "Editor",
  edited: "EditDate",
};

// Fields fetched for the left-hand card list.
export const LIST_OUT_FIELDS = [
  "OBJECTID",
  "file_number",
  "application_type",
  "application_description",
  "current_zoning",
  "proposed_zoning",
  "assigned_to",
  "received_date",
  "cpc_public_hearing_date",
  "cpc_action",
  "council_action",
  "parcels",
  EDITOR_FIELDS.creator,
  EDITOR_FIELDS.created,
  EDITOR_FIELDS.editor,
  EDITOR_FIELDS.edited,
];

// Sort options offered above the card list.
export const SORT_OPTIONS = [
  { value: "file_number", label: "File number", kind: "string" },
  { value: "received_date", label: "Date received", kind: "date" },
  { value: EDITOR_FIELDS.edited, label: "Last edited", kind: "date" },
  { value: "assigned_to", label: "Assigned to", kind: "string" },
];

// Parse a pipe-delimited `parcels` value into an array of ids.
export const parseParcels = (parcels) =>
  parcels ? parcels.split("|").map((s) => s.trim()).filter(Boolean) : [];

// Number of parcels in a pipe-delimited `parcels` value.
export const countParcels = (parcels) => parseParcels(parcels).length;

// Link to a parcel on the Base Units map (opens in a new tab).
export const parcelMapUrl = (parcelId) =>
  `/map?layer=parcel&id=${encodeURIComponent(parcelId)}`;

// DateOnly value (epoch-ms or ISO string) -> "YYYY-MM-DD".
export const fmtDate = (v) => {
  if (v == null || v === "") return "";
  if (typeof v === "number") return new Date(v).toISOString().slice(0, 10);
  return String(v).slice(0, 10);
};

// Datetime value (epoch-ms) -> locale string, for EditDate/CreationDate.
export const fmtDateTime = (v) => {
  if (v == null || v === "") return "";
  const ms = typeof v === "number" ? v : Date.parse(v);
  if (Number.isNaN(ms)) return "";
  return new Date(ms).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Comparable sort key for a record value.
export const sortKey = (value, kind) => {
  if (value == null || value === "") return kind === "date" ? 0 : "";
  if (kind === "date") {
    return typeof value === "number" ? value : Date.parse(value) || 0;
  }
  return String(value).toLowerCase();
};

// Application-type prefixes for the derived unique id (issue #7964).
export const APPLICATION_TYPE_ID_PREFIX = {
  Rezoning: "R",
  "PD / PC / PCA Zoning Change": "P",
};

// Derived, display-only unique identifier for an amendment (issue #7964):
//   CPC-R-<year>-<OBJECTID>  rezonings
//   CPC-P-<year>-<OBJECTID>  PD / PC / PCA zoning changes
// Year prefers `application_year`, falling back to the received-date year.
// Returns "" when it can't be formed (no prefix, no year, or unsaved record).
export const deriveUniqueId = (rec) => {
  if (!rec) return "";
  const prefix = APPLICATION_TYPE_ID_PREFIX[rec.application_type];
  const year =
    rec.application_year ||
    (rec.received_date ? fmtDate(rec.received_date).slice(0, 4) : "");
  const oid = rec.OBJECTID;
  if (!prefix || !year || oid == null || oid === "") return "";
  return `CPC-${prefix}-${year}-${oid}`;
};

// Derive a human "status" from the furthest-along workflow field.
export const deriveStatus = (a) => {
  if (a.council_action) return `Council: ${a.council_action}`;
  if (a.cpc_action) return `CPC: ${a.cpc_action}`;
  if (a.cpc_public_hearing_date)
    return `CPC hearing ${fmtDate(a.cpc_public_hearing_date)}`;
  if (a.received_date) return `Received ${fmtDate(a.received_date)}`;
  return "Draft";
};

// ---- geometry helpers ----

// Project a single [lng, lat] (EPSG:4326) coordinate to Web Mercator meters
// (EPSG:3857 / 102100). Spherical mercator — exact, no dependency needed.
const R = 6378137;
const lngLatToWebMercator = ([lng, lat]) => {
  const x = (R * lng * Math.PI) / 180;
  const y = R * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
  return [x, y];
};

// Recursively project a GeoJSON coordinate array (any nesting depth).
const projectCoords = (coords) =>
  typeof coords[0] === "number"
    ? lngLatToWebMercator(coords)
    : coords.map(projectCoords);

// Convert a dissolved GeoJSON geometry (WGS84) into an Esri polygon geometry
// in the layer's spatial reference (102100), ready for applyEdits.
export const geojsonToZoningGeometry = (geojsonGeometry) => {
  const projected = {
    type: geojsonGeometry.type,
    coordinates: projectCoords(geojsonGeometry.coordinates),
  };
  const esri = geojsonToArcGIS(projected);
  esri.spatialReference = { wkid: ZONING_LAYER_WKID };
  return esri;
};
