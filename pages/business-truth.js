import { queryFeatures } from "@esri/arcgis-rest-feature-layer";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Button from "../src/components/Button";
import SiteSidebar from "../src/layout/SiteSidebar";

const BusinessPage = () => {
  let [value, setValue] = useState("");
  let [searchValue, setSearchValue] = useState("")
  let [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    console.log(searchValue)

    queryFeatures({
      url: `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/BusinessLicenses/FeatureServer/0`,
      outFields: '*',
      where: `business_name like '${searchValue}%'`,
      f: 'json'
    }).then(r => setSearchResults(r))

  }, [searchValue])

  useEffect(() => {
    console.log(searchResults)
  }, [searchResults])

  return (
    <>
      <SiteSidebar>
        <div className="sidebar-section">
          <input
            className="p-4 w-full text-lg"
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
          <Button
            icon={faSearch}
            onClick={() => setSearchValue(value)}
            text="Search"
            className=""
          />
        </div>
      </SiteSidebar>
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
      </main>
    </>
  );
};

export default BusinessPage;
