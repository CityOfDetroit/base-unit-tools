import { useState, useEffect, useCallback } from 'react';
import { queryFeatures } from "@esri/arcgis-rest-feature-service";
import layers from '../data/layers';

const useBaseFeature = (initialId, initialLayer) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [id, setId] = useState(initialId);
  const [layer, setLayer] = useState(initialLayer);

  const fetchFeature = useCallback(async (newId, newLayer) => {
    setLoading(true);
    setError(null);

    let lyr = layers[newLayer];

    try {
      const layerUrl = getLayerUrl(newLayer);

      const where = newLayer === 'parcel'
        ? `parcel_id = '${newId}'`
        : `${lyr.id_column} = ${newId}`;

      const response = await queryFeatures({
        url: layerUrl,
        where,
        outFields: "*",
        returnGeometry: true,
        f: "geojson",
      });

      if (response.features?.length > 0) {
        setData(response.features[0]);
      } else {
        setData(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeature(id, layer);
  }, [id, layer, fetchFeature]);

  const refetch = useCallback((newId, newLayer) => {
    setId(newId);
    if(newLayer) { setLayer(newLayer); }
  }, []);

  const nullify = () => {
    setLoading(true);
    setData(null);
    setLoading(false);
  };

  return { data, loading, error, refetch, nullify };
};

// Helper function to get the correct endpoint based on the layer
const getLayerUrl = (layer) => {
  switch (layer) {
    case 'building':
      return layers.building.endpoint;
    case 'parcel':
      return layers.parcel.endpoint;
    case 'address':
      return layers.address.endpoint;
    case 'street':
      return layers.street.endpoint;
    default:
      throw new Error('Invalid layer specified');
  }
};

export default useBaseFeature;