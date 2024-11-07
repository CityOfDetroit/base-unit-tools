import React from "react";
import { DataList, Flex, Text, Separator } from "@radix-ui/themes";
import moment from "moment";
import { Attribute, Category } from "../components/TableComponents";


const Street = ({ street }) => {

  if (!street) {
    return;
  }

  let { properties: props } = street;

  return (
    <>
      <Category label="Name">
        <Attribute label="Street prefix" value={props?.street_prefix} />
        <Attribute label="Street name" value={props?.street_name} />
        <Attribute label="Street type" value={props?.street_type} />
      </Category>
      <Category label="Address ranges">
        <Attribute label="MGF - Left range" value={`${props.from_address_left} - ${props.to_address_left}`} />
        <Attribute label="MGF - Right range" value={`${props.from_address_right} - ${props.to_address_right}`} />
      </Category>
      <Category label="Classification">
        <Attribute label="Jurisdiction" value={props?.legal_system} />
        <Attribute label="Functional class code" value={props?.functional_class_code} />
      </Category>
    </>
  );
};

export default Street;
