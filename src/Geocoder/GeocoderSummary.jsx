import { Card, Flex, Text, Badge } from "@radix-ui/themes";
import {
  CheckCircledIcon,
  ExclamationTriangleIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";

const GeocoderSummary = ({ results, addresses }) => {
  const matchedCount = results.filter((r) => r.attributes.StAddr !== "").length;
  const unmatchedCount = addresses.length - matchedCount;
  const matchRate = ((matchedCount / addresses.length) * 100).toFixed(1);

  // Determine status based on match rate
  const getStatus = () => {
    if (matchRate >= 90) return { color: "green", label: "Excellent", icon: CheckCircledIcon };
    if (matchRate >= 70) return { color: "yellow", label: "Good", icon: ExclamationTriangleIcon };
    return { color: "red", label: "Needs Review", icon: CrossCircledIcon };
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  return (
    <Card>
      <Flex direction={{ initial: "column", sm: "row" }} gap="4" align={{ initial: "start", sm: "center" }} justify="between" p="2">
        {/* Main Stats */}
        <Flex direction="column" gap="1">
          <Flex align="center" gap="2">
            <StatusIcon
              width="24"
              height="24"
              className={
                status.color === "green"
                  ? "text-green-600"
                  : status.color === "yellow"
                    ? "text-yellow-600"
                    : "text-red-600"
              }
            />
            <Text size="6" weight="bold" className="text-[#004445]">
              {matchedCount.toLocaleString()}
            </Text>
            <Text size="3" color="gray">
              of {addresses.length.toLocaleString()} matched
            </Text>
          </Flex>
          <Flex align="center" gap="2">
            <Text size="5" weight="bold" style={{ color: "#279989" }}>
              {matchRate}%
            </Text>
            <Text size="2" color="gray">
              match rate
            </Text>
            <Badge
              color={status.color}
              variant="soft"
              size="1"
            >
              {status.label}
            </Badge>
          </Flex>
        </Flex>

        {/* Breakdown */}
        <Flex gap="4">
          <Flex direction="column" align="center" className="px-4 py-2 bg-green-50 rounded-lg">
            <Text size="4" weight="bold" className="text-green-700">
              {matchedCount.toLocaleString()}
            </Text>
            <Text size="1" className="text-green-600">
              Matched
            </Text>
          </Flex>
          <Flex direction="column" align="center" className="px-4 py-2 bg-red-50 rounded-lg">
            <Text size="4" weight="bold" className="text-red-700">
              {unmatchedCount.toLocaleString()}
            </Text>
            <Text size="1" className="text-red-600">
              Unmatched
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};

export default GeocoderSummary;
