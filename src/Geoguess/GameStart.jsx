import React from 'react';
import { Box, Button, Card, Flex, Link, Separator, Text } from '@radix-ui/themes';
import { CalendarIcon, ShuffleIcon } from '@radix-ui/react-icons';
import { getTodaysSeed, formatDateForDisplay } from './useGeoguessGame';

const GameStart = ({ onStartRandom, onStartDaily, error }) => {
  const todaysSeed = getTodaysSeed();
  const todaysDate = formatDateForDisplay(todaysSeed);

  return (
    <Flex
      align="start"
      justify="center"
      className="min-h-[calc(100vh-60px)] p-4 pt-12"
    >
      <Flex direction="column" gap="4" className="max-w-md w-full">
        <Box>
          <Text size="5" weight="bold" className="text-[#004445]">
            Detroit Street View Guesser
          </Text>
          <Text as="p" size="3" color="gray" className="mt-1">
            Test your knowledge of Detroit's streets using 360-degree imagery from the <Link href="https://detroitmi.gov/departments/department-innovation-and-technology/detroit-street-view" target="_blank" rel="noopener noreferrer">Detroit Street View</Link> project.
          </Text>
          <Text as="p" size="2" color="gray" className="mt-2">
            Each game consists of five rounds worth up to <Text weight="bold">5,000 points</Text> each. You'll be placed at a random location somewhere in the city and asked to identify where you are by placing a pin on a map. The closer your guess, the more points you earn.
          </Text>
          <Text as="p" size="2" color="gray" className="mt-2">
            You can navigate along the street to look for clues, but each step reduces the maximum points available for that round by <Text weight="bold">250 points</Text>. You can also turn on street labels on the guessing map, but doing so costs <Text weight="bold">500 points</Text> for the round.
          </Text>
        </Box>

        {error && (
          <Text size="2" color="red">
            {error}
          </Text>
        )}

        <Card>
          <Flex direction="column" gap="3">
            <Box>
              <Text size="2" weight="medium">
                Daily Challenge
              </Text>
              <Text as="p" size="1" color="gray" className="mt-1">
                {todaysDate}
              </Text>
            </Box>
            <Button
              size="2"
              onClick={onStartDaily}
              className="w-full cursor-pointer"
              style={{ backgroundColor: '#004445' }}
            >
              <CalendarIcon />
              Play Today's Challenge
            </Button>
          </Flex>
        </Card>

        <Flex align="center" gap="3">
          <Separator size="4" />
          <Text size="1" color="gray">or</Text>
          <Separator size="4" />
        </Flex>

        <Button
          size="2"
          variant="outline"
          onClick={onStartRandom}
          className="w-full cursor-pointer"
        >
          <ShuffleIcon />
          Practice with 5 random images
        </Button>
      </Flex>
    </Flex>
  );
};

export default GameStart;
