import React from 'react';
import layers from '../data/layers';
import IdBadge from '../Explorer/IdBadge';

export const IssueReporterFeature = ({ attr, clicked }) => {

  let layer = layers[clicked.type];

  return (
    <section className='sidebar-section feature' style={{ borderLeft: `8px solid ${layer.color}` }}>
      <div className="flex items-center justify-between text-lg">
        <h2>{layer.label}</h2>
        <div className="flex items-center">
          {/* {hasSource && <span className="font-semibold text-gray-500 bg-gray-300 py-1 px-2 mx-3 text-sm">{attr.geo_source}</span>} */}
          <IdBadge id={attr[layer.id_column]} layer={layer} link={false} />
          {/* <pre className="font-bold" style={{background: '#feb70d'}}>{clicked.type === 'parcels' ? null : `#`}{attr[layer.id_column]}</pre> */}
        </div>
      </div>
    </section>
  );
};
