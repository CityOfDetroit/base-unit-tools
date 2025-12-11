import buffer from "@turf/buffer";
import difference from "@turf/difference";
import { useState } from "react";
import { Button, Card, Text, Flex, Select, TextField } from "@radix-ui/themes";
import { AllSidesIcon, BorderSolidIcon } from "@radix-ui/react-icons";

const MailerBuffer = ({ geom, setGeom }) => {
  // set up a default distance of 300
  let [distance, setDistance] = useState(300);

  // units we want to support, and a conversion factor to miles.
  let units = {
    feet: 0.000189394,
    meters: 0.000621371,
    yards: 0.000568182,
  };

  // set up with the first unit as default
  let [unit, setUnit] = useState(Object.keys(units)[0]);

  // calculate the distance in miles with the conversion factor
  let distanceInMiles = distance * units[unit];

  const handleFullBuffer = () => {
    setGeom(buffer(geom, distanceInMiles, { units: "miles" }));
  };

  const handleRingBuffer = () => {
    let originalGeom = geom;
    let buffered = buffer(geom, distanceInMiles, { units: "miles" });
    let diff = difference({
      type: "FeatureCollection",
      features: [buffered.features[0], originalGeom.features[0]],
    });
    let diffFc = { type: "FeatureCollection", features: [diff] };
    setGeom(diffFc);
  };

  return (
    <Card>
      <Flex gap="3" direction="column">
        <Text size="2" weight="bold">
          Buffer Selection
        </Text>
        <Text size="1" color="gray">
          Expand your selection area by a specified distance. Required for lines and points.
        </Text>

        <Flex gap="2" align="center">
          <TextField.Root
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="w-24"
          />
          <Select.Root value={unit} onValueChange={(value) => setUnit(value)}>
            <Select.Trigger className="w-24" />
            <Select.Content>
              {Object.keys(units).map((u) => (
                <Select.Item value={u} key={u}>
                  {u}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>

        <Flex gap="2" wrap="wrap">
          <Button
            onClick={handleFullBuffer}
            size="2"
            style={{ backgroundColor: "#004445" }}
          >
            <AllSidesIcon />
            Apply buffer
          </Button>
          <Button onClick={handleRingBuffer} size="2" variant="outline">
            <BorderSolidIcon />
            Ring only
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};

export default MailerBuffer;
