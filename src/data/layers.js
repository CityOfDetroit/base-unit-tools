// support two different servers
let SERVER_ROOT = `https://opengis.detroitmi.gov/opengis/rest/services/BaseUnits/`
let HOSTED_ROOT = `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/BaseUnitMetrics/FeatureServer/`

const layers = {
  "addresses": {
    "name": "addresses",
    "label": "Address Point",
    "endpoint": HOSTED_ROOT + '5',
    "id_column": "addr_id",
    "click": "id",
    "interaction": "address-point",
    "highlight": "address-highlight",
    "link": "address-linked",
    "filter_id": "$id",
    "text_color": "#555",
    "color": "rgb(170, 200, 221)"
  },
  "buildings": {
    "name": "buildings",
    "label": "Building",
    "endpoint": SERVER_ROOT + "BuildingMetrics/FeatureServer/0",
    "id_column": "bldg_id",
    "interaction": "building-fill",
    "click": "id",
    "color": "rgb(203, 77, 79)",
    "text_color": "#eee",
    "filter_id": "$id",
    "highlight": "building-highlight",
    "link": "building-linked"
  },
  "parcels": {
    "name": "parcels",
    "label": "Parcel",
    "endpoint": HOSTED_ROOT + "2",
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
    "label": "Street",
    "endpoint": HOSTED_ROOT + "3",
    "id_column": "objectid_1",
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
    "label": "Unit",
    "endpoint": HOSTED_ROOT + "4",
    "id_column": "objectid",
    "interaction": "units-point",
    "click": "unit_id",
    "highlight": "units-highlight",
    "link": "units-linked",
    "color": "rgb(46, 55, 97)",
    "text_color": "#eee"
  }
}

export default layers;