import React from "react";
import apps from "./data/apps";
import { Box, Card, Container, Grid, Flex, Text } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Icon from "./components/Icon";

const Homepage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-gray-100 dark:bg-gray-800">
      <Container size={"2"} className="min-h-96">
        <Box py={"5"}>
          <h2 className="cod-style py-2">
            Welcome to the Base Units Tools site
          </h2>
          <p>
            Base Units are the fundamental units of measurement we use to
            describe our city.
          </p>
        </Box>
        <h3>Tools available on this site</h3>
        <Grid columns={"2"} gap={"4"} p={"3"}>
          {Object.keys(apps)
            .slice(1)
            .map((app) => {
              if (apps[app].private && !isAuthenticated) return;
              return (
                <Link to={apps[app].url}>
                  <Card size="1" className="text-sm" key={app}>
                    <Flex direction="row" align="center" gap="2" pb={"2"}>
                      <Icon name={apps[app].icon} />
                      <Text size={"3"} weight="medium">{apps[app].name}</Text>
                    </Flex>
                    <Text>{apps[app].description}</Text>
                  </Card>
                </Link>
              );
            })}
        </Grid>
      </Container>
    </div>
  );
};

export default Homepage;
