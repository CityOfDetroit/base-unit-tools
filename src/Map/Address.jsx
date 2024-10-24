import React from "react";
import { DataList, Flex, Text, Separator } from "@radix-ui/themes";
import moment from "moment";
import { Attribute, Category } from "../components/TableComponents";


const Address = ({ address }) => {

  if (!address) {
    return;
  }

  let { properties: props } = address;

  return (
    <>
      <Category label="Primary address">
        <Attribute label="Street number" value={props?.street_number} />
        <Attribute label="Street prefix" value={props?.street_prefix} />
        <Attribute label="Street name" value={props?.street_name} />
        <Attribute label="Street type" value={props?.street_type} />
      </Category>
      <Category label="Subaddress">
        <Attribute label="Unit type" value={props?.unit_type} />
        <Attribute label="Unit number" value={props?.unit_number} />
      </Category>
    </>
  );
};

export default Address;
