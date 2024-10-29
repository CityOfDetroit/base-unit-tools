import { useMemo } from "react";
import { CSVLink } from "react-csv";
import { usePagination, useTable } from "react-table";
import { Button, Flex, Text } from "@radix-ui/themes";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  DownloadIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import { Link } from "react-router-dom";

const GeocoderResults = ({
  results,
  addresses,
  options,
  geocoderFields,
  setUnmatchedAddr,
  csv,
}) => {
  let cols = [
    {
      accessor: "input",
      Header: "Input",
      Cell: (row) => <div className="w-32">{row.value}</div>,
    },
    {
      accessor: "StAddr",
      Header: "Match",
      Cell: (row) =>
        row.value !== "" ? (
          <div className="w-32">
            <span className="">{row.value}</span>
          </div>
        ) : (
          <div className="w-32">
            <ExclamationTriangleIcon
              className="ml-1 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setUnmatchedAddr(row.row.values.input);
              }}
            />
          </div>
        ),
    },
    {
      accessor: "AddNum",
      Header: "Street #",
      Cell: (row) => <span className="tracking-tight">{row.value}</span>,
    },
    {
      accessor: "StPreDir",
      Header: "Street Prefix",
      Cell: (row) => <span className="tracking-tight">{row.value}</span>,
    },
    {
      accessor: "StName",
      Header: "Street Name",
      Cell: (row) => <span className="tracking-tight">{row.value}</span>,
    },
    {
      accessor: "StType",
      Header: "Street Type",
      Cell: (row) => <span className="tracking-tight">{row.value}</span>,
    },
    {
      accessor: "UnitType",
      Header: "Unit Type",
      Cell: (row) => <span className="tracking-tight">{row.value}</span>,
    },
    {
      accessor: "UnitName",
      Header: "Unit Name",
      Cell: (row) => <span className="tracking-tight">{row.value}</span>,
    },
    {
      accessor: "Postal",
      Header: "Zip Code",
      Cell: (row) => <span className="tracking-tight">{row.value}</span>,
    },
  ];

  if (options.ids) {
    cols = cols.concat([
      {
        accessor: "address_id",
        Header: "Address ID",
        Cell: (row) => (
          <a target={`_blank`} href={`/map?id=${row.value}&layer=address`}>
            {row.value}
          </a>
        ),
      },
      {
        accessor: "building_id",
        Header: "Building ID",
        Cell: (row) => (
          <a target={`_blank`} href={`/map?id=${row.value}&layer=building`}>
            {row.value}
          </a>
        ),
      },
      {
        accessor: "parcel_id",
        maxWidth: 15,
        Header: "Parcel ID",
        Cell: (row) => (
          <a target={`_blank`} href={`/map?id=${row.value}&layer=parcel`}>
            {row.value}
          </a>
        ),
      },
      {
        accessor: "street_id",
        Header: "Street ID",
        Cell: (row) => (
          <a target={`_blank`} href={`/map?id=${row.value}&layer=street`}>
            {row.value}
          </a>
        ),
      },
    ]);
  }

  if (options.coords) {
    cols = cols.concat([
      {
        accessor: (row) => row.Y.toFixed(5),
        Header: "Lat",
        Cell: (row) => (
          <span className="tracking-tight">
            {row.value > 0 ? row.value : null}
          </span>
        ),
      },
      {
        accessor: (row) => row.X.toFixed(5),
        Header: "Lon",
        Cell: (row) => (
          <span className="tracking-tight">
            {row.value < 0 ? row.value : null}
          </span>
        ),
      },
    ]);
  }

  geocoderFields.forEach((cf) => {
    if (options[cf.name]) {
      cols.push({ accessor: cf.geocoderColumn, Header: cf.display });
    }
  });

  results.forEach((res, idx) => {
    res.attributes.input = addresses[idx];
    if (res.attributes.address_id === 0) {
      res.attributes.address_id = null;
    }
  });
  let columns = useMemo(() => cols, [results, options]);
  let data = useMemo(() => results.map((r) => r.attributes), [results]);

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
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    usePagination
  );

  //
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

    if (newRow.parcel_id) {
      newRow.parcel_id = `=""${newRow.parcel_id}""`;
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

    if (newRow.parcel_id) {
      newRow.parcel_id = `${newRow.parcel_id}`;
    }
    if (csv) {
      newRow = { ...csv[idx], ...newRow };
    }
    return newRow;
  });

  return (
    <Flex direction="column" p={"2"} gap="2" className="overflow-auto">
      <Text size={"4"}>Results</Text>
      <Flex direction={{initial: "column", sm:"row"}} gap={"3"} align={{initial: "start", sm: "center"}} justify={"start"}>
        <Text size={"1"} weight="bold">
          {results.filter((r) => r.attributes.StAddr !== "").length}/
          {addresses.length} matches
        </Text>
        <Text size={"1"} weight="medium">
          {(
            (results.filter((r) => r.attributes.StAddr !== "").length * 100) /
            addresses.length
          ).toFixed(1)}
          % rate
        </Text>

        <CSVLink
          data={dataForExcelExport}
          filename={`geocode_results_${new Date().getTime()}.csv`}
        >
          <Button
            active={results.length > 0}
            disabled={results.length === 0}
            size={"1"}
          >
            <DownloadIcon />
            <Text>Download .csv for Excel</Text>
          </Button>
        </CSVLink>
        <CSVLink
          data={dataForCsvExport}
          filename={`geocode_results_${new Date().getTime()}.csv`}
        >
          <Button
            active={results.length > 0}
            disabled={results.length === 0}
            size={"1"}
          >
            <DownloadIcon />
            <Text>Download .csv</Text>
          </Button>
        </CSVLink>
      </Flex>
      <div className="overflow-auto">
        <table {...getTableProps()} className="text-xs overflow-auto">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className="bg-gray-300 p-2 text-gray-600 tracking-tight leading-3 text-left border-r-2 border-gray-100"
                  >
                    {column.render("Header")}
                  </th>
                ))}
                <th></th>
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className={
                    row.values.StAddr === "" ? "bg-red-50 h-12" : "h-12"
                  }
                >
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        className="px-2 border border-bottom-1"
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Flex align="center" justify={"between"}>
        <div>
          <button
            className="bg-gray-300 hover:bg-gray-200 p-3"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            <DoubleArrowLeftIcon />
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-200 p-3"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            <ArrowLeftIcon />
          </button>
        </div>
        <div>
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
          <span>
            | Go to page:
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              className="p-2 w-24"
            />
          </span>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="bg-gray-300 hover:bg-gray-200 p-3"
          >
            <ArrowRightIcon />
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className="bg-gray-300 hover:bg-gray-200 p-3"
          >
            <DoubleArrowRightIcon />
          </button>
        </div>
      </Flex>
    </Flex>
  );
};

export default GeocoderResults;
