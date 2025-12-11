import React from "react";
import { Switch } from "@radix-ui/themes";
import { CameraIcon } from "@radix-ui/react-icons";
import MapControl from "./MapControl";

// Detroit bounding box with codgis organization filter
const mapillaryUrl = "https://www.mapillary.com/app/?lat=42.3486&lng=-83.0567&z=10&username=codgis";

const MapillarySwitch = ({ streetview, setStreetview }) => {
  return (
    <MapControl
      icon={<CameraIcon width="18" height="18" />}
      title="Street View"
      sourceUrl={mapillaryUrl}
    >
      <Switch
        size="1"
        checked={streetview}
        radius="large"
        onCheckedChange={setStreetview}
      />
    </MapControl>
  );
};

export default MapillarySwitch;
