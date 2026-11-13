import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Card, Code, Flex, Heading, Text } from "@radix-ui/themes";
import apps from "./data/apps";
import { useAuth } from "./contexts/AuthContext";
import Icon from "./components/Icon";

// Any path no route matches (Netlify sends every path to the app, so this is the 404 page).
const NotFound = () => {
  const { pathname } = useLocation();
  const { isAuthenticated, isInGroup } = useAuth();
  // same rule as the home page: private tools only when signed in, group tools only for members
  const tools = Object.values(apps).filter(
    (a) => a.show && a.url !== "/" && (!a.private || isAuthenticated) && (!a.group || isInGroup(a.group))
  );

  return (
    <Flex justify="center" align="center" px="4" py="9" style={{ minHeight: "60vh" }}>
      <Card size="4" style={{ maxWidth: 440, width: "100%" }}>
        <Flex direction="column" gap="5">
          <Flex align="center" gap="3">
            <img src="/logo-black.png" alt="City of Detroit logo" style={{ height: 44 }} />
            <Text size="2" color="gray">City of Detroit · Base Unit Tools</Text>
          </Flex>

          <Flex direction="column" gap="2">
            <Heading size="6">Page not found</Heading>
            <Text as="p" size="3" color="gray">
              There's nothing at <Code>{pathname}</Code>. It may have moved, or the link may be mistyped.
            </Text>
          </Flex>

          <Flex direction="column" gap="1">
            {tools.map((a) => (
              <Link key={a.url} to={a.url} className="flex items-center gap-2 rounded px-2 py-1 hover:bg-gray-100">
                <Icon name={a.icon} />
                <Text size="2">{a.name}</Text>
              </Link>
            ))}
          </Flex>

          <Button size="3" asChild>
            <Link to="/">Go to the home page</Link>
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
};

export default NotFound;
