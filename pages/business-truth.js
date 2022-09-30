import { faArrowAltCircleRight, faLink, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import apps from "../src/data/apps";
import AppHeader from "../src/components/AppHeader";
import Button from "../src/components/Button";
import BusinessTruthSearch from "../src/Explorer/BusinessTruthSearch";
import IssueReporter from "../src/components/IssueReporter";
import IssueReporterAddress from "../src/components/IssueReporterAddress";
import MapillarySv from "../src/components/MapillarySv";
import useFeature from "../src/hooks/useFeature";
import SiteSidebar from "../src/layout/SiteSidebar";
import ExplorerAddress from "../src/Explorer/ExplorerAddress";
import ExplorerBuilding from "../src/Explorer/ExplorerBuilding";
import ExplorerMap from "../src/Explorer/ExplorerMap";
import ExplorerMapOptions from "../src/Explorer/ExplorerMapOptions";
import ExplorerParcel from "../src/Explorer/ExplorerParcel";
import ExplorerSearch from "../src/Explorer/ExplorerSearch";
import ExplorerStreet from "../src/Explorer/ExplorerStreet";

const BusinessPage = ({ session, setSession, login, setLogin, currentApp }) => {
  // business truth search values
  let [value, setValue] = useState("");
  let [searchValue, setSearchValue] = useState("")
  let [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    // prevent effect from running on first render
    if(searchValue != ""){
      console.log(searchValue)

      queryFeatures({
        url: `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/BusinessLicenses/FeatureServer/0`,
        outFields: '*',
        where: `business_name like '${searchValue}%'`,
        f: 'json'
      }).then(r => setSearchResults(r))
    }
  }, [searchValue])

  useEffect(() => {
    console.log("Search Results")
    console.log(searchResults)
  }, [searchResults])

  // query parameters
  let router = useRouter();
  const { type, id, streetview, image } = router.query;
  let queryType = type;
  let queryId = id;
  let querySv = streetview;
  let querySvImgKey = image;

  let initClicked = {type: queryType, id: queryId}
  console.log(initClicked)

  // this stores the type and id of the currently clicked feature
  // that drives everything, so the value and setter
  // are passed to child components often to consult or use
  let [clicked, setClicked] = useState(initClicked);

  let feature = useFeature(clicked);

  // this stores the current geocoding result
  let [geocoded, setGeocoded] = useState(null);

  // this stores IDs of linked features, to be highlighted on the map.
  let [linked, setLinked] = useState({
    addresses: [],
    parcels: [],
    buildings: [],
    streets: [],
  });

  // an options object
  let [options, setOptions] = useState({
    streetView: querySv === "true" ? true : false,
    basemap: "default",
  });

  // streetview-specific information
  // svBearing is the current camera bearing
  const [svBearing, setSvBearing] = useState(null);
  const [svImage, setSvImage] = useState(null);
  const [svImages, setSvImages] = useState([]);

  useEffect(() => {
    console.log(clicked, feature);
  }, [clicked, feature]);

  let introduction = (
    <>
      <p>
        This tool is for exploring the base units and visualizing the relationships between them.
      </p>
      <p>You can start by:</p>
      <ul className="list-disc list-outside ml-4 pb-2">
        <li>Searching for an address</li>
        <li>Clicking a feature on the map</li>
      </ul>
      <p>
        Once an address, building, parcel, or street is selected, you'll be able to see the other
        base units it is linked to.
      </p>
      <p>
        Click the <FontAwesomeIcon icon={faArrowAltCircleRight} className="mx-1 tex" /> next to a
        linked base unit's ID to navigate to that linked unit.
      </p>
      <p>
        You can also see a street view image of the currently selected feature, or turn on satellite
        imagery on the map.
      </p>
    </>
  );

  return (
    <>
      <AppHeader app={apps.map} introduction={introduction} introOpen={false}>
        <ExplorerMapOptions {...{ options, setOptions, session, clicked }} />
      </AppHeader>
      <SiteSidebar title="Explorer">
        {options.streetView && svImages.length === 0 && (
          <section className="">Loading street view imagery...</section>
        )}
        {options.streetView && svImages.length > 0 && (
          <MapillarySv {...{ svImage, svImages, setSvImage, setSvBearing, feature }} />
        )}

        {/* based on type, return a specific component. */}
        {clicked.type === "addresses" && feature && (
          <ExplorerAddress {...{ feature, clicked, setClicked, linked, setLinked }} />
        )}
        {clicked.type === "buildings" && feature && (
          <ExplorerBuilding {...{ feature, clicked, setClicked, linked, setLinked }} />
        )}
        {clicked.type === "parcels" && feature && (
          <ExplorerParcel {...{ feature, clicked, setClicked, linked, setLinked }} />
        )}
        {clicked.type === "streets" && feature && (
          <ExplorerStreet {...{ feature, clicked, setClicked, linked, setLinked }} />
        )}

        {(clicked.type || (geocoded && geocoded.features.length > 0)) && (
          <IssueReporter {...{ session, clicked, geocoded, feature }} />
        )}

        {geocoded && geocoded.features.length === 0 && geocoded.input && (
          <section className="sidebar-section">
            <p>
              We couldn't find any addresses which matched{" "}
              <strong className="">{geocoded.input}</strong>.
            </p>
            <p>If you think this address should exist, please report an issue here:</p>
            <IssueReporterAddress
              {...{ session, address: geocoded.input, unset: () => setGeocoded(null) }}
            />
          </section>
        )}

        {/* Link to, uh, Linker */}
        {feature && clicked.type === "addresses" && session && (
          <section className="sidebar-section caution">
            <Link href={`/linker?type=${clicked.type}&id=${clicked.id}`}>
              <FontAwesomeIcon icon={faLink} />
              <span className="text-semibold text-sm ml-2">Edit address links</span>
            </Link>
          </section>
        )}

        <BusinessTruthSearch {...{ setClicked, setGeocoded }} />

      </SiteSidebar>

      {/* the main panel contains the map, and we pass it many of our useState variables */}
      <main>
        This is the business truth page.
        {searchValue && <p>You searched for {searchValue}!</p>}
        {searchResults && searchResults.features?.length > 0 && (
          searchResults.features.map(result => (
            <div>
              {result.attributes.business_name}
            </div>
          ))
        )}
        <ExplorerMap
          {...{
            clicked,
            setClicked,
            geocoded,
            linked,
            feature,
            svImage,
            setSvImages,
            svBearing,
            basemap: options.basemap,
            showSv: options.streetView,
          }}
        />
      </main>
    </>
  );
};

export default BusinessPage;
