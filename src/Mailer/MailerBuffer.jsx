import buffer from "@turf/buffer";
import difference from "@turf/difference";
import { useState } from "react";
import { Button, Card, Text, Flex, Select, TextField } from "@radix-ui/themes";
import { AllSidesIcon, EnterFullScreenIcon } from "@radix-ui/react-icons";

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

  return (
    <Card>
        <Flex gap={"2"} direction="column">
        <Text size="2" weight={"medium"}>Buffer current selection</Text>

        <Flex>

        <TextField.Root
          type="number"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
        >
          <TextField.Slot></TextField.Slot>
        </TextField.Root>
      
        <Select.Root value={unit} onValueChange={(value) => setUnit(value)}>
          <Select.Trigger />
          <Select.Content>

          {Object.keys(units).map((u) => (
            <Select.Item value={u} key={u}>
              {u}
            </Select.Item>
          ))}
          </Select.Content>
        </Select.Root>
          </Flex>

        <Flex gap="2">

        <Button
          onClick={() =>
            setGeom(buffer(geom, distanceInMiles, { units: "miles" }))
          }
          text={`${distance} ${unit}`}
          size={"1"}
          >
          {`${distance} ${unit}`}
          <AllSidesIcon />
        </Button>
        <Button
          onClick={() => {
            let originalGeom = geom;
            let buffered = buffer(geom, distanceInMiles, { units: "miles" });
            let diff = difference(
              { type: "FeatureCollection", features: [
                buffered.features[0],
                originalGeom.features[0]
              ]
              }
            );
            let diffFc = { type: "FeatureCollection", features: [diff] };
            setGeom(diffFc);
          }}
          size={"1"}
          >
          {`${distance} ${unit} (buffer only)`}
        </Button>
          </Flex>
        </Flex>
    </Card>
  );
};

export default MailerBuffer;
