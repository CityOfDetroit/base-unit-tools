import { Card, Flex, Text } from "@radix-ui/themes";

const GeocoderProgress = ({ progress }) => {
  const { current, total, percent } = progress;
  const numBatches = Math.ceil(total / 1000);
  const isSmallDataset = total <= 1000;
  const isWaiting = percent === 0;

  return (
    <Card>
      <Flex direction="column" gap="3" p="2">
        <Flex justify="between" align="center">
          <Text size="3" weight="bold" className="text-[#004445]">
            {isWaiting ? "Sending to geocoder..." : "Geocoding in progress..."}
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
              ? `Preparing ${total.toLocaleString()} addresses...`
              : `${current.toLocaleString()} of ${total.toLocaleString()} addresses`}
          </Text>
          <Text size="1" color="gray">
            {isSmallDataset
              ? "Single batch"
              : `${numBatches} batches of 1,000`}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};

export default GeocoderProgress;
