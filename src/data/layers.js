// support two different servers
let SERVER_ROOT = `https://opengis.detroitmi.gov/opengis/rest/services/BaseUnits/`
let HOSTED_ROOT = `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/BaseUnitMetrics/FeatureServer/`
let HOSTED_ROOT_DEV = `https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/ExtendedTablesWithIndices/FeatureServer/`

const layers = {
  "addresses": {
    "name": "addresses",
    "singular": "address",
    "label": "Address Point",
    "endpoint": HOSTED_ROOT_DEV + '4',
    "id_column": "addr_id",
    "click": "id",
    "interaction": "address-point",
    "highlight": "address-highlight",
    "link": "address-linked",
    "filter_id": "addr_id",
    "text_color": "#555",
    "color": "rgb(170, 200, 221)"
  },
  "buildings": {
    "name": "buildings",
    "singular": "building",
    "label": "Building",
    "endpoint": HOSTED_ROOT_DEV + '3',
    "id_column": "bldg_id",
    "interaction": "building-fill",
    "click": "bldg_id",
    "color": "rgb(203, 77, 79)",
    "text_color": "#eee",
    "filter_id": "bldg_id",
    "highlight": "building-highlight",
    "link": "building-linked"
  },
  "parcels": {
    "name": "parcels",
    "singular": "parcel",
    "label": "Parcel",
    "endpoint": HOSTED_ROOT_DEV + "1",
    "id_column": "parcel_id",
    "interaction": "parcel-fill",
    "click": "parcel_id",
    "color": "rgb(163, 200, 112)",
    "text_color": "#555",
    "filter_id": "parcel_id",
    "highlight": "parcel-highlight",
    "link": "parcel-linked"
  },
  "streets": {
    "name": "streets",
    "singular": "street",
    "label": "Street",
    "endpoint": HOSTED_ROOT_DEV + "2",
    "id_column": "street_id",
    "interaction": "streets-line",
    "click": "street_id",
    "highlight": "streets-highlight",
    "link": "streets-linked",
    "filter_id": "street_id",
    "color": "rgb(148, 70, 109)",
    "text_color": "#eee"
  },
  "units": {
    "name": "units",
    "singular": "unit",
    "label": "Unit",
    "endpoint": HOSTED_ROOT_DEV + '0',
    "id_column": "objectid",
    "interaction": "units-point",
    "click": "unit_id",
    "highlight": "units-highlight",
    "link": "units-linked",
    "color": "rgb(46, 55, 97)",
    "text_color": "#eee"
  },
  //not a layer, but placed here to work with ExplorerFeature
  "business_licenses": {
    "name": "business_licenses",
    "singular": "business_license",
    "label": "Business License",
    "id_column": "address_id",
    "text_color": "#555",
    "color": "rgb(240, 230, 140)"
  },
  "commercial_coc": {
    "name": "commercial_coc",
    "singular": "commercial_coc",
    "label": "Commercial Certificate of Compliance",
    "id_column": "address_id",
    "text_color": "#555",
    "color": "rgb(91, 155, 213)"
  }
}

export default layers;