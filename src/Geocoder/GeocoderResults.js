import {
  faAtlas,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { usePagination, useTable } from "react-table";

const GeocoderResults = ({ results, addresses, options, customFields }) => {
  let cols = [
    {
      accessor: "input",
      Header: "Input",
      Cell: (row) => <div className="w-48">{row.value}</div>,
    },
    {
      accessor: "StAddr",
      Header: "Match",
      Cell: (row) =>
        row.value !== "" ? (
          <div className="w-48">
            <span className="">{row.value}</span>
          </div>
        ) : (
          <div className="w-48">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="ml-1 text-gray-500"
            />
            <span className="mx-2 text-gray-500">No match</span>
          </div>
        ),
    },
  ];

  if (options.ids) {
    cols = cols.concat([
      {
        accessor: "address_id",
        Header: "Address ID",
        Cell: (row) => (
          <Link
            target={`_blank`}
            to={`/explorer?type=addresses&id=${row.value}`}
          >
            {row.value}
          </Link>
        ),
      },
      {
        accessor: "building_id",
        Header: "Building ID",
        Cell: (row) => (
          <Link
            target={`_blank`}
            to={`/explorer?type=buildings&id=${row.value}`}
          >
            {row.value}
          </Link>
        ),
      },
      {
        accessor: "parcel_id",
        maxWidth: 15,
        Header: "Parcel ID",
        Cell: (row) => (
          <Link target={`_blank`} to={`/explorer?type=parcels&id=${row.value}`}>
            {row.value}
          </Link>
        ),
      },
      {
        accessor: "street_id",
        Header: "Street ID",
        Cell: (row) => (
          <Link target={`_blank`} to={`/explorer?type=streets&id=${row.value}`}>
            {row.value}
          </Link>
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

  customFields.forEach((cf) => {
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
      initialState: { pageIndex: 0, pageSize: 20 },
    },
    usePagination
  );

  return (
    <>
      <table {...getTableProps()} className="w-auto overflow-x-scroll text-sm">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className="bg-gray-300 py-2 pl-2 pr-4"
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
                className={row.values.StAddr === "" ? "bg-red-50 h-12" : "h-12"}
              >
                {row.cells.map((cell) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      className="pl-2 pr-4 border border-bottom-1"
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
      <div className="p-2">
        <button
          className="p-1 bg-gray-100 border border-black w-12"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {"<<"}
        </button>{" "}
        <button
          className="p-1 bg-gray-100 border border-black w-12"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          {"<"}
        </button>{" "}
        <button
          className="p-1 bg-gray-100 border border-black w-12"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          {">"}
        </button>{" "}
        <button
          className="p-1 bg-gray-100 border border-black w-12"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
      </div>
    </>
  );
};

export default GeocoderResults;
