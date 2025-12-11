import { Flex, Text } from "@radix-ui/themes";
import { Link2Icon } from "@radix-ui/react-icons";

/**
 * Shared wrapper for map control components (geocoder, basemap, mode, streetview).
 * Provides consistent icon + title header styling with fixed height.
 *
 * @param {ReactNode} icon - Icon component to display
 * @param {string} title - Title text for the control
 * @param {ReactNode} children - Control content
 * @param {boolean} large - If true, allows larger content area
 * @param {string} sourceUrl - Optional URL to link to the data source
 */
const MapControl = ({ icon, title, children, large = false, sourceUrl }) => {
  return (
    <Flex direction="column" gap="1" className={large ? "" : "h-14 justify-between"}>
      <Flex align="center" gap="2" justify="between">
        <Flex align="center" gap="2">
          <span className="text-gray-500">{icon}</span>
          <Text size="1" weight="medium" color="gray">
            {title}
          </Text>
        </Flex>
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-600"
          >
            <Link2Icon width="12" height="12" />
          </a>
        )}
      </Flex>
      <Flex align="center" className={large ? "" : "h-7"}>
        {children}
      </Flex>
    </Flex>
  );
};

export default MapControl;
