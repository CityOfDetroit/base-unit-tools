import { Box } from "@radix-ui/themes";

// Shared prose styling for rendered MDX content (base unit pages, resources).
const proseClasses =
  "mdx-content text-sm " +
  "[&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-3 " +
  "[&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 " +
  "[&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1 " +
  "[&_h4]:text-sm [&_h4]:font-semibold [&_h4]:mt-3 [&_h4]:mb-1 " +
  "[&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_li]:mb-1 " +
  "[&_code]:bg-gray-100 [&_code]:px-1 [&_code]:rounded " +
  // code blocks scroll on their own so long endpoint URLs don't widen the page
  "[&_pre]:bg-gray-100 [&_pre]:dark:bg-slate-900 [&_pre]:p-3 [&_pre]:rounded [&_pre]:my-3 " +
  "[&_pre]:overflow-x-auto [&_pre]:text-xs [&_pre_code]:bg-transparent [&_pre_code]:p-0 " +
  "[&_a]:text-blue-600 [&_a]:underline " +
  "[&_table]:w-full [&_table]:border-collapse [&_table]:my-3 " +
  "[&_th]:text-left [&_th]:p-2 [&_th]:bg-gray-100 [&_th]:border [&_th]:border-gray-300 " +
  "[&_td]:p-2 [&_td]:border [&_td]:border-gray-300 [&_strong]:font-semibold";

const MdxProse = ({ children, ...props }) => (
  <Box className={proseClasses} {...props}>
    {children}
  </Box>
);

export default MdxProse;
