
export const geocoderFields = [
  {
    name: "council",
    display: "Council District",
    geocoderColumn: "council_district",
    description: "The city council district number this address belongs to.",
    default: false,
  },
  {
    name: "neighborhood",
    display: "Neighborhood",
    geocoderColumn: "neighborhood_name",
    description: "The neighborhood name this address belongs to.",
    default: false,
  },
  {
    name: "master_plan_nhood",
    display: "Master Plan Neighborhood",
    geocoderColumn: "master_plan_nhood_name",
    description: "The master plan neighborhood this address belongs to.",
    default: false,
  },
  {
    name: "congressional_district",
    display: "Congressional District",
    geocoderColumn: "congressional_district",
    description: "The congressional district this address belongs to.",
    default: false,
  },
  {
    name: "county_commission_district",
    display: "County Commission District",
    geocoderColumn: "county_commission_district",
    description: "The county commission district this address belongs to.",
    default: false,
  },
  {
    name: "qct",
    display: "ARPA Qualified Census Tract",
    geocoderColumn: "is_qualified_census_tract",
    description: "These census tracts are qualified for...",
    default: false,
  },
  {
    name: "scout_car_area",
    display: "Police Scout Car Area",
    geocoderColumn: "scout_car_area",
    description: "The scout car area this address belongs to.",
    default: false,
  },
  {
    name: "related_parcel",
    display: "Related Parcel",
    geocoderColumn: "relatedparcel",
    description: "Any parcels related to this address via NEZ.",
    default: false,
  },
];
