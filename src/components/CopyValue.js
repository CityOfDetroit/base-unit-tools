import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import * as Tooltip from "@radix-ui/react-tooltip";

const CopyValue = ({ value, className = null, icon = faCopy, hoverText='Copy value to clipboard' }) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <FontAwesomeIcon
            icon={icon}
            className={
              className ? className : "text-gray-400 hover:text-gray-500"
            }
            onClick={() => navigator.clipboard.writeText(value)}
          />
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p className="bg-white p-2 rounded-md text-sm text-gray-700">
            {hoverText}
          </p>
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default CopyValue;
