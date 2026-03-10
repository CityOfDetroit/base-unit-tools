import React, { useEffect, useRef } from 'react';
import { Flex, Spinner, Text } from '@radix-ui/themes';
import useGeoguessGame from './useGeoguessGame';
import GameStart from './GameStart';
import GameRound from './GameRound';
import GameResults from './GameResults';

const Geoguess = () => {
  const {
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
    stepPenalty,
    labelPenalty,
    maxScorePerRound,
    maxTotalScore
  } = useGeoguessGame();

  // Auto-start from ?seed= query param (shared game links)
  const seedHandled = useRef(false);
  useEffect(() => {
    if (seedHandled.current) return;
    const params = new URLSearchParams(window.location.search);
    const seed = params.get('seed');
    if (seed && gameState.status === 'idle') {
      seedHandled.current = true;
      const seedNum = parseInt(seed, 10);
      if (!isNaN(seedNum)) {
        // Clean the URL
        window.history.replaceState({}, '', window.location.pathname);
        startGame(seedNum);
      }
    }
  }, [gameState.status, startGame]);

  const isRoundResult = gameState.status === 'round_result';
  const lastGuess = isRoundResult ? gameState.guesses[gameState.guesses.length - 1] : null;

  return (
    <div className="min-h-[calc(100vh-60px)] bg-gray-100 dark:bg-gray-900">
      {gameState.status === 'idle' && (
        <GameStart
          onStartRandom={startGame}
          onStartDaily={startDailyChallenge}
          error={gameState.error}
        />
      )}

      {gameState.status === 'loading' && (
        <Flex
          align="center"
          justify="center"
          direction="column"
          gap="4"
          className="min-h-[calc(100vh-60px)]"
        >
          <Spinner size="3" />
          <Text size="2" color="gray">
            {gameState.mode === 'daily'
              ? "Loading today's challenge..."
              : 'Finding locations...'}
          </Text>
        </Flex>
      )}

      {(gameState.status === 'playing' || isRoundResult) && currentLocation && (
        <GameRound
          round={gameState.currentRound}
          totalRounds={gameState.totalRounds}
          totalScore={gameState.totalScore}
          location={currentLocation}
          guess={currentGuess}
          onPlaceGuess={placeGuess}
          onSubmit={submitGuess}
          maxScorePerRound={maxScorePerRound}
          mode={gameState.mode}
          currentSteps={currentSteps}
          recordStep={recordStep}
          stepPenalty={stepPenalty}
          labelsUsed={labelsUsed}
          useLabels={useLabels}
          labelPenalty={labelPenalty}
          isResult={isRoundResult}
          result={lastGuess}
          onNext={nextRound}
          isLastRound={gameState.currentRound >= gameState.totalRounds}
        />
      )}

      {gameState.status === 'game_over' && (
        <GameResults
          guesses={gameState.guesses}
          totalScore={gameState.totalScore}
          maxTotalScore={maxTotalScore}
          onPlayAgain={resetGame}
          mode={gameState.mode}
          shareText={getShareText()}
        />
      )}
    </div>
  );
};

export default Geoguess;
