import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import bbox from "@turf/bbox";
import { baseStyle } from "../styles/mapstyle.js";

// Map for selecting parcels into a zoning-amendment grouping.
// - click a parcel to toggle it in/out of the selection (fine control)
// - selected parcels are highlighted via a vector-tile filter on `parcel_id`
// - the dissolved amendment boundary is previewed as an outline
const SELECTION_COLOR = "#2563eb";

const ZoningMap = ({ selectedIds, onToggleParcel, dissolved, height = "65vh" }) => {
  const [theMap, setTheMap] = useState(null);
  // keep the latest toggle callback so the click handler isn't stale
  const toggleRef = useRef(onToggleParcel);
  useEffect(() => {
    toggleRef.current = onToggleParcel;
  }, [onToggleParcel]);

  useEffect(() => {
    const detroitBbox = [-83.287803, 42.255192, -82.910451, 42.45023];

    const map = new maplibregl.Map({
      container: "zoning-map",
      style: baseStyle,
      bounds: detroitBbox,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-left");

    map.on("load", () => {
      map.resize();

      // make parcel outlines faintly visible so the user can aim clicks
      map.setPaintProperty("parcel-line", "line-opacity", {
        base: 1,
        stops: [
          [14, 0],
          [14.1, 0.2],
        ],
      });

      // highlight fill for selected parcels (filtered by parcel_id)
      map.addLayer({
        id: "zoning-selection-fill",
        type: "fill",
        source: "bu_parcels",
        "source-layer": "Parcels (Current)",
        filter: ["in", "parcel_id", ""],
        paint: {
          "fill-color": SELECTION_COLOR,
          "fill-opacity": 0.35,
        },
      });
      map.addLayer({
        id: "zoning-selection-line",
        type: "line",
        source: "bu_parcels",
        "source-layer": "Parcels (Current)",
        filter: ["in", "parcel_id", ""],
        paint: {
          "line-color": SELECTION_COLOR,
          "line-width": 1.5,
        },
      });

      // dissolved amendment-boundary preview
      map.addSource("zoning-dissolved", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addLayer({
        id: "zoning-dissolved-line",
        type: "line",
        source: "zoning-dissolved",
        paint: {
          "line-color": "#b91c1c",
          "line-width": 2.5,
        },
      });

      setTheMap(map);
    });

    map.on("click", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["parcel-fill"],
      });
      if (features.length > 0) {
        const parcelId = features[0].properties?.parcel_id;
        if (parcelId) toggleRef.current(parcelId);
      }
    });

    // pointer cursor over parcels
    map.on("mouseenter", "parcel-fill", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "parcel-fill", () => {
      map.getCanvas().style.cursor = "";
    });

    return () => map.remove();
  }, []);

  // update the highlight filter when the selection changes
  useEffect(() => {
    if (!theMap) return;
    const filter = ["in", "parcel_id", ...(selectedIds.length ? selectedIds : [""])];
    theMap.setFilter("zoning-selection-fill", filter);
    theMap.setFilter("zoning-selection-line", filter);
  }, [theMap, selectedIds]);

  // update the dissolved preview; fit to it once (no animation), not on every change
  const didFitRef = useRef(false);
  useEffect(() => {
    if (!theMap) return;
    const src = theMap.getSource("zoning-dissolved");
    if (!src) return;
    if (dissolved) {
      src.setData(dissolved);
      if (!didFitRef.current) {
        try {
          theMap.fitBounds(bbox(dissolved), {
            padding: 60,
            maxZoom: 18,
            animate: false,
          });
          didFitRef.current = true;
        } catch (e) {
          /* ignore degenerate bounds */
        }
      }
    } else {
      src.setData({ type: "FeatureCollection", features: [] });
    }
  }, [theMap, dissolved]);

  return <div id="zoning-map" style={{ height, minHeight: "300px" }} />;
};

export default ZoningMap;
