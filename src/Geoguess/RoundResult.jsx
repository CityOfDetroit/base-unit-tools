import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Box, Button, Flex, Text } from '@radix-ui/themes';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { DETROIT_CENTER } from './detroitBoundary';
import { baseStyle } from '../styles/mapstyle';

// Format distance for display (imperial units)
function formatDistance(meters) {
  const feet = meters * 3.28084;
  if (feet < 5280) {
    return `${Math.round(feet)} feet`;
  }
  const miles = feet / 5280;
  return `${miles.toFixed(2)} miles`;
}

const RoundResult = ({
  result,
  round,
  totalRounds,
  totalScore,
  maxScorePerRound,
  onNext,
  isLastRound,
}) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map and show results
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Calculate bounds to fit both points
    const bounds = new maplibregl.LngLatBounds();
    bounds.extend(result.guessCoords);
    bounds.extend(result.actualCoords);

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: baseStyle,
      center: DETROIT_CENTER,
      zoom: 11,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    map.on('load', () => {
      map.addSource('result-line', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [result.guessCoords, result.actualCoords],
          },
        },
      });

      map.addLayer({
        id: 'result-line-layer',
        type: 'line',
        source: 'result-line',
        paint: {
          'line-color': '#666666',
          'line-width': 3,
          'line-dasharray': [2, 2],
        },
      });

      map.addSource('guess-point', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: result.guessCoords,
          },
        },
      });

      map.addLayer({
        id: 'guess-point-layer',
        type: 'circle',
        source: 'guess-point',
        paint: {
          'circle-radius': 10,
          'circle-color': '#ff4444',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });

      map.addSource('actual-point', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: result.actualCoords,
          },
        },
      });

      map.addLayer({
        id: 'actual-point-layer',
        type: 'circle',
        source: 'actual-point',
        paint: {
          'circle-radius': 10,
          'circle-color': '#279989',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });

      map.fitBounds(bounds, {
        padding: 80,
        maxZoom: 15,
      });

      setMapLoaded(true);
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [result]);

  return (
    <Flex direction="column" className="h-[calc(100vh-60px)]">
      {/* Header */}
      <Flex
        justify="between"
        align="center"
        className="px-4 py-2 border-b border-gray-200 dark:border-gray-700"
      >
        <Flex gap="3" align="center">
          <Text size="2" weight="bold" className="text-[#004445]">
            {round}/{totalRounds}
          </Text>
          <Text size="2">
            <Text weight="bold">{result.score.toLocaleString()}</Text>
            <Text color="gray"> pts — {formatDistance(result.distance)} off</Text>
          </Text>
          {result.steps > 0 && (
            <Text size="1" color="orange">
              {result.steps} step{result.steps !== 1 ? 's' : ''} (-{result.penalty})
            </Text>
          )}
        </Flex>

        <Flex gap="3" align="center">
          <Text size="2" color="gray">
            Total: {totalScore.toLocaleString()}
          </Text>
          <Button
            size="2"
            onClick={onNext}
            className="cursor-pointer"
            style={{ backgroundColor: '#004445' }}
          >
            {isLastRound ? 'Results' : 'Next'}
            <ArrowRightIcon />
          </Button>
        </Flex>
      </Flex>

      {/* Map */}
      <Box className="flex-1 min-h-0 p-2">
        <div ref={mapContainerRef} className="w-full h-full rounded-lg overflow-hidden" />
      </Box>

      {/* Legend */}
      <Flex gap="4" justify="center" className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
        <Flex align="center" gap="1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#279989]" />
          <Text size="1" color="gray">Actual</Text>
        </Flex>
        <Flex align="center" gap="1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff4444]" />
          <Text size="1" color="gray">Guess</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default RoundResult;
