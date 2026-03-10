import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Box, Button, Flex, Table, Text } from '@radix-ui/themes';
import { CheckIcon, ResetIcon, Share1Icon } from '@radix-ui/react-icons';
import { DETROIT_CENTER, detroitBoundary } from './detroitBoundary';
import { baseStyle } from '../styles/mapstyle';
import { addMarkerImages } from './markerImages';

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

function getScoreColor(score) {
  const pct = score / MAX_SCORE_PER_ROUND;
  if (pct >= 0.9) return '#22c55e';
  if (pct >= 0.7) return '#eab308';
  if (pct >= 0.4) return '#f97316';
  return '#ef4444';
}

const GameResults = ({ guesses, totalScore, maxTotalScore, onPlayAgain, mode, shareText }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (!shareText) return;

    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
        return;
      } catch (err) {
        // fall back to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const totalDistance = guesses.reduce((sum, g) => sum + g.distance, 0);
  const scorePercent = Math.round((totalScore / maxTotalScore) * 100);

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
      addMarkerImages(map);

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

      const lines = guesses.map((g) => ({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [g.guessCoords, g.actualCoords],
        },
      }));

      map.addSource('result-lines', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: lines },
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

      const guessPoints = guesses.map((g, i) => ({
        type: 'Feature',
        properties: { round: i + 1 },
        geometry: { type: 'Point', coordinates: g.guessCoords },
      }));

      map.addSource('guess-points', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: guessPoints },
      });

      map.addLayer({
        id: 'guess-points-symbol',
        type: 'symbol',
        source: 'guess-points',
        layout: { 'icon-image': 'guess-icon', 'icon-allow-overlap': true },
      });

      const actualPoints = guesses.map((g, i) => ({
        type: 'Feature',
        properties: { round: i + 1 },
        geometry: { type: 'Point', coordinates: g.actualCoords },
      }));

      map.addSource('actual-points', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: actualPoints },
      });

      map.addLayer({
        id: 'actual-points-symbol',
        type: 'symbol',
        source: 'actual-points',
        layout: { 'icon-image': 'actual-icon', 'icon-allow-overlap': true },
      });

      const bounds = new maplibregl.LngLatBounds();
      guesses.forEach((g) => {
        bounds.extend(g.guessCoords);
        bounds.extend(g.actualCoords);
      });
      map.fitBounds(bounds, { padding: 80 });
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
    <Flex direction={{ initial: 'column', lg: 'row' }} className="h-[calc(100vh-60px)]">
      {/* Map */}
      <Box className="flex-1 min-h-[300px] lg:min-h-0">
        <div ref={mapContainerRef} className="w-full h-full" />
      </Box>

      {/* Sidebar */}
      <Flex direction="column" gap="3" className="lg:w-[380px] p-4 overflow-y-auto border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">
        <Box>
          <Text size="5" weight="bold" className="text-[#004445]">
            {totalScore.toLocaleString()}
          </Text>
          <Text size="5" color="gray"> / {maxTotalScore.toLocaleString()}</Text>
          <Text as="p" size="2" color="gray">{scorePercent}%</Text>
        </Box>

        <Table.Root size="1">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Rd</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Dist</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Steps</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Score</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {guesses.map((guess, i) => (
              <Table.Row key={i}>
                <Table.Cell>
                  <Flex align="center" gap="2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: getScoreColor(guess.score) }}
                    />
                    {i + 1}
                  </Flex>
                </Table.Cell>
                <Table.Cell align="right">{formatDistance(guess.distance)}</Table.Cell>
                <Table.Cell align="right">
                  {guess.steps > 0 ? (
                    <Text size="1" color="orange">{guess.steps}</Text>
                  ) : (
                    <Text size="1" color="gray">—</Text>
                  )}
                </Table.Cell>
                <Table.Cell align="right">
                  <Text weight="bold">{guess.score.toLocaleString()}</Text>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        {/* Legend */}
        <Flex gap="3">
          <Flex align="center" gap="1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#279989]" />
            <Text size="1" color="gray">Actual</Text>
          </Flex>
          <Flex align="center" gap="1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff4444]" />
            <Text size="1" color="gray">Guess</Text>
          </Flex>
        </Flex>

        <Flex direction="column" gap="2" className="mt-auto">
          {shareText && (
            <Button
              size="2"
              onClick={handleShare}
              className="w-full cursor-pointer"
              variant="outline"
            >
              {copied ? <CheckIcon /> : <Share1Icon />}
              {copied ? 'Copied!' : 'Share Results'}
            </Button>
          )}

          <Button
            size="2"
            variant="soft"
            onClick={onPlayAgain}
            className="w-full cursor-pointer"
          >
            <ResetIcon />
            Play Again
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default GameResults;
