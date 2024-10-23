import React from "react";
import { Text, Flex } from "@radix-ui/themes";
import {
  CheckCircledIcon,
  IdCardIcon,
  Link1Icon,
  Link2Icon,
} from "@radix-ui/react-icons";
import { Link } from "react-router-dom";

const CardLink = ({ text, url, icon }) => {
  return (
    <Flex align={"center"} justify={"end"}>
      <Text
        size={"1"}
        weight={"light"}
        className="flex items-center justify-end gap-1"
        trim="both"
      >
        <Link to={url}>
        <Flex align={"center"} gap={"1"}>

          {icon}
          {text}
        </Flex>
        </Link>
      </Text>
    </Flex>
  );
};

export const DataSource = ({ url }) => {
  return <CardLink text={"source"} url={url} icon={<CheckCircledIcon />} />;
};

export const FeatureLink = ({ url }) => {
  return <CardLink text={"permalink"} url={url} icon={<Link1Icon />} />;
};

export default CardLink;
