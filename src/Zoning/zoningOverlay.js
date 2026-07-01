import {
  ZONING_MATCH_PROPERTY,
  zoningFillColorExpression,
} from "../data/zoningZones";

// Shared Detroit zoning-districts overlay for the amendment maps. Mirrors the
// Atlas "zoning" theme source so the district colors match across the app
// (see src/data/atlas.js / zoningZones.js).
const ZONING_TILES = [
  "https://tiles.arcgis.com/tiles/qvkbeam7Wirps6zC/arcgis/rest/services/Zoning_Vector_Tiles/VectorTileServer/tile/{z}/{y}/{x}.pbf",
];
const ZONING_SOURCE_LAYER = "Zoning";

export const ZONING_DISTRICT_LAYER_IDS = [
  "zoning-districts-fill",
  "zoning-districts-line",
  "zoning-districts-label",
];

// Add the (initially hidden) zoning-districts source + fill/line layers to a
// map. Call from the map's "load" handler, before any layers that should sit
// on top of the districts (parcel highlights, the saved amendment polygon).
export const addZoningDistrictsLayers = (map) => {
  if (map.getSource("zoning-districts")) return;
  map.addSource("zoning-districts", {
    type: "vector",
    tiles: ZONING_TILES,
    maxzoom: 19,
  });
  map.addLayer({
    id: "zoning-districts-fill",
    type: "fill",
    source: "zoning-districts",
    "source-layer": ZONING_SOURCE_LAYER,
    layout: { visibility: "none" },
    paint: {
      "fill-color": zoningFillColorExpression(),
      "fill-opacity": 0.45,
    },
  });
  map.addLayer({
    id: "zoning-districts-line",
    type: "line",
    source: "zoning-districts",
    "source-layer": ZONING_SOURCE_LAYER,
    layout: { visibility: "none" },
    paint: {
      "line-color": "#6e6e6e",
      "line-width": 0.4,
      "line-opacity": 0.6,
    },
  });
  // subtle per-district designation labels (e.g. "R2"), only when zoomed in
  map.addLayer({
    id: "zoning-districts-label",
    type: "symbol",
    source: "zoning-districts",
    "source-layer": ZONING_SOURCE_LAYER,
    minzoom: 14,
    layout: {
      visibility: "none",
      "text-field": ["coalesce", ["get", ZONING_MATCH_PROPERTY], ""],
      "text-font": ["Montserrat SemiBold"],
      "text-size": 13,
      "text-padding": 8,
      "text-allow-overlap": false,
      "text-optional": true,
    },
    paint: {
      "text-color": "#27272a",
      "text-opacity": 0.6,
      "text-halo-color": "rgba(255,255,255,0.9)",
      "text-halo-width": 1.4,
    },
  });
};

// Show or hide the zoning-districts overlay on a map.
export const setZoningDistrictsVisible = (map, visible) => {
  const visibility = visible ? "visible" : "none";
  ZONING_DISTRICT_LAYER_IDS.forEach((id) => {
    if (map.getLayer(id)) {
      map.setLayoutProperty(id, "visibility", visibility);
    }
  });
};
