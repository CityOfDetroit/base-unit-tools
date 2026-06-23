import { Badge, Button, Card, Flex, Text } from "@radix-ui/themes";
import {
  Cross2Icon,
  ExclamationTriangleIcon,
  ExternalLinkIcon,
} from "@radix-ui/react-icons";
import { PARCELS_FIELD_MAX, parcelMapUrl } from "../data/zoning";

// Lists the parcels currently in the amendment grouping.
const ParcelSelectionPanel = ({
  selectedIds,
  parcelAddresses = {},
  onRemove,
  onClear,
}) => {
  const parcelsString = selectedIds.join("|");
  const overLimit = parcelsString.length > PARCELS_FIELD_MAX;

  return (
    <Card>
      <Flex justify="between" align="center" className="mb-2">
        <Text weight="bold" size="3">
          Selected parcels <Badge color="blue">{selectedIds.length}</Badge>
        </Text>
        {selectedIds.length > 0 && (
          <Button size="1" variant="soft" color="red" onClick={onClear}>
            Clear all
          </Button>
        )}
      </Flex>

      {selectedIds.length === 0 ? (
        <Text size="2" color="gray">
          Click parcels on the map to add them to this amendment.
        </Text>
      ) : (
        <>
          <Flex direction="column" gap="1" className="max-h-48 overflow-y-auto">
            {selectedIds.map((id) => (
              <Flex
                key={id}
                justify="between"
                align="center"
                className="border-b border-gray-100 py-1"
              >
                <Flex direction="column" className="min-w-0">
                  <Text size="2" className="truncate">
                    {parcelAddresses[id] || id}
                  </Text>
                  {parcelAddresses[id] && (
                    <Text size="1" color="gray" className="truncate">
                      {id}
                    </Text>
                  )}
                </Flex>
                <Flex align="center" gap="2" className="shrink-0">
                  <a
                    href={parcelMapUrl(id)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center underline"
                    style={{ color: "var(--accent-11)" }}
                    title="Open parcel on the Base Units map"
                  >
                    <ExternalLinkIcon />
                  </a>
                  <Button
                    size="1"
                    variant="ghost"
                    color="red"
                    onClick={() => onRemove(id)}
                  >
                    <Cross2Icon />
                  </Button>
                </Flex>
              </Flex>
            ))}
          </Flex>

          <Text
            size="1"
            color={overLimit ? "red" : "gray"}
            className="mt-2 block"
          >
            {overLimit && (
              <ExclamationTriangleIcon className="inline mr-1 text-red-600" />
            )}
            {`parcels field: ${parcelsString.length} / ${PARCELS_FIELD_MAX} chars`}
            {overLimit && " — too long to save, remove some parcels."}
          </Text>
        </>
      )}
    </Card>
  );
};

export default ParcelSelectionPanel;
