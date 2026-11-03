// Proxies Nearmap tiles so the API key stays server-side.
// Public-display terms: no finer than z20 (~6"), Detroit AOI only.
// z21 (~3") and past captures (?until=YYYY-MM-DD) are served only to City of Detroit ArcGIS org users.
// /nearmap/coverage?lon=&lat= lists capture dates at a point, newest first.

const BOUNDS = [-83.29, 42.2549, -82.91, 42.4505]; // keep in sync with the satellite source in src/styles/mapstyle.js
const DETROIT_ORG_ID = "qvkbeam7Wirps6zC";
const PORTAL = "https://detroitmi.maps.arcgis.com";
const ORG_CHECK_TTL = 10 * 60 * 1000;

const orgChecks = new Map(); // token -> { ok, expires }

const tileLon = (x, z) => (x / 2 ** z) * 360 - 180;
const tileLat = (y, z) => (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / 2 ** z))) * 180) / Math.PI;

const inBounds = (z, x, y) => {
  const [w, s, e, n] = BOUNDS;
  return tileLon(x, z) < e && tileLon(x + 1, z) > w && tileLat(y + 1, z) < n && tileLat(y, z) > s;
};

const NEARMAP_HEADERS = { headers: { Referer: "https://baseunits.detroitmi.gov/" } };

const coverage = async (url) => {
  const [lon, lat] = ["lon", "lat"].map((k) => Number(url.searchParams.get(k)));
  const [w, s, e, n] = BOUNDS;
  if (!(lon > w && lon < e && lat > s && lat < n)) return new Response("Not found", { status: 404 });
  const upstream = await fetch(
    `https://api.nearmap.com/coverage/v2/point/${lon},${lat}?resources=tiles:Vert&limit=100&apikey=${process.env.NEARMAP_API_KEY}`,
    NEARMAP_HEADERS
  );
  if (!upstream.ok) return new Response(null, { status: upstream.status });
  const { surveys = [] } = await upstream.json();
  return Response.json([...new Set(surveys.map((s) => s.captureDate))], {
    headers: { "Cache-Control": "public, max-age=86400", "Netlify-CDN-Cache-Control": "public, max-age=86400, durable" },
  });
};

const isCityEmployee = async (token) => {
  const cached = orgChecks.get(token);
  if (cached && cached.expires > Date.now()) return cached.ok;
  const self = await fetch(`${PORTAL}/sharing/rest/community/self?f=json&token=${encodeURIComponent(token)}`)
    .then((r) => r.json())
    .catch(() => null);
  const ok = self?.orgId === DETROIT_ORG_ID;
  orgChecks.set(token, { ok, expires: Date.now() + ORG_CHECK_TTL });
  return ok;
};

export default async (req, context) => {
  const url = new URL(req.url);
  if (url.pathname === "/nearmap/coverage") return coverage(url);

  const until = url.searchParams.get("until");
  if (until !== null && !/^\d{4}-\d{2}-\d{2}$/.test(until)) return new Response("Bad until", { status: 400 });
  const [z, x, y] = ["z", "x", "y"].map((k) => Number(context.params[k]));
  if (![z, x, y].every(Number.isInteger) || z < 0 || z > 21 || !inBounds(z, x, y)) {
    return new Response("Not found", { status: 404 });
  }

  const restricted = z === 21 || until !== null;
  if (restricted) {
    const token = req.headers.get("authorization")?.replace(/^Bearer /, "");
    if (!token || !(await isCityEmployee(token))) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const upstream = await fetch(
    `https://api.nearmap.com/tiles/v3/Vert/${z}/${x}/${y}.img?apikey=${process.env.NEARMAP_API_KEY}${until ? `&until=${until}` : ""}`,
    NEARMAP_HEADERS
  );
  if (!upstream.ok) return new Response(null, { status: upstream.status });

  const headers = { "Content-Type": upstream.headers.get("content-type") || "image/jpeg" };
  if (restricted) {
    headers["Cache-Control"] = "private, max-age=86400";
  } else {
    headers["Cache-Control"] = "public, max-age=86400";
    headers["Netlify-CDN-Cache-Control"] = "public, max-age=86400, durable";
  }
  return new Response(upstream.body, { headers });
};

export const config = { path: ["/nearmap/coverage", "/nearmap/:z/:x/:y"] };
