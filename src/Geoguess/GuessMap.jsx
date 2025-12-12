import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { DETROIT_CENTER, detroitBoundary } from './detroitBoundary';
import { baseStyle } from '../styles/mapstyle';

const GuessMap = ({ guess, onGuessChange, disabled = false, className = '' }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
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
      // Add Detroit boundary outline
      map.addSource('detroit-boundary', {
        type: 'geojson',
        data: detroitBoundary,
      });

      map.addLayer({
        id: 'detroit-boundary-line',
        type: 'line',
        source: 'detroit-boundary',
        paint: {
          'line-color': '#004445',
          'line-width': 2,
          'line-opacity': 0.7,
        },
      });

      // Add guess marker source
      map.addSource('guess-marker', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      map.addLayer({
        id: 'guess-marker-circle',
        type: 'circle',
        source: 'guess-marker',
        paint: {
          'circle-radius': 10,
          'circle-color': '#ff4444',
          'circle-stroke-width': 3,
          'circle-stroke-color': '#ffffff',
        },
      });

      setMapLoaded(true);
    });

    // Click handler for placing guess
    map.on('click', (e) => {
      if (disabled) return;

      const coords = [e.lngLat.lng, e.lngLat.lat];
      onGuessChange(coords);
    });

    // Change cursor on hover
    map.on('mousemove', () => {
      if (!disabled) {
        map.getCanvas().style.cursor = 'crosshair';
      }
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update guess marker when guess changes
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    const source = mapRef.current.getSource('guess-marker');
    if (!source) return;

    if (guess) {
      source.setData({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: guess,
            },
          },
        ],
      });
    } else {
      source.setData({
        type: 'FeatureCollection',
        features: [],
      });
    }
  }, [guess, mapLoaded]);

  // Update cursor based on disabled state
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
