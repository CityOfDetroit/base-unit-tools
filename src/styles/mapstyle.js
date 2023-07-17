import layers from "../data/layers";
import _ from "lodash";

export const baseStyle = {
  version: 8,
  sprite: "https://www.arcgis.com/sharing/rest/content/items/46d38d6a32ea412fb5fe4cc521ede94e/resources/sprites/sprite-1689510144076",
  glyphs:
    "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/resources/fonts/{fontstack}/{range}.pbf",
  sources: {
    esri: {
      type: "vector",
      tiles: [
        "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/tile/{z}/{y}/{x}.pbf",
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
      // "tiles": ["https://tiles.mapillary.com/maps/vtp/mly1/2/{z}/{x}/{y}?access_token=MLY|4690399437648324|de87555bb6015affa20c3df794ebab15"],
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
        "raster-opacity": 1,
        "raster-saturation": -0.75,
      },
      layout: {
        visibility: "none",
      },
    },
    {
      id: "Land/Not ice",
      type: "fill",
      source: "esri",
      "source-layer": "Land",
      filter: ["==", "_symbol", 0],
      minzoom: 0,
      layout: {},
      paint: {
        "fill-color": {
          stops: [
            [0, "#dce0ca"],
            [10, "#E6E5D6"],
            [15, "#f2eee9"],
          ],
        },
      },
    },
    {
      id: "Land/Ice",
      type: "fill",
      source: "esri",
      "source-layer": "Land",
      filter: ["==", "_symbol", 1],
      minzoom: 0,
      layout: {},
      paint: {
        "fill-color": "#E6E5D6",
      },
    },
    {
      id: "Urban area",
      type: "fill",
      source: "esri",
      "source-layer": "Urban area",
      minzoom: 5,
      maxzoom: 15,
      layout: {},
      paint: {
        "fill-color": {
          stops: [
            [5, "#e3dfdc"],
            [10, "#ECE8E3"],
            [15, "#f2eee9"],
          ],
        },
        "fill-antialias": false,
      },
    },
    {
      id: "Water line small scale",
      type: "line",
      source: "esri",
      "source-layer": "Water line small scale",
      minzoom: 1,
      maxzoom: 5,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [1, "#B7D7D9"],
            [10.6, "#6BC4F0"],
          ],
        },
        "line-width": {
          base: 1.2,
          stops: [
            [1, 0.5],
            [5, 0.5],
          ],
        },
      },
    },
    {
      id: "Water line medium scale",
      type: "line",
      source: "esri",
      "source-layer": "Water line medium scale",
      minzoom: 5,
      maxzoom: 7,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [1, "#B7D7D9"],
            [10.6, "#6BC4F0"],
          ],
        },
        "line-width": {
          base: 1.2,
          stops: [
            [5, 0.5],
            [7, 0.7],
          ],
        },
      },
    },
    {
      id: "Water line large scale",
      type: "line",
      source: "esri",
      "source-layer": "Water line large scale",
      minzoom: 7,
      maxzoom: 11,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [1, "#B7D7D9"],
            [10.6, "#6BC4F0"],
          ],
        },
        "line-width": {
          base: 1.2,
          stops: [
            [7, 0.5],
            [11, 0.7],
          ],
        },
      },
    },
    {
      id: "Water line/Waterfall",
      type: "line",
      source: "esri",
      "source-layer": "Water line",
      filter: ["==", "_symbol", 5],
      minzoom: 11,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#6BC4F0",
        "line-width": 0.8,
        "line-dasharray": [5, 5],
      },
    },
    {
      id: "Water line/Dam or weir",
      type: "line",
      source: "esri",
      "source-layer": "Water line",
      filter: ["==", "_symbol", 2],
      minzoom: 11,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#afafaf",
        "line-width": {
          base: 1.2,
          stops: [
            [11, 0.7],
            [14, 0.7],
            [17, 2],
          ],
        },
      },
    },
    {
      id: "Water line/Levee/1",
      type: "line",
      source: "esri",
      "source-layer": "Water line",
      filter: ["==", "_symbol", 3],
      minzoom: 11,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#c3c3c3",
        "line-width": {
          base: 1.2,
          stops: [
            [11, 0.7],
            [14, 0.7],
            [20, 2.5],
          ],
        },
      },
    },
    {
      id: "Water line/Levee/0",
      type: "symbol",
      source: "esri",
      "source-layer": "Water line",
      filter: ["==", "_symbol", 3],
      minzoom: 13,
      layout: {
        "symbol-placement": "line",
        "symbol-avoid-edges": true,
        "icon-image": "Water line/Levee/0",
        "symbol-spacing": 13.3,
        "icon-rotation-alignment": "map",
        "icon-allow-overlap": true,
        "icon-padding": 1,
      },
      paint: {},
    },
    {
      id: "Water line/Canal or ditch",
      type: "line",
      source: "esri",
      "source-layer": "Water line",
      filter: ["==", "_symbol", 1],
      minzoom: 11,
      layout: {
        "line-cap": "round",
      },
      paint: {
        "line-color": "#6BC4F0",
        "line-width": {
          base: 1.2,
          stops: [
            [11, 0.7],
            [14, 0.7],
            [17, 2],
          ],
        },
      },
    },
    {
      id: "Water line/Stream or river intermittent",
      type: "line",
      source: "esri",
      "source-layer": "Water line",
      filter: ["==", "_symbol", 4],
      minzoom: 11,
      layout: {},
      paint: {
        "line-color": "#6BC4F0",
        "line-dasharray": [7, 3],
        "line-width": {
          base: 1.2,
          stops: [
            [11, 0.7],
            [14, 0.7],
            [17, 2],
          ],
        },
      },
    },
    {
      id: "Water line/Stream or river",
      type: "line",
      source: "esri",
      "source-layer": "Water line",
      filter: ["==", "_symbol", 0],
      minzoom: 11,
      layout: {
        "line-cap": "round",
      },
      paint: {
        "line-color": "#6BC4F0",
        "line-width": {
          base: 1.2,
          stops: [
            [11, 0.7],
            [14, 0.7],
            [17, 2],
          ],
        },
      },
    },
    {
      id: "Marine area/1",
      type: "fill",
      source: "esri",
      "source-layer": "Marine area",
      minzoom: 0,
      layout: {},
      paint: {
        "fill-color": {
          stops: [
            [5, "#53B9EA"],
            [10.6, "#6BC4F0"],
          ],
        },
        "fill-antialias": false,
      },
    },
    {
      id: "Bathymetry/depth 2 (shallow water)",
      type: "fill",
      source: "esri",
      "source-layer": "Bathymetry",
      filter: ["==", "_symbol", 0],
      maxzoom: 11,
      layout: {},
      paint: {
        "fill-color": {
          stops: [
            [5, "#5BBDEC"],
            [10.6, "#6BC4F0"],
          ],
        },
        "fill-antialias": false,
      },
    },
    {
      id: "Bathymetry/depth 3",
      type: "fill",
      source: "esri",
      "source-layer": "Bathymetry",
      filter: ["==", "_symbol", 1],
      maxzoom: 11,
      layout: {},
      paint: {
        "fill-color": {
          stops: [
            [5, "#63C0EE"],
            [10.6, "#6BC4F0"],
          ],
        },
        "fill-antialias": false,
      },
    },
    {
      id: "Bathymetry/depth 4",
      type: "fill",
      source: "esri",
      "source-layer": "Bathymetry",
      filter: ["==", "_symbol", 2],
      maxzoom: 11,
      layout: {},
      paint: {
        "fill-color": {
          stops: [
            [5, "#6BC4F0"],
            [10.6, "#6BC4F0"],
          ],
        },
        "fill-antialias": false,
      },
    },
    {
      id: "Bathymetry/depth 5",
      type: "fill",
      source: "esri",
      "source-layer": "Bathymetry",
      filter: ["==", "_symbol", 3],
      maxzoom: 11,
      layout: {},
      paint: {
        "fill-color": {
          stops: [
            [5, "#72C8F1"],
            [10.6, "#6BC4F0"],
          ],
        },
        "fill-antialias": false,
      },
    },
    {
      id: "Bathymetry/depth 6",
      type: "fill",
      source: "esri",
      "source-layer": "Bathymetry",
      filter: ["==", "_symbol", 4],
      maxzoom: 11,
      layout: {},
      paint: {
        "fill-color": {
          stops: [
            [5, "#7ACBF3"],
            [10.6, "#6BC4F0"],
          ],
        },
        "fill-antialias": false,
      },
    },
    {
      id: "Bathymetry/depth 7 (deep water)",
      type: "fill",
      source: "esri",
      "source-layer": "Bathymetry",
      filter: ["==", "_symbol", 5],
      maxzoom: 11,
      layout: {},
      paint: {
        "fill-color": {
          stops: [
            [5, "#82CFF5"],
            [10.6, "#6BC4F0"],
          ],
        },
        "fill-antialias": false,
      },
    },
    {
      id: "Water area small scale",
      type: "fill",
      source: "esri",
      "source-layer": "Water area small scale",
      minzoom: 1,
      maxzoom: 5,
      layout: {},
      paint: {
        "fill-color": {
          stops: [
            [5, "#53B9EA"],
            [10.6, "#6BC4F0"],
          ],
        },
        "fill-outline-color": "#53B9EA",
      },
    },
    {
      id: "Water area medium scale/Lake intermittent",
      type: "fill",
      source: "esri",
      "source-layer": "Water area medium scale",
      filter: ["==", "_symbol", 1],
      minzoom: 5,
      maxzoom: 7,
      layout: {},
      paint: {
        "fill-pattern": "Water area/Lake or river intermittent",
      },
    },
    {
      id: "Water area medium scale/Lake or river",
      type: "fill",
      source: "esri",
      "source-layer": "Water area medium scale",
      filter: ["==", "_symbol", 0],
      minzoom: 5,
      maxzoom: 7,
      layout: {},
      paint: {
        "fill-color": {
          stops: [
            [5, "#53B9EA"],
            [10.6, "#6BC4F0"],
          ],
        },
        "fill-outline-color": "#53B9EA",
      },
    },
    {
      id: "Water area large scale/Lake intermittent",
      type: "fill",
      source: "esri",
      "source-layer": "Water area large scale",
      filter: ["==", "_symbol", 1],
      minzoom: 7,
      maxzoom: 11,
      layout: {},
      paint: {
        "fill-pattern": "Water area/Lake or river intermittent",
      },
    },
    {
      id: "Water area large scale/Lake or river",
      type: "fill",
      source: "esri",
      "source-layer": "Water area large scale",
      filter: ["==", "_symbol", 0],
      minzoom: 7,
      maxzoom: 11,
      layout: {},
      paint: {
        "fill-color": {
          stops: [
            [5, "#53B9EA"],
            [10.6, "#6BC4F0"],
          ],
        },
        "fill-outline-color": {
          stops: [
            [8, "#53B9EA"],
            [9, "#6BC4F0"],
          ],
        },
      },
    },
    {
      id: "Water area/Lake, river or bay",
      type: "fill",
      source: "esri",
      "source-layer": "Water area",
      filter: ["==", "_symbol", 7],
      minzoom: 11,
      layout: {},
      paint: {
        "fill-color": "#6BC4F0",
        "fill-outline-color": "#6BC4F0",
      },
    },
    {
      id: "Water area/Lake or river intermittent",
      type: "fill",
      source: "esri",
      "source-layer": "Water area",
      filter: ["==", "_symbol", 6],
      minzoom: 11,
      layout: {},
      paint: {
        "fill-pattern": "Water area/Lake or river intermittent",
      },
    },
    {
      id: "Water area/Inundated area",
      type: "fill",
      source: "esri",
      "source-layer": "Water area",
      filter: ["==", "_symbol", 4],
      minzoom: 11,
      layout: {},
      paint: {
        "fill-pattern": "Water area/Inundated area",
      },
    },
    {
      id: "Water area/Swamp or marsh",
      type: "fill",
      source: "esri",
      "source-layer": "Water area",
      filter: ["==", "_symbol", 3],
      minzoom: 11,
      layout: {},
      paint: {
        "fill-pattern": "Water area/Swamp or marsh",
        "fill-opacity": 0.45,
      },
    },
    {
      id: "Water area/Playa",
      type: "fill",
      source: "esri",
      "source-layer": "Water area",
      filter: ["==", "_symbol", 1],
      minzoom: 11,
      layout: {},
      paint: {
        "fill-pattern": "Water area/Playa",
      },
    },
    {
      id: "Water area/Ice mass",
      type: "fill",
      source: "esri",
      "source-layer": "Water area",
      filter: ["==", "_symbol", 2],
      minzoom: 11,
      layout: {},
      paint: {
        "fill-pattern": "Water area/Ice mass",
        "fill-opacity": 0.5,
      },
    },
    {
      id: "Water area/Dam or weir",
      type: "fill",
      source: "esri",
      "source-layer": "Water area",
      filter: ["==", "_symbol", 5],
      minzoom: 11,
      layout: {},
      paint: {
        "fill-color": "#e5e5dd",
        "fill-outline-color": "#d9d9d1",
      },
    },
    {
      id: "Special area of interest/Bike, walk or pedestrian/line",
      type: "line",
      source: "esri",
      "source-layer": "Special area of interest",
      filter: ["==", "_symbol", 2],
      minzoom: 15,
      layout: {},
      paint: {
        "line-color": "#bcb7ae",
        "line-width": {
          stops: [
            [15, 1.1],
            [22, 10],
          ],
        },
        "line-blur": {
          stops: [
            [15, 1],
            [22, 5],
          ],
        },
      },
    },
    {
      id: "Special area of interest/Bike, walk or pedestrian",
      type: "fill",
      source: "esri",
      "source-layer": "Special area of interest",
      filter: ["==", "_symbol", 2],
      minzoom: 15,
      layout: {},
      paint: {
        "fill-color": "#E8E7E5",
        "fill-outline-color": "#dbd9d5",
      },
    },
    {
      id: "Special area of interest/Bike, walk or pedestrian/pattern",
      type: "fill",
      source: "esri",
      "source-layer": "Special area of interest",
      filter: ["==", "_symbol", 2],
      minzoom: 15,
      layout: {},
      paint: {
        "fill-pattern": "Special area of interest/Small stipple",
      },
    },
    {
      id: "Special area of interest/Water",
      type: "fill",
      source: "esri",
      "source-layer": "Special area of interest",
      filter: ["==", "_symbol", 7],
      minzoom: 14,
      layout: {
        visibility: "none",
      },
      paint: {
        "fill-color": "#6BC4F0",
      },
    },
    {
      id: "Special area of interest/Water/line",
      type: "line",
      source: "esri",
      "source-layer": "Special area of interest",
      filter: ["==", "_symbol", 7],
      minzoom: 14,
      layout: {
        visibility: "none",
      },
      paint: {
        "line-color": "#5db6e2",
        "line-width": {
          stops: [
            [15, 1.1],
            [22, 7],
          ],
        },
        "line-blur": {
          stops: [
            [15, 1],
            [22, 3.5],
          ],
        },
      },
    },
    {
      id: "Ferry/Ferry",
      type: "line",
      source: "esri",
      "source-layer": "Ferry",
      filter: ["all", ["==", "_symbol", 0], ["!in", "Viz", 2]],
      minzoom: 11,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#c1e1f0",
        "line-opacity": 0.8,
        "line-width": {
          base: 1.2,
          stops: [
            [11, 1.3],
            [14, 1.5],
            [17, 1.5],
          ],
        },
        "line-dasharray": [3, 4],
      },
    },
    {
      id: "Railroad/2",
      type: "line",
      source: "esri",
      "source-layer": "Railroad",
      minzoom: 11,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [11, "#dedcd9"],
            [17, "#B8B1AA"],
          ],
        },
        "line-width": {
          base: 1.2,
          stops: [
            [11, 2.5],
            [14, 2.5],
            [17, 4],
          ],
        },
      },
    },
    {
      id: "Railroad/1",
      type: "line",
      source: "esri",
      "source-layer": "Railroad",
      minzoom: 11,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-dasharray": [6, 7.5],
        "line-color": {
          stops: [
            [11, "#E3E0D7"],
            [17, "#DBD8CB"],
          ],
        },
        "line-width": {
          base: 1.2,
          stops: [
            [11, 0.75],
            [15, 0.75],
            [17, 2],
          ],
        },
      },
    },
    {
      id: "Ferry/Rail ferry/2",
      type: "line",
      source: "esri",
      "source-layer": "Ferry",
      filter: ["all", ["==", "_symbol", 1], ["!in", "Viz", 2]],
      minzoom: 11,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [11, "#dedcd9"],
            [17, "#B8B1AA"],
          ],
        },
        "line-width": {
          base: 1.2,
          stops: [
            [11, 2.5],
            [14, 2.5],
            [17, 4],
          ],
        },
      },
    },
    {
      id: "Ferry/Rail ferry/1",
      type: "line",
      source: "esri",
      "source-layer": "Ferry",
      filter: ["all", ["==", "_symbol", 1], ["!in", "Viz", 2]],
      minzoom: 11,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-dasharray": [6, 7.5],
        "line-color": {
          stops: [
            [11, "#E3E0D7"],
            [17, "#DBD8CB"],
          ],
        },
        "line-width": {
          base: 1.2,
          stops: [
            [11, 0.75],
            [15, 0.75],
            [17, 2],
          ],
        },
      },
    },
    {
      id: "Special area of interest line/Sports field",
      type: "line",
      source: "esri",
      "source-layer": "Special area of interest line",
      filter: ["==", "_symbol", 6],
      minzoom: 15,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#e3e0da",
        "line-opacity": 0.8,
        "line-width": {
          base: 1.2,
          stops: [
            [15, 0.5],
            [20, 4],
          ],
        },
      },
    },
    {
      id: "Road/4WD/1",
      type: "line",
      source: "esri",
      "source-layer": "Road",
      filter: ["all", ["==", "_symbol", 10], ["!in", "Viz", 2]],
      minzoom: 13,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#e3e1dc",
        "line-dasharray": [2, 1],
        "line-width": {
          base: 1.2,
          stops: [
            [11, 1.5],
            [14, 2.3],
            [17, 8.3],
            [20, 50],
          ],
        },
      },
    },
    {
      id: "Road/Minor, ramp or traffic circle/1",
      type: "line",
      source: "esri",
      "source-layer": "Road",
      filter: ["all", ["==", "_symbol", 6], ["!in", "Viz", 2]],
      minzoom: 9,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [9, "#E2DFD6"],
            [10, "#dedbd1"],
            [12, "#e3e1dc"],
          ],
        },
        "line-width": {
          base: 1.2,
          stops: [
            [9.9, 1],
            [14, 4],
            [16, 11.5],
            [17, 19],
            [20, 58],
          ],
        },
      },
    },
    {
      id: "Road/Minor/1",
      type: "line",
      source: "esri",
      "source-layer": "Road",
      filter: ["all", ["==", "_symbol", 5], ["!in", "Viz", 2]],
      minzoom: 9,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [9, "#E2DFD6"],
            [10, "#dedbd1"],
            [12, "#e3e1dc"],
          ],
        },
        "line-width": {
          base: 1.2,
          stops: [
            [9, 1],
            [10, 3.3],
            [14, 5.5],
            [16, 11.5],
            [17, 19],
            [20, 58],
          ],
        },
      },
    },
    {
      id: "Road/Major, ramp or traffic circle/1",
      type: "line",
      source: "esri",
      "source-layer": "Road",
      filter: ["all", ["==", "_symbol", 4], ["!in", "Viz", 2]],
      minzoom: 9,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [9, "#dedbd1"],
            [12, "#e3e1dc"],
          ],
        },
        "line-width": {
          base: 1.2,
          stops: [
            [9, 3.3],
            [14, 7.3],
            [16, 12.3],
            [17, 22],
            [20, 63],
          ],
        },
      },
    },
    {
      id: "Road/Major/1",
      type: "line",
      source: "esri",
      "source-layer": "Road",
      filter: ["all", ["==", "_symbol", 3], ["!in", "Viz", 2]],
      minzoom: 8,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [8, "#dedbd1"],
            [12, "#e3e1dc"],
          ],
        },
        "line-width": {
          base: 1,
          stops: [
            [8, 3.3],
            [14, 7.3],
            [16, 12.3],
            [17, 22],
            [20, 63],
          ],
        },
      },
    },
    {
      id: "Road/Service/1",
      type: "line",
      source: "esri",
      "source-layer": "Road",
      filter: ["all", ["==", "_symbol", 8], ["!in", "Viz", 2]],
      minzoom: 13,
      layout: {
        visibility: "none",
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#e3e1dc",
        "line-width": {
          base: 1.2,
          stops: [
            [11, 2],
            [14, 2.5],
            [17, 10.3],
            [20, 45],
          ],
        },
      },
    },
    {
      id: "Trail or path/1",
      type: "line",
      source: "esri",
      "source-layer": "Trail or path",
      minzoom: 15,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [15, "#dddbd5"],
            [17, "#e3e1dc"],
          ],
        },
        "line-width": {
          base: 1.2,
          stops: [
            [15, 2.5],
            [16, 3],
            [17, 5],
            [20, 20],
            [22, 31],
          ],
        },
      },
    },
    {
      id: "Road/Pedestrian/1",
      type: "line",
      source: "esri",
      "source-layer": "Road",
      filter: ["all", ["==", "_symbol", 9], ["!in", "Viz", 2]],
      minzoom: 15,
      layout: {
        visibility: "none",
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [15, "#dddbd5"],
            [17, "#e3e1dc"],
          ],
        },
        "line-width": {
          base: 1.2,
          stops: [
            [15, 2.5],
            [16, 3],
            [17, 5],
            [20, 20],
            [22, 31],
          ],
        },
      },
    },
    {
      id: "Road/Local/1",
      type: "line",
      source: "esri",
      "source-layer": "Road",
      filter: ["all", ["==", "_symbol", 7], ["!in", "Viz", 2]],
      minzoom: 12,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#e3e1dc",
        "line-width": {
          base: 1.4,
          stops: [
            [11, 1.1],
            [14, 3],
            [16, 8],
            [17, 16],
            [20, 48],
          ],
        },
      },
    },
    {
      id: "Trail or path/0",
      type: "line",
      source: "esri",
      "source-layer": "Trail or path",
      minzoom: 15,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [15, "#f8f8f7"],
            [18, "#ffffff"],
          ],
        },
        "line-dasharray": {
          stops: [
            [15, [3, 3]],
            [17, [2, 2]],
          ],
        },
        "line-width": {
          base: 1.2,
          stops: [
            [15, 1.3],
            [17, 2.5],
          ],
        },
      },
    },
    {
      id: "Road/Pedestrian/0",
      type: "line",
      source: "esri",
      "source-layer": "Road",
      filter: ["all", ["==", "_symbol", 9], ["!in", "Viz", 2]],
      minzoom: 15,
      layout: {
        visibility: "none",
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [15, "#f8f8f7"],
            [18, "#ffffff"],
          ],
        },
        "line-dasharray": {
          stops: [
            [15, [3, 3]],
            [17, [2, 2]],
          ],
        },
        "line-width": {
          base: 1.2,
          stops: [
            [15, 1.3],
            [17, 2.5],
          ],
        },
      },
    },
    {
      id: "Road/4WD/0",
      type: "line",
      source: "esri",
      "source-layer": "Road",
      filter: ["all", ["==", "_symbol", 10], ["!in", "Viz", 2]],
      minzoom: 13,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#FFFFFF",
        "line-width": {
          base: 1.2,
          stops: [
            [11, 0.75],
            [14, 1.3],
            [17, 7.3],
            [20, 48],
          ],
        },
      },
    },
    {
      id: "Road/Service/0",
      type: "line",
      source: "esri",
      "source-layer": "Road",
      filter: ["all", ["==", "_symbol", 8], ["!in", "Viz", 2]],
      minzoom: 13,
      layout: {
        visibility: "none",
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#FFFFFF",
        "line-width": {
          base: 1.2,
          stops: [
            [11, 0.75],
            [14, 1.3],
            [17, 8.3],
            [20, 43],
          ],
        },
      },
    },
    {
      id: "Road/Local/0",
      type: "line",
      source: "esri",
      "source-layer": "Road",
      filter: ["all", ["==", "_symbol", 7], ["!in", "Viz", 2]],
      minzoom: 12,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [12, "#fcfbf9"],
            [13, "#ffffff"],
          ],
        },
        "line-width": {
          base: 1.4,
          stops: [
            [11, 1.1],
            [14, 2],
            [16, 6],
            [17, 14],
            [20, 45],
          ],
        },
      },
    },
    {
      id: "Road/Minor, ramp or traffic circle/0",
      type: "line",
      source: "esri",
      "source-layer": "Road",
      filter: ["all", ["==", "_symbol", 6], ["!in", "Viz", 2]],
      minzoom: 9,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [9, "#f0efea"],
            [13, "#ffffff"],
          ],
        },
        "line-width": {
          base: 1.2,
          stops: [
            [9, 0.75],
            [14, 2],
            [16, 9.5],
            [17, 17],
            [20, 55],
          ],
        },
      },
    },
    {
      id: "Road/Minor/0",
      type: "line",
      source: "esri",
      "source-layer": "Road",
      filter: ["all", ["==", "_symbol", 5], ["!in", "Viz", 2]],
      minzoom: 9,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [9, "#f0efea"],
            [13, "#ffffff"],
          ],
        },
        "line-width": {
          base: 1.2,
          stops: [
            [9, 1.3],
            [14, 4.5],
            [16, 9.5],
            [17, 17],
            [20, 55],
          ],
        },
      },
    },
    {
      id: "Road/Major, ramp or traffic circle/0",
      type: "line",
      source: "esri",
      "source-layer": "Road",
      filter: ["all", ["==", "_symbol", 4], ["!in", "Viz", 2]],
      minzoom: 9,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [9, "#f0efea"],
            [13, "#ffffff"],
          ],
        },
        "line-width": {
          base: 1.2,
          stops: [
            [9, 1.3],
            [14, 5.3],
            [16, 10.3],
            [17, 20],
            [20, 60],
          ],
        },
      },
    },
    {
      id: "Road/Major/0",
      type: "line",
      source: "esri",
      "source-layer": "Road",
      filter: ["all", ["==", "_symbol", 3], ["!in", "Viz", 2]],
      minzoom: 8,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [9, "#f0efea"],
            [13, "#ffffff"],
          ],
        },
        "line-width": {
          base: 1.2,
          stops: [
            [8, 1.3],
            [14, 5.3],
            [16, 10.3],
            [17, 20],
            [20, 60],
          ],
        },
      },
    },
    {
      id: "Road/Freeway Motorway, ramp or traffic circle/1",
      type: "line",
      source: "esri",
      "source-layer": "Road",
      filter: ["all", ["==", "_symbol", 2], ["!in", "Viz", 2]],
      minzoom: 6,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#ffffff",
        "line-width": {
          base: 1.2,
          stops: [
            [9, 0.3],
            [14, 8.3],
            [16, 14.3],
            [17, 30],
            [20, 52],
          ],
        },
      },
    },
    {
      id: "Road/Highway/1",
      type: "line",
      source: "esri",
      "source-layer": "Road",
      filter: ["all", ["==", "_symbol", 1], ["!in", "Viz", 2]],
      minzoom: 6,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#ffffff",
        "line-width": {
          base: 1.2,
          stops: [
            [6, 0.3],
            [14, 8.3],
            [16, 14.3],
            [17, 30],
            [20, 52],
          ],
        },
      },
    },
    {
      id: "Road/Freeway Motorway/1",
      type: "line",
      source: "esri",
      "source-layer": "Road",
      filter: ["all", ["==", "_symbol", 0], ["!in", "Viz", 2]],
      minzoom: 5,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#ffffff",
        "line-width": {
          base: 1.2,
          stops: [
            [5, 0.3],
            [14, 8.3],
            [16, 14.3],
            [17, 30],
            [20, 52],
          ],
        },
      },
    },
    {
      id: "Road/Freeway Motorway, ramp or traffic circle/0",
      type: "line",
      source: "esri",
      "source-layer": "Road",
      filter: ["all", ["==", "_symbol", 2], ["!in", "Viz", 2]],
      minzoom: 6,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [6, "#F6CA91"],
            [8, "#F6CA91"],
            [12, "#F6CA91"],
          ],
        },
        "line-width": {
          base: 1.2,
          stops: [
            [9, 0.7],
            [14, 6.3],
            [16, 12.3],
            [17, 28],
            [20, 50],
          ],
        },
      },
    },
    {
      id: "Road/Highway/0",
      type: "line",
      source: "esri",
      "source-layer": "Road",
      filter: ["all", ["==", "_symbol", 1], ["!in", "Viz", 2]],
      minzoom: 6,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [6, "#F6CA91"],
            [8, "#F6CA91"],
            [12, "#F6CA91"],
          ],
        },
        "line-width": {
          base: 1.2,
          stops: [
            [6, 0.7],
            [14, 6.3],
            [16, 12.3],
            [17, 28],
            [20, 50],
          ],
        },
      },
    },
    {
      id: "Road/Freeway Motorway/0",
      type: "line",
      source: "esri",
      "source-layer": "Road",
      filter: ["all", ["==", "_symbol", 0], ["!in", "Viz", 2]],
      minzoom: 5,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#F6CA91",
        "line-width": {
          base: 1.2,
          stops: [
            [5, 0.7],
            [14, 6.3],
            [16, 12.3],
            [17, 28],
            [20, 50],
          ],
        },
      },
    },
    {
      id: "Special area of interest line/Dock or pier",
      type: "line",
      source: "esri",
      "source-layer": "Special area of interest line",
      filter: ["==", "_symbol", 0],
      minzoom: 15,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#E8E7E5",
        "line-width": {
          base: 1.2,
          stops: [
            [15, 0.5],
            [20, 4],
          ],
        },
      },
    },
    {
      id: "Special area of interest line/Fence (chain link)/1",
      type: "line",
      source: "esri",
      "source-layer": "Special area of interest line",
      filter: ["==", "_symbol", 1],
      minzoom: 16,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#686868",
        "line-opacity": 0.5,
        "line-width": {
          base: 1.2,
          stops: [
            [16, 0.7],
            [20, 3],
          ],
        },
      },
    },
    {
      id: "Special area of interest line/Fence (chain link)/0",
      type: "symbol",
      source: "esri",
      "source-layer": "Special area of interest line",
      filter: ["==", "_symbol", 1],
      minzoom: 16,
      layout: {
        "symbol-placement": "line",
        "symbol-avoid-edges": true,
        "icon-image": "Special area of interest line/Fence (chain link)/0",
        "symbol-spacing": {
          stops: [
            [16, 7],
            [22, 20],
          ],
        },
        "icon-rotation-alignment": "map",
        "icon-allow-overlap": true,
        "icon-padding": 1,
        "icon-size": {
          stops: [
            [16, 0.25],
            [22, 1],
          ],
        },
      },
      paint: {},
    },
    {
      id: "Special area of interest line/Fence (metal)/1",
      type: "line",
      source: "esri",
      "source-layer": "Special area of interest line",
      filter: ["==", "_symbol", 2],
      minzoom: 16,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#686868",
        "line-opacity": 0.5,
        "line-width": {
          base: 1.2,
          stops: [
            [16, 0.7],
            [20, 3],
          ],
        },
      },
    },
    {
      id: "Special area of interest line/Fence (metal)/0",
      type: "symbol",
      source: "esri",
      "source-layer": "Special area of interest line",
      filter: ["==", "_symbol", 2],
      minzoom: 16,
      layout: {
        "symbol-placement": "line",
        "symbol-avoid-edges": true,
        "icon-image": "Special area of interest line/Fence (metal)/0",
        "symbol-spacing": {
          stops: [
            [16, 7],
            [22, 20],
          ],
        },
        "icon-rotation-alignment": "map",
        "icon-allow-overlap": true,
        "icon-padding": 1,
        "icon-size": {
          stops: [
            [16, 0.2],
            [22, 0.9],
          ],
        },
      },
      paint: {},
    },
    {
      id: "Special area of interest line/Fence (wood)/1",
      type: "line",
      source: "esri",
      "source-layer": "Special area of interest line",
      filter: ["==", "_symbol", 3],
      minzoom: 16,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#CDAA66",
        "line-opacity": 0.5,
        "line-width": {
          base: 1.2,
          stops: [
            [16, 0.7],
            [20, 3],
          ],
        },
      },
    },
    {
      id: "Special area of interest line/Fence (wood)/0",
      type: "symbol",
      source: "esri",
      "source-layer": "Special area of interest line",
      filter: ["==", "_symbol", 3],
      minzoom: 16,
      layout: {
        "symbol-placement": "line",
        "symbol-avoid-edges": true,
        "icon-image": "Special area of interest line/Fence (wood)/0",
        "symbol-spacing": {
          stops: [
            [16, 7],
            [22, 20],
          ],
        },
        "icon-rotation-alignment": "map",
        "icon-allow-overlap": true,
        "icon-padding": 1,
        "icon-size": {
          stops: [
            [16, 0.2],
            [22, 0.9],
          ],
        },
      },
      paint: {},
    },
    {
      id: "Special area of interest line/Gate/2",
      type: "line",
      source: "esri",
      "source-layer": "Special area of interest line",
      filter: ["==", "_symbol", 4],
      minzoom: 16,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#686868",
        "line-width": {
          base: 1.2,
          stops: [
            [16, 2],
            [20, 7],
          ],
        },
      },
    },
    {
      id: "Special area of interest line/Gate/1",
      type: "line",
      source: "esri",
      "source-layer": "Special area of interest line",
      filter: ["==", "_symbol", 4],
      minzoom: 16,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#E1E1E1",
        "line-width": {
          base: 1.2,
          stops: [
            [16, 1],
            [20, 5],
          ],
        },
      },
    },
    {
      id: "Special area of interest line/Gate/0",
      type: "line",
      source: "esri",
      "source-layer": "Special area of interest line",
      filter: ["==", "_symbol", 4],
      minzoom: 16,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#686868",
        "line-dasharray": [5, 15],
        "line-width": 0.7,
      },
    },
    {
      id: "Special area of interest line/Wall/2",
      type: "line",
      source: "esri",
      "source-layer": "Special area of interest line",
      filter: ["==", "_symbol", 7],
      minzoom: 16,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#BCB7AE",
        "line-width": {
          base: 1.2,
          stops: [
            [16, 4],
            [20, 7],
          ],
        },
      },
    },
    {
      id: "Special area of interest line/Wall/1",
      type: "line",
      source: "esri",
      "source-layer": "Special area of interest line",
      filter: ["==", "_symbol", 7],
      minzoom: 16,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#e3e3e1",
        "line-width": {
          base: 1.2,
          stops: [
            [16, 2],
            [20, 5],
          ],
        },
      },
    },
    {
      id: "Special area of interest line/Wall/0",
      type: "line",
      source: "esri",
      "source-layer": "Special area of interest line",
      filter: ["==", "_symbol", 7],
      minzoom: 16,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#BCB7AE",
        "line-width": 0.5,
      },
    },
    {
      id: "Road tunnel/4WD/1",
      type: "line",
      source: "esri",
      "source-layer": "Road tunnel",
      filter: ["all", ["==", "_symbol", 10], ["!in", "Viz", 2]],
      minzoom: 13,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#e3e1dc",
        "line-dasharray": [2, 1],
        "line-opacity": 0.5,
        "line-width": {
          base: 1.2,
          stops: [
            [11, 1.5],
            [14, 2.3],
            [17, 8.3],
            [20, 49],
          ],
        },
      },
    },
    {
      id: "Road tunnel/Minor, ramp or traffic circle/1",
      type: "line",
      source: "esri",
      "source-layer": "Road tunnel",
      filter: ["all", ["==", "_symbol", 6], ["!in", "Viz", 2]],
      minzoom: 9,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [9, "#E2DFD6"],
            [10, "#dedbd1"],
            [12, "#e3e1dc"],
          ],
        },
        "line-opacity": 0.5,
        "line-width": {
          base: 1.2,
          stops: [
            [9.9, 1],
            [14, 4],
            [16, 11.5],
            [17, 19],
            [20, 57],
          ],
        },
      },
    },
    {
      id: "Road tunnel/Minor/1",
      type: "line",
      source: "esri",
      "source-layer": "Road tunnel",
      filter: ["all", ["==", "_symbol", 5], ["!in", "Viz", 2]],
      minzoom: 9,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [9, "#E2DFD6"],
            [10, "#dedbd1"],
            [12, "#e3e1dc"],
          ],
        },
        "line-opacity": 0.5,
        "line-width": {
          base: 1.2,
          stops: [
            [9, 1],
            [10, 3.3],
            [14, 5.5],
            [16, 11.5],
            [17, 19],
            [20, 57],
          ],
        },
      },
    },
    {
      id: "Road tunnel/Major, ramp or traffic circle/1",
      type: "line",
      source: "esri",
      "source-layer": "Road tunnel",
      filter: ["all", ["==", "_symbol", 4], ["!in", "Viz", 2]],
      minzoom: 9,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [9, "#dedbd1"],
            [12, "#e3e1dc"],
          ],
        },
        "line-opacity": 0.5,
        "line-width": {
          base: 1.2,
          stops: [
            [9, 3.3],
            [14, 7.3],
            [16, 12.3],
            [17, 22],
            [20, 62],
          ],
        },
      },
    },
    {
      id: "Road tunnel/Major/1",
      type: "line",
      source: "esri",
      "source-layer": "Road tunnel",
      filter: ["all", ["==", "_symbol", 3], ["!in", "Viz", 2]],
      minzoom: 8,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [8, "#dedbd1"],
            [12, "#e3e1dc"],
          ],
        },
        "line-opacity": 0.5,
        "line-width": {
          base: 1,
          stops: [
            [8, 3.3],
            [14, 7.3],
            [16, 12.3],
            [17, 22],
            [20, 62],
          ],
        },
      },
    },
    {
      id: "Road tunnel/Pedestrian/0",
      type: "line",
      source: "esri",
      "source-layer": "Road tunnel",
      filter: ["all", ["==", "_symbol", 9], ["!in", "Viz", 2]],
      minzoom: 15,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#FFFFFF",
        "line-opacity": 0.5,
        "line-width": {
          base: 1.2,
          stops: [
            [14, 1.6],
            [16, 2],
            [17, 8],
            [20, 45],
          ],
        },
      },
    },
    {
      id: "Road tunnel/4WD/0",
      type: "line",
      source: "esri",
      "source-layer": "Road tunnel",
      filter: ["all", ["==", "_symbol", 10], ["!in", "Viz", 2]],
      minzoom: 13,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#FFFFFF",
        "line-opacity": 0.5,
        "line-width": {
          base: 1.2,
          stops: [
            [11, 0.75],
            [14, 1.3],
            [17, 7.3],
            [20, 48],
          ],
        },
      },
    },
    {
      id: "Road tunnel/Service/0",
      type: "line",
      source: "esri",
      "source-layer": "Road tunnel",
      filter: ["all", ["==", "_symbol", 8], ["!in", "Viz", 2]],
      minzoom: 13,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#FFFFFF",
        "line-opacity": 0.5,
        "line-width": {
          base: 1.2,
          stops: [
            [11, 0.75],
            [14, 1.3],
            [17, 8.3],
            [20, 48],
          ],
        },
      },
    },
    {
      id: "Road tunnel/Local/0",
      type: "line",
      source: "esri",
      "source-layer": "Road tunnel",
      filter: ["all", ["==", "_symbol", 7], ["!in", "Viz", 2]],
      minzoom: 12,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [12, "#fcfbf9"],
            [13, "#ffffff"],
          ],
        },
        "line-opacity": 0.5,
        "line-width": {
          base: 1.4,
          stops: [
            [11, 1.1],
            [14, 2],
            [16, 6],
            [17, 14],
            [20, 55],
          ],
        },
      },
    },
    {
      id: "Road tunnel/Minor, ramp or traffic circle/0",
      type: "line",
      source: "esri",
      "source-layer": "Road tunnel",
      filter: ["all", ["==", "_symbol", 6], ["!in", "Viz", 2]],
      minzoom: 9,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [9, "#f0efea"],
            [13, "#ffffff"],
          ],
        },
        "line-opacity": 0.5,
        "line-width": {
          base: 1.2,
          stops: [
            [9, 0.75],
            [14, 2],
            [16, 9.5],
            [17, 17],
            [20, 55],
          ],
        },
      },
    },
    {
      id: "Road tunnel/Minor/0",
      type: "line",
      source: "esri",
      "source-layer": "Road tunnel",
      filter: ["all", ["==", "_symbol", 5], ["!in", "Viz", 2]],
      minzoom: 9,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [9, "#f0efea"],
            [13, "#ffffff"],
          ],
        },
        "line-opacity": 0.5,
        "line-width": {
          base: 1.2,
          stops: [
            [9, 1.3],
            [14, 4.5],
            [16, 9.5],
            [17, 17],
            [20, 55],
          ],
        },
      },
    },
    {
      id: "Road tunnel/Major, ramp or traffic circle/0",
      type: "line",
      source: "esri",
      "source-layer": "Road tunnel",
      filter: ["all", ["==", "_symbol", 4], ["!in", "Viz", 2]],
      minzoom: 9,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [9, "#f0efea"],
            [13, "#ffffff"],
          ],
        },
        "line-opacity": 0.5,
        "line-width": {
          base: 1.2,
          stops: [
            [9, 1.3],
            [14, 5.3],
            [16, 10.3],
            [17, 20],
            [20, 60],
          ],
        },
      },
    },
    {
      id: "Road tunnel/Major/0",
      type: "line",
      source: "esri",
      "source-layer": "Road tunnel",
      filter: ["all", ["==", "_symbol", 3], ["!in", "Viz", 2]],
      minzoom: 8,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [9, "#f0efea"],
            [13, "#ffffff"],
          ],
        },
        "line-opacity": 0.5,
        "line-width": {
          base: 1.2,
          stops: [
            [8, 1.3],
            [14, 5.3],
            [16, 10.3],
            [17, 20],
            [20, 60],
          ],
        },
      },
    },
    {
      id: "Road tunnel/Freeway Motorway, ramp or traffic circle/1",
      type: "line",
      source: "esri",
      "source-layer": "Road tunnel",
      filter: ["all", ["==", "_symbol", 2], ["!in", "Viz", 2]],
      minzoom: 6,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#ffffff",
        "line-opacity": 0.5,
        "line-width": {
          base: 1.2,
          stops: [
            [9, 0.3],
            [14, 8.3],
            [16, 14.3],
            [17, 30],
            [20, 52],
          ],
        },
      },
    },
    {
      id: "Road tunnel/Highway/1",
      type: "line",
      source: "esri",
      "source-layer": "Road tunnel",
      filter: ["all", ["==", "_symbol", 1], ["!in", "Viz", 2]],
      minzoom: 6,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#ffffff",
        "line-opacity": 0.5,
        "line-width": {
          base: 1.2,
          stops: [
            [6, 0.3],
            [14, 8.3],
            [16, 14.3],
            [17, 30],
            [20, 52],
          ],
        },
      },
    },
    {
      id: "Road tunnel/Freeway Motorway/1",
      type: "line",
      source: "esri",
      "source-layer": "Road tunnel",
      filter: ["all", ["==", "_symbol", 0], ["!in", "Viz", 2]],
      minzoom: 5,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#ffffff",
        "line-opacity": 0.5,
        "line-width": {
          base: 1.2,
          stops: [
            [5, 0.3],
            [14, 8.3],
            [16, 14.3],
            [17, 30],
            [20, 52],
          ],
        },
      },
    },
    {
      id: "Road tunnel/Freeway Motorway, ramp or traffic circle/0",
      type: "line",
      source: "esri",
      "source-layer": "Road tunnel",
      filter: ["all", ["==", "_symbol", 2], ["!in", "Viz", 2]],
      minzoom: 6,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [6, "#F6CA91"],
            [8, "#F6CA91"],
            [12, "#F6CA91"],
          ],
        },
        "line-opacity": 0.5,
        "line-width": {
          base: 1.2,
          stops: [
            [9, 0.7],
            [14, 6.3],
            [16, 12.3],
            [17, 28],
            [20, 50],
          ],
        },
      },
    },
    {
      id: "Road tunnel/Highway/0",
      type: "line",
      source: "esri",
      "source-layer": "Road tunnel",
      filter: ["all", ["==", "_symbol", 1], ["!in", "Viz", 2]],
      minzoom: 6,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [6, "#F6CA91"],
            [8, "#F6CA91"],
            [12, "#F6CA91"],
          ],
        },
        "line-opacity": 0.5,
        "line-width": {
          base: 1.2,
          stops: [
            [6, 0.7],
            [14, 6.3],
            [16, 12.3],
            [17, 28],
            [20, 50],
          ],
        },
      },
    },
    {
      id: "Road tunnel/Freeway Motorway/0",
      type: "line",
      source: "esri",
      "source-layer": "Road tunnel",
      filter: ["all", ["==", "_symbol", 0], ["!in", "Viz", 2]],
      minzoom: 5,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#F6CA91",
        "line-opacity": 0.5,
        "line-width": {
          base: 1.2,
          stops: [
            [5, 0.7],
            [14, 6.3],
            [16, 12.3],
            [17, 28],
            [20, 50],
          ],
        },
      },
    },
    {
      id: "Special area of interest/Gutter",
      type: "fill",
      source: "esri",
      "source-layer": "Special area of interest",
      filter: ["in", "_symbol", 9, 3],
      minzoom: 14,
      layout: {},
      paint: {
        "fill-color": "#E8E7E5",
        "fill-outline-color": "#bcb7ae",
      },
    },
    {
      id: "Boundary line/Disputed admin2",
      type: "line",
      source: "esri",
      "source-layer": "Boundary line",
      filter: ["all", ["==", "_symbol", 8], ["!in", "Viz", 2]],
      minzoom: 9,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [1, "#f5f5f5"],
            [3, "#fafafa"],
            [9, "#ffffff"],
          ],
        },
        "line-width": {
          base: 1.2,
          stops: [
            [1, 0.65],
            [14, 1.3],
            [17, 2.5],
          ],
        },
        "line-dasharray": [5, 5],
      },
    },
    {
      id: "Boundary line/Disputed admin1/1",
      type: "line",
      source: "esri",
      "source-layer": "Boundary line",
      minzoom: 3,
      filter: ["all", ["==", "_symbol", 7], ["!in", "Viz", 2]],
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#c6c4b6",
        "line-opacity": 0.95,
        "line-width": {
          base: 1,
          stops: [
            [4, 0.5],
            [14, 7],
            [17, 7],
          ],
        },
      },
    },
    {
      id: "Boundary line/Disputed admin0/1",
      type: "line",
      source: "esri",
      "source-layer": "Boundary line",
      filter: [
        "all",
        ["==", "_symbol", 6],
        ["!in", "Viz", 2],
        ["!in", "DisputeID", 8, 16, 90, 96, 0],
      ],
      minzoom: 1,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#c6c4b6",
        "line-opacity": 0.95,
        "line-width": {
          base: 1,
          stops: [
            [1, 0.5],
            [14, 9.3],
            [17, 9.3],
          ],
        },
      },
    },
    {
      id: "Boundary line/Disputed admin1/0",
      type: "line",
      source: "esri",
      "source-layer": "Boundary line",
      minzoom: 3,
      filter: ["all", ["==", "_symbol", 7], ["!in", "Viz", 2]],
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [1, "#f5f5f5"],
            [3, "#fafafa"],
            [9, "#ffffff"],
          ],
        },
        "line-width": {
          base: 1.2,
          stops: [
            [1, 0.65],
            [14, 1.3],
            [17, 2.5],
          ],
        },
        "line-dasharray": [5, 5],
      },
    },
    {
      id: "Boundary line/Disputed admin0/0",
      type: "line",
      source: "esri",
      "source-layer": "Boundary line",
      filter: [
        "all",
        ["==", "_symbol", 6],
        ["!in", "Viz", 2],
        ["!in", "DisputeID", 8, 16, 90, 96, 0],
      ],
      minzoom: 1,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [1, "#f5f5f5"],
            [3, "#fafafa"],
            [9, "#ffffff"],
          ],
        },
        "line-width": {
          base: 1.2,
          stops: [
            [1, 0.65],
            [14, 1.3],
            [17, 2.5],
          ],
        },
        "line-dasharray": [5, 5],
      },
    },
    {
      id: "Boundary line/Admin2/1",
      type: "line",
      source: "esri",
      "source-layer": "Boundary line",
      filter: ["all", ["==", "_symbol", 2], ["!in", "Viz", 2]],
      minzoom: 10,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#ede7e0",
        "line-opacity": 0.6,
        "line-width": {
          base: 1.2,
          stops: [
            [8, 2.3],
            [14, 5.5],
            [17, 7.5],
          ],
        },
      },
    },
    {
      id: "Boundary line/Admin1/1",
      type: "line",
      source: "esri",
      "source-layer": "Boundary line",
      filter: ["all", ["==", "_symbol", 1], ["!in", "Viz", 2]],
      minzoom: 3,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [3, "#DEE1CC"],
            [10, "#d1ceb8"],
          ],
        },
        "line-opacity": 0.5,
        "line-width": {
          base: 1,
          stops: [
            [3, 0.5],
            [14, 9],
            [17, 10],
          ],
        },
      },
    },
    {
      id: "Boundary line/Admin0/1",
      type: "line",
      source: "esri",
      "source-layer": "Boundary line",
      filter: ["all", ["==", "_symbol", 0], ["!in", "Viz", 2]],
      minzoom: 1,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#d1cfc2",
        "line-width": {
          base: 1,
          stops: [
            [1, 0.5],
            [14, 11.3],
            [17, 12.3],
          ],
        },
      },
    },
    {
      id: "Boundary line/Admin5",
      type: "line",
      source: "esri",
      "source-layer": "Boundary line",
      filter: ["all", ["==", "_symbol", 5], ["!in", "Viz", 2]],
      minzoom: 16,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#9C9C9C",
        "line-width": {
          base: 1.2,
          stops: [
            [14, 1],
            [17, 1],
          ],
        },
        "line-dasharray": [6, 4],
      },
    },
    {
      id: "Boundary line/Admin4",
      type: "line",
      source: "esri",
      "source-layer": "Boundary line",
      filter: ["all", ["==", "_symbol", 4], ["!in", "Viz", 2]],
      minzoom: 16,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#9C9C9C",
        "line-width": {
          base: 1.2,
          stops: [
            [14, 1],
            [17, 1],
          ],
        },
        "line-dasharray": [6, 4],
      },
    },
    {
      id: "Boundary line/Admin3",
      type: "line",
      source: "esri",
      "source-layer": "Boundary line",
      filter: ["all", ["==", "_symbol", 3], ["!in", "Viz", 2]],
      minzoom: 16,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#9C9C9C",
        "line-width": {
          base: 1.2,
          stops: [
            [14, 1],
            [17, 1],
          ],
        },
        "line-dasharray": [6, 4],
      },
    },
    {
      id: "Boundary line/Admin2/0",
      type: "line",
      source: "esri",
      "source-layer": "Boundary line",
      filter: ["all", ["==", "_symbol", 2], ["!in", "Viz", 2]],
      minzoom: 9,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#888577",
        "line-dasharray": [7, 5],
        "line-width": {
          base: 1.2,
          stops: [
            [8, 0.5],
            [14, 1],
          ],
        },
      },
    },
    {
      id: "Boundary line/Admin1/0",
      type: "line",
      source: "esri",
      "source-layer": "Boundary line",
      filter: ["all", ["==", "_symbol", 1], ["!in", "Viz", 2]],
      minzoom: 3,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [3, "#c1bdb5"],
            [4, "#9b9382"],
          ],
        },
        "line-width": {
          base: 1,
          stops: [
            [4, 0.5],
            [14, 1.3],
            [17, 1.3],
          ],
        },
      },
    },
    {
      id: "Boundary line/Admin0/0",
      type: "line",
      source: "esri",
      "source-layer": "Boundary line",
      filter: ["all", ["==", "_symbol", 0], ["!in", "Viz", 2]],
      minzoom: 1,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [1, "#b9b9b9"],
            [7, "#434242"],
          ],
        },
        "line-width": {
          base: 1.2,
          stops: [
            [1, 0.5],
            [14, 1.3],
            [17, 2],
          ],
        },
      },
    },
    {
      id: "Coastline",
      type: "line",
      source: "esri",
      "source-layer": "Coastline",
      maxzoom: 9,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": {
          stops: [
            [0, "#53B9EA"],
            [7, "#53B9EA"],
            [9, "#6BC4F0"],
          ],
        },
        "line-width": {
          base: 1.2,
          stops: [
            [0, 0.5],
            [9, 1.3],
          ],
        },
      },
    },
    {
      id: "Pavement marking/Arrow",
      type: "symbol",
      source: "esri",
      "source-layer": "Pavement marking",
      minzoom: 17,
      filter: ["==", "_symbol", 0],
      layout: {
        "icon-rotation-alignment": "map",
        "icon-image": "Pavement marking/Arrow",
        "icon-size": {
          stops: [
            [17, 0.5],
            [22, 1],
          ],
        },
        "icon-rotate": {
          type: "identity",
          property: "angle",
          default: 0,
        },
        "icon-allow-overlap": true,
      },
      paint: {
        "icon-color": "#B2B2B2",
      },
    },
    {
      id: "Pavement marking/Handicap",
      type: "symbol",
      source: "esri",
      "source-layer": "Pavement marking",
      minzoom: 18,
      filter: ["==", "_symbol", 1],
      layout: {
        "icon-rotation-alignment": "map",
        "icon-image": "Pavement marking/Handicap",
        "icon-size": {
          stops: [
            [18, 0.5],
            [20, 1],
            [22, 1.25],
          ],
        },
        "icon-rotate": {
          type: "identity",
          property: "angle",
          default: 0,
        },
        "icon-allow-overlap": true,
      },
      paint: {
        "icon-color": "#296AA3",
        "icon-opacity": {
          stops: [
            [18, 0.65],
            [20, 1],
          ],
        },
      },
    },
    {
      id: "Pavement marking/Left turn",
      type: "symbol",
      source: "esri",
      "source-layer": "Pavement marking",
      minzoom: 17,
      filter: ["==", "_symbol", 2],
      layout: {
        "icon-rotation-alignment": "map",
        "icon-image": "Pavement marking/Left turn",
        "icon-size": {
          stops: [
            [17, 0.5],
            [22, 1],
          ],
        },
        "icon-rotate": {
          type: "identity",
          property: "angle",
          default: 0,
        },
        "icon-allow-overlap": true,
      },
      paint: {
        "icon-color": "#B2B2B2",
      },
    },
    {
      id: "Pavement marking/Right turn",
      type: "symbol",
      source: "esri",
      "source-layer": "Pavement marking",
      minzoom: 17,
      filter: ["==", "_symbol", 3],
      layout: {
        "icon-rotation-alignment": "map",
        "icon-image": "Pavement marking/Right turn",
        "icon-size": {
          stops: [
            [17, 0.5],
            [22, 1],
          ],
        },
        "icon-rotate": {
          type: "identity",
          property: "angle",
          default: 0,
        },
        "icon-allow-overlap": true,
      },
      paint: {
        "icon-color": "#B2B2B2",
      },
    },
    {
      id: "Pavement marking/Two-way left turn",
      type: "symbol",
      source: "esri",
      "source-layer": "Pavement marking",
      minzoom: 17,
      filter: ["==", "_symbol", 4],
      layout: {
        "icon-rotation-alignment": "map",
        "icon-image": "Pavement marking/Two-way left turn",
        "icon-size": {
          stops: [
            [17, 0.5],
            [22, 1],
          ],
        },
        "icon-rotate": {
          type: "identity",
          property: "angle",
          default: 0,
        },
        "icon-allow-overlap": true,
      },
      paint: {
        "icon-color": "#B2B2B2",
      },
    },
    {
      id: "Pavement marking/U-turn",
      type: "symbol",
      source: "esri",
      "source-layer": "Pavement marking",
      minzoom: 17,
      filter: ["==", "_symbol", 5],
      layout: {
        "icon-rotation-alignment": "map",
        "icon-image": "Pavement marking/U-turn",
        "icon-size": {
          stops: [
            [17, 0.5],
            [22, 1],
          ],
        },
        "icon-rotate": {
          type: "identity",
          property: "angle",
          default: 0,
        },
        "icon-allow-overlap": true,
      },
      paint: {
        "icon-color": "#B2B2B2",
      },
    },
    {
      id: "parcel-linked",
      type: "fill",
      source: "baseunits",
      "source-layer": "parcels",
      minzoom: 11,
      filter: ["==", "parcelno", ""],
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": layers["parcels"].color,
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
      source: "baseunits",
      "source-layer": "parcels",
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
        "line-color": layers["streets"].color,
        "line-opacity": 0.75,
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
        "line-color": layers["streets"].color,
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
        "line-color": "#bbb",
        "line-opacity": 1,
      },
    },
    {
      id: "Water point/Sea or ocean",
      type: "symbol",
      source: "esri",
      "source-layer": "Water point",
      filter: ["==", "_label_class", 0],
      minzoom: 9,
      layout: {
        "symbol-avoid-edges": true,
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "text-size": {
          stops: [
            [9, 8.5],
            [15, 15.5],
          ],
        },
        "text-letter-spacing": 0.3,
        "text-line-height": 1.6,
        "text-max-width": 4,
        "text-field": "{_name_global}",
        "text-padding": 15,
      },
      paint: {
        "text-color": "#0d6c9a",
        "text-halo-blur": 1,
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 1,
      },
    },
    {
      id: "Water point/Island",
      type: "symbol",
      source: "esri",
      "source-layer": "Water point",
      filter: ["==", "_label_class", 7],
      minzoom: 9,
      layout: {
        "symbol-avoid-edges": true,
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "text-size": {
          stops: [
            [9, 8.5],
            [15, 10],
          ],
        },
        "text-letter-spacing": 0.1,
        "text-max-width": 4,
        "text-field": "{_name_global}",
        "text-padding": 15,
      },
      paint: {
        "text-color": "#595959",
        "text-halo-blur": 1,
        "text-halo-color": "#EBE7E2",
        "text-halo-width": 1,
      },
    },
    {
      id: "Water point/Dam or weir",
      type: "symbol",
      source: "esri",
      "source-layer": "Water point",
      filter: ["==", "_label_class", 5],
      minzoom: 9,
      layout: {
        "symbol-avoid-edges": true,
        "text-font": ["Montserrat SemiBold"],
        "text-size": {
          stops: [
            [9, 8.5],
            [15, 10],
          ],
        },
        "text-letter-spacing": 0.1,
        "text-max-width": 4,
        "text-field": "{_name_global}",
        "text-padding": 15,
      },
      paint: {
        "text-color": "#171310",
        "text-halo-color": "#EBE7E2",
        "text-halo-width": 0.7,
        "text-halo-blur": 1,
      },
    },
    {
      id: "Water point/Playa",
      type: "symbol",
      source: "esri",
      "source-layer": "Water point",
      filter: ["==", "_label_class", 6],
      minzoom: 9,
      layout: {
        "symbol-avoid-edges": true,
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "text-size": {
          stops: [
            [9, 8.5],
            [15, 10],
          ],
        },
        "text-letter-spacing": 0.1,
        "text-max-width": 4,
        "text-field": "{_name_global}",
        "text-padding": 15,
      },
      paint: {
        "text-color": "#171310",
        "text-halo-color": "#EBE7E2",
        "text-halo-width": 0.7,
        "text-halo-blur": 1,
      },
    },
    {
      id: "Water point/Canal or ditch",
      type: "symbol",
      source: "esri",
      "source-layer": "Water point",
      filter: ["==", "_label_class", 4],
      minzoom: 9,
      layout: {
        "symbol-avoid-edges": true,
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "text-size": {
          stops: [
            [9, 8.5],
            [15, 10],
          ],
        },
        "text-letter-spacing": 0.13,
        "text-max-width": 4,
        "text-field": "{_name_global}",
        "text-padding": 15,
      },
      paint: {
        "text-color": "#0d6c9a",
        "text-halo-blur": 1,
        "text-halo-color": "#EBE7E2",
        "text-halo-width": 1,
      },
    },
    {
      id: "Water point/Stream or river",
      type: "symbol",
      source: "esri",
      "source-layer": "Water point",
      filter: ["==", "_label_class", 3],
      minzoom: 9,
      layout: {
        "symbol-avoid-edges": true,
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "text-size": {
          stops: [
            [9, 8.5],
            [15, 10],
          ],
        },
        "text-letter-spacing": 0.1,
        "text-max-width": 4,
        "text-field": "{_name_global}",
        "text-padding": 15,
      },
      paint: {
        "text-color": "#0d6c9a",
        "text-halo-blur": 1,
        "text-halo-color": "#EBE7E2",
        "text-halo-width": 0.5,
      },
    },
    {
      id: "Water point/Lake or reservoir",
      type: "symbol",
      source: "esri",
      "source-layer": "Water point",
      filter: ["==", "_label_class", 2],
      minzoom: 9,
      layout: {
        "symbol-avoid-edges": true,
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "text-size": {
          stops: [
            [9, 8.5],
            [15, 10],
          ],
        },
        "text-letter-spacing": 0.1,
        "text-max-width": 4,
        "text-field": "{_name_global}",
        "text-padding": 15,
      },
      paint: {
        "text-color": "#0d6c9a",
        "text-halo-blur": 1,
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 0.5,
      },
    },
    {
      id: "Water point/Bay or inlet",
      type: "symbol",
      source: "esri",
      "source-layer": "Water point",
      filter: ["==", "_label_class", 1],
      minzoom: 9,
      layout: {
        "symbol-avoid-edges": true,
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "text-size": {
          stops: [
            [9, 8.5],
            [15, 10],
          ],
        },
        "text-letter-spacing": 0.1,
        "text-max-width": 4,
        "text-field": "{_name_global}",
        "text-padding": 15,
      },
      paint: {
        "text-color": "#0d6c9a",
        "text-halo-blur": 1,
        "text-halo-color": "#EBE7E2",
        "text-halo-width": 0.5,
      },
    },
    {
      id: "Ferry/label/Ferry",
      type: "symbol",
      source: "esri",
      "source-layer": "Ferry/label",
      filter: ["all", ["==", "_label_class", 0], ["!in", "Viz", 2]],
      minzoom: 12,
      layout: {
        "symbol-placement": "line",
        "symbol-avoid-edges": true,
        "text-font": ["Montserrat SemiBold"],
        "text-size": 10,
        "text-letter-spacing": 0.05,
        "text-max-width": 8,
        "text-field": "{_name_global}",
        "text-padding": 30,
      },
      paint: {
        "text-color": "#ffffff",
        "text-halo-width": 1.2,
        "text-halo-color": "#6BC4F0",
        "text-halo-blur": 1,
      },
    },
    {
      id: "Water line/label/Default",
      type: "symbol",
      source: "esri",
      "source-layer": "Water line/label",
      minzoom: 11,
      layout: {
        "symbol-placement": "line",
        "symbol-avoid-edges": true,
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "text-size": 9.5,
        "text-letter-spacing": 0.07,
        "text-max-width": 8,
        "text-max-angle": 35,
        "text-field": "{_name_global}",
        "text-padding": 1,
        "text-offset": [0, -0.5],
        "symbol-spacing": 800,
      },
      paint: {
        "text-color": "#0d6c9a",
        "text-halo-blur": 1,
        "text-halo-color": "#EBE7E2",
        "text-halo-width": 0.5,
      },
    },
    {
      id: "Water line large scale/label/Default",
      type: "symbol",
      source: "esri",
      "source-layer": "Water line large scale/label",
      minzoom: 7,
      maxzoom: 11,
      layout: {
        "symbol-placement": "line",
        "symbol-avoid-edges": true,
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "text-size": 9.3,
        "text-letter-spacing": 0.01,
        "text-max-width": 8,
        "text-max-angle": {
          stops: [
            [7, 25],
            [11, 35],
          ],
        },
        "text-field": "{_name}",
        "text-padding": 1,
        "text-offset": [0, -0.5],
        "symbol-spacing": 800,
      },
      paint: {
        "text-color": "#0d6c9a",
        "text-halo-blur": 1,
        "text-halo-color": "#EBE7E2",
        "text-halo-width": 0.5,
      },
    },
    {
      id: "Water line medium scale/label/Default",
      type: "symbol",
      source: "esri",
      "source-layer": "Water line medium scale/label",
      minzoom: 5,
      maxzoom: 7,
      layout: {
        "symbol-placement": "line",
        "symbol-avoid-edges": true,
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "text-size": 9.3,
        "text-letter-spacing": 0.1,
        "text-max-width": 8,
        "text-max-angle": {
          stops: [
            [5, 15],
            [6, 25],
          ],
        },
        "text-field": "{_name}",
        "text-padding": 1,
        "text-offset": [0, -0.5],
        "symbol-spacing": 800,
      },
      paint: {
        "text-color": "#0d6c9a",
        "text-halo-blur": 1,
        "text-halo-color": "#EBE7E2",
        "text-halo-width": 0.5,
      },
    },
    {
      id: "Water line small scale/label/Default",
      type: "symbol",
      source: "esri",
      "source-layer": "Water line small scale/label",
      minzoom: 4,
      maxzoom: 5,
      layout: {
        "symbol-placement": "line",
        "symbol-avoid-edges": true,
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "text-size": 8.5,
        "text-letter-spacing": 0.1,
        "text-max-width": 8,
        "text-max-angle": 18,
        "text-field": "{_name}",
        "text-padding": 1,
        "text-offset": [0, -0.5],
        "symbol-spacing": 800,
      },
      paint: {
        "text-color": "#0d6c9a",
        "text-halo-blur": 1,
        "text-halo-color": "#EBE7E2",
        "text-halo-width": 0.5,
      },
    },
    {
      id: "Marine park/label/Default",
      type: "symbol",
      source: "esri",
      "source-layer": "Marine park/label",
      minzoom: 11,
      layout: {
        "text-font": ["Montserrat SemiBold"],
        "text-size": {
          stops: [
            [15, 9.5],
            [20, 11],
            [22, 15],
          ],
        },
        "text-letter-spacing": {
          stops: [
            [15, 0.05],
            [20, 0.15],
          ],
        },
        "text-max-width": 8,
        "text-field": "{_name_global}",
        "text-padding": 15,
        "symbol-avoid-edges": true,
      },
      paint: {
        "text-color": "#3a7795",
      },
    },
    {
      id: "Water area/label/Dam or weir",
      type: "symbol",
      source: "esri",
      "source-layer": "Water area/label",
      filter: ["==", "_label_class", 8],
      minzoom: 11,
      layout: {
        "text-font": ["Montserrat SemiBold"],
        "text-size": 9.5,
        "text-letter-spacing": 0.08,
        "text-max-width": 8,
        "text-field": "{_name_global}",
        "text-padding": 15,
        "symbol-avoid-edges": true,
      },
      paint: {
        "text-color": "#171310",
        "text-halo-color": "#EBE7E2",
        "text-halo-width": 0.5,
        "text-halo-blur": 1,
      },
    },
    {
      id: "Water area/label/Playa",
      type: "symbol",
      source: "esri",
      "source-layer": "Water area/label",
      filter: ["==", "_label_class", 9],
      minzoom: 11,
      layout: {
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "text-size": 9.5,
        "text-letter-spacing": 0.08,
        "text-max-width": 8,
        "text-field": "{_name_global}",
        "text-padding": 15,
        "symbol-avoid-edges": true,
      },
      paint: {
        "text-color": "#171310",
        "text-halo-color": "#EBE7E2",
        "text-halo-width": 0.5,
        "text-halo-blur": 1,
      },
    },
    {
      id: "Water area/label/Canal or ditch",
      type: "symbol",
      source: "esri",
      "source-layer": "Water area/label",
      filter: ["==", "_label_class", 2],
      minzoom: 11,
      layout: {
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "symbol-placement": "line",
        "symbol-spacing": 1000,
        "text-size": 10.5,
        "text-letter-spacing": 0.13,
        "text-field": "{_name_global}",
        "text-padding": 15,
        "symbol-avoid-edges": true,
        "text-max-width": 5,
      },
      paint: {
        "text-color": "#0d6c9a",
        "text-halo-blur": 1,
        "text-halo-color": "#EBE7E2",
        "text-halo-width": 0.5,
      },
    },
    {
      id: "Water area/label/Small river",
      type: "symbol",
      source: "esri",
      "source-layer": "Water area/label",
      filter: ["==", "_label_class", 7],
      minzoom: 11,
      layout: {
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "symbol-placement": "line",
        "symbol-spacing": 1000,
        "text-size": 10.5,
        "text-letter-spacing": 0.13,
        "text-field": "{_name_global}",
        "text-padding": 15,
        "symbol-avoid-edges": true,
        "text-max-width": 8,
      },
      paint: {
        "text-color": "#0d6c9a",
        "text-halo-blur": 1,
        "text-halo-color": "#EBE7E2",
        "text-halo-width": 0.5,
      },
    },
    {
      id: "Water area/label/Large river",
      type: "symbol",
      source: "esri",
      "source-layer": "Water area/label",
      filter: ["==", "_label_class", 4],
      minzoom: 11,
      layout: {
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "symbol-placement": "line",
        "symbol-spacing": 1000,
        "text-size": 10.5,
        "text-letter-spacing": 0.13,
        "text-field": "{_name_global}",
        "text-padding": 15,
        "symbol-avoid-edges": true,
        "text-max-width": 8,
      },
      paint: {
        "text-color": "#0d6c9a",
        "text-halo-blur": 1,
        "text-halo-color": "#EBE7E2",
        "text-halo-width": 0.5,
      },
    },
    {
      id: "Water area/label/Small lake or reservoir",
      type: "symbol",
      source: "esri",
      "source-layer": "Water area/label",
      filter: ["==", "_label_class", 6],
      minzoom: 11,
      layout: {
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "text-size": 10.5,
        "text-letter-spacing": 0.13,
        "text-line-height": 1,
        "text-max-width": 4,
        "text-field": "{_name_global}",
        "text-padding": 15,
        "symbol-avoid-edges": true,
      },
      paint: {
        "text-color": "#0d6c9a",
        "text-halo-blur": 1,
        "text-halo-color": "#EBE7E2",
        "text-halo-width": 0.5,
      },
    },
    {
      id: "Water area/label/Large lake or reservoir",
      type: "symbol",
      source: "esri",
      "source-layer": "Water area/label",
      filter: ["==", "_label_class", 3],
      minzoom: 11,
      layout: {
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "text-size": 10.5,
        "text-letter-spacing": 0.13,
        "text-line-height": 1.5,
        "text-max-width": 4,
        "text-field": "{_name_global}",
        "text-padding": 15,
        "symbol-avoid-edges": true,
      },
      paint: {
        "text-color": "#0d6c9a",
        "text-halo-blur": 1,
        "text-halo-color": "#EBE7E2",
        "text-halo-width": 0.5,
      },
    },
    {
      id: "Water area/label/Bay or inlet",
      type: "symbol",
      source: "esri",
      "source-layer": "Water area/label",
      filter: ["==", "_label_class", 1],
      minzoom: 11,
      layout: {
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "text-size": 10.5,
        "text-letter-spacing": 0.13,
        "text-line-height": 1.5,
        "text-max-width": 4,
        "text-field": "{_name_global}",
        "text-padding": 15,
        "symbol-avoid-edges": true,
      },
      paint: {
        "text-color": "#0d6c9a",
        "text-halo-blur": 1,
        "text-halo-color": "#EBE7E2",
        "text-halo-width": 0.5,
      },
    },
    {
      id: "Water area/label/Small island",
      type: "symbol",
      source: "esri",
      "source-layer": "Water area/label",
      filter: ["==", "_label_class", 0],
      minzoom: 11,
      layout: {
        "text-size": 10.5,
        "text-letter-spacing": 0.1,
        "text-max-width": 4,
        "text-field": "{_name_global}",
        "text-padding": 15,
        "symbol-avoid-edges": true,
        "text-font": ["Avenir Next LT Pro Demi Italic"],
      },
      paint: {
        "text-color": "#595959",
        "text-halo-blur": 1,
        "text-halo-color": "#EBE7E2",
        "text-halo-width": 1,
      },
    },
    {
      id: "Water area/label/Large island",
      type: "symbol",
      source: "esri",
      "source-layer": "Water area/label",
      filter: ["==", "_label_class", 5],
      minzoom: 11,
      layout: {
        "text-size": 10.5,
        "text-letter-spacing": 0.13,
        "text-line-height": 1.5,
        "text-max-width": 4,
        "text-field": "{_name_global}",
        "text-padding": 15,
        "symbol-avoid-edges": true,
        "text-font": ["Avenir Next LT Pro Demi Italic"],
      },
      paint: {
        "text-color": "#595959",
        "text-halo-blur": 1,
        "text-halo-color": "#EBE7E2",
        "text-halo-width": 1,
      },
    },
    {
      id: "Water area large scale/label/River",
      type: "symbol",
      source: "esri",
      "source-layer": "Water area large scale/label",
      filter: ["==", "_label_class", 1],
      minzoom: 7,
      maxzoom: 11,
      layout: {
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "symbol-placement": "line",
        "symbol-spacing": 1000,
        "text-size": 9.3,
        "text-letter-spacing": 0.1,
        "text-field": "{_name}",
        "text-padding": 15,
        "symbol-avoid-edges": true,
        "text-max-width": 4,
      },
      paint: {
        "text-color": "#0d6c9a",
        "text-halo-blur": 1,
        "text-halo-color": "#EBE7E2",
        "text-halo-width": 0.5,
      },
    },
    {
      id: "Water area large scale/label/Lake or lake intermittent",
      type: "symbol",
      source: "esri",
      "source-layer": "Water area large scale/label",
      filter: ["==", "_label_class", 0],
      minzoom: 7,
      maxzoom: 11,
      layout: {
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "text-size": 9.3,
        "text-letter-spacing": 0.1,
        "text-max-width": 4,
        "text-field": "{_name}",
        "text-padding": 15,
        "symbol-avoid-edges": true,
      },
      paint: {
        "text-color": "#0d6c9a",
        "text-halo-blur": 1,
        "text-halo-color": "#EBE7E2",
        "text-halo-width": 0.5,
      },
    },
    {
      id: "Water area medium scale/label/Default",
      type: "symbol",
      source: "esri",
      "source-layer": "Water area medium scale/label",
      minzoom: 5,
      maxzoom: 7,
      layout: {
        "text-max-width": 4,
        "text-field": "{_name}",
        "text-padding": 15,
        "symbol-avoid-edges": true,
        "text-letter-spacing": 0.08,
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "text-size": 9.3,
      },
      paint: {
        "text-color": "#0d6c9a",
        "text-halo-blur": 1,
        "text-halo-color": "#EBE7E2",
        "text-halo-width": 0.5,
      },
    },
    {
      id: "Water area small scale/label/Default",
      type: "symbol",
      source: "esri",
      "source-layer": "Water area small scale/label",
      minzoom: 1,
      maxzoom: 5,
      layout: {
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "text-size": 9.3,
        "text-letter-spacing": 0.08,
        "text-max-width": 4,
        "text-field": "{_name}",
        "text-padding": 15,
        "symbol-avoid-edges": true,
      },
      paint: {
        "text-color": "#0d6c9a",
        "text-halo-blur": 1,
        "text-halo-color": "#EBE7E2",
        "text-halo-width": 0.5,
      },
    },
    {
      id: "Marine area/label/Default",
      type: "symbol",
      source: "esri",
      "source-layer": "Marine area/label",
      minzoom: 11,
      layout: {
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "text-size": 10.5,
        "text-letter-spacing": 0.13,
        "text-line-height": 1.5,
        "text-max-width": 4,
        "text-field": "{_name_global}",
        "text-padding": 15,
        "symbol-avoid-edges": true,
      },
      paint: {
        "text-color": "#0d6c9a",
        "text-halo-blur": 1,
        "text-halo-color": "#82CFF5",
        "text-halo-width": 1,
      },
    },
    {
      id: "Marine waterbody/label/small",
      type: "symbol",
      source: "esri",
      "source-layer": "Marine waterbody/label",
      filter: ["==", "_label_class", 4],
      minzoom: 1,
      maxzoom: 10,
      layout: {
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "text-letter-spacing": {
          stops: [
            [1, 0.12],
            [10, 0.25],
          ],
        },
        "text-line-height": 1.5,
        "text-max-width": 6,
        "text-field": "{_name}",
        "text-padding": 15,
        "symbol-avoid-edges": true,
        "text-size": {
          stops: [
            [1, 8],
            [6, 9.3],
          ],
        },
      },
      paint: {
        "text-color": {
          stops: [
            [1, "#0d6c9a"],
            [6, "#0d6c9a"],
          ],
        },
        "text-halo-blur": 1,
        "text-halo-color": "#82CFF5",
        "text-halo-width": 0.5,
      },
    },
    {
      id: "Marine waterbody/label/medium",
      type: "symbol",
      source: "esri",
      "source-layer": "Marine waterbody/label",
      filter: ["==", "_label_class", 3],
      minzoom: 1,
      maxzoom: 10,
      layout: {
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "text-letter-spacing": {
          stops: [
            [1, 0.15],
            [10, 0.3],
          ],
        },
        "text-line-height": 1.5,
        "text-max-width": 6,
        "text-field": "{_name}",
        "text-padding": 15,
        "symbol-avoid-edges": true,
        "text-size": {
          stops: [
            [1, 8],
            [6, 9.3],
          ],
        },
      },
      paint: {
        "text-color": {
          stops: [
            [1, "#0d6c9a"],
            [6, "#0d6c9a"],
          ],
        },
        "text-halo-blur": 1,
        "text-halo-color": "#82CFF5",
        "text-halo-width": 0.5,
      },
    },
    {
      id: "Marine waterbody/label/large",
      type: "symbol",
      source: "esri",
      "source-layer": "Marine waterbody/label",
      filter: ["==", "_label_class", 2],
      minzoom: 1,
      maxzoom: 10,
      layout: {
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "text-letter-spacing": {
          stops: [
            [1, 0.18],
            [10, 0.4],
          ],
        },
        "text-line-height": 1.5,
        "text-max-width": 6,
        "text-field": "{_name}",
        "text-padding": 15,
        "symbol-avoid-edges": true,
        "text-size": {
          stops: [
            [1, 8],
            [6, 10],
          ],
        },
      },
      paint: {
        "text-color": {
          stops: [
            [1, "#0d6c9a"],
            [6, "#0d6c9a"],
          ],
        },
        "text-halo-blur": 1,
        "text-halo-color": "#82CFF5",
        "text-halo-width": 0.5,
      },
    },
    {
      id: "Marine waterbody/label/x large",
      type: "symbol",
      source: "esri",
      "source-layer": "Marine waterbody/label",
      filter: ["==", "_label_class", 1],
      minzoom: 1,
      maxzoom: 10,
      layout: {
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "text-letter-spacing": {
          stops: [
            [1, 0.2],
            [10, 1.5],
          ],
        },
        "text-line-height": 1.5,
        "text-max-width": 6,
        "text-field": "{_name}",
        "text-padding": 15,
        "symbol-avoid-edges": true,
        "text-size": {
          stops: [
            [1, 8],
            [6, 11],
          ],
        },
      },
      paint: {
        "text-color": {
          stops: [
            [1, "#0d6c9a"],
            [6, "#0d6c9a"],
          ],
        },
        "text-halo-blur": 1,
        "text-halo-color": "#82CFF5",
        "text-halo-width": 0.5,
      },
    },
    {
      id: "Marine waterbody/label/2x large",
      type: "symbol",
      source: "esri",
      "source-layer": "Marine waterbody/label",
      filter: ["==", "_label_class", 0],
      minzoom: 1,
      maxzoom: 10,
      layout: {
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "text-letter-spacing": {
          stops: [
            [1, 0.3],
            [10, 2],
          ],
        },
        "text-line-height": 1.6,
        "text-max-width": 6,
        "text-field": "{_name}",
        "text-padding": 15,
        "symbol-avoid-edges": true,
        "text-size": {
          stops: [
            [1, 10],
            [4, 18],
          ],
        },
      },
      paint: {
        "text-color": "#0d6c9a",
        "text-halo-blur": 1,
        "text-halo-color": "#82CFF5",
        "text-halo-width": 0.5,
      },
    },
    {
      id: "Ferry/label/Rail ferry",
      type: "symbol",
      source: "esri",
      "source-layer": "Ferry/label",
      filter: ["all", ["==", "_label_class", 1], ["!in", "Viz", 2]],
      minzoom: 12,
      layout: {
        "symbol-placement": "line",
        "symbol-avoid-edges": true,
        "text-font": ["Montserrat SemiBold"],
        "text-size": 9,
        "text-letter-spacing": 0.1,
        "text-max-width": 8,
        "text-field": "{_name_global}",
        "text-padding": 5,
        "text-offset": [0, -0.6],
        "symbol-spacing": 1000,
      },
      paint: {
        "text-color": "#4E4E4E",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 1,
      },
    },
    {
      id: "Railroad/label/Default",
      type: "symbol",
      source: "esri",
      "source-layer": "Railroad/label",
      minzoom: 14,
      layout: {
        "symbol-placement": "line",
        "symbol-avoid-edges": true,
        "text-font": ["Montserrat SemiBold"],
        "text-size": 9,
        "text-letter-spacing": 0.1,
        "text-max-width": 8,
        "text-field": "{_name_global}",
        "text-padding": 5,
        "text-offset": [0, -0.6],
        "symbol-spacing": 1000,
      },
      paint: {
        "text-color": "#4E4E4E",
        "text-halo-color": "#EBE7E2",
        "text-halo-width": 1,
      },
    },
    {
      id: "Trail or path/label/Default",
      type: "symbol",
      source: "esri",
      "source-layer": "Trail or path/label",
      minzoom: 15,
      layout: {
        "symbol-placement": "line",
        "symbol-avoid-edges": true,
        "symbol-spacing": 400,
        "text-font": ["Avenir Next LT Pro Demi Italic"],
        "text-size": 9.3,
        "text-letter-spacing": 0.05,
        "text-max-width": 8,
        "text-field": "{_name_global}",
        "text-padding": 5,
      },
      paint: {
        "text-color": "#595959",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 1,
      },
    },
    {
      id: "Road tunnel/label/Pedestrian",
      type: "symbol",
      source: "esri",
      "source-layer": "Road tunnel/label",
      filter: ["all", ["==", "_label_class", 6], ["!in", "Viz", 2]],
      minzoom: 15,
      layout: {
        "symbol-placement": "line",
        "symbol-avoid-edges": true,
        "symbol-spacing": 400,
        "text-font": ["Montserrat SemiBold"],
        "text-size": 9.3,
        "text-letter-spacing": 0.05,
        "text-max-width": 8,
        "text-field": "{_name_global}",
        "text-padding": 5,
      },
      paint: {
        "text-color": "#595959",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 1,
        "text-halo-blur": 1,
      },
    },
    {
      id: "Road tunnel/label/Local, service, 4WD",
      type: "symbol",
      source: "esri",
      "source-layer": "Road tunnel/label",
      filter: ["all", ["==", "_label_class", 5], ["!in", "Viz", 2]],
      minzoom: 12,
      layout: {
        "symbol-placement": "line",
        "symbol-avoid-edges": true,
        "symbol-spacing": 400,
        "text-font": ["Montserrat SemiBold"],
        "text-size": 9.5,
        "text-letter-spacing": 0.09,
        "text-max-width": 8,
        "text-field": "{_name_global}",
        "text-padding": {
          stops: [
            [12, 5],
            [15, 5],
            [16, 15],
          ],
        },
      },
      paint: {
        "text-color": "#595959",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 1,
        "text-halo-blur": 1,
      },
    },
    {
      id: "Road tunnel/label/Minor",
      type: "symbol",
      source: "esri",
      "source-layer": "Road tunnel/label",
      filter: ["all", ["==", "_label_class", 4], ["!in", "Viz", 2]],
      minzoom: 10,
      layout: {
        "symbol-placement": "line",
        "symbol-avoid-edges": true,
        "symbol-spacing": 400,
        "text-font": ["Montserrat SemiBold"],
        "text-size": {
          stops: [
            [10, 9.5],
            [14, 10.5],
            [18, 12.5],
          ],
        },
        "text-letter-spacing": 0.09,
        "text-max-width": 8,
        "text-field": "{_name_global}",
        "text-padding": {
          stops: [
            [10, 5],
            [15, 5],
            [16, 15],
          ],
        },
      },
      paint: {
        "text-color": "#595959",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 1,
        "text-halo-blur": 1,
      },
    },
    {
      id: "Road tunnel/label/Major, alt name",
      type: "symbol",
      source: "esri",
      "source-layer": "Road tunnel/label",
      filter: ["all", ["==", "_label_class", 3], ["!in", "Viz", 2]],
      minzoom: 10,
      layout: {
        "symbol-placement": "line",
        "symbol-avoid-edges": true,
        "symbol-spacing": 400,
        "text-font": ["Montserrat SemiBold"],
        "text-size": {
          stops: [
            [10, 9.5],
            [14, 10.5],
            [18, 12.5],
          ],
        },
        "text-letter-spacing": 0.09,
        "text-max-width": 8,
        "text-field": "{_name}",
        "text-padding": {
          stops: [
            [10, 5],
            [15, 5],
            [16, 15],
          ],
        },
      },
      paint: {
        "text-color": "#4e4e4e",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 1,
        "text-halo-blur": 1,
      },
    },
    {
      id: "Road tunnel/label/Major",
      type: "symbol",
      source: "esri",
      "source-layer": "Road tunnel/label",
      filter: ["all", ["==", "_label_class", 2], ["!in", "Viz", 2]],
      minzoom: 10,
      layout: {
        "symbol-placement": "line",
        "symbol-avoid-edges": true,
        "symbol-spacing": 400,
        "text-font": ["Montserrat SemiBold"],
        "text-size": {
          stops: [
            [10, 9.5],
            [14, 10.5],
            [18, 12.5],
          ],
        },
        "text-letter-spacing": 0.09,
        "text-max-width": 8,
        "text-field": "{_name}",
        "text-padding": {
          stops: [
            [10, 5],
            [15, 5],
            [16, 15],
          ],
        },
      },
      paint: {
        "text-color": "#4E4E4E",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 1,
        "text-halo-blur": 1,
      },
    },
    {
      id: "Road tunnel/label/Highway",
      type: "symbol",
      source: "esri",
      "source-layer": "Road tunnel/label",
      filter: ["all", ["==", "_label_class", 7], ["!in", "Viz", 2]],
      minzoom: 10,
      layout: {
        "symbol-placement": "line",
        "symbol-avoid-edges": true,
        "symbol-spacing": 400,
        "text-font": ["Avenir Next LT Pro Bold"],
        "text-size": {
          stops: [
            [10, 9.5],
            [14, 10.5],
            [18, 14.5],
          ],
        },
        "text-letter-spacing": 0.09,
        "text-max-width": 8,
        "text-field": "{_name_global}",
        "text-padding": {
          stops: [
            [10, 5],
            [15, 5],
            [16, 15],
          ],
        },
      },
      paint: {
        "text-color": "#4E4E4E",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 1,
        "text-halo-blur": 1,
      },
    },
    {
      id: "Road tunnel/label/Freeway Motorway, alt name",
      type: "symbol",
      source: "esri",
      "source-layer": "Road tunnel/label",
      filter: ["all", ["==", "_label_class", 1], ["!in", "Viz", 2]],
      minzoom: 10,
      layout: {
        "symbol-placement": "line",
        "symbol-avoid-edges": true,
        "symbol-spacing": 400,
        "text-font": ["Avenir Next LT Pro Bold"],
        "text-size": {
          stops: [
            [10, 9.5],
            [14, 10.5],
            [18, 14.5],
          ],
        },
        "text-letter-spacing": 0.09,
        "text-max-width": 8,
        "text-field": "{_name_global}",
        "text-padding": {
          stops: [
            [10, 5],
            [15, 5],
            [16, 15],
          ],
        },
      },
      paint: {
        "text-color": "#4E4E4E",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 1,
        "text-halo-blur": 1,
      },
    },
    {
      id: "Road tunnel/label/Freeway Motorway",
      type: "symbol",
      source: "esri",
      "source-layer": "Road tunnel/label",
      filter: ["all", ["==", "_label_class", 0], ["!in", "Viz", 2]],
      minzoom: 10,
      layout: {
        "symbol-placement": "line",
        "symbol-avoid-edges": true,
        "symbol-spacing": 400,
        "text-font": ["Avenir Next LT Pro Bold"],
        "text-size": {
          stops: [
            [10, 9.5],
            [14, 10.5],
            [18, 14.5],
          ],
        },
        "text-letter-spacing": 0.09,
        "text-max-width": 8,
        "text-field": "{_name_global}",
        "text-padding": {
          stops: [
            [10, 5],
            [15, 5],
            [16, 15],
          ],
        },
      },
      paint: {
        "text-color": "#4E4E4E",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 1,
        "text-halo-blur": 1,
      },
    },
    {
      id: "Road/label/Local",
      type: "symbol",
      source: "esri",
      "source-layer": "Road/label",
      filter: ["all", ["==", "_label_class", 5], ["!in", "Viz", 2]],
      minzoom: 12,
      layout: {
        "symbol-placement": "line",
        "symbol-avoid-edges": true,
        "symbol-spacing": 400,
        "text-font": ["Montserrat SemiBold"],
        "text-size": {
          stops: [
            [10, 9.5],
            [14, 10.5],
            [18, 11.5],
          ],
        },
        "text-letter-spacing": 0,
        "text-max-width": 8,
        "text-field": "{_name_global}",
        "text-padding": {
          stops: [
            [12, 5],
            [15, 5],
            [16, 15],
          ],
        },
      },
      paint: {
        "text-color": "#595959",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 2,
      },
    },
    {
      id: "Road/label/Minor",
      type: "symbol",
      source: "esri",
      "source-layer": "Road/label",
      filter: ["all", ["==", "_label_class", 4], ["!in", "Viz", 2]],
      minzoom: 10,
      layout: {
        "symbol-placement": "line",
        "symbol-avoid-edges": true,
        "symbol-spacing": 400,
        "text-font": ["Montserrat Bold"],
        "text-size": {
          stops: [
            [10, 10.5],
            [14, 11.5],
            [18, 13.5],
          ],
        },
        "text-letter-spacing": 0,
        "text-max-width": 8,
        "text-field": "{_name_global}",
        "text-padding": {
          stops: [
            [10, 5],
            [15, 5],
            [16, 10],
          ],
        },
      },
      paint: {
        "text-color": "#595959",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 3,
      },
    },
    {
      id: "Road/label/Major, alt name",
      type: "symbol",
      source: "esri",
      "source-layer": "Road/label",
      filter: ["all", ["==", "_label_class", 3], ["!in", "Viz", 2]],
      minzoom: 10,
      layout: {
        "symbol-placement": "line",
        "symbol-avoid-edges": true,
        "symbol-spacing": 400,
        "text-font": ["Montserrat SemiBold"],
        "text-size": {
          stops: [
            [10, 9.5],
            [14, 10.5],
            [18, 12.5],
          ],
        },
        "text-letter-spacing": 0.09,
        "text-max-width": 8,
        "text-field": "{_name}",
        "text-padding": {
          stops: [
            [10, 5],
            [15, 5],
            [16, 15],
          ],
        },
      },
      paint: {
        "text-color": "#4E4E4E",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 2,
      },
    },
    {
      id: "Road/label/Major",
      type: "symbol",
      source: "esri",
      "source-layer": "Road/label",
      filter: ["all", ["==", "_label_class", 2], ["!in", "Viz", 2]],
      minzoom: 10,
      layout: {
        "symbol-placement": "line",
        "symbol-avoid-edges": true,
        "symbol-spacing": 400,
        "text-font": ["Montserrat SemiBold"],
        "text-size": {
          stops: [
            [10, 10.5],
            [14, 11.5],
            [18, 12.5],
          ],
        },
        "text-letter-spacing": 0,
        "text-max-width": 8,
        "text-field": "{_name_global}",
        "text-padding": {
          stops: [
            [10, 5],
            [15, 5],
            [16, 10],
          ],
        },
      },
      paint: {
        "text-color": "#4E4E4E",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 2,
      },
    },
    {
      id: "Road/label/Highway",
      type: "symbol",
      source: "esri",
      "source-layer": "Road/label",
      filter: ["all", ["==", "_label_class", 75], ["!in", "Viz", 2]],
      minzoom: 10,
      layout: {
        "symbol-placement": "line",
        "symbol-avoid-edges": true,
        "symbol-spacing": 400,
        "text-font": ["Avenir Next LT Pro Bold"],
        "text-size": {
          stops: [
            [10, 9.5],
            [14, 10.5],
            [18, 14.5],
          ],
        },
        "text-letter-spacing": 0.09,
        "text-max-width": 8,
        "text-field": "{_name_global}",
        "text-padding": {
          stops: [
            [10, 5],
            [15, 5],
            [16, 15],
          ],
        },
      },
      paint: {
        "text-color": "#4E4E4E",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 2,
      },
    },
    {
      id: "Road/label/Freeway Motorway, alt name",
      type: "symbol",
      source: "esri",
      "source-layer": "Road/label",
      filter: ["all", ["==", "_label_class", 1], ["!in", "Viz", 2]],
      minzoom: 10,
      layout: {
        "symbol-placement": "line",
        "symbol-avoid-edges": true,
        "symbol-spacing": 400,
        "text-font": ["Avenir Next LT Pro Bold"],
        "text-size": {
          stops: [
            [10, 9.5],
            [14, 10.5],
            [18, 14.5],
          ],
        },
        "text-letter-spacing": 0.09,
        "text-max-width": 8,
        "text-field": "{_name}",
        "text-padding": {
          stops: [
            [10, 5],
            [15, 5],
            [16, 15],
          ],
        },
      },
      paint: {
        "text-color": "#4E4E4E",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 1,
      },
    },
    {
      id: "Road/label/Freeway Motorway",
      type: "symbol",
      source: "esri",
      "source-layer": "Road/label",
      filter: ["all", ["==", "_label_class", 0], ["!in", "Viz", 2]],
      minzoom: 10,
      layout: {
        "symbol-placement": "line",
        "symbol-avoid-edges": true,
        "symbol-spacing": 400,
        "text-font": ["Avenir Next LT Pro Bold"],
        "text-size": {
          stops: [
            [10, 9.5],
            [14, 10.5],
            [18, 14.5],
          ],
        },
        "text-letter-spacing": 0.09,
        "text-max-width": 8,
        "text-field": "{_name_global}",
        "text-padding": {
          stops: [
            [10, 5],
            [15, 5],
            [16, 15],
          ],
        },
      },
      paint: {
        "text-color": "#4E4E4E",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 1,
      },
    },
    {
      id: "parcel-line",
      type: "line",
      source: "baseunits",
      "source-layer": "parcels",
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
      source: "baseunits",
      "source-layer": "parcels",
      minzoom: 11,
      filter: ["==", "parcelno", ""],
      layout: {
        visibility: "visible",
      },
      paint: {
        "line-color": layers["parcels"].color,
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
      source: "baseunits",
      "source-layer": "buildings",
      interactive: true,
      minzoom: 12,
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": {
          stops: [
            [14, "#aaa"],
            [19, "#bbb"],
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
      source: "baseunits",
      "source-layer": "buildings",
      minzoom: 11,
      filter: ["==", "id", ""],
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": layers["buildings"].color,
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
      source: "baseunits",
      "source-layer": "buildings",
      minzoom: 11,
      filter: ["==", "id", ""],
      layout: {
        visibility: "visible",
      },
      paint: {
        "line-color": layers["buildings"].color,
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
      source: "baseunits",
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
        "circle-color": layers["addresses"].color,
        "circle-stroke-color": "#333",
        "circle-stroke-width": 1,
      },
    },
    {
      id: "address-linked",
      type: "circle",
      source: "baseunits",
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
        "circle-color": layers["addresses"].color,
        "circle-stroke-color": "#333",
        "circle-stroke-width": 1,
      },
    },
    {
      id: "address-point",
      type: "circle",
      source: "baseunits",
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
      source: "baseunits",
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
        ["==", "organization_id", 518073312556755],
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
      type: "symbol",
      source: "mly",
      "source-layer": "image",
      filter: ["==", "id", ""],
      layout: {
        "icon-rotate": 0,
        "icon-rotation-alignment": "map",
        "icon-image": "video",
        "icon-anchor": "center",
        "icon-size": {
          base: 1,
          stops: [
            [13, 1],
            [14, 1],
            [17, 1],
            [19, 3],
          ],
        },
      },
      paint: {
        "icon-opacity": 0.65,
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
  let satStyle = _.cloneDeep(baseStyle);

  // set the satellite layer, which is first, to visible
  satStyle.layers[0].layout.visibility = "visible";
  satStyle.layers[1].layout.visibility = "none";

  // run through the first 200 layers and turn them off if they're a fill
  // or if they're a road line layer
  // lazy hack for invisible'ing all the layers which are in the way of the satellite
  satStyle.layers.slice(0, 200).forEach((l, i) => {
    if (l.type === "fill" && l.id.indexOf("parcel") === -1) {
      satStyle.layers[i].layout["visibility"] = "none";
    }
    if (l.type === "line" && l.id.indexOf("Road") === 0) {
      satStyle.layers[i].layout["visibility"] = "none";
    }
  });

  // adjust colors for satellite
  satStyle.layers.forEach((l, i) => {
    if (l.id === "streets-line") {
      satStyle.layers[i].paint["line-color"] = layers["streets"].color;
      satStyle.layers[i].paint["line-opacity"] = 0.75;
    }
    if (l.id === "streets-highlight") {
      satStyle.layers[i].paint["line-color"] = "#fff";
    }
  });

  // return the object
  return satStyle;
};

export const linenStyle = () => {
  // clone the baseStyle into a new object to we can make changes
  let linenStyle = _.cloneDeep(baseStyle);

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
