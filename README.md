# Base Unit Tools

A collection of public-facing apps to enable upkeep and use of the city of Detroit's base units:

- Addresses
- Parcels
- Buildings
- Streets
- and more features to come.

## About this site

This site is built primarily using React, with the following libraries:

- [create-react-app](https://create-react-app.dev/)
- [react-router-dom](https://reactrouter.com/web/guides/quick-start)

for styling/icons:
- [tailwindcss](https://tailwindcss.com/)
- [Font Awesome free icon set](https://fontawesome.com/icons?d=gallery&p=2&m=free)

for mapping/spatial:
- [mapbox-gl-js](https://docs.mapbox.com/mapbox-gl-js/api/) (soon: maplibre.js) 
- [mapillary-js](https://mapillary.github.io/mapillary-js/)
- [esri-arcgis-rest](https://esri.github.io/arcgis-rest-js/)
- [turf.js](https://turfjs.org/)

## Tools

### Explorer

This is a tool for **exploring the base unit relationships**.

We can also display more detailed information about a particular base unit.

This tool should also serve as a jumping off point for other tools, such as the Issue Reporter.

This tool can also be easily linked to from other tools, such as the Geocoder.

This tool accepts URL parameters:

- `type`: one of `addresses`, `buildings`, `parcels`, `streets`
- `id`: the ID of the feature
- `streetview`: should be `true` if you want Mapillary to automatically display.

Example URL: http://localhost:3000/base-unit-tools/explorer?type=buildings&id=653&streetview=true will link directly to CAYMC, with the `StreetView` component activated.

### Issue Reporter

This is a tool for **reporting issues** with an address or base unit.

Once you enter an address, or select a base unit and enter an ID, hit the Search button.

You should then be able to enter the issue in a text box and submit.

If you're a city employee, please **log in** so that your account can be attached to your submission.

This tool accepts one of two sets of URL parameters, either:
- `address`: representing an address string, which will be geocoded by the tools

or, passed together:
- `type`: one of `addresses`, `buildings`, `parcels`, `streets`
- `id`: the ID of the feature

which will be used to look up an existing base unit.

For best use, the issue reporter should be linked from other tools using the `type` and `id` parameters.

### Geocoder

This is a tool for **geocoding & adding information to a list of addresses**. By locating each address (a process known as geocoding), we can tell you more information about each address, like what neighborhood or council district it's in.

- Enter your list of addresses into the text box
- Choose fields to include with output
- Geocode
- Export results to CSV

### Validator

This is a tool for **parsing and validating** a particular address.

At the moment, it only parses an address into its constituent parts.

Eventually, it should validate an address by:

- Verifying that the street name exists
- Matching it to a potential street segment
- ...

### Mailer

This is a tool for **generating a mailing list** based on a particular selection area.

You can select an area from some predetermined boundaries, draw your own shape, or input an address to start your mailing list.

You can also apply a buffer to any shape to comply with distance-based mailing requirements.

After filtering addresses based on their attributes, you can export a .csv of addresses for use in a mail merge.

## Installation

1. Clone the repository
2. Run `yarn` / `npm install` to install dependencies
3. Run `yarn start` to develop at localhost:3000

## Site structure

### Routing

App/URL routing is primarily controlled in `src/App.js`, with `react-router-dom`.

There is a route for each tool which renders that tool. 

The top-level tool components may receive the `session` as a prop if they need to know whether the user is logged in or not.

Many tools accept URL parameters - this is handled by the `useQuery` hook provided by `react-router-dom`.

### Layout/display

The main site layout is controlled by `src/layout/SiteWrapper` -- this is rendered in `App.js` and all tools will fit into the `{children}` slot of the `SiteWrapper`, typically with a `<SiteSidebar>` and a `<main>`:

```js
const NewTool = () => {
  return (
    <>
      <SiteSidebar>
        {...sidebar things}
      </SiteSidebar>
      <main>
        {...main component, maybe a map}
      </main>
    </>
  )
}
```

Logging in is controlled in `src/layout/SiteHeader`, since that is rendered everywhere. That renders a `Login` component which does the work of input and using the esri-arcgis-rest authentication methods.

Most components are styled in-line using Tailwind CSS, but there are a fair number of styles in `src/styles/index.css` as well.

### Sitewide config files

We use a few different files to drive consistent behavior across the site. These files are stored in `src/data`.

- `apps.js` controls the listing of tools.
- `geocoders.js` lists the different geocoders available.
- `layers.js` is a common data structure for the base units.

The basemaps/mapstyles are stored in `src/styles/mapstyle.js`. This file starts with a `baseStyle` and then exports several other functional styles which are derived from the `baseStyle` such as the `satelliteStyle`.

### Sitewide UI components

These are stored in `src/components`.

- `Button` takes a few props such an `icon` and `text`.
