import { Card, Flex, Text } from "@radix-ui/themes";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import area from "@turf/area";

const MailerSummary = ({ geom, filtered, addresses }) => {
  const totalCount = addresses.length;
  const filteredCount = filtered.length;
  const filteredOutCount = totalCount - filteredCount;

  // Calculate area in square miles
  const areaSquareMiles = geom ? (area(geom) * 0.000000386102).toFixed(3) : 0;

  return (
    <Card className="border bg-green-50 border-green-200">
      <Flex direction="column" gap="3" p="1">
        <Flex align="center" gap="3">
          <div className="text-green-600">
            <CheckCircledIcon width="24" height="24" />
          </div>
          <Flex direction="column">
            <Text size="4" weight="bold" className="text-[#004445]">
              {filteredCount.toLocaleString()} addresses ready
            </Text>
            <Text size="2" color="gray">
              {areaSquareMiles} square miles selected
            </Text>
          </Flex>
        </Flex>

        <Flex gap="4" wrap="wrap">
          <Flex direction="column" className="min-w-24">
            <Text size="1" color="gray">
              Total in area
            </Text>
            <Text size="3" weight="medium">
              {totalCount.toLocaleString()}
            </Text>
          </Flex>

          <Flex direction="column" className="min-w-24">
            <Text size="1" color="gray">
              Deliverable
            </Text>
            <Text size="3" weight="medium" className="text-green-600">
              {filteredCount.toLocaleString()}
            </Text>
          </Flex>

          {filteredOutCount > 0 && (
            <Flex direction="column" className="min-w-24">
              <Text size="1" color="gray">
                Undeliverable
              </Text>
              <Text size="3" weight="medium" className="text-gray-500">
                {filteredOutCount.toLocaleString()}
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Card>
  );
};

export default MailerSummary;
