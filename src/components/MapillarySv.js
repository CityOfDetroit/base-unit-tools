import { Viewer, SimpleMarker } from "mapillary-js";
import { useEffect, useState } from "react";
import moment from "moment";
import { arcgisToGeoJSON } from '@esri/arcgis-to-geojson-utils';
import centroid from '@turf/centroid';

const featureToCentroidCoords = (feature) => {
  let geojsonFeature = arcgisToGeoJSON(feature)
  let featureCentroid = centroid(geojsonFeature.geometry).geometry.coordinates
  let coords = {lng: featureCentroid[0], lat: featureCentroid[1]}
  return coords
}

let markerStyle = {
  ballColor: "white",
  ballOpacity: 0.65,
  color: "#feb70d",
  opacity: 0.55,
  interactive: false,
  radius: 2,
};


const MapillarySv = ({ svKeys, svImageKey, setSvImageKey, setSvBearing, feature }) => {

  let [streetview, setStreetview] = useState(null)

  useEffect(() => {
    const viewer = new Viewer({
      accessToken: 'MLY|4690399437648324|de87555bb6015affa20c3df794ebab15',
      container: 'mly-viewer',
      component: {
        marker: true,
        bearing: false,
        cover: true,
        attribution: false,
        sequence: false,
        cache: true,
        direction: true
      },
      imageId: svKeys[0].id.toString()
    });

    viewer.deactivateCover()

    setStreetview(viewer)

    if(feature) {
      let coords = featureToCentroidCoords(feature);
      let defaultMarker = new SimpleMarker("default-id", { lat: coords.lat, lng: coords.lng }, markerStyle);
      let markerComponent = viewer.getComponent("marker");
      markerComponent.add([defaultMarker]);
    }

    viewer.on("image", function(e) { 
      setSvImageKey({id: e.image.id, captured_at: e.image._spatial.captured_at})
      e.target.getBearing()
        .then(d => setSvBearing(d))
    });

    viewer.on("pov", function(e) {  
      e.target.getBearing()
        .then(d => setSvBearing(d))
    });
  }, [])

  useEffect(() => {
    if(streetview) {
      streetview.moveTo(svKeys[0].id.toString())
    }
  }, [svKeys])

  useEffect(() => {
    if(streetview) {
      let coords = featureToCentroidCoords(feature);
      let defaultMarker = new SimpleMarker("default-id", { lat: coords.lat, lng: coords.lng }, markerStyle);
      let markerComponent = streetview.getComponent("marker");
      markerComponent.add([defaultMarker]);
    }
  }, [feature])

  return (
    <>
    <h2 className="text-lg bg-gray-200 p-2 flex items-center justify-between">
      <span>Street view</span>
      <span>{moment(svImageKey.captured_at).format("ll")}</span>
    </h2>
    <section className="sidebar-section street-view">
    <div id="mly-viewer" style={{height: 300, width: '100%'}}/>
    </section>
    </>
  )
}

export default MapillarySv;