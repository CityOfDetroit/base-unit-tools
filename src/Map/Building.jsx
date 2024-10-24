import React from "react";
import { DataList, Flex, Text, Separator } from "@radix-ui/themes";
import moment from "moment";
import { Attribute, Category } from "../components/TableComponents";


const Building = ({ building }) => {

  if (!building) {
    return;
  }

  let { properties: props } = building;

  return (
    <>
      <Category label="Building">
        <Attribute label="Status" value={props?.status} />
      </Category>
    </>
  );
};

export default Building;
