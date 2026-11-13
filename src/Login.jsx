import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { useAuth } from "./contexts/AuthContext";
import apps from "./data/apps";
import Icon from "./components/Icon";

// Shown when a signed-out user opens a protected tool (/login?app=<tool>).
const Login = () => {
  const { isAuthenticated, handleSignIn } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const appKey = params.get("app");
  const app = apps[appKey];

  // once signed in, carry on to the tool that was asked for
  useEffect(() => {
    if (isAuthenticated) navigate(`/${appKey ?? ""}`);
  }, [isAuthenticated]);

  return (
    <Flex justify="center" align="center" px="4" py="9" style={{ minHeight: "60vh" }}>
      <Card size="4" style={{ maxWidth: 440, width: "100%" }}>
        <Flex direction="column" gap="5">
          <Flex align="center" gap="3">
            <img src="/logo-black.png" alt="City of Detroit logo" style={{ height: 44 }} />
            <Text size="2" color="gray">City of Detroit · Base Unit Tools</Text>
          </Flex>

          <Box>
            <Flex align="center" gap="2" mb="2">
              {app?.icon && <Icon name={app.icon} width={22} height={22} />}
              <Heading size="6">{app?.name ?? "Sign in"}</Heading>
            </Flex>
            {app?.description && (
              <Text as="p" size="3" color="gray">
                {app.description}
              </Text>
            )}
          </Box>

          <Text as="p" size="2">
            This tool uses City data that's only available to City of Detroit staff. Sign in with your City
            employee account to continue.
          </Text>

          <Button size="3" onClick={handleSignIn}>
            Sign in with City of Detroit
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
};

export default Login;
