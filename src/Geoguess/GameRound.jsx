import React, { useState } from 'react';
import { Box, Button, Card, Flex, Text } from '@radix-ui/themes';
import { CheckIcon, GlobeIcon } from '@radix-ui/react-icons';
import PanoramaViewer from './PanoramaViewer';
import GuessMap from './GuessMap';

const GameRound = ({
  round,
  totalRounds,
  totalScore,
  location,
  guess,
  onPlaceGuess,
  onSubmit,
  maxScorePerRound,
}) => {
  // Mobile: toggle between panorama and map view
  const [showMap, setShowMap] = useState(false);

  return (
    <Flex direction="column" className="h-[calc(100vh-60px)]">
      {/* Header */}
      <Flex
        justify="between"
        align="center"
        className="bg-white dark:bg-gray-800 px-4 py-3 shadow-sm"
      >
        <Flex gap="4" align="center">
          <Text size="3" weight="bold" className="text-[#004445]">
            Round {round}/{totalRounds}
          </Text>
        </Flex>

        <Flex gap="4" align="center">
          <Text size="2" color="gray">
            Total Score:
          </Text>
          <Text size="3" weight="bold">
            {totalScore.toLocaleString()} / {(maxScorePerRound * totalRounds).toLocaleString()}
          </Text>
        </Flex>
      </Flex>

      {/* Main content */}
      <Flex className="flex-1 min-h-0">
        {/* Desktop layout: side by side */}
        <div className="hidden md:flex flex-1 gap-2 p-2">
          {/* Panorama - 70% */}
          <Box className="w-[70%] h-full">
            <PanoramaViewer imageId={location.id} />
          </Box>

          {/* Map panel - 30% */}
          <Card className="w-[30%] h-full">
            <Flex direction="column" className="h-full" gap="2">
              <Text size="2" weight="medium" className="text-center">
                Click to place your guess
              </Text>

              <Box className="flex-1 min-h-0">
                <GuessMap
                  guess={guess}
                  onGuessChange={onPlaceGuess}
                />
              </Box>

              <Button
                size="3"
                disabled={!guess}
                onClick={onSubmit}
                className="w-full cursor-pointer"
                style={{ backgroundColor: guess ? '#004445' : undefined }}
              >
                <CheckIcon />
                Submit Guess
              </Button>
            </Flex>
          </Card>
        </div>

        {/* Mobile layout: toggle between views */}
        <div className="md:hidden flex flex-col flex-1 p-2">
          {!showMap ? (
            // Panorama view
            <Flex direction="column" className="flex-1" gap="2">
              <Box className="flex-1 min-h-0">
                <PanoramaViewer imageId={location.id} />
              </Box>

              <Button
                size="3"
                variant="outline"
                onClick={() => setShowMap(true)}
                className="w-full cursor-pointer"
              >
                <GlobeIcon />
                {guess ? 'View Map (Guess Placed)' : 'Open Map to Guess'}
              </Button>
            </Flex>
          ) : (
            // Map view
            <Flex direction="column" className="flex-1" gap="2">
              <Text size="2" weight="medium" className="text-center">
                Tap to place your guess
              </Text>

              <Box className="flex-1 min-h-0">
                <GuessMap
                  guess={guess}
                  onGuessChange={onPlaceGuess}
                />
              </Box>

              <Flex gap="2">
                <Button
                  size="3"
                  variant="outline"
                  onClick={() => setShowMap(false)}
                  className="flex-1 cursor-pointer"
                >
                  Back to View
                </Button>

                <Button
                  size="3"
                  disabled={!guess}
                  onClick={onSubmit}
                  className="flex-1 cursor-pointer"
                  style={{ backgroundColor: guess ? '#004445' : undefined }}
                >
                  <CheckIcon />
                  Submit
                </Button>
              </Flex>
            </Flex>
          )}
        </div>
      </Flex>
    </Flex>
  );
};

export default GameRound;
