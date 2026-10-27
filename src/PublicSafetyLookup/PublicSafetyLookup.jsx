import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { suggest } from "@esri/arcgis-rest-geocoding";
import { baseStyle } from "../styles/mapstyle";
import { Card, Container, DataList, Flex, Spinner, Text, TextField } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Link, useSearchParams } from "react-router-dom";
import useGeocoder, { geocoderUrl } from "../hooks/useGeocoder";
import layers from "../data/layers";
import { geocoderFields } from "../data/geocoderFields";
import { Attribute, Category } from "../components/TableComponents";

// one map instance for the life of the page; later results just move the camera and pin
const InsetMap = ({ x, y }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      style: baseStyle,
      center: [x, y],
      zoom: 16,
      scrollZoom: false,
      attributionControl: false,
    });
    markerRef.current = new maplibregl.Marker().setLngLat([x, y]).addTo(mapRef.current);
    return () => mapRef.current.remove();
  }, []);

  useEffect(() => {
    mapRef.current.jumpTo({ center: [x, y] });
    markerRef.current.setLngLat([x, y]);
  }, [x, y]);

  return <div ref={containerRef} className="w-full sm:w-64 h-48 rounded" />;
};

const SafetyStat = ({ label, value }) => (
  <Flex direction="column">
    <Text size="2" color="gray">
      {label}
    </Text>
    <Text size="8" weight="bold" className="text-[#004445] leading-none">
      {value || "—"}
    </Text>
  </Flex>
);

const PublicSafetyLookup = () => {
  const [params, setParams] = useSearchParams();
  const address = params.get("address") || "";

  const { feature, loading, error, changeAddress } = useGeocoder(address);
  const [suggestions, setSuggestions] = useState([]);
  const suggestTimer = useRef(null);

  // geocode again when the URL changes (search, back/forward, pasted link)
  useEffect(() => {
    changeAddress(address);
  }, [address]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = new FormData(e.target).get("address").trim();
    if (value) setParams({ address: value });
  };

  // native <datalist> autocomplete fed by the geocoder's suggest endpoint
  const handleInput = (e) => {
    const text = e.target.value.trim();
    clearTimeout(suggestTimer.current);
    if (text.length < 3) return;
    suggestTimer.current = setTimeout(() => {
      suggest(text, { endpoint: geocoderUrl, params: { maxSuggestions: 5 } })
        .then((r) => setSuggestions(r.suggestions.map((s) => s.text)))
        .catch(() => {});
    }, 150);
  };

  const attrs = feature?.attributes;

  return (
    <Container size="2" p="4">
      <Flex direction="column" gap="4">
        <Text size="5" weight="bold" className="text-[#004445]">
          Public Safety Lookup
        </Text>

        <form onSubmit={handleSubmit}>
          <TextField.Root
            key={address}
            name="address"
            list="address-suggestions"
            defaultValue={address}
            autoFocus
            autoComplete="off"
            placeholder="Enter an address and press Enter"
            onInput={handleInput}
            size="3"
          >
            <TextField.Slot>
              {loading ? <Spinner /> : <MagnifyingGlassIcon />}
            </TextField.Slot>
          </TextField.Root>
          <datalist id="address-suggestions">
            {suggestions.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </form>

        {!address && (
          <Text color="gray">Search for an address to find its police precinct and scout car area.</Text>
        )}
        {error && !loading && <Text color="red">No match for "{address}".</Text>}

        {attrs && (
          <Flex direction="column" gap="4" className={loading ? "opacity-50 transition-opacity" : ""}>
            <Flex gap="8">
              {/* DPD scout car areas are numbered precinct * 100 + car, e.g. 312 is in precinct 3 */}
              <SafetyStat
                label="Police Precinct"
                value={attrs.scout_car_area && Math.floor(attrs.scout_car_area / 100)}
              />
              <SafetyStat label="Scout Car Area" value={attrs.scout_car_area} />
            </Flex>

            <Card>
              <Flex gap="4" direction={{ initial: "column", sm: "row" }}>
                <Flex direction="column" gap="2" className="flex-1">
                  <Text size="4" weight="bold">
                    {attrs.Match_addr}
                  </Text>
                  {attrs.geo_source ? (
                    <Text size="1" color="gray">
                      Score {attrs.Score} · matched by {attrs.geo_source}
                    </Text>
                  ) : (
                    <Text size="1" color="orange">
                      Approximate street match. No precinct data; try a more specific address.
                    </Text>
                  )}
                  <DataList.Root size="1">
                    {["address", "parcel", "building", "street"].map((layer) => {
                      const id = attrs[layers[layer].id_column];
                      return (
                        <DataList.Item key={layer}>
                          <DataList.Label>{layers[layer].label}</DataList.Label>
                          <DataList.Value>
                            {id ? (
                              <Link to={`/map?id=${id}&layer=${layer}`} className="font-mono underline">
                                {id}
                              </Link>
                            ) : (
                              "—"
                            )}
                          </DataList.Value>
                        </DataList.Item>
                      );
                    })}
                  </DataList.Root>
                </Flex>
                <InsetMap x={feature.location.x} y={feature.location.y} />
              </Flex>
            </Card>

            <Category label="Other boundaries" startOpen={false}>
              {geocoderFields
                .filter((f) => ["council_2026", "neighborhood"].includes(f.name))
                .map((f) => (
                  <Attribute key={f.name} label={f.display} value={attrs[f.geocoderColumn] || "—"} />
                ))}
            </Category>
          </Flex>
        )}
      </Flex>
    </Container>
  );
};

export default PublicSafetyLookup;
