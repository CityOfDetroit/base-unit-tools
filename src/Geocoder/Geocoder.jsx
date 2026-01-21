import { bulkGeocode } from "@esri/arcgis-rest-geocoding";
import { Promise } from "bluebird";
import { useEffect, useState } from "react";
import { Button, Card, Flex, Grid, Text } from "@radix-ui/themes";
import { geocoderFields } from "../data/geocoderFields";
import { geocoders } from "../hooks/useGeocoder";
import { CsvInput } from "./CsvInput";
import { InputChoice } from "./InputChoice";
import GeocoderOptions from "./GeocoderOptions";
import GeocoderResults from "./GeocoderResults";
import Stepper from "../components/Stepper";
import Progress from "../components/Progress";
import GeocoderSummary from "./GeocoderSummary";
import { TextInput } from "./TextInput";
import {
  CheckCircledIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@radix-ui/react-icons";
import { addFeatures } from "@esri/arcgis-rest-feature-service";

/**
 * This function chunks addresses in batches of 1000 and geocodes them.
 */
const fetchResults = (
  addresses,
  setResults,
  setUnmatchedAddr,
  setProgress,
  setIsGeocoding
) => {
  let allResults = [];
  let failResults = [];
  let dataToSend = addresses.map((a, i) => {
    return { OBJECTID: i + 1, SingleLine: a };
  });

  const chunkSize = 1000;
  let allParams = [];
  let completedChunks = 0;

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

  setIsGeocoding(true);
  setProgress({ current: 0, total: addresses.length, percent: 0 });

  Promise.map(
    allParams,
    (params) => {
      return bulkGeocode(params).then((result) => {
        // Update progress as each batch completes
        allResults = allResults.concat(result.locations);
        completedChunks++;
        const processedCount = Math.min(
          completedChunks * chunkSize,
          addresses.length
        );
        setProgress({
          current: processedCount,
          total: addresses.length,
          percent: Math.round((processedCount / addresses.length) * 100),
        });
        return result;
      });
    },
    { concurrency: 3 }
  )
    .then(() => {
      setResults(
        allResults.sort((a, b) => a.attributes.ResultID - b.attributes.ResultID)
      );
      setIsGeocoding(false);

      // extract locations where geocode fails (address_id=0)
      for (let res in allResults) {
        let resID = allResults[res].attributes.ResultID - 1;
        if (
          allResults[res].attributes.address_id == 0 &&
          addresses[resID].trim().length > 0
        ) {
          let input = addresses[resID];
          let inputAttributes = {
            attributes: {
              input_address: input,
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
              lat_result: allResults[res].attributes.Y,
            },
          };
          failResults = failResults.concat(inputAttributes);
        }
      }
      setUnmatchedAddr(failResults);
    });
};

const failedAddressUpload = (unmatched) => {
  let url =
    "https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/Base_Units_Geocoder_Failures_view/FeatureServer/0";
  addFeatures({
    url: url,
    features: unmatched,
  });
};

const Geocoder = () => {
  // Step state
  const [currentStep, setCurrentStep] = useState(1);

  // csv upload
  let [csv, setCsv] = useState(null);
  // addresses to geocode
  let [addresses, setAddresses] = useState([]);

  // create a default options object
  let defaultOptions = {
    mode: "upload",
    matched: true,
    coords: true,
    ids: true,
    related_parcel: false,
    condo_plan_number: false,
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

  // geocoding state
  let [isGeocoding, setIsGeocoding] = useState(false);
  let [progress, setProgress] = useState({ current: 0, total: 0, percent: 0 });

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
      fetchResults(
        addresses,
        setResults,
        setUnmatchedAddr,
        setProgress,
        setIsGeocoding
      );
      setGeocoded(true);
      setCurrentStep(3);
    }
  }, [payload]);

  useEffect(() => {
    if (geocoded && unmatchedAddr.length > 0) {
      failedAddressUpload(unmatchedAddr);
      setUnmatchedAddr([]);
    }
  }, [unmatchedAddr]);

  useEffect(() => {
    setGeocoded(false);
  }, [addresses]);

  // Navigation helpers
  const canNavigateTo = (step) => {
    if (step === 1) return true;
    if (step === 2) return addresses.length > 0;
    if (step === 3) return results.length > 0;
    return false;
  };

  const handleNext = () => {
    if (currentStep === 1 && addresses.length > 0) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Trigger geocoding
      if (addresses.length > 0 && !geocoded) {
        setPayload(addresses);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartOver = () => {
    setCsv(null);
    setAddresses([]);
    setPayload([]);
    setResults([]);
    setUnmatchedAddr([]);
    setGeocoded(false);
    setIsGeocoding(false);
    setProgress({ current: 0, total: 0, percent: 0 });
    setCurrentStep(1);
  };

  return (
    <Grid
      columns={{ initial: "1fr", sm: "1fr 3fr" }}
      gap={{ initial: "0", sm: "4" }}
      p={{ initial: "2", sm: "2", lg: "4" }}
    >
      {/* Left Sidebar */}
      <Flex direction="column" className="min-w-80" gap="3">
        <Text size="5" weight="bold" className="text-[#004445]">
          Geocoder
        </Text>

        <Stepper
          steps={[
            { id: 1, label: "Input" },
            { id: 2, label: "Options" },
            { id: 3, label: "Results" },
          ]}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          canNavigateTo={canNavigateTo}
        />

        {/* Step 1: Input */}
        {currentStep === 1 && (
          <Card>
            <Flex gap="3" direction="column">
              <Text weight="bold" size="3">
                Address Input
              </Text>
              <InputChoice setOptions={setOptions} options={options} />
              {options.mode === "upload" && (
                <CsvInput {...{ setCsv, csv, addresses, setAddresses }} />
              )}
              {options.mode === "manual" && <TextInput {...{ setAddresses }} />}
            </Flex>
          </Card>
        )}

        {/* Step 2: Options */}
        {currentStep === 2 && (
          <GeocoderOptions {...{ options, setOptions }} />
        )}

        {/* Step 3: Results Summary in Sidebar */}
        {currentStep === 3 && results.length > 0 && (
          <Card>
            <Flex direction="column" gap="2">
              <Text weight="bold" size="3">
                Geocoding Complete
              </Text>
              <Text size="2" color="gray">
                View your results in the panel to the right. You can go back to
                modify your input or options and re-run.
              </Text>
              <Button
                variant="outline"
                size="2"
                onClick={handleStartOver}
                className="mt-2"
              >
                Start Over
              </Button>
            </Flex>
          </Card>
        )}

        {/* Navigation Buttons */}
        <Flex gap="2" justify="between" className="mt-2">
          {currentStep > 1 && (
            <Button variant="soft" size="2" onClick={handleBack}>
              <ArrowLeftIcon />
              Back
            </Button>
          )}
          {currentStep === 1 && addresses.length > 0 && (
            <Button
              size="2"
              onClick={handleNext}
              className="ml-auto"
              style={{ backgroundColor: "#004445" }}
            >
              Next: Options
              <ArrowRightIcon />
            </Button>
          )}
          {currentStep === 2 && (
            <Button
              size="2"
              onClick={handleNext}
              disabled={addresses.length === 0 || isGeocoding}
              className="ml-auto"
              style={{ backgroundColor: "#004445" }}
            >
              {isGeocoding ? (
                "Geocoding..."
              ) : (
                <>
                  Geocode {addresses.length} addresses
                  <CheckCircledIcon />
                </>
              )}
            </Button>
          )}
        </Flex>
      </Flex>

      {/* Right Column - Results */}
      <Flex direction="column" gap="3" className="min-h-96 min-w-0 overflow-hidden">
        {isGeocoding && (
          <Progress
            progress={progress}
            waitingText="Sending to geocoder..."
            activeText="Geocoding in progress..."
            waitingSubtext={`Preparing ${progress.total.toLocaleString()} addresses...`}
            activeSubtext={
              progress.total <= 1000
                ? "Single batch"
                : `${Math.ceil(progress.total / 1000)} batches of 1,000`
            }
          />
        )}

        {results.length > 0 && !isGeocoding && (
          <>
            <GeocoderSummary results={results} addresses={payload} />
            <GeocoderResults
              results={results}
              addresses={payload}
              options={options}
              geocoderFields={geocoderFields}
              setUnmatchedAddr={setUnmatchedAddr}
              csv={csv}
            />
          </>
        )}

        {!isGeocoding && results.length === 0 && (
          <Flex
            direction="column"
            align="center"
            justify="center"
            className="h-full min-h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
          >
            <Text size="3" color="gray" weight="medium">
              Results will appear here
            </Text>
            <Text size="2" color="gray" className="mt-1">
              Enter addresses and configure options to get started
            </Text>
          </Flex>
        )}
      </Flex>
    </Grid>
  );
};

export default Geocoder;
