import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Box, Button, Flex, Text } from '@radix-ui/themes';
import { CheckIcon, GlobeIcon, ArrowRightIcon, LetterCaseCapitalizeIcon } from '@radix-ui/react-icons';
import PanoramaViewer from './PanoramaViewer';
import GuessMap from './GuessMap';

function formatDistance(meters) {
  const feet = meters * 3.28084;
  if (feet < 5280) return `${Math.round(feet)} feet`;
  return `${(feet / 5280).toFixed(2)} miles`;
}

const GameRound = ({
  round,
  totalRounds,
  totalScore,
  location,
  guess,
  onPlaceGuess,
  onSubmit,
  maxScorePerRound,
  currentSteps,
  recordStep,
  stepPenalty,
  result,
  isResult,
  onNext,
  isLastRound,
  labelsUsed,
  useLabels,
  labelPenalty,
}) => {
  const [showMap, setShowMap] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const dragging = useRef(false);
  const containerRef = useRef(null);

  const onDragStart = useCallback((e) => {
    e.preventDefault();
    dragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = rect.right - e.clientX;
      setSidebarWidth(Math.max(300, Math.min(600, newWidth)));
    };
    const onMouseUp = () => {
      if (dragging.current) {
        dragging.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const stepPen = currentSteps * stepPenalty;
  const labelPen = labelsUsed ? labelPenalty : 0;
  const totalPenalty = stepPen + labelPen;
  const potentialPoints = Math.max(0, maxScorePerRound - totalPenalty);

  return (
    <Flex className="h-[calc(100vh-60px)]">
      {/* Desktop: panorama + sidebar */}
      <div ref={containerRef} className="hidden md:flex flex-1 min-h-0">
        {/* Panorama fills the main area */}
        <Box className="flex-1 min-w-0">
          <PanoramaViewer
            imageId={location.id}
            capturedAt={location.captured_at}
            onNavigate={recordStep}
          />
        </Box>

        {/* Drag handle */}
        <div
          onMouseDown={onDragStart}
          className="w-1.5 cursor-col-resize bg-gray-200 dark:bg-gray-700 hover:bg-[#004445] transition-colors flex-shrink-0"
        />

        {/* Sidebar */}
        <Flex
          direction="column"
          style={{ width: sidebarWidth }}
          className="flex-shrink-0"
        >
          {/* Round info */}
          <Flex
            direction="column"
            gap="1"
            className="px-3 py-3 border-b border-gray-200 dark:border-gray-700"
          >
            <Flex justify="between" align="center">
              <Text size="2" weight="bold" className="text-[#004445]">
                Round {round}/{totalRounds}
              </Text>
              <Text size="2" color="gray">
                {totalScore.toLocaleString()} / {(maxScorePerRound * totalRounds).toLocaleString()}
              </Text>
            </Flex>
            {isResult ? (
              <Flex direction="column" gap="1">
                <Text size="2">
                  <Text weight="bold">{result.score.toLocaleString()}</Text>
                  <Text color="gray"> pts — {formatDistance(result.distance)} off</Text>
                </Text>
                {(result.steps > 0 || result.labelsUsed) && (
                  <Text size="1" color="orange">
                    {[
                      result.steps > 0 && `${result.steps} step${result.steps !== 1 ? 's' : ''}`,
                      result.labelsUsed && 'labels',
                    ].filter(Boolean).join(' + ')} (-{result.penalty} pts)
                  </Text>
                )}
              </Flex>
            ) : (
              <Flex direction="column" gap="1">
                <Text size="2" color={totalPenalty > 0 ? 'orange' : 'gray'}>
                  {potentialPoints.toLocaleString()} pts possible
                </Text>
                {currentSteps > 0 && (
                  <Text size="1" color="orange">
                    {currentSteps} step{currentSteps !== 1 ? 's' : ''} (-{stepPen} pts)
                  </Text>
                )}
                {labelsUsed && (
                  <Text size="1" color="orange">
                    Street labels (-{labelPenalty} pts)
                  </Text>
                )}
              </Flex>
            )}
          </Flex>

          {/* Guess map */}
          <Box className="flex-1 min-h-0">
            <GuessMap
              guess={guess}
              onGuessChange={onPlaceGuess}
              disabled={isResult}
              result={isResult ? result : null}
              showLabels={labelsUsed || isResult}
              round={round}
              className="rounded-none"
            />
          </Box>

          {/* Action buttons */}
          <Flex direction="column" gap="2" className="p-3 border-t border-gray-200 dark:border-gray-700">
            {isResult ? (
              <Button
                size="3"
                onClick={onNext}
                className="w-full cursor-pointer"
                style={{ backgroundColor: '#004445' }}
              >
                {isLastRound ? 'See Results' : 'Next Round'}
                <ArrowRightIcon />
              </Button>
            ) : (
              <>
                {!labelsUsed && (
                  <Button
                    size="2"
                    variant="outline"
                    color="orange"
                    onClick={useLabels}
                    className="w-full cursor-pointer"
                  >
                    <LetterCaseCapitalizeIcon />
                    Show Street Labels (-{labelPenalty} pts)
                  </Button>
                )}
                <Button
                  size="3"
                  disabled={!guess}
                  onClick={onSubmit}
                  className="w-full cursor-pointer"
                  style={{ backgroundColor: guess ? '#004445' : undefined }}
                >
                  {guess ? 'Submit' : 'Place guess on map'}
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden flex flex-col flex-1 min-h-0 p-2">
        {isResult ? (
          <Flex direction="column" className="flex-1" gap="2">
            <Box className="h-[40%] min-h-0">
              <PanoramaViewer imageId={location.id} capturedAt={location.captured_at} onNavigate={() => {}} />
            </Box>
            <Box className="flex-1 min-h-0">
              <GuessMap
                guess={guess}
                onGuessChange={() => {}}
                disabled
                result={result}
                showLabels
                round={round}
              />
            </Box>
            <Button
              size="2"
              onClick={onNext}
              className="w-full cursor-pointer"
              style={{ backgroundColor: '#004445' }}
            >
              {isLastRound ? 'See Results' : 'Next Round'}
              <ArrowRightIcon />
            </Button>
          </Flex>
        ) : !showMap ? (
          <Flex direction="column" className="flex-1" gap="2">
            <Box className="flex-1 min-h-0">
              <PanoramaViewer
                imageId={location.id}
                onNavigate={recordStep}
              />
            </Box>
            <Button
              size="2"
              variant="outline"
              onClick={() => setShowMap(true)}
              className="w-full cursor-pointer"
            >
              <GlobeIcon />
              {guess ? 'View Map (Guess Placed)' : 'Open Map to Guess'}
            </Button>
          </Flex>
        ) : (
          <Flex direction="column" className="flex-1" gap="2">
            <Box className="flex-1 min-h-0">
              <GuessMap guess={guess} onGuessChange={onPlaceGuess} showLabels={labelsUsed} round={round} />
            </Box>
            {!labelsUsed && (
              <Button
                size="1"
                variant="outline"
                color="orange"
                onClick={useLabels}
                className="w-full cursor-pointer"
              >
                <LetterCaseCapitalizeIcon />
                Show Street Labels (-{labelPenalty} pts)
              </Button>
            )}
            <Flex gap="2">
              <Button
                size="2"
                variant="outline"
                onClick={() => setShowMap(false)}
                className="flex-1 cursor-pointer"
              >
                Back to View
              </Button>
              <Button
                size="2"
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
  );
};

export default GameRound;
