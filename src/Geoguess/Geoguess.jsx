import React from 'react';
import { Flex, Spinner, Text } from '@radix-ui/themes';
import useGeoguessGame from './useGeoguessGame';
import GameStart from './GameStart';
import GameRound from './GameRound';
import RoundResult from './RoundResult';
import GameResults from './GameResults';

const Geoguess = () => {
  const {
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
    maxScorePerRound,
    maxTotalScore
  } = useGeoguessGame();

  return (
    <div className="min-h-[calc(100vh-60px)] bg-gray-100 dark:bg-gray-900">
      {/* Idle - Start Screen */}
      {gameState.status === 'idle' && (
        <GameStart
          onStartRandom={startGame}
          onStartDaily={startDailyChallenge}
          error={gameState.error}
        />
      )}

      {/* Loading - Fetching locations */}
      {gameState.status === 'loading' && (
        <Flex
          align="center"
          justify="center"
          direction="column"
          gap="4"
          className="min-h-[calc(100vh-60px)]"
        >
          <Spinner size="3" />
          <Text size="3" color="gray">
            {gameState.mode === 'daily'
              ? "Loading today's challenge..."
              : 'Finding random locations in Detroit...'}
          </Text>
        </Flex>
      )}

      {/* Playing - Active round */}
      {gameState.status === 'playing' && currentLocation && (
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
        />
      )}

      {/* Round Result */}
      {gameState.status === 'round_result' && (
        <RoundResult
          result={gameState.guesses[gameState.guesses.length - 1]}
          round={gameState.currentRound}
          totalRounds={gameState.totalRounds}
          totalScore={gameState.totalScore}
          maxScorePerRound={maxScorePerRound}
          onNext={nextRound}
          isLastRound={gameState.currentRound >= gameState.totalRounds}
        />
      )}

      {/* Game Over - Final Results */}
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
