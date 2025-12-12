import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Box, Button, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { ArrowRightIcon, CheckCircledIcon } from '@radix-ui/react-icons';
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
      // Add line connecting guess and actual
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

      // Add guess marker (red)
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
          'circle-radius': 12,
          'circle-color': '#ff4444',
          'circle-stroke-width': 3,
          'circle-stroke-color': '#ffffff',
        },
      });

      // Add actual location marker (green)
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
          'circle-radius': 12,
          'circle-color': '#279989',
          'circle-stroke-width': 3,
          'circle-stroke-color': '#ffffff',
        },
      });

      // Fit map to show both points
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

  const scorePercent = Math.round((result.score / maxScorePerRound) * 100);

  return (
    <Flex direction="column" className="h-[calc(100vh-60px)]">
      {/* Header */}
      <Flex
        justify="between"
        align="center"
        className="bg-white dark:bg-gray-800 px-4 py-3 shadow-sm"
      >
        <Text size="3" weight="bold" className="text-[#004445]">
          Round {round}/{totalRounds} Result
        </Text>

        <Text size="3" weight="bold">
          Total: {totalScore.toLocaleString()}
        </Text>
      </Flex>

      {/* Main content */}
      <Flex className="flex-1 min-h-0 p-2 gap-2" direction={{ initial: 'column', md: 'row' }}>
        {/* Map - shows guess vs actual */}
        <Box className="flex-1 min-h-[300px] md:min-h-0">
          <div ref={mapContainerRef} className="w-full h-full rounded-lg overflow-hidden" />
        </Box>

        {/* Score card */}
        <Card className="md:w-[300px]">
          <Flex direction="column" gap="4" className="h-full" justify="center">
            <Flex direction="column" align="center" gap="2">
              <CheckCircledIcon
                width="48"
                height="48"
                color={result.score > maxScorePerRound * 0.6 ? '#279989' : '#666'}
              />

              <Heading size="7" className="text-[#004445]">
                {result.score.toLocaleString()}
              </Heading>

              <Text size="2" color="gray">
                points ({scorePercent}%)
              </Text>
            </Flex>

            <Flex direction="column" gap="2" className="text-center">
              <Text size="2" color="gray">
                Your guess was
              </Text>
              <Text size="4" weight="bold">
                {formatDistance(result.distance)}
              </Text>
              <Text size="2" color="gray">
                from the actual location
              </Text>
            </Flex>

            {/* Legend */}
            <Flex direction="column" gap="1" className="mt-2">
              <Flex align="center" gap="2">
                <div className="w-4 h-4 rounded-full bg-[#279989] border-2 border-white shadow" />
                <Text size="2">Actual location</Text>
              </Flex>
              <Flex align="center" gap="2">
                <div className="w-4 h-4 rounded-full bg-[#ff4444] border-2 border-white shadow" />
                <Text size="2">Your guess</Text>
              </Flex>
            </Flex>

            <Button
              size="3"
              onClick={onNext}
              className="w-full cursor-pointer mt-4"
              style={{ backgroundColor: '#004445' }}
            >
              {isLastRound ? 'See Final Results' : 'Next Round'}
              <ArrowRightIcon />
            </Button>
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
};

export default RoundResult;
