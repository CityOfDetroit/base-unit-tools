import React from "react";
import CSVReader from "react-csv-reader";

export const CsvInput = ({ csv, setCsv, addresses, setAddresses }) => {
  return (
    <div className="flex flex-col gap-3 py-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold">Upload file </span>
        <CSVReader
          parserOptions={{ header: true }}
          onFileLoaded={(data, fileInfo) => setCsv(data)} />
      </div>
      {csv && (
        <div className="flex items-center justify-between">
          <p className="font-semibold">Choose address column</p>
          <select
            className="p-1 w-1/2"
            onChange={(e) => {
              setAddresses(csv.map((r) => r[e.target.value]));
            }}
          >
            <option value={`-`}>{`-`}</option>
            {Object.keys(csv[0]).map((d, i) => (
              <option value={d} key={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      )}
      {addresses.length > 0 && (
        <div className="w-full flex items-center justify-between">
          <span className="font-semibold">Example addresses</span>
          <span>{addresses.slice(0, 3).join("; ")}</span>
        </div>
      )}
    </div>
  );
};