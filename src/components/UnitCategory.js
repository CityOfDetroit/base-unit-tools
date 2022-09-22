export const UnitCategory = ({ categoryName, children }) => {
  return (
    <div className="mb-3">
      <UnitCategoryHeader categoryName={categoryName} />
      {children}
    </div>
  );
};

export const UnitCategoryHeader = ({ categoryName }) => {
  return <p className="text-md text-gray-700 city-underline font-extrabold">{categoryName}</p>;
};

export const CategoryItem = ({ column, value, borderBottom=true }) => {

  let className = "flex items-center justify-between py-1"
  if (borderBottom) {
    className += " border-dotted border-b-2 border-gray-300"
  }

  return (
    <div className={className}>
      <span className="font-semibold text-gray-700 w-2/5">{column}</span>
      <span>{value}</span>
    </div>
  );
};
