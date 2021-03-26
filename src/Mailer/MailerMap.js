import React, { useState, useEffect } from 'react';
import mapboxgl from "mapbox-gl";
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import bbox from '@turf/bbox';
import mapStyle from '../styles/mailerstyle.json';

const MailerMap = ({ geom, setGeom }) => {

  let [theMap, setTheMap] = useState(null);
  let [theDraw, setTheDraw] = useState(null);

  useEffect(() => {

    const detroitBbox = [-83.287803, 42.255192, -82.910451, 42.45023];

    var map = new mapboxgl.Map({
      container: "map",
      style: mapStyle,
      bounds: detroitBbox
    });

    let Draw = new MapboxDraw();
    setTheDraw(Draw);

    map.addControl(Draw, 'top-left');

    map.on("load", e => {
      setTheMap(map);
      map.resize();
    });

    map.on("draw.create", e => {
      let geometry = Draw.getAll();
      setGeom(geometry);
      console.log(geometry);
      if (geometry.features[0].geometry.type === 'Polygon') {
        map.fitBounds(bbox(geometry), { padding: 20 });
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
  }, []);

  useEffect(() => {
    if (theMap && theDraw && geom) {
      console.log(geom);
      if (geom.features[0].geometry.type !== 'Point') {
        theMap.fitBounds(bbox(geom), { padding: 40 });
      }
      theDraw.set(geom);
      theDraw.changeMode("simple_select");
    }
    if (theMap && theDraw && !geom) {
      theDraw.delete(theDraw.getAll().features[0].id);
    }
  }, [geom]);

  return (
    <div id="map" className="explorer-map" />
  );
};

export default MailerMap;