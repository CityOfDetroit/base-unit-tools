import { Viewer, SimpleMarker } from "mapillary-js";
import { useEffect, useState } from "react";
import moment from "moment";
import distance from "@turf/distance";
import { arcgisToGeoJSON } from '@esri/arcgis-to-geojson-utils';
import centroid from '@turf/centroid';
import bearing from "@turf/bearing";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStreetView } from "@fortawesome/free-solid-svg-icons";
import _ from 'lodash'

/**
 * Wrap a value on the interval [min, max].
 */
function wrap(value, min, max) {
  var interval = max - min;

  while (value > max || value < min) {
    if (value > max) {
      value = value - interval;
    } else if (value < min) {
      value = value + interval;
    }
  }

  return value;
}

/**
 * Convert a desired bearing to a basic X image coordinate for
 * a specific node bearing.
 *
 * Works only for a full 360 panorama.
 */
function bearingToBasic(desiredBearing, nodeBearing) {
  // 1. Take difference of desired bearing and node bearing in degrees.
  // 2. Scale to basic coordinates.
  // 3. Add 0.5 because node bearing corresponds to the center
  //    of the image. See
  //    https://mapillary.github.io/mapillary-js/classes/viewer.html
  //    for explanation of the basic coordinate system of an image.
  var basic = (desiredBearing - nodeBearing) / 360 + 0.5;

  // Wrap to a valid basic coordinate (on the [0, 1] interval).
  // Needed when difference between desired bearing and node
  // bearing is more than 180 degrees.
  return wrap(basic, 0, 1);
}

/**
 * Function to set the mapillary viewer's center by computing bearing
 */
function computeBearing(node, start, end) {
  var nodeBearing = node.computedCompassAngle || node.properties.compass_angle; // Computed node compass angle (equivalent
  // to bearing) is used by mjs when placing
  // the node in 3D space.

  // compute this with @turf/bearing
  var desiredBearing = bearing(start, end); // Your desired bearing.
  var basicX = bearingToBasic(desiredBearing, nodeBearing);
  var basicY = 0.45; // tilt slightly up

  var center = [basicX, basicY];
  return center
}

const featureToCentroidCoords = (feature) => {
  let geojsonFeature = arcgisToGeoJSON(feature)
  let featureCentroid = centroid(geojsonFeature.geometry).geometry.coordinates
  let coords = { lng: featureCentroid[0], lat: featureCentroid[1] }
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


const MapillarySv = ({ svImage, svImages, setSvImage, setSvBearing, feature }) => {

  let [streetview, setStreetview] = useState(null)

  let [sequences, setSequences] = useState(null)

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
      imageId: null
    });

    viewer.deactivateCover()

    setStreetview(viewer)

    viewer.on("image", function (e) {
      e.target.getBearing()
        .then(d => setSvBearing(d))
      setSvImage({ properties: {...e.image._core, sequence_id: e.image._spatial.sequence }})
    });

    viewer.on("pov", function (e) {
      e.target.getBearing()
        .then(d => setSvBearing(d))
    });

  }, [])

  useEffect(() => {
    if (streetview) {
      console.log("New feature")
      let coords = centroid(arcgisToGeoJSON(feature)).geometry.coordinates
      let defaultMarker = new SimpleMarker("default-id", { lat: coords[1], lng: coords[0] }, markerStyle);
      let markerComponent = streetview.getComponent("marker");
      markerComponent.add([defaultMarker]);

      let imagesByDistance = _.sortBy(svImages, i => distance(i.geometry, centroid(arcgisToGeoJSON(feature))))
      if(svImage) {
        let filtered = imagesByDistance.filter(i => i.properties.sequence_id === svImage.properties.sequence_id)
        if (filtered.length > 0) {
          setSvImage(filtered[0])
        }
        else {
          setSvImage(imagesByDistance[0])
        }
      }
      else {
        setSvImage(imagesByDistance[0])
      }
      streetview.moveTo(imagesByDistance[0].properties.id).then(i => {
        let imageCoords = i._core.geometry.coordinates ? i._core.geometry.coordinates : [i._core.geometry.lng, i._core.geometry.lat]
        let featureCentroid = centroid(arcgisToGeoJSON(feature)).geometry.coordinates
        let center = computeBearing(i, imageCoords, featureCentroid)
        streetview.setCenter(center)
      })

    }
  }, [feature, streetview])

  useEffect(() => {
    let imagesByDistance = _.sortBy(svImages, i => distance(i.geometry, centroid(arcgisToGeoJSON(feature))))

    let uniqSeq = _.uniqBy(imagesByDistance, 'properties.sequence_id').map(i => {
      return {
        sequence_id: i.properties.sequence_id,
        image_id: i.properties.id,
        captured_at: i.properties.captured_at,
        readable_ts: moment(i.properties.captured_at).format("ll")
      }
    })
    setSequences(_.uniqBy(uniqSeq, 'readable_ts'))
  }, [svImages])

  return (
    <>
      <h2 className="text-lg bg-gray-200 p-2 flex items-center justify-between">
        <span><FontAwesomeIcon icon={faStreetView} className="mr-2" />Street view</span>
        {
          sequences && svImage && 
          <select value={svImage.properties.sequence_id} onChange={(e) => {
              let imagesInSeq = _.sortBy(svImages, i => distance(i.geometry, centroid(arcgisToGeoJSON(feature)))).filter(i => i.properties.sequence_id == e.target.value)
              console.log(imagesInSeq)
              streetview.moveTo(imagesInSeq[0].properties.id)
            }
          }>
          {sequences.map(seq => (
            <option key={seq.sequence_id} value={seq.sequence_id}>{seq.readable_ts}</option>
          ))}
        </select>}
      </h2>
      <section className="sidebar-section street-view">
        <div id="mly-viewer" style={{ height: 300, width: '100%' }} />
      </section>
    </>
  )
}

export default MapillarySv;