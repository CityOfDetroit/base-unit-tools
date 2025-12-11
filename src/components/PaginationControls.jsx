import { Flex, Text, Button } from "@radix-ui/themes";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

/**
 * Reusable pagination controls for tables.
 *
 * @param {number} pageIndex - Current page index (0-based)
 * @param {number} pageCount - Total number of pages
 * @param {Array} pageOptions - Array of page numbers
 * @param {boolean} canPreviousPage - Whether previous page navigation is available
 * @param {boolean} canNextPage - Whether next page navigation is available
 * @param {function} gotoPage - Function to navigate to a specific page
 * @param {function} previousPage - Function to go to previous page
 * @param {function} nextPage - Function to go to next page
 * @param {number} totalCount - Total number of items (optional, shown in parentheses)
 * @param {boolean} showGoTo - Whether to show "Go to page" input (default: false)
 */
const PaginationControls = ({
  pageIndex,
  pageCount,
  pageOptions,
  canPreviousPage,
  canNextPage,
  gotoPage,
  previousPage,
  nextPage,
  totalCount,
  showGoTo = false,
}) => {
  return (
    <Flex align="center" justify="between" className="flex-wrap gap-2">
      <Flex gap="1">
        <Button
          variant="soft"
          size="1"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          <DoubleArrowLeftIcon />
        </Button>
        <Button
          variant="soft"
          size="1"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          <ArrowLeftIcon />
        </Button>
      </Flex>

      <Flex align="center" gap="2">
        <Text size="2">
          Page <strong>{pageIndex + 1}</strong> of{" "}
          <strong>{pageOptions.length}</strong>
          {totalCount !== undefined && (
            <Text size="1" color="gray">
              {" "}
              ({totalCount.toLocaleString()} total)
            </Text>
          )}
        </Text>
        {showGoTo && (
          <Flex align="center" gap="1">
            <Text size="1" color="gray">
              Go to:
            </Text>
            <input
              type="number"
              min={1}
              max={pageCount}
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              className="w-16 px-2 py-1 text-sm border rounded"
            />
          </Flex>
        )}
      </Flex>

      <Flex gap="1">
        <Button
          variant="soft"
          size="1"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          <ArrowRightIcon />
        </Button>
        <Button
          variant="soft"
          size="1"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          <DoubleArrowRightIcon />
        </Button>
      </Flex>
    </Flex>
  );
};

export default PaginationControls;
