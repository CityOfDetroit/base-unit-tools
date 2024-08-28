// support two different servers
let SERVER_ROOT = `https://opengis.detroitmi.gov/opengis/rest/services/BaseUnits/`;
let HOSTED_ROOT = `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/BaseUnitMetrics/FeatureServer/`;
let HOSTED_ROOT_DEV = `https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/BaseUnitFeatures/FeatureServer/`;
import moment from "moment";


const layers = {
  addresses: {
    name: "addresses",
    singular: "address",
    label: "Address Point",
    endpoint: HOSTED_ROOT_DEV + "0",
    id_column: "address_id",
    click: "id",
    interaction: "address-point",
    highlight: "address-highlight",
    link: "address-linked",
    filter_id: "$id",
    text_color: "#555",
    color: "rgb(170, 200, 221)",
    formatter: (a) => {
      return {
        title: [a.properties.street_number, a.properties.street_prefix, a.properties.street_name, a.properties.street_type, a.properties.unit_type, a.properties.unit_number].join(" "),
        attributes: {
          "Street number": a.properties.street_number,
          "Street prefix": a.properties.street_prefix,
          "Street name": a.properties.street_name,
          "Street type": a.properties.street_type,
          "Unit type": a.properties.unit_type,
          "Unit number": a.properties.unit_number,
        },
        groups: {
          "Primary address": [
            "Street number",
            "Street prefix",
            "Street name",
            "Street type",
          ],
          "Subaddress": [
            "Unit type",
            "Unit number"
          ]
        }
      }
    }
  },
  buildings: {
    name: "buildings",
    singular: "building",
    label: "Building",
    endpoint: HOSTED_ROOT_DEV + "2",
    id_column: "building_id",
    interaction: "building-fill",
    click: "building_id",
    color: "rgb(203, 77, 79)",
    text_color: "#eee",
    filter_id: "$id",
    highlight: "building-highlight",
    link: "building-linked",
    formatter: (b) => {
      return {
        title: b.properties.also_known_as,
        attributes: {
          "Status": b.properties.status,
        },
        groups: {
          "Building": [
            "Status",
          ] 
        }
      };
    },
  },
  parcels: {
    name: "parcels",
    singular: "parcel",
    label: "Parcel",
    endpoint: HOSTED_ROOT_DEV + "3",
    feature_service:
      "https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/Parcel_File_2023/FeatureServer/1/",
    id_column: "parcel_number",
    interaction: "parcel-fill",
    click: "parcel_number",
    color: "rgb(163, 200, 112)",
    text_color: "#555",
    filter_id: "parcel_number",
    highlight: "parcel-highlight",
    link: "parcel-linked",
    formatter: (p) => {
      console.log(p)
      return {
        title: p.properties.address,
        attributes: {
          "Parcel address": p.properties.address,
          "Taxpayer": p.properties.taxpayer_1,
          "Taxpayer (ext)": p.properties.taxpayer_2,
          "Taxpayer address": `${p.properties.taxpayer_street}, ${p.properties.taxpayer_city}, ${p.properties.taxpayer_state} ${p.properties.taxpayer_zip}`,
          "Sale date": p.properties.sale_date ? moment(p.properties.sale_date).format("LL") : null,
          "Sale price": `$${parseInt(p.properties.sale_price).toLocaleString()}`,
          "PRE %": p.properties.homestead_pre.toLocaleString(),
          "NEZ": p.properties.nez,
          "Is Improved?": p.properties.is_improved === 0 ? "No" : "Yes",
          "Property Class": `${p.properties.property_class} - ${p.properties.property_class_desc}`,
          "Property Use": `${p.properties.use_code} - ${p.properties.use_code_desc}`,
          "Total Floor Area": p.properties.total_floor_area ? parseInt(p.properties.total_floor_area).toLocaleString() : null,
          "Style": p.properties.style,
          "Taxable status": p.properties.tax_status,
          "Assessed value": parseInt(p.properties.assessed_value).toLocaleString(),
          "Taxable value": parseInt(p.properties.taxable_value).toLocaleString(),
          "Total Acreage": p.properties.total_acreage,
          "Total Square Footage": p.properties.total_square_footage,
          "Depth x Frontage": `${p.properties.depth} x ${p.properties.frontage}`,
          "Zoning": p.properties.zoning,
          "Historic Designation": p.properties.historic_designation
        },
        groups: {
          "Ownership": [
            "Taxpayer",
            "Taxpayer (ext)",
            "Taxpayer address",
            "PRE %",
            "NEZ",
            "Sale date",
            "Sale price"
          ],
          "Usage & classification": [
            "Property Class",
            "Property Use",
            "Zoning",
            "Style",
            "Historic Designation"
          ],
          "Taxation": [
            "Taxable status",
            "Assessed value",
            "Taxable value",
          ],
          "Dimensions": [
            "Total Acreage",
            "Total Square Footage",
            "Depth x Frontage",
          ]
        },
        longAttributes: {
          "Legal description": p.properties.legal_description,
        },
      };
    },
  },
  streets: {
    name: "streets",
    singular: "street",
    label: "Street",
    endpoint: HOSTED_ROOT_DEV + "1",
    id_column: "street_id",
    interaction: "streets-line",
    click: "street_id",
    highlight: "streets-highlight",
    link: "streets-linked",
    filter_id: "$id",
    color: "rgb(148, 70, 109)",
    text_color: "#eee",
    formatter: (s) => {
      return {
        title: [s.properties.street_direction, s.properties.street_name, s.properties.street_type].join(" "),
        attributes: {
          "Street direction": s.properties.street_direction,
          "Street name": s.properties.street_name,
          "Street type": s.properties.street_type,
          "MGF - Left range": `${s.properties.from_address_left} - ${s.properties.to_address_left}`,
          "MGF - Right range": `${s.properties.from_address_right} - ${s.properties.to_address_right}`,
          "Jurisdiction": s.properties.legal_system,
          "Functional class code": s.properties.functional_class_code,
        },
        groups: {
          "Name": [
            "Street direction",
            "Street name",
            "Street type",
          ],
          "Address ranges": [
            "MGF - Left range",
            "MGF - Right range",
          ],
          "Classification": [
            "Jurisdiction",
            "Functional class code",
          ]
        }
      };
    }
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
