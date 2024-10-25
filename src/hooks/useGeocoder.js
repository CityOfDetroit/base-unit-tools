import { useState, useEffect } from 'react';
import { geocode } from '@esri/arcgis-rest-geocoding';

export const geocoders = {
  prod: `https://opengis.detroitmi.gov/opengis/rest/services/BaseUnits/BaseUnitGeocoder/GeocodeServer`,
  dev: `https://opengis.detroitmi.gov/opengis/rest/services/BaseUnits/BaseUnitGeocoderDev/GeocodeServer`,
}

export const geocoderUrl = geocoders.prod

const useGeocoder = (initialAddress = '') => {
  const [address, setAddress] = useState(initialAddress);
  const [feature, setFeature] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (address) {
      setLoading(true);
      setError(null);

      geocode({
        endpoint: geocoderUrl,
        singleLine: address,
        outFields: '*'
      })
        .then(response => {
          if (response.candidates && response.candidates.length > 0) {
            setFeature(response.candidates[0]);
          } else {
            setFeature(null);
            setError('No results found...')
          }
          setLoading(false);
        })
        .catch(err => {
          setError(err);
          setFeature(null);
          setLoading(false);
        });
    } else {
      setFeature(null);
    }
  }, [address]);

  const changeAddress = (newAddress) => {
    setAddress(newAddress);
  };

  return { address, feature, loading, error, changeAddress };
};

export default useGeocoder;