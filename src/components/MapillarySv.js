import { Viewer } from "mapillary-js";
import { useEffect, useState } from "react";
import moment from "moment";


const MapillarySv = ({ svKeys, svImageKey, setSvImageKey, setSvBearing }) => {

  let [streetview, setStreetview] = useState(null)

  useEffect(() => {
    const viewer = new Viewer({
      accessToken: 'MLY|4690399437648324|de87555bb6015affa20c3df794ebab15',
      container: 'mly-viewer',
      imageId: svKeys[0].id.toString()
    });

    viewer.deactivateCover()

    setStreetview(viewer)

    viewer.on("image", function(e) { 
      console.log(`viewer.on`, e.image)
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