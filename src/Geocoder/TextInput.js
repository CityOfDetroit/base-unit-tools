import React, { useEffect, useMemo, useState } from "react";

export const TextInput = ({ setAddresses }) => {
  // we store the user input in value
  let [value, setValue] = useState("");

  const addresses = useMemo(() => value.split("\n").filter((a) => a !== ""));

  useEffect(() => {
    setAddresses(addresses);
  }, [value]);

  return (
    <div className="py-3 bg-gray-100">
      <p className="font-semibold">Type one address per line</p>
      <textarea
        className="mt-2 border w-full p-2 text-sm"
        value={value}
        rows={8}
        type="text"
        onChange={(e) => setValue(e.target.value)} />
    </div>
  );
};
