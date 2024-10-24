import { Card, Container, Flex, Grid, Separator, Text } from "@radix-ui/themes";
import React from "react";
import { Link } from "react-router-dom";
import apps from "./data/apps";
import SiteAuth from "./components/SiteAuth";
import { useAuth } from "./contexts/AuthContext";

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
          <Flex direction={"column"} gap={"2"} minWidth={`200px`}>
            {/* <h3>Tools</h3> */}
            <Flex direction={"column"} gap={"2"}>
              {filteredApps.map((key) => {
                return (
                  <Link to={apps[key].url} key={key}>
                    <Text size={"4"} weight="medium">{apps[key].name}</Text>
                  </Link>
                );
              })}
            </Flex>
          </Flex>

          <Flex direction={"column"} gap={"1"}>
            <h3>Resources</h3>
            <Link to="https://base-units-detroitmi.hub.arcgis.com/">
              <Text size={"2"}>Base Units Hub</Text>
            </Link>
            <Link to="https://data.detroitmi.gov/">
              <Text  size={"2"}>Open Data Portal</Text>
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
