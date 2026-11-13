import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import maplibregl from "maplibre-gl";
import { Box, Button, Card, DataList, Flex, Grid, Spinner, Text, TextField } from "@radix-ui/themes";
import { queryFeatures } from "@esri/arcgis-rest-feature-service";
import { baseStyle } from "../styles/mapstyle.js";
import { useAuth } from "../contexts/AuthContext";
import useGeocoder from "../hooks/useGeocoder";
import useBaseFeature from "../hooks/useBaseFeature";
import CardLink, { DataSource } from "../components/CardLink";
import { ChevronDownIcon, GlobeIcon } from "@radix-ui/react-icons";
import layers from "../data/layers";

// Replica of the "Ownership Explorer" Experience Builder app
// (experience.arcgis.com/experience/f65391f3f2b84d17b54d8b396a3cc034).
// The map draws org-only vector tiles built from a read-only view of Verified_Parcel_Ownership
// (rebuilt daily by topsoil's p__real_estate_ownership_daily). Counts and parcel lists come
// from the feature layer; a parcel's full record comes from the public parcels layer, like /map.
const TILES_URL =
  "https://vectortileservices2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/Verified_Parcel_Ownership_vector_tiles/VectorTileServer";
const SOURCE_LAYER = "Verified_Parcel_Ownership_polygons";
// AGO puts every parcel in every level: a z13 tile is 0.5-0.8MB, z12 2-3MB. Below z13 the
// shown cluster or owner is drawn as dots instead. z16+ tiles hold the same data as z15.
const TILES_MINZOOM = 13;
const TILES_MAXZOOM = 15;
const LAYER_URL =
  "https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/Verified_Parcel_Ownership/FeatureServer/0";
// "source" for ownership data: the AGO item's data tab. The layer is org-only and its REST pages
// don't use the AGO sign-in, so a REST query link would need the user's token in the URL.
const OWNERSHIP_ITEM_URL = "https://detroitmi.maps.arcgis.com/home/item.html?id=af308c7ec9964b2db47228727fc2cd3e#data";

