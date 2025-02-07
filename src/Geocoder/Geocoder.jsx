import { bulkGeocode } from "@esri/arcgis-rest-geocoding";
import { Promise } from "bluebird";
import React, { useEffect, useState } from "react";
import { Button, Card, Flex, Grid, Text } from "@radix-ui/themes";
import { geocoderFields } from "../data/geocoderFields";
import { geocoders } from "../hooks/useGeocoder";
import { CsvInput } from "./CsvInput";
import { InputChoice } from "./InputChoice";
import GeocoderOptions from "./GeocoderOptions";
import GeocoderResults from "./GeocoderResults";
import { TextInput } from "./TextInput";
import { CheckCircledIcon, LinkNone1Icon } from "@radix-ui/react-icons";
import { addFeatures } from "@esri/arcgis-rest-feature-service";

/**
 * This function chunks addresses in batches of 1000 and geocodes them.
 * @param {} addresses
 * @param {} setResults
 * @param {} setUnmatchedAddr
 */
const fetchResults = (addresses, setResults, setUnmatchedAddr) => {
  let allResults = [];
  let failResults = [];
  let dataToSend = addresses.map((a, i) => {
    return { OBJECTID: i + 1, SingleLine: a };
  });

  const chunkSize = 1000;

  let allParams = [];

  for (let i = 0; i < dataToSend.length; i += chunkSize) {
    const chunk = dataToSend.slice(i, i + chunkSize);

    allParams.push({
      addresses: chunk,
      endpoint: geocoders.prod,
      params: {
        outSR: 4326,
        outFields: "*",
      },
    });
  }

  Promise.map(
    allParams,
    (params) => {
      return bulkGeocode(params);
    },
    { concurrency: 3 }
  )
    .each((f) => {
      allResults = allResults.concat(f.locations);

      // extract locations where geocode fails (address_id=0)
      for (let res in allResults) {
        if (allResults[res].attributes.address_id == 0){
          let resID = allResults[res].attributes.ResultID - 1
          let input = addresses[resID]; // index input address
          // build object
          let inputAttributes = {attributes:
            {input_address: input,
              street_number_result: allResults[res].attributes.AddNum,
              prefix_direction_result: allResults[res].attributes.StDir,
              street_name_result: allResults[res].attributes.StName,
              street_type_result: allResults[res].attributes.StType,  
              match_address_result: allResults[res].attributes.Match_addr,
              sub_address_result: allResults[res].attributes.SubAddr,
              address_id_result: allResults[res].attributes.address_id,
              building_id_result: allResults[res].attributes.building_id,
              parcel_id_result: allResults[res].attributes.parcel_id,
              street_id_result: allResults[res].attributes.street_id,
              status_result: allResults[res].attributes.Status,
              match_type_result: allResults[res].attributes.Addr_type,
              score_result: allResults[res].attributes.Score,
              lon_result: allResults[res].attributes.X,
              lat_result: allResults[res].attributes.Y
            }};   
          // concat to array       
          failResults = failResults.concat(inputAttributes);
        }; 
      }
    })
    .then(() =>
      setResults(
        allResults.sort((a, b) => a.attributes.ResultID - b.attributes.ResultID)
      )
    )
    .then(() => setUnmatchedAddr(failResults))
};

/**
 * 
 * @param {} unmatched 
 */
const failedAddressUpload = (unmatched) => {

  let url = "https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/Base_Units_Geocoder_Failures_view/FeatureServer/0";
  addFeatures({
    url: url,
    features: unmatched
  });

};


const Geocoder = ({ session, setSession, login, setLogin }) => {
  // csv upload
  let [csv, setCsv] = useState(null);
  // and split on a newline to get a list of addresses to geocode
  let [addresses, setAddresses] = useState([]);

  // create a default options object
  let defaultOptions = {
    mode: "upload",
    matched: true,
    coords: true,
    ids: true,
    realated_parcel: true
  };

  // add the geocoderFields to the options object
  geocoderFields.forEach((field) => {
    defaultOptions[field.name] = field.default;
  });

  let [options, setOptions] = useState(defaultOptions);

  // container for data
  let [payload, setPayload] = useState([]);

  // container for results
  let [results, setResults] = useState([]);

  // container for unmatched addresses
  let [unmatchedAddr, setUnmatchedAddr] = useState([]);

  // state to display "geocode addresses" button
  let [geocoded, setGeocoded] = useState(false);

  useEffect(() => {
    setCsv(null);
    setAddresses([]);
    setPayload([]);
    setResults([]);
    setUnmatchedAddr([]);
  }, [options.mode]);

  useEffect(() => {
    setResults([]);
    setPayload([]);
    setUnmatchedAddr([]);
  }, [csv]);

  useEffect(() => {
    if (payload.length > 0) {
      fetchResults(addresses, setResults, setUnmatchedAddr);
      setGeocoded(true);
    }
  }, [payload]);

  useEffect(() => {
    if(geocoded && unmatchedAddr.length > 0) {
      failedAddressUpload(unmatchedAddr);
      setUnmatchedAddr([]);
    };
  },[unmatchedAddr]);

  useEffect(() => {
    setGeocoded(false);
  }, [addresses]);

  return (
    <>
      <Grid
        columns={{ initial: "1fr", sm: "1fr 3fr" }}
        gap={{ initial: "0", sm: "4" }}
        p={{ initial: "0", sm: "2", lg: "4" }}
      >
        <Flex direction={"column"} className="min-w-96" gap="2">
          <Text size={"5"}>Geocoder</Text>

          <Card>
            <Flex gap={"2"} direction="column">
              <Text weight="bold">Address input</Text>
              <InputChoice setOptions={setOptions} options={options} />
              {options.mode === "upload" && (
                <CsvInput {...{ setCsv, csv, addresses, setAddresses }} />
              )}
              {options.mode === "manual" && <TextInput {...{ setAddresses }} />}
            </Flex>
          </Card>

          <GeocoderOptions {...{ options, setOptions }} />
          {addresses.length > 0 && !geocoded && (
            <Button
              size={"1"}
              active={addresses.length > 0}
              //disabled={addresses.length === 0}
              onClick={() => {
                addresses.length > 0 && setPayload(addresses);
              }}
            >
              <Text>
                {addresses.length > 0
                  ? payload.length > 0 && results.length === 0
                    ? `Geocoding...`
                    : `Geocode ${addresses.length} addresses`
                  : "Input addresses to geocode"}
              </Text>
              <CheckCircledIcon />
            </Button>
          )}
        </Flex>

        {results.length > 0 && (
          <GeocoderResults
            results={results}
            addresses={payload}
            options={options}
            geocoderFields={geocoderFields}
            setUnmatchedAddr={setUnmatchedAddr}
            csv={csv}
          />
        )}
      </Grid>
    </>
  );
};

export default Geocoder;
