import { Viewer } from "mapillary-js";
import { useEffect, useRef, useState } from "react";

const MapillarySv = ({ svImageKey, setSvImageKey }) => {

  let [streetview, setStreetview] = useState(null)

  useEffect(() => {
    const viewer = new Viewer({
      accessToken: 'MLY|4690399437648324|de87555bb6015affa20c3df794ebab15',
      container: 'mapillar',
      imageId: svImageKey.toString()
    });

    viewer.deactivateCover()
    setStreetview(viewer)
  }, [])

  useEffect(() => {
    if(streetview) {
      streetview.moveTo(svImageKey)
    }
  }, [svImageKey])

  return (
    <div id="mapillar" style={{height: 300, width: 500}}/>
  )
}

export default MapillarySv;