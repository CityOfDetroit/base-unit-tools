import { Card, Flex, Text } from "@radix-ui/themes";

/**
 * Reusable progress bar component.
 *
 * @param {object} progress - Progress object with { current, total, percent }
 * @param {string} waitingText - Text to show while waiting (percent === 0)
 * @param {string} activeText - Text to show while processing
 * @param {string} waitingSubtext - Subtext while waiting (optional)
 * @param {string} activeSubtext - Subtext while processing (optional)
 */
const Progress = ({
  progress,
  waitingText = "Loading...",
  activeText = "Processing...",
  waitingSubtext,
  activeSubtext,
}) => {
  const { current, total, percent } = progress;
  const isWaiting = percent === 0;

  return (
    <Card>
      <Flex direction="column" gap="3" p="2">
        <Flex justify="between" align="center">
          <Text size="3" weight="bold" className="text-[#004445]">
            {isWaiting ? waitingText : activeText}
          </Text>
          <Text size="2" color="gray">
            {percent}%
          </Text>
        </Flex>

        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          {isWaiting ? (
            <div
              className="h-full rounded-full animate-pulse"
              style={{
                width: "100%",
                backgroundColor: "#9fd5b3",
              }}
            />
          ) : (
            <div
              className="h-full transition-all duration-300 ease-out rounded-full"
              style={{
                width: `${percent}%`,
                backgroundColor: "#279989",
              }}
            />
          )}
        </div>

        <Flex justify="between" align="center">
          <Text size="2" color="gray">
            {isWaiting
              ? (waitingSubtext || `Preparing ${total.toLocaleString()} items...`)
              : `${current.toLocaleString()} of ${total.toLocaleString()}`}
          </Text>
          {activeSubtext && !isWaiting && (
            <Text size="1" color="gray">
              {activeSubtext}
            </Text>
          )}
        </Flex>
      </Flex>
    </Card>
  );
};

export default Progress;
