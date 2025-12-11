import { Container, Flex, Grid, Separator, Text } from "@radix-ui/themes";
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import apps from "./data/apps";
import Icon from "./components/Icon";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

const SiteFooter = () => {
  // const { isDarkMode, toggleDarkMode } = useTheme();

  const { isAuthenticated, username, handleSignIn, handleSignOut } = useAuth();

  let filteredApps = Object.keys(apps).filter((app) => {
    if (apps[app].private && !isAuthenticated) return false;
    return true;
  });

  return (
    <footer className="p-2 sm:p-4">
      <Container size={"5"}>
        <Grid
          columns={{ initial: "1", xs: "2", sm: "4" }}
          rows={{ initial: "auto", sm: "1" }}
          gap={"4"}
        >
          <Flex direction={"column"} gap={"1"}>
            <Text size="2" weight={"bold"}>
              Tools
            </Text>
            {filteredApps.map((key) => {
              return (
                <Link to={apps[key].url} key={key}>
                  <Flex align="center" gap="2">
                    <Icon name={apps[key].icon} />
                    <Text size={"2"}>
                      {apps[key].name}
                    </Text>
                  </Flex>
                </Link>
              );
            })}
          </Flex>

          <Flex direction={"column"} gap={"1"}>
            <Text size="2" weight={"bold"}>
              Resources
            </Text>
            <Link to="/about">
              <Text size={"2"}>About the base units</Text>
            </Link>
            <Link to="https://data.detroitmi.gov/">
              <Text size={"2"}>Open Data Portal</Text>
            </Link>
          </Flex>
          <Flex direction={"column"} gap={"1"}>
            <Text size="2" weight={"bold"}>
              Base Units
            </Text>
            <Link to="/base-unit/address">
              <Text size={"2"}>Addresses</Text>
            </Link>
            <Link to="/base-unit/building">
              <Text size={"2"}>Buildings</Text>
            </Link>
            <Link to="/base-unit/parcel">
              <Text size={"2"}>Parcels</Text>
            </Link>
            <Link to="/base-unit/street">
              <Text size={"2"}>Streets</Text>
            </Link>
          </Flex>
          <Flex direction="column" gap="2">
            <Text size="2" weight={"bold"}>
              About this site
            </Text>
            <Link to="https://github.com/CityOfDetroit/base-unit-tools">
              <Flex direction="row" align="center" gap={"1"}>
                <Text size={"2"}>View on GitHub</Text>
                <GitHubLogoIcon />
              </Flex>
            </Link>
            <Link to="https://app.smartsheet.com/b/form/6919c51a844448e2a6811f04a6267292">
              <Flex direction="row" align="center" gap={"1"}>
                <Text size={"2"}>Contact/feedback form</Text>
              </Flex>
            </Link>
          </Flex>
        </Grid>
        <Separator size="4" className="my-4 w-svw" />
        <Flex align={"center"} className="w-full" justify={"center"}>
          <Text size={"1"} color="gray">
            City of Detroit, {new Date().getFullYear()}
          </Text>
        </Flex>
      </Container>
    </footer>
  );
};

export default SiteFooter;
