import { useEffect, useRef, useState } from "react";
import { Box, TextField } from "@radix-ui/themes";
import { ChevronDownIcon } from "@radix-ui/react-icons";

// Comma-separated tokens of the current value.
const tokens = (s) => s.split(",").map((t) => t.trim());
// The token currently being typed (after the last comma).
const lastToken = (s) => {
  const parts = s.split(",");
  return parts[parts.length - 1].trim();
};
// Replace the in-progress last token with a chosen option, keeping prior ones.
const withReplacedLast = (s, opt) => {
  const prev = s
    .split(",")
    .slice(0, -1)
    .map((t) => t.trim())
    .filter(Boolean);
  return [...prev, opt].join(", ");
};

// Lightweight combobox: suggests `options` (filtered by the last token) while
// still allowing free text — supports entering multiple values, e.g. "R1, B4".
const Combobox = ({
  value = "",
  options = [],
  onChange,
  placeholder = "Select or type…",
}) => {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const ref = useRef(null);

  const token = lastToken(value);
  const chosen = new Set(
    tokens(value)
      .slice(0, -1)
      .filter(Boolean)
      .map((t) => t.toUpperCase())
  );
  const filtered = options.filter(
    (o) =>
      !chosen.has(o.toUpperCase()) &&
      o.toLowerCase().includes(token.toLowerCase())
  );

  // keep the highlight in range as the list changes
  useEffect(() => {
    setHighlight(0);
  }, [value, open]);

  // close on outside click
  useEffect(() => {
    const onDocMouseDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const select = (opt) => {
    onChange(withReplacedLast(value, opt));
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (open && filtered[highlight]) {
        e.preventDefault();
        select(filtered[highlight]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <Box className="relative" ref={ref}>
      <TextField.Root
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      >
        <TextField.Slot side="right">
          <ChevronDownIcon
            style={{ cursor: "pointer", color: "var(--gray-9)" }}
            onClick={() => setOpen((o) => !o)}
          />
        </TextField.Slot>
      </TextField.Root>
      {open && filtered.length > 0 && (
        <Box
          className="absolute left-0 right-0 z-50 mt-1 rounded-md border overflow-y-auto py-1"
          style={{
            background: "var(--color-panel-solid)",
            borderColor: "var(--gray-a6)",
            boxShadow: "var(--shadow-4)",
            maxHeight: "200px",
          }}
        >
          {filtered.map((o, i) => (
            <Box
              key={o}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => select(o)}
              onMouseEnter={() => setHighlight(i)}
              className="px-3 py-1 cursor-pointer"
              style={{
                fontSize: "14px",
                background: i === highlight ? "var(--accent-a3)" : "transparent",
              }}
            >
              {o}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Combobox;
