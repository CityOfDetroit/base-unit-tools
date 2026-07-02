import { Box, Button, Flex, Select, Text } from "@radix-ui/themes";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ExternalLinkIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import {
  SORT_OPTIONS,
  deriveStatus,
  fmtDate,
  parcelMapUrl,
  parseParcels,
} from "../data/zoning";
import ZoningBadge from "./ZoningBadge";

// Scrollable, sortable list of amendment cards.
const AmendmentCardList = ({
  records,
  loading,
  selectedId,
  parcelAddresses = {},
  parcelZoning = {},
  sortField,
  sortDir,
  onSortField,
  onToggleDir,
  onSelect,
  onNew,
}) => {
  return (
    <Flex direction="column" gap="2" style={{ height: "80vh", minHeight: 0 }}>
      <Flex justify="between" align="center">
        <Text size="5" weight="bold" className="text-[#004445]">
          Zoning Amendments
        </Text>
        <Button onClick={onNew} style={{ backgroundColor: "#004445" }}>
          <PlusIcon /> New
        </Button>
      </Flex>

      <Flex gap="2" align="center">
        <Text size="1" color="gray">
          Sort by
        </Text>
        <Select.Root value={sortField} onValueChange={onSortField}>
          <Select.Trigger />
          <Select.Content>
            {SORT_OPTIONS.map((o) => (
              <Select.Item key={o.value} value={o.value}>
                {o.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
        <Button
          size="1"
          variant="soft"
          onClick={onToggleDir}
          title={sortDir === "asc" ? "Ascending" : "Descending"}
        >
          {sortDir === "asc" ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </Button>
      </Flex>

      <Box style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        <Flex direction="column" gap="2" pr="2">
          {loading && (
            <Text size="2" color="gray">
              Loading…
            </Text>
          )}
          {!loading && records.length === 0 && (
            <Text size="2" color="gray">
              No amendments found.
            </Text>
          )}
          {records.map((a) => {
            const selected = a.OBJECTID === selectedId;
            const parcelIds = parseParcels(a.parcels);
            return (
              <Box
                key={a.OBJECTID}
                onClick={() => onSelect(a)}
                className="cursor-pointer rounded-md border p-3 transition-colors"
                style={{
                  borderColor: selected ? "var(--accent-8)" : "var(--gray-a5)",
                  backgroundColor: selected ? "var(--accent-a3)" : "transparent",
                }}
              >
                <Flex justify="between" align="start" gap="2">
                  <Box>
                    <Text weight="bold" size="2" as="div">
                      {a.file_number || `Record ${a.OBJECTID}`}
                    </Text>
                    {a.application_type && (
                      <Text size="1" color="gray" as="div">
                        {a.application_type}
                      </Text>
                    )}
                  </Box>
                  {a.received_date && (
                    <Text size="1" color="gray" className="whitespace-nowrap">
                      {fmtDate(a.received_date)}
                    </Text>
                  )}
                </Flex>
                {(a.current_zoning || a.proposed_zoning) && (
                  <Text size="1" color="gray" className="block mt-1">
                    {a.current_zoning || "?"} → {a.proposed_zoning || "?"}
                  </Text>
                )}
                <Flex justify="between" align="center" gap="2" className="mt-1">
                  <Text size="1">{deriveStatus(a)}</Text>
                  {a.assigned_to && (
                    <Text size="1" color="gray" className="whitespace-nowrap">
                      {a.assigned_to}
                    </Text>
                  )}
                </Flex>
                <Text size="1" color="gray" className="block mt-1">
                  {parcelIds.length} parcel{parcelIds.length === 1 ? "" : "s"}
                </Text>
                {selected && parcelIds.length > 0 && (
                  <Flex
                    direction="column"
                    gap="1"
                    className="mt-2 border-t border-gray-200 pt-2 max-h-48 overflow-y-auto"
                  >
                    {parcelIds.map((id) => (
                      <Flex key={id} justify="between" align="center" gap="2">
                        <Flex direction="column" className="min-w-0">
                          <Text size="1" className="truncate">
                            {parcelAddresses[id] || id}
                          </Text>
                          {parcelAddresses[id] && (
                            <Text size="1" color="gray" className="truncate">
                              {id}
                            </Text>
                          )}
                        </Flex>
                        <Flex align="center" gap="2" className="shrink-0">
                          <ZoningBadge zoning={parcelZoning[id]} />
                          <a
                            href={parcelMapUrl(id)}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center"
                            style={{ color: "var(--accent-11)" }}
                            title="Open parcel on the Base Units map"
                          >
                            <ExternalLinkIcon />
                          </a>
                        </Flex>
                      </Flex>
                    ))}
                  </Flex>
                )}
              </Box>
            );
          })}
        </Flex>
      </Box>
    </Flex>
  );
};

export default AmendmentCardList;