const sql = (s) => String(s).replace(/'/g, "''");

// Same classes and colors as the Experience's "Ownership 0" layer.
const CLASSES = [
  ["Verified", "rgb(254, 183, 13)"],
  ["Municipally Owned", "rgb(39, 153, 137)"],
  ["Religious/Non-Profit", "rgb(29, 58, 107)"],
  ["Educational", "rgb(0, 68, 69)"],
  ["Governmental Entity/Utility", "rgb(159, 213, 179)"],
  ["Not Verified", "rgb(242, 242, 242)"],
];
const color = Object.fromEntries(CLASSES);
const ownerType = ["coalesce", ["get", "entity_owner_type"], ""];
const isVerified = ["==", ["get", "is_verified"], 1]; // SmallInteger 0/1
const classColor = [
  "case",
  ["!", isVerified], color["Not Verified"],
  ["==", ownerType, "City of Detroit"], color["Municipally Owned"],
  ["in", ownerType, ["literal", ["Non-Profit", "Religious Institution"]]], color["Religious/Non-Profit"],
  ["in", ownerType, ["literal", ["Government", "Utility"]]], color["Governmental Entity/Utility"],
  ["==", ownerType, "Educational"], color["Educational"],
  color["Verified"],
];

// the legend class of a tile feature (same rules as classColor)
const classOf = (p) => {
  const t = p.entity_owner_type || "";
  if (p.is_verified !== 1) return "Not Verified";
  if (t === "City of Detroit") return "Municipally Owned";
  if (t === "Non-Profit" || t === "Religious Institution") return "Religious/Non-Profit";
  if (t === "Government" || t === "Utility") return "Governmental Entity/Utility";
  if (t === "Educational") return "Educational";
  return "Verified";
};
// the map hover card: address, owner, legend class. Built with textContent (owner names are data).
const hoverCard = (address, p) => {
  const el = document.createElement("div");
  const line = (cls, text) => {
    const d = document.createElement("div");
    d.className = cls;
    d.textContent = text;
    return el.appendChild(d);
  };
  line("ot-address", address || p.parcel_id);
  line(p.is_verified === 1 ? "ot-owner" : "ot-owner ot-muted", p.is_verified === 1 ? p.entity_owner : "Owner not yet verified");
  const cls = classOf(p);
  const swatch = document.createElement("span");
  swatch.className = "ot-swatch";
  swatch.style.background = color[cls];
  line("ot-class", cls).prepend(swatch);
  return el;
};

const LIST_PAGE = 200; // rows shown before "Show more"
const FILL_OPACITY = 0.5; // parcel fills (and legend swatches) when nothing is selected
const DIMMED_OPACITY = 0.12; // parcels outside the selected cluster or owner, kept visible for context
const HOVER_COLOR = "#e8590c"; // list hover, and the hovered owner's parcels
const SELECTED_COLOR = "#00b7ff"; // the clicked parcel
const POSSIBLE_COLOR = "#7c3aed"; // unverified parcels in the shown cluster ("possible additional")

// highlight entries for the map legend, after the classes
const HIGHLIGHTS = [
  ["Selected parcel", { border: `2px solid ${SELECTED_COLOR}` }],
  ["Possible additional property", { border: `2px dashed ${POSSIBLE_COLOR}`, background: "rgba(124, 58, 237, 0.25)" }],
];

const mailing = (r) =>
  [r.taxpayer_address, [r.taxpayer_city, r.taxpayer_state].filter(Boolean).join(", "), r.taxpayer_zip_code]
    .filter(Boolean)
    .join(" ");

const num = (loading, n) => (loading ? "…" : n.toLocaleString());
const sortByAddress = (list) =>
  list.sort((a, b) => (a.address || "").localeCompare(b.address || "", undefined, { numeric: true }));
// a title with a gray line under it (parcel id, property count)
const Heading = ({ title, sub }) => (
  <Box>
    <Text as="div" size="3" weight="medium">{title}</Text>
    {sub != null && <Text as="div" size="1" color="gray">{sub}</Text>}
  </Box>
);
// label/value rows; values may be text or elements
const Rows = ({ rows }) => (
  <DataList.Root size="1">
    {rows.filter(Boolean).map(([label, value]) => (
      <DataList.Item key={label}>
        <DataList.Label>{label}</DataList.Label>
        <DataList.Value>{value || "—"}</DataList.Value>
      </DataList.Item>
    ))}
  </DataList.Root>
);

const ParcelRow = ({ p, pre, active, onClick, onHover }) => (
  <button
    className={`flex w-full justify-between gap-2 px-2 py-1 text-left text-sm hover:bg-gray-100 ${active ? "bg-sky-100" : ""}`}
    onClick={onClick}
    onMouseEnter={() => onHover(p.parcel_id)}
    onMouseLeave={() => onHover(null)}
  >
    <span>{p.address || p.parcel_id}</span>
    <span className="flex items-center gap-2">
      {pre > 0 && (
        <span
          className="rounded bg-green-100 px-1 text-xs text-green-800"
          title={`Principal residence exemption (PRE) claimed: ${pre}%`}
        >
          PRE{pre < 100 ? ` ${pre}%` : ""}
        </span>
      )}
      {p.is_verified !== 1 && <span className="text-xs text-gray-500">possible</span>}
    </span>
  </button>
);

const boundsOf = (geom) =>
  (geom.type === "Polygon" ? geom.coordinates.flat() : geom.coordinates.flat(2)).reduce(
    (b, c) => b.extend(c),
    new maplibregl.LngLatBounds()
  );

const Ownership = () => {
  const { token } = useAuth();
  const tokenRef = useRef(token);
  tokenRef.current = token;
  const mapDiv = useRef(null);
  const [map, setMap] = useState(null);
  // what the sidebar shows: a clicked parcel's owner cluster, or a searched owner (by name)
  const [selected, setSelected] = useState(null); // tile properties of the parcel whose cluster is shown
  const [ownerFilter, setOwnerFilter] = useState("");
  const [parcels, setParcels] = useState([]); // the shown cluster's or owner's parcels
  const [listLimit, setListLimit] = useState(LIST_PAGE);
  const [listFilter, setListFilter] = useState("");
  const [loadingParcels, setLoadingParcels] = useState(false);
  // PRE % per parcel_id, from the public parcels layer (the ownership layer doesn't carry it);
  // fetched only for the rows on screen, in batches, and kept as the list grows or changes
  const [pre, setPre] = useState({});
  const listed = useMemo(() => {
    const f = listFilter.trim().toUpperCase();
    return f ? parcels.filter((p) => `${p.address} ${p.parcel_id}`.toUpperCase().includes(f)) : parcels;
  }, [parcels, listFilter]);
  const [detailId, setDetailId] = useState(null); // parcel_id in the slide-in details
  const [hoverId, setHoverId] = useState(null); // parcel_id under the mouse in the list
  const { data: selectedFeature, refetch: loadSelected } = useBaseFeature(null, "parcel");
  const flyOnLoad = useRef(null); // parcel_id from address search or URL, flown to once its record loads
  // one search box on the map: Enter looks up an address, or pick a verified owner from the list
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  // every verified owner with a parcel count, loaded once; the search box filters it in the browser
  // (a server-side LIKE '%…%' scans all ~378k rows, ~8s per keystroke)
  const [owners, setOwners] = useState(null);
  const suggestions = useMemo(() => {
    const q = search.trim().toUpperCase();
    if (!owners || q.length < 2) return [];
    return owners.filter((o) => o.entity_owner.toUpperCase().includes(q)).slice(0, 20);
  }, [owners, search]);
  const fitOnLoad = useRef(false); // zoom to the owner's parcels once their list loads
  const { feature: geocoded, changeAddress } = useGeocoder();
  const [params, setParams] = useSearchParams();
  const paramsApplied = useRef(false);

  const query = (params) => queryFeatures({ url: LAYER_URL, authentication: tokenRef.current, ...params });
  // zoom and counts come from the parcel list already loaded, so no extra extent/count queries
  const fitParcels = (list) => {
    if (!list.length) return;
    const b = list.reduce((b, p) => b.extend([p.lng, p.lat]), new maplibregl.LngLatBounds());
    map.fitBounds(b, { padding: 60, maxZoom: 17 });
  };
  // every parcel matching `where`, with a centroid. 10k per request (maxRecordCountFactor 5 on the
  // 2000 limit): one request for nearly every owner, 6 for the Land Bank's ~57k parcels.
  const fetchParcels = async (where) => {
    const out = [];
    for (let offset = 0; ; offset += 10000) {
      const r = await query({
        where,
        outFields: "parcel_id,address,is_verified,entity_owner,entity_owner_type",
        returnGeometry: false,
        orderByFields: "ObjectId",
        resultOffset: offset,
        resultRecordCount: 10000,
        params: { returnCentroid: true, outSR: 4326, geometryPrecision: 5, maxRecordCountFactor: 5 },
      });
      for (const f of r.features) if (f.centroid) out.push({ ...f.attributes, lng: f.centroid.x, lat: f.centroid.y });
      if (!r.exceededTransferLimit) break;
    }
    return sortByAddress(out);
  };
  const ownerWhere = ownerFilter && `entity_owner = '${sql(ownerFilter)}'`;
  // A clicked parcel shows its owner plus the unverified parcels of its cluster ("possible additional").
  // Not the whole cluster: one cluster can hold several verified owners (DTE and Olympia share 441).
  // An unverified parcel has no owner, so it shows its whole cluster.
  // The clicked parcel's owner and cluster come from the live layer, not the tile: cluster ids are
  // renumbered on every daily run, so the tiles' ids go stale until the tiles are rebuilt.
  const [live, setLive] = useState(null);
  const cluster = live?.parcel_id === selected?.parcel_id && live?.entity_cluster != null ? Number(live.entity_cluster) : null;
  const selectedOwner = cluster != null && live.is_verified === 1 ? live.entity_owner : null;
  // Queried separately, not as one OR: AGO scans the whole layer for the OR (~5.5s vs ~0.15s for the
  // indexed cluster half on its own).
  const clusterWheres =
    cluster == null
      ? []
      : selectedOwner
        ? [`entity_owner = '${sql(selectedOwner)}'`, `entity_cluster = ${cluster} AND is_verified = 0`]
        : [`entity_cluster = ${cluster}`];

  const showOwner = (name) => {
    fitOnLoad.current = true;
    setOwnerFilter(name);
    setSelected(null);
    setDetailId(null);
    setSearch(name);
    setSearchOpen(false);
  };
  const findAddress = () => {
    if (!search.trim()) return;
    changeAddress(search.trim());
    setSearchOpen(false);
  };
  const reset = () => {
    setSelected(null);
    setOwnerFilter("");
    setDetailId(null);
    setSearch("");
  };

  // build the map once we have a token for the org-only tiles
  useEffect(() => {
    if (!token) return;
    const m = new maplibregl.Map({
      container: mapDiv.current,
      style: baseStyle,
      center: [-83.07715, 42.37927], // citywide, same as /map
      zoom: 10.75,
      minZoom: 10,
      transformRequest: (url) =>
        url.startsWith(TILES_URL) ? { url: `${url}?token=${tokenRef.current}` } : { url },
    });
    m.addControl(new maplibregl.NavigationControl(), "top-left");
    m.on("load", () => {
      m.addSource("ownership", {
        type: "vector",
        tiles: [`${TILES_URL}/tile/{z}/{y}/{x}.pbf`],
        minzoom: TILES_MINZOOM,
        maxzoom: TILES_MAXZOOM,
      });
      m.addLayer({
        id: "ownership-fill",
        type: "fill",
        source: "ownership",
        "source-layer": SOURCE_LAYER,
        paint: { "fill-color": classColor, "fill-opacity": FILL_OPACITY, "fill-outline-color": "rgba(153,153,153,0.25)" },
      });
      // the shown cluster's unverified "possible" parcels: purple tint + dashed outline
      // (their class fill is near-white, so they'd otherwise be hard to see)
      const none = ["==", ["get", "parcel_id"], ""];
      m.addLayer({
        id: "possible-fill",
        type: "fill",
        source: "ownership",
        "source-layer": SOURCE_LAYER,
        filter: none,
        paint: { "fill-color": POSSIBLE_COLOR, "fill-opacity": 0.25 },
      });
      m.addLayer({
        id: "possible-line",
        type: "line",
        source: "ownership",
        "source-layer": SOURCE_LAYER,
        filter: none,
        paint: { "line-color": POSSIBLE_COLOR, "line-width": 2, "line-dasharray": [2, 1] },
      });
      m.addLayer({
        id: "ownership-selected",
        type: "line",
        source: "ownership",
        "source-layer": SOURCE_LAYER,
        filter: none,
        paint: { "line-color": SELECTED_COLOR, "line-width": 3 },
      });
      // below TILES_MINZOOM there are no tiles; the cluster or owner shows as dots instead
      m.addSource("filtered-dots", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
      m.addLayer({
        id: "filtered-dots",
        type: "circle",
        source: "filtered-dots",
        maxzoom: TILES_MINZOOM,
        paint: {
          "circle-color": classColor, // same classes as the parcel fills
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 1.5, 13, 3.5],
          // possible (unverified) parcels get a purple ring, like their outline at closer zooms
          "circle-stroke-color": ["case", ["==", ["get", "is_verified"], 1], "#5c5c5c", POSSIBLE_COLOR],
          "circle-stroke-width": ["case", ["==", ["get", "is_verified"], 1], 0.5, 1.5],
        },
      });
      // all parcels of the verified owner under the mouse on the map: shaded a little darker
      // (drawn just above the fills, under the possible/selected outlines)
      m.addLayer(
        {
          id: "owner-hover",
          type: "fill",
          source: "ownership",
          "source-layer": SOURCE_LAYER,
          filter: ["==", ["get", "entity_owner"], ""],
          paint: { "fill-color": "#000", "fill-opacity": 0.2 },
        },
        "possible-fill"
      );
      // the parcel under the mouse in the sidebar list: an outline, or a ringed dot when zoomed out
      m.addLayer({
        id: "list-hover",
        type: "line",
        source: "ownership",
        "source-layer": SOURCE_LAYER,
        filter: ["==", ["get", "parcel_id"], ""],
        paint: { "line-color": HOVER_COLOR, "line-width": 4 },
      });
      m.addLayer({
        id: "list-hover-dot",
        type: "circle",
        source: "filtered-dots",
        maxzoom: TILES_MINZOOM,
        filter: ["==", ["get", "parcel_id"], ""],
        paint: {
          "circle-color": "rgba(0,0,0,0)",
          "circle-radius": 9,
          "circle-stroke-color": HOVER_COLOR,
          "circle-stroke-width": 3,
        },
      });
      setMap(m);
    });
    // hover: owner from the ownership tile, address from the base map's parcel tiles
    // (anchor fixed so the card doesn't flip sides as the mouse moves)
    const tip = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      anchor: "top-left",
      offset: [14, 14],
      maxWidth: "260px",
      className: "ownership-tip",
    });
    // and shade every other parcel of the hovered verified owner (by name, from the tiles);
    // not the Land Bank, whose ~57k parcels would shade half the city
    let hoveredOwner = null;
    const setHoveredOwner = (owner) => {
      if (owner === "Detroit Land Bank Authority (DLBA)") owner = null;
      if (owner === hoveredOwner) return;
      hoveredOwner = owner;
      m.setFilter("owner-hover", ["==", ["get", "entity_owner"], owner ?? ""]);
    };
    // To avoid flashing: rebuild the card only when the parcel changes, and clear the card and
    // outlines a moment after leaving, so crossing a street between parcels doesn't blink them.
    let hoveredParcel = null;
    let clearTimer = null;
    m.on("mousemove", "ownership-fill", (e) => {
      const p = e.features?.[0]?.properties;
      if (!p) return;
      clearTimeout(clearTimer);
      m.getCanvas().style.cursor = "pointer";
      tip.setLngLat(e.lngLat);
      if (p.parcel_id !== hoveredParcel) {
        hoveredParcel = p.parcel_id;
        const address = m.queryRenderedFeatures(e.point, { layers: ["parcel-fill"] })[0]?.properties?.address;
        tip.setDOMContent(hoverCard(address, p));
        setHoveredOwner(p.is_verified === 1 ? p.entity_owner : null);
      }
      if (!tip.isOpen()) tip.addTo(m);
    });
    m.on("mouseleave", "ownership-fill", () => {
      m.getCanvas().style.cursor = "";
      clearTimeout(clearTimer);
      clearTimer = setTimeout(() => {
        hoveredParcel = null;
        tip.remove();
        setHoveredOwner(null);
      }, 150);
    });
    // click a parcel: show its owner's cluster and list; details open from the list
    m.on("click", "ownership-fill", (e) => {
      const props = e.features?.[0]?.properties;
      if (!props?.parcel_id) return;
      setOwnerFilter("");
      setSelected(props);
      setDetailId(null);
    });
    return () => m.remove();
  }, [token]);

  useEffect(() => {
    if (!selected?.parcel_id) return setLive(null);
    loadSelected(selected.parcel_id, "parcel");
    let cancelled = false;
    query({
      where: `parcel_id = '${sql(selected.parcel_id)}'`,
      outFields: "parcel_id,entity_cluster,entity_owner,entity_owner_type,is_verified",
      returnGeometry: false,
    }).then((r) => !cancelled && setLive(r.features[0]?.attributes ?? null));
    return () => {
      cancelled = true;
    };
  }, [selected?.parcel_id]);

  // address search or ?parcel= -> select it straight away (its card, not the details panel; owner
  // and cluster come from the live layer), and fly there once its parcel record has the geometry
  const goToParcel = (pid) => {
    setOwnerFilter("");
    setDetailId(null);
    flyOnLoad.current = pid;
    setSelected({ parcel_id: pid });
  };
  useEffect(() => {
    const pid = geocoded?.attributes?.parcel_id;
    if (map && pid) goToParcel(pid);
  }, [map, geocoded]);
  useEffect(() => {
    const pid = selectedFeature?.properties?.parcel_id;
    if (!map || !pid || flyOnLoad.current !== pid) return;
    flyOnLoad.current = null;
    map.fitBounds(boundsOf(selectedFeature.geometry), { padding: 120, maxZoom: 17 });
  }, [map, selectedFeature]);

  // ?parcel=<parcel_id> opens that parcel and its owner's cluster; ?owner=<exact name> opens that owner
  useEffect(() => {
    if (!map || paramsApplied.current) return;
    paramsApplied.current = true;
    const ownerParam = params.get("owner");
    const parcelParam = params.get("parcel");
    if (ownerParam) showOwner(ownerParam);
    else if (parcelParam) goToParcel(parcelParam);
  }, [map]);
  // keep the URL in step with the view, so it can be shared
  useEffect(() => {
    if (!paramsApplied.current) return;
    const next = {};
    if (ownerFilter) next.owner = ownerFilter;
    const pid = detailId ?? selected?.parcel_id;
    if (pid) next.parcel = pid;
    setParams(next, { replace: true });
  }, [ownerFilter, detailId, selected?.parcel_id]);

  // the cluster or owner stands out; everything else stays on the map, dimmed, for context
  // (a clicked parcel's set is matched by parcel_id from the loaded list, never by the tiles' cluster ids)
  useEffect(() => {
    if (!map) return;
    // A verified owner is matched by name straight from the tiles (names are stable; only cluster ids
    // change daily), so it lights up on click. Unverified "possible" parcels have no owner name, so
    // they come from the loaded list by parcel_id; until it loads, just the clicked parcel is lit.
    const owner = selectedOwner ?? (selected?.is_verified === 1 ? selected.entity_owner : null);
    const ids = parcels.length ? parcels.filter((p) => !owner || p.is_verified !== 1).map((p) => p.parcel_id) : [];
    const byId = ["match", ["get", "parcel_id"], ids.length ? ids : [selected?.parcel_id ?? ""], true, false];
    const match = ownerFilter
      ? ["==", ["get", "entity_owner"], ownerFilter]
      : !selected
        ? null
        : owner
          ? ["any", ["==", ["get", "entity_owner"], owner], byId]
          : byId;
    map.setPaintProperty("ownership-fill", "fill-opacity", match ? ["case", match, 0.85, DIMMED_OPACITY] : FILL_OPACITY);
    map.setFilter("ownership-selected", ["==", ["get", "parcel_id"], detailId ?? selected?.parcel_id ?? ""]);
    // a clicked parcel's cluster: mark its unverified ("possible") parcels
    const possible = selected && !ownerFilter ? parcels.filter((p) => p.is_verified !== 1).map((p) => p.parcel_id) : [];
    const possibleFilter = ["match", ["get", "parcel_id"], possible.length ? possible : [""], true, false];
    map.setFilter("possible-fill", possibleFilter);
    map.setFilter("possible-line", possibleFilter);
  }, [map, ownerFilter, selected, selectedOwner, detailId, parcels]);

  useEffect(() => {
    if (!map) return;
    const f = ["==", ["get", "parcel_id"], hoverId ?? ""];
    map.setFilter("list-hover", f);
    map.setFilter("list-hover-dot", f);
  }, [map, hoverId]);

  // the verified owner list for the search box (~2 pages of 2000), loaded on first focus of the box
  // rather than at page load, so its two full scans don't slow the first click or ?parcel= link
  const ownersRequested = useRef(false);
  useEffect(() => {
    if (!map || !searchOpen || ownersRequested.current) return;
    ownersRequested.current = true;
    (async () => {
      const out = [];
      for (let offset = 0; ; offset += 2000) {
        const r = await query({
          where: "is_verified = 1",
          groupByFieldsForStatistics: "entity_owner",
          outStatistics: [{ statisticType: "count", onStatisticField: "parcel_id", outStatisticFieldName: "n" }],
          orderByFields: "entity_owner",
          resultOffset: offset,
          resultRecordCount: 2000,
        });
        out.push(...r.features.map((f) => f.attributes));
        if (!r.exceededTransferLimit) break;
      }
      setOwners(out.sort((a, b) => b.n - a.n));
    })().catch(() => setOwners([]));
  }, [map, searchOpen]);

  // the cluster's or owner's parcels: the sidebar list, and dots below TILES_MINZOOM
  useEffect(() => {
    if (!map) return;
    const wheres = ownerWhere ? [ownerWhere] : clusterWheres;
    const dots = map.getSource("filtered-dots");
    dots.setData({ type: "FeatureCollection", features: [] });
    setParcels([]);
    setListLimit(LIST_PAGE);
    setListFilter("");
    if (!wheres.length) return;
    let cancelled = false;
    setLoadingParcels(true);
    Promise.all(wheres.map(fetchParcels))
      .then((lists) => {
        const list = lists.length === 1 ? lists[0] : sortByAddress([...new Map(lists.flat().map((p) => [p.parcel_id, p])).values()]);
        if (cancelled) return;
        setParcels(list);
        if (fitOnLoad.current) {
          fitOnLoad.current = false;
          fitParcels(list);
        }
        dots.setData({
          type: "FeatureCollection",
          features: list.map((p) => ({
            type: "Feature",
            geometry: { type: "Point", coordinates: [p.lng, p.lat] },
            properties: { parcel_id: p.parcel_id, is_verified: p.is_verified, entity_owner_type: p.entity_owner_type },
          })),
        });
      })
      .finally(() => !cancelled && setLoadingParcels(false));
    return () => {
      cancelled = true;
      setLoadingParcels(false);
    };
  }, [map, ownerWhere, clusterWheres.join("|")]);

  const shownIds = listed.slice(0, listLimit).map((p) => p.parcel_id);
  useEffect(() => {
    const missing = shownIds.filter((id) => !(id in pre));
    if (!missing.length) return;
    let cancelled = false;
    const batches = [];
    for (let i = 0; i < missing.length; i += 200) batches.push(missing.slice(i, i + 200));
    Promise.all(
      batches.map((ids) =>
        queryFeatures({
          url: layers.parcel.endpoint,
          where: `parcel_id IN (${ids.map((id) => `'${sql(id)}'`).join(",")})`,
          outFields: "parcel_id,pct_pre_claimed",
          returnGeometry: false,
          httpMethod: "POST",
        })
      )
    )
      .then((results) => {
        if (cancelled) return;
        const found = Object.fromEntries(missing.map((id) => [id, 0]));
        for (const r of results) for (const f of r.features) found[f.attributes.parcel_id] = f.attributes.pct_pre_claimed || 0;
        setPre((old) => ({ ...old, ...found }));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [shownIds.join("|")]);

  // verified / possible-additional counts, from the loaded list
  const verifiedCount = parcels.filter((p) => p.is_verified === 1).length;
  const possibleCount = parcels.length - verifiedCount;

  const verified = !!selectedOwner;
  // the clicked parcel's own record (address, taxpayer) for the card, like the Experience
  const selectedRecord =
    selected && selectedFeature?.properties?.parcel_id === selected.parcel_id ? selectedFeature.properties : null;
  // an unverified parcel's "potential owners": the verified owners in its cluster, largest first
  const potentialOwners = useMemo(() => {
    const n = new Map();
    for (const p of parcels) if (p.is_verified === 1) n.set(p.entity_owner, (n.get(p.entity_owner) || 0) + 1);
    return [...n.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name);
  }, [parcels]);
  // a list click selects the parcel, the same as clicking it on the map
  const focusParcel = (p) => {
    setOwnerFilter("");
    setDetailId(null);
    setSelected({ parcel_id: p.parcel_id, is_verified: p.is_verified, entity_owner: p.entity_owner });
    map.flyTo({ center: [p.lng, p.lat], zoom: Math.max(map.getZoom(), 17), duration: 600 });
  };

  return (
    <Grid
      columns={{ initial: "1fr", sm: "1fr 3fr" }}
      gap={{ initial: "0", sm: "4" }}
      p={{ initial: "2", sm: "2", lg: "4" }}
    >
      <Box className="relative min-w-80 overflow-hidden" style={{ height: "80vh", minHeight: "400px" }}>
        {/* the owner stays put at the top; only the property list below it scrolls */}
        <Flex direction="column" gap="3" className="h-full">
          <Flex direction="column" gap="3" className="shrink-0">
            <Text size="5" weight="bold" className="text-[#004445]">
              Ownership
            </Text>

            <Box className="relative">
              <TextField.Root
                placeholder="Search an address or owner…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setSearchOpen(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") findAddress();
                  if (e.key === "Escape") setSearchOpen(false);
                }}
              />
              {searchOpen && search.trim().length >= 2 && (
                // floats over the cards below; onMouseDown + preventDefault so picking a row doesn't blur the box first
                <Flex
                  direction="column"
                  className="absolute left-0 right-0 top-full z-10 mt-1 max-h-80 overflow-y-auto rounded border border-gray-200 bg-white shadow"
                >
                  <button
                    className="px-2 py-1 text-left text-sm hover:bg-gray-100"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      findAddress();
                    }}
                  >
                    Find address “{search.trim()}” <span className="text-gray-500">↵</span>
                  </button>
                  <Text size="1" color="gray" className="border-t border-gray-100 px-2 pt-1">
                    {!owners ? "Loading owner names…" : suggestions.length ? "Verified owners" : "No matching owners"}
                  </Text>
                  {suggestions.map((s) => (
                    <button
                      key={s.entity_owner}
                      className="flex justify-between gap-2 px-2 py-1 text-left text-sm hover:bg-gray-100"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        showOwner(s.entity_owner);
                      }}
                    >
                      <span>{s.entity_owner}</span>
                      <span className="text-gray-500">{s.n.toLocaleString()}</span>
                    </button>
                  ))}
                </Flex>
              )}
            </Box>

            {!selected && !ownerFilter && (
              <Text size="2" color="gray">
                Click a parcel to see its verified owner and everything they own, or search for an address or an
                owner's name.
              </Text>
            )}

            {ownerFilter && (
              <Card>
                <Heading title={ownerFilter} sub={`Verified owner · ${num(loadingParcels, parcels.length)} properties`} />
                <Box mt="2">
                  <DataSource url={OWNERSHIP_ITEM_URL} />
                </Box>
              </Card>
            )}

            {!ownerFilter && selected && (
              <Card>
                <Flex direction="column" gap="3">
                  <Heading title={selectedRecord?.address ?? "…"} sub={selected.parcel_id} />
                  <Box className="rounded bg-gray-50 px-3 py-2">
                    <Text as="div" size="1" color="gray">Verified owner</Text>
                    {cluster == null ? (
                      <Text as="div" size="4" color="gray">…</Text>
                    ) : verified ? (
                      <Text as="div" size="5" weight="bold" className="text-[#004445]">{selectedOwner}</Text>
                    ) : (
                      <Text as="div" size="5" weight="bold" className="text-gray-600">Not yet verified</Text>
                    )}
                  </Box>
                  <Rows
                    rows={[
                      verified && ["Owner type", live?.entity_owner_type],
                      verified && ["Verified properties", num(loadingParcels, verifiedCount)],
                      verified && ["Possible additional", num(loadingParcels, possibleCount)],
                      cluster != null &&
                        !verified && ["Potentially related", num(loadingParcels, Math.max(parcels.length - 1, 0))],
                      !verified &&
                        potentialOwners.length > 0 && [
                          "Potential owners",
                          <Flex direction="column" align="start">
                            {potentialOwners.map((name) => (
                              <button key={name} className="text-left underline-offset-2 hover:underline" onClick={() => showOwner(name)}>
                                {name}
                              </button>
                            ))}
                          </Flex>,
                        ],
                      ["Taxpayer", selectedRecord ? selectedRecord.taxpayer_1 : "…"],
                      ["Taxpayer address", selectedRecord ? mailing(selectedRecord) : "…"],
                    ]}
                  />
                  <Flex justify="end" gap="4">
                    <CardLink
                      text="open in map"
                      url={`/map?layer=parcel&id=${encodeURIComponent(selected.parcel_id)}`}
                      icon={<GlobeIcon />}
                    />
                    <DataSource url={OWNERSHIP_ITEM_URL} />
                  </Flex>
                </Flex>
              </Card>
            )}

            {(selected || ownerFilter) && !loadingParcels && parcels.length > 1 && (
              <Button variant="outline" onClick={() => fitParcels(parcels)}>
                Zoom to all {parcels.length.toLocaleString()} properties
              </Button>
            )}

            {(selected || ownerFilter) && (
              <Button variant="soft" onClick={reset}>
                Clear selection
              </Button>
            )}

            {loadingParcels && (
              <Flex align="center" gap="2" py="2">
                <Spinner />
                <Text size="2" color="gray">Loading properties…</Text>
              </Flex>
            )}
          </Flex>

            {parcels.length > 1 && (
              <Flex direction="column" gap="2" className="min-h-0">
                <Text size="2" weight="medium">
                  Properties ({listFilter.trim() ? `${listed.length.toLocaleString()} of ` : ""}
                  {parcels.length.toLocaleString()})
                </Text>
                <TextField.Root
                  size="1"
                  placeholder="Filter by address or parcel id…"
                  value={listFilter}
                  onChange={(e) => {
                    setListFilter(e.target.value);
                    setListLimit(LIST_PAGE);
                  }}
                />
                {listed.length === 0 ? (
                  <Text size="1" color="gray">No properties match.</Text>
                ) : (
                  <Box className="min-h-0 overflow-y-auto rounded border border-gray-200">
                    {listed.slice(0, listLimit).map((p) => (
                      <ParcelRow
                        key={p.parcel_id}
                        p={p}
                        pre={pre[p.parcel_id]}
                        active={p.parcel_id === selected?.parcel_id}
                        onClick={() => focusParcel(p)}
                        onHover={setHoverId}
                      />
                    ))}
                    {listed.length > listLimit && (
                      <button
                        className="w-full px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
                        onClick={() => setListLimit((n) => n + LIST_PAGE)}
                      >
                        Show {Math.min(LIST_PAGE, listed.length - listLimit).toLocaleString()} more
                      </button>
                    )}
                  </Box>
                )}
              </Flex>
            )}
        </Flex>

      </Box>

      <Box className="relative" style={{ height: "80vh", minHeight: "400px" }}>
        <div ref={mapDiv} className="h-full" />
        <Card size="1" style={{ position: "absolute", bottom: 12, left: 12 }}>
          <details open className="group">
            <summary className="flex cursor-pointer select-none list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
              <Text size="1" weight="medium" color="gray">Legend</Text>
              <ChevronDownIcon className="text-gray-500 transition-transform group-open:rotate-180" />
            </summary>
            <Flex direction="column" gap="1" mt="2">
              {CLASSES.map(([label, c]) => (
                <Flex key={label} gap="2" align="center">
                  <Box width="12px" height="12px" style={{ background: c, opacity: FILL_OPACITY, border: "1px solid #999" }} />
                  <Text size="1">{label}</Text>
                </Flex>
              ))}
              <Box my="1" className="border-t border-gray-200" />
              {HIGHLIGHTS.map(([label, style]) => (
                <Flex key={label} gap="2" align="center">
                  <Box width="12px" height="12px" style={style} />
                  <Text size="1">{label}</Text>
                </Flex>
              ))}
            </Flex>
          </details>
        </Card>
      </Box>
    </Grid>
  );
};

export default Ownership;
