import { useMemo } from "react";
import { usePagination, useTable, useSortBy } from "react-table";
import { Card, Flex, Text } from "@radix-ui/themes";
import {
  CaretSortIcon,
  CaretUpIcon,
  CaretDownIcon,
} from "@radix-ui/react-icons";
import PaginationControls from "../components/PaginationControls";

const MailerTable = ({ filtered }) => {
  const columns = useMemo(
    () => [
      {
        accessor: "final_primary_address",
        Header: "Address",
      },
      {
        accessor: "final_secondary_address",
        Header: "Unit",
      },
      {
        accessor: "usps_status",
        Header: "USPS Status",
        Cell: ({ value }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              value === "Deliverable"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {value || "Unknown"}
          </span>
        ),
      },
    ],
    []
  );

  const data = useMemo(
    () => filtered.map((f) => f.attributes),
    [filtered]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
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
      initialState: { pageIndex: 0, pageSize: 15 },
    },
    useSortBy,
    usePagination
  );

  return (
    <Card className="overflow-hidden">
      <Flex direction="column" gap="3">
        <Text size="3" weight="bold" className="text-[#004445]">
          Address List
        </Text>

        {/* Table wrapper with horizontal scroll */}
        <div className="overflow-x-auto max-w-full">
          <table {...getTableProps()} className="w-full min-w-max">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="bg-gray-100 text-left py-2 px-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors border-b border-gray-200"
                    >
                      <Flex align="center" gap="1">
                        {column.render("Header")}
                        <span className="text-gray-400">
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <CaretDownIcon />
                            ) : (
                              <CaretUpIcon />
                            )
                          ) : (
                            <CaretSortIcon />
                          )}
                        </span>
                      </Flex>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className="py-2 px-3 text-sm border-b border-gray-100"
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
        <div className="pt-2">
          <PaginationControls
            pageIndex={pageIndex}
            pageCount={pageCount}
            pageOptions={pageOptions}
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
            gotoPage={gotoPage}
            previousPage={previousPage}
            nextPage={nextPage}
            totalCount={data.length}
          />
        </div>
      </Flex>
    </Card>
  );
};

export default MailerTable;
