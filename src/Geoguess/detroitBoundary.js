// Official City of Detroit boundary from ArcGIS FeatureServer
import boundaryData from './detroitBoundary.json';

export const DETROIT_BOUNDS = {
  minLng: -83.2878,
  maxLng: -82.9105,
  minLat: 42.255,
  maxLat: 42.4504
};

// Official Detroit boundary polygon
export const detroitBoundary = boundaryData.features[0];

// Center of Detroit for map default view
export const DETROIT_CENTER = [-83.0458, 42.3314];

export default detroitBoundary;
