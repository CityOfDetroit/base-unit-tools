// Proxies Nearmap tiles so the API key stays server-side.
// Public-display terms: no finer than z20 (~6"), Detroit AOI only.
// z21 (~3") is internal-license imagery, served only to City of Detroit ArcGIS org users.

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
  const [z, x, y] = ["z", "x", "y"].map((k) => Number(context.params[k]));
  if (![z, x, y].every(Number.isInteger) || z < 0 || z > 21 || !inBounds(z, x, y)) {
    return new Response("Not found", { status: 404 });
  }

  if (z === 21) {
    const token = req.headers.get("authorization")?.replace(/^Bearer /, "");
    if (!token || !(await isCityEmployee(token))) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const upstream = await fetch(
    `https://api.nearmap.com/tiles/v3/Vert/${z}/${x}/${y}.img?apikey=${process.env.NEARMAP_API_KEY}`,
    { headers: { Referer: "https://baseunits.detroitmi.gov/" } }
  );
  if (!upstream.ok) return new Response(null, { status: upstream.status });

  const headers = { "Content-Type": upstream.headers.get("content-type") || "image/jpeg" };
  if (z === 21) {
    headers["Cache-Control"] = "private, max-age=86400";
  } else {
    headers["Cache-Control"] = "public, max-age=86400";
    headers["Netlify-CDN-Cache-Control"] = "public, max-age=86400, durable";
  }
  return new Response(upstream.body, { headers });
};

export const config = { path: "/nearmap/:z/:x/:y" };
