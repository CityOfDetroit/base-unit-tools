import layers from "../data/layers";

export const baseStyle = {
  version: 8,
  sprite: "https://www.arcgis.com/sharing/rest/content/items/4776d8df881443c48630a6e02d9d26f4/resources/sprites/sprite-1765410154274",
  glyphs:
    "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/resources/fonts/{fontstack}/{range}.pbf",
  sources: {
    esri: {
      type: "vector",
      tiles: [
        "https://tiles.arcgis.com/tiles/qvkbeam7Wirps6zC/arcgis/rest/services/Basemap_Dynamic_Detail/VectorTileServer/tile/{z}/{y}/{x}.pbf",
      ],
    },
    labels: {
      type: "vector",
      tiles: [
        "https://tiles.arcgis.com/tiles/qvkbeam7Wirps6zC/arcgis/rest/services/Basemap_Dynamic_Labels/VectorTileServer/tile/{z}/{y}/{x}.pbf",
      ],
    },
    baseunits: {
      "type": "vector",
      "bounds": [
        -83.2878,
        42.255,
        -82.9105,
        42.4504
      ],
      "minzoom": 0,
      "maxzoom": 23,
      "scheme": "xyz",
      "url": "https://tiles.arcgis.com/tiles/qvkbeam7Wirps6zC/arcgis/rest/services/BaseUnitServices/VectorTileServer",
      "tiles": [
        "https://tiles.arcgis.com/tiles/qvkbeam7Wirps6zC/arcgis/rest/services/BaseUnitServices/VectorTileServer/tile/{z}/{y}/{x}.pbf"
      ]
    },
    bu_features: {
      "type": "vector",
      "bounds": [
        -83.2878,
        42.255,
        -82.9105,
        42.4504
      ],
      "minzoom": 0,
      "maxzoom": 23,
      "scheme": "xyz",
      "url": "https://vectortileservices2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/BaseUnitFeatures_vector_tiles/VectorTileServer",
      "tiles": [
        "https://vectortileservices2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/BaseUnitFeatures_vector_tiles/VectorTileServer/tile/{z}/{y}/{x}.pbf"
      ]
    },
    bu_parcels: {
      "type": "vector",
      "bounds": [
        -83.2878,
        42.255,
        -82.9105,
        42.4504
      ],
      "minzoom": 0,
      "maxzoom": 23,
      "scheme": "xyz",
      "url": "https://vectortileservices2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/Parcels_(Current)_vector_tiles/VectorTileServer",
      "tiles": [
        "https://vectortileservices2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/Parcels_(Current)_vector_tiles/VectorTileServer/tile/{z}/{y}/{x}.pbf"
      ]
    },
    satellite: {
      type: "raster",
      tiles: [
        "https://tiles.arcgis.com/tiles/qvkbeam7Wirps6zC/arcgis/rest/services/MiSAIL_2020_6in_Clip_webMerc/MapServer/tile/{z}/{y}/{x}",
      ],
    },
    "linen-map": {
      type: "raster",
      tiles: [
        "https://tiles.arcgis.com/tiles/qvkbeam7Wirps6zC/arcgis/rest/services/Linen_Map_Mosaic/MapServer/tile/{z}/{y}/{x}",
      ],
    },
    result: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    },
    "new-point": {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    },
    mly: {
      type: "vector",
      tiles: [
        "https://tiles.mapillary.com/maps/vtp/mly1_computed_public/2/{z}/{x}/{y}?access_token=MLY|4690399437648324|de87555bb6015affa20c3df794ebab15",
      ],
      maxzoom: 14,
      minzoom: 14,
    },
    projects: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    },
    "current-project": {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    },
  },
  layers: [
    {
      id: "satellite",
      type: "raster",
      source: "satellite",
      minzoom: 0,
      maxzoom: 22,
      paint: {
        "raster-opacity": 1,
        "raster-saturation": -0.75,
      },
      layout: {
        visibility: "none",
      },
    },
    {
      id: "linen-map",
      type: "raster",
      source: "linen-map",
      minzoom: 0,
      maxzoom: 22,
      paint: {
        "raster-opacity": {
          stops: [
            [0, 1],
            [15, 1],
            [22, 0.5]
          ]
        },
        "raster-saturation": 0,
      },
      layout: {
        visibility: "none",
      },
    },
    {
      "id": "BasemapClipExtent/1",
      "type": "fill",
      "source": "esri",
      "source-layer": "BasemapClipExtent",
      "layout": {

      },
      "paint": {
        "fill-color": "#FFFFFF"
      },
      "minzoom": 9
    },
    {
      "id": "Reference Polygons/Landmarks",
      "type": "fill",
      "source": "esri",
      "source-layer": "Landmarks",
      "layout": {

      },
      "paint": {
        "fill-color": "#E0E0E0"
      },
      "minzoom": 10
    },
    {
      "id": "Reference Polygons/Golfcourse",
      "type": "fill",
      "source": "esri",
      "source-layer": "Golfcourse",
      "layout": {
        "visibility": "none"
      },
      "paint": {
        "fill-color": "#9FD5B3"
      },
      "minzoom": 10
    },
    {
      "id": "Reference Polygons/Cemetery/1",
      "type": "fill",
      "source": "esri",
      "source-layer": "Cemetery",
      "layout": {
        "visibility": "none"
      },
      "paint": {
        "fill-color": "#9FD5B3"
      },
      "minzoom": 10
    },
    {
      "id": "Reference Polygons/Cemetery/0",
      "type": "fill",
      "source": "esri",
      "source-layer": "Cemetery",
      "layout": {

      },
      "paint": {
        "fill-pattern": "Reference Polygons/Cemetery/0"
      },
      "minzoom": 10
    },
    {
      "id": "Reference Polygons/Parks",
      "type": "fill",
      "source": "esri",
      "source-layer": "Parks",
      "layout": {
        "visibility": "none"
      },
      "paint": {
        "fill-color": "#9FD5B3"
      },
      "minzoom": 10
    },
    {
      "id": "Hydro/Hydro Poly",
      "type": "fill",
      "source": "esri",
      "source-layer": "Hydro Poly",
      "layout": {

      },
      "paint": {
        "fill-color": "#BFBFBF"
      },
      "minzoom": 10
    },
    {
      "id": "Hydro/Hydro Line",
      "type": "line",
      "source": "esri",
      "source-layer": "Hydro Line",
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#BFBFBF",
        "line-width": {
          "base": 1,
          "stops": [
            [11, 0.2],
            [12, 0.4],
            [13, 0.8],
            [14, 1.5],
            [15, 3],
            [16, 6],
            [17, 12],
            [18, 24]
          ]
        }
      },
      "minzoom": 10
    },
    {
      "id": "Hydro/Detroit River",
      "type": "fill",
      "source": "esri",
      "source-layer": "Detroit River",
      "layout": {

      },
      "paint": {
        "fill-color": "#BFBFBF"
      }
    },
    {
      "id": "Runway",
      "type": "fill",
      "source": "esri",
      "source-layer": "Runway",
      "layout": {

      },
      "paint": {
        "fill-color": "#FFFFFF"
      },
      "minzoom": 11
    },
    {
      "id": "Roads/Freeway",
      "type": "line",
      "source": "esri",
      "source-layer": "Roads",
      "filter": [
        "==",
        "_symbol",
        0],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#EBEBEB",
        "line-width": {
          "base": 1,
          "stops": [
            [11, 0.9],
            [12, 1.8],
            [13, 3.6],
            [14, 7.2],
            [15, 14.4],
            [16, 28.8],
            [17, 57.6],
            [18, 115.2]
          ]
        }
      },
      "minzoom": 9,
      "maxzoom": 15
    },
    {
      "id": "Roads/Ramp",
      "type": "line",
      "source": "esri",
      "source-layer": "Roads",
      "filter": [
        "==",
        "_symbol",
        1],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#EBEBEB",
        "line-width": {
          "base": 1,
          "stops": [
            [11, 0.6],
            [12, 1.1],
            [13, 2.3],
            [14, 4.5],
            [15, 9],
            [16, 18],
            [17, 36],
            [18, 72]
          ]
        }
      },
      "maxzoom": 15,
      "minzoom": 10
    },
    {
      "id": "Roads/Major",
      "type": "line",
      "source": "esri",
      "source-layer": "Roads",
      "filter": [
        "==",
        "_symbol",
        2],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#EBEBEB",
        "line-width": {
          "base": 1,
          "stops": [
            [11, 0.9],
            [12, 1.8],
            [13, 3.6],
            [14, 7.2],
            [15, 14.4],
            [16, 28.8],
            [17, 57.6],
            [18, 115.2]
          ]
        }
      },
      "minzoom": 9,
      "maxzoom": 15
    },
    {
      "id": "Roads/Principal Arterial",
      "type": "line",
      "source": "esri",
      "source-layer": "Roads",
      "filter": [
        "==",
        "_symbol",
        3],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#EBEBEB",
        "line-width": {
          "base": 1,
          "stops": [
            [11, 0.8],
            [12, 1.5],
            [13, 3],
            [14, 6],
            [15, 12],
            [16, 24],
            [17, 48],
            [18, 96]
          ]
        }
      },
      "maxzoom": 15,
      "minzoom": 10
    },
    {
      "id": "Roads/Small",
      "type": "line",
      "source": "esri",
      "source-layer": "Roads",
      "filter": [
        "==",
        "_symbol",
        4],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#EBEBEB",
        "line-width": {
          "base": 1,
          "stops": [
            [11, 0.6],
            [12, 1.1],
            [13, 2.3],
            [14, 4.5],
            [15, 9],
            [16, 18],
            [17, 36],
            [18, 72]
          ]
        }
      },
      "maxzoom": 15,
      "minzoom": 10
    },
    {
      "id": "Roads/Local",
      "type": "line",
      "source": "esri",
      "source-layer": "Roads",
      "filter": [
        "==",
        "_symbol",
        5],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#EBEBEB",
        "line-width": {
          "base": 1,
          "stops": [
            [11, 0.4],
            [12, 0.8],
            [13, 1.5],
            [14, 3],
            [15, 6],
            [16, 12],
            [17, 24],
            [18, 48]
          ]
        }
      },
      "maxzoom": 15,
      "minzoom": 11
    },
    {
      "id": "Roads/Other Small",
      "type": "line",
      "source": "esri",
      "source-layer": "Roads",
      "filter": [
        "==",
        "_symbol",
        6],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#EBEBEB",
        "line-width": {
          "base": 1,
          "stops": [
            [11, 0.2],
            [12, 0.4],
            [13, 0.8],
            [14, 1.5],
            [15, 3],
            [16, 6],
            [17, 12],
            [18, 24]
          ]
        }
      },
      "maxzoom": 15,
      "minzoom": 12
    },
    {
      "id": "Impervious Surface/Details",
      "type": "fill",
      "source": "esri",
      "source-layer": "Impervious Surface",
      "filter": [
        "==",
        "_symbol",
        1],
      "layout": {

      },
      "paint": {
        "fill-color": "#F2F2F2"
      },
      "minzoom": 16
    },
    {
      "id": "Impervious Surface/Roads",
      "type": "fill",
      "source": "esri",
      "source-layer": "Impervious Surface",
      "filter": [
        "==",
        "_symbol",
        0],
      "layout": {

      },
      "paint": {
        "fill-color": "#EBEBEB",
        "fill-outline-color": "#BFBFBF"
      },
      "minzoom": 15
    },
    {
      "id": "Building Footprints/Buildings",
      "type": "fill",
      "source": "esri",
      "source-layer": "Building Footprints",
      "filter": [
        "==",
        "_symbol",
        0],
      "layout": {
        "visibility": "none"
      },
      "paint": {
        "fill-color": {
          "base": 1,
          "stops": [
            [14, "#E0E0E0"
            ],
            [15, "#d7d7d7"
            ]
          ]
        },
        "fill-outline-color": {
          "base": 1,
          "stops": [
            [14, "#E0E0E0"
            ],
            [15, "#BDBDBD"
            ]
          ]
        }
      },
      "minzoom": 14
    },
    {
      "id": "Borders/International",
      "type": "line",
      "source": "esri",
      "source-layer": "International",
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#9C9C9C",
        "line-width": 1.33333,
        "line-dasharray": [8, 4]
      },
      "minzoom": 10
    },
    {
      "id": "Borders/Detroit",
      "type": "line",
      "source": "esri",
      "source-layer": "Detroit",
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#004445",
        "line-width": 4
      }
    },
    {
      id: "parcel-linked",
      type: "fill",
      "source": "bu_parcels",
      "source-layer": "Parcels (Current)",
      minzoom: 11,
      filter: ["==", "parcel_id", ""],
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": layers["parcel"].color,
        "fill-opacity": {
          base: 1,
          stops: [
            [12, 0],
            [12.1, 0.1],
            [12.5, 0.25],
            [22, 0.25],
          ],
        },
      },
    },
    {
      id: "parcel-fill",
      type: "fill",
      "source": "bu_parcels",
      "source-layer": "Parcels (Current)",
      interactive: true,
      minzoom: 12,
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": "rgba(0,0,0,0)",
      },
    },
    {
      id: "streets-highlight",
      type: "line",
      source: "baseunits",
      "source-layer": "streets",
      filter: ["==", "$id", ""],
      minzoom: 14,
      layout: {
        visibility: "visible",
      },
      paint: {
        "line-width": {
          stops: [
            [11, 3],
            [15, 5.5],
            [20, 42],
          ],
        },
        "line-color": layers["street"].color,
        "line-opacity": 0.45,
      },
    },
    {
      id: "streets-linked",
      type: "line",
      source: "baseunits",
      "source-layer": "streets",
      filter: ["==", "$id", ""],
      minzoom: 14,
      layout: {
        visibility: "visible",
      },
      paint: {
        "line-width": {
          stops: [
            [11, 3],
            [15, 5.5],
            [20, 42],
          ],
        },
        "line-color": layers["street"].color,
        "line-opacity": 0.65,
      },
    },
    {
      id: "streets-line",
      type: "line",
      source: "baseunits",
      "source-layer": "streets",
      minzoom: 11,
      layout: {
        visibility: "visible",
      },
      paint: {
        "line-width": {
          stops: [
            [11, 1],
            [15, 2],
            [20, 25],
          ],
        },
        "line-color": "#ccc",
        "line-opacity": 0.55,
      },
    },
    {
      "id": "Roads/label/Local",
      "type": "symbol",
      "source": "labels",
      "source-layer": "Roads/label",
      "filter": [
        "==",
        "_label_class",
        4],
      "layout": {
        "visibility": "visible",
        "text-size": 12,
        "icon-size": 1,
        "text-font": [
          "Montserrat Regular"
        ],
        "text-max-width": 10,
        "text-line-height": 1.2,
        "text-padding": 2,
        "text-letter-spacing": 0.2,
        "text-allow-overlap": false,
        "text-ignore-placement": false,
        "text-justify": "center",
        "text-rotation-alignment": "auto",
        "text-optional": true,
        "icon-allow-overlap": false,
        "icon-optional": false,
        "icon-ignore-placement": false,
        "icon-rotation-alignment": "auto",
        "symbol-placement": "line",
        "symbol-avoid-edges": false,
        "symbol-spacing": 250,
        "text-anchor": "center",
        "icon-anchor": "center",
        "icon-offset": [0, 0],
        "text-offset": [0, 0],
        "icon-rotate": 0,
        "text-rotate": 0,
        "text-max-angle": 45,
        "text-field": "{_name}",
        "text-transform": "none"
      },
      "paint": {
        "icon-opacity": 1,
        "text-opacity": 1,
        "text-halo-color": "rgba(255,255,255,0.5)",
        "text-halo-width": 0.533333,
        "text-halo-blur": 0,
        "text-translate-anchor": "map",
        "icon-translate-anchor": "map",
        "icon-translate": [0, 0],
        "text-translate": [0, 0]
      },
      "showProperties": false
    },
    {
      "id": "Roads/label/Arterial",
      "type": "symbol",
      "source": "labels",
      "source-layer": "Roads/label",
      "filter": [
        "==",
        "_label_class",
        5],
      "layout": {
        "visibility": "visible",
        "text-size": 12,
        "icon-size": 1,
        "text-font": [
          "Montserrat Regular"
        ],
        "text-max-width": 10,
        "text-line-height": 1.2,
        "text-padding": 2,
        "text-letter-spacing": 0.2,
        "text-allow-overlap": false,
        "text-ignore-placement": false,
        "text-justify": "center",
        "text-rotation-alignment": "auto",
        "text-optional": true,
        "icon-allow-overlap": false,
        "icon-optional": false,
        "icon-ignore-placement": false,
        "icon-rotation-alignment": "auto",
        "symbol-placement": "line",
        "symbol-avoid-edges": false,
        "symbol-spacing": 250,
        "text-anchor": "center",
        "icon-anchor": "center",
        "icon-offset": [0, 0],
        "text-offset": [0, 0],
        "icon-rotate": 0,
        "text-rotate": 0,
        "text-max-angle": 45,
        "text-field": "{_name}",
        "text-transform": "none"
      },
      "paint": {
        "icon-opacity": 1,
        "text-opacity": 1,
        "text-halo-color": "rgba(255,255,255,0.5)",
        "text-halo-width": 0.533333,
        "text-halo-blur": 0,
        "text-translate-anchor": "map",
        "icon-translate-anchor": "map",
        "icon-translate": [0, 0],
        "text-translate": [0, 0]
      },
      "showProperties": false
    },
    {
      "id": "Roads/label/Arterial (+)",
      "type": "symbol",
      "source": "labels",
      "source-layer": "Roads/label",
      "filter": [
        "==",
        "_label_class",
        3],
      "layout": {
        "visibility": "visible",
        "text-size": 12,
        "icon-size": 1,
        "text-font": [
          "Montserrat Regular"
        ],
        "text-max-width": 10,
        "text-line-height": 1.2,
        "text-padding": 2,
        "text-letter-spacing": 0.2,
        "text-allow-overlap": false,
        "text-ignore-placement": false,
        "text-justify": "center",
        "text-rotation-alignment": "auto",
        "text-optional": true,
        "icon-allow-overlap": false,
        "icon-optional": false,
        "icon-ignore-placement": false,
        "icon-rotation-alignment": "auto",
        "symbol-placement": "line",
        "symbol-avoid-edges": false,
        "symbol-spacing": 250,
        "text-anchor": "center",
        "icon-anchor": "center",
        "icon-offset": [0, 0],
        "text-offset": [0, 0],
        "icon-rotate": 0,
        "text-rotate": 0,
        "text-max-angle": 45,
        "text-field": "{_name}",
        "text-transform": "none"
      },
      "paint": {
        "icon-opacity": 1,
        "text-opacity": 1,
        "text-halo-color": "rgba(255,255,255,0.5)",
        "text-halo-width": 0.533333,
        "text-halo-blur": 0,
        "text-translate-anchor": "map",
        "icon-translate-anchor": "map",
        "icon-translate": [0, 0],
        "text-translate": [0, 0]
      },
      "showProperties": false
    },
    {
      "id": "Roads/label/Major Arterial",
      "type": "symbol",
      "source": "labels",
      "source-layer": "Roads/label",
      "filter": [
        "==",
        "_label_class",
        2],
      "layout": {
        "visibility": "visible",
        "text-size": 12,
        "icon-size": 1,
        "text-font": [
          "Montserrat Regular"
        ],
        "text-max-width": 10,
        "text-line-height": 1.2,
        "text-padding": 2,
        "text-letter-spacing": 0.2,
        "text-allow-overlap": false,
        "text-ignore-placement": false,
        "text-justify": "center",
        "text-rotation-alignment": "auto",
        "text-optional": true,
        "icon-allow-overlap": false,
        "icon-optional": false,
        "icon-ignore-placement": false,
        "icon-rotation-alignment": "auto",
        "symbol-placement": "line",
        "symbol-avoid-edges": false,
        "symbol-spacing": 250,
        "text-anchor": "center",
        "icon-anchor": "center",
        "icon-offset": [0, 0],
        "text-offset": [0, 0],
        "icon-rotate": 0,
        "text-rotate": 0,
        "text-max-angle": 45,
        "text-field": "{_name}",
        "text-transform": "none"
      },
      "paint": {
        "icon-opacity": 1,
        "text-opacity": 1,
        "text-halo-color": "rgba(255,255,255,0.5)",
        "text-halo-width": 0.533333,
        "text-halo-blur": 0,
        "text-translate-anchor": "map",
        "icon-translate-anchor": "map",
        "icon-translate": [0, 0],
        "text-translate": [0, 0]
      },
      "showProperties": false
    },
    {
      "id": "Roads/label/State Route",
      "type": "symbol",
      "source": "labels",
      "source-layer": "Roads/label",
      "filter": [
        "==",
        "_label_class",
        1],
      "layout": {
        "symbol-placement": "line",
        "text-font": [
          "Montserrat Regular"
        ],
        "text-size": 8,
        "text-letter-spacing": 0.01,
        "text-field": "{_name}",
        "icon-image": "Roads/State Route/{_len}",
        "icon-rotation-alignment": "viewport",
        "text-rotation-alignment": "viewport",
        "text-optional": true
      },
      "paint": {
        "text-color": "#686868"
      },
      "showProperties": false
    },
    {
      "id": "Roads/label/Interstate",
      "type": "symbol",
      "source": "labels",
      "source-layer": "Roads/label",
      "filter": [
        "==",
        "_label_class",
        0],
      "layout": {
        "symbol-placement": "line",
        "text-font": [
          "Montserrat Regular"
        ],
        "text-size": 8,
        "text-letter-spacing": 0.01,
        "text-field": "{_name}",
        "icon-image": "Roads/Interstate/{_len}",
        "icon-rotation-alignment": "viewport",
        "text-rotation-alignment": "viewport",
        "text-optional": true
      },
      "paint": {
        "text-color": "#686868"
      },
      "showProperties": false
    },
    {
      id: "parcel-line",
      type: "line",
      "source": "bu_parcels",
      "source-layer": "Parcels (Current)",
      minzoom: 11,
      layout: {
        visibility: "visible",
      },
      paint: {
        "line-color": {
          stops: [
            [14, "#ccc"],
            [17, "#bbb"],
            [17.1, "#aaa"],
            [18, "#555"],
          ],
        },
        "line-width": {
          base: 1,
          stops: [
            [12, 0.1],
            [14, 0.75],
            [17, 1.5],
            [20, 4],
          ],
        },
        "line-opacity": {
          base: 1,
          stops: [
            [14, 0],
            [14.1, 0.5],
            [22, 1],
          ],
        },
      },
    },
    {
      id: "parcel-highlight",
      type: "line",
      "source": "bu_parcels",
      "source-layer": "Parcels (Current)",
      minzoom: 11,
      filter: ["==", "parcel_id", ""],
      layout: {
        visibility: "visible",
      },
      paint: {
        "line-color": layers["parcel"].color,
        "line-width": {
          base: 1,
          stops: [
            [12, 0.5],
            [14, 2],
            [15, 3],
            [22, 10],
          ],
        },
        "line-opacity": {
          base: 1,
          stops: [
            [12, 0],
            [12.1, 0.1],
            [12.5, 1],
            [22, 1],
          ],
        },
      },
    },
    {
      id: "building-fill",
      type: "fill",
      source: "bu_features",
      "source-layer": "buildings",
      interactive: true,
      minzoom: 12,
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": {
          stops: [
            [14, "#222"],
            [19, '#666']
          ],
        },
        "fill-opacity": {
          stops: [
            [14, 0.1],
            [19, 0.5],
          ],
        },
      },
    },
    {
      id: "building-linked",
      type: "fill",
      source: "bu_features",
      "source-layer": "buildings",
      minzoom: 11,
      filter: ["==", "id", ""],
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": layers["building"].color,
        "fill-opacity": {
          base: 1,
          stops: [
            [12, 0],
            [12.1, 0.1],
            [12.5, 0.25],
            [22, 0.25],
          ],
        },
      },
    },
    {
      id: "building-highlight",
      type: "line",
      source: "bu_features",
      "source-layer": "buildings",
      minzoom: 11,
      filter: ["==", "id", ""],
      layout: {
        visibility: "visible",
      },
      paint: {
        "line-color": layers["building"].color,
        "line-width": {
          base: 1,
          stops: [
            [11.5, 0.1],
            [13.5, 0.75],
            [14, 1.5],
            [21, 6],
          ],
        },
        "line-opacity": {
          base: 1,
          stops: [
            [12, 0],
            [12.1, 0.1],
            [12.5, 1],
            [22, 1],
          ],
        },
      },
    },
    {
      id: "address-highlight",
      type: "circle",
      source: "bu_features",
      "source-layer": "addresses",
      minzoom: 11,
      filter: ["==", "id", ""],
      layout: {
        visibility: "visible",
      },
      paint: {
        "circle-radius": {
          base: 1,
          stops: [
            [12.5, 0.2],
            [13.5, 1],
            [16.5, 3],
            [19, 12],
          ],
        },
        "circle-color": layers["address"].color,
        "circle-stroke-color": "#333",
        "circle-stroke-width": 1,
      },
    },
    {
      id: "address-linked",
      type: "circle",
      source: "bu_features",
      "source-layer": "addresses",
      minzoom: 11,
      filter: ["==", "id", ""],
      layout: {
        visibility: "visible",
      },
      paint: {
        "circle-radius": {
          base: 1,
          stops: [
            [12.5, 0.2],
            [13.5, 1],
            [16.5, 3],
            [19, 12],
          ],
        },
        "circle-color": layers["address"].color,
        "circle-stroke-color": "#333",
        "circle-stroke-width": 1,
      },
    },
    {
      id: "address-point",
      type: "circle",
      source: "bu_features",
      "source-layer": "addresses",
      minzoom: 13,
      layout: {
        visibility: "none",
      },
      paint: {
        "circle-radius": {
          base: 1,
          stops: [
            [13, 0.1],
            [14, 1],
            [17, 4],
            [19, 8],
          ],
        },
        "circle-color": "#aaa",
      },
    },
    {
      id: "address-point-label",
      source: "bu_features",
      "source-layer": "addresses",
      type: "symbol",
      minzoom: 18,
      layout: {
        "text-field": ["get", "street_number"],
        "text-font": ["Noto Sans Bold"],
        "text-offset": [0, -1],
        visibility: "none",
      },
      paint: {
        "text-halo-color": "white",
        "text-halo-width": 2,
      },
    },
    {
      id: "mapillary-images",
      type: "circle",
      source: "mly",
      "source-layer": "image",
      maxzoom: 22,
      minzoom: 14,
      filter: [
        "all",
        ["==", "is_pano", true],
      ],
      layout: {
        visibility: "visible",
      },
      paint: {
        "circle-radius": {
          base: 1,
          stops: [
            [13, 0.1],
            [14, 0.5],
            [17, 2],
            [18.5, 4],
            [19, 7],
            [19.5, 10],
          ],
        },
        "circle-color": "rgba(20,20,120,0)",
      },
    },
    {
      id: "mapillary-location",
      type: "circle",
      source: "mly",
      "source-layer": "image",
      filter: ["==", "id", ""],
      layout: {
        visibility: "visible",
      },
      paint: {
        "circle-radius": {
          base: 1,
          stops: [
            [14, 6],
            [17, 10],
            [19, 14],
          ],
        },
        "circle-color": "#888",
        "circle-opacity": 0.4,
        "circle-stroke-color": "#fff",
        "circle-stroke-width": 2,
      },
    },
    {
      id: "mapillary-direction",
      type: "symbol",
      source: "mly",
      "source-layer": "image",
      filter: ["==", "id", ""],
      layout: {
        "icon-image": "videocamera",
        "icon-size": {
          stops: [
            [14, 0.19],
            [17, 0.25],
            [19, 0.31],
          ],
        },
        "icon-rotate": 0,
        "icon-rotation-alignment": "map",
        "icon-allow-overlap": true,
      },
      paint: {
        "icon-opacity": 1,
      },
    },
    {
      id: "result-point",
      source: "result",
      type: "circle",
      paint: {
        "circle-color": "green",
      },
    },
    {
      id: "new-address-point",
      source: "new-point",
      type: "circle",
      paint: {
        "circle-color": "rgba(120,0,0,0.5)",
        "circle-radius": 10,
        "circle-stroke-color": "#ddd",
        "circle-stroke-width": 2,
      },
    },
    {
      id: "all-projects-fill",
      type: "fill",
      source: "projects",
      interactive: true,
      minzoom: 12,
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": "rgba(120,0,0,0.15)",
      },
    },
    {
      id: "current-project-fill",
      type: "fill",
      source: "current-project",
      interactive: true,
      minzoom: 12,
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": "rgba(0,0,120,0.15)",
      },
    },
    {
      id: "current-project-line",
      type: "line",
      source: "current-project",
      interactive: true,
      minzoom: 12,
      layout: {
        visibility: "visible",
      },
      paint: {
        "line-color": "rgba(0,0,0,0.25)",
        "line-width": 3,
      },
    }
  ],
  metadata: {
    arcgisStyleUrl:
      "https://www.arcgis.com/sharing/rest/content/items/273bf8d5c8ac400183fc24e109d20bcf/resources/styles/root.json",
    arcgisOriginalItemTitle: "Community",
  },
};

