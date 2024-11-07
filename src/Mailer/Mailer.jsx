import { getLayer, queryFeatures } from "@esri/arcgis-rest-feature-service";
import { geojsonToArcGIS } from "@terraformer/arcgis";
// import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { Promise } from "bluebird";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import MailerAddressSearch from "./MailerAddressSearch";
import MailerBuffer from "./MailerBuffer";
import MailerLayerSelector from "./MailerLayerSelector";
import MailerMap from "./MailerMap";
import MailerSelection from "./MailerSelection";
import MailerTable from "./MailerTable";
import { Button, Card, Grid, Text, Flex, Switch, RadioCards } from "@radix-ui/themes";
import { useAuth } from "../contexts/AuthContext";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";

const Mailer = () => {
  // object to track filters
  const allFilters = {
    "usps-deliverable": {
      activeText: "Deliverable addresses only",
      inactiveText: "All addresses, even undeliverable",
      default: true,
      filterFunction: (a) =>
        a.attributes.usps_status === "Deliverable" ||
        a.attributes.USPS_Status === "Deliverable",
    },
  };

  // this tool is principally driven by this piece of state
  // which represents represents the current selection area
  const [geom, setGeom] = useState(null);

  // use this boolean to see if the user has access to the mailing list layer
  const [access, setAccess] = useState(false);

  // keep track of mailer mode here:
  // mode 1 is centroid
  // mode 2 is parcel
  let mailerLayers = [
    `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/MailerLayers/FeatureServer/0`, // parcels
    `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/MailerLayers/FeatureServer/1`, // centroids
  ];
  const [layer, setLayer] = useState("centroid");

  // use this to set state of filter toggles
  let defaults = {};
  Object.keys(allFilters).forEach((f) => {
    defaults[f] = allFilters[f].default;
  });
  const [filters, setFilters] = useState(defaults);
  // store the selection area object IDs, all addresses, and the filtered addresses.
  const [resultIds, setResultIds] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // draw mode
  // should be one of these: https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/API.md#modes
  const [mode, setMode] = useState("simple_select");

  const [formattedData, setFormattedData] = useState(null);
  const [features, setFeatures] = useState(null);

  let { token, session } = useAuth();

  // this effect runs if the user logs in or out.
  // it tests access to the mailing list layer
  useEffect(() => {
    getLayer({
      url: mailerLayers[0],
      authentication: token,
    }).then(
      () => {
        setAccess(true);
      },
      () => {
        setAccess(false);
      }
    );
  }, []);

  // this effect runs when the geom changes (or if there's a change in access)
  // it gets the objectids for all the features in the selection --
  // we just want this list so we can display a total count && generate breakpoints
  // in the fetchAddresses function
  useEffect(() => {
    setResultIds(null);
    setAddresses([]);
    setFiltered([]);
    if (geom && access) {
      queryFeatures({
        url: layer === "parcel" ? mailerLayers[0] : mailerLayers[1],
        // the key bit
        returnIdsOnly: true,
        orderByFields: "objectid",
        // intersects-with-selection parameters
        geometry: geojsonToArcGIS(geom)[0].geometry,
        geometryType: "esriGeometryPolygon",
        spatialRel: "esriSpatialRelIntersects",
        inSR: 4326,
        outSR: 4326,
        httpMethod: "POST",
        returnCentroid: layer === "parcel" ? true : false,
        authentication: token,
      }).then((d) => {
        setResultIds(d);
      });
    }
  }, [geom, access, token, layer]);

  useEffect(() => {
    // this function is what runs when we click "Download CSV"
    // we'll use the list of objectIDs to actually go get the addresses
    const fetchAddresses = () => {
      let allAddresses = [];

      // fetch this many addresses at a time. we can turn this up to 2000
      const chunkSize = 500;

      // get the "breakpoints": basically the first ID value, then every chunkSize'th value afterwards
      let breakpoints = resultIds.objectIds.filter(
        (oid, i) => i === 0 || i % chunkSize === 0
      );

      // push the last ObjectID plus one onto the stack -- we still need to fetch between it
      breakpoints.push(resultIds.objectIds.slice(-1)[0] + 1);

      // create a bunch of Promises for the number of queries we need
      let queryParams = breakpoints.slice(1).map((b, i) => {
        let params = {
          url: layer === "parcel" ? mailerLayers[0] : mailerLayers[1],
          orderByFields: "objectid",
          // this is confusing, but produces the correct result.
          // it has to be weird because of how BETWEEN seems to work.
          where: `objectid between ${
            i === 0 ? breakpoints[0] - 1 : breakpoints[i]
          } and ${b - 1}`,
          geometry: geojsonToArcGIS(geom)[0].geometry,
          geometryType: "esriGeometryPolygon",
          spatialRel: "esriSpatialRelIntersects",
          httpMethod: "POST",
          returnCentroid: layer === "parcel" ? true : false,
          inSR: 4326,
          outSR: 4326,
          resultRecordCount: chunkSize,
          authentication: token,
        };
        return params;
        // return queryFeatures(params)
      });

      Promise.map(
        queryParams,
        (params) => {
          return queryFeatures(params);
        },
        { concurrency: 2 }
      )
        .each((f) => {
          allAddresses = allAddresses.concat(f.features);
        })
        .then(() => setAddresses(allAddresses));
    };
    if (resultIds && resultIds.objectIds.length > 0) {
      fetchAddresses();
    }
  }, [resultIds]);

  // if our filters or addresses change,
  // run the new addresses through the new filters
  useEffect(() => {
    let filteredAddresses = addresses;
    Object.keys(filters).forEach((k) => {
      if (filters[k]) {
        filteredAddresses = filteredAddresses.filter(
          allFilters[k].filterFunction
        );
      }
    });
    setFiltered(filteredAddresses);

    let formattedData = filteredAddresses.map((r, i) => {
      return r.attributes;
    });
    setFormattedData(formattedData);

    let features = filteredAddresses.map((f) => {
      let prop = layer === "parcel" ? "centroid" : "geometry";

      return {
        type: "Feature",
        properties: { ...f.attributes },
        geometry: {
          type: "Point",
          coordinates: [
            parseFloat(f[prop].x.toFixed(6)),
            parseFloat(f[prop].y.toFixed(6)),
          ],
        },
      };
    });

    let featureCollection = {
      type: "FeatureCollection",
      features: features,
    };

    setFeatures(featureCollection);
  }, [filters, addresses]);

  let introduction = (
    <>
      <p className="py-2">
        This tool is for creating a mailing list, based on a selection area.
      </p>
      <p className="pt-2">You can start by creating a selection area:</p>
      <ul className="list-disc list-outside ml-4 pb-2">
        <li>Search for an address</li>
        <li>Draw a line, point, or polygon</li>
        <li>Choose from common city boundaries</li>
      </ul>
      <p className="py-2">
        Once the selection area is defined, the addresses within will appear on
        the map.
      </p>
      <p className="py-2">
        Select filters on those addresses, such as deliverability status.
      </p>
      <p className="py-2">
        Finally, you can export those addresses into a .csv file or a GeoJSON.
      </p>
    </>
  );

  return (
    <Grid
      columns={{ initial: "1fr", sm: "2fr 3fr" }}
      rows={{ initial: "auto", sm: "auto auto" }}
      gap={{ initial: "0", sm: "4" }}
      p={{ initial: "0", sm: "2", lg: "4" }}
    >
      {/* <AppHeader app={apps.mailer} introduction={introduction}>
        <h3 className="mb-2 text-base">Data selection method</h3>
        <p className="text-sm leading-5 my-2">
          The default data selection method for this tool is to pull{" "}
          <b>intersecting address points</b> inside the mailing area. This method is fastest and
          best to use with mailings to pre-defined areas.
        </p>
        <p className="text-sm leading-5 my-2">
          Alternately, you can choose to pull address points which belong to the{" "}
          <b>intersecting parcels</b> inside the mailing area. Use this if your mailing area is for
          "parcels within X feet" of some location.
        </p>
      </AppHeader> */}

      {/* Show a warning if the user doesn't have access to the layer. */}
      {!access && (
        <Card className="bg-red-100">
          <Flex align="center" justify={"start"} gap="2">
            <ExclamationTriangleIcon />
            <Text>No access!</Text>
          </Flex>
          <Text size={"1"}>
            Please log in, or if you are logged in,{" "}
            <Link to="https://app.smartsheet.com/b/form/6919c51a844448e2a6811f04a6267292">
              contact the team
            </Link>{" "}
            for access.
          </Text>
        </Card>
      )}

      {/* Boundary picker */}
      {!geom && (
        <Flex direction="column" gap="2">
          <Card>
            <Text weight="medium">Draw your own shape</Text>
            <Flex align="center" gap="2" pt={"2"}>
              <Button size={"1"} onClick={() => setMode("draw_polygon")}>
                <Text>Draw a polygon</Text>
              </Button>
              <Button
                text="Draw a line"
                size={"1"}
                onClick={() => setMode("draw_line_string")}
              >
                <Text>Draw a line</Text>
              </Button>
              <Button size={"1"} onClick={() => setMode("draw_point")}>
                <Text>Create a point</Text>
              </Button>
            </Flex>
          </Card>
          <MailerAddressSearch {...{ geom, setGeom }} />
          <MailerLayerSelector {...{ geom, setGeom }} />
        </Flex>
      )}

      {geom && (
        <Flex direction="column" gap="2" >
          <Text size="2" weight={"medium"}>Selection mode</Text>
          <RadioCards.Root value={layer} defaultValue="parcel" onValueChange={(value) => setLayer(value)} gap={"2"}>
            <RadioCards.Item value="centroid">
              <Text size="1">Address points within buffer</Text>
            </RadioCards.Item>
            <RadioCards.Item value="parcel">
              <Text size="1">Addresses on parcels within buffer</Text>
            </RadioCards.Item>
          </RadioCards.Root>
          {/* If we have a shape, display buffer tool, current selection */}
          <MailerBuffer {...{ geom, setGeom }} />
          {/* If there's a shape and access to the layer */}
          {
            <>
              {!resultIds &&
                geom &&
                geom.features[0].geometry.type === "Polygon" && (
                  <h1>Loading...</h1>
                )}

              {/* If we're waiting on result IDs, show a Loading message */}
              {!resultIds &&
                geom &&
                (geom.features[0].geometry.type === "Point" ||
                  geom.features[0].geometry.type === "LineString") && (
                  <h1>
                    Apply a buffer to this geometry to generate a mailing list
                    area.
                  </h1>
                )}

              {/* If we have result IDs, show the export portion. */}
              {resultIds && (
                <Card>
                  <Flex direction={"column"} gap={"2"}>
                    <Text weight="medium">Options</Text>
                    {Object.keys(filters).map((f) => (
                      <Flex gap="2">
                        <Switch
                          checked={filters[f]}
                          onCheckedChange={(e) => {
                            let filterCopy = _.cloneDeep(filters);
                            filterCopy[f] = e;
                            setFilters(filterCopy);
                          }}
                        />
                        <Text>USPS-deliverable addresses only</Text>
                      </Flex>
                    ))}
                    <Text size="2">
                      Showing {filtered.length.toLocaleString()} addresses out
                      of {addresses.length.toLocaleString()} total
                    </Text>
                    <Flex>
                      <CSVLink
                        data={formattedData}
                        filename={`mailing_list_${new Date().getTime()}.csv`}
                        className="mr-2"
                      >
                        <Button
                          text={`Download .csv with ${filtered.length.toLocaleString()} rows`}
                          size={"1"}
                        >
                          Download .csv with {filtered.length.toLocaleString()}{" "}
                          rows
                        </Button>
                      </CSVLink>
                      <Button size={"1"}>
                        <a href="https://detroitmi.maps.arcgis.com/sharing/rest/content/items/da107e7b0d0e48c3b210db20fa3c30e7/data">
                          <Text>Output data dictionary</Text>
                        </a>
                      </Button>
                    </Flex>
                  </Flex>
                </Card>
              )}
            </>
          }
          {resultIds && <MailerSelection {...{ geom, setGeom, resultIds }} />}
        </Flex>
      )}

      <MailerMap {...{ geom, setGeom, filtered, mode, setMode, features }} />
      {filtered.length > 0 && <MailerTable {...{ filtered }} />}
    </Grid>
  );
};

export default Mailer;
