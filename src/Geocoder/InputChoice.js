import React from "react";
import { ToggleButton } from "../components/ToggleButton";
export const InputChoice = ({ setOptions, options }) => {
  return (
    <div className="flex items-center justify-center">
      <ToggleButton
        title={`CSV Upload`}
        active={options.mode === "upload"}
        onClick={() => setOptions({ ...options, mode: "upload" })}
      />
      <ToggleButton
        title={`Manual`}
        active={options.mode === "manual"}
        onClick={() => setOptions({ ...options, mode: "manual" })}
      />
    </div>
  );
};
