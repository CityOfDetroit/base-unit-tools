import { faChevronCircleDown, faChevronCircleRight, faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CopyValue from "../components/CopyValue";
import layers from "../data/layers";
import IdBadge from "./IdBadge";
import { useState } from "react";
import AnimateHeight from "react-animate-height";

const ExplorerFeature = ({
  attr,
  attributes,
  longAttributes = {},
  clicked = null,
}) => {
  // let hasSource = Object.keys(attr).indexOf('geo_source') > -1

  let layer = layers[clicked.type];

  let [show, setShow] = useState(true);

  return (
    <>
      <div
        className="bg-gray-300 p-2 text-xs font-bold flex items-center justify-between"
        style={{ borderLeft: `8px solid ${layer.color}` }}
      >
        <div className="flex items-center">
          <h2 className="text-sm md:text-lg mr-3">{layer.label}</h2>
          <IdBadge id={attr[layer.id_column]} layer={layer} link={false} />
          <FontAwesomeIcon
            icon={faLink}
            className="ml-2 text-gray-400 hover:text-gray-500"
          />
        </div>
        <div className="flex items-center">
          <FontAwesomeIcon icon={show ? faChevronCircleDown : faChevronCircleRight} className="ml-2 text-xl" onClick={() => setShow(!show)} />
        </div>
      </div>
      <AnimateHeight duration={250} height={show ? "auto" : 0}>
      <section
        className="sidebar-section"
        style={{ borderLeft: `8px solid ${layer.color}` }}
      >
        <table className="w-full">
          <tbody>
            {Object.keys(attributes).map((f, i) => (
              <tr
                key={i}
                className={
                  i + 1 === Object.keys(attributes).length
                    ? "h-10 flex items-center"
                    : "border-b-2 border-gray-400 h-10 flex items-center"
                }
              >
                <td className="w-1/3 md:w-2/5 font-bold text-xs md:text-sm">
                  {f}
                </td>
                <td className="text-xs md:text-sm flex w-2/3 md:w-3/5 justify-between items-center pr-2">
                  {attributes[f]}
                  {attributes[f] && attributes[f] !== '' && <CopyValue
                    value={attributes[f]}
                    className="text-gray-300 hover:text-gray-400"
                  />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {Object.keys(longAttributes).length > 0 &&
          Object.keys(longAttributes).map((f, i) => (
            <div key={i} style={{ paddingLeft: 2 }}>
              <div
                className={
                  i === 0
                    ? "border-t-2 border-gray-400 text-xs md:text-sm py-2 pr-2 flex items-center justify-between"
                    : "text-xs md:text-sm py-2 pr-2 flex items-center justify-between"
                }
              >
                <span className="font-bold">{f}</span>
                <CopyValue
                  value={longAttributes[f]}
                  className="text-gray-300 hover:text-gray-400"
                />
              </div>

              <p className="px-1 md:px-2 text-xs md:text-sm leading-tight">
                {" "}
                {longAttributes[f]}
              </p>
            </div>
          ))}
      </section>
      </AnimateHeight>
    </>
  );
};

export default ExplorerFeature;
