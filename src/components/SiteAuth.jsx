import { EnterIcon, ExitIcon, PersonIcon } from "@radix-ui/react-icons";
import { Button, Flex, Text } from "@radix-ui/themes";
import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const SiteAuth = () => {
  const { isAuthenticated, username, handleSignIn, handleSignOut } = useAuth();

  return (
    <Flex
      direction={"column"}
      gap={"2"}
      gridColumn={{ initial: "auto", sm: "span 2" }}
      align={{ initial: "start", sm: "end" }}
      justify={{ initial: "start", sm: "end" }}
    >
      {isAuthenticated && (
          <Flex direction={"row"} gap={"2"} align={"center"}>
            <PersonIcon />
            <Text size={"1"} weight={"medium"} color="gray">
              {username}
            </Text>
            <Button
              onClick={handleSignOut}
              size={`1`}
              className="w-full"
              variant="soft"
              color="ruby"
            >
              <span>Log out</span>
              <ExitIcon />
            </Button>
          </Flex>
      )}
      {!isAuthenticated && (
        <Flex
          gap={"4"}
          direction="row"
          justify={{ initial: `start`, md: `end` }}
          align={"center"}
        >
          <Button onClick={handleSignIn} size={`1`} variant="soft" color="blue">
            <Text size={"1"} weight={"medium"}>
              ArcGIS Online login
            </Text>
            <EnterIcon />
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default SiteAuth;
