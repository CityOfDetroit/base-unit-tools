import { useState } from "react";
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Spinner,
  Switch,
  Text,
} from "@radix-ui/themes";
import {
  ArrowLeftIcon,
  CheckCircledIcon,
  Cross2Icon,
  ExclamationTriangleIcon,
  ExternalLinkIcon,
  Pencil1Icon,
} from "@radix-ui/react-icons";
import {
  FIELD_BY_NAME,
  FIELD_GROUPS,
  REQUIRED_FIELDS,
  ZONING_FIELDS,
  fmtDate,
  isValidApplicationYear,
  parcelMapUrl,
  parseParcels,
} from "../data/zoning";
import FieldInput from "./FieldInput";
import ParcelSearch from "./ParcelSearch";
import ParcelSelectionPanel from "./ParcelSelectionPanel";
import ZoningBadge from "./ZoningBadge";
import ZoningMap from "./ZoningMap";
import AmendmentMiniMap from "./AmendmentMiniMap";

// Fields shown above the map; the rest render in the details grid.
const TOP_FIELDS = ["application_type", "application_description"];
const MAP_HEIGHT = "360px";

// Read-only rendering of a field, mirroring FieldInput's label markup.
const ReadField = ({ field, value }) => {
  const display =
    field.type === "date" ? fmtDate(value) : value == null ? "" : String(value);
  return (
    <Box>
      <Text as="div" size="1" weight="medium" color="gray" mb="1">
        {field.label}
      </Text>
      <Text
        size="2"
        style={{ whiteSpace: field.type === "textarea" ? "pre-wrap" : "normal" }}
      >
        {display || "—"}
      </Text>
    </Box>
  );
};

const renderField = (field, { editing, values, onAttrChange }) =>
  editing ? (
    <FieldInput
      key={field.name}
      field={field}
      value={values[field.name]}
      onChange={onAttrChange}
    />
  ) : (
    <ReadField key={field.name} field={field} value={values[field.name]} />
  );

