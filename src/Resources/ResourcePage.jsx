import { Suspense } from "react";
import { Box, Container, Flex, Heading, Text } from "@radix-ui/themes";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { Link, useParams } from "react-router-dom";
import resources from "../data/resources";
import MdxProse from "../components/MdxProse";

// Renders a single resource's MDX content, looked up by slug.
const ResourcePage = () => {
  const { slug } = useParams();
  const resource = resources[slug];

  if (!resource) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800">
        <Container size="2" className="min-h-96 py-6 px-4">
          <Heading size="6" className="cod-style" mb="2">
            Resource not found
          </Heading>
          <Link to="/resources">
            <Text size="2" color="blue" className="underline">
              Back to all resources
            </Text>
          </Link>
        </Container>
      </div>
    );
  }

  const Content = resource.content;

  return (
    <div className="bg-gray-100 dark:bg-gray-800">
      <Container size="2" className="min-h-96 py-6 px-4">
        <Link to="/resources">
          <Flex align="center" gap="1" mb="3">
            <ChevronLeftIcon />
            <Text size="2" color="blue">
              All resources
            </Text>
          </Flex>
        </Link>

        <Heading size="6" className="cod-style" mb="1">
          {resource.title}
        </Heading>
        <Text as="p" size="1" color="gray" mb="4">
          Originally published {resource.published} · updated {resource.updated}
        </Text>

        {/* local boundary so the title stays put while the prose loads */}
        <Box mb="5">
          <MdxProse>
            <Suspense fallback={<Text size="2" color="gray">Loading…</Text>}>
              <Content />
            </Suspense>
          </MdxProse>
        </Box>
      </Container>
    </div>
  );
};

export default ResourcePage;
