// Long-form reference material published on the site, rendered from MDX in
// src/content/resources/. Add an entry here and a matching .mdx file to
// publish a new resource; the routes and index page pick it up automatically.

// `content` is lazily imported so the prose only loads when someone opens the
// resource — the homepage and footer import this file for titles alone.
import { lazy } from "react";

export const resources = {
  geocoding: {
    slug: "geocoding",
    title: "Address & geocoding primer",
    description:
      "What geocoding is, how the Base Unit Geocoder matches an address, and how to use it from the web interface, a spreadsheet, or your own code.",
    // Originally published on the team site in 2018; endpoints and field names
    // updated for the Base Unit Geocoder.
    published: "2018-06-06",
    updated: "2026-07-24",
    icon: "Crosshair2Icon",
    content: lazy(() => import("../content/resources/geocoding.mdx")),
  },
};

// Index-page ordering: newest update first.
export const resourceList = Object.values(resources).sort((a, b) =>
  b.updated.localeCompare(a.updated)
);

export default resources;