// since this is a function and not an object, we'll have to call it in the map like so:
// satelliteStyle()
export const satelliteStyle = () => {
  // clone the baseStyle into a new object to we can make changes
  let satStyle = JSON.parse(JSON.stringify(baseStyle));

  // set the satellite layer, which is first, to visible
  satStyle.layers[0].layout.visibility = "visible";
  satStyle.layers[1].layout.visibility = "none";

  // run through the first 200 layers and turn them off if they're a fill
  // or if they're a road line layer
  // lazy hack for invisible'ing all the layers which are in the way of the satellite
  satStyle.layers.slice(0, 200).forEach((l, i) => {
    if (l.type === "fill" && l.id.indexOf("parcel") === -1 && l.id.indexOf("building") === -1) {
      satStyle.layers[i].layout["visibility"] = "none";
    }
    if (l.type === "line" && l.id.indexOf("Road") === 0) {
      satStyle.layers[i].layout["visibility"] = "none";
    }
  });

  // adjust colors for satellite
  satStyle.layers.forEach((l, i) => {
    if (l.id === "streets-line") {
      satStyle.layers[i].paint["line-color"] = layers["street"].color;
      satStyle.layers[i].paint["line-opacity"] = 0.65;
    }
    if (l.id === "streets-highlight") {
      satStyle.layers[i].paint["line-color"] = "#fff";
      satStyle.layers[i].paint["line-opacity"] = 0.65;
    }
    if (l.id === "streets-linked") {
      satStyle.layers[i].paint["line-color"] = "#333";
      satStyle.layers[i].paint["line-opacity"] = 0.55;
    }
    if (l.id === 'parcel-line') {
      satStyle.layers[i].paint['line-color'] = layers.parcel.color;
      satStyle.layers[i].paint["line-opacity"] = 0.65;
    }
    if (l.id === 'parcel-highlight') {
      satStyle.layers[i].paint["line-color"] = "#fff";
      satStyle.layers[i].paint["line-opacity"] = 0.65;
    }
    if (l.id === 'building-line') {
      satStyle.layers[i].paint['line-color'] = layers.building.color;
      satStyle.layers[i].paint["line-opacity"] = 0.65;
    }
  });

  // return the object
  return satStyle;
};

export const linenStyle = () => {
  // clone the baseStyle into a new object to we can make changes
  let linenStyle = JSON.parse(JSON.stringify(baseStyle));

  // set the linenmap layer, which is second, to visible
  linenStyle.layers[0].layout.visibility = "none";
  linenStyle.layers[1].layout.visibility = "visible";

  // run through the first 200 layers and turn them off if they're a fill
  // or if they're a road line layer
  // lazy hack for invisible'ing all the layers which are in the way of the satellite
  linenStyle.layers.slice(0, 200).forEach((l, i) => {
    if (l.type === "fill" && l.id.indexOf("parcel") === -1) {
      linenStyle.layers[i].layout["visibility"] = "none";
    }
    if (l.type === "line" && l.id.indexOf("Road") === 0) {
      linenStyle.layers[i].layout["visibility"] = "none";
    }
  });

  // return the object
  return linenStyle;
};

export const darkStyle = () => {
  // clone the baseStyle into a new object to we can make changes
  let darkStyle = JSON.parse(JSON.stringify(baseStyle));

  // return the object
  return darkStyle;
}