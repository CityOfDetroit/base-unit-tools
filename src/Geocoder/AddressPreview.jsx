import { Flex, Text } from "@radix-ui/themes";
import { CheckCircledIcon } from "@radix-ui/react-icons";

const AddressPreview = ({ addresses }) => {
  const previewCount = Math.min(5, addresses.length);
  const remainingCount = addresses.length - previewCount;

  return (
    <Flex
      direction="column"
      gap="2"
      className="p-3 bg-[#004445]/5 border border-[#004445]/20 rounded-lg mt-2"
    >
      <Flex align="center" gap="2">
        <CheckCircledIcon width="16" height="16" style={{ color: "#279989" }} />
        <Text size="2" weight="medium" style={{ color: "#004445" }}>
          {addresses.length.toLocaleString()} addresses ready to geocode
        </Text>
      </Flex>

      <Flex direction="column" gap="1" className="ml-6">
        <Text size="1" color="gray">
          Preview:
        </Text>
        {addresses.slice(0, previewCount).map((addr, i) => (
          <Text
            key={i}
            size="1"
            className="text-gray-600 truncate font-mono"
            style={{ maxWidth: "280px" }}
          >
            {addr}
          </Text>
        ))}
        {remainingCount > 0 && (
          <Text size="1" color="gray" className="italic">
            ...and {remainingCount.toLocaleString()} more
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

export default AddressPreview;
