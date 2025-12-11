import area from "@turf/area";
import { Button, Card, Text, Flex } from "@radix-ui/themes";
import { TrashIcon, SizeIcon } from "@radix-ui/react-icons";

const MailerSelection = ({ geom, setGeom, resultIds }) => {
  const areaSquareMiles = (area(geom) * 0.000000386102).toFixed(3);
  const geometryType = geom?.features[0]?.geometry?.type || "Unknown";

  return (
    <Card className="bg-blue-50 border-blue-200">
      <Flex direction="column" gap="2">
        <Flex align="center" gap="2">
          <SizeIcon className="text-blue-600" />
          <Text size="2" weight="medium" className="text-blue-700">
            Current Selection: {geometryType}
          </Text>
        </Flex>

        <Flex direction="column" gap="1">
          <Text size="1" color="gray">
            Area: {areaSquareMiles} square miles
          </Text>
          {resultIds && (
            <Text size="1" color="gray">
              {resultIds.objectIds.length.toLocaleString()} addresses in selection
            </Text>
          )}
        </Flex>

        <Button
          size="1"
          variant="soft"
          color="red"
          onClick={() => setGeom(null)}
          className="mt-1"
        >
          <TrashIcon />
          Clear selection
        </Button>
      </Flex>
    </Card>
  );
};

export default MailerSelection;
