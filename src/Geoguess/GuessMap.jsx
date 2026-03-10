import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { DETROIT_BOUNDS, DETROIT_CENTER, detroitBoundary } from './detroitBoundary';
import { baseStyle } from '../styles/mapstyle';
import { addMarkerImages } from './markerImages';

const EMPTY_FC = { type: 'FeatureCollection', features: [] };

const ROAD_LABEL_LAYERS = [
  'Roads/label/Local',
  'Roads/label/Arterial',
  'Roads/label/Arterial (+)',
  'Roads/label/Major Arterial',
  'Roads/label/State Route',
  'Roads/label/Interstate',
];

const GuessMap = ({ guess, onGuessChange, disabled = false, result = null, showLabels = false, round = 0, className = '' }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: baseStyle,
      center: DETROIT_CENTER,
      zoom: 10,
      minZoom: 9,
      maxZoom: 18,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    map.on('load', () => {
      addMarkerImages(map);

      map.addSource('detroit-boundary', {
        type: 'geojson',
        data: detroitBoundary,
      });
      map.addLayer({
        id: 'detroit-boundary-line',
        type: 'line',
        source: 'detroit-boundary',
        paint: { 'line-color': '#004445', 'line-width': 2, 'line-opacity': 0.7 },
      });

      // Result line
      map.addSource('result-line', { type: 'geojson', data: EMPTY_FC });
      map.addLayer({
        id: 'result-line-layer',
        type: 'line',
        source: 'result-line',
        paint: { 'line-color': '#666', 'line-width': 3, 'line-dasharray': [2, 2] },
      });

      // Actual marker (pin icon)
      map.addSource('actual-marker', { type: 'geojson', data: EMPTY_FC });
      map.addLayer({
        id: 'actual-marker-symbol',
        type: 'symbol',
        source: 'actual-marker',
        layout: { 'icon-image': 'actual-icon', 'icon-allow-overlap': true },
      });

      // Guess marker (? icon)
      map.addSource('guess-marker', { type: 'geojson', data: EMPTY_FC });
      map.addLayer({
        id: 'guess-marker-symbol',
        type: 'symbol',
        source: 'guess-marker',
        layout: { 'icon-image': 'guess-icon', 'icon-allow-overlap': true },
      });

      // Hide parcel and road label layers for the game
      ['parcel-fill', 'parcel-line', 'parcel-linked', 'parcel-highlight',
       'streets-line', 'streets-highlight', 'streets-linked'].forEach(id => {
        if (map.getLayer(id)) {
          map.setLayoutProperty(id, 'visibility', 'none');
        }
      });
      ROAD_LABEL_LAYERS.forEach(id => {
        if (map.getLayer(id)) {
          map.setLayoutProperty(id, 'visibility', 'none');
        }
      });

      setMapLoaded(true);
    });

    map.on('click', (e) => {
      if (disabled) return;
      onGuessChange([e.lngLat.lng, e.lngLat.lat]);
    });

    map.on('mousemove', () => {
      if (!disabled) map.getCanvas().style.cursor = 'crosshair';
    });

    mapRef.current = map;
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Reset map view to Detroit bounds on new round
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !round) return;
    mapRef.current.fitBounds(
      [[DETROIT_BOUNDS.minLng, DETROIT_BOUNDS.minLat], [DETROIT_BOUNDS.maxLng, DETROIT_BOUNDS.maxLat]],
      { padding: 10 }
    );
  }, [round, mapLoaded]);

  // Update guess marker
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const source = mapRef.current.getSource('guess-marker');
    if (!source) return;

    source.setData(guess ? {
      type: 'FeatureCollection',
      features: [{ type: 'Feature', geometry: { type: 'Point', coordinates: guess } }],
    } : EMPTY_FC);
  }, [guess, mapLoaded]);

  // Show result (actual point + line) and fit bounds
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    const lineSource = mapRef.current.getSource('result-line');
    const actualSource = mapRef.current.getSource('actual-marker');
    if (!lineSource || !actualSource) return;

    if (result) {
      lineSource.setData({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: [result.guessCoords, result.actualCoords] },
      });
      actualSource.setData({
        type: 'FeatureCollection',
        features: [{ type: 'Feature', geometry: { type: 'Point', coordinates: result.actualCoords } }],
      });

      const bounds = new maplibregl.LngLatBounds();
      bounds.extend(result.guessCoords);
      bounds.extend(result.actualCoords);
      mapRef.current.fitBounds(bounds, { padding: 80, maxZoom: 15 });
    } else {
      lineSource.setData(EMPTY_FC);
      actualSource.setData(EMPTY_FC);
    }
  }, [result, mapLoaded]);

  // Toggle road labels
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const vis = showLabels ? 'visible' : 'none';
    ROAD_LABEL_LAYERS.forEach(id => {
      if (mapRef.current.getLayer(id)) {
        mapRef.current.setLayoutProperty(id, 'visibility', vis);
      }
    });
  }, [showLabels, mapLoaded]);

  // Cursor
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.getCanvas().style.cursor = disabled ? 'default' : 'crosshair';
    }
  }, [disabled]);

  return (
    <div
      ref={mapContainerRef}
      className={`w-full h-full min-h-[200px] rounded-lg overflow-hidden ${className}`}
    />
  );
};

export default GuessMap;
