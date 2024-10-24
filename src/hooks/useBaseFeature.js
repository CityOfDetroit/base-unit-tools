import { useState, useEffect, useCallback } from 'react';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Query from '@arcgis/core/rest/support/Query';
import layers from '../data/layers';
import { arcgisToGeoJSON } from "@terraformer/arcgis"

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
      const featureLayer = new FeatureLayer({ url: layerUrl });

      const query = new Query();

      if (newLayer === 'parcel') {
        query.where = `parcel_id = '${newId}'`;
      }
      else {
        query.where = `${lyr.id_column} = ${newId}`;
      }
      query.outFields = ['*'];
      query.returnGeometry = true;
      query.f = 'geojson';
      query.outSpatialReference = 4326;

      const featureSet = await featureLayer.queryFeatures(query);

      let geojson = arcgisToGeoJSON(featureSet.toJSON());
      
      if (featureSet.features.length > 0) {
        setData(geojson.features[0]);
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
      return layers.parcel.feature_service;
    case 'address':
      return layers.address.endpoint;
    case 'street':
      return layers.street.endpoint;
    default:
      throw new Error('Invalid layer specified');
  }
};

export default useBaseFeature;