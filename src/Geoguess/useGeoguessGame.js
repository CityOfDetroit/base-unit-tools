import { useState, useCallback } from 'react';
import distance from '@turf/distance';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';
import { DETROIT_BOUNDS, detroitBoundary } from './detroitBoundary';

const MAPILLARY_TOKEN = 'MLY|4690399437648324|de87555bb6015affa20c3df794ebab15';
const TOTAL_ROUNDS = 5;
const MAX_SCORE_PER_ROUND = 5000;

// Mulberry32 seeded PRNG - deterministic random from a seed
function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Get today's date as a seed number (YYYYMMDD)
export function getTodaysSeed() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return parseInt(`${year}${month}${day}`, 10);
}

// Format date for display
export function formatDateForDisplay(seed) {
  const str = seed.toString();
  const year = str.slice(0, 4);
  const month = str.slice(4, 6);
  const day = str.slice(6, 8);
  const date = new Date(year, parseInt(month) - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Calculate score based on distance (exponential decay)
export function calculateScore(distanceMeters) {
  // Gentler scoring: ~45% at 1 mile, ~20% at 2 miles
  const score = Math.round(MAX_SCORE_PER_ROUND * Math.exp(-distanceMeters / 2000));
  return Math.max(0, Math.min(MAX_SCORE_PER_ROUND, score));
}

// Calculate distance between two coordinate pairs in meters
export function calculateDistance(guessCoords, actualCoords) {
  const from = point(guessCoords);
  const to = point(actualCoords);
  return distance(from, to, { units: 'meters' });
}

// Generate a random point within Detroit bounds
function getRandomPointInDetroit(rng = Math.random) {
  const lng = DETROIT_BOUNDS.minLng + rng() * (DETROIT_BOUNDS.maxLng - DETROIT_BOUNDS.minLng);
  const lat = DETROIT_BOUNDS.minLat + rng() * (DETROIT_BOUNDS.maxLat - DETROIT_BOUNDS.minLat);
  return [lng, lat];
}

// Check if a point is within Detroit boundary
function isWithinDetroit(coords) {
  const pt = point(coords);
  return booleanPointInPolygon(pt, detroitBoundary);
}

// Fetch panoramic images near a point from Mapillary Graph API
// Only fetches images from the 'codgis' user (City of Detroit GIS)
async function fetchNearbyPanoramas(lng, lat, radius = 0.005) {
  const bbox = `${lng - radius},${lat - radius},${lng + radius},${lat + radius}`;
  const url = `https://graph.mapillary.com/images?access_token=${MAPILLARY_TOKEN}&fields=id,geometry,captured_at,is_pano,creator&bbox=${bbox}&is_pano=true&creator_username=codgis&limit=20`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Mapillary API error: ${response.status}`);
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch Mapillary images:', error);
    return [];
  }
}

// Fetch panorama locations for the game
// If seed is provided, uses seeded RNG for deterministic locations (daily challenge)
async function fetchLocations(count = TOTAL_ROUNDS, seed = null) {
  const rng = seed ? mulberry32(seed) : Math.random;
  const locations = [];
  const usedImageIds = new Set();
  let attempts = 0;
  const maxAttempts = 100;

  while (locations.length < count && attempts < maxAttempts) {
    attempts++;

    // Generate random point (deterministic if seeded)
    const [lng, lat] = getRandomPointInDetroit(rng);

    // Skip if point is outside Detroit boundary polygon
    if (!isWithinDetroit([lng, lat])) {
      continue;
    }

    // Fetch nearby panoramas
    const images = await fetchNearbyPanoramas(lng, lat);

    if (images.length > 0) {
      // Filter out already used images and verify within Detroit
      const validImages = images.filter(img => {
        if (usedImageIds.has(img.id)) return false;
        const coords = [img.geometry.coordinates[0], img.geometry.coordinates[1]];
        return isWithinDetroit(coords);
      });

      if (validImages.length > 0) {
        // Pick image deterministically if seeded, randomly otherwise
        const index = seed
          ? Math.floor(rng() * validImages.length)
          : Math.floor(Math.random() * validImages.length);
        const selectedImage = validImages[index];
        usedImageIds.add(selectedImage.id);

        locations.push({
          id: selectedImage.id.toString(),
          coordinates: selectedImage.geometry.coordinates,
          captured_at: selectedImage.captured_at
        });
      }
    }
  }

  return locations;
}

// Generate share text for daily challenge results
export function generateShareText(seed, guesses, totalScore, maxTotalScore) {
  const dateStr = formatDateForDisplay(seed);
  const percent = Math.round((totalScore / maxTotalScore) * 100);

  // Generate emoji grid based on round scores
  const emojis = guesses.map(g => {
    const pct = g.score / MAX_SCORE_PER_ROUND;
    if (pct >= 0.9) return '🟢';
    if (pct >= 0.7) return '🟡';
    if (pct >= 0.4) return '🟠';
    return '🔴';
  }).join('');

  return `Detroit Geoguess - ${dateStr}
${emojis}
Score: ${totalScore.toLocaleString()}/${maxTotalScore.toLocaleString()} (${percent}%)

Play at: ${window.location.origin}/geoguess`;
}

const initialState = {
  status: 'idle', // 'idle' | 'loading' | 'playing' | 'round_result' | 'game_over'
  mode: null, // 'daily' | 'random'
  seed: null, // date seed for daily challenge
  currentRound: 1,
  totalRounds: TOTAL_ROUNDS,
  locations: [],
  guesses: [],
  totalScore: 0,
  error: null
};

export function useGeoguessGame() {
  const [gameState, setGameState] = useState(initialState);
  const [currentGuess, setCurrentGuess] = useState(null);

  // Get current location for the active round
  const currentLocation = gameState.locations[gameState.currentRound - 1] || null;

  // Start a new game (random mode)
  const startGame = useCallback(async () => {
    setGameState(prev => ({ ...prev, status: 'loading', mode: 'random', seed: null, error: null }));
    setCurrentGuess(null);

    try {
      const locations = await fetchLocations(TOTAL_ROUNDS, null);

      if (locations.length < TOTAL_ROUNDS) {
        throw new Error(`Only found ${locations.length} locations. Please try again.`);
      }

      setGameState({
        status: 'playing',
        mode: 'random',
        seed: null,
        currentRound: 1,
        totalRounds: TOTAL_ROUNDS,
        locations,
        guesses: [],
        totalScore: 0,
        error: null
      });
    } catch (error) {
      setGameState(prev => ({
        ...prev,
        status: 'idle',
        error: error.message || 'Failed to load game locations'
      }));
    }
  }, []);

  // Start daily challenge
  const startDailyChallenge = useCallback(async () => {
    const seed = getTodaysSeed();
    setGameState(prev => ({ ...prev, status: 'loading', mode: 'daily', seed, error: null }));
    setCurrentGuess(null);

    try {
      const locations = await fetchLocations(TOTAL_ROUNDS, seed);

      if (locations.length < TOTAL_ROUNDS) {
        throw new Error(`Only found ${locations.length} locations. Please try again.`);
      }

      setGameState({
        status: 'playing',
        mode: 'daily',
        seed,
        currentRound: 1,
        totalRounds: TOTAL_ROUNDS,
        locations,
        guesses: [],
        totalScore: 0,
        error: null
      });
    } catch (error) {
      setGameState(prev => ({
        ...prev,
        status: 'idle',
        error: error.message || 'Failed to load daily challenge'
      }));
    }
  }, []);

  // Place a guess on the map
  const placeGuess = useCallback((coords) => {
    setCurrentGuess(coords);
  }, []);

  // Submit the current guess
  const submitGuess = useCallback(() => {
    if (!currentGuess || !currentLocation) return;

    const dist = calculateDistance(currentGuess, currentLocation.coordinates);
    const score = calculateScore(dist);

    const guess = {
      round: gameState.currentRound,
      guessCoords: currentGuess,
      actualCoords: currentLocation.coordinates,
      distance: dist,
      score
    };

    setGameState(prev => ({
      ...prev,
      status: 'round_result',
      guesses: [...prev.guesses, guess],
      totalScore: prev.totalScore + score
    }));
  }, [currentGuess, currentLocation, gameState.currentRound]);

  // Move to the next round or end game
  const nextRound = useCallback(() => {
    setCurrentGuess(null);

    if (gameState.currentRound >= TOTAL_ROUNDS) {
      setGameState(prev => ({ ...prev, status: 'game_over' }));
    } else {
      setGameState(prev => ({
        ...prev,
        status: 'playing',
        currentRound: prev.currentRound + 1
      }));
    }
  }, [gameState.currentRound]);

  // Reset to start screen
  const resetGame = useCallback(() => {
    setGameState(initialState);
    setCurrentGuess(null);
  }, []);

  // Get share text for daily challenge
  const getShareText = useCallback(() => {
    if (gameState.mode !== 'daily' || !gameState.seed) return null;
    return generateShareText(
      gameState.seed,
      gameState.guesses,
      gameState.totalScore,
      MAX_SCORE_PER_ROUND * TOTAL_ROUNDS
    );
  }, [gameState.mode, gameState.seed, gameState.guesses, gameState.totalScore]);

  return {
    gameState,
    currentLocation,
    currentGuess,
    startGame,
    startDailyChallenge,
    placeGuess,
    submitGuess,
    nextRound,
    resetGame,
    getShareText,
    maxScorePerRound: MAX_SCORE_PER_ROUND,
    maxTotalScore: MAX_SCORE_PER_ROUND * TOTAL_ROUNDS
  };
}

export default useGeoguessGame;
