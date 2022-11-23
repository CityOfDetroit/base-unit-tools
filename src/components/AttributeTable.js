import { faChevronCircleDown, faChevronCircleRight, faCog, faInfoCircle, faWindowClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import AnimateHeight from 'react-animate-height'
import CopyValue from "../components/CopyValue";
import CustomTooltip from "./CustomTooltip";

const AttributeTable = ({ attributes, metadata = null}) => {
  
  const TableRow = ({label, index}) => {   
    //console.log(metadata?.[label])
    return (
      <tr
          key={index}
          className={
            index + 1 === Object.keys(attributes).length
              ? "flex items-center"
              : "border-b-2 border-gray-400 flex items-center"
          }
        >
          {/* If the data is a * marked field, don't display the star */}
          {label.slice(-1) == "*" ? (
            <td className="w-1/3 md:w-2/5 my-2 font-bold text-xs md:text-sm ">{label.slice(0, -1)}</td>
          ) : (
            <td className="w-1/3 md:w-2/5 my-2 font-bold text-xs md:text-sm ">{label}</td>
          )
          }
          <td className="text-xs md:text-sm flex w-2/3 md:w-3/5 my-2 justify-between items-center pr-2">
          {label.slice(-1) == "*" ? (
              convertTimestamp(attributes[label])
            ) : (
              attributes[label]
            )
          }
            {attributes[label] && attributes[label] !== "" && (
              <CopyValue value={attributes[label]} className="text-gray-300 hover:text-gray-400" />
            )}
          </td>
        </tr>
    );
  }

  function renderTableBody(){
    if(attributes){
      return (
        Object.keys(attributes).map((f, i) => (
          metadata?.[f]
          ? <CustomTooltip key={i} title={metadata[f]}>
              <TableRow label={f} index={i} />
            </CustomTooltip>
          :<TableRow label={f} index={i} />
        ))
      )
    }
    return <p>No Data</p>
  }

  /*
  metadata
          ? <CustomTooltip title={metadata[f]}>
              <p>la</p>
            </CustomTooltip>
          : TableRow(f, i)
  */
  return (
    <table className="w-full">
      <tbody>
        {renderTableBody()}
      </tbody>
    </table>
  );
};

// takes in a timestamp in milliseconds
function convertTimestamp(timestamp){
  var date = new Date(timestamp)
  
  // date values
  var year = date.getFullYear();
  var months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  var month = months[date.getMonth()];
  var day = date.getDate();

  // time values
  var hour = date.getHours();
  var ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12; // hour 0 should be 12
  var min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  var sec = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  var time = month + '/' + day + '/' + year + ' ' + hour + ':' + min + ampm;
  return time;
}

export default AttributeTable;