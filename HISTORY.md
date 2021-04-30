# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.3.1 - 2021-04-30

### Added

- Linen map mosaic as basemap option for Explorer map
- Display parcel lines for parcel-based Mailer output

### Changes

- Migrate to a new hosted feature service, which should be snappier with indexes on ID fields
- Migrate to a new geocoder which should be more reliable
- Explorer: more information on the Streets layer will display

## 1.3.0 - 2021-04-23

### Added

- Linker tool to visually edit address links on the map
- Each app now has a header on the sidebar where instruction and settings can be hidden/unfurled
- custom React Hooks in `/src/hooks`: `useFeature`, `useGeocoder`, `useQuery`. These mostly wrap Esri's library and some of our own logic.

### Changes

- Mailer tool can now select between centroid- and parcel- based intersection
- Mailer tool has more boundaries available 
- Mailer tool can export GeoJSON results
- Explorer map will start at the CoD bounding box

## 1.2.1 - 2021-04-01

### Changes

- Mailer tool
  - pull draw controls out of map into sidebar
  - sort layer features on layer selector
  - ability to create address
  - move user through app flow more explicitly∏
  - make a new ToggleButton for filters

## 1.2.0 - 2021-03-29

### Added

- Mailer tool
- Satellite imagery available in explorer

### Fixed

- ArcGIS Online login is available from any tool without interruption.

## 1.1.0 - 2021-03-12

### Added

- Explorer now has a street view option

### Fixed

- Issue reporter will thank you for submitting an issue

## 1.0.0 - 2021-02-04

Initial release, with geocoder tool, cloned from https://cityofdetroit.github.io/geocode