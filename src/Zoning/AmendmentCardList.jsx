import { Badge, Box, Button, Flex, Select, Text } from "@radix-ui/themes";
import { ArrowDownIcon, ArrowUpIcon, PlusIcon } from "@radix-ui/react-icons";
import { SORT_OPTIONS, deriveStatus, fmtDate, parseParcels } from "../data/zoning";

// Scrollable, sortable list of amendment cards.
const AmendmentCardList = ({
  records,
  loading,
  selectedId,
  parcelAddresses = {},
  listParcelAddresses = {},
  sortField,
  sortDir,
  onSortField,
  onToggleDir,
  onSelect,
  onNew,
}) => {
  // minWidth: 0 so the joined parcel-address line can truncate instead of
  // forcing the grid column wider than its 1fr share
  return (
    <Flex direction="column" gap="2" style={{ height: "80vh", minHeight: 0, minWidth: 0 }}>
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
            const addressLookup = selected
              ? { ...listParcelAddresses, ...parcelAddresses }
              : listParcelAddresses;
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
                  <Text weight="bold" size="2" className="truncate">
                    {a.file_number || `Record ${a.OBJECTID}`}
                  </Text>
                  {a.received_date && (
                    <Text size="1" color="gray" className="whitespace-nowrap">
                      {fmtDate(a.received_date)}
                    </Text>
                  )}
                </Flex>

                {(a.application_type || a.current_zoning || a.proposed_zoning) && (
                  <Text size="1" color="gray" className="block mt-1 truncate">
                    {a.application_type}
                    {(a.current_zoning || a.proposed_zoning) &&
                      `${a.application_type ? " · " : ""}${a.current_zoning || "?"} → ${
                        a.proposed_zoning || "?"
                      }`}
                  </Text>
                )}

                <Flex justify="between" align="center" gap="2" className="mt-2">
                  <Badge color="gray" variant="soft">
                    {deriveStatus(a)}
                  </Badge>
                  {a.assigned_to && (
                    <Text size="1" color="gray" className="whitespace-nowrap truncate">
                      {a.assigned_to}
                    </Text>
                  )}
                </Flex>

                {parcelIds.length > 0 && (
                  <Text
                    size="1"
                    color="gray"
                    className="block mt-2 pt-2 truncate"
                    style={{ borderTop: "1px solid var(--gray-a4)" }}
                  >
                    {parcelIds.map((id) => addressLookup[id] || id).join(", ")}
                  </Text>
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
