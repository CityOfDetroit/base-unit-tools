import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import bbox from "@turf/bbox";
import { baseStyle } from "../styles/mapstyle.js";

// Small read-only map that displays a single amendment's saved geometry.
const AmendmentMiniMap = ({ geometry, height = "300px" }) => {
  const containerRef = useRef(null);
  const [theMap, setTheMap] = useState(null);

  useEffect(() => {
    const detroitBbox = [-83.287803, 42.255192, -82.910451, 42.45023];
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: baseStyle,
      bounds: detroitBbox,
    });

    map.on("load", () => {
      map.resize();

      // static map: keep it from being panned/zoomed (mouse events still fire)
      map.dragPan.disable();
      map.scrollZoom.disable();
      map.boxZoom.disable();
      map.dragRotate.disable();
      map.doubleClickZoom.disable();
      map.touchZoomRotate.disable();
      map.keyboard.disable();

      map.addSource("amendment", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addLayer({
        id: "amendment-fill",
        type: "fill",
        source: "amendment",
        paint: { "fill-color": "#2563eb", "fill-opacity": 0.3 },
      });
      map.addLayer({
        id: "amendment-line",
        type: "line",
        source: "amendment",
        paint: { "line-color": "#1d4ed8", "line-width": 2 },
      });

      // hover tooltip showing the underlying parcel id
      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 8,
        className: "zoning-parcel-tip",
      });
      map.on("mousemove", "parcel-fill", (e) => {
        const pid = e.features?.[0]?.properties?.parcel_id;
        if (!pid) {
          popup.remove();
          return;
        }
        map.getCanvas().style.cursor = "crosshair";
        popup.setLngLat(e.lngLat).setText(String(pid)).addTo(map);
      });
      map.on("mouseleave", "parcel-fill", () => {
        map.getCanvas().style.cursor = "";
        popup.remove();
      });

      setTheMap(map);
    });

    return () => map.remove();
  }, []);

  useEffect(() => {
    if (!theMap) return;
    const src = theMap.getSource("amendment");
    if (!src) return;
    if (geometry) {
      src.setData(geometry);
      try {
        theMap.fitBounds(bbox(geometry), {
          padding: 30,
          maxZoom: 18,
          animate: false,
        });
      } catch (e) {
        /* ignore degenerate bounds */
      }
    } else {
      src.setData({ type: "FeatureCollection", features: [] });
    }
  }, [theMap, geometry]);

  return <div ref={containerRef} style={{ height, minHeight: "200px" }} />;
};

export default AmendmentMiniMap;
