import layers from '../data/layers'
import _ from 'lodash';

export const baseStyle = {
    "version": 8,
    "sprite": "https://cdn.arcgis.com/sharing/rest/content/items/273bf8d5c8ac400183fc24e109d20bcf/resources/styles/../sprites/sprite",
    "glyphs": "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/resources/fonts/{fontstack}/{range}.pbf",
    "sources": {
      "esri": {
        "type": "vector",
        "tiles": ["https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/tile/{z}/{y}/{x}.pbf"]
      },
      "baseunits": {
        "type": "vector",
        "tiles": ["https://tiles.arcgis.com/tiles/qvkbeam7Wirps6zC/arcgis/rest/services/BaseUnitVectorTiles/VectorTileServer/tile/{z}/{y}/{x}.pbf"]
      },
      "satellite": {
        "type": "raster",
        "tiles": [
          "https://tiles.arcgis.com/tiles/qvkbeam7Wirps6zC/arcgis/rest/services/MiSAIL_2020_6in_Clip_webMerc/MapServer/tile/{z}/{y}/{x}"
        ]
      },
      "linen-map": {
        "type": "raster",
        "tiles": [
          "https://tiles.arcgis.com/tiles/qvkbeam7Wirps6zC/arcgis/rest/services/Linen_Map_Mosaic/MapServer/tile/{z}/{y}/{x}"
        ]
      },
      "mapillary": {
        "type": "geojson",
        "data": {
          "type": "FeatureCollection",
          "features": []
        }
      },
      "mly": {
        "type": "vector",
        "tiles": ["https://tiles.mapillary.com/maps/vtp/mly1_computed_public/2/{z}/{x}/{y}?access_token=MLY|4690399437648324|de87555bb6015affa20c3df794ebab15"],
        "maxzoom": 14,
        "minzoom": 14
      }
    },
    "layers": [
      {
        "id": "satellite",
        "type": "raster",
        "source": "satellite",
        "minzoom": 0,
        "maxzoom": 22,
        "paint": {
          "raster-opacity": 1,
          "raster-saturation": -0.75
        },
        "layout": {
          "visibility": "none"
        }
      },
      {
        "id": "linen-map",
        "type": "raster",
        "source": "linen-map",
        "minzoom": 0,
        "maxzoom": 22,
        "paint": {
          "raster-opacity": 1,
          "raster-saturation": -0.75
        },
        "layout": {
          "visibility": "none"
        }
      },
      {
        "id": "Land/Not ice",
        "type": "fill",
        "source": "esri",
        "source-layer": "Land",
        "filter": [
          "==",
          "_symbol",
          0
        ],
        "minzoom": 0,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                0,
                "#dce0ca"
              ],
              [
                10,
                "#E6E5D6"
              ],
              [
                15,
                "#f2eee9"
              ]
            ]
          }
        }
      },
      {
        "id": "Land/Ice",
        "type": "fill",
        "source": "esri",
        "source-layer": "Land",
        "filter": [
          "==",
          "_symbol",
          1
        ],
        "minzoom": 0,
        "layout": {},
        "paint": {
          "fill-color": "#E6E5D6"
        }
      },
      {
        "id": "Urban area",
        "type": "fill",
        "source": "esri",
        "source-layer": "Urban area",
        "minzoom": 5,
        "maxzoom": 15,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                5,
                "#e3dfdc"
              ],
              [
                10,
                "#ECE8E3"
              ],
              [
                15,
                "#f2eee9"
              ]
            ]
          },
          "fill-antialias": false
        }
      },
      {
        "id": "Vegetation small scale/High density",
        "type": "fill",
        "source": "esri",
        "source-layer": "Vegetation small scale",
        "filter": [
          "==",
          "_symbol",
          0
        ],
        "maxzoom": 11,
        "layout": {},
        "paint": {
          "fill-color": "#c2e699",
          "fill-opacity": {
            "stops": [
              [
                0,
                0.3
              ],
              [
                5,
                0.28
              ],
              [
                7,
                0.18
              ],
              [
                10,
                0.08
              ]
            ]
          },
          "fill-antialias": false
        }
      },
      {
        "id": "Vegetation small scale/Low density",
        "type": "fill",
        "source": "esri",
        "source-layer": "Vegetation small scale",
        "filter": [
          "==",
          "_symbol",
          1
        ],
        "maxzoom": 11,
        "layout": {},
        "paint": {
          "fill-color": "#9ad666",
          "fill-opacity": {
            "stops": [
              [
                0,
                0.3
              ],
              [
                5,
                0.28
              ],
              [
                7,
                0.18
              ],
              [
                10,
                0.08
              ]
            ]
          },
          "fill-antialias": false
        }
      },
      {
        "id": "Indigenous",
        "type": "fill",
        "source": "esri",
        "source-layer": "Indigenous",
        "minzoom": 6,
        "layout": {},
        "paint": {
          "fill-color": "#dbd5bd",
          "fill-outline-color": "#d6d4c8",
          "fill-opacity": 0.35
        }
      },
      {
        "id": "Openspace or forest",
        "type": "fill",
        "source": "esri",
        "source-layer": "Openspace or forest",
        "minzoom": 9,
        "layout": {},
        "paint": {
          "fill-color": "#CDDFB3",
          "fill-antialias": false
        }
      },
      {
        "id": "Admin0 forest or park",
        "type": "fill",
        "source": "esri",
        "source-layer": "Admin0 forest or park",
        "minzoom": 6,
        "layout": {},
        "paint": {
          "fill-color": "#CDDFB3",
          "fill-opacity": {
            "stops": [
              [
                6,
                0.4
              ],
              [
                8,
                1
              ]
            ]
          },
          "fill-antialias": false
        }
      },
      {
        "id": "Admin0 forest or park/line2",
        "type": "line",
        "source": "esri",
        "source-layer": "Admin0 forest or park",
        "minzoom": 6,
        "layout": {},
        "paint": {
          "line-color": "#c0d3a5",
          "line-opacity": 0.3,
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                6,
                0.6
              ],
              [
                15,
                15
              ]
            ]
          }
        }
      },
      {
        "id": "Admin0 forest or park/line",
        "type": "line",
        "source": "esri",
        "source-layer": "Admin0 forest or park",
        "minzoom": 6,
        "layout": {},
        "paint": {
          "line-color": "#c0d3a5",
          "line-opacity": {
            "stops": [
              [
                6,
                0.4
              ],
              [
                8,
                1
              ]
            ]
          },
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                6,
                0.6
              ],
              [
                9,
                1.1
              ]
            ]
          }
        }
      },
      {
        "id": "Admin1 forest or park",
        "type": "fill",
        "source": "esri",
        "source-layer": "Admin1 forest or park",
        "minzoom": 7,
        "layout": {},
        "paint": {
          "fill-color": "#CDDFB3",
          "fill-opacity": {
            "stops": [
              [
                6,
                0.4
              ],
              [
                8,
                1
              ]
            ]
          },
          "fill-antialias": false
        }
      },
      {
        "id": "Admin1 forest or park/line2",
        "type": "line",
        "source": "esri",
        "source-layer": "Admin1 forest or park",
        "minzoom": 7,
        "layout": {},
        "paint": {
          "line-color": "#c0d3a5",
          "line-opacity": 0.3,
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                6,
                0.6
              ],
              [
                15,
                15
              ]
            ]
          }
        }
      },
      {
        "id": "Admin1 forest or park/line",
        "type": "line",
        "source": "esri",
        "source-layer": "Admin1 forest or park",
        "minzoom": 7,
        "layout": {},
        "paint": {
          "line-color": "#c0d3a5",
          "line-opacity": {
            "stops": [
              [
                6,
                0.4
              ],
              [
                8,
                1
              ]
            ]
          },
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                6,
                0.6
              ],
              [
                9,
                1.1
              ]
            ]
          }
        }
      },
      {
        "id": "Zoo",
        "type": "fill",
        "source": "esri",
        "source-layer": "Zoo",
        "minzoom": 11,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                11,
                "#CDDFB3"
              ],
              [
                17,
                "#A5C187"
              ]
            ]
          }
        }
      },
      {
        "id": "Military",
        "type": "fill",
        "source": "esri",
        "source-layer": "Military",
        "minzoom": 6,
        "layout": {},
        "paint": {
          "fill-color": "#d9d9d9",
          "fill-opacity": 0.5,
          "fill-antialias": false
        }
      },
      {
        "id": "Port",
        "type": "fill",
        "source": "esri",
        "source-layer": "Port",
        "minzoom": 12,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                13,
                "#d9d2c8"
              ],
              [
                15,
                "#E6E0D9"
              ],
              [
                19,
                "#ECE7E1"
              ]
            ]
          }
        }
      },
      {
        "id": "Transportation",
        "type": "fill",
        "source": "esri",
        "source-layer": "Transportation",
        "minzoom": 13,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                13,
                "#ddd3c5"
              ],
              [
                15,
                "#E8E1D7"
              ],
              [
                19,
                "#EDE7E0"
              ]
            ]
          }
        }
      },
      {
        "id": "Industry",
        "type": "fill",
        "source": "esri",
        "source-layer": "Industry",
        "minzoom": 12,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                13,
                "#d9d2c8"
              ],
              [
                15,
                "#E2DCD4"
              ],
              [
                19,
                "#ECE7E1"
              ]
            ]
          }
        }
      },
      {
        "id": "Golf course",
        "type": "fill",
        "source": "esri",
        "source-layer": "Golf course",
        "minzoom": 11,
        "layout": {},
        "paint": {
          "fill-color": "#D6E6C3"
        }
      },
      {
        "id": "Airport/Airport property",
        "type": "fill",
        "source": "esri",
        "source-layer": "Airport",
        "filter": [
          "==",
          "_symbol",
          1
        ],
        "minzoom": 9,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                9,
                "#d9d6d2"
              ],
              [
                11,
                "#e3e1df"
              ],
              [
                15,
                "#EAE7E4"
              ]
            ]
          },
          "fill-outline-color": "#DDDBD9"
        }
      },
      {
        "id": "Airport/Airport runway",
        "type": "fill",
        "source": "esri",
        "source-layer": "Airport",
        "filter": [
          "==",
          "_symbol",
          0
        ],
        "minzoom": 11,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                11,
                "#dddbd9"
              ],
              [
                22,
                "#8D8C8A"
              ]
            ]
          }
        }
      },
      {
        "id": "Retail",
        "type": "fill",
        "source": "esri",
        "source-layer": "Retail",
        "minzoom": 13,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                11,
                "#f7c2b5"
              ],
              [
                15,
                "#F5D8CF"
              ],
              [
                19,
                "#F3E8E2"
              ]
            ]
          }
        }
      },
      {
        "id": "Water and wastewater",
        "type": "fill",
        "source": "esri",
        "source-layer": "Water and wastewater",
        "minzoom": 13,
        "layout": {
          "visibility": "none"
        },
        "paint": {
          "fill-color": {
            "stops": [
              [
                13,
                "#ddd3c5"
              ],
              [
                15,
                "#E8E1D7"
              ],
              [
                19,
                "#EDE7E0"
              ]
            ]
          }
        }
      },
      {
        "id": "Freight",
        "type": "fill",
        "source": "esri",
        "source-layer": "Freight",
        "minzoom": 12,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                13,
                "#d9d2c8"
              ],
              [
                15,
                "#E2DCD4"
              ],
              [
                19,
                "#EDE7E0"
              ]
            ]
          }
        }
      },
      {
        "id": "Cemetery",
        "type": "fill",
        "source": "esri",
        "source-layer": "Cemetery",
        "minzoom": 13,
        "layout": {},
        "paint": {
          "fill-color": "#d3e6b9"
        }
      },
      {
        "id": "Finance",
        "type": "fill",
        "source": "esri",
        "source-layer": "Finance",
        "minzoom": 13,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                11,
                "#f7c2b5"
              ],
              [
                15,
                "#F5D8CF"
              ],
              [
                19,
                "#F3E8E2"
              ]
            ]
          }
        }
      },
      {
        "id": "Government",
        "type": "fill",
        "source": "esri",
        "source-layer": "Government",
        "minzoom": 13,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                13,
                "#ddd3c5"
              ],
              [
                15,
                "#E8E1D7"
              ],
              [
                19,
                "#EDE7E0"
              ]
            ]
          }
        }
      },
      {
        "id": "Emergency",
        "type": "fill",
        "source": "esri",
        "source-layer": "Emergency",
        "minzoom": 13,
        "layout": {},
        "paint": {
          "fill-color": "#E8E7E5"
        }
      },
      {
        "id": "Landmark",
        "type": "fill",
        "source": "esri",
        "source-layer": "Landmark",
        "minzoom": 13,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                10,
                "#d7ede6"
              ],
              [
                15,
                "#E5EEE8"
              ],
              [
                19,
                "#EBEEE8"
              ]
            ]
          }
        }
      },
      {
        "id": "Pedestrian",
        "type": "fill",
        "source": "esri",
        "source-layer": "Pedestrian",
        "minzoom": 13,
        "layout": {},
        "paint": {
          "fill-color": "#E8E7E5",
          "fill-outline-color": "#bcb7ae"
        }
      },
      {
        "id": "Education",
        "type": "fill",
        "source": "esri",
        "source-layer": "Education",
        "minzoom": 11,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                11,
                "#dde2a9"
              ],
              [
                15,
                "#E8E8C9"
              ],
              [
                19,
                "#EEEBDB"
              ]
            ]
          }
        }
      },
      {
        "id": "Medical",
        "type": "fill",
        "source": "esri",
        "source-layer": "Medical",
        "minzoom": 11,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                11,
                "#c7dff4"
              ],
              [
                15,
                "#DDE7EF"
              ],
              [
                19,
                "#E7EAEC"
              ]
            ]
          }
        }
      },
      {
        "id": "Park or farming",
        "type": "fill",
        "source": "esri",
        "source-layer": "Park or farming",
        "minzoom": 11,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                11,
                "#CDDFB3"
              ],
              [
                17,
                "#A5C187"
              ]
            ]
          }
        }
      },
      {
        "id": "Beach",
        "type": "fill",
        "source": "esri",
        "source-layer": "Beach",
        "minzoom": 13,
        "layout": {},
        "paint": {
          "fill-pattern": "Special area of interest/Sand"
        }
      },
      {
        "id": "Special area of interest/Garden path",
        "type": "fill",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          12
        ],
        "minzoom": 14,
        "layout": {
          "visibility": "none"
        },
        "paint": {
          "fill-color": "#f5f5f1",
          "fill-outline-color": "#EBE8E8"
        }
      },
      {
        "id": "Special area of interest/Green openspace",
        "type": "fill",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          11
        ],
        "minzoom": 14,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                14,
                "#c5e0a9"
              ],
              [
                17,
                "#A5C187"
              ]
            ]
          }
        }
      },
      {
        "id": "Special area of interest/Grass",
        "type": "fill",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          8
        ],
        "minzoom": 14,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                14,
                "#b4d197"
              ],
              [
                17,
                "#84A661"
              ]
            ]
          }
        }
      },
      {
        "id": "Special area of interest/Grass/line",
        "type": "line",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          8
        ],
        "minzoom": 14,
        "layout": {},
        "paint": {
          "line-color": {
            "stops": [
              [
                14,
                "#a4c683"
              ],
              [
                17,
                "#739551"
              ]
            ]
          },
          "line-width": {
            "stops": [
              [
                15,
                1.1
              ],
              [
                22,
                10
              ]
            ]
          },
          "line-blur": {
            "stops": [
              [
                15,
                1
              ],
              [
                22,
                5
              ]
            ]
          }
        }
      },
      {
        "id": "Special area of interest/Grass/pattern",
        "type": "fill",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          8
        ],
        "minzoom": 14,
        "layout": {},
        "paint": {
          "fill-pattern": "Special area of interest/Grass",
          "fill-opacity": 0.5
        }
      },
      {
        "id": "Special area of interest/Grass/pattern/1",
        "type": "fill",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          8
        ],
        "minzoom": 14,
        "layout": {},
        "paint": {
          "fill-pattern": "Special area of interest/Small stipple"
        }
      },
      {
        "id": "Special area of interest/Baseball field or other grounds",
        "type": "fill",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          1
        ],
        "minzoom": 14,
        "layout": {},
        "paint": {
          "fill-color": "#91a761"
        }
      },
      {
        "id": "Special area of interest/Baseball field or other grounds/pattern",
        "type": "fill",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          1
        ],
        "minzoom": 14,
        "layout": {},
        "paint": {
          "fill-pattern": "Special area of interest/Baseball field or other grounds"
        }
      },
      {
        "id": "Special area of interest/Groundcover",
        "type": "fill",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          13
        ],
        "minzoom": 14,
        "layout": {},
        "paint": {
          "fill-color": "#97be82"
        }
      },
      {
        "id": "Special area of interest/Groundcover/pattern",
        "type": "fill",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          13
        ],
        "minzoom": 14,
        "layout": {},
        "paint": {
          "fill-pattern": "Special area of interest/Groundcover",
          "fill-opacity": 0.5
        }
      },
      {
        "id": "Special area of interest/Field or court exterior",
        "type": "fill",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          5
        ],
        "minzoom": 14,
        "layout": {},
        "paint": {
          "fill-color": "#6E866E"
        }
      },
      {
        "id": "Special area of interest/Football field or court",
        "type": "fill",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          4
        ],
        "minzoom": 14,
        "layout": {},
        "paint": {
          "fill-color": "#7fa57a"
        }
      },
      {
        "id": "Special area of interest/Football field or court/line",
        "type": "line",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          4
        ],
        "minzoom": 14,
        "layout": {},
        "paint": {
          "line-color": "#e3e0da",
          "line-opacity": 0.8,
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                15,
                0.5
              ],
              [
                20,
                4
              ]
            ]
          }
        }
      },
      {
        "id": "Special area of interest/Hardcourt",
        "type": "fill",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          10
        ],
        "minzoom": 14,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                15,
                "#dddbd9"
              ],
              [
                22,
                "#8D8C8A"
              ]
            ]
          }
        }
      },
      {
        "id": "Special area of interest/Hardcourt/line",
        "type": "line",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          10
        ],
        "minzoom": 14,
        "layout": {},
        "paint": {
          "line-color": "#e3e0da",
          "line-opacity": 0.8,
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                15,
                0.5
              ],
              [
                20,
                4
              ]
            ]
          }
        }
      },
      {
        "id": "Special area of interest/Mulch or dirt",
        "type": "fill",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          14
        ],
        "minzoom": 14,
        "layout": {},
        "paint": {
          "fill-pattern": "Special area of interest/Mulch or dirt"
        }
      },
      {
        "id": "Special area of interest/Mulch or dirt/line",
        "type": "line",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          14
        ],
        "minzoom": 14,
        "layout": {},
        "paint": {
          "line-color": "#c9b58b",
          "line-width": {
            "stops": [
              [
                15,
                1.1
              ],
              [
                22,
                10
              ]
            ]
          },
          "line-blur": {
            "stops": [
              [
                15,
                1
              ],
              [
                22,
                5
              ]
            ]
          }
        }
      },
      {
        "id": "Special area of interest/Athletic track",
        "type": "fill",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          0
        ],
        "minzoom": 14,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                14,
                "#d49a87"
              ],
              [
                17,
                "#cb7169"
              ]
            ]
          }
        }
      },
      {
        "id": "Special area of interest/Athletic track/line",
        "type": "line",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          0
        ],
        "minzoom": 14,
        "layout": {},
        "paint": {
          "line-color": "#e3e0da",
          "line-opacity": 0.8,
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                15,
                0.5
              ],
              [
                20,
                4
              ]
            ]
          }
        }
      },
      {
        "id": "Special area of interest/Sand",
        "type": "fill",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          6
        ],
        "minzoom": 14,
        "layout": {},
        "paint": {
          "fill-pattern": "Special area of interest/Sand"
        }
      },
      {
        "id": "Special area of interest/Parking/line",
        "type": "line",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          15
        ],
        "minzoom": 15,
        "layout": {},
        "paint": {
          "line-color": {
            "stops": [
              [
                15,
                "#d1cfcd"
              ],
              [
                22,
                "#7c7b79"
              ]
            ]
          },
          "line-opacity": 0.8,
          "line-width": {
            "stops": [
              [
                15,
                1.1
              ],
              [
                22,
                10
              ]
            ]
          },
          "line-blur": {
            "stops": [
              [
                15,
                1
              ],
              [
                22,
                5
              ]
            ]
          }
        }
      },
      {
        "id": "Special area of interest/Parking",
        "type": "fill",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          15
        ],
        "minzoom": 15,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                15,
                "#dddbd9"
              ],
              [
                22,
                "#8D8C8A"
              ]
            ]
          }
        }
      },
      {
        "id": "Special area of interest/Parking/stipple",
        "type": "fill",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          15
        ],
        "minzoom": 15,
        "layout": {},
        "paint": {
          "fill-pattern": "Special area of interest/Small stipple"
        }
      },
      {
        "id": "Special area of interest/Rock or gravel",
        "type": "fill",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          16
        ],
        "minzoom": 14,
        "layout": {},
        "paint": {
          "fill-pattern": "Special area of interest/Rock or gravel"
        }
      },
      {
        "id": "Water line small scale",
        "type": "line",
        "source": "esri",
        "source-layer": "Water line small scale",
        "minzoom": 1,
        "maxzoom": 5,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                1,
                "#B7D7D9"
              ],
              [
                10.6,
                "#6BC4F0"
              ]
            ]
          },
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                1,
                0.5
              ],
              [
                5,
                0.5
              ]
            ]
          }
        }
      },
      {
        "id": "Water line medium scale",
        "type": "line",
        "source": "esri",
        "source-layer": "Water line medium scale",
        "minzoom": 5,
        "maxzoom": 7,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                1,
                "#B7D7D9"
              ],
              [
                10.6,
                "#6BC4F0"
              ]
            ]
          },
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                5,
                0.5
              ],
              [
                7,
                0.7
              ]
            ]
          }
        }
      },
      {
        "id": "Water line large scale",
        "type": "line",
        "source": "esri",
        "source-layer": "Water line large scale",
        "minzoom": 7,
        "maxzoom": 11,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                1,
                "#B7D7D9"
              ],
              [
                10.6,
                "#6BC4F0"
              ]
            ]
          },
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                7,
                0.5
              ],
              [
                11,
                0.7
              ]
            ]
          }
        }
      },
      {
        "id": "Water line/Waterfall",
        "type": "line",
        "source": "esri",
        "source-layer": "Water line",
        "filter": [
          "==",
          "_symbol",
          5
        ],
        "minzoom": 11,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": "#6BC4F0",
          "line-width": 0.8,
          "line-dasharray": [
            5,
            5
          ]
        }
      },
      {
        "id": "Water line/Dam or weir",
        "type": "line",
        "source": "esri",
        "source-layer": "Water line",
        "filter": [
          "==",
          "_symbol",
          2
        ],
        "minzoom": 11,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": "#afafaf",
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                11,
                0.7
              ],
              [
                14,
                0.7
              ],
              [
                17,
                2
              ]
            ]
          }
        }
      },
      {
        "id": "Water line/Levee/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Water line",
        "filter": [
          "==",
          "_symbol",
          3
        ],
        "minzoom": 11,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": "#c3c3c3",
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                11,
                0.7
              ],
              [
                14,
                0.7
              ],
              [
                20,
                2.5
              ]
            ]
          }
        }
      },
      {
        "id": "Water line/Levee/0",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Water line",
        "filter": [
          "==",
          "_symbol",
          3
        ],
        "minzoom": 13,
        "layout": {
          "symbol-placement": "line",
          "symbol-avoid-edges": true,
          "icon-image": "Water line/Levee/0",
          "symbol-spacing": 13.3,
          "icon-rotation-alignment": "map",
          "icon-allow-overlap": true,
          "icon-padding": 1
        },
        "paint": {}
      },
      {
        "id": "Water line/Canal or ditch",
        "type": "line",
        "source": "esri",
        "source-layer": "Water line",
        "filter": [
          "==",
          "_symbol",
          1
        ],
        "minzoom": 11,
        "layout": {
          "line-cap": "round"
        },
        "paint": {
          "line-color": "#6BC4F0",
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                11,
                0.7
              ],
              [
                14,
                0.7
              ],
              [
                17,
                2
              ]
            ]
          }
        }
      },
      {
        "id": "Water line/Stream or river intermittent",
        "type": "line",
        "source": "esri",
        "source-layer": "Water line",
        "filter": [
          "==",
          "_symbol",
          4
        ],
        "minzoom": 11,
        "layout": {},
        "paint": {
          "line-color": "#6BC4F0",
          "line-dasharray": [
            7,
            3
          ],
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                11,
                0.7
              ],
              [
                14,
                0.7
              ],
              [
                17,
                2
              ]
            ]
          }
        }
      },
      {
        "id": "Water line/Stream or river",
        "type": "line",
        "source": "esri",
        "source-layer": "Water line",
        "filter": [
          "==",
          "_symbol",
          0
        ],
        "minzoom": 11,
        "layout": {
          "line-cap": "round"
        },
        "paint": {
          "line-color": "#6BC4F0",
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                11,
                0.7
              ],
              [
                14,
                0.7
              ],
              [
                17,
                2
              ]
            ]
          }
        }
      },
      {
        "id": "Marine area/1",
        "type": "fill",
        "source": "esri",
        "source-layer": "Marine area",
        "minzoom": 0,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                5,
                "#53B9EA"
              ],
              [
                10.6,
                "#6BC4F0"
              ]
            ]
          },
          "fill-antialias": false
        }
      },
      {
        "id": "Bathymetry/depth 2 (shallow water)",
        "type": "fill",
        "source": "esri",
        "source-layer": "Bathymetry",
        "filter": [
          "==",
          "_symbol",
          0
        ],
        "maxzoom": 11,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                5,
                "#5BBDEC"
              ],
              [
                10.6,
                "#6BC4F0"
              ]
            ]
          },
          "fill-antialias": false
        }
      },
      {
        "id": "Bathymetry/depth 3",
        "type": "fill",
        "source": "esri",
        "source-layer": "Bathymetry",
        "filter": [
          "==",
          "_symbol",
          1
        ],
        "maxzoom": 11,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                5,
                "#63C0EE"
              ],
              [
                10.6,
                "#6BC4F0"
              ]
            ]
          },
          "fill-antialias": false
        }
      },
      {
        "id": "Bathymetry/depth 4",
        "type": "fill",
        "source": "esri",
        "source-layer": "Bathymetry",
        "filter": [
          "==",
          "_symbol",
          2
        ],
        "maxzoom": 11,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                5,
                "#6BC4F0"
              ],
              [
                10.6,
                "#6BC4F0"
              ]
            ]
          },
          "fill-antialias": false
        }
      },
      {
        "id": "Bathymetry/depth 5",
        "type": "fill",
        "source": "esri",
        "source-layer": "Bathymetry",
        "filter": [
          "==",
          "_symbol",
          3
        ],
        "maxzoom": 11,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                5,
                "#72C8F1"
              ],
              [
                10.6,
                "#6BC4F0"
              ]
            ]
          },
          "fill-antialias": false
        }
      },
      {
        "id": "Bathymetry/depth 6",
        "type": "fill",
        "source": "esri",
        "source-layer": "Bathymetry",
        "filter": [
          "==",
          "_symbol",
          4
        ],
        "maxzoom": 11,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                5,
                "#7ACBF3"
              ],
              [
                10.6,
                "#6BC4F0"
              ]
            ]
          },
          "fill-antialias": false
        }
      },
      {
        "id": "Bathymetry/depth 7 (deep water)",
        "type": "fill",
        "source": "esri",
        "source-layer": "Bathymetry",
        "filter": [
          "==",
          "_symbol",
          5
        ],
        "maxzoom": 11,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                5,
                "#82CFF5"
              ],
              [
                10.6,
                "#6BC4F0"
              ]
            ]
          },
          "fill-antialias": false
        }
      },
      {
        "id": "Water area small scale",
        "type": "fill",
        "source": "esri",
        "source-layer": "Water area small scale",
        "minzoom": 1,
        "maxzoom": 5,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                5,
                "#53B9EA"
              ],
              [
                10.6,
                "#6BC4F0"
              ]
            ]
          },
          "fill-outline-color": "#53B9EA"
        }
      },
      {
        "id": "Water area medium scale/Lake intermittent",
        "type": "fill",
        "source": "esri",
        "source-layer": "Water area medium scale",
        "filter": [
          "==",
          "_symbol",
          1
        ],
        "minzoom": 5,
        "maxzoom": 7,
        "layout": {},
        "paint": {
          "fill-pattern": "Water area/Lake or river intermittent"
        }
      },
      {
        "id": "Water area medium scale/Lake or river",
        "type": "fill",
        "source": "esri",
        "source-layer": "Water area medium scale",
        "filter": [
          "==",
          "_symbol",
          0
        ],
        "minzoom": 5,
        "maxzoom": 7,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                5,
                "#53B9EA"
              ],
              [
                10.6,
                "#6BC4F0"
              ]
            ]
          },
          "fill-outline-color": "#53B9EA"
        }
      },
      {
        "id": "Water area large scale/Lake intermittent",
        "type": "fill",
        "source": "esri",
        "source-layer": "Water area large scale",
        "filter": [
          "==",
          "_symbol",
          1
        ],
        "minzoom": 7,
        "maxzoom": 11,
        "layout": {},
        "paint": {
          "fill-pattern": "Water area/Lake or river intermittent"
        }
      },
      {
        "id": "Water area large scale/Lake or river",
        "type": "fill",
        "source": "esri",
        "source-layer": "Water area large scale",
        "filter": [
          "==",
          "_symbol",
          0
        ],
        "minzoom": 7,
        "maxzoom": 11,
        "layout": {},
        "paint": {
          "fill-color": {
            "stops": [
              [
                5,
                "#53B9EA"
              ],
              [
                10.6,
                "#6BC4F0"
              ]
            ]
          },
          "fill-outline-color": {
            "stops": [
              [
                8,
                "#53B9EA"
              ],
              [
                9,
                "#6BC4F0"
              ]
            ]
          }
        }
      },
      {
        "id": "Water area/Lake, river or bay",
        "type": "fill",
        "source": "esri",
        "source-layer": "Water area",
        "filter": [
          "==",
          "_symbol",
          7
        ],
        "minzoom": 11,
        "layout": {},
        "paint": {
          "fill-color": "#6BC4F0",
          "fill-outline-color": "#6BC4F0"
        }
      },
      {
        "id": "Water area/Lake or river intermittent",
        "type": "fill",
        "source": "esri",
        "source-layer": "Water area",
        "filter": [
          "==",
          "_symbol",
          6
        ],
        "minzoom": 11,
        "layout": {},
        "paint": {
          "fill-pattern": "Water area/Lake or river intermittent"
        }
      },
      {
        "id": "Water area/Inundated area",
        "type": "fill",
        "source": "esri",
        "source-layer": "Water area",
        "filter": [
          "==",
          "_symbol",
          4
        ],
        "minzoom": 11,
        "layout": {},
        "paint": {
          "fill-pattern": "Water area/Inundated area"
        }
      },
      {
        "id": "Water area/Swamp or marsh",
        "type": "fill",
        "source": "esri",
        "source-layer": "Water area",
        "filter": [
          "==",
          "_symbol",
          3
        ],
        "minzoom": 11,
        "layout": {},
        "paint": {
          "fill-pattern": "Water area/Swamp or marsh",
          "fill-opacity": 0.45
        }
      },
      {
        "id": "Water area/Playa",
        "type": "fill",
        "source": "esri",
        "source-layer": "Water area",
        "filter": [
          "==",
          "_symbol",
          1
        ],
        "minzoom": 11,
        "layout": {},
        "paint": {
          "fill-pattern": "Water area/Playa"
        }
      },
      {
        "id": "Water area/Ice mass",
        "type": "fill",
        "source": "esri",
        "source-layer": "Water area",
        "filter": [
          "==",
          "_symbol",
          2
        ],
        "minzoom": 11,
        "layout": {},
        "paint": {
          "fill-pattern": "Water area/Ice mass",
          "fill-opacity": 0.5
        }
      },
      {
        "id": "Water area/Dam or weir",
        "type": "fill",
        "source": "esri",
        "source-layer": "Water area",
        "filter": [
          "==",
          "_symbol",
          5
        ],
        "minzoom": 11,
        "layout": {},
        "paint": {
          "fill-color": "#e5e5dd",
          "fill-outline-color": "#d9d9d1"
        }
      },
      {
        "id": "Special area of interest/Bike, walk or pedestrian/line",
        "type": "line",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          2
        ],
        "minzoom": 15,
        "layout": {},
        "paint": {
          "line-color": "#bcb7ae",
          "line-width": {
            "stops": [
              [
                15,
                1.1
              ],
              [
                22,
                10
              ]
            ]
          },
          "line-blur": {
            "stops": [
              [
                15,
                1
              ],
              [
                22,
                5
              ]
            ]
          }
        }
      },
      {
        "id": "Special area of interest/Bike, walk or pedestrian",
        "type": "fill",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          2
        ],
        "minzoom": 15,
        "layout": {},
        "paint": {
          "fill-color": "#E8E7E5",
          "fill-outline-color": "#dbd9d5"
        }
      },
      {
        "id": "Special area of interest/Bike, walk or pedestrian/pattern",
        "type": "fill",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          2
        ],
        "minzoom": 15,
        "layout": {},
        "paint": {
          "fill-pattern": "Special area of interest/Small stipple"
        }
      },
      {
        "id": "Special area of interest/Water",
        "type": "fill",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          7
        ],
        "minzoom": 14,
        "layout": {
          "visibility": "none"
        },
        "paint": {
          "fill-color": "#6BC4F0"
        }
      },
      {
        "id": "Special area of interest/Water/line",
        "type": "line",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "==",
          "_symbol",
          7
        ],
        "minzoom": 14,
        "layout": {
          "visibility": "none"
        },
        "paint": {
          "line-color": "#5db6e2",
          "line-width": {
            "stops": [
              [
                15,
                1.1
              ],
              [
                22,
                7
              ]
            ]
          },
          "line-blur": {
            "stops": [
              [
                15,
                1
              ],
              [
                22,
                3.5
              ]
            ]
          }
        }
      },
      {
        "id": "Ferry/Ferry",
        "type": "line",
        "source": "esri",
        "source-layer": "Ferry",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            0
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 11,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": "#c1e1f0",
          "line-opacity": 0.8,
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                11,
                1.3
              ],
              [
                14,
                1.5
              ],
              [
                17,
                1.5
              ]
            ]
          },
          "line-dasharray": [
            3,
            4
          ]
        }
      },
      {
        "id": "Railroad/2",
        "type": "line",
        "source": "esri",
        "source-layer": "Railroad",
        "minzoom": 11,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                11,
                "#dedcd9"
              ],
              [
                17,
                "#B8B1AA"
              ]
            ]
          },
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                11,
                2.5
              ],
              [
                14,
                2.5
              ],
              [
                17,
                4
              ]
            ]
          }
        }
      },
      {
        "id": "Railroad/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Railroad",
        "minzoom": 11,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-dasharray": [
            6,
            7.5
          ],
          "line-color": {
            "stops": [
              [
                11,
                "#E3E0D7"
              ],
              [
                17,
                "#DBD8CB"
              ]
            ]
          },
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                11,
                0.75
              ],
              [
                15,
                0.75
              ],
              [
                17,
                2
              ]
            ]
          }
        }
      },
      {
        "id": "Ferry/Rail ferry/2",
        "type": "line",
        "source": "esri",
        "source-layer": "Ferry",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            1
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 11,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                11,
                "#dedcd9"
              ],
              [
                17,
                "#B8B1AA"
              ]
            ]
          },
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                11,
                2.5
              ],
              [
                14,
                2.5
              ],
              [
                17,
                4
              ]
            ]
          }
        }
      },
      {
        "id": "Ferry/Rail ferry/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Ferry",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            1
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 11,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-dasharray": [
            6,
            7.5
          ],
          "line-color": {
            "stops": [
              [
                11,
                "#E3E0D7"
              ],
              [
                17,
                "#DBD8CB"
              ]
            ]
          },
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                11,
                0.75
              ],
              [
                15,
                0.75
              ],
              [
                17,
                2
              ]
            ]
          }
        }
      },
      {
        "id": "Special area of interest line/Sports field",
        "type": "line",
        "source": "esri",
        "source-layer": "Special area of interest line",
        "filter": [
          "==",
          "_symbol",
          6
        ],
        "minzoom": 15,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": "#e3e0da",
          "line-opacity": 0.8,
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                15,
                0.5
              ],
              [
                20,
                4
              ]
            ]
          }
        }
      },
      {
        "id": "Road/4WD/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Road",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            10
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 13,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": "#e3e1dc",
          "line-dasharray": [
            2,
            1
          ],
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                11,
                1.5
              ],
              [
                14,
                2.3
              ],
              [
                17,
                8.3
              ],
              [
                20,
                50
              ]
            ]
          }
        }
      },
      {
        "id": "Road/Minor, ramp or traffic circle/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Road",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            6
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 9,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                9,
                "#E2DFD6"
              ],
              [
                10,
                "#dedbd1"
              ],
              [
                12,
                "#e3e1dc"
              ]
            ]
          },
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                9.9,
                1
              ],
              [
                14,
                4
              ],
              [
                16,
                11.5
              ],
              [
                17,
                19
              ],
              [
                20,
                58
              ]
            ]
          }
        }
      },
      {
        "id": "Road/Minor/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Road",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            5
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 9,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                9,
                "#E2DFD6"
              ],
              [
                10,
                "#dedbd1"
              ],
              [
                12,
                "#e3e1dc"
              ]
            ]
          },
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                9,
                1
              ],
              [
                10,
                3.3
              ],
              [
                14,
                5.5
              ],
              [
                16,
                11.5
              ],
              [
                17,
                19
              ],
              [
                20,
                58
              ]
            ]
          }
        }
      },
      {
        "id": "Road/Major, ramp or traffic circle/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Road",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            4
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 9,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                9,
                "#dedbd1"
              ],
              [
                12,
                "#e3e1dc"
              ]
            ]
          },
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                9,
                3.3
              ],
              [
                14,
                7.3
              ],
              [
                16,
                12.3
              ],
              [
                17,
                22
              ],
              [
                20,
                63
              ]
            ]
          }
        }
      },
      {
        "id": "Road/Major/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Road",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            3
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 8,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                8,
                "#dedbd1"
              ],
              [
                12,
                "#e3e1dc"
              ]
            ]
          },
          "line-width": {
            "base": 1,
            "stops": [
              [
                8,
                3.3
              ],
              [
                14,
                7.3
              ],
              [
                16,
                12.3
              ],
              [
                17,
                22
              ],
              [
                20,
                63
              ]
            ]
          }
        }
      },
      {
        "id": "Road/Service/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Road",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            8
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 13,
        "layout": {
          "visibility": "none",
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": "#e3e1dc",
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                11,
                2
              ],
              [
                14,
                2.5
              ],
              [
                17,
                10.3
              ],
              [
                20,
                45
              ]
            ]
          }
        }
      },
      {
        "id": "Trail or path/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Trail or path",
        "minzoom": 15,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                15,
                "#dddbd5"
              ],
              [
                17,
                "#e3e1dc"
              ]
            ]
          },
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                15,
                2.5
              ],
              [
                16,
                3
              ],
              [
                17,
                5
              ],
              [
                20,
                20
              ],
              [
                22,
                31
              ]
            ]
          }
        }
      },
      {
        "id": "Road/Pedestrian/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Road",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            9
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 15,
        "layout": {
          "visibility": "none",
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                15,
                "#dddbd5"
              ],
              [
                17,
                "#e3e1dc"
              ]
            ]
          },
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                15,
                2.5
              ],
              [
                16,
                3
              ],
              [
                17,
                5
              ],
              [
                20,
                20
              ],
              [
                22,
                31
              ]
            ]
          }
        }
      },
      {
        "id": "Road/Local/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Road",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            7
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 12,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": "#e3e1dc",
          "line-width": {
            "base": 1.4,
            "stops": [
              [
                11,
                1.1
              ],
              [
                14,
                3
              ],
              [
                16,
                8
              ],
              [
                17,
                16
              ],
              [
                20,
                48
              ]
            ]
          }
        }
      },
      {
        "id": "Trail or path/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Trail or path",
        "minzoom": 15,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                15,
                "#f8f8f7"
              ],
              [
                18,
                "#ffffff"
              ]
            ]
          },
          "line-dasharray": {
            "stops": [
              [
                15,
                [
                  3,
                  3
                ]
              ],
              [
                17,
                [
                  2,
                  2
                ]
              ]
            ]
          },
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                15,
                1.3
              ],
              [
                17,
                2.5
              ]
            ]
          }
        }
      },
      {
        "id": "Road/Pedestrian/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Road",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            9
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 15,
        "layout": {
          "visibility": "none",
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                15,
                "#f8f8f7"
              ],
              [
                18,
                "#ffffff"
              ]
            ]
          },
          "line-dasharray": {
            "stops": [
              [
                15,
                [
                  3,
                  3
                ]
              ],
              [
                17,
                [
                  2,
                  2
                ]
              ]
            ]
          },
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                15,
                1.3
              ],
              [
                17,
                2.5
              ]
            ]
          }
        }
      },
      {
        "id": "Road/4WD/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Road",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            10
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 13,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": "#FFFFFF",
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                11,
                0.75
              ],
              [
                14,
                1.3
              ],
              [
                17,
                7.3
              ],
              [
                20,
                48
              ]
            ]
          }
        }
      },
      {
        "id": "Road/Service/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Road",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            8
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 13,
        "layout": {
          "visibility": "none",
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": "#FFFFFF",
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                11,
                0.75
              ],
              [
                14,
                1.3
              ],
              [
                17,
                8.3
              ],
              [
                20,
                43
              ]
            ]
          }
        }
      },
      {
        "id": "Road/Local/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Road",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            7
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 12,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                12,
                "#fcfbf9"
              ],
              [
                13,
                "#ffffff"
              ]
            ]
          },
          "line-width": {
            "base": 1.4,
            "stops": [
              [
                11,
                1.1
              ],
              [
                14,
                2
              ],
              [
                16,
                6
              ],
              [
                17,
                14
              ],
              [
                20,
                45
              ]
            ]
          }
        }
      },
      {
        "id": "Road/Minor, ramp or traffic circle/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Road",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            6
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 9,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                9,
                "#f0efea"
              ],
              [
                13,
                "#ffffff"
              ]
            ]
          },
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                9,
                0.75
              ],
              [
                14,
                2
              ],
              [
                16,
                9.5
              ],
              [
                17,
                17
              ],
              [
                20,
                55
              ]
            ]
          }
        }
      },
      {
        "id": "Road/Minor/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Road",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            5
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 9,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                9,
                "#f0efea"
              ],
              [
                13,
                "#ffffff"
              ]
            ]
          },
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                9,
                1.3
              ],
              [
                14,
                4.5
              ],
              [
                16,
                9.5
              ],
              [
                17,
                17
              ],
              [
                20,
                55
              ]
            ]
          }
        }
      },
      {
        "id": "Road/Major, ramp or traffic circle/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Road",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            4
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 9,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                9,
                "#f0efea"
              ],
              [
                13,
                "#ffffff"
              ]
            ]
          },
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                9,
                1.3
              ],
              [
                14,
                5.3
              ],
              [
                16,
                10.3
              ],
              [
                17,
                20
              ],
              [
                20,
                60
              ]
            ]
          }
        }
      },
      {
        "id": "Road/Major/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Road",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            3
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 8,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                9,
                "#f0efea"
              ],
              [
                13,
                "#ffffff"
              ]
            ]
          },
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                8,
                1.3
              ],
              [
                14,
                5.3
              ],
              [
                16,
                10.3
              ],
              [
                17,
                20
              ],
              [
                20,
                60
              ]
            ]
          }
        }
      },
      {
        "id": "Road/Freeway Motorway, ramp or traffic circle/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Road",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            2
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 6,
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        "paint": {
          "line-color": "#ffffff",
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                9,
                0.3
              ],
              [
                14,
                8.3
              ],
              [
                16,
                14.3
              ],
              [
                17,
                30
              ],
              [
                20,
                52
              ]
            ]
          }
        }
      },
      {
        "id": "Road/Highway/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Road",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            1
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 6,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": "#ffffff",
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                6,
                0.3
              ],
              [
                14,
                8.3
              ],
              [
                16,
                14.3
              ],
              [
                17,
                30
              ],
              [
                20,
                52
              ]
            ]
          }
        }
      },
      {
        "id": "Road/Freeway Motorway/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Road",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            0
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 5,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": "#ffffff",
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                5,
                0.3
              ],
              [
                14,
                8.3
              ],
              [
                16,
                14.3
              ],
              [
                17,
                30
              ],
              [
                20,
                52
              ]
            ]
          }
        }
      },
      {
        "id": "Road/Freeway Motorway, ramp or traffic circle/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Road",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            2
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 6,
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                6,
                "#F6CA91"
              ],
              [
                8,
                "#F6CA91"
              ],
              [
                12,
                "#F6CA91"
              ]
            ]
          },
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                9,
                0.7
              ],
              [
                14,
                6.3
              ],
              [
                16,
                12.3
              ],
              [
                17,
                28
              ],
              [
                20,
                50
              ]
            ]
          }
        }
      },
      {
        "id": "Road/Highway/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Road",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            1
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 6,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                6,
                "#F6CA91"
              ],
              [
                8,
                "#F6CA91"
              ],
              [
                12,
                "#F6CA91"
              ]
            ]
          },
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                6,
                0.7
              ],
              [
                14,
                6.3
              ],
              [
                16,
                12.3
              ],
              [
                17,
                28
              ],
              [
                20,
                50
              ]
            ]
          }
        }
      },
      {
        "id": "Road/Freeway Motorway/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Road",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            0
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 5,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": "#F6CA91",
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                5,
                0.7
              ],
              [
                14,
                6.3
              ],
              [
                16,
                12.3
              ],
              [
                17,
                28
              ],
              [
                20,
                50
              ]
            ]
          }
        }
      },
      {
        "id": "Special area of interest line/Dock or pier",
        "type": "line",
        "source": "esri",
        "source-layer": "Special area of interest line",
        "filter": [
          "==",
          "_symbol",
          0
        ],
        "minzoom": 15,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": "#E8E7E5",
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                15,
                0.5
              ],
              [
                20,
                4
              ]
            ]
          }
        }
      },
      {
        "id": "Special area of interest line/Fence (chain link)/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Special area of interest line",
        "filter": [
          "==",
          "_symbol",
          1
        ],
        "minzoom": 16,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": "#686868",
          "line-opacity": 0.5,
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                16,
                0.7
              ],
              [
                20,
                3
              ]
            ]
          }
        }
      },
      {
        "id": "Special area of interest line/Fence (chain link)/0",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Special area of interest line",
        "filter": [
          "==",
          "_symbol",
          1
        ],
        "minzoom": 16,
        "layout": {
          "symbol-placement": "line",
          "symbol-avoid-edges": true,
          "icon-image": "Special area of interest line/Fence (chain link)/0",
          "symbol-spacing": {
            "stops": [
              [
                16,
                7
              ],
              [
                22,
                20
              ]
            ]
          },
          "icon-rotation-alignment": "map",
          "icon-allow-overlap": true,
          "icon-padding": 1,
          "icon-size": {
            "stops": [
              [
                16,
                0.25
              ],
              [
                22,
                1
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Special area of interest line/Fence (metal)/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Special area of interest line",
        "filter": [
          "==",
          "_symbol",
          2
        ],
        "minzoom": 16,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": "#686868",
          "line-opacity": 0.5,
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                16,
                0.7
              ],
              [
                20,
                3
              ]
            ]
          }
        }
      },
      {
        "id": "Special area of interest line/Fence (metal)/0",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Special area of interest line",
        "filter": [
          "==",
          "_symbol",
          2
        ],
        "minzoom": 16,
        "layout": {
          "symbol-placement": "line",
          "symbol-avoid-edges": true,
          "icon-image": "Special area of interest line/Fence (metal)/0",
          "symbol-spacing": {
            "stops": [
              [
                16,
                7
              ],
              [
                22,
                20
              ]
            ]
          },
          "icon-rotation-alignment": "map",
          "icon-allow-overlap": true,
          "icon-padding": 1,
          "icon-size": {
            "stops": [
              [
                16,
                0.2
              ],
              [
                22,
                0.9
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Special area of interest line/Fence (wood)/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Special area of interest line",
        "filter": [
          "==",
          "_symbol",
          3
        ],
        "minzoom": 16,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": "#CDAA66",
          "line-opacity": 0.5,
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                16,
                0.7
              ],
              [
                20,
                3
              ]
            ]
          }
        }
      },
      {
        "id": "Special area of interest line/Fence (wood)/0",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Special area of interest line",
        "filter": [
          "==",
          "_symbol",
          3
        ],
        "minzoom": 16,
        "layout": {
          "symbol-placement": "line",
          "symbol-avoid-edges": true,
          "icon-image": "Special area of interest line/Fence (wood)/0",
          "symbol-spacing": {
            "stops": [
              [
                16,
                7
              ],
              [
                22,
                20
              ]
            ]
          },
          "icon-rotation-alignment": "map",
          "icon-allow-overlap": true,
          "icon-padding": 1,
          "icon-size": {
            "stops": [
              [
                16,
                0.2
              ],
              [
                22,
                0.9
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Special area of interest line/Gate/2",
        "type": "line",
        "source": "esri",
        "source-layer": "Special area of interest line",
        "filter": [
          "==",
          "_symbol",
          4
        ],
        "minzoom": 16,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": "#686868",
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                16,
                2
              ],
              [
                20,
                7
              ]
            ]
          }
        }
      },
      {
        "id": "Special area of interest line/Gate/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Special area of interest line",
        "filter": [
          "==",
          "_symbol",
          4
        ],
        "minzoom": 16,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": "#E1E1E1",
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                16,
                1
              ],
              [
                20,
                5
              ]
            ]
          }
        }
      },
      {
        "id": "Special area of interest line/Gate/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Special area of interest line",
        "filter": [
          "==",
          "_symbol",
          4
        ],
        "minzoom": 16,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": "#686868",
          "line-dasharray": [
            5,
            15
          ],
          "line-width": 0.7
        }
      },
      {
        "id": "Special area of interest line/Wall/2",
        "type": "line",
        "source": "esri",
        "source-layer": "Special area of interest line",
        "filter": [
          "==",
          "_symbol",
          7
        ],
        "minzoom": 16,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": "#BCB7AE",
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                16,
                4
              ],
              [
                20,
                7
              ]
            ]
          }
        }
      },
      {
        "id": "Special area of interest line/Wall/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Special area of interest line",
        "filter": [
          "==",
          "_symbol",
          7
        ],
        "minzoom": 16,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": "#e3e3e1",
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                16,
                2
              ],
              [
                20,
                5
              ]
            ]
          }
        }
      },
      {
        "id": "Special area of interest line/Wall/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Special area of interest line",
        "filter": [
          "==",
          "_symbol",
          7
        ],
        "minzoom": 16,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": "#BCB7AE",
          "line-width": 0.5
        }
      },
      {
        "id": "Special area of interest line/Parking lot",
        "type": "line",
        "source": "esri",
        "source-layer": "Special area of interest line",
        "filter": [
          "==",
          "_symbol",
          5
        ],
        "minzoom": 15,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": "#E8E7E5",
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                15,
                0.5
              ],
              [
                20,
                4
              ]
            ]
          }
        }
      },
      {
        "id": "Road tunnel/4WD/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Road tunnel",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            10
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 13,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": "#e3e1dc",
          "line-dasharray": [
            2,
            1
          ],
          "line-opacity": 0.5,
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                11,
                1.5
              ],
              [
                14,
                2.3
              ],
              [
                17,
                8.3
              ],
              [
                20,
                49
              ]
            ]
          }
        }
      },
      {
        "id": "Road tunnel/Minor, ramp or traffic circle/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Road tunnel",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            6
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 9,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                9,
                "#E2DFD6"
              ],
              [
                10,
                "#dedbd1"
              ],
              [
                12,
                "#e3e1dc"
              ]
            ]
          },
          "line-opacity": 0.5,
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                9.9,
                1
              ],
              [
                14,
                4
              ],
              [
                16,
                11.5
              ],
              [
                17,
                19
              ],
              [
                20,
                57
              ]
            ]
          }
        }
      },
      {
        "id": "Road tunnel/Minor/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Road tunnel",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            5
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 9,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                9,
                "#E2DFD6"
              ],
              [
                10,
                "#dedbd1"
              ],
              [
                12,
                "#e3e1dc"
              ]
            ]
          },
          "line-opacity": 0.5,
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                9,
                1
              ],
              [
                10,
                3.3
              ],
              [
                14,
                5.5
              ],
              [
                16,
                11.5
              ],
              [
                17,
                19
              ],
              [
                20,
                57
              ]
            ]
          }
        }
      },
      {
        "id": "Road tunnel/Major, ramp or traffic circle/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Road tunnel",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            4
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 9,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                9,
                "#dedbd1"
              ],
              [
                12,
                "#e3e1dc"
              ]
            ]
          },
          "line-opacity": 0.5,
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                9,
                3.3
              ],
              [
                14,
                7.3
              ],
              [
                16,
                12.3
              ],
              [
                17,
                22
              ],
              [
                20,
                62
              ]
            ]
          }
        }
      },
      {
        "id": "Road tunnel/Major/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Road tunnel",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            3
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 8,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                8,
                "#dedbd1"
              ],
              [
                12,
                "#e3e1dc"
              ]
            ]
          },
          "line-opacity": 0.5,
          "line-width": {
            "base": 1,
            "stops": [
              [
                8,
                3.3
              ],
              [
                14,
                7.3
              ],
              [
                16,
                12.3
              ],
              [
                17,
                22
              ],
              [
                20,
                62
              ]
            ]
          }
        }
      },
      {
        "id": "Road tunnel/Pedestrian/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Road tunnel",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            9
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 15,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": "#FFFFFF",
          "line-opacity": 0.5,
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                14,
                1.6
              ],
              [
                16,
                2
              ],
              [
                17,
                8
              ],
              [
                20,
                45
              ]
            ]
          }
        }
      },
      {
        "id": "Road tunnel/4WD/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Road tunnel",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            10
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 13,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": "#FFFFFF",
          "line-opacity": 0.5,
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                11,
                0.75
              ],
              [
                14,
                1.3
              ],
              [
                17,
                7.3
              ],
              [
                20,
                48
              ]
            ]
          }
        }
      },
      {
        "id": "Road tunnel/Service/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Road tunnel",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            8
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 13,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": "#FFFFFF",
          "line-opacity": 0.5,
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                11,
                0.75
              ],
              [
                14,
                1.3
              ],
              [
                17,
                8.3
              ],
              [
                20,
                48
              ]
            ]
          }
        }
      },
      {
        "id": "Road tunnel/Local/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Road tunnel",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            7
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 12,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                12,
                "#fcfbf9"
              ],
              [
                13,
                "#ffffff"
              ]
            ]
          },
          "line-opacity": 0.5,
          "line-width": {
            "base": 1.4,
            "stops": [
              [
                11,
                1.1
              ],
              [
                14,
                2
              ],
              [
                16,
                6
              ],
              [
                17,
                14
              ],
              [
                20,
                55
              ]
            ]
          }
        }
      },
      {
        "id": "Road tunnel/Minor, ramp or traffic circle/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Road tunnel",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            6
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 9,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                9,
                "#f0efea"
              ],
              [
                13,
                "#ffffff"
              ]
            ]
          },
          "line-opacity": 0.5,
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                9,
                0.75
              ],
              [
                14,
                2
              ],
              [
                16,
                9.5
              ],
              [
                17,
                17
              ],
              [
                20,
                55
              ]
            ]
          }
        }
      },
      {
        "id": "Road tunnel/Minor/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Road tunnel",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            5
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 9,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                9,
                "#f0efea"
              ],
              [
                13,
                "#ffffff"
              ]
            ]
          },
          "line-opacity": 0.5,
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                9,
                1.3
              ],
              [
                14,
                4.5
              ],
              [
                16,
                9.5
              ],
              [
                17,
                17
              ],
              [
                20,
                55
              ]
            ]
          }
        }
      },
      {
        "id": "Road tunnel/Major, ramp or traffic circle/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Road tunnel",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            4
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 9,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                9,
                "#f0efea"
              ],
              [
                13,
                "#ffffff"
              ]
            ]
          },
          "line-opacity": 0.5,
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                9,
                1.3
              ],
              [
                14,
                5.3
              ],
              [
                16,
                10.3
              ],
              [
                17,
                20
              ],
              [
                20,
                60
              ]
            ]
          }
        }
      },
      {
        "id": "Road tunnel/Major/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Road tunnel",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            3
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 8,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                9,
                "#f0efea"
              ],
              [
                13,
                "#ffffff"
              ]
            ]
          },
          "line-opacity": 0.5,
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                8,
                1.3
              ],
              [
                14,
                5.3
              ],
              [
                16,
                10.3
              ],
              [
                17,
                20
              ],
              [
                20,
                60
              ]
            ]
          }
        }
      },
      {
        "id": "Road tunnel/Freeway Motorway, ramp or traffic circle/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Road tunnel",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            2
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 6,
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        "paint": {
          "line-color": "#ffffff",
          "line-opacity": 0.5,
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                9,
                0.3
              ],
              [
                14,
                8.3
              ],
              [
                16,
                14.3
              ],
              [
                17,
                30
              ],
              [
                20,
                52
              ]
            ]
          }
        }
      },
      {
        "id": "Road tunnel/Highway/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Road tunnel",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            1
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 6,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": "#ffffff",
          "line-opacity": 0.5,
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                6,
                0.3
              ],
              [
                14,
                8.3
              ],
              [
                16,
                14.3
              ],
              [
                17,
                30
              ],
              [
                20,
                52
              ]
            ]
          }
        }
      },
      {
        "id": "Road tunnel/Freeway Motorway/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Road tunnel",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            0
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 5,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": "#ffffff",
          "line-opacity": 0.5,
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                5,
                0.3
              ],
              [
                14,
                8.3
              ],
              [
                16,
                14.3
              ],
              [
                17,
                30
              ],
              [
                20,
                52
              ]
            ]
          }
        }
      },
      {
        "id": "Road tunnel/Freeway Motorway, ramp or traffic circle/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Road tunnel",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            2
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 6,
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                6,
                "#F6CA91"
              ],
              [
                8,
                "#F6CA91"
              ],
              [
                12,
                "#F6CA91"
              ]
            ]
          },
          "line-opacity": 0.5,
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                9,
                0.7
              ],
              [
                14,
                6.3
              ],
              [
                16,
                12.3
              ],
              [
                17,
                28
              ],
              [
                20,
                50
              ]
            ]
          }
        }
      },
      {
        "id": "Road tunnel/Highway/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Road tunnel",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            1
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 6,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                6,
                "#F6CA91"
              ],
              [
                8,
                "#F6CA91"
              ],
              [
                12,
                "#F6CA91"
              ]
            ]
          },
          "line-opacity": 0.5,
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                6,
                0.7
              ],
              [
                14,
                6.3
              ],
              [
                16,
                12.3
              ],
              [
                17,
                28
              ],
              [
                20,
                50
              ]
            ]
          }
        }
      },
      {
        "id": "Road tunnel/Freeway Motorway/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Road tunnel",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            0
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 5,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": "#F6CA91",
          "line-opacity": 0.5,
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                5,
                0.7
              ],
              [
                14,
                6.3
              ],
              [
                16,
                12.3
              ],
              [
                17,
                28
              ],
              [
                20,
                50
              ]
            ]
          }
        }
      },
      {
        "id": "Special area of interest/Gutter",
        "type": "fill",
        "source": "esri",
        "source-layer": "Special area of interest",
        "filter": [
          "in",
          "_symbol",
          9,
          3
        ],
        "minzoom": 14,
        "layout": {},
        "paint": {
          "fill-color": "#E8E7E5",
          "fill-outline-color": "#bcb7ae"
        }
      },
      {
        "id": "Boundary line/Disputed admin2",
        "type": "line",
        "source": "esri",
        "source-layer": "Boundary line",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            8
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 9,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                1,
                "#f5f5f5"
              ],
              [
                3,
                "#fafafa"
              ],
              [
                9,
                "#ffffff"
              ]
            ]
          },
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                1,
                0.65
              ],
              [
                14,
                1.3
              ],
              [
                17,
                2.5
              ]
            ]
          },
          "line-dasharray": [
            5,
            5
          ]
        }
      },
      {
        "id": "Boundary line/Disputed admin1/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Boundary line",
        "minzoom": 3,
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            7
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": "#c6c4b6",
          "line-opacity": 0.95,
          "line-width": {
            "base": 1,
            "stops": [
              [
                4,
                0.5
              ],
              [
                14,
                7
              ],
              [
                17,
                7
              ]
            ]
          }
        }
      },
      {
        "id": "Boundary line/Disputed admin0/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Boundary line",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            6
          ],
          [
            "!in",
            "Viz",
            2
          ],
          [
            "!in",
            "DisputeID",
            8,
            16,
            90,
            96,
            0
          ]
        ],
        "minzoom": 1,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": "#c6c4b6",
          "line-opacity": 0.95,
          "line-width": {
            "base": 1,
            "stops": [
              [
                1,
                0.5
              ],
              [
                14,
                9.3
              ],
              [
                17,
                9.3
              ]
            ]
          }
        }
      },
      {
        "id": "Boundary line/Disputed admin1/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Boundary line",
        "minzoom": 3,
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            7
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                1,
                "#f5f5f5"
              ],
              [
                3,
                "#fafafa"
              ],
              [
                9,
                "#ffffff"
              ]
            ]
          },
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                1,
                0.65
              ],
              [
                14,
                1.3
              ],
              [
                17,
                2.5
              ]
            ]
          },
          "line-dasharray": [
            5,
            5
          ]
        }
      },
      {
        "id": "Boundary line/Disputed admin0/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Boundary line",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            6
          ],
          [
            "!in",
            "Viz",
            2
          ],
          [
            "!in",
            "DisputeID",
            8,
            16,
            90,
            96,
            0
          ]
        ],
        "minzoom": 1,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                1,
                "#f5f5f5"
              ],
              [
                3,
                "#fafafa"
              ],
              [
                9,
                "#ffffff"
              ]
            ]
          },
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                1,
                0.65
              ],
              [
                14,
                1.3
              ],
              [
                17,
                2.5
              ]
            ]
          },
          "line-dasharray": [
            5,
            5
          ]
        }
      },
      {
        "id": "Boundary line/Admin2/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Boundary line",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            2
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 10,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": "#ede7e0",
          "line-opacity": 0.6,
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                8,
                2.3
              ],
              [
                14,
                5.5
              ],
              [
                17,
                7.5
              ]
            ]
          }
        }
      },
      {
        "id": "Boundary line/Admin1/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Boundary line",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            1
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 3,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                3,
                "#DEE1CC"
              ],
              [
                10,
                "#d1ceb8"
              ]
            ]
          },
          "line-opacity": 0.5,
          "line-width": {
            "base": 1,
            "stops": [
              [
                3,
                0.5
              ],
              [
                14,
                9
              ],
              [
                17,
                10
              ]
            ]
          }
        }
      },
      {
        "id": "Boundary line/Admin0/1",
        "type": "line",
        "source": "esri",
        "source-layer": "Boundary line",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            0
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 1,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": "#d1cfc2",
          "line-width": {
            "base": 1,
            "stops": [
              [
                1,
                0.5
              ],
              [
                14,
                11.3
              ],
              [
                17,
                12.3
              ]
            ]
          }
        }
      },
      {
        "id": "Boundary line/Admin5",
        "type": "line",
        "source": "esri",
        "source-layer": "Boundary line",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            5
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 16,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": "#9C9C9C",
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                14,
                1
              ],
              [
                17,
                1
              ]
            ]
          },
          "line-dasharray": [
            6,
            4
          ]
        }
      },
      {
        "id": "Boundary line/Admin4",
        "type": "line",
        "source": "esri",
        "source-layer": "Boundary line",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            4
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 16,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": "#9C9C9C",
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                14,
                1
              ],
              [
                17,
                1
              ]
            ]
          },
          "line-dasharray": [
            6,
            4
          ]
        }
      },
      {
        "id": "Boundary line/Admin3",
        "type": "line",
        "source": "esri",
        "source-layer": "Boundary line",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            3
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 16,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": "#9C9C9C",
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                14,
                1
              ],
              [
                17,
                1
              ]
            ]
          },
          "line-dasharray": [
            6,
            4
          ]
        }
      },
      {
        "id": "Boundary line/Admin2/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Boundary line",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            2
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 9,
        "layout": {
          "line-join": "round"
        },
        "paint": {
          "line-color": "#888577",
          "line-dasharray": [
            7,
            5
          ],
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                8,
                0.5
              ],
              [
                14,
                1
              ]
            ]
          }
        }
      },
      {
        "id": "Boundary line/Admin1/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Boundary line",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            1
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 3,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                3,
                "#c1bdb5"
              ],
              [
                4,
                "#9b9382"
              ]
            ]
          },
          "line-width": {
            "base": 1,
            "stops": [
              [
                4,
                0.5
              ],
              [
                14,
                1.3
              ],
              [
                17,
                1.3
              ]
            ]
          }
        }
      },
      {
        "id": "Boundary line/Admin0/0",
        "type": "line",
        "source": "esri",
        "source-layer": "Boundary line",
        "filter": [
          "all",
          [
            "==",
            "_symbol",
            0
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 1,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                1,
                "#b9b9b9"
              ],
              [
                7,
                "#434242"
              ]
            ]
          },
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                1,
                0.5
              ],
              [
                14,
                1.3
              ],
              [
                17,
                2
              ]
            ]
          }
        }
      },
      {
        "id": "Coastline",
        "type": "line",
        "source": "esri",
        "source-layer": "Coastline",
        "maxzoom": 9,
        "layout": {
          "line-cap": "round",
          "line-join": "round"
        },
        "paint": {
          "line-color": {
            "stops": [
              [
                0,
                "#53B9EA"
              ],
              [
                7,
                "#53B9EA"
              ],
              [
                9,
                "#6BC4F0"
              ]
            ]
          },
          "line-width": {
            "base": 1.2,
            "stops": [
              [
                0,
                0.5
              ],
              [
                9,
                1.3
              ]
            ]
          }
        }
      },
      {
        "id": "Pavement marking/Arrow",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Pavement marking",
        "minzoom": 17,
        "filter": [
          "==",
          "_symbol",
          0
        ],
        "layout": {
          "icon-rotation-alignment": "map",
          "icon-image": "Pavement marking/Arrow",
          "icon-size": {
            "stops": [
              [
                17,
                0.5
              ],
              [
                22,
                1
              ]
            ]
          },
          "icon-rotate": {
            "type": "identity",
            "property": "angle",
            "default": 0
          },
          "icon-allow-overlap": true
        },
        "paint": {
          "icon-color": "#B2B2B2"
        }
      },
      {
        "id": "Pavement marking/Handicap",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Pavement marking",
        "minzoom": 18,
        "filter": [
          "==",
          "_symbol",
          1
        ],
        "layout": {
          "icon-rotation-alignment": "map",
          "icon-image": "Pavement marking/Handicap",
          "icon-size": {
            "stops": [
              [
                18,
                0.5
              ],
              [
                20,
                1
              ],
              [
                22,
                1.25
              ]
            ]
          },
          "icon-rotate": {
            "type": "identity",
            "property": "angle",
            "default": 0
          },
          "icon-allow-overlap": true
        },
        "paint": {
          "icon-color": "#296AA3",
          "icon-opacity": {
            "stops": [
              [
                18,
                0.65
              ],
              [
                20,
                1
              ]
            ]
          }
        }
      },
      {
        "id": "Pavement marking/Left turn",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Pavement marking",
        "minzoom": 17,
        "filter": [
          "==",
          "_symbol",
          2
        ],
        "layout": {
          "icon-rotation-alignment": "map",
          "icon-image": "Pavement marking/Left turn",
          "icon-size": {
            "stops": [
              [
                17,
                0.5
              ],
              [
                22,
                1
              ]
            ]
          },
          "icon-rotate": {
            "type": "identity",
            "property": "angle",
            "default": 0
          },
          "icon-allow-overlap": true
        },
        "paint": {
          "icon-color": "#B2B2B2"
        }
      },
      {
        "id": "Pavement marking/Right turn",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Pavement marking",
        "minzoom": 17,
        "filter": [
          "==",
          "_symbol",
          3
        ],
        "layout": {
          "icon-rotation-alignment": "map",
          "icon-image": "Pavement marking/Right turn",
          "icon-size": {
            "stops": [
              [
                17,
                0.5
              ],
              [
                22,
                1
              ]
            ]
          },
          "icon-rotate": {
            "type": "identity",
            "property": "angle",
            "default": 0
          },
          "icon-allow-overlap": true
        },
        "paint": {
          "icon-color": "#B2B2B2"
        }
      },
      {
        "id": "Pavement marking/Two-way left turn",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Pavement marking",
        "minzoom": 17,
        "filter": [
          "==",
          "_symbol",
          4
        ],
        "layout": {
          "icon-rotation-alignment": "map",
          "icon-image": "Pavement marking/Two-way left turn",
          "icon-size": {
            "stops": [
              [
                17,
                0.5
              ],
              [
                22,
                1
              ]
            ]
          },
          "icon-rotate": {
            "type": "identity",
            "property": "angle",
            "default": 0
          },
          "icon-allow-overlap": true
        },
        "paint": {
          "icon-color": "#B2B2B2"
        }
      },
      {
        "id": "Pavement marking/U-turn",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Pavement marking",
        "minzoom": 17,
        "filter": [
          "==",
          "_symbol",
          5
        ],
        "layout": {
          "icon-rotation-alignment": "map",
          "icon-image": "Pavement marking/U-turn",
          "icon-size": {
            "stops": [
              [
                17,
                0.5
              ],
              [
                22,
                1
              ]
            ]
          },
          "icon-rotate": {
            "type": "identity",
            "property": "angle",
            "default": 0
          },
          "icon-allow-overlap": true
        },
        "paint": {
          "icon-color": "#B2B2B2"
        }
      },
      {
        "id": "parcel-linked",
        "type": "fill",
        "source": "baseunits",
        "source-layer": "parcels",
        "minzoom": 11,
        "filter": ["==", "parcelno", "02004940."],
        "layout": {
          "visibility": "visible"
        },
        "paint": {
          "fill-color": layers['parcels'].color,
          "fill-opacity": {
            "base": 1,
            "stops": [
              [12, 0],
              [12.1, 0.1],
              [12.5, 0.25],
              [22, 0.25]
            ]
          }
        }
      },
      {
        "id": "parcel-fill",
        "type": "fill",
        "source": "baseunits",
        "source-layer": "parcels",
        "interactive": true,
        "minzoom": 12,
        "layout": {
          "visibility": "visible"
        },
        "paint": {
          "fill-color": "rgba(0,0,0,0)"
        }
      },
      {
        "id": "streets-highlight",
        "type": "line",
        "source": "baseunits",
        "source-layer": "streets",
        "filter": ["==", "$id", ""],
        "minzoom": 14,
        "layout": {
          "visibility": "visible"
        },
        "paint": {
          "line-width": {
            "stops": [[11, 3], [15, 5.5], [20, 42]]
          },
          "line-color": layers['streets'].color,
          "line-opacity": 0.75
        }
      },
      {
        "id": "streets-linked",
        "type": "line",
        "source": "baseunits",
        "source-layer": "streets",
        "filter": ["==", "$id", ""],
        "minzoom": 14,
        "layout": {
          "visibility": "visible"
        },
        "paint": {
          "line-width": {
            "stops": [[11, 3], [15, 5.5], [20, 42]]
          },
          "line-color": layers['streets'].color,
          "line-opacity": 0.65
        }
      },
      {
        "id": "streets-line",
        "type": "line",
        "source": "baseunits",
        "source-layer": "streets",
        "minzoom": 11,
        "layout": {
          "visibility": "visible"
        },
        "paint": {
          "line-width": {
            "stops": [[11, 1], [15, 2], [20, 25]]
          },
          "line-color": "#bbb",
          "line-opacity": 1
        }
      },
      {
        "id": "Water point/Sea or ocean",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Water point",
        "filter": [
          "==",
          "_label_class",
          0
        ],
        "minzoom": 9,
        "layout": {
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-size": {
            "stops": [
              [
                9,
                8.5
              ],
              [
                15,
                15.5
              ]
            ]
          },
          "text-letter-spacing": 0.3,
          "text-line-height": 1.6,
          "text-max-width": 4,
          "text-field": "{_name_global}",
          "text-padding": 15
        },
        "paint": {
          "text-color": "#0d6c9a",
          "text-halo-blur": 1,
          "text-halo-color": "#FFFFFF",
          "text-halo-width": 1
        }
      },
      {
        "id": "Water point/Island",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Water point",
        "filter": [
          "==",
          "_label_class",
          7
        ],
        "minzoom": 9,
        "layout": {
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-size": {
            "stops": [
              [
                9,
                8.5
              ],
              [
                15,
                10
              ]
            ]
          },
          "text-letter-spacing": 0.1,
          "text-max-width": 4,
          "text-field": "{_name_global}",
          "text-padding": 15
        },
        "paint": {
          "text-color": "#595959",
          "text-halo-blur": 1,
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1
        }
      },
      {
        "id": "Water point/Dam or weir",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Water point",
        "filter": [
          "==",
          "_label_class",
          5
        ],
        "minzoom": 9,
        "layout": {
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                9,
                8.5
              ],
              [
                15,
                10
              ]
            ]
          },
          "text-letter-spacing": 0.1,
          "text-max-width": 4,
          "text-field": "{_name_global}",
          "text-padding": 15
        },
        "paint": {
          "text-color": "#171310",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 0.7,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Water point/Playa",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Water point",
        "filter": [
          "==",
          "_label_class",
          6
        ],
        "minzoom": 9,
        "layout": {
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-size": {
            "stops": [
              [
                9,
                8.5
              ],
              [
                15,
                10
              ]
            ]
          },
          "text-letter-spacing": 0.1,
          "text-max-width": 4,
          "text-field": "{_name_global}",
          "text-padding": 15
        },
        "paint": {
          "text-color": "#171310",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 0.7,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Water point/Canal or ditch",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Water point",
        "filter": [
          "==",
          "_label_class",
          4
        ],
        "minzoom": 9,
        "layout": {
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-size": {
            "stops": [
              [
                9,
                8.5
              ],
              [
                15,
                10
              ]
            ]
          },
          "text-letter-spacing": 0.13,
          "text-max-width": 4,
          "text-field": "{_name_global}",
          "text-padding": 15
        },
        "paint": {
          "text-color": "#0d6c9a",
          "text-halo-blur": 1,
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1
        }
      },
      {
        "id": "Water point/Stream or river",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Water point",
        "filter": [
          "==",
          "_label_class",
          3
        ],
        "minzoom": 9,
        "layout": {
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-size": {
            "stops": [
              [
                9,
                8.5
              ],
              [
                15,
                10
              ]
            ]
          },
          "text-letter-spacing": 0.1,
          "text-max-width": 4,
          "text-field": "{_name_global}",
          "text-padding": 15
        },
        "paint": {
          "text-color": "#0d6c9a",
          "text-halo-blur": 1,
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 0.5
        }
      },
      {
        "id": "Water point/Lake or reservoir",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Water point",
        "filter": [
          "==",
          "_label_class",
          2
        ],
        "minzoom": 9,
        "layout": {
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-size": {
            "stops": [
              [
                9,
                8.5
              ],
              [
                15,
                10
              ]
            ]
          },
          "text-letter-spacing": 0.1,
          "text-max-width": 4,
          "text-field": "{_name_global}",
          "text-padding": 15
        },
        "paint": {
          "text-color": "#0d6c9a",
          "text-halo-blur": 1,
          "text-halo-color": "#FFFFFF",
          "text-halo-width": 0.5
        }
      },
      {
        "id": "Water point/Bay or inlet",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Water point",
        "filter": [
          "==",
          "_label_class",
          1
        ],
        "minzoom": 9,
        "layout": {
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-size": {
            "stops": [
              [
                9,
                8.5
              ],
              [
                15,
                10
              ]
            ]
          },
          "text-letter-spacing": 0.1,
          "text-max-width": 4,
          "text-field": "{_name_global}",
          "text-padding": 15
        },
        "paint": {
          "text-color": "#0d6c9a",
          "text-halo-blur": 1,
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 0.5
        }
      },
      {
        "id": "Ferry/label/Ferry",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Ferry/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            0
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 12,
        "layout": {
          "symbol-placement": "line",
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 10,
          "text-letter-spacing": 0.05,
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 30
        },
        "paint": {
          "text-color": "#ffffff",
          "text-halo-width": 1.2,
          "text-halo-color": "#6BC4F0",
          "text-halo-blur": 1
        }
      },
      {
        "id": "Water line/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Water line/label",
        "minzoom": 11,
        "layout": {
          "symbol-placement": "line",
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-size": 9.5,
          "text-letter-spacing": 0.07,
          "text-max-width": 8,
          "text-max-angle": 35,
          "text-field": "{_name_global}",
          "text-padding": 1,
          "text-offset": [
            0,
            -0.5
          ],
          "symbol-spacing": 800
        },
        "paint": {
          "text-color": "#0d6c9a",
          "text-halo-blur": 1,
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 0.5
        }
      },
      {
        "id": "Water line large scale/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Water line large scale/label",
        "minzoom": 7,
        "maxzoom": 11,
        "layout": {
          "symbol-placement": "line",
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-size": 9.3,
          "text-letter-spacing": 0.01,
          "text-max-width": 8,
          "text-max-angle": {
            "stops": [
              [
                7,
                25
              ],
              [
                11,
                35
              ]
            ]
          },
          "text-field": "{_name}",
          "text-padding": 1,
          "text-offset": [
            0,
            -0.5
          ],
          "symbol-spacing": 800
        },
        "paint": {
          "text-color": "#0d6c9a",
          "text-halo-blur": 1,
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 0.5
        }
      },
      {
        "id": "Water line medium scale/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Water line medium scale/label",
        "minzoom": 5,
        "maxzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-size": 9.3,
          "text-letter-spacing": 0.1,
          "text-max-width": 8,
          "text-max-angle": {
            "stops": [
              [
                5,
                15
              ],
              [
                6,
                25
              ]
            ]
          },
          "text-field": "{_name}",
          "text-padding": 1,
          "text-offset": [
            0,
            -0.5
          ],
          "symbol-spacing": 800
        },
        "paint": {
          "text-color": "#0d6c9a",
          "text-halo-blur": 1,
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 0.5
        }
      },
      {
        "id": "Water line small scale/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Water line small scale/label",
        "minzoom": 4,
        "maxzoom": 5,
        "layout": {
          "symbol-placement": "line",
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-size": 8.5,
          "text-letter-spacing": 0.1,
          "text-max-width": 8,
          "text-max-angle": 18,
          "text-field": "{_name}",
          "text-padding": 1,
          "text-offset": [
            0,
            -0.5
          ],
          "symbol-spacing": 800
        },
        "paint": {
          "text-color": "#0d6c9a",
          "text-halo-blur": 1,
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 0.5
        }
      },
      {
        "id": "Marine park/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Marine park/label",
        "minzoom": 11,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                15,
                9.5
              ],
              [
                20,
                11
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                15,
                0.05
              ],
              [
                20,
                0.15
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true
        },
        "paint": {
          "text-color": "#3a7795"
        }
      },
      {
        "id": "Water area/label/Dam or weir",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Water area/label",
        "filter": [
          "==",
          "_label_class",
          8
        ],
        "minzoom": 11,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 9.5,
          "text-letter-spacing": 0.08,
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true
        },
        "paint": {
          "text-color": "#171310",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 0.5,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Water area/label/Playa",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Water area/label",
        "filter": [
          "==",
          "_label_class",
          9
        ],
        "minzoom": 11,
        "layout": {
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-size": 9.5,
          "text-letter-spacing": 0.08,
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true
        },
        "paint": {
          "text-color": "#171310",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 0.5,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Water area/label/Canal or ditch",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Water area/label",
        "filter": [
          "==",
          "_label_class",
          2
        ],
        "minzoom": 11,
        "layout": {
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "symbol-placement": "line",
          "symbol-spacing": 1000,
          "text-size": 10.5,
          "text-letter-spacing": 0.13,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true,
          "text-max-width": 5
        },
        "paint": {
          "text-color": "#0d6c9a",
          "text-halo-blur": 1,
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 0.5
        }
      },
      {
        "id": "Water area/label/Small river",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Water area/label",
        "filter": [
          "==",
          "_label_class",
          7
        ],
        "minzoom": 11,
        "layout": {
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "symbol-placement": "line",
          "symbol-spacing": 1000,
          "text-size": 10.5,
          "text-letter-spacing": 0.13,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true,
          "text-max-width": 8
        },
        "paint": {
          "text-color": "#0d6c9a",
          "text-halo-blur": 1,
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 0.5
        }
      },
      {
        "id": "Water area/label/Large river",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Water area/label",
        "filter": [
          "==",
          "_label_class",
          4
        ],
        "minzoom": 11,
        "layout": {
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "symbol-placement": "line",
          "symbol-spacing": 1000,
          "text-size": 10.5,
          "text-letter-spacing": 0.13,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true,
          "text-max-width": 8
        },
        "paint": {
          "text-color": "#0d6c9a",
          "text-halo-blur": 1,
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 0.5
        }
      },
      {
        "id": "Water area/label/Small lake or reservoir",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Water area/label",
        "filter": [
          "==",
          "_label_class",
          6
        ],
        "minzoom": 11,
        "layout": {
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-size": 10.5,
          "text-letter-spacing": 0.13,
          "text-line-height": 1,
          "text-max-width": 4,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true
        },
        "paint": {
          "text-color": "#0d6c9a",
          "text-halo-blur": 1,
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 0.5
        }
      },
      {
        "id": "Water area/label/Large lake or reservoir",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Water area/label",
        "filter": [
          "==",
          "_label_class",
          3
        ],
        "minzoom": 11,
        "layout": {
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-size": 10.5,
          "text-letter-spacing": 0.13,
          "text-line-height": 1.5,
          "text-max-width": 4,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true
        },
        "paint": {
          "text-color": "#0d6c9a",
          "text-halo-blur": 1,
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 0.5
        }
      },
      {
        "id": "Water area/label/Bay or inlet",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Water area/label",
        "filter": [
          "==",
          "_label_class",
          1
        ],
        "minzoom": 11,
        "layout": {
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-size": 10.5,
          "text-letter-spacing": 0.13,
          "text-line-height": 1.5,
          "text-max-width": 4,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true
        },
        "paint": {
          "text-color": "#0d6c9a",
          "text-halo-blur": 1,
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 0.5
        }
      },
      {
        "id": "Water area/label/Small island",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Water area/label",
        "filter": [
          "==",
          "_label_class",
          0
        ],
        "minzoom": 11,
        "layout": {
          "text-size": 10.5,
          "text-letter-spacing": 0.1,
          "text-max-width": 4,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ]
        },
        "paint": {
          "text-color": "#595959",
          "text-halo-blur": 1,
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1
        }
      },
      {
        "id": "Water area/label/Large island",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Water area/label",
        "filter": [
          "==",
          "_label_class",
          5
        ],
        "minzoom": 11,
        "layout": {
          "text-size": 10.5,
          "text-letter-spacing": 0.13,
          "text-line-height": 1.5,
          "text-max-width": 4,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ]
        },
        "paint": {
          "text-color": "#595959",
          "text-halo-blur": 1,
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1
        }
      },
      {
        "id": "Water area large scale/label/River",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Water area large scale/label",
        "filter": [
          "==",
          "_label_class",
          1
        ],
        "minzoom": 7,
        "maxzoom": 11,
        "layout": {
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "symbol-placement": "line",
          "symbol-spacing": 1000,
          "text-size": 9.3,
          "text-letter-spacing": 0.1,
          "text-field": "{_name}",
          "text-padding": 15,
          "symbol-avoid-edges": true,
          "text-max-width": 4
        },
        "paint": {
          "text-color": "#0d6c9a",
          "text-halo-blur": 1,
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 0.5
        }
      },
      {
        "id": "Water area large scale/label/Lake or lake intermittent",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Water area large scale/label",
        "filter": [
          "==",
          "_label_class",
          0
        ],
        "minzoom": 7,
        "maxzoom": 11,
        "layout": {
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-size": 9.3,
          "text-letter-spacing": 0.1,
          "text-max-width": 4,
          "text-field": "{_name}",
          "text-padding": 15,
          "symbol-avoid-edges": true
        },
        "paint": {
          "text-color": "#0d6c9a",
          "text-halo-blur": 1,
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 0.5
        }
      },
      {
        "id": "Water area medium scale/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Water area medium scale/label",
        "minzoom": 5,
        "maxzoom": 7,
        "layout": {
          "text-max-width": 4,
          "text-field": "{_name}",
          "text-padding": 15,
          "symbol-avoid-edges": true,
          "text-letter-spacing": 0.08,
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-size": 9.3
        },
        "paint": {
          "text-color": "#0d6c9a",
          "text-halo-blur": 1,
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 0.5
        }
      },
      {
        "id": "Water area small scale/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Water area small scale/label",
        "minzoom": 1,
        "maxzoom": 5,
        "layout": {
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-size": 9.3,
          "text-letter-spacing": 0.08,
          "text-max-width": 4,
          "text-field": "{_name}",
          "text-padding": 15,
          "symbol-avoid-edges": true
        },
        "paint": {
          "text-color": "#0d6c9a",
          "text-halo-blur": 1,
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 0.5
        }
      },
      {
        "id": "Marine area/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Marine area/label",
        "minzoom": 11,
        "layout": {
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-size": 10.5,
          "text-letter-spacing": 0.13,
          "text-line-height": 1.5,
          "text-max-width": 4,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true
        },
        "paint": {
          "text-color": "#0d6c9a",
          "text-halo-blur": 1,
          "text-halo-color": "#82CFF5",
          "text-halo-width": 1
        }
      },
      {
        "id": "Marine waterbody/label/small",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Marine waterbody/label",
        "filter": [
          "==",
          "_label_class",
          4
        ],
        "minzoom": 1,
        "maxzoom": 10,
        "layout": {
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-letter-spacing": {
            "stops": [
              [
                1,
                0.12
              ],
              [
                10,
                0.25
              ]
            ]
          },
          "text-line-height": 1.5,
          "text-max-width": 6,
          "text-field": "{_name}",
          "text-padding": 15,
          "symbol-avoid-edges": true,
          "text-size": {
            "stops": [
              [
                1,
                8
              ],
              [
                6,
                9.3
              ]
            ]
          }
        },
        "paint": {
          "text-color": {
            "stops": [
              [
                1,
                "#0d6c9a"
              ],
              [
                6,
                "#0d6c9a"
              ]
            ]
          },
          "text-halo-blur": 1,
          "text-halo-color": "#82CFF5",
          "text-halo-width": 0.5
        }
      },
      {
        "id": "Marine waterbody/label/medium",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Marine waterbody/label",
        "filter": [
          "==",
          "_label_class",
          3
        ],
        "minzoom": 1,
        "maxzoom": 10,
        "layout": {
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-letter-spacing": {
            "stops": [
              [
                1,
                0.15
              ],
              [
                10,
                0.3
              ]
            ]
          },
          "text-line-height": 1.5,
          "text-max-width": 6,
          "text-field": "{_name}",
          "text-padding": 15,
          "symbol-avoid-edges": true,
          "text-size": {
            "stops": [
              [
                1,
                8
              ],
              [
                6,
                9.3
              ]
            ]
          }
        },
        "paint": {
          "text-color": {
            "stops": [
              [
                1,
                "#0d6c9a"
              ],
              [
                6,
                "#0d6c9a"
              ]
            ]
          },
          "text-halo-blur": 1,
          "text-halo-color": "#82CFF5",
          "text-halo-width": 0.5
        }
      },
      {
        "id": "Marine waterbody/label/large",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Marine waterbody/label",
        "filter": [
          "==",
          "_label_class",
          2
        ],
        "minzoom": 1,
        "maxzoom": 10,
        "layout": {
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-letter-spacing": {
            "stops": [
              [
                1,
                0.18
              ],
              [
                10,
                0.4
              ]
            ]
          },
          "text-line-height": 1.5,
          "text-max-width": 6,
          "text-field": "{_name}",
          "text-padding": 15,
          "symbol-avoid-edges": true,
          "text-size": {
            "stops": [
              [
                1,
                8
              ],
              [
                6,
                10
              ]
            ]
          }
        },
        "paint": {
          "text-color": {
            "stops": [
              [
                1,
                "#0d6c9a"
              ],
              [
                6,
                "#0d6c9a"
              ]
            ]
          },
          "text-halo-blur": 1,
          "text-halo-color": "#82CFF5",
          "text-halo-width": 0.5
        }
      },
      {
        "id": "Marine waterbody/label/x large",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Marine waterbody/label",
        "filter": [
          "==",
          "_label_class",
          1
        ],
        "minzoom": 1,
        "maxzoom": 10,
        "layout": {
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-letter-spacing": {
            "stops": [
              [
                1,
                0.2
              ],
              [
                10,
                1.5
              ]
            ]
          },
          "text-line-height": 1.5,
          "text-max-width": 6,
          "text-field": "{_name}",
          "text-padding": 15,
          "symbol-avoid-edges": true,
          "text-size": {
            "stops": [
              [
                1,
                8
              ],
              [
                6,
                11
              ]
            ]
          }
        },
        "paint": {
          "text-color": {
            "stops": [
              [
                1,
                "#0d6c9a"
              ],
              [
                6,
                "#0d6c9a"
              ]
            ]
          },
          "text-halo-blur": 1,
          "text-halo-color": "#82CFF5",
          "text-halo-width": 0.5
        }
      },
      {
        "id": "Marine waterbody/label/2x large",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Marine waterbody/label",
        "filter": [
          "==",
          "_label_class",
          0
        ],
        "minzoom": 1,
        "maxzoom": 10,
        "layout": {
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-letter-spacing": {
            "stops": [
              [
                1,
                0.3
              ],
              [
                10,
                2
              ]
            ]
          },
          "text-line-height": 1.6,
          "text-max-width": 6,
          "text-field": "{_name}",
          "text-padding": 15,
          "symbol-avoid-edges": true,
          "text-size": {
            "stops": [
              [
                1,
                10
              ],
              [
                4,
                18
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#0d6c9a",
          "text-halo-blur": 1,
          "text-halo-color": "#82CFF5",
          "text-halo-width": 0.5
        }
      },
      {
        "id": "Ferry/label/Rail ferry",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Ferry/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            1
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 12,
        "layout": {
          "symbol-placement": "line",
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 9,
          "text-letter-spacing": 0.1,
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 5,
          "text-offset": [
            0,
            -0.6
          ],
          "symbol-spacing": 1000
        },
        "paint": {
          "text-color": "#4E4E4E",
          "text-halo-color": "#FFFFFF",
          "text-halo-width": 1
        }
      },
      {
        "id": "Railroad/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Railroad/label",
        "minzoom": 14,
        "layout": {
          "symbol-placement": "line",
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 9,
          "text-letter-spacing": 0.1,
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 5,
          "text-offset": [
            0,
            -0.6
          ],
          "symbol-spacing": 1000
        },
        "paint": {
          "text-color": "#4E4E4E",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1
        }
      },
      {
        "id": "Trail or path/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Trail or path/label",
        "minzoom": 15,
        "layout": {
          "symbol-placement": "line",
          "symbol-avoid-edges": true,
          "symbol-spacing": 400,
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-size": 9.3,
          "text-letter-spacing": 0.05,
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 5
        },
        "paint": {
          "text-color": "#595959",
          "text-halo-color": "#FFFFFF",
          "text-halo-width": 1
        }
      },
      {
        "id": "Road tunnel/label/Pedestrian",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road tunnel/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            6
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 15,
        "layout": {
          "symbol-placement": "line",
          "symbol-avoid-edges": true,
          "symbol-spacing": 400,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 9.3,
          "text-letter-spacing": 0.05,
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 5
        },
        "paint": {
          "text-color": "#595959",
          "text-halo-color": "#FFFFFF",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Road tunnel/label/Local, service, 4WD",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road tunnel/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            5
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 12,
        "layout": {
          "symbol-placement": "line",
          "symbol-avoid-edges": true,
          "symbol-spacing": 400,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 9.5,
          "text-letter-spacing": 0.09,
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": {
            "stops": [
              [
                12,
                5
              ],
              [
                15,
                5
              ],
              [
                16,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#595959",
          "text-halo-color": "#FFFFFF",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Road tunnel/label/Minor",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road tunnel/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            4
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 10,
        "layout": {
          "symbol-placement": "line",
          "symbol-avoid-edges": true,
          "symbol-spacing": 400,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                10,
                9.5
              ],
              [
                14,
                10.5
              ],
              [
                18,
                12.5
              ]
            ]
          },
          "text-letter-spacing": 0.09,
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": {
            "stops": [
              [
                10,
                5
              ],
              [
                15,
                5
              ],
              [
                16,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#595959",
          "text-halo-color": "#FFFFFF",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Road tunnel/label/Major, alt name",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road tunnel/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            3
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 10,
        "layout": {
          "symbol-placement": "line",
          "symbol-avoid-edges": true,
          "symbol-spacing": 400,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                10,
                9.5
              ],
              [
                14,
                10.5
              ],
              [
                18,
                12.5
              ]
            ]
          },
          "text-letter-spacing": 0.09,
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": {
            "stops": [
              [
                10,
                5
              ],
              [
                15,
                5
              ],
              [
                16,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#4e4e4e",
          "text-halo-color": "#FFFFFF",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Road tunnel/label/Major",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road tunnel/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            2
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 10,
        "layout": {
          "symbol-placement": "line",
          "symbol-avoid-edges": true,
          "symbol-spacing": 400,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                10,
                9.5
              ],
              [
                14,
                10.5
              ],
              [
                18,
                12.5
              ]
            ]
          },
          "text-letter-spacing": 0.09,
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": {
            "stops": [
              [
                10,
                5
              ],
              [
                15,
                5
              ],
              [
                16,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#4E4E4E",
          "text-halo-color": "#FFFFFF",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Road tunnel/label/Highway",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road tunnel/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            7
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 10,
        "layout": {
          "symbol-placement": "line",
          "symbol-avoid-edges": true,
          "symbol-spacing": 400,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": {
            "stops": [
              [
                10,
                9.5
              ],
              [
                14,
                10.5
              ],
              [
                18,
                14.5
              ]
            ]
          },
          "text-letter-spacing": 0.09,
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": {
            "stops": [
              [
                10,
                5
              ],
              [
                15,
                5
              ],
              [
                16,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#4E4E4E",
          "text-halo-color": "#FFFFFF",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Road tunnel/label/Freeway Motorway, alt name",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road tunnel/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            1
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 10,
        "layout": {
          "symbol-placement": "line",
          "symbol-avoid-edges": true,
          "symbol-spacing": 400,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": {
            "stops": [
              [
                10,
                9.5
              ],
              [
                14,
                10.5
              ],
              [
                18,
                14.5
              ]
            ]
          },
          "text-letter-spacing": 0.09,
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": {
            "stops": [
              [
                10,
                5
              ],
              [
                15,
                5
              ],
              [
                16,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#4E4E4E",
          "text-halo-color": "#FFFFFF",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Road tunnel/label/Freeway Motorway",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road tunnel/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            0
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 10,
        "layout": {
          "symbol-placement": "line",
          "symbol-avoid-edges": true,
          "symbol-spacing": 400,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": {
            "stops": [
              [
                10,
                9.5
              ],
              [
                14,
                10.5
              ],
              [
                18,
                14.5
              ]
            ]
          },
          "text-letter-spacing": 0.09,
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": {
            "stops": [
              [
                10,
                5
              ],
              [
                15,
                5
              ],
              [
                16,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#4E4E4E",
          "text-halo-color": "#FFFFFF",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Road/label/Local",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            5
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 12,
        "layout": {
          "symbol-placement": "line",
          "symbol-avoid-edges": true,
          "symbol-spacing": 400,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                10,
                9.5
              ],
              [
                14,
                10.5
              ],
              [
                18,
                11.5
              ]
            ]
          },
          "text-letter-spacing": 0,
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": {
            "stops": [
              [
                12,
                5
              ],
              [
                15,
                5
              ],
              [
                16,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#595959",
          "text-halo-color": "#FFFFFF",
          "text-halo-width": 2
        }
      },
      {
        "id": "Road/label/Minor",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            4
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 10,
        "layout": {
          "symbol-placement": "line",
          "symbol-avoid-edges": true,
          "symbol-spacing": 400,
          "text-font": [
            "Montserrat Bold"
          ],
          "text-size": {
            "stops": [
              [
                10,
                10.5
              ],
              [
                14,
                11.5
              ],
              [
                18,
                13.5
              ]
            ]
          },
          "text-letter-spacing": 0,
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": {
            "stops": [
              [
                10,
                5
              ],
              [
                15,
                5
              ],
              [
                16,
                10
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#595959",
          "text-halo-color": "#FFFFFF",
          "text-halo-width": 3,
        }
      },
      {
        "id": "Road/label/Major, alt name",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            3
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 10,
        "layout": {
          "symbol-placement": "line",
          "symbol-avoid-edges": true,
          "symbol-spacing": 400,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                10,
                9.5
              ],
              [
                14,
                10.5
              ],
              [
                18,
                12.5
              ]
            ]
          },
          "text-letter-spacing": 0.09,
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": {
            "stops": [
              [
                10,
                5
              ],
              [
                15,
                5
              ],
              [
                16,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#4E4E4E",
          "text-halo-color": "#FFFFFF",
          "text-halo-width": 2
        }
      },
      {
        "id": "Road/label/Major",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            2
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 10,
        "layout": {
          "symbol-placement": "line",
          "symbol-avoid-edges": true,
          "symbol-spacing": 400,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                10,
                10.5
              ],
              [
                14,
                11.5
              ],
              [
                18,
                12.5
              ]
            ]
          },
          "text-letter-spacing": 0,
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": {
            "stops": [
              [
                10,
                5
              ],
              [
                15,
                5
              ],
              [
                16,
                10
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#4E4E4E",
          "text-halo-color": "#FFFFFF",
          "text-halo-width": 2
        }
      },
      {
        "id": "Road/label/Highway",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            75
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 10,
        "layout": {
          "symbol-placement": "line",
          "symbol-avoid-edges": true,
          "symbol-spacing": 400,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": {
            "stops": [
              [
                10,
                9.5
              ],
              [
                14,
                10.5
              ],
              [
                18,
                14.5
              ]
            ]
          },
          "text-letter-spacing": 0.09,
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": {
            "stops": [
              [
                10,
                5
              ],
              [
                15,
                5
              ],
              [
                16,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#4E4E4E",
          "text-halo-color": "#FFFFFF",
          "text-halo-width": 2
        }
      },
      {
        "id": "Road/label/Freeway Motorway, alt name",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            1
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 10,
        "layout": {
          "symbol-placement": "line",
          "symbol-avoid-edges": true,
          "symbol-spacing": 400,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": {
            "stops": [
              [
                10,
                9.5
              ],
              [
                14,
                10.5
              ],
              [
                18,
                14.5
              ]
            ]
          },
          "text-letter-spacing": 0.09,
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": {
            "stops": [
              [
                10,
                5
              ],
              [
                15,
                5
              ],
              [
                16,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#4E4E4E",
          "text-halo-color": "#FFFFFF",
          "text-halo-width": 1
        }
      },
      {
        "id": "Road/label/Freeway Motorway",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            0
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 10,
        "layout": {
          "symbol-placement": "line",
          "symbol-avoid-edges": true,
          "symbol-spacing": 400,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": {
            "stops": [
              [
                10,
                9.5
              ],
              [
                14,
                10.5
              ],
              [
                18,
                14.5
              ]
            ]
          },
          "text-letter-spacing": 0.09,
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": {
            "stops": [
              [
                10,
                5
              ],
              [
                15,
                5
              ],
              [
                16,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#4E4E4E",
          "text-halo-color": "#FFFFFF",
          "text-halo-width": 1
        }
      },
      {
        "id": "Road/label/Rectangle white black (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            32
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 9.3,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Rectangle white black (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/Rectangle white black",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            31
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 9.3,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Rectangle white black/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/Secondary Hwy red white (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            16
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Secondary Hwy red white (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#ffffff"
        }
      },
      {
        "id": "Road/label/Secondary Hwy red white",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            15
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Secondary Hwy red white/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#ffffff"
        }
      },
      {
        "id": "Road/label/U-shaped yellow black (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            24
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-letter-spacing": 0.05,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/U-shaped yellow black (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/U-shaped yellow black",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            23
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-letter-spacing": 0.05,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/U-shaped yellow black/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/U-shaped red white (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            26
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/U-shaped red white (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#ffffff"
        }
      },
      {
        "id": "Road/label/U-shaped red white",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            25
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/U-shaped red white/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#ffffff"
        }
      },
      {
        "id": "Road/label/U-shaped blue white (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            28
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 8.5,
          "text-letter-spacing": 0.05,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/U-shaped blue white (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#ffffff"
        }
      },
      {
        "id": "Road/label/U-shaped blue white",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            27
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 8.5,
          "text-letter-spacing": 0.05,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/U-shaped blue white/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#ffffff"
        }
      },
      {
        "id": "Road/label/V-shaped white black (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            30
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/V-shaped white black (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/V-shaped white black",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            29
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/V-shaped white black/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/U-shaped white black (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            18
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-letter-spacing": 0.05,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/U-shaped white black (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/U-shaped white black",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            17
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-letter-spacing": 0.05,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/U-shaped white black/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/U-shaped white green (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            20
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-letter-spacing": 0.05,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/U-shaped white green (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/U-shaped white green",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            19
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-letter-spacing": 0.05,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/U-shaped white green/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/U-shaped green leaf (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            22
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-letter-spacing": 0.05,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/U-shaped green leaf (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/U-shaped green leaf",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            21
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-letter-spacing": 0.05,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/U-shaped green leaf/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/Rectangle yellow black (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            38
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-letter-spacing": 0.05,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Rectangle yellow black (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/Rectangle yellow black",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            37
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-letter-spacing": 0.05,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Rectangle yellow black/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/Rectangle red white (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            36
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 8.5,
          "text-letter-spacing": 0.05,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Rectangle red white (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#ffffff"
        }
      },
      {
        "id": "Road/label/Rectangle red white",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            35
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 8.5,
          "text-letter-spacing": 0.05,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Rectangle red white/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#ffffff"
        }
      },
      {
        "id": "Road/label/Rectangle blue white (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            34
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Rectangle blue white (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#ffffff"
        }
      },
      {
        "id": "Road/label/Rectangle blue white",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            33
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Rectangle blue white/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#ffffff"
        }
      },
      {
        "id": "Road/label/Rectangle green white (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            40
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 8.5,
          "text-letter-spacing": 0.05,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Rectangle green white (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#ffffff"
        }
      },
      {
        "id": "Road/label/Rectangle green white",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            39
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 8.5,
          "text-letter-spacing": 0.05,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Rectangle green white/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#ffffff"
        }
      },
      {
        "id": "Road/label/Rectangle green yellow (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            42
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Rectangle green yellow (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#f1dfb7"
        }
      },
      {
        "id": "Road/label/Rectangle green yellow",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            41
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Rectangle green yellow/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#f1dfb7"
        }
      },
      {
        "id": "Road/label/Pentagon inverse white black (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            44
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 9.3,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Pentagon inverse white black/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/Pentagon inverse white black",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            43
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 9.3,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Pentagon inverse white black (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/Pentagon white black (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            46
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Pentagon white black (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/Pentagon white black",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            45
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Pentagon white black/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/Pentagon yellow black (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            50
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Pentagon yellow black (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/Pentagon yellow black",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            49
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Pentagon yellow black/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/Pentagon green white",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            51
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Pentagon green white/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#ffffff"
        }
      },
      {
        "id": "Road/label/Pentagon green white (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            52
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Pentagon green white (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#ffffff"
        }
      },
      {
        "id": "Road/label/Pentagon green yellow",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            53
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Pentagon green yellow/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#f1dfb7"
        }
      },
      {
        "id": "Road/label/Pentagon green yellow (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            54
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Pentagon green yellow (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#f1dfb7"
        }
      },
      {
        "id": "Road/label/Pentagon blue white (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            48
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 9.3,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Pentagon blue white (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#ffffff"
        }
      },
      {
        "id": "Road/label/Pentagon blue white",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            47
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 9.3,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Pentagon blue white/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#ffffff"
        }
      },
      {
        "id": "Road/label/Hexagon white black (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            56
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Hexagon white black (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/Hexagon white black",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            55
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Hexagon white black/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/Hexagon blue white",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            57
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Hexagon blue white/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#ffffff"
        }
      },
      {
        "id": "Road/label/Hexagon blue white (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            58
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Hexagon blue white (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#ffffff"
        }
      },
      {
        "id": "Road/label/Hexagon red white",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            59
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Hexagon red white/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#ffffff"
        }
      },
      {
        "id": "Road/label/Hexagon red white (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            60
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Hexagon red white (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#ffffff"
        }
      },
      {
        "id": "Road/label/Hexagon green white (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            62
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Hexagon green white (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#ffffff"
        }
      },
      {
        "id": "Road/label/Hexagon green white",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            61
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Hexagon green white/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#ffffff"
        }
      },
      {
        "id": "Road/label/Hexagon orange black",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            63
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Hexagon orange black/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/Hexagon orange black (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            64
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Hexagon orange black (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/Rectangle hexagon blue white (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            66
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Rectangle hexagon blue white (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/Rectangle hexagon blue white",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            65
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Rectangle hexagon blue white/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/Rectangle hexagon red white (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            68
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Rectangle hexagon red white (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/Rectangle hexagon red white",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            67
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Rectangle hexagon red white/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/Rectangle hexagon green white (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            70
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Rectangle hexagon green white (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/Rectangle hexagon green white",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            69
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Rectangle hexagon green white/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/Rectangle hexagon brown white (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            72
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Rectangle hexagon brown white (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/Rectangle hexagon brown white",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            71
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Rectangle hexagon brown white/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/Octagon green white (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            74
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Octagon green white (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#ffffff"
        }
      },
      {
        "id": "Road/label/Octagon green white",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            73
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Octagon green white/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#ffffff"
        }
      },
      {
        "id": "Road/label/Shield white black (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            10
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 9.3,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Shield white black (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/Shield white black",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            9
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 9.3,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Shield white black/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/Secondary Hwy green white (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            14
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 9.3,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Secondary Hwy green white (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#ffffff"
        }
      },
      {
        "id": "Road/label/Secondary Hwy green white",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            13
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 9.3,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Secondary Hwy green white/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#ffffff"
        }
      },
      {
        "id": "Road/label/Secondary Hwy white black (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            12
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-letter-spacing": 0.05,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Secondary Hwy white black (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/Secondary Hwy white black",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            11
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Secondary Hwy white black/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {}
      },
      {
        "id": "Road/label/Shield blue white (Alt)",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            8
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Shield blue white (Alt)/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#ffffff"
        }
      },
      {
        "id": "Road/label/Shield blue white",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            7
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 7,
        "layout": {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": 8.5,
          "text-max-width": 8,
          "text-field": "{_name}",
          "icon-image": "Road/Shield blue white/{_len}",
          "icon-rotation-alignment": "viewport",
          "text-rotation-alignment": "viewport",
          "text-padding": {
            "stops": [
              [
                7,
                50
              ],
              [
                10,
                50
              ],
              [
                11,
                15
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#ffffff"
        }
      },
      {
        "id": "Road/label/Pedestrian",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Road/label",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            6
          ],
          [
            "!in",
            "Viz",
            2
          ]
        ],
        "minzoom": 15,
        "layout": {
          "symbol-placement": "line",
          "symbol-avoid-edges": true,
          "symbol-spacing": 400,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 9.3,
          "text-letter-spacing": 0.05,
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 5
        },
        "paint": {
          "text-color": "#595959",
          "text-halo-color": "#FFFFFF",
          "text-halo-width": 1
        }
      },
      {
        "id": "Cemetery/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Cemetery/label",
        "minzoom": 13,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                15,
                9.5
              ],
              [
                20,
                11
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                15,
                0.05
              ],
              [
                20,
                0.15
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true
        },
        "paint": {
          "text-color": "#2d4e28",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Freight/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Freight/label",
        "minzoom": 12,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                15,
                9.5
              ],
              [
                20,
                11
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                15,
                0.05
              ],
              [
                20,
                0.15
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true
        },
        "paint": {
          "text-color": "#4a2b1b",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Water and wastewater/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Water and wastewater/label",
        "minzoom": 13,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                15,
                9.5
              ],
              [
                20,
                11
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                15,
                0.05
              ],
              [
                20,
                0.15
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true
        },
        "paint": {
          "text-color": "#4a2b1b",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Port/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Port/label",
        "minzoom": 12,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                15,
                9.5
              ],
              [
                20,
                11
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                15,
                0.05
              ],
              [
                20,
                0.15
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true
        },
        "paint": {
          "text-color": "#4a2b1b",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Industry/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Industry/label",
        "minzoom": 12,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                15,
                9.5
              ],
              [
                20,
                11
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                15,
                0.05
              ],
              [
                20,
                0.15
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true
        },
        "paint": {
          "text-color": "#4a2b1b",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Government/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Government/label",
        "minzoom": 13,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                15,
                9.5
              ],
              [
                20,
                11
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                15,
                0.05
              ],
              [
                20,
                0.15
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 15
        },
        "paint": {
          "text-color": "#4a2b1b",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Finance/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Finance/label",
        "minzoom": 13,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                15,
                9.5
              ],
              [
                20,
                11
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                15,
                0.05
              ],
              [
                20,
                0.15
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true
        },
        "paint": {
          "text-color": "#9d5a48",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Emergency/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Emergency/label",
        "minzoom": 13,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                15,
                9.5
              ],
              [
                20,
                11
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                15,
                0.05
              ],
              [
                20,
                0.15
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true
        },
        "paint": {
          "text-color": "#33302f",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Indigenous/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Indigenous/label",
        "minzoom": 7,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                9,
                8.5
              ],
              [
                15,
                9.5
              ],
              [
                20,
                12.5
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                15,
                0.05
              ],
              [
                20,
                0.15
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true
        },
        "paint": {
          "text-color": "#533d32",
          "text-halo-color": "#e8e6d6",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Military/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Military/label",
        "minzoom": 6,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                9,
                8.5
              ],
              [
                15,
                9.5
              ],
              [
                20,
                12.5
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                15,
                0.05
              ],
              [
                20,
                0.15
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 25,
          "symbol-avoid-edges": true
        },
        "paint": {
          "text-color": "#242221",
          "text-halo-color": "#E0E0D9",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Transportation/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Transportation/label",
        "minzoom": 13,
        "layout": {
        "visibility": "none",
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                15,
                9.5
              ],
              [
                20,
                11
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                15,
                0.05
              ],
              [
                20,
                0.15
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true
        },
        "paint": {
          "text-color": "#242221",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Pedestrian/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Pedestrian/label",
        "minzoom": 13,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                15,
                9.5
              ],
              [
                20,
                11
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                15,
                0.05
              ],
              [
                20,
                0.15
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 15
        },
        "paint": {
          "text-color": "#242221",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Beach/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Beach/label",
        "minzoom": 13,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                15,
                9.5
              ],
              [
                20,
                11
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": 0.08,
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true
        },
        "paint": {
          "text-color": "#806b3c",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Golf course/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Golf course/label",
        "minzoom": 11,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                15,
                9.5
              ],
              [
                20,
                11
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                15,
                0.05
              ],
              [
                20,
                0.15
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true
        },
        "paint": {
          "text-color": "#2d4e28",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Zoo/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Zoo/label",
        "minzoom": 11,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                15,
                9.5
              ],
              [
                20,
                11
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                15,
                0.05
              ],
              [
                20,
                0.15
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true
        },
        "paint": {
          "text-color": "#2d4e28",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Retail/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Retail/label",
        "minzoom": 13,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                15,
                9.5
              ],
              [
                20,
                11
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                15,
                0.05
              ],
              [
                20,
                0.15
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true
        },
        "paint": {
          "text-color": "#9d5a48",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Landmark/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Landmark/label",
        "minzoom": 13,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                15,
                9.5
              ],
              [
                20,
                11
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                15,
                0.05
              ],
              [
                20,
                0.15
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true
        },
        "paint": {
          "text-color": "#446757",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Openspace or forest/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Openspace or forest/label",
        "minzoom": 10,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                15,
                9.5
              ],
              [
                20,
                11
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                15,
                0.05
              ],
              [
                20,
                0.15
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 25
        },
        "paint": {
          "text-color": "#006200",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Park or farming/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Park or farming/label",
        "minzoom": 11,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                15,
                9.5
              ],
              [
                20,
                11
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                15,
                0.05
              ],
              [
                20,
                0.15
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 25
        },
        "paint": {
          "text-color": "#006200",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Point of interest/Park",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Point of interest",
        "filter": [
          "==",
          "_label_class",
          1
        ],
        "minzoom": 9,
        "layout": {
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                15,
                9.5
              ],
              [
                20,
                11
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                15,
                0.05
              ],
              [
                20,
                0.15
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 15
        },
        "paint": {
          "text-color": "#006200",
          "text-halo-width": 1,
          "text-halo-color": "#EBE7E2",
          "text-halo-blur": 1
        }
      },
      {
        "id": "Education/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Education/label",
        "minzoom": 11,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                15,
                9.5
              ],
              [
                20,
                11
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                15,
                0.05
              ],
              [
                20,
                0.15
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true
        },
        "paint": {
          "text-color": "#505000",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Medical/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Medical/label",
        "minzoom": 11,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                15,
                9.5
              ],
              [
                20,
                11
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                15,
                0.05
              ],
              [
                20,
                0.15
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true
        },
        "paint": {
          "text-color": "#3d5d69",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Admin1 forest or park/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Admin1 forest or park/label",
        "minzoom": 7,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                9,
                8.5
              ],
              [
                15,
                9.5
              ],
              [
                20,
                12.5
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                15,
                0.05
              ],
              [
                20,
                0.15
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 25
        },
        "paint": {
          "text-color": "#006200",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Admin0 forest or park/label/Default",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Admin0 forest or park/label",
        "minzoom": 6,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                9,
                8.5
              ],
              [
                15,
                9.5
              ],
              [
                20,
                12.5
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                15,
                0.05
              ],
              [
                20,
                0.15
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 25,
          "symbol-avoid-edges": true
        },
        "paint": {
          "text-color": "#006200",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Airport/label/Airport property",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Airport/label",
        "minzoom": 9,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                9,
                8.5
              ],
              [
                15,
                9.5
              ],
              [
                20,
                12.5
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                15,
                0.05
              ],
              [
                20,
                0.15
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 15,
          "symbol-avoid-edges": true
        },
        "paint": {
          "text-color": "#5f5e5c",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Admin2 area/label/small",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Admin2 area/label",
        "filter": [
          "==",
          "_label_class",
          1
        ],
        "minzoom": 9,
        "maxzoom": 11,
        "layout": {
          "text-letter-spacing": 0.2,
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-size": 11,
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "symbol-avoid-edges": true,
          "text-transform": "uppercase"
        },
        "paint": {
          "text-color": "#80755f",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Admin2 area/label/large",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Admin2 area/label",
        "filter": [
          "==",
          "_label_class",
          0
        ],
        "minzoom": 9,
        "maxzoom": 11,
        "layout": {
          "text-letter-spacing": 0.2,
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-size": 13,
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "symbol-avoid-edges": true,
          "text-transform": "uppercase"
        },
        "paint": {
          "text-color": "#80755f",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Admin1 area/label/x small",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Admin1 area/label",
        "filter": [
          "==",
          "_label_class",
          5
        ],
        "minzoom": 4,
        "maxzoom": 10,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-transform": "uppercase",
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "symbol-avoid-edges": true,
          "text-size": {
            "stops": [
              [
                4,
                8.5
              ],
              [
                5,
                9.5
              ],
              [
                6,
                10.3
              ],
              [
                9,
                11
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                4,
                0.1
              ],
              [
                8,
                0.2
              ]
            ]
          }
        },
        "paint": {
          "text-color": {
            "stops": [
              [
                4,
                "#554434"
              ],
              [
                6,
                "#39240e"
              ]
            ]
          },
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Admin1 area/label/small",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Admin1 area/label",
        "filter": [
          "==",
          "_label_class",
          4
        ],
        "minzoom": 4,
        "maxzoom": 10,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-transform": "uppercase",
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "symbol-avoid-edges": true,
          "text-size": {
            "stops": [
              [
                4,
                8.5
              ],
              [
                5,
                9.5
              ],
              [
                6,
                10.5
              ],
              [
                9,
                11.5
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                4,
                0.1
              ],
              [
                8,
                0.2
              ]
            ]
          }
        },
        "paint": {
          "text-color": {
            "stops": [
              [
                4,
                "#554434"
              ],
              [
                6,
                "#39240e"
              ]
            ]
          },
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Admin1 area/label/medium",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Admin1 area/label",
        "filter": [
          "==",
          "_label_class",
          3
        ],
        "minzoom": 4,
        "maxzoom": 10,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-transform": "uppercase",
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "symbol-avoid-edges": true,
          "text-size": {
            "stops": [
              [
                4,
                9.5
              ],
              [
                5,
                10.5
              ],
              [
                6,
                11.3
              ],
              [
                9,
                12
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                4,
                0.15
              ],
              [
                8,
                0.4
              ]
            ]
          }
        },
        "paint": {
          "text-color": {
            "stops": [
              [
                4,
                "#554434"
              ],
              [
                6,
                "#39240e"
              ]
            ]
          },
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Admin1 area/label/large",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Admin1 area/label",
        "filter": [
          "==",
          "_label_class",
          2
        ],
        "minzoom": 4,
        "maxzoom": 10,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-transform": "uppercase",
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "symbol-avoid-edges": true,
          "text-size": {
            "stops": [
              [
                4,
                9.5
              ],
              [
                5,
                11.3
              ],
              [
                6,
                13
              ],
              [
                9,
                17
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                4,
                0.1
              ],
              [
                8,
                0.5
              ]
            ]
          }
        },
        "paint": {
          "text-color": {
            "stops": [
              [
                4,
                "#554434"
              ],
              [
                6,
                "#39240e"
              ]
            ]
          },
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Admin1 area/label/x large",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Admin1 area/label",
        "filter": [
          "==",
          "_label_class",
          1
        ],
        "minzoom": 4,
        "maxzoom": 10,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-transform": "uppercase",
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "symbol-avoid-edges": true,
          "text-size": {
            "stops": [
              [
                4,
                10.3
              ],
              [
                5,
                12
              ],
              [
                6,
                13.5
              ],
              [
                9,
                19
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                4,
                0.15
              ],
              [
                8,
                0.6
              ]
            ]
          }
        },
        "paint": {
          "text-color": {
            "stops": [
              [
                4,
                "#554434"
              ],
              [
                6,
                "#39240e"
              ]
            ]
          },
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Admin1 area/label/2x large",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Admin1 area/label",
        "filter": [
          "==",
          "_label_class",
          0
        ],
        "minzoom": 4,
        "maxzoom": 10,
        "layout": {
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-transform": "uppercase",
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "symbol-avoid-edges": true,
          "text-size": {
            "stops": [
              [
                4,
                11.5
              ],
              [
                5,
                12.3
              ],
              [
                6,
                14
              ],
              [
                9,
                19
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                4,
                0.15
              ],
              [
                8,
                0.75
              ]
            ]
          }
        },
        "paint": {
          "text-color": {
            "stops": [
              [
                4,
                "#554434"
              ],
              [
                6,
                "#39240e"
              ]
            ]
          },
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Point of interest/General",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Point of interest",
        "filter": [
          "==",
          "_label_class",
          0
        ],
        "minzoom": 9,
        "layout": {
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                15,
                9.5
              ],
              [
                20,
                11
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                15,
                0.05
              ],
              [
                20,
                0.15
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 15
        },
        "paint": {
          "text-color": {
            "stops": [
              [
                9,
                "#5a3514"
              ],
              [
                11,
                "#5a3514"
              ]
            ]
          },
          "text-halo-width": 1,
          "text-halo-color": "#EBE7E2",
          "text-halo-blur": 1
        }
      },
      {
        "id": "Point of interest/Bus station",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Point of interest",
        "filter": [
          "==",
          "_symbol",
          2
        ],
        "minzoom": 12,
        "layout": {
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                15,
                9.5
              ],
              [
                20,
                11
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                15,
                0.05
              ],
              [
                20,
                0.15
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 15
        },
        "paint": {
          "text-color": {
            "stops": [
              [
                9,
                "#5a3514"
              ],
              [
                11,
                "#5a3514"
              ]
            ]
          },
          "text-halo-width": 1,
          "text-halo-color": "#EBE7E2",
          "text-halo-blur": 1
        }
      },
      {
        "id": "Point of interest/Rail station",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Point of interest",
        "filter": [
          "==",
          "_symbol",
          3
        ],
        "minzoom": 12,
        "layout": {
          "visibility": "none",
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                15,
                9.5
              ],
              [
                20,
                11
              ],
              [
                22,
                15
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                15,
                0.05
              ],
              [
                20,
                0.15
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 15
        },
        "paint": {
          "text-color": {
            "stops": [
              [
                9,
                "#5a3514"
              ],
              [
                11,
                "#5a3514"
              ]
            ]
          },
          "text-halo-width": 1,
          "text-halo-color": "#EBE7E2",
          "text-halo-blur": 1
        }
      },
      {
        "id": "Neighborhood",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Neighborhood",
        "minzoom": 14,
        "maxzoom": 17,
        "layout": {
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                10,
                10
              ],
              [
                16,
                14
              ]
            ]
          },
          "text-letter-spacing": 0.08,
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 1
        },
        "paint": {
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "City large scale/town small",
        "type": "symbol",
        "source": "esri",
        "source-layer": "City large scale",
        "filter": [
          "==",
          "_label_class",
          5
        ],
        "minzoom": 10,
        "maxzoom": 17,
        "layout": {
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                10,
                11
              ],
              [
                16,
                15
              ]
            ]
          },
          "text-letter-spacing": 0.08,
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 15
        },
        "paint": {
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "City large scale/town large",
        "type": "symbol",
        "source": "esri",
        "source-layer": "City large scale",
        "filter": [
          "==",
          "_label_class",
          4
        ],
        "minzoom": 10,
        "maxzoom": 17,
        "layout": {
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": {
            "stops": [
              [
                10,
                11
              ],
              [
                16,
                17
              ]
            ]
          },
          "text-letter-spacing": 0.09,
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 1
        },
        "paint": {
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "City large scale/small",
        "type": "symbol",
        "source": "esri",
        "source-layer": "City large scale",
        "filter": [
          "==",
          "_label_class",
          3
        ],
        "minzoom": 10,
        "maxzoom": 17,
        "layout": {
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-letter-spacing": 0.1,
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 1,
          "text-size": {
            "stops": [
              [
                10,
                12
              ],
              [
                16,
                18
              ]
            ]
          }
        },
        "paint": {
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "City large scale/medium",
        "type": "symbol",
        "source": "esri",
        "source-layer": "City large scale",
        "filter": [
          "==",
          "_label_class",
          2
        ],
        "minzoom": 10,
        "maxzoom": 17,
        "layout": {
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-letter-spacing": 0.1,
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 1,
          "text-size": {
            "stops": [
              [
                10,
                13
              ],
              [
                16,
                20
              ]
            ]
          }
        },
        "paint": {
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "City large scale/large",
        "type": "symbol",
        "source": "esri",
        "source-layer": "City large scale",
        "filter": [
          "==",
          "_label_class",
          1
        ],
        "minzoom": 10,
        "maxzoom": 17,
        "layout": {
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-letter-spacing": 0.1,
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 1,
          "text-size": {
            "stops": [
              [
                10,
                14
              ],
              [
                16,
                26
              ]
            ]
          }
        },
        "paint": {
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "City large scale/x large",
        "type": "symbol",
        "source": "esri",
        "source-layer": "City large scale",
        "filter": [
          "==",
          "_label_class",
          0
        ],
        "minzoom": 10,
        "maxzoom": 17,
        "layout": {
          "symbol-avoid-edges": true,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-letter-spacing": 0.1,
          "text-max-width": 8,
          "text-field": "{_name_global}",
          "text-padding": 1,
          "text-size": {
            "stops": [
              [
                10,
                14.5
              ],
              [
                16,
                31
              ]
            ]
          }
        },
        "paint": {
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "City small scale/town small non capital",
        "type": "symbol",
        "source": "esri",
        "source-layer": "City small scale",
        "filter": [
          "==",
          "_symbol",
          17
        ],
        "minzoom": 3,
        "maxzoom": 10,
        "layout": {
          "symbol-avoid-edges": true,
          "icon-image": "City small scale",
          "icon-padding": 1,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 11,
          "text-anchor": "bottom-left",
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "text-offset": [
            0.2,
            0.1
          ],
          "text-justify": "left"
        },
        "paint": {
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "City small scale/town large non capital",
        "type": "symbol",
        "source": "esri",
        "source-layer": "City small scale",
        "filter": [
          "==",
          "_symbol",
          15
        ],
        "minzoom": 3,
        "maxzoom": 10,
        "layout": {
          "symbol-avoid-edges": true,
          "icon-image": "City small scale",
          "icon-padding": 1,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 11,
          "text-anchor": "bottom-left",
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "text-offset": [
            0.2,
            0.1
          ],
          "text-justify": "left"
        },
        "paint": {
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "City small scale/small non capital",
        "type": "symbol",
        "source": "esri",
        "source-layer": "City small scale",
        "filter": [
          "==",
          "_symbol",
          12
        ],
        "minzoom": 3,
        "maxzoom": 10,
        "layout": {
          "symbol-avoid-edges": true,
          "icon-image": "City small scale",
          "icon-padding": 1,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 11.5,
          "text-anchor": "bottom-left",
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "text-offset": [
            0.2,
            0.1
          ],
          "text-justify": "left"
        },
        "paint": {
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "City small scale/medium non capital",
        "type": "symbol",
        "source": "esri",
        "source-layer": "City small scale",
        "filter": [
          "==",
          "_symbol",
          9
        ],
        "minzoom": 3,
        "maxzoom": 10,
        "layout": {
          "symbol-avoid-edges": true,
          "icon-image": "City small scale",
          "icon-padding": 1,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-anchor": "bottom-left",
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "text-offset": [
            0.2,
            0.1
          ],
          "text-justify": "left",
          "text-size": {
            "stops": [
              [
                4,
                12.3
              ],
              [
                6,
                12.3
              ],
              [
                8,
                13
              ]
            ]
          }
        },
        "paint": {
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "City small scale/other capital",
        "type": "symbol",
        "source": "esri",
        "source-layer": "City small scale",
        "filter": [
          "==",
          "_symbol",
          18
        ],
        "minzoom": 3,
        "maxzoom": 10,
        "layout": {
          "symbol-avoid-edges": true,
          "icon-image": "City small scale",
          "icon-padding": 1,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 11.5,
          "text-anchor": "bottom-left",
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "text-offset": [
            0.2,
            0.1
          ],
          "text-justify": "left"
        },
        "paint": {
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "City small scale/town large other capital",
        "type": "symbol",
        "source": "esri",
        "source-layer": "City small scale",
        "filter": [
          "==",
          "_symbol",
          14
        ],
        "minzoom": 3,
        "maxzoom": 10,
        "layout": {
          "symbol-avoid-edges": true,
          "icon-image": "City small scale",
          "icon-padding": 1,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 11.5,
          "text-anchor": "bottom-left",
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "text-offset": [
            0.2,
            0.1
          ],
          "text-justify": "left"
        },
        "paint": {
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "City small scale/small other capital",
        "type": "symbol",
        "source": "esri",
        "source-layer": "City small scale",
        "filter": [
          "==",
          "_symbol",
          11
        ],
        "minzoom": 3,
        "maxzoom": 10,
        "layout": {
          "symbol-avoid-edges": true,
          "icon-image": "City small scale",
          "icon-padding": 1,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-size": 11.5,
          "text-anchor": "bottom-left",
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "text-offset": [
            0.2,
            0.1
          ],
          "text-justify": "left"
        },
        "paint": {
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "City small scale/medium other capital",
        "type": "symbol",
        "source": "esri",
        "source-layer": "City small scale",
        "filter": [
          "==",
          "_symbol",
          8
        ],
        "minzoom": 3,
        "maxzoom": 10,
        "layout": {
          "symbol-avoid-edges": true,
          "icon-image": "City small scale",
          "icon-padding": 1,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-anchor": "bottom-left",
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "text-offset": [
            0.2,
            0.1
          ],
          "text-justify": "left",
          "text-size": {
            "stops": [
              [
                4,
                12.3
              ],
              [
                6,
                12.3
              ],
              [
                8,
                13
              ]
            ]
          }
        },
        "paint": {
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Admin0 point/x small",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Admin0 point",
        "filter": [
          "==",
          "_label_class",
          5
        ],
        "minzoom": 5,
        "maxzoom": 10,
        "layout": {
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "symbol-avoid-edges": true,
          "text-letter-spacing": {
            "stops": [
              [
                5,
                0.13
              ],
              [
                8,
                0.5
              ]
            ]
          },
          "text-size": {
            "stops": [
              [
                5,
                13
              ],
              [
                10,
                18
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#0f010f",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Admin0 point/small",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Admin0 point",
        "filter": [
          "==",
          "_label_class",
          4
        ],
        "minzoom": 4,
        "maxzoom": 10,
        "layout": {
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "symbol-avoid-edges": true,
          "text-letter-spacing": {
            "stops": [
              [
                4,
                0.13
              ],
              [
                8,
                0.5
              ]
            ]
          },
          "text-size": {
            "stops": [
              [
                4,
                13
              ],
              [
                10,
                18
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#0f010f",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Admin0 point/medium",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Admin0 point",
        "filter": [
          "==",
          "_label_class",
          3
        ],
        "minzoom": 2,
        "maxzoom": 10,
        "layout": {
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "symbol-avoid-edges": true,
          "text-letter-spacing": {
            "stops": [
              [
                2,
                0.13
              ],
              [
                8,
                0.5
              ]
            ]
          },
          "text-size": {
            "stops": [
              [
                2,
                10
              ],
              [
                4,
                14
              ],
              [
                10,
                22
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#0f010f",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Admin0 point/large",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Admin0 point",
        "filter": [
          "==",
          "_label_class",
          2
        ],
        "minzoom": 2,
        "maxzoom": 10,
        "layout": {
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "symbol-avoid-edges": true,
          "text-letter-spacing": {
            "stops": [
              [
                2,
                0.13
              ],
              [
                8,
                0.5
              ]
            ]
          },
          "text-size": {
            "stops": [
              [
                2,
                11
              ],
              [
                4,
                14
              ],
              [
                6,
                22
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#0f010f",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Admin0 point/x large",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Admin0 point",
        "filter": [
          "==",
          "_label_class",
          1
        ],
        "minzoom": 2,
        "maxzoom": 8,
        "layout": {
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-line-height": 1.5,
          "text-letter-spacing": {
            "stops": [
              [
                2,
                0.15
              ],
              [
                6,
                0.5
              ]
            ]
          },
          "text-size": {
            "stops": [
              [
                2,
                11.5
              ],
              [
                4,
                15
              ],
              [
                6,
                23
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#0f010f",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "City small scale/town small admin0 capital",
        "type": "symbol",
        "source": "esri",
        "source-layer": "City small scale",
        "filter": [
          "==",
          "_symbol",
          16
        ],
        "minzoom": 3,
        "maxzoom": 10,
        "layout": {
          "symbol-avoid-edges": true,
          "icon-image": "City small scale",
          "icon-padding": 1,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-anchor": "bottom-left",
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "text-offset": [
            0.2,
            0.1
          ],
          "text-justify": "left",
          "text-size": {
            "stops": [
              [
                4,
                12.3
              ],
              [
                6,
                13.5
              ],
              [
                8,
                14.3
              ]
            ]
          }
        },
        "paint": {
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "City small scale/town large admin0 capital",
        "type": "symbol",
        "source": "esri",
        "source-layer": "City small scale",
        "filter": [
          "==",
          "_symbol",
          13
        ],
        "minzoom": 3,
        "maxzoom": 10,
        "layout": {
          "symbol-avoid-edges": true,
          "icon-image": "City small scale",
          "icon-padding": 1,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-anchor": "bottom-left",
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "text-offset": [
            0.2,
            0.1
          ],
          "text-justify": "left",
          "text-size": {
            "stops": [
              [
                4,
                12.3
              ],
              [
                6,
                13.5
              ],
              [
                8,
                14.3
              ]
            ]
          }
        },
        "paint": {
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "City small scale/small admin0 capital",
        "type": "symbol",
        "source": "esri",
        "source-layer": "City small scale",
        "filter": [
          "==",
          "_symbol",
          10
        ],
        "minzoom": 3,
        "maxzoom": 10,
        "layout": {
          "symbol-avoid-edges": true,
          "icon-image": "City small scale",
          "icon-padding": 1,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-anchor": "bottom-left",
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "text-offset": [
            0.2,
            0.1
          ],
          "text-justify": "left",
          "text-size": {
            "stops": [
              [
                4,
                12.3
              ],
              [
                6,
                13.5
              ],
              [
                8,
                14.3
              ]
            ]
          }
        },
        "paint": {
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "City small scale/medium admin0 capital",
        "type": "symbol",
        "source": "esri",
        "source-layer": "City small scale",
        "filter": [
          "==",
          "_symbol",
          7
        ],
        "minzoom": 3,
        "maxzoom": 10,
        "layout": {
          "symbol-avoid-edges": true,
          "icon-image": "City small scale",
          "icon-padding": 1,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-anchor": "bottom-left",
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "text-offset": [
            0.2,
            0.1
          ],
          "text-justify": "left",
          "text-size": {
            "stops": [
              [
                4,
                12.3
              ],
              [
                6,
                13.5
              ],
              [
                8,
                14.3
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#343434",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "City small scale/large other capital",
        "type": "symbol",
        "source": "esri",
        "source-layer": "City small scale",
        "filter": [
          "==",
          "_symbol",
          5
        ],
        "minzoom": 3,
        "maxzoom": 10,
        "layout": {
          "symbol-avoid-edges": true,
          "icon-image": "City small scale",
          "icon-padding": 1,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-anchor": "bottom-left",
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "text-offset": [
            0.2,
            0.1
          ],
          "text-justify": "left",
          "text-size": {
            "stops": [
              [
                4,
                12.3
              ],
              [
                6,
                12.3
              ],
              [
                8,
                13
              ]
            ]
          }
        },
        "paint": {
          "text-color": {
            "stops": [
              [
                2,
                "#343434"
              ],
              [
                3,
                "#000000"
              ]
            ]
          },
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "City small scale/x large admin2 capital",
        "type": "symbol",
        "source": "esri",
        "source-layer": "City small scale",
        "filter": [
          "==",
          "_symbol",
          2
        ],
        "minzoom": 3,
        "maxzoom": 10,
        "layout": {
          "symbol-avoid-edges": true,
          "icon-image": "City small scale",
          "icon-padding": 1,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-anchor": "bottom-left",
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "text-offset": [
            0.2,
            0.1
          ],
          "text-justify": "left",
          "text-size": {
            "stops": [
              [
                4,
                12.3
              ],
              [
                6,
                13.5
              ],
              [
                8,
                14.3
              ]
            ]
          }
        },
        "paint": {
          "text-color": {
            "stops": [
              [
                2,
                "#343434"
              ],
              [
                3,
                "#000000"
              ]
            ]
          },
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "City small scale/large non capital",
        "type": "symbol",
        "source": "esri",
        "source-layer": "City small scale",
        "filter": [
          "==",
          "_symbol",
          6
        ],
        "minzoom": 3,
        "maxzoom": 10,
        "layout": {
          "symbol-avoid-edges": true,
          "icon-image": "City small scale",
          "icon-padding": 1,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-anchor": "bottom-left",
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "text-offset": [
            0.2,
            0.1
          ],
          "text-justify": "left",
          "text-size": {
            "stops": [
              [
                4,
                12.3
              ],
              [
                6,
                12.3
              ],
              [
                8,
                13
              ]
            ]
          }
        },
        "paint": {
          "text-color": {
            "stops": [
              [
                2,
                "#343434"
              ],
              [
                3,
                "#000000"
              ]
            ]
          },
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "City small scale/large admin0 capital",
        "type": "symbol",
        "source": "esri",
        "source-layer": "City small scale",
        "filter": [
          "==",
          "_symbol",
          4
        ],
        "minzoom": 3,
        "maxzoom": 10,
        "layout": {
          "symbol-avoid-edges": true,
          "icon-image": "City small scale",
          "icon-padding": 1,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-anchor": "bottom-left",
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "text-offset": [
            0.2,
            0.1
          ],
          "text-justify": "left",
          "text-size": {
            "stops": [
              [
                4,
                12.3
              ],
              [
                6,
                13.5
              ],
              [
                8,
                14.3
              ]
            ]
          }
        },
        "paint": {
          "text-color": {
            "stops": [
              [
                2,
                "#2d2d2d"
              ],
              [
                3,
                "#000000"
              ]
            ]
          },
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "City small scale/x large non capital",
        "type": "symbol",
        "source": "esri",
        "source-layer": "City small scale",
        "filter": [
          "==",
          "_symbol",
          3
        ],
        "minzoom": 3,
        "maxzoom": 10,
        "layout": {
          "symbol-avoid-edges": true,
          "icon-image": "City small scale",
          "icon-padding": 1,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-anchor": "bottom-left",
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "text-offset": [
            0.2,
            0.1
          ],
          "text-justify": "left",
          "text-size": {
            "stops": [
              [
                4,
                12.3
              ],
              [
                6,
                13.5
              ],
              [
                8,
                14.3
              ]
            ]
          }
        },
        "paint": {
          "text-color": {
            "stops": [
              [
                2,
                "#343434"
              ],
              [
                3,
                "#000000"
              ]
            ]
          },
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "City small scale/x large admin1 capital",
        "type": "symbol",
        "source": "esri",
        "source-layer": "City small scale",
        "filter": [
          "==",
          "_symbol",
          1
        ],
        "minzoom": 3,
        "maxzoom": 10,
        "layout": {
          "symbol-avoid-edges": true,
          "icon-image": "City small scale",
          "icon-padding": 1,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-anchor": "bottom-left",
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "text-offset": [
            0.2,
            0.1
          ],
          "text-justify": "left",
          "text-size": {
            "stops": [
              [
                4,
                12.3
              ],
              [
                6,
                13.5
              ],
              [
                8,
                14.3
              ]
            ]
          }
        },
        "paint": {
          "text-color": {
            "stops": [
              [
                2,
                "#343434"
              ],
              [
                3,
                "#000000"
              ]
            ]
          },
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "City small scale/x large admin0 capital",
        "type": "symbol",
        "source": "esri",
        "source-layer": "City small scale",
        "filter": [
          "==",
          "_symbol",
          0
        ],
        "minzoom": 3,
        "maxzoom": 10,
        "layout": {
          "symbol-avoid-edges": true,
          "icon-image": "City small scale",
          "icon-padding": 1,
          "text-font": [
            "Montserrat SemiBold"
          ],
          "text-anchor": "bottom-left",
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "text-offset": [
            0.2,
            0.1
          ],
          "text-justify": "left",
          "text-size": {
            "stops": [
              [
                4,
                12.3
              ],
              [
                6,
                13.5
              ],
              [
                8,
                14.3
              ]
            ]
          }
        },
        "paint": {
          "text-color": {
            "stops": [
              [
                2,
                "#2d2d2d"
              ],
              [
                3,
                "#000000"
              ]
            ]
          },
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Admin0 point/2x large",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Admin0 point",
        "filter": [
          "==",
          "_label_class",
          0
        ],
        "minzoom": 2,
        "maxzoom": 6,
        "layout": {
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1,
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-line-height": 1.7,
          "text-letter-spacing": {
            "stops": [
              [
                2,
                0.3
              ],
              [
                5,
                0.5
              ]
            ]
          },
          "text-size": {
            "stops": [
              [
                2,
                14
              ],
              [
                4,
                22.5
              ],
              [
                5,
                28
              ]
            ]
          }
        },
        "paint": {
          "text-color": "#0f010f",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Continent",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Continent",
        "maxzoom": 2,
        "layout": {
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": {
            "stops": [
              [
                0,
                8.3
              ],
              [
                1,
                10.3
              ]
            ]
          },
          "text-letter-spacing": 0.35,
          "text-max-width": 8,
          "text-line-height": 1.75,
          "text-field": "{_name_global}",
          "text-padding": 1,
          "text-transform": "uppercase"
        },
        "paint": {
          "text-color": "#363636",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "Disputed label point/Island",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Disputed label point",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            1
          ],
          [
            "in",
            "DisputeID",
            0
          ]
        ],
        "minzoom": 6,
        "layout": {
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-size": {
            "stops": [
              [
                6,
                7
              ],
              [
                15,
                10
              ]
            ]
          },
          "text-letter-spacing": 0.13,
          "text-line-height": 1.5,
          "text-max-width": 4,
          "text-field": "{_name}",
          "text-padding": 1
        },
        "paint": {
          "text-color": "#595959",
          "text-halo-blur": 1,
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1
        }
      },
      {
        "id": "Disputed label point/Waterbody",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Disputed label point",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            0
          ],
          [
            "in",
            "DisputeID",
            1006
          ]
        ],
        "minzoom": 2,
        "maxzoom": 10,
        "layout": {
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Demi Italic"
          ],
          "text-size": {
            "stops": [
              [
                2,
                8
              ],
              [
                6,
                9.3
              ]
            ]
          },
          "text-letter-spacing": 0.1,
          "text-max-width": 6,
          "text-field": "{_name}",
          "text-padding": 1
        },
        "paint": {
          "text-color": {
            "stops": [
              [
                1,
                "#0d6c9a"
              ],
              [
                6,
                "#0d6c9a"
              ]
            ]
          },
          "text-halo-blur": 1,
          "text-halo-color": "#82CFF5",
          "text-halo-width": 0.5
        }
      },
      {
        "id": "Disputed label point/Admin0",
        "type": "symbol",
        "source": "esri",
        "source-layer": "Disputed label point",
        "filter": [
          "all",
          [
            "==",
            "_label_class",
            2
          ],
          [
            "in",
            "DisputeID",
            1021
          ]
        ],
        "minzoom": 2,
        "layout": {
          "symbol-avoid-edges": true,
          "text-font": [
            "Avenir Next LT Pro Bold"
          ],
          "text-size": {
            "stops": [
              [
                2,
                10
              ],
              [
                4,
                14
              ],
              [
                10,
                22
              ]
            ]
          },
          "text-letter-spacing": {
            "stops": [
              [
                2,
                0.13
              ],
              [
                8,
                0.5
              ]
            ]
          },
          "text-max-width": 8,
          "text-field": "{_name}",
          "text-padding": 1
        },
        "paint": {
          "text-color": "#1f1d1f",
          "text-halo-color": "#EBE7E2",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      },
      {
        "id": "parcel-line",
        "type": "line",
        "source": "baseunits",
        "source-layer": "parcels",
        "minzoom": 11,
        "layout": {
          "visibility": "visible"
        },
        "paint": {
          "line-color": {
            "stops": [
              [14, "#ccc"],
              [17, "#bbb"],
              [17.1, "#aaa"],
              [18, "#555"]
            ]
          },
          "line-width": {
            "base": 1,
            "stops": [
              [12, 0.1],
              [14, 0.75],
              [17, 1.5],
              [20, 4]
            ]
          },
          "line-opacity": {
            "base": 1,
            "stops": [
              [14, 0],
              [14.1, 0.5],
              [22, 1]
            ]
          }
        }
      },
      {
        "id": "parcel-highlight",
        "type": "line",
        "source": "baseunits",
        "source-layer": "parcels",
        "minzoom": 11,
        "filter": ["==", "parcelno", ""],
        "layout": {
          "visibility": "visible"
        },
        "paint": {
          "line-color": layers['parcels'].color,
          "line-width": {
            "base": 1,
            "stops": [
              [12, 0.5],
              [14, 2],
              [15, 3],
              [22, 10]
            ]
          },
          "line-opacity": {
            "base": 1,
            "stops": [
              [12, 0],
              [12.1, 0.1],
              [12.5, 1],
              [22, 1]
            ]
          }
        }
      },
      {
        "id": "building-fill",
        "type": "fill",
        "source": "baseunits",
        "source-layer": "buildings",
        "interactive": true,
        "minzoom": 12,
        "layout": {
          "visibility": "visible"
        },
        "paint": {
          "fill-color": {
            "stops": [
              [14, "#aaa"],
              [19, "#bbb"]
            ]
          },
          "fill-opacity": {
            "stops": [
              [14, 0.1],
              [19, 0.5]
            ]
          }
        }
      },
      {
        "id": "building-linked",
        "type": "fill",
        "source": "baseunits",
        "source-layer": "buildings",
        "minzoom": 11,
        "filter": ["==", "id", ""],
        "layout": {
          "visibility": "visible"
        },
        "paint": {
          "fill-color": layers['buildings'].color,
          "fill-opacity": {
            "base": 1,
            "stops": [
              [12, 0],
              [12.1, 0.1],
              [12.5, 0.25],
              [22, 0.25]
            ]
          }
        }
      },
      {
        "id": "building-highlight",
        "type": "line",
        "source": "baseunits",
        "source-layer": "buildings",
        "minzoom": 11,
        "filter": ["==", "id", ""],
        "layout": {
          "visibility": "visible"
        },
        "paint": {
          "line-color": layers['buildings'].color,
          "line-width": {
            "base": 1,
            "stops": [
              [11.5, 0.1],
              [13.5, 0.75],
              [14, 1.5],
              [21, 6]
            ]
          },
          "line-opacity": {
            "base": 1,
            "stops": [
              [12, 0],
              [12.1, 0.1],
              [12.5, 1],
              [22, 1]
            ]
          }
        }
      },
      {
        "id": "address-highlight",
        "type": "circle",
        "source": "baseunits",
        "source-layer": "addresses",
        "minzoom": 11,
        "filter": ["==", "id", ""],
        "layout": {
          "visibility": "visible"
        },
        "paint": {
          "circle-radius": {
            "base": 1,
            "stops": [[12.5, 0.2], [13.5, 1], [16.5, 3], [19, 12]]
          },
          "circle-color": layers['addresses'].color,
          "circle-stroke-color": '#333',
          "circle-stroke-width": 1
        }
      },
      {
        "id": "address-linked",
        "type": "circle",
        "source": "baseunits",
        "source-layer": "addresses",
        "minzoom": 11,
        "filter": ["==", "id", ""],
        "layout": {
          "visibility": "visible"
        },
        "paint": {
          "circle-radius": {
            "base": 1,
            "stops": [[12.5, 0.2], [13.5, 1], [16.5, 3], [19, 12]]
          },
          "circle-color": layers['addresses'].color,
          "circle-stroke-color": '#333',
          "circle-stroke-width": 1
        }
      },
      {
        "id": "address-point",
        "type": "circle",
        "source": "baseunits",
        "source-layer": "addresses",
        "minzoom": 13,
        "layout": {
          "visibility": "none"
        },
        "paint": {
          "circle-radius": {
            "base": 1,
            "stops": [[13, 0.1], [14, 1], [17, 4], [19, 12]]
          },
          "circle-color": "#aaa"
        }
      },
      {
        "id": "mapillary-location",
        "type": "symbol",
        "source": "mapillary",
        "layout": {
          "icon-rotate": ["get", "bearing"],
          "icon-rotation-alignment": "map",
          "icon-image": "video"
        }
      },
      {
        'id': 'mapillary-images-highlight',
        'type': 'circle',
        'source': 'mly',
        'source-layer': 'image',
        "maxzoom": 22,
        "minzoom": 17,
        "filter": ["==", "id", true],
        "layout": {
          "visibility": "none"
        },
        "paint": {
          "circle-radius": {
            "base": 1,
            "stops": [[13, 0.15], [14, 1.5], [17, 5], [19, 15]]
          },
          "circle-color": "green"
        }
      },
      {
        'id': 'mapillary-images',
        'type': 'circle',
        'source': 'mly',
        'source-layer': 'image',
        "maxzoom": 22,
        "minzoom": 17,
        "filter": [
          "all",
          ["==", "is_pano", true],
          ["==", "organization_id", 518073312556755]
        ],
        "layout": {
          "visibility": "none"
        },
        "paint": {
          "circle-radius": {
            "base": 1,
            "stops": [[13, 0.1], [14, 1], [17, 4], [19, 12]]
          },
          "circle-color": "#aaa"
        }
      }
    ],
    "metadata": {
      "arcgisStyleUrl": "https://www.arcgis.com/sharing/rest/content/items/273bf8d5c8ac400183fc24e109d20bcf/resources/styles/root.json",
      "arcgisOriginalItemTitle": "Community"
    }
  }

// since this is a function and not an object, we'll have to call it in the map like so:
// satelliteStyle()
export const satelliteStyle = () => {

  // clone the baseStyle into a new object to we can make changes
  let satStyle = _.cloneDeep(baseStyle)

  // set the satellite layer, which is first, to visible
  satStyle.layers[0].layout.visibility = 'visible'
  satStyle.layers[1].layout.visibility = 'none'

  // run through the first 200 layers and turn them off if they're a fill
  // or if they're a road line layer
  // lazy hack for invisible'ing all the layers which are in the way of the satellite
  satStyle.layers.slice(0,200).forEach((l, i) => {
    if (l.type === 'fill' && l.id.indexOf("parcel") === -1) {
      satStyle.layers[i].layout['visibility'] = 'none'
    }
    if (l.type === 'line' && l.id.indexOf("Road") === 0) {
      satStyle.layers[i].layout['visibility'] = 'none'
    }
  })
  
  // return the object
  return satStyle;
}

export const linenStyle = () => {

  // clone the baseStyle into a new object to we can make changes
  let linenStyle = _.cloneDeep(baseStyle)

  // set the linenmap layer, which is second, to visible
  linenStyle.layers[0].layout.visibility = 'none'
  linenStyle.layers[1].layout.visibility = 'visible'

  // run through the first 200 layers and turn them off if they're a fill
  // or if they're a road line layer
  // lazy hack for invisible'ing all the layers which are in the way of the satellite
  linenStyle.layers.slice(0,200).forEach((l, i) => {
    if (l.type === 'fill' && l.id.indexOf("parcel") === -1) {
      linenStyle.layers[i].layout['visibility'] = 'none'
    }
    if (l.type === 'line' && l.id.indexOf("Road") === 0) {
      linenStyle.layers[i].layout['visibility'] = 'none'
    }
  })

  // return the object
  return linenStyle;
}