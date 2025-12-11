import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Card, Container, Flex, Text, Heading, Table } from "@radix-ui/themes";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import layers from "./data/layers";

// Import MDX content
import AddressContent from "./content/address.mdx";
import BuildingContent from "./content/building.mdx";
import ParcelContent from "./content/parcel.mdx";
import StreetContent from "./content/street.mdx";

const mdxContent = {
  address: AddressContent,
  building: BuildingContent,
  parcel: ParcelContent,
  street: StreetContent,
};

const useFeatureCount = (endpoint) => {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const url = `${endpoint}/query?where=1=1&returnCountOnly=true&f=json`;
        const response = await fetch(url);
        const data = await response.json();
        setCount(data.count);
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

const useLayerMetadata = (endpoint) => {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const url = `${endpoint}?f=json`;
        const response = await fetch(url);
        const data = await response.json();
        setMetadata(data);
      } catch (error) {
        console.error("Error fetching metadata:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetadata();
  }, [endpoint]);

  return { metadata, loading };
};

const descriptions = {
  address: {
    title: "Address Points",
    description: "Address points represent individual street addresses in Detroit. Each address is linked to a building, parcel, and street segment, forming the foundation of our location-based data.",
  },
  building: {
    title: "Buildings",
    description: "Buildings represent individual free-standing structures in Detroit. Each building is linked to a parcel and may contain one or more addresses.",
  },
  parcel: {
    title: "Parcels",
    description: "Parcels represent individual pieces of real property in Detroit. Parcels are the legal boundaries of land ownership and are used for tax assessment purposes.",
  },
  street: {
    title: "Streets",
    description: "Streets represent individual street segments in Detroit. Each street segment is linked to a street name and may have multiple addresses along its length.",
  },
};

const BaseUnitPage = () => {
  const { unit } = useParams();
  const layer = layers[unit];
  const info = descriptions[unit];
  const MdxContent = mdxContent[unit];

  const { count, loading: countLoading } = useFeatureCount(layer?.endpoint);
  const { metadata, loading: metadataLoading } = useLayerMetadata(layer?.endpoint);

  if (!layer || !info) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800">
        <Container size="2" className="min-h-96 py-6">
          <Heading size="6">Base unit not found</Heading>
          <Text as="p" size="2" mt="2">
            <Link to="/">Return to homepage</Link>
          </Text>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800">
      <Container size="2" className="min-h-96 py-6">
        <Heading size="6" className="cod-style" mb="6">
          {info.title}
        </Heading>

        {MdxContent && (
          <Box mb="5" className="mdx-content text-sm [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_li]:mb-1 [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:rounded [&_a]:text-blue-600 [&_a]:underline [&_table]:w-full [&_table]:border-collapse [&_table]:my-3 [&_th]:text-left [&_th]:p-2 [&_th]:bg-gray-100 [&_th]:border [&_th]:border-gray-300 [&_td]:p-2 [&_td]:border [&_td]:border-gray-300 [&_strong]:font-semibold">
            <MdxContent />
          </Box>
        )}

        <Box mb="5">
          <Heading size="4" mb="3">Current count</Heading>
          <Card size="2">
            <Flex direction="row" align="center" justify="between">
              <Flex direction="column" gap="1">
                <Text size="8" weight="bold" style={{ color: layer.color }}>
                  {countLoading ? "—" : count?.toLocaleString()}
                </Text>
                <Text size="2" color="gray">{layer.name} in Detroit</Text>
              </Flex>
              <Flex direction="column" gap="2" align="end">
                <Link to={`/map?layer=${unit}`}>
                  <Text size="2" color="blue">Explore on map →</Text>
                </Link>
                <a href={layer.endpoint} target="_blank" rel="noopener noreferrer" className="no-underline">
                  <Flex align="center" gap="1" className="hover:opacity-70 transition-opacity">
                    <ExternalLinkIcon width="12" height="12" />
                    <Text size="1" color="gray">data source</Text>
                  </Flex>
                </a>
              </Flex>
            </Flex>
          </Card>
        </Box>

        {metadata && !metadataLoading && (
          <Box mb="5">
            <Flex justify="between" align="center" mb="3">
              <Heading size="4">Data schema</Heading>
              <Text size="1" color="gray">
                {metadata.fields?.filter((field) =>
                  !field.name.toLowerCase().startsWith("shape") &&
                  !field.name.toLowerCase().startsWith("objectid") &&
                  field.type !== "esriFieldTypeOID" &&
                  field.type !== "esriFieldTypeGeometry"
                ).length} fields
              </Text>
            </Flex>
            <Card size="1" className="overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                <Table.Root size="1">
                  <Table.Header className="sticky top-0 z-10 bg-white dark:bg-gray-900">
                    <Table.Row>
                      <Table.ColumnHeaderCell>Field</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell className="hidden sm:table-cell">Type</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Alias</Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {metadata.fields
                      ?.filter((field) =>
                        !field.name.toLowerCase().startsWith("shape") &&
                        !field.name.toLowerCase().startsWith("objectid") &&
                        field.type !== "esriFieldTypeOID" &&
                        field.type !== "esriFieldTypeGeometry"
                      )
                      .map((field) => (
                      <Table.Row key={field.name}>
                        <Table.Cell>
                          <Text size="1" weight="medium" className="break-all">{field.name}</Text>
                        </Table.Cell>
                        <Table.Cell className="hidden sm:table-cell">
                          <Text size="1" color="gray">{field.type?.replace("esriFieldType", "")}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text size="1" color="gray" className="break-words">{field.alias}</Text>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </div>
            </Card>
          </Box>
        )}

        <Box>
          <Text size="2">
            <Link to="/about">← Learn more about how base units work together</Link>
          </Text>
        </Box>
      </Container>
    </div>
  );
};

export default BaseUnitPage;
