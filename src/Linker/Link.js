import React from 'react';
import useFeature from '../hooks/useFeature';
import layers from '../data/layers';
import IdBadge from '../Explorer/IdBadge';

export const Link = ({ type, id }) => {
  let feature = useFeature({
    type: type,
    id: id,
    f: 'geojson'
  });

  if (feature) {

    let layer = layers[type];

    return (
      <section className='sidebar-section'>
        <h3 className="flex items-center justify-between">
          {layer.label}
          <IdBadge layer={layer} id={id} link={false} />
        </h3>
        <pre className="text-xs h-24 overflow-y-auto px-4 bg-white">
          {JSON.stringify(feature.properties, null, 2)}
        </pre>
      </section>
    );
  }

  else {
    return <div>Loading...</div>;
  }
};
