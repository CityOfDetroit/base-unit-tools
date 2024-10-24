import area from "@turf/area";
import { Button, Card, Text, Flex } from "@radix-ui/themes";

const MailerSelection = ({ geom, setGeom, resultIds }) => {
  return (
    <Card>
      <Flex direction="column">
        <Text weight="medium">Current selection:</Text>
        <Text size={"1"}>{(area(geom) * 0.000000386102).toFixed(3)} square miles</Text>
        {resultIds && (
          <Text size="1">
            {resultIds.objectIds.length.toLocaleString()} total addresses in the
            selection area
          </Text>
        )}
        <Button size={"1"} mt={"3"} onClick={() => setGeom(null)} color="tomato">
          <Text>Delete current selection</Text>
        </Button>
      </Flex>
    </Card>
  );
};

export default MailerSelection;