// Read-only list of affected parcels (view mode counterpart of ParcelSelectionPanel).
const AffectedParcels = ({ parcelIds, parcelAddresses = {}, parcelZoning = {} }) => (
  <Card>
    <Text weight="bold" size="3" className="mb-2 block">
      Affected parcels ({parcelIds.length})
    </Text>
    {parcelIds.length === 0 ? (
      <Text size="2" color="gray">
        No parcels recorded for this amendment.
      </Text>
    ) : (
      <Flex direction="column" gap="1" className="max-h-60 overflow-y-auto">
        {parcelIds.map((id) => (
          <Flex
            key={id}
            justify="between"
            align="center"
            gap="2"
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
              <ZoningBadge zoning={parcelZoning[id]} />
              <a
                href={parcelMapUrl(id)}
                target="_blank"
                rel="noreferrer"
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
  </Card>
);

// Unified amendment view. The same layout renders in read-only ("view") and
// editable ("edit") modes; only the leaf controls differ.
const AmendmentView = ({
  editing,
  mode,
  values,
  onAttrChange,
  // view-mode map
  geometry,
  // edit-mode parcels + map
  selectedIds,
  parcelAddresses,
  parcelZoning,
  dissolved,
  onToggleParcel,
  onAddParcel,
  onRemoveParcel,
  onClearParcels,
  // edit-mode actions
  saving,
  canSave,
  status,
  onSave,
  onDismissStatus,
  // shared actions
  onEdit,
  onCancel,
  // provenance
  editedBy,
  editedOn,
}) => {
  // whether the zoning-districts overlay is shown on the map (both modes)
  const [showZoning, setShowZoning] = useState(false);

  if (!values) {
    return (
      <Flex align="center" justify="center" gap="2" className="p-8">
        <Spinner /> <Text color="gray">Loading…</Text>
      </Flex>
    );
  }

  const topFields = ZONING_FIELDS.filter((f) => TOP_FIELDS.includes(f.name));
  const ctx = { editing, values, onAttrChange };
  const parcelIds = parseParcels(values.parcels);
  const title =
    values.file_number || (mode === "new" ? "New amendment" : "Amendment");
  const missingRequired = editing
    ? REQUIRED_FIELDS.filter((n) => String(values[n] ?? "").trim() === "")
    : [];
  const invalidApplicationYear =
    editing &&
    String(values.application_year ?? "").trim() !== "" &&
    !isValidApplicationYear(values.application_year);

  return (
    <Flex direction="column" gap="3">
      {/* header bar — same shell, different controls */}
      <Flex justify="between" align="center" gap="2" wrap="wrap">
        {editing ? (
          <Button variant="soft" onClick={onCancel}>
            <ArrowLeftIcon /> {mode === "new" ? "Cancel" : "Back"}
          </Button>
        ) : (
          <span />
        )}
        <Flex
          direction="column"
          align="center"
          gap="1"
          style={{ flex: 1, minWidth: 0 }}
        >
          <Text size="5" weight="bold" className="text-[#004445]">
            {title}
          </Text>
          {editing && !values.file_number && (
            <Text size="1" color="gray">
              File number is assigned automatically on save.
            </Text>
          )}
        </Flex>
        {editing ? (
          <Button
            size="3"
            disabled={!canSave}
            onClick={onSave}
            style={canSave ? { backgroundColor: "#004445" } : {}}
          >
            {saving ? <Spinner /> : null}
            {mode === "edit" ? "Save changes" : "Create amendment"}
          </Button>
        ) : (
          <Button onClick={onEdit} style={{ backgroundColor: "#004445" }}>
            <Pencil1Icon /> Edit
          </Button>
        )}
      </Flex>

      {editing && missingRequired.length > 0 && (
        <Text size="1" color="gray">
          Required before saving:{" "}
          {missingRequired.map((n) => FIELD_BY_NAME[n]?.label || n).join(", ")}.
        </Text>
      )}

      {editing && invalidApplicationYear && (
        <Text size="1" color="red">
          Application year must be a 4-digit year after 2000.
        </Text>
      )}

      {editing && status && (
        <Flex
          align="center"
          justify="between"
          gap="2"
          className="rounded-md px-3 py-2"
          style={{
            backgroundColor: status.ok ? "var(--green-3)" : "var(--red-3)",
            color: status.ok ? "var(--green-11)" : "var(--red-11)",
          }}
        >
          <Flex align="center" gap="2">
            {status.ok ? <CheckCircledIcon /> : <ExclamationTriangleIcon />}
            <Text size="2">{status.message}</Text>
          </Flex>
          <Button
            size="1"
            variant="ghost"
            color="gray"
            onClick={onDismissStatus}
            aria-label="Dismiss"
          >
            <Cross2Icon />
          </Button>
        </Flex>
      )}

      {/* combined block: type + description, then parcels beside the map */}
      <Card>
        <Flex direction="column" gap="3">
          {topFields.map((f) => renderField(f, ctx))}
          {editing && <ParcelSearch onAddParcel={onAddParcel} />}
          <Flex direction={{ initial: "column", md: "row" }} gap="3" align="stretch">
            <Box className="md:w-80 md:shrink-0">
              {editing ? (
                <ParcelSelectionPanel
                  selectedIds={selectedIds}
                  parcelAddresses={parcelAddresses}
                  parcelZoning={parcelZoning}
                  onRemove={onRemoveParcel}
                  onClear={onClearParcels}
                />
              ) : (
                <AffectedParcels
                  parcelIds={parcelIds}
                  parcelAddresses={parcelAddresses}
                  parcelZoning={parcelZoning}
                />
              )}
            </Box>
            <Box className="flex-1 min-w-0">
              {editing ? (
                <ZoningMap
                  selectedIds={selectedIds}
                  onToggleParcel={onToggleParcel}
                  dissolved={dissolved}
                  showZoning={showZoning}
                  height={MAP_HEIGHT}
                />
              ) : (
                <AmendmentMiniMap
                  geometry={geometry}
                  showZoning={showZoning}
                  height={MAP_HEIGHT}
                />
              )}
              <Flex asChild align="center" gap="2" className="mt-2">
                <label style={{ cursor: "pointer", width: "fit-content" }}>
                  <Switch
                    size="1"
                    checked={showZoning}
                    onCheckedChange={setShowZoning}
                  />
                  <Text size="1" color="gray">
                    Show current zoning districts
                  </Text>
                </label>
              </Flex>
              {editing && (
                <Text size="1" color="gray" className="mt-1 block">
                  Click parcels to add or remove them. The red outline previews
                  the dissolved amendment boundary that will be saved.
                </Text>
              )}
            </Box>
          </Flex>
        </Flex>
      </Card>

      {/* details, grouped by workflow stage */}
      <Card>
        <Text weight="bold" size="3" className="mb-3 block">
          Amendment details
        </Text>
        <Flex direction="column" gap="4">
          {FIELD_GROUPS.map((group) => (
            <Box key={group.title}>
              <Text
                size="2"
                weight="bold"
                className="mb-2 block"
                style={{ color: "var(--accent-11)" }}
              >
                {group.title}
              </Text>
              <Grid columns={{ initial: "1", md: "2" }} gap="3">
                {group.fields.map((name) =>
                  renderField(FIELD_BY_NAME[name], ctx)
                )}
              </Grid>
            </Box>
          ))}
        </Flex>
      </Card>

      {(editedBy || editedOn) && (
        <Text size="1" color="gray">
          Last edited{editedBy ? ` by ${editedBy}` : ""}
          {editedOn ? ` on ${editedOn}` : ""}.
        </Text>
      )}
    </Flex>
  );
};

export default AmendmentView;
