// support two different servers
let HOSTED_ROOT_DEV = `https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/BaseUnitFeatures/FeatureServer/`;
import { GroupIcon } from "@radix-ui/react-icons";
import moment from "moment";

const layers = {
  address: {
    name: "addresses",
    singular: "address",
    label: "Address Point",
    endpoint: HOSTED_ROOT_DEV + "0",
    id_column: "address_id",
    click: "address_id",
    interaction: "address-single",
    highlight: "address-single",
    link: "address-single",
    filter_id: "address_id",
    color: "rgb(170, 200, 221)",
    bg_color: "rgba(170, 200, 221, 1)",
    ago_item_id: "2b9ab7687289457c9793a4a92d7c4eb9",
    layer_number: 0
  },
  building: {
    name: "buildings",
    singular: "building",
    label: "Building",
    endpoint: HOSTED_ROOT_DEV + "2",
    id_column: "building_id",
    interaction: "building-fill",
    click: "building_id",
    color: "rgb(203, 77, 79)",
    bg_color: "rgba(203, 77, 79, 0.66)",
    filter_id: "building_id",
    highlight: "building-highlight",
    link: "building-linked",
    ago_item_id: "2b9ab7687289457c9793a4a92d7c4eb9",
    layer_number: 2
  },
  parcel: {
    name: "parcels",
    singular: "parcel",
    label: "Parcel",
    layer_id: "Parcels (Current)",
    label_column: "address",
    icon: GroupIcon,
    endpoint:
      "https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/parcel_file_current/FeatureServer/0/",
    id_column: "parcel_id",
    interaction: "parcel-fill",
    click: "parcel_id",
    filter_id: "parcel_id",
    color: "rgb(163, 200, 112)",
    bg_color: "rgba(163, 200, 112, 0.65)",
    highlight: "parcel-highlight",
    link: "parcel-linked",
    ago_item_id: "3c784c118e5c4083b37038e9b38573df",
    layer_number: 0
  },
  street: {
    name: "streets",
    singular: "street",
    label: "Street",
    endpoint: HOSTED_ROOT_DEV + "1",
    id_column: "street_id",
    interaction: "streets-line",
    highlight: "streets-highlight",
    link: "streets-linked",
    filter_id: "$id",
    color: "rgb(148, 70, 109)",
    bg_color: "rgba(148, 70, 109, 1)",
    ago_item_id: "2b9ab7687289457c9793a4a92d7c4eb9",
    layer_number: 1
  },
  // "units": {
  //   "name": "units",
  //   "singular": "unit",
  //   "label": "Unit",
  //   "endpoint": HOSTED_ROOT_DEV + '0',
  //   "id_column": "objectid",
  //   "interaction": "units-point",
  //   "click": "unit_id",
  //   "highlight": "units-highlight",
  //   "link": "units-linked",
  //   "color": "rgb(46, 55, 97)",
  //   "text_color": "#eee"
  // }
};

export default layers;
