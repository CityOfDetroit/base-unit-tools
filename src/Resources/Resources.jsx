import { Box, Card, Container, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { resourceList } from "../data/resources";
import Icon from "../components/Icon";

// Index of the long-form reference material on the site.
const Resources = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800">
      <Container size="2" className="min-h-96 py-6 px-4">
        <Box mb="5">
          <Heading size="6" className="cod-style" mb="2">
            Resources
          </Heading>
          <Text as="p" size="2">
            Guides and background on how Detroit's address data works, and how
            to use the tools on this site.
          </Text>
        </Box>

        <Grid columns={{ initial: "1", sm: "2" }} gap="4">
          {resourceList.map((r) => (
            <Link to={`/resources/${r.slug}`} key={r.slug}>
              <Card size="1" className="text-sm h-full">
                <Flex direction="row" align="center" gap="2" pb="2">
                  <Icon name={r.icon} />
                  <Text size="3" weight="medium">
                    {r.title}
                  </Text>
                </Flex>
                <Text>{r.description}</Text>
              </Card>
            </Link>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default Resources;
