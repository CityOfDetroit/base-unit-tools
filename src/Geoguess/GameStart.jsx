import React from 'react';
import { Box, Button, Card, Flex, Heading, Separator, Text } from '@radix-ui/themes';
import { CalendarIcon, ShuffleIcon } from '@radix-ui/react-icons';
import { getTodaysSeed, formatDateForDisplay } from './useGeoguessGame';

const GameStart = ({ onStartRandom, onStartDaily, error }) => {
  const todaysSeed = getTodaysSeed();
  const todaysDate = formatDateForDisplay(todaysSeed);

  return (
    <Flex
      align="center"
      justify="center"
      className="min-h-[calc(100vh-60px)] p-4"
    >
      <Card size="4" className="max-w-md w-full">
        <Flex direction="column" gap="5" align="center" className="text-center">
          <Box>
            <Heading size="8" className="text-[#004445]">
              Detroit Geoguess
            </Heading>
            <Text size="3" color="gray" className="mt-2 block">
              Test your knowledge of Detroit streets
            </Text>
          </Box>

          <Box className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 w-full">
            <Heading size="3" className="mb-3">How to Play</Heading>
            <Flex direction="column" gap="2" align="start">
              <Text size="2" color="gray">
                1. You'll see a 360° street view from somewhere in Detroit
              </Text>
              <Text size="2" color="gray">
                2. Look around to find clues about the location
              </Text>
              <Text size="2" color="gray">
                3. Click on the map to place your guess
              </Text>
              <Text size="2" color="gray">
                4. Score points based on how close you are
              </Text>
              <Text size="2" color="gray">
                5. Play 5 rounds for a total score up to 25,000
              </Text>
            </Flex>
          </Box>

          {error && (
            <Text size="2" color="red" className="text-center">
              {error}
            </Text>
          )}

          <Flex direction="column" gap="3" className="w-full">
            {/* Daily Challenge - Primary */}
            <Box className="bg-[#004445]/5 rounded-lg p-3">
              <Text size="2" weight="medium" className="block mb-2">
                Daily Challenge - {todaysDate}
              </Text>
              <Text size="1" color="gray" className="block mb-3">
                Same 5 locations for everyone today. Compare scores with friends!
              </Text>
              <Button
                size="3"
                onClick={onStartDaily}
                className="w-full cursor-pointer"
                style={{ backgroundColor: '#004445' }}
              >
                <CalendarIcon width="18" height="18" />
                Play Today's Challenge
              </Button>
            </Box>

            <Flex align="center" gap="3">
              <Separator size="4" />
              <Text size="1" color="gray">or</Text>
              <Separator size="4" />
            </Flex>

            {/* Random Mode - Secondary */}
            <Button
              size="3"
              variant="outline"
              onClick={onStartRandom}
              className="w-full cursor-pointer"
            >
              <ShuffleIcon width="18" height="18" />
              Practice (Random Locations)
            </Button>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
};

export default GameStart;
