import { useState, useCallback } from 'react';
import distance from '@turf/distance';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';
import { DETROIT_BOUNDS, detroitBoundary } from './detroitBoundary';

const MAPILLARY_TOKEN = 'MLY|4690399437648324|de87555bb6015affa20c3df794ebab15';
const TOTAL_ROUNDS = 5;
const MAX_SCORE_PER_ROUND = 5000;
export const STEP_PENALTY = 250;
export const LABEL_PENALTY = 500;

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
// maxScore allows capping the possible points (e.g. after step penalties)
export function calculateScore(distanceMeters, maxScore = MAX_SCORE_PER_ROUND) {
  // Within 30 feet is a perfect score
  if (distanceMeters <= 9.144) return maxScore;
  // Reward proximity: ~60% at 1 mile, ~35% at 2 miles
  const score = Math.round(maxScore * Math.exp(-distanceMeters / 3000));
  return Math.max(0, Math.min(maxScore, score));
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

// Generate a batch of valid candidate points within Detroit
function generateCandidatePoints(rng, batchSize) {
  const candidates = [];
  let safetyLimit = batchSize * 5;
  while (candidates.length < batchSize && safetyLimit-- > 0) {
    const [lng, lat] = getRandomPointInDetroit(rng);
    if (isWithinDetroit([lng, lat])) {
      candidates.push([lng, lat]);
    }
  }
  return candidates;
}

// Fetch panorama locations for the game
// If seed is provided, uses seeded RNG for deterministic locations (daily challenge)
async function fetchLocations(count = TOTAL_ROUNDS, seed = null) {
  const rng = seed ? mulberry32(seed) : Math.random;
  const locations = [];
  const usedImageIds = new Set();
  const BATCH_SIZE = 20;
  const MAX_BATCHES = 4;

  for (let batch = 0; batch < MAX_BATCHES && locations.length < count; batch++) {
    // Generate candidate points (cheap, no I/O)
    const candidates = generateCandidatePoints(rng, BATCH_SIZE);

    // Fetch panoramas for all candidates in parallel
    const results = await Promise.all(
      candidates.map(([lng, lat]) => fetchNearbyPanoramas(lng, lat))
    );

    // Process results in order (preserves determinism for seeded RNG)
    for (let i = 0; i < results.length && locations.length < count; i++) {
      const images = results[i];
      if (images.length === 0) continue;

      const validImages = images.filter(img => {
        if (usedImageIds.has(img.id)) return false;
        const coords = [img.geometry.coordinates[0], img.geometry.coordinates[1]];
        return isWithinDetroit(coords);
      });

      if (validImages.length > 0) {
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

// Generate share text for game results
export function generateShareText(seed, mode, guesses, totalScore, maxTotalScore) {
  const percent = Math.round((totalScore / maxTotalScore) * 100);

  const emojis = guesses.map(g => {
    const pct = g.score / MAX_SCORE_PER_ROUND;
    if (pct >= 0.9) return '🟢';
    if (pct >= 0.7) return '🟡';
    if (pct >= 0.4) return '🟠';
    return '🔴';
  }).join('');

  const title = mode === 'daily'
    ? `Detroit Geoguess - ${formatDateForDisplay(seed)}`
    : `Detroit Geoguess`;

  const link = `${window.location.origin}/geoguess?seed=${seed}`;

  return `${title}
${emojis}
Score: ${totalScore.toLocaleString()}/${maxTotalScore.toLocaleString()} (${percent}%)

Play the same game: ${link}`;
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
  const [currentSteps, setCurrentSteps] = useState(0);
  const [labelsUsed, setLabelsUsed] = useState(false);

  // Record a navigation step
  const recordStep = useCallback(() => {
    setCurrentSteps(prev => prev + 1);
  }, []);

  // Toggle street labels (one-time penalty per round)
  const useLabels = useCallback(() => {
    setLabelsUsed(true);
  }, []);

  // Get current location for the active round
  const currentLocation = gameState.locations[gameState.currentRound - 1] || null;

  // Start a new game (random mode) with a random or provided seed
  const startGame = useCallback(async (seed = null) => {
    // Guard against receiving a click event as the seed
    const validSeed = typeof seed === 'number' ? seed : null;
    const gameSeed = validSeed || Math.floor(Math.random() * 900000000) + 100000000;
    setGameState(prev => ({ ...prev, status: 'loading', mode: 'random', seed: gameSeed, error: null }));
    setCurrentGuess(null);

    try {
      const locations = await fetchLocations(TOTAL_ROUNDS, gameSeed);

      if (locations.length < TOTAL_ROUNDS) {
        throw new Error(`Only found ${locations.length} locations. Please try again.`);
      }

      setGameState({
        status: 'playing',
        mode: 'random',
        seed: gameSeed,
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
    const stepPen = currentSteps * STEP_PENALTY;
    const labelPen = labelsUsed ? LABEL_PENALTY : 0;
    const penalty = stepPen + labelPen;
    const maxPossible = Math.max(0, MAX_SCORE_PER_ROUND - penalty);
    const score = calculateScore(dist, maxPossible);

    const guess = {
      round: gameState.currentRound,
      guessCoords: currentGuess,
      actualCoords: currentLocation.coordinates,
      distance: dist,
      maxPossible,
      steps: currentSteps,
      labelsUsed,
      penalty,
      score
    };

    setGameState(prev => ({
      ...prev,
      status: 'round_result',
      guesses: [...prev.guesses, guess],
      totalScore: prev.totalScore + score
    }));
  }, [currentGuess, currentLocation, gameState.currentRound, currentSteps, labelsUsed]);

  // Move to the next round or end game
  const nextRound = useCallback(() => {
    setCurrentGuess(null);
    setCurrentSteps(0);
    setLabelsUsed(false);

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
    setCurrentSteps(0);
    setLabelsUsed(false);
  }, []);

  // Get share text
  const getShareText = useCallback(() => {
    if (!gameState.seed) return null;
    return generateShareText(
      gameState.seed,
      gameState.mode,
      gameState.guesses,
      gameState.totalScore,
      MAX_SCORE_PER_ROUND * TOTAL_ROUNDS
    );
  }, [gameState.mode, gameState.seed, gameState.guesses, gameState.totalScore]);

  return {
    gameState,
    currentLocation,
    currentGuess,
    currentSteps,
    labelsUsed,
    startGame,
    startDailyChallenge,
    placeGuess,
    submitGuess,
    nextRound,
    resetGame,
    recordStep,
    useLabels,
    getShareText,
    stepPenalty: STEP_PENALTY,
    labelPenalty: LABEL_PENALTY,
    maxScorePerRound: MAX_SCORE_PER_ROUND,
    maxTotalScore: MAX_SCORE_PER_ROUND * TOTAL_ROUNDS
  };
}

export default useGeoguessGame;
