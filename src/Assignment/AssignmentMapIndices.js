import { queryFeatures } from "@esri/arcgis-rest-feature-layer";
import { arcgisToGeoJSON, geojsonToArcGIS } from "@esri/arcgis-to-geojson-utils";
import { useEffect, useState } from "react";
import {IPoint} from '@esri/arcgis-rest-geocoding'

const AssignmentMapIndices = ({ center, session }) => {

  let [addrMapIndex, setAddrMapIndex] = useState(null)
  
  let geojson = {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
            center.lng,
            center.lat
          ]
        }
      }

  useEffect(() => {
    queryFeatures({
      url: `https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/Address_Map_Index/FeatureServer/0`,
      geometryType: "esriGeometryPoint",
      spatialRel: "esriSpatialRelIntersects",
      geometry: geojsonToArcGIS(geojson).geometry,
      authentication: session
    }).then(d => {
      if(d.features.length > 0) {
        setAddrMapIndex(d.features[0])
      }
      else(
        setAddrMapIndex(null)
      )
    })
  }, [center])

  return (
    <>
      {addrMapIndex &&
        <h2 className="text-sm py-3 px-3">Link to current address map index page: <a href={addrMapIndex.attributes.Link}>{addrMapIndex.attributes.Index_}</a></h2>
      }
    </>
  )
}

export default AssignmentMapIndices;