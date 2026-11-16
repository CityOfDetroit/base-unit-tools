import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import maplibregl from "maplibre-gl";
import { Box, Button, Callout, Card, DataList, Flex, Grid, SegmentedControl, Spinner, Text, TextField } from "@radix-ui/themes";
import { queryFeatures } from "@esri/arcgis-rest-feature-service";
import { baseStyle, satelliteStyle } from "../styles/mapstyle.js";
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
// The Land Bank owns ~57k parcels: listing them all takes 6 large requests. Its verified parcels get
// only a count instead, fetched in the background (a cold count takes ~10s on AGO, a cached one
// ~0.1s; an extent query took 14s), and zooming to them fits the city, which they span. The map
// still shades them from the tiles, and a clicked parcel's possible-additional ones are still listed.
const LAND_BANK = "Detroit Land Bank Authority (DLBA)";
const LAND_BANK_WHERE = `entity_owner = '${sql(LAND_BANK)}'`;
const DETROIT_BOUNDS = [[-83.288, 42.255], [-82.91, 42.45]];
// Streets/Satellite, switched in place: show the satellite layer and give the base layers the
// visibility and paint satelliteStyle() uses. Not map.setStyle(): that reloads the style, and every
// setFilter/setPaintProperty in this tool throws until it's back.
// z21 imagery: this tool is for City staff, whose token the Nearmap function wants for z21 (see /map).
const SAT_STYLE = satelliteStyle(21);
const SAT_LAYERS = new Map(SAT_STYLE.layers.map((l) => [l.id, l]));
const STREETS_STYLE = { ...baseStyle, sources: { ...baseStyle.sources, satellite: SAT_STYLE.sources.satellite } };
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const showSatellite = (map, on) => {
  for (const base of baseStyle.layers) {
    const sat = SAT_LAYERS.get(base.id);
    if (!sat || !map.getLayer(base.id)) continue;
    const to = on ? sat : base;
    if (!same(base.layout?.visibility, sat.layout?.visibility))
      map.setLayoutProperty(base.id, "visibility", to.layout?.visibility ?? "visible");
    for (const k of new Set([...Object.keys(base.paint ?? {}), ...Object.keys(sat.paint ?? {})]))
      if (!same(base.paint?.[k], sat.paint?.[k])) map.setPaintProperty(base.id, k, to.paint?.[k]);
  }
  // satellite's thin street centerline, which has no streets-style twin; white here, since /map's
  // pink would read as OWNER_COLOR
  const i = SAT_STYLE.layers.findIndex((l) => l.id === "streets-sat-line");
  const line = SAT_STYLE.layers[i];
  if (on && !map.getLayer(line.id))
    map.addLayer({ ...line, paint: { ...line.paint, "line-color": "#ffffff", "line-opacity": 0.5 } }, SAT_STYLE.layers[i + 1]?.id);
  if (!on && map.getLayer("streets-sat-line")) map.removeLayer("streets-sat-line");
};

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
  line(p.is_verified === 1 ? "ot-owner" : "ot-owner ot-muted", p.is_verified === 1 ? p.entity_owner : "Owner not verified");
  const cls = classOf(p);
  const swatch = document.createElement("span");
  swatch.className = "ot-swatch";
  swatch.style.background = color[cls];
  line("ot-class", cls).prepend(swatch);
  return el;
};

const LIST_PAGE = 200; // rows shown before "Show more"
const FILL_OPACITY = 0.35; // parcel fills (and legend swatches) when nothing is selected
const HOVER_COLOR = "#111111"; // the parcel under the mouse in the list (on a white edge)
const SELECTED_COLOR = "#00b7ff"; // the clicked parcel
const POSSIBLE_COLOR = "#7c3aed"; // unverified parcels in the shown cluster ("possible additional")
// the shown owner's verified parcels: a bright magenta, apart from the class colors in hue and
// lightness, so it still stands out with red-green colorblindness
const OWNER_COLOR = "#e6007e";
const none = ["==", ["get", "parcel_id"], ""]; // filter that matches nothing

