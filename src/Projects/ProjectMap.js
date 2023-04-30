import React, { useRef } from "react";
import MapboxGL from "mapbox-gl/dist/mapbox-gl";
import Mapbox, { NavigationControl } from "react-map-gl";
import bbox from "@turf/bbox";
import { baseStyle } from "../styles/mapstyle";
import _ from "lodash";

const ProjectMap = ({
  projects,
  currentProject,
  setCurrentProject,
  parcels,
  setParcels,
}) => {
  let style = _.cloneDeep(baseStyle);

  style.sources.projects.data.features = projects;
  if (currentProject) {
    style.sources["current-project"].data.features = [currentProject];
  }

  let parcelHighlightLayer = style.layers.findIndex(
    (l) => l.id === "parcel-linked"
  );
  style.layers[parcelHighlightLayer].filter = ["in", "parcel_id", ...parcels];

  const map = useRef();
  const initialViewState = {
    bounds: [-83.287803, 42.255192, -82.910451, 42.45023],
    fitBoundsOptions: {
      padding: 50,
      maxZoom: 17,
    },
  };

  if (currentProject) {
    map.current.fitBounds(bbox(currentProject), {
      padding: 50,
      maxZoom: 17,
    });
  }

  const handleClick = (e) => {
    let project = map.current.queryRenderedFeatures(e.point, {
      layers: ["all-projects-fill"],
    })[0];
    if (!project) {
      return;
    }
    
    
    let match = projects.find((p) => p.id === project.id);
    setCurrentProject(match);
  };

  const handleDblClick = (e) => {
    let parcel = map.current.queryRenderedFeatures(e.point, {
      layers: ["parcel-fill"],
    })[0];
    if (!parcel) {
      return;
    }
    let parcelId = parcel.properties.parcel_id;

    if (parcels.indexOf(parcelId) === -1) {
      setParcels([...parcels, parcelId].sort());
    } else {
      setParcels(parcels.filter((p) => p !== parcelId));
    }
  };

  return (
    <Mapbox
      ref={map}
      mapLib={MapboxGL}
      mapStyle={style}
      onDblClick={handleDblClick}
      onClick={handleClick}
      doubleClickZoom={false}
      initialViewState={initialViewState}
      interactiveLayerIds={["all-projects-fill", "parcel-fill"]}
    ></Mapbox>
  );
};

export default ProjectMap;
