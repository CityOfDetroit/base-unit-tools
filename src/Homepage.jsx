import React, { useEffect, useState } from "react";
import { queryFeatures } from "@esri/arcgis-rest-feature-service";
import apps from "./data/apps";
import layers from "./data/layers";
import {
  Box,
  Card,
  Container,
  Grid,
  Flex,
  Text,
  Heading,
} from "@radix-ui/themes";
import {
  InfoCircledIcon,
  CheckCircledIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Icon from "./components/Icon";

const BigNumber = ({ label, count, color, loading, endpoint, unitKey }) => {
  return (
    <Card size="2">
      <Link to={`/base-unit/${unitKey}`} className="no-underline">
        <Flex
          direction="column"
          align="center"
          gap="1"
          py="2"
          className="hover:opacity-80 transition-opacity"
        >
          <Text size="8" weight="bold" style={{ color }}>
            {loading ? "—" : count?.toLocaleString()}
          </Text>
          <Text size="2" color="gray">
            {label}
          </Text>
        </Flex>
      </Link>
      <Flex justify="end">
        <a
          href={endpoint}
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline"
        >
          <Flex
            align="center"
            gap="1"
            className="hover:opacity-70 transition-opacity"
          >
            <CheckCircledIcon width="10" height="10" />
            <Text size="1" color="gray">
              source
            </Text>
          </Flex>
        </a>
      </Flex>
    </Card>
  );
};

const useFeatureCount = (endpoint) => {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await queryFeatures({
          url: endpoint,
          where: "1=1",
          returnCountOnly: true,
        });
        setCount(response.count);
      } catch (error) {
        console.error("Error fetching count:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCount();
  }, [endpoint]);

  return { count, loading };
};

const Homepage = () => {
  const { isAuthenticated } = useAuth();
  const [chromeNoticeOpen, setChromeNoticeOpen] = useState(false);

  const addresses = useFeatureCount(layers.address.endpoint);
  const buildings = useFeatureCount(layers.building.endpoint);
  const parcels = useFeatureCount(layers.parcel.endpoint);
  const streets = useFeatureCount(layers.street.endpoint);

  return (
    <div className="bg-gray-100 dark:bg-gray-800">
      <Container size="2" className="min-h-96 px-4">
        <Box py="5">
          <Heading size="6" className="cod-style" mb="2">
            Welcome to the Base Unit Tools site
          </Heading>
          <Text as="p" size="2" mb="3">
            Base Units are the fundamental units of measurement we use to
            describe our city.
          </Text>
          <Link to="/about">
            <Text size="2" color="blue" className="underline">
              Learn more about the base units →
            </Text>
          </Link>
        </Box>

        <Box
          mb="5"
          className="rounded-md overflow-hidden"
          style={{ backgroundColor: "#004445" }}
        >
          <Box className="p-4">
            <Flex gap="3" align="start">
              <InfoCircledIcon
                width="20"
                height="20"
                style={{ color: "#feb70d", flexShrink: 0, marginTop: "2px" }}
              />
              <Text size="2" style={{ color: "#f2f2f2" }}>
                <Text as="span" weight="medium" style={{ color: "#feb70d" }}>
                  City employees:
                </Text>{" "}
                You will need to sign in with <Link to="https://detroitmi.maps.arcgis.com">ArcGIS Online</Link> to access employee-only
                tools.
              </Text>
            </Flex>
          </Box>
          <Box
            className="px-4 py-2 cursor-pointer transition-colors"
            style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
            onClick={() => setChromeNoticeOpen(!chromeNoticeOpen)}
          >
            <Flex align="center" gap="2">
              {chromeNoticeOpen ? (
                <ChevronDownIcon
                  width="14"
                  height="14"
                  style={{ color: "#9fd5b3" }}
                />
              ) : (
                <ChevronRightIcon
                  width="14"
                  height="14"
                  style={{ color: "#9fd5b3" }}
                />
              )}
              <ExclamationTriangleIcon
                width="14"
                height="14"
                style={{ color: "#feb70d" }}
              />
              <Text size="2" style={{ color: "#9fd5b3" }}>
                Chrome users on City network or VPN
              </Text>
            </Flex>
          </Box>
          {chromeNoticeOpen && (
            <Box
              className="px-4 pb-4 pt-2"
              style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
            >
              <Text size="2" style={{ color: "#f2f2f2" }}>
                If you're experiencing issues loading data, you may need to
                allow "Private network access" in Chrome. Click the icon in the
                address bar (left of the URL) and enable access to internal
                network resources.
              </Text>
            </Box>
          )}
        </Box>

        <Box mb="5">
          <Heading size="4" mb="3">
            Tools available on this site
          </Heading>
          <Grid columns={{ initial: "1", sm: "2" }} gap="4">
            {Object.keys(apps)
              .slice(1)
              .map((app) => {
                if (apps[app].private && !isAuthenticated) return null;
                return (
                  <Link to={apps[app].url} key={app}>
                    <Card size="1" className="text-sm">
                      <Flex direction="row" align="center" gap="2" pb="2">
                        <Icon name={apps[app].icon} />
                        <Text size="3" weight="medium">
                          {apps[app].name}
                        </Text>
                      </Flex>
                      <Text>{apps[app].description}</Text>
                    </Card>
                  </Link>
                );
              })}
          </Grid>
        </Box>

        <Box pb="5">
          <Heading size="4" mb="3">
            Current base units count
          </Heading>
          <Grid columns={{ initial: "1", sm: "2" }} gap="4">
            <BigNumber
              label="Addresses"
              count={addresses.count}
              loading={addresses.loading}
              color={layers.address.color}
              endpoint={layers.address.endpoint}
              unitKey="address"
            />
            <BigNumber
              label="Buildings"
              count={buildings.count}
              loading={buildings.loading}
              color={layers.building.color}
              endpoint={layers.building.endpoint}
              unitKey="building"
            />
            <BigNumber
              label="Parcels"
              count={parcels.count}
              loading={parcels.loading}
              color={layers.parcel.color}
              endpoint={layers.parcel.endpoint}
              unitKey="parcel"
            />
            <BigNumber
              label="Streets"
              count={streets.count}
              loading={streets.loading}
              color={layers.street.color}
              endpoint={layers.street.endpoint}
              unitKey="street"
            />
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default Homepage;
