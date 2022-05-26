import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Tooltip from "@radix-ui/react-tooltip";
import { geocoderFields } from "../data/geocoderFields";
import {
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { ToggleButton } from "../components/ToggleButton";

const GeocoderOptions = ({ options, setOptions }) => {
  return (
    <section className="sidebar-section mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3>Attach fields</h3>

        <div className="flex items-center gap-1">
          {[true, false].map((b) => (
            <ToggleButton
              small
              key={`${b}-basic`}
              title={b ? "All" : "None"}
              active={true}
              onClick={() => {
                let newOpts = {};
                ["ids", "coords"].forEach((field) => {
                  newOpts[field] = b;
                });
                setOptions({ ...options, ...newOpts });
              }}
            />
          ))}
        </div>
      </div>

      <div className="px-2">

      <div className="checkbox-option">
        <input
          type="checkbox"
          id="coords"
          name="coords"
          onChange={() => setOptions({ ...options, coords: !options.coords })}
          checked={options.coords}
          />
        <label htmlFor="coords">Coordinates (Lat/Lng)</label>
      </div>

      <div className="checkbox-option">
        <input
          type="checkbox"
          id="ids"
          name="ids"
          onChange={() => setOptions({ ...options, ids: !options.ids })}
          checked={options.ids}
          />
        <label htmlFor="ids">Base unit IDs</label>
      </div>
          </div>

      <div className="flex items-center justify-between mt-2 mb-2">
        <h3>Attach boundaries</h3>

        <div className="flex items-center gap-1">
          {[true, false].map((b) => (
            <ToggleButton
              key={`${b}-custom`}
              title={b ? "All" : "None"}
              active={true}
              onClick={() => {
                let newOpts = {};
                geocoderFields.forEach((field) => {
                  newOpts[field.name] = b;
                });
                setOptions({ ...options, ...newOpts });
              }}
            />
          ))}
        </div>
      </div>

      <div className="px-2">

      {geocoderFields.map((field) => (
        <div className="checkbox-option flex items-center gap-1" key={field.name}>
          <input
            type="checkbox"
            id={field.name}
            name={field.name}
            onChange={() =>
              setOptions({
                ...options,
                [field.name]: !options[field.name],
              })
            }
            checked={options[field.name]}
            />
          <label htmlFor={field.name}>{field.display}</label>
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <FontAwesomeIcon icon={faInfoCircle} className="text-gray-400" />
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p className="bg-white p-2 rounded-md text-sm text-gray-700">{field.description}</p>
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      ))}
      </div>
    </section>
  );
};

export default GeocoderOptions;
