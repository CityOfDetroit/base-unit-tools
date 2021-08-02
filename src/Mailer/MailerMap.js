import React, { useState, useEffect } from 'react';
import mapboxgl from "mapbox-gl";
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import bbox from '@turf/bbox';
import mapStyle from '../styles/mailerstyle.json';
import centroid from '@turf/centroid'
import {arcgisToGeoJSON} from '@esri/arcgis-to-geojson-utils'

const MailerMap = ({ geom, setGeom, mode, setMode, features, filtered }) => {

  let [theMap, setTheMap] = useState(null);
  let [theDraw, setTheDraw] = useState(null);

  useEffect(() => {

    const detroitBbox = [-83.287803, 42.255192, -82.910451, 42.45023];

    var map = new mapboxgl.Map({
      container: "map",
      style: mapStyle,
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
      map.addSource("filtered", {
        type: 'geojson',
        data: {
          type: "FeatureCollection",
          features: []
        }
      })

      map.addSource("filtered-parcels", {
        type: 'geojson',
        data: {
          type: "FeatureCollection",
          features: []
        }   
      })

      map.addLayer({
        "id": "filtered-parcels",
        "source": "filtered-parcels",
        "type": "line"
      })

      map.addLayer({
        "id": "filtered-addresses",
        "source": "filtered",
        "type": "circle",
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
      if(theDraw.getAll().features.length > 0) {
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
    if(theMap && features) {
      theMap.getSource("filtered").setData(features)
    }
  }, [features])

  useEffect(() => {
    if(theMap && filtered) {
      theMap.getSource("filtered-parcels").setData({type: "FeatureCollection", features: filtered.map(f => arcgisToGeoJSON(f))})
    }
  }, [filtered])

  return (
    <div id="map" className="mailer-map" />
  );
};

export default MailerMap;