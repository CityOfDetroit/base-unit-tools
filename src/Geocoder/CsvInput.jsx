import { Flex, Text, Select, Button } from "@radix-ui/themes";
import { useState, useRef, useCallback } from "react";
import * as XLSX from "xlsx";
import _ from "underscore";
import {
  UploadIcon,
  FileTextIcon,
  Cross2Icon,
  CheckIcon,
} from "@radix-ui/react-icons";

let col_i = 1;
const columnIterator = () => {
  let blankCol = "blank_column" + col_i.toString();
  col_i += 1;
  return blankCol;
};

export const CsvInput = ({ csv, setCsv, addresses, setAddresses }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [sheets, setSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [workbook, setWorkbook] = useState(null);
  const fileInputRef = useRef(null);
  const excelInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const isExcelFile = (name) => {
    return name.endsWith(".xlsx") || name.endsWith(".xls");
  };

  const handleExcelFile = useCallback(async (file) => {
    const data = await file.arrayBuffer();
    const wb = XLSX.read(data, { type: "array" });
    setWorkbook(wb);
    setSheets(wb.SheetNames);
    setFileName(file.name);
    setFileType("excel");

    // Auto-select first sheet if only one
    if (wb.SheetNames.length === 1) {
      const firstSheet = wb.Sheets[wb.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });
      setCsv(jsonData);
      setSelectedSheet(wb.SheetNames[0]);
    }
  }, [setCsv]);

  const handleCsvFile = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        const lines = text.split('\n');
        const headers = lines[0].split(',').map((h) =>
          h.trim().replace(/^"|"$/g, '') || columnIterator()
        );
        const data = [];
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            const row = {};
            headers.forEach((header, idx) => {
              row[header] = values[idx] || '';
            });
            data.push(row);
          }
        }
        setCsv(data);
        setFileName(file.name);
        setFileType("csv");
      }
    };
    reader.readAsText(file);
  }, [setCsv]);

  const handleSheetSelect = (sheetName) => {
    if (workbook) {
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      setCsv(jsonData);
      setSelectedSheet(sheetName);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (isExcelFile(file.name)) {
        handleExcelFile(file);
      } else if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        handleCsvFile(file);
      }
    }
  }, [handleExcelFile, handleCsvFile]);

  const handleFileInputChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isExcelFile(file.name)) {
      handleExcelFile(file);
    } else if (file.name.endsWith(".csv")) {
      handleCsvFile(file);
    }
  }, [handleExcelFile, handleCsvFile]);

  const handleClear = () => {
    setCsv(null);
    setAddresses([]);
    setFileName(null);
    setFileType(null);
    setSheets([]);
    setSelectedSheet(null);
    setWorkbook(null);
    if (excelInputRef.current) {
      excelInputRef.current.value = "";
    }
  };

  return (
    <Flex direction="column" gap="3">
      {/* Drag and Drop Zone */}
      {!csv && !sheets.length && (
        <div
          ref={fileInputRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer
            ${isDragging
              ? "border-[#279989] bg-[#9fd5b3]/10"
              : "border-gray-300 hover:border-gray-400 bg-gray-50"
            }
          `}
        >
          <Flex direction="column" align="center" gap="2" className="pointer-events-none">
            <UploadIcon
              width="32"
              height="32"
              className={isDragging ? "text-[#279989]" : "text-gray-400"}
            />
            <Text size="2" weight="medium" className="text-gray-600">
              {isDragging ? "Drop file here" : "Drag file here or click to browse"}
            </Text>
            <Text size="1" color="gray">
              Supports .csv, .xlsx, and .xls files
            </Text>
          </Flex>
          {/* Universal file input that handles both CSV and Excel */}
          <input
            ref={excelInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
        </div>
      )}

      {/* Sheet Selection for Excel files with multiple sheets */}
      {sheets.length > 1 && !selectedSheet && (
        <Flex direction="column" gap="2" className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Flex align="center" gap="2">
            <FileTextIcon width="20" height="20" className="text-blue-600" />
            <Flex direction="column">
              <Text size="2" weight="medium" className="text-blue-700">
                {fileName}
              </Text>
              <Text size="1" className="text-blue-600">
                {sheets.length} sheets found - please select one
              </Text>
            </Flex>
          </Flex>
          <Select.Root onValueChange={handleSheetSelect}>
            <Select.Trigger placeholder="Choose sheet..." />
            <Select.Content>
              {sheets.map((sheet) => (
                <Select.Item value={sheet} key={sheet}>
                  {sheet}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>
      )}

      {/* File Loaded State */}
      {csv && (
        <Flex
          align="center"
          justify="between"
          className="p-3 bg-green-50 border border-green-200 rounded-lg"
        >
          <Flex align="center" gap="2">
            <FileTextIcon width="20" height="20" className="text-green-600" />
            <Flex direction="column">
              <Text size="2" weight="medium" className="text-green-700">
                {fileName || "File uploaded"}
                {selectedSheet && sheets.length > 1 && (
                  <Text as="span" size="1" className="text-green-600 ml-1">
                    ({selectedSheet})
                  </Text>
                )}
              </Text>
              <Text size="1" className="text-green-600">
                {csv.length.toLocaleString()} rows loaded
              </Text>
            </Flex>
          </Flex>
          <Button
            variant="ghost"
            size="1"
            onClick={handleClear}
            className="text-green-600 hover:text-green-800"
          >
            <Cross2Icon />
          </Button>
        </Flex>
      )}

      {/* Column Selection */}
      {csv && (
        <Flex direction="column" gap="2">
          <Text size="2" weight="medium">
            Select address column
          </Text>
          <Select.Root
            onValueChange={(e) => {
              setAddresses(csv.map((r) => r[e]));
            }}
          >
            <Select.Trigger placeholder="Choose column..." />
            <Select.Content>
              {Object.keys(csv[0]).map((d) => (
                <Select.Item value={d} key={d}>
                  {d}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>
      )}

      {/* Sample Values */}
      {addresses.length > 0 && (
        <Flex direction="column" gap="1" className="p-3 bg-gray-50 rounded-lg">
          <Flex align="center" gap="1">
            <CheckIcon width="14" height="14" className="text-green-600" />
            <Text size="1" weight="medium" className="text-green-700">
              {addresses.length.toLocaleString()} addresses ready
            </Text>
          </Flex>
          <Text size="1" color="gray" className="mt-1">
            Sample values:
          </Text>
          <ul className="list-disc list-inside ml-1">
            {_.sample(addresses, 3).map((addr, i) => (
              <li key={i} className="text-xs text-gray-600 truncate">
                {addr}
              </li>
            ))}
          </ul>
        </Flex>
      )}
    </Flex>
  );
};
