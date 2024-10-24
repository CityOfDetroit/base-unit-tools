import React, { useState, useEffect } from 'react';
import maplibregl from "maplibre-gl";
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import bbox from '@turf/bbox';
import {baseStyle} from '../styles/mapstyle.js';
import centroid from '@turf/centroid'
import { arcgisToGeoJSON } from '@terraformer/arcgis'

const MailerMap = ({ geom, setGeom, mode, setMode, features, filtered }) => {

  let [theMap, setTheMap] = useState(null);
  let [theDraw, setTheDraw] = useState(null);

  useEffect(() => {

    const detroitBbox = [-83.287803, 42.255192, -82.910451, 42.45023];

    var map = new maplibregl.Map({
      container: "map",
      style: baseStyle,
      bounds: detroitBbox
    });

    let Draw = new MapboxDraw({
      displayControlsDefault: false
    });
    setTheDraw(Draw);

    map.addControl(Draw, 'top-left');

    map.on("load", e => {
      setTheMap(map);
      map.resize();

      // fade in parcel line very faintly at z14
      map.setPaintProperty("parcel-line", "line-opacity", {
        "base": 1,
        "stops": [
          [14, 0],
          [14.1, 0.15]
        ]
      })

      // add a new empty source for the result-address data
      map.addSource("filtered", {
        type: 'geojson',
        data: {
          type: "FeatureCollection",
          features: []
        },
        cluster: true,
        clusterMaxZoom: 22,
        clusterRadius: 1,
        clusterMinPoints: 5
      })

      // new empty source for the result-address parcels
      map.addSource("filtered-parcels", {
        type: 'geojson',
        data: {
          type: "FeatureCollection",
          features: []
        }
      })

      // layer for result-address parcels
      map.addLayer({
        "id": "filtered-parcels",
        "source": "filtered-parcels",
        "type": "line"
      })

      // layer for result address
      map.addLayer({
        "id": "filtered-addresses-single",
        "source": "filtered",
        "type": "circle",
        "filter": ["!", ["has", "point_count"]],
        "paint": {
          "circle-radius": {
            "base": 1,
            "stops": [[10.5, 0.2], [13.5, 1], [16.5, 3], [19, 12]]
          },
          "circle-color": 'yellow',
          "circle-stroke-color": '#333',
          "circle-stroke-width": {
            "base": 1,
            "stops": [[10.5, 0.2], [13.5, 0.5], [16.5, 1], [19, 3]]
          },
        }
      })

      // layer for result address
      map.addLayer({
        "id": "filtered-addresses-cluster",
        "source": "filtered",
        "type": "circle",
        "filter": ["has", "point_count"],
        "paint": {
          "circle-radius": {
            "base": 1,
            "stops": [[10.5, 0.2], [13.5, 8], [16.5, 10], [19, 18]]
          },
          "circle-color": 'yellow',
          "circle-stroke-color": '#333',
          "circle-stroke-width": {
            "base": 1,
            "stops": [[10.5, 0.2], [13.5, 0.5], [16.5, 1], [19, 3]]
          },
        }
      })

      map.addLayer({
        "id": "clustered-address-labels",
        "source": "filtered",
        "type": "symbol",
        "filter": ["has", "point_count"],
        "layout": {
          'text-field': '{point_count_abbreviated}',
          'text-font': ["Avenir Next LT Pro Bold"],
          'text-size': 11
        }
      })
    });


    map.on("draw.create", e => {
      let geometry = Draw.getAll();
      setGeom(geometry);
      if (geometry.features[0].geometry.type === 'Polygon') {
        map.fitBounds(bbox(geometry), { padding: 20, maxZoom: 17 });
      }
    });

    map.on("draw.update", e => {
      setGeom(Draw.getAll());
    });

    map.on("draw.modechange", e => {
      if (Draw.getAll().features.length > 1 && e.mode.slice(0, 4) === 'draw') {
        Draw.delete(Draw.getAll().features[0].id);
      }
    });

  }, [setGeom]);

  useEffect(() => {
    if (theMap && theDraw && geom) {
      if (geom.features[0].geometry.type !== 'Point') {
        theMap.fitBounds(bbox(geom), { padding: 40, maxZoom: 17 });
      }
      else {
        let ctr = geom.features[0].geometry.coordinates
        theMap.easeTo({
          center: ctr,
          zoom: 17
        });
      }
      theDraw.set(geom);
      theDraw.changeMode("simple_select");
    }
    if (theMap && theDraw && !geom) {
      if (theDraw.getAll().features.length > 0) {
        theDraw.delete(theDraw.getAll().features[0].id);
      }
    }
  }, [geom, theDraw, theMap]);

  useEffect(() => {
    if (theMap && theDraw && mode) {
      theDraw.changeMode(mode)
    }
  }, [mode])

  useEffect(() => {
    if (theMap && features) {
      theMap.getSource("filtered").setData(features)
    }
  }, [features])

  useEffect(() => {
    if (theMap && filtered) {
      theMap.getSource("filtered-parcels").setData({ type: "FeatureCollection", features: filtered.map(f => arcgisToGeoJSON(f)) })
    }
  }, [filtered])

  return (
    <div id="map" style={{height: '50vh'}} />
  );
};

export default MailerMap;