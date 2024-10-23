import React from "react";
import apps from "./data/apps";
import { Box, Card, Container, Grid, IconButton } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

const Homepage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-gray-200 dark:bg-gray-800">
      <Container size={"2"} className="min-h-96">
        <Box pb={"4"}>
          <h2 className="cod-style py-2">
            Welcome to the Base Units Tools site
          </h2>
          <p>
            Base Units are the fundamental units of measurement we use to
            describe our city.
          </p>
          <a href="https://www.baseunits.com" target="_blank" rel="noreferrer">
            Learn more about them at our Hub Site.
          </a>
        </Box>
        <Grid columns={"2"} gap={"4"}>
          {Object.keys(apps)
            .slice(1)
            .map((app) => {
              if (apps[app].private && !isAuthenticated) return;
              return (
                <Link to={apps[app].url}>
                  <Card size="1" className="text-sm" key={app}>
                    <h4>{apps[app].name}</h4>
                    <p>{apps[app].description}</p>
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
