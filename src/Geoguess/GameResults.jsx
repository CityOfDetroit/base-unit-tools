import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Box, Button, Card, Flex, Heading, Table, Text } from '@radix-ui/themes';
import { CheckIcon, CopyIcon, ResetIcon, Share1Icon } from '@radix-ui/react-icons';
import { DETROIT_CENTER, detroitBoundary } from './detroitBoundary';
import { baseStyle } from '../styles/mapstyle';

// Format distance for display (imperial units)
function formatDistance(meters) {
  const feet = meters * 3.28084;
  if (feet < 5280) {
    return `${Math.round(feet)}ft`;
  }
  const miles = feet / 5280;
  return `${miles.toFixed(1)}mi`;
}

const MAX_SCORE_PER_ROUND = 5000;

// Get color based on score percentage (matches share emoji colors)
function getScoreColor(score) {
  const pct = score / MAX_SCORE_PER_ROUND;
  if (pct >= 0.9) return '#22c55e'; // green
  if (pct >= 0.7) return '#eab308'; // yellow
  if (pct >= 0.4) return '#f97316'; // orange
  return '#ef4444'; // red
}

const GameResults = ({ guesses, totalScore, maxTotalScore, onPlayAgain, mode, shareText }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (!shareText) return;

    // Try native share first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
        return;
      } catch (err) {
        // User cancelled or share failed, fall back to clipboard
      }
    }

    // Fall back to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Calculate stats
  const totalDistance = guesses.reduce((sum, g) => sum + g.distance, 0);
  const avgDistance = totalDistance / guesses.length;
  const bestRound = guesses.reduce((best, g) => (g.score > best.score ? g : best), guesses[0]);
  const scorePercent = Math.round((totalScore / maxTotalScore) * 100);

  // Initialize map with all results
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: baseStyle,
      center: DETROIT_CENTER,
      zoom: 10,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    map.on('load', () => {
      // Add Detroit boundary
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
          'line-opacity': 0.5,
        },
      });

      // Add all result lines
      const lines = guesses.map((g) => ({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [g.guessCoords, g.actualCoords],
        },
      }));

      map.addSource('result-lines', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: lines,
        },
      });

      map.addLayer({
        id: 'result-lines-layer',
        type: 'line',
        source: 'result-lines',
        paint: {
          'line-color': '#666666',
          'line-width': 2,
          'line-dasharray': [2, 2],
        },
      });

      // Add all guess points (red)
      const guessPoints = guesses.map((g, i) => ({
        type: 'Feature',
        properties: { round: i + 1 },
        geometry: {
          type: 'Point',
          coordinates: g.guessCoords,
        },
      }));

      map.addSource('guess-points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: guessPoints,
        },
      });

      map.addLayer({
        id: 'guess-points-layer',
        type: 'circle',
        source: 'guess-points',
        paint: {
          'circle-radius': 8,
          'circle-color': '#ff4444',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });

      // Add all actual points (green)
      const actualPoints = guesses.map((g, i) => ({
        type: 'Feature',
        properties: { round: i + 1 },
        geometry: {
          type: 'Point',
          coordinates: g.actualCoords,
        },
      }));

      map.addSource('actual-points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: actualPoints,
        },
      });

      map.addLayer({
        id: 'actual-points-layer',
        type: 'circle',
        source: 'actual-points',
        paint: {
          'circle-radius': 8,
          'circle-color': '#279989',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });

      // Fit map to show all points
      const bounds = new maplibregl.LngLatBounds();
      guesses.forEach((g) => {
        bounds.extend(g.guessCoords);
        bounds.extend(g.actualCoords);
      });
      map.fitBounds(bounds, { padding: 50 });
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [guesses]);

  return (
    <Flex direction="column" className="min-h-[calc(100vh-60px)] p-4" gap="4">
      {/* Header */}
      <Flex justify="center">
        <Card size="3" className="text-center">
          <Flex direction="column" gap="2" align="center">
            <Heading size="6">Game Complete!</Heading>
            <Heading size="8" className="text-[#004445]">
              {totalScore.toLocaleString()} / {maxTotalScore.toLocaleString()}
            </Heading>
            <Text size="4" color="gray">
              {scorePercent}% accuracy
            </Text>
          </Flex>
        </Card>
      </Flex>

      {/* Main content */}
      <Flex gap="4" direction={{ initial: 'column', lg: 'row' }} className="flex-1">
        {/* Map */}
        <Box className="flex-1 min-h-[300px] lg:min-h-0">
          <div ref={mapContainerRef} className="w-full h-full min-h-[300px] rounded-lg overflow-hidden shadow" />
        </Box>

        {/* Stats and table */}
        <Card className="lg:w-[400px]">
          <Flex direction="column" gap="4">
            {/* Quick stats */}
            <Flex gap="4" wrap="wrap">
              <Box className="flex-1 min-w-[100px] text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <Text size="1" color="gray">Avg Distance</Text>
                <Text size="3" weight="bold" className="block">{formatDistance(avgDistance)}</Text>
              </Box>
              <Box className="flex-1 min-w-[100px] text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <Text size="1" color="gray">Best Round</Text>
                <Text size="3" weight="bold" className="block">#{bestRound.round}</Text>
              </Box>
              <Box className="flex-1 min-w-[100px] text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <Text size="1" color="gray">Total Distance</Text>
                <Text size="3" weight="bold" className="block">{formatDistance(totalDistance)}</Text>
              </Box>
            </Flex>

            {/* Round breakdown table */}
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Round</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align="right">Distance</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align="right">Score</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {guesses.map((guess, i) => (
                  <Table.Row key={i}>
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: getScoreColor(guess.score),
                          }}
                        />
                        Round {i + 1}
                      </Flex>
                    </Table.Cell>
                    <Table.Cell align="right">{formatDistance(guess.distance)}</Table.Cell>
                    <Table.Cell align="right">
                      <Text weight="bold">{guess.score.toLocaleString()}</Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>

            {/* Legend */}
            <Flex gap="4" justify="center">
              <Flex align="center" gap="1">
                <div className="w-3 h-3 rounded-full bg-[#279989] border border-white shadow" />
                <Text size="1" color="gray">Actual</Text>
              </Flex>
              <Flex align="center" gap="1">
                <div className="w-3 h-3 rounded-full bg-[#ff4444] border border-white shadow" />
                <Text size="1" color="gray">Guess</Text>
              </Flex>
            </Flex>

            {/* Share button (daily challenge only) */}
            {mode === 'daily' && shareText && (
              <Button
                size="3"
                onClick={handleShare}
                className="w-full cursor-pointer"
                variant="outline"
              >
                {copied ? <CheckIcon /> : <Share1Icon />}
                {copied ? 'Copied!' : 'Share Results'}
              </Button>
            )}

            {/* Play again button */}
            <Button
              size="3"
              onClick={onPlayAgain}
              className="w-full cursor-pointer"
              style={{ backgroundColor: '#004445' }}
            >
              <ResetIcon />
              Play Again
            </Button>
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
};

export default GameResults;
