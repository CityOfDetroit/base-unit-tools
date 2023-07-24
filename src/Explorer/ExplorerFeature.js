import {
  faChevronCircleDown,
  faChevronCircleRight,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import AnimateHeight from "react-animate-height";
import CopyValue from "../../src/components/CopyValue";
import layers from "../data/layers";
import { queryFeatures } from "@esri/arcgis-rest-feature-layer";
import AddressesHere from "./AddressesHere";

import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import IdBadge from "./IdBadge";

const AttributeTable = ({ attributes, groups, title }) => {
  return (
    <>
      <div className="p-2 pt-0 bg-gray-300 font-semibold text-sm md:text-base flex items-center justify-between">
        <span>{title}</span>
      </div>
      <table className="w-full">
        <tbody>
          {!groups &&
            Object.keys(attributes).map((f, i) => (
              <tr
                key={i}
                className={
                  i + 1 === Object.keys(attributes).length
                    ? "flex items-center"
                    : "border-b-2 border-gray-200 flex items-center mr-2"
                }
              >
                <td className="w-1/3 md:w-2/5 my-2 font-bold text-xs md:text-sm text-gray-300">
                  {f}
                </td>
                <td className="text-xs md:text-sm flex w-2/3 md:w-3/5 my-2 justify-between items-center pr-2">
                  {attributes[f]}
                  {attributes[f] && attributes[f] !== "" && (
                    <CopyValue
                      value={attributes[f]}
                      className="text-gray-300 hover:text-gray-400"
                    />
                  )}
                </td>
              </tr>
            ))}
          {groups &&
            Object.keys(groups).map((g, i) => (
              <>
                <p className="w-full font-bold text-sm m-0 first:mt-0 bg-gray-200 text-gray-600 px-2 py-1">
                  {g}
                </p>
                <table className="w-full">
                  <tbody>
                    {Object.keys(groups[g]).map((f, i) => (
                      <tr
                        key={i}
                        className={
                          "border-b-2 border-gray-200 flex items-center last:border-b-0 pl-2"
                        }
                      >
                        <td className="w-1/3 my-2 text-xs md:text-sm mr-2 text-gray-600">
                          {groups[g][f]}
                        </td>
                        <td className="text-xs md:text-sm flex w-2/3 my-2 justify-between items-center">
                          {attributes[groups[g][f]]}
                          {attributes[groups[g][f]] &&
                            attributes[groups[g][f]] !== "" && (
                              <CopyValue
                                value={groups[g][f]}
                                className="text-gray-300 hover:text-gray-400 mr-4"
                              />
                            )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ))}
        </tbody>
      </table>
    </>
  );
};

const ExplorerFeature = ({ feature, selectFeature, setLinked }) => {
  let { id, type } = selectFeature;

  let layer = layers[type];

  let [show, setShow] = useState(true);

  let formatted = { attributes: {}, longAttributes: {} };

  try {
    formatted = layer.formatter(feature);
  } catch (e) {
    console.log(e);
  }

  let { attributes, longAttributes, groups, title } = formatted;

  let [addrsHere, setAddrsHere] = useState([]);

  useEffect(() => {
    setAddrsHere([]);
    if (type !== "addresses") {
      queryFeatures({
        url: layers.addresses.endpoint,
        where: `${
          layer.name === "parcels" ? "parcel_id" : layer.id_column
        } = '${id}'`,
        outFields: "*",
        f: "geojson",
      }).then((r) => {
        setAddrsHere(r.features);
      });
    }
    if (type === "addresses") {
      setLinked({
        addresses: [],
        buildings: [feature.properties.building_id],
        parcels: [feature.properties.parcel_id],
        streets: [feature.properties.street_id],
      });
    }
  }, [selectFeature]);

  useEffect(() => {
    if (type === "streets") {
      setLinked({
        addresses: addrsHere.map((a) => a.properties.address_id),
        buildings: addrsHere
          .map((a) => a.properties.building_id)
          .filter((a) => a !== null),
        parcels: addrsHere
          .map((a) => a.properties.parcel_id)
          .filter((a) => a !== null),
        streets: [],
      });
    }
    if (type === "buildings") {
      setLinked({
        addresses: addrsHere.map((a) => a.properties.address_id),
        buildings: [],
        parcels: addrsHere
          .map((a) => a.properties.parcel_id)
          .filter((a) => a !== null),
        streets: addrsHere
          .map((a) => a.properties.street_id)
          .filter((a) => a !== null),
      });
    }
    if (type === "parcels") {
      setLinked({
        addresses: addrsHere.map((a) => a.properties.address_id),
        buildings: addrsHere
          .map((a) => a.properties.building_id)
          .filter((a) => a !== null),
        parcels: [],
        streets: addrsHere
          .map((a) => a.properties.street_id)
          .filter((a) => a !== null),
      });
    }
  }, [addrsHere]);

  return (
    <>
      <div
        className="bg-gray-300 p-2 text-xs font-bold flex items-center justify-between"
        style={{ borderLeft: `8px solid ${layer.color}` }}
      >
        <div className="flex items-center">
          <h2 className="text-sm md:text-lg mr-3">{layer.label}</h2>
          <IdBadge
            id={feature.properties[layer.id_column]}
            layer={layer}
            link={false}
          />
        </div>
        <div className="flex items-center">
          <CopyValue
            value={window.location.href}
            icon={faLink}
            className="text-gray-500 text-xl mx-2 hover:text-gray-400"
            hoverText="Copy shareable link to clipboard"
          />
          <FontAwesomeIcon
            icon={show ? faChevronCircleDown : faChevronCircleRight}
            className="mx-2 text-gray-500 text-xl"
            onClick={() => setShow(!show)}
          />
        </div>
      </div>
      <AnimateHeight duration={250} height={show ? "auto" : 0}>
        <section
          className=""
          style={{ borderLeft: `8px solid ${layer.color}` }}
        >
          <AttributeTable
            attributes={attributes}
            groups={groups}
            title={title}
          />
          {longAttributes &&
            Object.keys(longAttributes).map((f, i) => (
              <div key={i} style={{ paddingLeft: 2 }}>
                <div className="w-full font-bold text-sm m-0 first:mt-0 bg-gray-200 px-2 py-1 flex items-center justify-between pr-4">
                  <span className="font-bold">{f}</span>
                  <CopyValue
                    value={longAttributes[f]}
                    className="text-gray-300 hover:text-gray-400"
                  />
                </div>

                <p className="px-1 md:px-4 py-2 md:py-4 text-xs md:text-sm leading-4">
                  {longAttributes[f]}
                </p>
              </div>
            ))}
        </section>
      </AnimateHeight>
      {feature.properties.parcel_id && type !== "parcels" && (
        <section
          className="bg-gray-100 p-2 text-xs font-bold flex items-center justify-between"
          style={{ borderLeft: `8px solid ${layers["parcels"].color}` }}
        >
          <h2 className="text-sm md:text-base">linked to parcel:</h2>
          <IdBadge
            layer={layers["parcels"]}
            id={feature.properties.parcel_id}
            link
          />
        </section>
      )}
      {feature.properties.building_id && type !== "buildings" && (
        <section
          className="bg-gray-100 p-2 text-xs font-bold flex items-center justify-between"
          style={{ borderLeft: `8px solid ${layers["buildings"].color}` }}
        >
          <h2 className="text-sm md:text-base">linked to building:</h2>
          <IdBadge
            layer={layers["buildings"]}
            id={feature.properties.building_id}
            link
          />
        </section>
      )}

      {feature.properties.street_id && type !== "streets" && (
        <section
          className="bg-gray-100 p-2 text-xs font-bold flex items-center justify-between"
          style={{ borderLeft: `8px solid ${layers["streets"].color}` }}
        >
          <h2 className="text-sm md:text-base">linked to street:</h2>
          <IdBadge
            layer={layers["streets"]}
            id={feature.properties.street_id}
            link
          />
        </section>
      )}
      {addrsHere.length > 0 && (
        <AddressesHere addresses={addrsHere} setLinked={setLinked} />
      )}
    </>
  );
};

export default ExplorerFeature;
