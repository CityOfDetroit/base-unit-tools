import React, { useEffect, useState } from "react";
import layers from "../data/layers";
import { queryFeatures } from "@esri/arcgis-rest-feature-service";
import {
  ArrowRightIcon,
  CaretDownIcon,
  CaretRightIcon,
  DownloadIcon,
  EnterIcon,
  PinRightIcon,
  SewingPinFilledIcon,
} from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import { Box, Button, Flex, Text, Card, Separator } from "@radix-ui/themes";
import * as Collapsible from "@radix-ui/react-collapsible";
import { CSVLink } from "react-csv";

const LinkedAddresses = ({
  layer,
  feature,
  refetch,
  linkedAddresses,
  setLinkedAddresses,
}) => {
  const [open, setOpen] = useState(true);

  let lyr = layers[layer];

  let [loading, setLoading] = useState(true);

  // Create a "collator": https://developer.mozilla.properties.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/compare
  let collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "base",
  });

  useEffect(() => {
    if (layer !== "address") {
      setLoading(true);
      queryFeatures({
        url: layers.address.endpoint,
        where: `${layer === "parcel" ? "parcel_id" : lyr.id_column} = ${
          layer === "parcel"
            ? `'${feature.properties.parcel_id}'`
            : feature.properties[lyr.id_column]
        }`,
        outFields: "*",
        f: "geojson",
      }).then((r) => {
        let sortedAddresses = r.features
          .sort((a, b) => {
            if (a.properties.unit_number === null) {
              return -1;
            }
            if (b.properties.unit_number === null) {
              return 1;
            } else {
              return collator.compare(
                a.properties.unit_number,
                b.properties.unit_number
              );
            }
          })
          .sort((a, b) => b.properties.unit_type - a.properties.unit_type)
          .sort(
            (a, b) => a.properties.street_number - b.properties.street_number
          )
          .sort((a, b) =>
            collator.compare(a.properties.street_name, b.properties.street_name)
          );

        setLinkedAddresses(sortedAddresses);
        setLoading(false);
      });
    }
  }, [feature]);

  useEffect(() => {
    if (layer === "address") {
      setLinkedAddresses([feature]);
      setLoading(false);
    }
  }, [layer]);

  if (layer === "address") {
    return;
  }

  const formattedData = linkedAddresses.map((address) => {
    let { properties: props, geometry } = address;

    return {
      address_id: props.address_id,
      street_number: props.street_number,
      street_prefix: props.street_prefix,
      street_name: props.street_name,
      street_type: props.street_type,
      unit_type: props.unit_type,
      unit_number: props.unit_number,
      city: props.city,
      state: props.state,
      zip: props.zip,
      lng: geometry?.coordinates[0].toFixed(6),
      lat: geometry?.coordinates[1].toFixed(6)
    };
  })

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Box>
        <Card style={{ backgroundColor: layers.address.bg_color }}>
          <Flex align={"center"} gap={"2"} className="dark:text-slate-700">
            <SewingPinFilledIcon />
            <Text size="2" weight={"medium"}>
              {!loading
                ? `${
                    linkedAddresses.length === 0 ? "No" : linkedAddresses.length
                  } addresses linked to this ${layer}`
                : "loading ..."}
            </Text>
            {linkedAddresses.length > 0 && (
              <Collapsible.Trigger as={Button} className="ml-auto">
                {open ? <CaretDownIcon /> : <CaretRightIcon />}
              </Collapsible.Trigger>
            )}
          </Flex>
        </Card>

        {!loading && linkedAddresses && (
          <Collapsible.Content>
            <Flex
              direction={"column"}
              p={"2"}
              className="max-h-48 lg:max-h-96 overflow-auto"
            >
              {linkedAddresses.map((address, idx) => {
                let { properties: props } = address;
                return (
                  <div key={address.id}>
                    <Flex
                      key={address.id}
                      direction={"row"}
                      justify={"start"}
                      align={"center"}
                      gap="4"
                    >
                      <Text size="2" weight={"bold"} className="w-full">
                        {props.street_number} {props.street_prefix}{" "}
                        {props.street_name} {props.street_type}{" "}
                        {props.unit_type} {props.unit_number}
                      </Text>
                      <Link to={`/map?id=${address.id}&layer=address`}>
                        <Box
                          className="rounded-full px-1"
                          style={{
                            backgroundColor: layers.address.bg_color,
                            opacity: 0.5,
                          }}
                        >
                          <Flex>
                            <Text
                              size="1"
                              weight={"bold"}
                              className="text-black p-1 font-mono"
                            >
                              #{props.address_id}
                            </Text>
                            <ArrowRightIcon
                              height="22"
                              width="22"
                              className="text-black p-1"
                            />
                          </Flex>
                        </Box>
                      </Link>
                    </Flex>
                    {idx + 1 < linkedAddresses.length && (
                      <Separator size={"4"} my={"1"} />
                    )}
                  </div>
                );
              })}
            </Flex>
            {formattedData.length > 1 && <div>
              <Separator size={"4"} />
              {/* add ability to Export as csv */}
              <Flex align={"end"} justify={"end"} className="w-full" mt={"2"}>
                <CSVLink
                  data={formattedData}
                  filename={`linked_addresses_${new Date().getTime()}.csv`}
                  className="mr-2"
                >
                  <Button size={"1"}>
                    <DownloadIcon />
                    Export .csv
                  </Button>
                </CSVLink>
              </Flex>
            </div>}
          </Collapsible.Content>
        )}
      </Box>
    </Collapsible.Root>
  );
};

export default LinkedAddresses;
