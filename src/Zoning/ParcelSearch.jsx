import { useEffect, useState } from "react";
import { Button, Flex, Text, TextField } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import useGeocoder from "../hooks/useGeocoder";

// Matches a Detroit parcel id (so a pasted parcel number is added directly,
// without geocoding). Mirrors the pattern used in MapGeocoder.
const PARCEL_REGEX = /^([0,1,2][0-9])([0-9]{6,})([0-9A-Z.-]{1,})$/;

// Search box that geocodes an address (or accepts a parcel id) and adds the
// matching parcel to the amendment selection.
const ParcelSearch = ({ onAddParcel }) => {
  const { feature, error, loading, changeAddress } = useGeocoder();
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState(null);

  // when a geocode result arrives, add its parcel
  useEffect(() => {
    if (!feature) return;
    const pid = feature.attributes?.parcel_id;
    if (pid != null && String(pid).trim() !== "") {
      onAddParcel(String(pid));
      setMsg(null);
      setValue("");
    } else {
      setMsg("No parcel found at that location.");
    }
  }, [feature]);

  useEffect(() => {
    if (error) setMsg(typeof error === "string" ? error : "Address not found.");
  }, [error]);

  const submit = () => {
    const v = value.trim();
    if (!v) return;
    setMsg(null);
    if (PARCEL_REGEX.test(v)) {
      onAddParcel(v);
      setValue("");
    } else {
      changeAddress(v);
    }
  };

  return (
    <Flex direction="column" gap="1">
      <Flex gap="2" align="center">
        <TextField.Root
          placeholder="Search an address or parcel ID to add"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          size="2"
          className="flex-1"
        >
          <TextField.Slot>
            <MagnifyingGlassIcon />
          </TextField.Slot>
        </TextField.Root>
        <Button size="2" variant="soft" onClick={submit} disabled={loading}>
          {loading ? "…" : "Add"}
        </Button>
      </Flex>
      {msg && (
        <Text size="1" color="red">
          {msg}
        </Text>
      )}
    </Flex>
  );
};

export default ParcelSearch;
