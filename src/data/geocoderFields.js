// Group definitions for organizing fields in the UI
export const fieldGroups = {
  political: { label: "Political Boundaries" },
  geographic: { label: "Geographic Boundaries" },
  census: { label: "Census Data" },
  other: { label: "Other" },
};

export const geocoderFields = [
  {
    name: "council_2026",
    display: "Current Council District",
    geocoderColumn: "council_district",
    description: "The city council district number this address belongs to- Districts 2026.",
    group: "political",
    default: false,
  },
  {
    name: "council_district",
    display: "Previous Council District 2013",
    geocoderColumn: "council_district_2013",
    description: "The city council district number this address belongs to- Districts 2013.",
    group: "political",
    default: false,
  },
  {
    name: "congressional_district",
    display: "Congressional District",
    geocoderColumn: "congressional_district",
    description: "The congressional district this address belongs to.",
    group: "political",
    default: false,
  },
  {
    name: "county_commission_district",
    display: "County Commission District",
    geocoderColumn: "county_commission_district",
    description: "The county commission district this address belongs to.",
    group: "political",
    default: false,
  },
  {
    name: "neighborhood",
    display: "Neighborhood",
    geocoderColumn: "neighborhood_name",
    description: "The neighborhood name this address belongs to.",
    group: "geographic",
    default: false,
  },
  {
    name: "master_plan_nhood",
    display: "Master Plan Neighborhood",
    geocoderColumn: "master_plan_nhood_name",
    description: "The master plan neighborhood this address belongs to.",
    group: "geographic",
    default: false,
  },
  {
    name: "census_block_2020",
    display: "Census Geography 2020",
    geocoderColumn: "census_block_geoid_2020",
    description: "The 2020 census block this address belongs to.",
    group: "census",
    default: false,
  },
  {
    name: "census_block_2010",
    display: "Census Geography 2010",
    geocoderColumn: "census_block_geoid_2010",
    description: "The 2010 census block this address belongs to.",
    group: "census",
    default: false,
  },
  {
    name: "qct",
    display: "ARPA Qualified Census Tract",
    geocoderColumn: "is_qualified_census_tract",
    description: "These census tracts are qualified for...",
    group: "census",
    default: false,
  },
  {
    name: "scout_car_area",
    display: "Police Scout Car Area",
    geocoderColumn: "scout_car_area",
    description: "The scout car area this address belongs to.",
    group: "other",
    default: false,
  },
  {
    name: "nrsa_zone",
    display: "NRSA",
    geocoder_column: "nrsa_area_2020",
    description: "The NRSA this address belongs to.",
    group: "other",
    default: false
  }

];
