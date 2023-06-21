import {
  faChevronCircleDown,
  faChevronCircleRight
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import AnimateHeight from "react-animate-height";
import CopyValue from "../../src/components/CopyValue";
import layers from "../data/layers";
import { queryFeatures } from "@esri/arcgis-rest-feature-layer";
import AddressesHere from "./AddressesHere";

import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import IdBadge from './IdBadge';

const AttributeTable = ({ attributes }) => {
  return (
    <table className="w-full">
      <tbody>
        {Object.keys(attributes).map((f, i) => (
          <tr
            key={i}
            className={
              i + 1 === Object.keys(attributes).length
                ? "flex items-center"
                : "border-b-2 border-gray-400 flex items-center"
            }
          >
            <td className="w-1/3 md:w-2/5 my-2 font-bold text-xs md:text-sm ">
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
      </tbody>
    </table>
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

  let { attributes, longAttributes } = formatted;

  let [addrsHere, setAddrsHere] = useState([]);

  useEffect(() => {
    setAddrsHere([]);
    if(type !== 'addresses') {
      queryFeatures({
        url: layers.addresses.endpoint,
        where: `${layer.name === 'parcels' ? 'parcel_id' : layer.id_column} = '${id}'`,
        outFields: "*",
        f: 'geojson'
      }).then(r => {
        setAddrsHere(r.features)
      })
    }
    if(type === "addresses") {
      setLinked({
        addresses: [],
        buildings: [feature.properties.building_id],
        parcels: [feature.properties.parcel_id],
        streets: [feature.properties.street_id]
      })
    }
  }, [selectFeature]);

  useEffect(() => {
    if(type === "streets") {
      setLinked({
        addresses: addrsHere.map(a => a.properties.address_id),
        buildings: addrsHere.map(a => a.properties.building_id).filter(a => a !== null),
        parcels: addrsHere.map(a => a.properties.parcel_id).filter(a => a !== null),
        streets: []
      })
    }
    if(type === "buildings") {
      setLinked({
        addresses: addrsHere.map(a => a.properties.address_id),
        buildings: [],
        parcels: addrsHere.map(a => a.properties.parcel_id).filter(a => a !== null),
        streets: addrsHere.map(a => a.properties.street_id).filter(a => a !== null)
      })
    }
    if(type === "parcels") {
      setLinked({
        addresses: addrsHere.map(a => a.properties.address_id),
        buildings: addrsHere.map(a => a.properties.building_id).filter(a => a !== null),
        parcels: [],
        streets: addrsHere.map(a => a.properties.street_id).filter(a => a !== null)
      })
    }
  }, [addrsHere])

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
          <FontAwesomeIcon
            icon={show ? faChevronCircleDown : faChevronCircleRight}
            className="mx-2 text-gray-500 text-xl"
            onClick={() => setShow(!show)}
          />
        </div>
      </div>
      <AnimateHeight duration={250} height={show ? "auto" : 0}>
        <section
          className="sidebar-section"
          style={{ borderLeft: `8px solid ${layer.color}` }}
        >
          <AttributeTable attributes={attributes} />
          {longAttributes &&
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

                <p className="px-1 md:px-2 text-xs md:text-sm leading-4">
                  {longAttributes[f]}
                </p>
              </div>
            ))}
        </section>
      </AnimateHeight>
      {feature.properties.parcel_id && type !== 'parcels' && <section className='sidebar-section' style={{ borderLeft: `8px solid ${layers['parcels'].color}` }}>
        <div className="flex items-center justify-between" >
          <h2 className="text-sm md:text-base">linked to parcel:</h2>
          <IdBadge layer={layers['parcels']} id={feature.properties.parcel_id} link />
        </div>
      </section>
      }
      {feature.properties.building_id && type !== 'buildings' && <section className='sidebar-section' style={{ borderLeft: `8px solid ${layers['buildings'].color}` }}>
        <div className="flex items-center justify-between" >
          <h2 className="text-sm md:text-base">linked to building:</h2>
          <IdBadge layer={layers['buildings']} id={feature.properties.building_id} link />
        </div>
      </section>
      }

      {feature.properties.street_id && type !== 'streets' && <section className='sidebar-section' style={{ borderLeft: `8px solid ${layers['streets'].color}` }}>
        <div className="flex items-center justify-between" >
          <h2 className="text-sm md:text-base">linked to street:</h2>
          <IdBadge layer={layers['streets']} id={feature.properties.street_id}  link />
        </div>
      </section> }
      {addrsHere.length > 0 && (
        <AddressesHere addresses={addrsHere} setLinked={setLinked} />
      )}
    </>
  );
};

export default ExplorerFeature;
