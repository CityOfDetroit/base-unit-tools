import React from 'react';

export const ToggleButton = ({ onClick, title, active }) => {

  let baseStyle = "p-2 flex items-center justify-around w-1/3 text-sm";
  let activeStyle = baseStyle + " bg-blue-200 font-semibold";
  let inactiveStyle = baseStyle + " bg-gray-200 font-light";

  return (
    <button
      className={active ? activeStyle : inactiveStyle}
      onClick={onClick}
      onKeyDown={(e) => e.keycode === 13 && onClick()}
    >
      <span>{title}</span>
    </button>
  );
};