// the selection colors, shown as a swatch beside the sidebar text they belong to
// (the map legend has the classes)
const SWATCH = {
  owner: { background: OWNER_COLOR, opacity: 0.7 },
  selected: { border: `2px solid ${SELECTED_COLOR}`, background: "rgba(0, 183, 255, 0.2)" },
  // the selected parcel once its status is known: blue outline over what the map draws under it
  selectedVerified: { border: `2px solid ${SELECTED_COLOR}`, background: "rgba(230, 0, 126, 0.7)" },
  selectedPossible: { border: `2px solid ${SELECTED_COLOR}`, background: "rgba(124, 58, 237, 0.25)" },
  possible: { border: `2px dashed ${POSSIBLE_COLOR}`, background: "rgba(124, 58, 237, 0.25)" },
};
// the swatch and its text in one inline flex row, so the swatch is centered on the text
const Swatch = ({ type, children }) => (
  <span className="inline-flex items-center gap-1.5">
    <span className="h-2.5 w-2.5 shrink-0" style={SWATCH[type]} />
    {children}
  </span>
);

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
// label/value rows; values may be text or elements; an optional SWATCH key goes before the label
const Rows = ({ rows }) => (
  <DataList.Root size="1">
    {rows.filter(Boolean).map(([label, value, swatch]) => (
      <DataList.Item key={label}>
        <DataList.Label>
          {swatch ? <Swatch type={swatch}>{label}</Swatch> : label}
        </DataList.Label>
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
    onFocus={() => onHover(p.parcel_id)}
    onBlur={() => onHover(null)}
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
      {p.is_verified !== 1 && <span className="text-xs text-gray-600">possible additional</span>}
    </span>
  </button>
);

const boundsOf = (geom) =>
  (geom.type === "Polygon" ? geom.coordinates.flat() : geom.coordinates.flat(2)).reduce(
    (b, c) => b.extend(c),
    new maplibregl.LngLatBounds()
  );

// The Land Bank's parcels in view, read from the ownership tiles the map already has, so there's no
// query (one for a z15 view took 3-8s, 21s cold). Addresses come from the base map's parcel tiles.
// null below TILES_MINZOOM, where there are no tiles.
const landBankInView = (map) => {
  if (map.getZoom() < TILES_MINZOOM) return null;
  const view = map.getBounds();
  const found = new Map();
  const isLandBank = ["==", ["get", "entity_owner"], LAND_BANK];
  for (const f of map.querySourceFeatures("ownership", { sourceLayer: SOURCE_LAYER, filter: isLandBank })) {
    const id = f.properties.parcel_id;
    if (found.has(id)) continue; // a parcel crossing tile edges comes back once per tile
    const c = boundsOf(f.geometry).getCenter();
    if (view.contains(c)) found.set(id, { ...f.properties, lng: c.lng, lat: c.lat });
  }
  if (found.size) {
    const byId = ["in", ["get", "parcel_id"], ["literal", [...found.keys()]]];
    for (const f of map.querySourceFeatures("bu_parcels", { sourceLayer: "parcels_(current)", filter: byId }))
      found.get(f.properties.parcel_id).address ??= f.properties.address;
  }
  return sortByAddress([...found.values()]);
};

const Ownership = () => {
  const { token } = useAuth();
  const [satellite, setSatellite] = useState(false);
  const [zoomedOut, setZoomedOut] = useState(true); // below TILES_MINZOOM: no parcels to click yet
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
  const [landBank, setLandBank] = useState(null); // { count } when the Land Bank is shown (count null while loading)
  const [landBankRows, setLandBankRows] = useState(null); // its parcels in view (null: zoomed out too far)
  // PRE % per parcel_id, from the public parcels layer (the ownership layer doesn't carry it);
  // fetched only for the rows on screen, in batches, and kept as the list grows or changes
  const [pre, setPre] = useState({});
  // the sidebar list: the loaded parcels, plus the Land Bank's parcels in view when it's shown
  const rows = useMemo(
    () =>
      landBank && landBankRows?.length
        ? sortByAddress([...new Map([...parcels, ...landBankRows].map((p) => [p.parcel_id, p])).values()])
        : parcels,
    [parcels, landBank, landBankRows]
  );
  const listed = useMemo(() => {
    const f = listFilter.trim().toUpperCase();
    return f ? rows.filter((p) => `${p.address} ${p.parcel_id}`.toUpperCase().includes(f)) : rows;
  }, [rows, listFilter]);
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
  const { feature: geocoded, changeAddress, loading: geocoding, error: geocodeError } = useGeocoder();
  const [searched, setSearched] = useState(""); // the address last sent to the geocoder
  // a failed query's message, shown with a Retry button; retrying bumps `attempt`, which reruns the queries
  const [failed, setFailed] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const retry = () => {
    setFailed(null);
    setAttempt((a) => a + 1);
  };
  const [ownersError, setOwnersError] = useState(false);
  // the search dropdown is a combobox: option 0 finds the address, the rest are owners.
  // Enter picks the active option; until arrows move it, that's the first owner unless the
  // query starts with a digit (an address).
  const [active, setActive] = useState(null);
  const listOpen = searchOpen && search.trim().length >= 2;
  const options = [{ address: true }, ...suggestions];
  const activeIndex = Math.min(active ?? (/^\d/.test(search.trim()) || !suggestions.length ? 0 : 1), options.length - 1);
  const ownerRef = useRef("");
  ownerRef.current = ownerFilter;
  useEffect(() => {
    if (listOpen) document.getElementById(`ownership-option-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [listOpen, activeIndex]);
  const [params, setParams] = useSearchParams();
  const paramsApplied = useRef(false);

  const query = (params) => queryFeatures({ url: LAYER_URL, authentication: tokenRef.current, ...params });
  // zoom and counts come from the parcel list already loaded, so no extra extent/count queries
  const fitParcels = (list, withLandBank = !!landBank) => {
    const b = list.reduce((b, p) => b.extend([p.lng, p.lat]), new maplibregl.LngLatBounds());
    if (withLandBank) b.extend(DETROIT_BOUNDS);
    if (b.isEmpty()) return;
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
    setSearch(name);
    setSearchOpen(false);
  };
  const findAddress = () => {
    const q = search.trim();
    if (!q) return;
    setSearchOpen(false);
    // the geocoder only reruns when the address changes, so a repeat search reuses its last answer
    if (q === searched && geocoded?.attributes?.parcel_id) return goToParcel(geocoded.attributes.parcel_id);
    setSearched(q);
    changeAddress(q);
  };
  const choose = (o) => (o.address ? findAddress() : showOwner(o.entity_owner));
  const reset = () => {
    setSelected(null);
    setOwnerFilter("");
    setSearch("");
    setFailed(null);
  };

  // build the map once we have a token for the org-only tiles
  useEffect(() => {
    if (!token) return;
    const m = new maplibregl.Map({
      container: mapDiv.current,
      style: STREETS_STYLE,
      center: [-83.07715, 42.37927], // citywide, same as /map
      zoom: 10.75,
      minZoom: 10,
      transformRequest: (url) =>
        url.startsWith(TILES_URL)
          ? { url: `${url}?token=${tokenRef.current}` }
          : // z21 Nearmap tiles need the ArcGIS token (same as /map); the rest stay CDN-cacheable
            url.includes("/nearmap/21/") && tokenRef.current
            ? { url, headers: { Authorization: `Bearer ${tokenRef.current}` } }
            : { url },
    });
    m.addControl(new maplibregl.NavigationControl(), "top-left");
    m.on("zoomend", () => setZoomedOut(m.getZoom() < TILES_MINZOOM));
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
      // the clicked parcel: a light blue tint inside a thick blue outline on a white edge, so it stands out
      // from the class fills around it
      for (const [id, type, paint] of [
        ["ownership-selected-fill", "fill", { "fill-color": SELECTED_COLOR, "fill-opacity": 0.2 }],
        ["ownership-selected-casing", "line", { "line-color": "#fff", "line-width": 8 }],
        ["ownership-selected", "line", { "line-color": SELECTED_COLOR, "line-width": 4 }],
      ])
        m.addLayer({ id, type, source: "ownership", "source-layer": SOURCE_LAYER, filter: none, paint });
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
      // the parcel under the mouse (or keyboard focus) in the sidebar list: a dark outline on a white
      // edge, or a ringed dot when zoomed out
      for (const [id, paint] of [
        ["list-hover-casing", { "line-color": "#fff", "line-width": 7 }],
        ["list-hover", { "line-color": HOVER_COLOR, "line-width": 3 }],
      ])
        m.addLayer({ id, type: "line", source: "ownership", "source-layer": SOURCE_LAYER, filter: none, paint });
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
      if (owner === LAND_BANK) owner = null;
      if (owner === hoveredOwner) return;
      hoveredOwner = owner;
      m.setFilter("owner-hover", ["==", ["get", "entity_owner"], owner ?? ""]);
    };
    // To avoid flashing: rebuild the card only when the parcel changes, and clear the card and
    // outlines a moment after leaving, so crossing a street between parcels doesn't blink them.
    let hoveredParcel = null;
    let clearTimer = null;
    const hover = (e) => {
      const p = e.features?.[0]?.properties;
      if (!p) return;
      clearTimeout(clearTimer);
      m.getCanvas().style.cursor = "pointer";
      tip.setLngLat(e.lngLat);
      if (p.parcel_id !== hoveredParcel) {
        hoveredParcel = p.parcel_id;
        // dots carry their address; parcel fills take it from the base map's parcel tiles
        const address = p.address ?? m.queryRenderedFeatures(e.point, { layers: ["parcel-fill"] })[0]?.properties?.address;
        tip.setDOMContent(hoverCard(address, p));
        setHoveredOwner(p.is_verified === 1 ? p.entity_owner : null);
      }
      if (!tip.isOpen()) tip.addTo(m);
    };
    const leave = () => {
      m.getCanvas().style.cursor = "";
      clearTimeout(clearTimer);
      clearTimer = setTimeout(() => {
        hoveredParcel = null;
        tip.remove();
        setHoveredOwner(null);
      }, 150);
    };
    // click a parcel (or its dot when zoomed out): show its owner's cluster and list. A click on the
    // shown owner's own parcel keeps the owner's list; a dot also flies in to the parcel.
    const pick = (e) => {
      const f = e.features?.[0];
      if (!f?.properties?.parcel_id) return;
      if (f.properties.entity_owner !== ownerRef.current) setOwnerFilter("");
      if (f.layer.id === "filtered-dots") flyOnLoad.current = f.properties.parcel_id;
      setSelected(f.properties);
    };
    for (const layer of ["ownership-fill", "filtered-dots"]) {
      m.on("mousemove", layer, hover);
      m.on("mouseleave", layer, leave);
      m.on("click", layer, pick);
    }
    return () => m.remove();
  }, [token]);

  useEffect(() => {
    if (!map) return;
    showSatellite(map, satellite);
  }, [map, satellite]);

  useEffect(() => {
    if (!selected?.parcel_id) return setLive(null);
    loadSelected(selected.parcel_id, "parcel");
    setFailed(null);
    let cancelled = false;
    query({
      where: `parcel_id = '${sql(selected.parcel_id)}'`,
      outFields: "parcel_id,entity_cluster,entity_owner,entity_owner_type,is_verified",
      returnGeometry: false,
    })
      .then((r) => !cancelled && setLive(r.features[0]?.attributes ?? null))
      .catch(() => !cancelled && setFailed("Couldn't load this parcel's owner."));
    return () => {
      cancelled = true;
    };
  }, [selected?.parcel_id, attempt]);

  // address search or ?parcel= -> select it straight away (its card, not the details panel; owner
  // and cluster come from the live layer), and fly there once its parcel record has the geometry
  const goToParcel = (pid) => {
    setOwnerFilter("");
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

  // The URL holds the view: ?owner=<exact name>, ?parcel=<parcel_id>, or both (a parcel opened from
  // an owner's list). Each change is a history entry, so links can be shared and Back steps back.
  // URL -> view: on load, and on Back/Forward
  const urlOwner = params.get("owner") ?? "";
  const urlParcel = params.get("parcel") ?? "";
  useEffect(() => {
    if (!map) return;
    paramsApplied.current = true;
    if (urlOwner !== ownerFilter) {
      fitOnLoad.current = !!urlOwner && !urlParcel;
      setOwnerFilter(urlOwner);
      setSearch(urlOwner);
    }
    if (urlParcel !== (selected?.parcel_id ?? "")) {
      flyOnLoad.current = urlParcel || null;
      setSelected(urlParcel ? { parcel_id: urlParcel } : null);
    }
    if (!urlOwner && !urlParcel) setSearch("");
  }, [map, urlOwner, urlParcel]);
  // view -> URL
  useEffect(() => {
    if (!paramsApplied.current) return;
    const pid = selected?.parcel_id ?? "";
    if (ownerFilter === urlOwner && pid === urlParcel) return;
    setParams({ ...(ownerFilter && { owner: ownerFilter }), ...(pid && { parcel: pid }) });
  }, [ownerFilter, selected?.parcel_id]);

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
    // the shown set a little stronger; everything else keeps its class color, faded to 10% for context
    map.setPaintProperty("ownership-fill", "fill-opacity", match ? ["case", match, 0.7, 0.1] : FILL_OPACITY);
    // the shown verified owner's parcels (fills, and dots when zoomed out) all take OWNER_COLOR
    const shownOwner = ownerFilter || owner;
    map.setPaintProperty(
      "ownership-fill",
      "fill-color",
      shownOwner ? ["case", ["==", ["get", "entity_owner"], shownOwner], OWNER_COLOR, classColor] : classColor
    );
    // the dots are only the shown set, so its verified ones are that owner's
    map.setPaintProperty("filtered-dots", "circle-color", shownOwner ? ["case", isVerified, OWNER_COLOR, classColor] : classColor);
    const sel = ["==", ["get", "parcel_id"], selected?.parcel_id ?? ""];
    for (const id of ["ownership-selected-fill", "ownership-selected-casing", "ownership-selected"]) map.setFilter(id, sel);
    // a clicked parcel's cluster: mark its unverified ("possible") parcels
    const possible = selected && !ownerFilter ? parcels.filter((p) => p.is_verified !== 1).map((p) => p.parcel_id) : [];
    const possibleFilter = ["match", ["get", "parcel_id"], possible.length ? possible : [""], true, false];
    map.setFilter("possible-fill", possibleFilter);
    map.setFilter("possible-line", possibleFilter);
  }, [map, ownerFilter, selected, selectedOwner, parcels]);

  useEffect(() => {
    if (!map) return;
    const f = ["==", ["get", "parcel_id"], hoverId ?? ""];
    for (const id of ["list-hover-casing", "list-hover", "list-hover-dot"]) map.setFilter(id, f);
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
      setOwnersError(false);
    })().catch(() => {
      setOwnersError(true);
      ownersRequested.current = false; // try again next time the box opens
    });
  }, [map, searchOpen]);

  // the cluster's or owner's parcels: the sidebar list, and dots below TILES_MINZOOM.
  // Keyed on the list it shows, so an owner's list stays put while one of their parcels is open.
  const listKey = ownerWhere || clusterWheres.join("|");
  useEffect(() => {
    if (!map) return;
    setFailed(null);
    const all = ownerWhere ? [ownerWhere] : clusterWheres;
    const wheres = all.filter((w) => w !== LAND_BANK_WHERE);
    const dots = map.getSource("filtered-dots");
    dots.setData({ type: "FeatureCollection", features: [] });
    setParcels([]);
    setLandBank(null);
    setListLimit(LIST_PAGE);
    setListFilter("");
    if (!all.length) return;
    let cancelled = false;
    const hasLandBank = wheres.length < all.length;
    if (hasLandBank) {
      setLandBank({ count: null });
      query({ where: LAND_BANK_WHERE, returnCountOnly: true })
        .then((r) => !cancelled && setLandBank({ count: r.count }))
        .catch(() => !cancelled && setFailed("Couldn't count the Land Bank's properties."));
    }
    const fit = (list) => {
      if (!fitOnLoad.current) return;
      fitOnLoad.current = false;
      fitParcels(list, hasLandBank);
    };
    if (!wheres.length) {
      fit([]);
      return () => {
        cancelled = true;
      };
    }
    setLoadingParcels(true);
    Promise.all(wheres.map(fetchParcels))
      .then((lists) => {
        const list = lists.length === 1 ? lists[0] : sortByAddress([...new Map(lists.flat().map((p) => [p.parcel_id, p])).values()]);
        if (cancelled) return;
        setParcels(list);
        fit(list);
        dots.setData({
          type: "FeatureCollection",
          features: list.map((p) => ({
            type: "Feature",
            geometry: { type: "Point", coordinates: [p.lng, p.lat] },
            properties: {
              parcel_id: p.parcel_id,
              address: p.address,
              is_verified: p.is_verified,
              entity_owner: p.entity_owner,
              entity_owner_type: p.entity_owner_type,
            },
          })),
        });
      })
      .catch(() => !cancelled && setFailed("Couldn't load the properties."))
      .finally(() => !cancelled && setLoadingParcels(false));
    return () => {
      cancelled = true;
      setLoadingParcels(false);
    };
  }, [map, listKey, attempt]);

  // while the Land Bank is shown, list its parcels in view whenever the map settles
  useEffect(() => {
    if (!map || !landBank) return setLandBankRows(null);
    const update = () => {
      const next = landBankInView(map);
      // idle also fires after repaints that don't move the map; keep the same list then
      setLandBankRows((old) => (old?.map((p) => p.parcel_id).join() === next?.map((p) => p.parcel_id).join() ? old : next));
    };
    update();
    map.on("idle", update);
    return () => map.off("idle", update);
  }, [map, !!landBank]);

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
  const listedVerified = parcels.filter((p) => p.is_verified === 1).length;
  const verifiedCount = listedVerified + (landBank?.count ?? 0);
  const possibleCount = parcels.length - listedVerified;
  const shownCount = parcels.length + (landBank?.count ?? 0);
  const countLoading = loadingParcels || landBank?.count === null; // the Land Bank count comes separately

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
  // a list click opens the parcel above the same list (an owner's view stays), and flies the map to it
  const focusParcel = (p) => {
    setSelected({ parcel_id: p.parcel_id, is_verified: p.is_verified, entity_owner: p.entity_owner });
    map.flyTo({ center: [p.lng, p.lat], zoom: Math.max(map.getZoom(), 17), duration: 600 });
    // stacked layout (narrow screens): the map is below the sidebar
    if (window.matchMedia("(max-width: 639px)").matches) mapDiv.current.scrollIntoView({ behavior: "smooth" });
  };
  // the address search's status, while the box still holds that address
  const addressNote =
    searched && search.trim() === searched
      ? geocoding
        ? `Finding “${searched}”…`
        : geocodeError
          ? `No address found for “${searched}”.`
          : geocoded && !geocoded.attributes?.parcel_id
            ? `“${searched}” isn't on a parcel.`
            : null
      : null;

  return (
    <Grid
      columns={{ initial: "1fr", sm: "1fr 3fr" }}
      gap="4"
      p={{ initial: "2", sm: "2", lg: "4" }}
      className="ownership-tool"
    >
      {/* side by side from sm, at a fixed height with the list scrolling; stacked below that, the
          sidebar takes its natural height and the list scrolls inside a capped box */}
      <Box className="relative overflow-hidden sm:h-[80vh] sm:min-h-[400px] sm:min-w-80">
        {/* the owner stays put at the top; only the property list below it scrolls */}
        <Flex direction="column" gap="3" className="h-full">
          <Flex direction="column" gap="3" className="shrink-0">
            <h1 className="text-xl font-bold text-[#004445]">Ownership</h1>

            <Box className="relative">
              <TextField.Root
                placeholder="Search an address or owner…"
                aria-label="Search an address or owner"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={listOpen}
                aria-controls="ownership-options"
                aria-activedescendant={listOpen ? `ownership-option-${activeIndex}` : undefined}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSearchOpen(true);
                  setActive(null);
                }}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setSearchOpen(false)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                    e.preventDefault();
                    setSearchOpen(true);
                    const step = e.key === "ArrowDown" ? 1 : -1;
                    setActive((activeIndex + step + options.length) % options.length);
                  }
                  if (e.key === "Enter") {
                    e.preventDefault();
                    listOpen ? choose(options[activeIndex]) : findAddress();
                  }
                  if (e.key === "Escape") setSearchOpen(false);
                }}
              />
              {listOpen && (
                // floats over the cards below; focus stays in the box (aria-activedescendant), and a
                // click picks on mousedown + preventDefault so the box doesn't blur first
                <div
                  id="ownership-options"
                  role="listbox"
                  aria-label="Address or owner"
                  className="absolute left-0 right-0 top-full z-10 mt-1 flex max-h-80 flex-col overflow-y-auto rounded border border-gray-200 bg-white py-1 shadow-md"
                >
                  {options.map((o, i) => (
                    <Box key={o.address ? "address" : o.entity_owner}>
                      {i === 1 && (
                        <Text as="div" size="1" color="gray" className="border-t border-gray-100 px-2 pb-0.5 pt-1.5" role="presentation">
                          Verified owners
                        </Text>
                      )}
                      <div
                        id={`ownership-option-${i}`}
                        role="option"
                        aria-selected={i === activeIndex}
                        className={`flex cursor-pointer justify-between gap-2 px-2 py-1 text-sm ${i === activeIndex ? "bg-gray-100" : ""}`}
                        onMouseEnter={() => setActive(i)}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          choose(o);
                        }}
                      >
                        {o.address ? (
                          <span>Find address “{search.trim()}”</span>
                        ) : (
                          <>
                            <span>{o.entity_owner}</span>
                            <span className="tabular-nums text-gray-600">{o.n.toLocaleString()}</span>
                          </>
                        )}
                      </div>
                    </Box>
                  ))}
                  {suggestions.length === 0 && (
                    <Text as="div" size="1" color="gray" className="border-t border-gray-100 px-2 pt-1.5" role="presentation">
                      {ownersError ? "Couldn't load owner names. Close and reopen the search to try again." : !owners ? "Loading owner names…" : "No matching verified owners"}
                    </Text>
                  )}
                </div>
              )}
            </Box>

            {!selected && !ownerFilter && (
              <Flex direction="column" gap="2">
                <Text size="2" color="gray">
                  Search for an address or an owner, or zoom in and click a parcel to see its verified owner and
                  everything they own.
                </Text>
                <Text size="1" color="gray">
                  Possible additional properties aren't verified yet, but share an ownership cluster with an owner's
                  verified ones.
                </Text>
              </Flex>
            )}

            {ownerFilter && (
              <Card>
                <Heading
                  title={ownerFilter}
                  sub={
                    !countLoading && !failed && shownCount === 0 ? (
                      "No verified properties under this exact name. Search for the owner to pick it from the list."
                    ) : (
                      <Swatch type="owner">Verified owner · {num(countLoading, shownCount)} properties</Swatch>
                    )
                  }
                />
                {landBank?.count === null && (
                  <Text as="div" size="1" color="gray" mt="1">
                    Counting the Land Bank's properties can take about 10 seconds.
                  </Text>
                )}
                <Flex justify="end" align="center" gap="3" mt="2">
                  <DataSource url={OWNERSHIP_ITEM_URL} />
                </Flex>
              </Card>
            )}

            {selected && (
              <Card>
                <Flex direction="column" gap="3">
                  <Heading
                    title={
                      <>
                        <Swatch type={cluster == null ? "selected" : verified ? "selectedVerified" : "selectedPossible"}>
                          {selectedRecord?.address ?? "…"}
                        </Swatch>
                      </>
                    }
                    sub={selected.parcel_id}
                  />
                  <Box className="rounded bg-gray-50 px-3 py-2">
                    <Text as="div" size="1" color="gray">Verified owner</Text>
                    {cluster == null ? (
                      <Text as="div" size="4" color="gray">…</Text>
                    ) : verified ? (
                      // opens the owner's view (or goes back to it, from a parcel opened in their list)
                      <button
                        className="text-left text-[#004445] underline decoration-[#004445]/30 underline-offset-4 hover:decoration-[#004445]"
                        onClick={() => showOwner(selectedOwner)}
                      >
                        <Text size="5" weight="bold">{selectedOwner}</Text>
                      </button>
                    ) : (
                      <Text as="div" size="5" weight="bold" className="text-gray-600">Not verified</Text>
                    )}
                  </Box>
                  <Rows
                    rows={[
                      verified && ["Owner type", live?.entity_owner_type],
                      // the owner's view above already counts their properties
                      verified && !ownerFilter && ["Verified properties", num(countLoading, verifiedCount), "owner"],
                      verified && !ownerFilter && ["Possible additional", num(loadingParcels, possibleCount), "possible"],
                      cluster != null &&
                        !verified && ["Possible additional", num(loadingParcels, Math.max(parcels.length - 1, 0)), "possible"],
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
                  <Flex justify="end" align="center" gap="3">
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

            {(selected || ownerFilter) && (
              <Flex gap="2" wrap="wrap">
                {!countLoading && shownCount > 1 && (
                  <Button size="1" variant="outline" onClick={() => fitParcels(parcels)}>
                    Zoom to all {shownCount.toLocaleString()} properties
                  </Button>
                )}
                <Button size="1" variant="outline" color="gray" onClick={reset}>
                  Clear selection
                </Button>
              </Flex>
            )}

            <Flex direction="column" gap="2" aria-live="polite">
              {addressNote && <Text size="2" color="gray">{addressNote}</Text>}
              {failed && (
                <Callout.Root size="1" color="red" role="alert">
                  <Flex align="center" justify="between" gap="3">
                    <Callout.Text>{failed}</Callout.Text>
                    <Button size="1" variant="soft" color="red" onClick={retry}>
                      Retry
                    </Button>
                  </Flex>
                </Callout.Root>
              )}
              {loadingParcels && (
                <Flex align="center" gap="2" py="2">
                  <Spinner />
                  <Text size="2" color="gray">Loading properties…</Text>
                </Flex>
              )}
              {landBank && !landBankRows && (
                <Text size="1" color="gray">
                  The Land Bank's verified properties are too many to list. Zoom in to list the ones in view.
                </Text>
              )}
            </Flex>
          </Flex>

            {(rows.length > 1 || (landBank && landBankRows)) && (
              <Flex direction="column" gap="2" className="min-h-0">
                <Text size="2" weight="medium">
                  {!landBank ? "Properties" : parcels.length ? "Possible additional, and Land Bank properties in view" : "Land Bank properties in view"} (
                  {listFilter.trim() ? `${listed.length.toLocaleString()} of ` : ""}
                  {rows.length.toLocaleString()})
                </Text>
                {shownIds.some((id) => pre[id] > 0) && (
                  <Text size="1" color="gray">PRE: a principal residence exemption is claimed on the property.</Text>
                )}
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
                  <Box className="max-h-[50vh] min-h-0 overflow-y-auto rounded border border-gray-200 sm:max-h-none">
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

      <Box className="relative h-[70vh] min-h-[400px] sm:h-[80vh]">
        <div ref={mapDiv} className="h-full" />
        {zoomedOut && (
          <Box className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2">
            <Text size="1" className="whitespace-nowrap rounded-full bg-white px-3 py-1 shadow-md">
              Zoom in to see who owns each parcel
            </Text>
          </Box>
        )}
        <Box style={{ position: "absolute", top: 12, right: 12 }}>
          <SegmentedControl.Root
            size="1"
            value={satellite ? "satellite" : "streets"}
            onValueChange={(v) => setSatellite(v === "satellite")}
            className="bg-white shadow"
          >
            <SegmentedControl.Item value="streets">Streets</SegmentedControl.Item>
            <SegmentedControl.Item value="satellite">Satellite</SegmentedControl.Item>
          </SegmentedControl.Root>
        </Box>
        <Card size="1" style={{ position: "absolute", bottom: 12, left: 12 }}>
          <details open className="group">
            <summary className="flex cursor-pointer select-none list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
              <Text size="1" weight="medium" color="gray">Legend</Text>
              <ChevronDownIcon className="text-gray-500 transition-transform group-open:rotate-180" />
            </summary>
            <Flex direction="column" gap="1" mt="2">
              {CLASSES.map(([label, c]) => (
                <Flex key={label} gap="2" align="center">
                  <Box
                    width="12px"
                    height="12px"
                    style={{ background: c.replace("rgb(", "rgba(").replace(")", `, ${FILL_OPACITY})`), border: "1px solid #8a8a8a" }}
                  />
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
