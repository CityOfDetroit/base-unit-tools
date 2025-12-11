# Base Unit Tools

A City of Detroit web application for exploring and inspecting the city's base units: **addresses**, **parcels**, **buildings**, and **streets**.

**Live site:** https://base-unit-tools.netlify.app

## What are Base Units?

Base units are the fundamental geographic units used to describe Detroit. Every location in the city can be identified by its relationship to these four types:

- **Addresses** - Street addresses (e.g., 2 Woodward Ave)
- **Parcels** - Land parcels identified by parcel ID
- **Buildings** - Building footprints
- **Streets** - Street segments

## Tools

### Map Explorer (`/map`)
Interactive map for inspecting base units. Click any feature to view its attributes and relationships.

- Search by address, parcel ID, or intersection
- Filter click interactions by mode (parcels, buildings, or streets)
- View Mapillary street imagery with historical date selection
- Drag the divider to resize panel widths

#### URL Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `id` | Feature ID to select | `id=01001234.` (parcel) or `id=12345` (building/street) |
| `layer` | Layer type | `layer=parcel`, `layer=building`, `layer=street`, `layer=address` |
| `mode` | Click interaction mode | `mode=all` (default), `mode=parcel`, `mode=building`, `mode=street` |
| `streetview` | Open street view panel | `streetview=true` |
| `streetviewdate` | Select imagery nearest to date | `streetviewdate=20240315` (YYYYMMDD format) |

**Example URLs:**
- `/map?id=01001234.&layer=parcel` - View a specific parcel
- `/map?id=12345&layer=building&streetview=true` - View building with street view open
- `/map?id=01001234.&layer=parcel&streetview=true&streetviewdate=20230601` - Parcel with June 2023 imagery

### Geocoder (`/geocoder`)
Batch geocoding tool for enriching address data.

- Upload a CSV containing Detroit addresses
- Each address is matched against the City's geocoder
- Download results with parcel IDs, coordinates, council district, and other attributes
- Supports partial matches and displays match quality scores

### Mailer (`/mailer`)
*City employees only.* Generate mailing lists of property owners within a geographic area.

- Draw a polygon, line, or point on the map
- Or select from preset boundaries (neighborhoods, council districts, etc.)
- Apply buffers to expand or create ring-shaped selections
- Download address lists as CSV for mail campaigns

## Development

```bash
npm install    # Install dependencies
npm start      # Start dev server at http://localhost:5173
npm run build  # Production build to dist/
npm run serve  # Preview production build
```

## Tech Stack

- **React 18** + **Vite**
- **MapLibre GL JS** for mapping
- **Radix UI** + **Tailwind CSS** for styling
- **ArcGIS REST APIs** for feature services and geocoding
- **Mapillary** for street-level imagery

## Deployment

Deployed to Netlify and Cloudflare Pages. Build output is the `dist/` folder.

## Data Sources

- Feature services hosted on ArcGIS Online (`services2.arcgis.com`)
- City of Detroit Geocoder (`opengis.detroitmi.gov`)
- Mapillary street imagery (captured by `codgis`)

## License

MIT License - see [LICENSE](LICENSE)
