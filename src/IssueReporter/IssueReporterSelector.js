import { faSearch } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import Button from '../components/Button';
import _ from 'lodash';
import layers from '../data/layers';

export const IssueReporterSelector = ({ setTargetType, targetType, geocode, value, setValue, setResponse, fetchFeature, feature, setFeature, target, setTarget }) => {
  return (
    <>
      <div className="flex items-center justify-between my-2">
        <h3 className="text-sm w-1/4 flex items-center justify-start" onClick={() => setTargetType('address')}>
          <input type="radio" id="address" name="type" value="address" readOnly
            className="mx-1"
            checked={targetType === 'address'} />
      Address
    </h3>
        <input
          className="p-2 py-3 w-2/3"
          type="text"
          name="address"
          disabled={targetType === 'base_unit'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={(e) => e.code === 'Enter' && geocode(value, setResponse)} />
        <Button
          active={value !== '' && targetType === 'address'}
          onClick={() => geocode(value, setResponse)}
          icon={faSearch}
          text='Search'
          small />
      </div>
      <div className="flex items-center justify-between my-2">
        <h3 className="text-sm w-1/4 flex items-center justify-start" onClick={() => { setTargetType('base_unit'); setValue(''); }}>
          <input type="radio" id="base_unit" name="type" value="base_unit"
            className="mx-1"
            readOnly
            checked={targetType === 'base_unit'} />
                Base Unit
                </h3>
        <div className="w-2/3 flex items-center justify-between">
          <select
            className="p-2 py-3"
            disabled={targetType === 'address'}
            value={target.type || 'addresses'}
            onChange={(e) => setTarget({ ...target, type: e.target.value })}
          >
            {Object.keys(layers).map(l => (
              <option value={l} key={l}>{layers[l].label}</option>
            ))}
          </select>

          <input
            className="p-2 py-3 w-40"
            type="text"
            name="address"
            value={target.id ? target.id : ''}
            disabled={targetType === 'address'}
            onChange={(e) => setTarget({ ...target, id: e.target.value })}
            onKeyPress={(e) => e.code === 'Enter' && fetchFeature(target, setFeature)}
          />
        </div>
        {/* <Button
          active={target.id && target.type && targetType === 'base_unit'}
          disabled={targetType === 'address'}
          onClick={() => fetchFeature(target, setFeature)}
          icon={faSearch}
          text='Search'
          small
        /> */}
      </div>
    </>
  );
};
