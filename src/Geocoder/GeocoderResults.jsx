import { useMemo, useState } from "react";
import { CSVLink } from "react-csv";
import { usePagination, useTable, useSortBy } from "react-table";
import { Button, Flex, Text, Badge, SegmentedControl } from "@radix-ui/themes";
import {
  DownloadIcon,
  ExclamationTriangleIcon,
  CheckCircledIcon,
  CaretSortIcon,
  CaretUpIcon,
  CaretDownIcon,
} from "@radix-ui/react-icons";
import PaginationControls from "../components/PaginationControls";

let exclude_census = ["census_block_2010", "census_block_2020"];

const GeocoderResults = ({
  results,
  addresses,
  options,
  geocoderFields,
  setUnmatchedAddr,
  csv,
}) => {
  const [filterMode, setFilterMode] = useState("all");

  // Filter results based on mode
  const filteredResults = useMemo(() => {
    if (filterMode === "all") return results;
    if (filterMode === "matched")
      return results.filter((r) => r.attributes.StAddr !== "");
    if (filterMode === "unmatched")
      return results.filter((r) => r.attributes.StAddr === "");
    return results;
  }, [results, filterMode]);

  let cols = [
    {
      accessor: "input",
      Header: "Input",
      Cell: (row) => (
        <div className="max-w-[200px] truncate" title={row.value}>
          {row.value}
        </div>
      ),
    },
    {
      accessor: "StAddr",
      Header: "Match",
      Cell: (row) =>
        row.value !== "" ? (
          <div className="max-w-[200px] truncate" title={row.value}>
            {row.value}
          </div>
        ) : (
          <Flex align="center" gap="1">
            <ExclamationTriangleIcon className="text-red-500" />
            <Text size="1" color="red">
              No match
            </Text>
          </Flex>
        ),
    },
    {
      accessor: "matchStatus",
      Header: "Status",
      Cell: (row) => (
        <Badge
          color={row.row.original.StAddr !== "" ? "green" : "red"}
          variant="soft"
          size="1"
        >
          {row.row.original.StAddr !== "" ? "Matched" : "Unmatched"}
        </Badge>
      ),
    },
  ];

  // These columns are hidden on mobile
  const desktopOnlyCols = [];

  desktopOnlyCols.push(
    {
      accessor: "AddNum",
      Header: "Street #",
      Cell: (row) => <span className="tracking-tight">{row.value}</span>,
    },
    {
      accessor: "StPreDir",
      Header: "Prefix",
      Cell: (row) => <span className="tracking-tight">{row.value}</span>,
    },
    {
      accessor: "StName",
      Header: "Street Name",
      Cell: (row) => <span className="tracking-tight">{row.value}</span>,
    },
    {
      accessor: "StType",
      Header: "Type",
      Cell: (row) => <span className="tracking-tight">{row.value}</span>,
    },
    {
      accessor: "UnitType",
      Header: "Unit Type",
      Cell: (row) => <span className="tracking-tight">{row.value}</span>,
    },
    {
      accessor: "UnitName",
      Header: "Unit #",
      Cell: (row) => <span className="tracking-tight">{row.value}</span>,
    },
    {
      accessor: "Postal",
      Header: "Zip",
      Cell: (row) => <span className="tracking-tight">{row.value}</span>,
    }
  );

  if (options.ids) {
    desktopOnlyCols.push(
      {
        accessor: "address_id",
        Header: "Address ID",
        Cell: (row) => (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`/map?id=${row.value}&layer=address`}
            className="text-blue-600 hover:underline"
          >
            {row.value}
          </a>
        ),
      },
      {
        accessor: "building_id",
        Header: "Building ID",
        Cell: (row) => (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`/map?id=${row.value}&layer=building`}
            className="text-blue-600 hover:underline"
          >
            {row.value}
          </a>
        ),
      },
      {
        accessor: "parcel_id",
        Header: "Parcel ID",
        Cell: (row) => (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`/map?id=${row.value}&layer=parcel`}
            className="text-blue-600 hover:underline"
          >
            {row.value}
          </a>
        ),
      },
      {
        accessor: "street_id",
        Header: "Street ID",
        Cell: (row) => (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`/map?id=${row.value}&layer=street`}
            className="text-blue-600 hover:underline"
          >
            {row.value}
          </a>
        ),
      }
    );
  }

  if (options.coords) {
    desktopOnlyCols.push(
      {
        accessor: (row) => row.Y?.toFixed(5),
        id: "lat",
        Header: "Lat",
        Cell: (row) => (
          <span className="tracking-tight">
            {row.value > 0 ? row.value : null}
          </span>
        ),
      },
      {
        accessor: (row) => row.X?.toFixed(5),
        id: "lon",
        Header: "Lon",
        Cell: (row) => (
          <span className="tracking-tight">
            {row.value < 0 ? row.value : null}
          </span>
        ),
      }
    );
  }

  if (options.related_parcel) {
    desktopOnlyCols.push({
      accessor: "related_parcel",
      Header: "Related Parcel",
      Cell: (row) => (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`/map?id=${row.value}&layer=parcel`}
          className="text-blue-600 hover:underline"
        >
          {row.value}
        </a>
      ),
    });
  }

  geocoderFields.forEach((cf) => {
    if (options[cf.name] && !exclude_census.includes(cf.name)) {
      desktopOnlyCols.push({ accessor: cf.geocoderColumn, Header: cf.display });
    }
  });

  if (options.census_block_2020) {
    desktopOnlyCols.push(
      {
        accessor: (row) => row.census_block_geoid_2020?.toString().slice(5, 11),
        id: "census_tract_2020",
        Header: "Tract 2020",
      },
      {
        accessor: (row) => row.census_block_geoid_2020?.toString(),
        id: "census_geoid_2020",
        Header: "GEOID 2020",
      }
    );
  }

  if (options.census_block_2010) {
    desktopOnlyCols.push(
      {
        accessor: (row) => row.census_block_geoid_2010?.toString().slice(5, 11),
        id: "census_tract_2010",
        Header: "Tract 2010",
      },
      {
        accessor: (row) => row.census_block_geoid_2010?.toString(),
        id: "census_geoid_2010",
        Header: "GEOID 2010",
      }
    );
  }

  // Combine cols - mobile shows only first 3, desktop shows all
  const allCols = [...cols, ...desktopOnlyCols];

  filteredResults.forEach((res, idx) => {
    res.attributes.input = addresses[idx];
    if (res.attributes.address_id === 0) {
      res.attributes.address_id = null;
    }
  });

  let columns = useMemo(() => allCols, [filteredResults, options]);
  let data = useMemo(
    () => filteredResults.map((r) => r.attributes),
    [filteredResults]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  // Export data preparation
  let dataForExcelExport = rows.map((row, idx) => {
    let newRow = { ...row.values };
    newRow["Address"] = newRow["StAddr"];
    delete newRow["StAddr"];
    newRow["Street Number"] = newRow["AddNum"];
    delete newRow["AddNum"];
    newRow["Street Prefix"] = newRow["StPreDir"];
    delete newRow["StPreDir"];
    newRow["Street Name"] = newRow["StName"];
    delete newRow["StName"];
    newRow["Street Type"] = newRow["StType"];
    delete newRow["StType"];
    newRow["Unit Type"] = newRow["UnitType"];
    delete newRow["UnitType"];
    newRow["Unit Number"] = newRow["UnitName"];
    delete newRow["UnitName"];
    newRow["Zip Code"] = newRow["Postal"];
    delete newRow["Postal"];
    delete newRow["matchStatus"];

    if (newRow.parcel_id) {
      newRow.parcel_id = `=""${newRow.parcel_id}""`;
    }
    if (newRow.related_parcel) {
      newRow.related_parcel = `=""${newRow.related_parcel}""`;
    }
    if (csv) {
      newRow = { ...csv[idx], ...newRow };
    }
    return newRow;
  });

  let dataForCsvExport = rows.map((row, idx) => {
    let newRow = { ...row.values };
    newRow["Address"] = newRow["StAddr"];
    delete newRow["StAddr"];
    newRow["Street Number"] = newRow["AddNum"];
    delete newRow["AddNum"];
    newRow["Street Prefix"] = newRow["StPreDir"];
    delete newRow["StPreDir"];
    newRow["Street Name"] = newRow["StName"];
    delete newRow["StName"];
    newRow["Street Type"] = newRow["StType"];
    delete newRow["StType"];
    newRow["Unit Type"] = newRow["UnitType"];
    delete newRow["UnitType"];
    newRow["Unit Number"] = newRow["UnitName"];
    delete newRow["UnitName"];
    newRow["Zip Code"] = newRow["Postal"];
    delete newRow["Postal"];
    delete newRow["matchStatus"];

    if (newRow.parcel_id) {
      newRow.parcel_id = `${newRow.parcel_id}`;
    }
    if (newRow.related_parcel) {
      newRow.related_parcel = `=""${newRow.related_parcel}""`;
    }
    if (csv) {
      newRow = { ...csv[idx], ...newRow };
    }
    return newRow;
  });

  const matchedCount = results.filter((r) => r.attributes.StAddr !== "").length;
  const unmatchedCount = results.length - matchedCount;

  return (
    <Flex direction="column" gap="3" className="overflow-hidden min-w-0">
      {/* Filter and Download Controls */}
      <Flex
        direction={{ initial: "column", sm: "row" }}
        gap="3"
        align={{ initial: "stretch", sm: "center" }}
        justify="between"
        className="flex-wrap"
      >
        {/* Filter Tabs */}
        <SegmentedControl.Root
          value={filterMode}
          onValueChange={setFilterMode}
          size="1"
        >
          <SegmentedControl.Item value="all">
            All ({results.length})
          </SegmentedControl.Item>
          <SegmentedControl.Item value="matched">
            <Flex align="center" gap="1">
              <CheckCircledIcon width="12" height="12" className="text-green-600" />
              Matched ({matchedCount})
            </Flex>
          </SegmentedControl.Item>
          <SegmentedControl.Item value="unmatched">
            <Flex align="center" gap="1">
              <ExclamationTriangleIcon width="12" height="12" className="text-red-500" />
              Unmatched ({unmatchedCount})
            </Flex>
          </SegmentedControl.Item>
        </SegmentedControl.Root>

        {/* Download Buttons */}
        <Flex gap="2">
          <CSVLink
            data={dataForExcelExport}
            filename={`geocode_results_${new Date().getTime()}.csv`}
          >
            <Button variant="soft" size="1">
              <DownloadIcon />
              Excel CSV
            </Button>
          </CSVLink>
          <CSVLink
            data={dataForCsvExport}
            filename={`geocode_results_${new Date().getTime()}.csv`}
          >
            <Button variant="soft" size="1">
              <DownloadIcon />
              Standard CSV
            </Button>
          </CSVLink>
        </Flex>
      </Flex>

      {/* Results Table */}
      <div className="overflow-x-auto border rounded-lg max-w-full">
        <table {...getTableProps()} className="text-xs min-w-max">
          <thead className="sticky top-0 z-10 bg-white">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, colIdx) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={`
                      bg-gray-100 p-2 text-gray-700 tracking-tight leading-3 text-left
                      border-b border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors
                      whitespace-nowrap
                      ${colIdx > 2 ? "hidden sm:table-cell" : ""}
                    `}
                  >
                    <Flex align="center" gap="1">
                      {column.render("Header")}
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <CaretDownIcon width="12" height="12" />
                        ) : (
                          <CaretUpIcon width="12" height="12" />
                        )
                      ) : (
                        <CaretSortIcon
                          width="12"
                          height="12"
                          className="text-gray-400"
                        />
                      )}
                    </Flex>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              const isUnmatched = row.values.StAddr === "";
              return (
                <tr
                  {...row.getRowProps()}
                  className={`
                    h-10 hover:bg-gray-50 transition-colors
                    ${isUnmatched ? "bg-red-50/50" : ""}
                  `}
                >
                  {row.cells.map((cell, cellIdx) => (
                    <td
                      {...cell.getCellProps()}
                      className={`
                        px-2 py-1 border-b border-gray-100
                        ${cellIdx > 2 ? "hidden sm:table-cell" : ""}
                      `}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <PaginationControls
        pageIndex={pageIndex}
        pageCount={pageCount}
        pageOptions={pageOptions}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        gotoPage={gotoPage}
        previousPage={previousPage}
        nextPage={nextPage}
        showGoTo={true}
      />
    </Flex>
  );
};

export default GeocoderResults;
