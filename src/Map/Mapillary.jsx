import { Card, Flex, RadioGroup, Text } from "@radix-ui/themes";
import bearing from "@turf/bearing";
import centroid from "@turf/centroid";
import distance from "@turf/distance";
import { SimpleMarker, Viewer } from "mapillary-js";
import "mapillary-js/dist/mapillary.css";
import moment from "moment";
import React, { useEffect, useState, useRef } from "react";
import _ from "underscore";
import { DataSource } from "../components/CardLink";

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
  return center;
}

const Mapillary = ({
  svImages,
  feature,
  viewerImage,
  setViewerImage,
  setViewerBearing,
}) => {
  let [sequenceImages, setSequenceImages] = useState([]);

  let [selectedImage, setSelectedImage] = useState(null);

  let [viewer, setViewer] = useState(null);

  let [loading, setLoading] = useState(false);

  let [center, setCenter] = useState(null);

  let mlyViewerRef = useRef(null);

  useEffect(() => {
    const viewer = new Viewer({
      accessToken: "MLY|4690399437648324|de87555bb6015affa20c3df794ebab15",
      container: mlyViewerRef.current,
      component: {
        marker: true,
        bearing: false,
        cover: true,
        attribution: false,
        sequence: false,
        cache: true,
        direction: true,
      },
      imageId: null,
    }, [mlyViewerRef]);

    viewer.deactivateCover();

    viewer.on("nodechanged", (node) => {
      let center = computeBearing(
        node,
        feature.geometry.coordinates,
        selectedImage.geometry.coordinates
      );
      viewer.setCenter(center);
    });

    viewer.on("image", (image) => {
      setViewerImage(image);
      image.target.getBearing().then((d) => setViewerBearing(d));
    });

    viewer.on("imageclick", (image) => {
      setSelectedImage(image);
    });

    viewer.on("dblclick", (image) => {
      viewer.moveTo(image.key, { transition: 0.1 });
    });

    viewer.on("pov", function (e) {
      e.target.getBearing().then((d) => setViewerBearing(d));
    });

    setViewer(viewer);
  }, []);

  useEffect(() => {
    if (viewer && selectedImage) {
      let coords = centroid(feature).geometry.coordinates;
      let defaultMarker = new SimpleMarker(
        "default-id",
        { lat: coords[1], lng: coords[0] },
        {
          ballColor: "#feb70d",
          ballOpacity: 0.45,
          color: "#feb70d",
          opacity: 0.25,
          interactive: false,
          radius: 2.5,
        }
      );
      let markerComponent = viewer.getComponent("marker");
      markerComponent.add([defaultMarker]);

      viewer
        .moveTo(selectedImage.properties.id, { transition: 0.1 })
        .then((i) => {
          let imageCoords = i._core.geometry.coordinates
            ? i._core.geometry.coordinates
            : [i._core.geometry.lng, i._core.geometry.lat];
          let featureCentroid = centroid(feature).geometry.coordinates;
          let center = computeBearing(i, imageCoords, featureCentroid);
          setCenter(center);
          viewer.setCenter(center);
        });
    }
  }, [selectedImage, viewer]);

  useEffect(() => {
    if (feature) {
      setLoading(true);

      let images = svImages;

      // attach distance from the feature
      images.forEach((image) => {
        image.properties.distance = distance(centroid(feature), image.geometry);
      });

      // filter images within 0.04 degrees (not very scientific)
      let far = images.filter((image) => image.properties.distance < 0.08);
      let near = images.filter((image) => image.properties.distance < 0.04);
      if (near.length > 0) {
        images = near;
      } else {
        images = far;
      }

      // sort by distance
      images = _.sortBy(images, (image) => image.properties.distance);

      // unique by properties.sequence_id
      images = _.uniq(images, (image) => image.properties.sequence_id);

      // sort by captured_at
      images = _.sortBy(
        images,
        (image) => image.properties.captured_at
      ).reverse();

      // unique by capture date
      images = _.uniq(images, (image) =>
        moment(image.properties.captured_at).format("YYYY-MM-DD")
      );

      setSequenceImages(images);
      setSelectedImage(images[0]);

      setLoading(false);
    }
  }, [svImages, feature]);

  console.log(selectedImage);
  console.log(viewer);

  let url;

  if (selectedImage && center) {
    url = `https://www.mapillary.com/app/?lat=${selectedImage._geometry.coordinates[1]}&lng=${selectedImage._geometry.coordinates[0]}&z=18&pKey=${selectedImage.properties.id}&focus=photo&x=${center[0]}&y=${center[1]}`;
  }

  return (
    <Flex
      className="h-auto sm:h-96"
      p={"2"}
      gap={"4"}
      gridArea={"streetview"}
      direction={{ initial: "column", sm: "row" }}
    >
      <div
        className="w-full sm:w-2/3 lg:w-3/4 rounded-md min-h-72"
        id="mly-viewer"
        ref={mlyViewerRef}
      ></div>

      <Card size={"1"} className="w-full sm:w-1/3 lg:w-1/4">
        <Flex
          direction={{ initial: "row", sm: "column" }}
          justify={{ initial: "between", sm: "start" }}
          align={{ initial: "start", sm: "start" }}
        >
          {viewerImage && (
            <Flex direction="column">
              <Text size={"1"}>Image taken on:</Text>
              <Text size={"3"} weight="bold">
                {moment(viewerImage.image._spatial.captured_at).format(
                  "MMM DD, YYYY"
                )}
              </Text>
            </Flex>
          )}
          <Flex
            direction={{ initial: "column" }}
            align={"start"}
            className="w-full"
          >
            {loading && <Text size={"1"}>Loading...</Text>}
            {svImages.length === 0 && (
              <Text size={"1"}>
                No nearby images found; Zoom in on the map to load imagery.
              </Text>
            )}
            {sequenceImages.length > 0 && (
              <Text size={"1"} weight={"medium"} mb={"1"}>
                Select another date:
              </Text>
            )}
            {sequenceImages?.length > 0 && !loading && viewerImage && (
              <RadioGroup.Root
                onValueChange={(value) =>
                  setSelectedImage(
                    sequenceImages.find(
                      (image) => image.properties.sequence_id === value
                    )
                  )
                }
                value={viewerImage?.image._core?.sequence?.id}
                className="max-h-72 overflow-y-auto w-full"
              >
                {sequenceImages.map((image, idx) => {
                  return (
                    <RadioGroup.Item
                      value={image.properties.sequence_id}
                      key={image.properties.sequence_id}
                      color="gray"
                      size={"1"}
                    >
                      <Text size={1}>
                        {moment(image.properties.captured_at).format(
                          "MM-DD-YY"
                        )}
                      </Text>
                    </RadioGroup.Item>
                  );
                })}
              </RadioGroup.Root>
            )}
          </Flex>
        </Flex>
        {url && (
          <DataSource url={url} />
        )}
      </Card>
    </Flex>
  );
};

export default Mapillary;
