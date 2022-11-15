import businessTruthTypes from "../data/businessTruthTypes";
import BusinessTruthMetadata from "./BusinessTruthMetadata";

const businessTruthDisplayNames = { // * at end to represent date
    "business_licenses": { 
      "Business ID": `business_id`,
      "Business Name": `business_name`,
      "Business Type": `business_type`,
      "Parcel ID": `parcel_id`,
      "Latitude": `lat`,
      "Longitude": `lon`,
      "Address ID": `address_id`,
      "Street Number": `street_num`,
      "Street Direction": `street_dir`,
      "Street Name": `street_name`
    },
    "certificate_of_occupancy": {
      "Record ID": `record_id`,
      "Description": `description`,
	    "Status": `status`,
      "Date Status*": `date_status`
    },
    "commercial_coc": {
      "Record ID": `record_id`,
	    "Record Status*": `record_status_date`
    },
    "restaurant_establishments": {
      "Establishment ID": `establishment_id`,
      "Name": `name`,
      "Owner": `owner`,
      "License Number": "license_number",
      "License Type":	"license_type",
	    "Most Recent License Date*":	"most_recent_license_date",
	    "Establishment Type": "establishment_type",
	    "Status":	"status",
	    "Restaurant Complexity Level": "restaurant_complexity_level",
	    "Review Frequency in Days":	"review_frequency_in_days"
    },
    "restaurant_inspections": {
      "Inspection ID": "Inspection_ID",
      "Establishment ID": `Establishment_ID`,
      "Name": `Name`,
      "Inspection Date*": "Inspection_Date",
      "Inspection Type":	"Inspection_Type",
	    "Priority Violations":	"Priority_Violations",
	    "Foundation Violations": "Foundation_Violations",
	    "Core Violations":	"Core_Violations",
	    "Total Corrected Priority + Foundation Violations": "Total_Corrected_Priority___Foun",
	    "In Compliance":	"In_Compliance"
    },
    "restaurant_violations": {
      "Inspection ID": "Inspection_ID",
      "Establishment ID": `Establishment_ID`,
      "Inspection Date*": "Inspection_Date",
	    "Violation Code":	"Violation_Code",
      "Violation Type": "Violation Type",
	    "Violation Description": "Violation Description",
	    "Sub Location":	"Sub_Location",
	    "Item Description": "Item_Description",
      "Sub Item":	"Sub_Item",
      "Problem Description": "Problem_Description",
	    "Sub Problem":	"Sub_Problem",
      "Correction Description": "Correction_Description",
      "Days to Correct":"Days_to_Correct",
      "Date Corrected*": "Date_Corrected"
    }
  }

class BusinessTruthDataset {
    /**
     * Holds businessTruth data. Can use getters to get data in various syntax. Also holds styling information
     *
     * @param {string}   name          dataset name, e.g. business_licenses. Previously called "datasetType"
     * @param {Object or Array of Objects}   data        json of data (field_names: values). Can be an array of multiple json 

     * @return {type} Return value description.
     */
    constructor(name, data) {
        this.name = name
        this.data = data
        this.displayNames = businessTruthDisplayNames[name]
        this.sourceAttributes = this.setSourceAttributes()
        this.displayAttributes = this.setDisplayAttributes()
        this.metadata = new BusinessTruthMetadata(this.name)
        this.displayMetadata = this.metadata.displayMetadata(this.displayNames)
        this.style = businessTruthTypes[name];
    }

    /**
     * Holds field information
     * aka attr
     * attr example (geocoder/AGO return)
        {
            "OBJECTID": 346299,
            "addr_id": 183188,
            "unit_id": null,
            "bldg_id": 23136,
            "parcel_id": "21028111-131",
            "street_id": 37,
            "street_number": 14700,
            "street_prefix": "E",
            "street_name": "8 Mile",
            "street_type": "Rd",
            "unit_type": null,
            "unit_number": null,
            "zip_code": "48205",
            "zip_four": "1200",
            "geo_source": "building"
        }
     *
     * @return {Object} json of field info
     */
    setSourceAttributes(){
        let attributes = {}
        console.log("Source attributes code")
        if(Object.keys(this.data).length > 0){
            if(this.data.constructor.name == "Array"){
                attributes = this.data[0].attributes
                //TODO: get an array of all attributes
                attributes = []
                this.data.forEach((dataJson, i) =>
                    attributes.push(dataJson.attributes)
                )
            }
            else{
                attributes = this.data.attributes
            }
        }
        return attributes
    }
    /*
    get sourceAttributes(){
        let attributes = {}
        if(this.data.constructor.name == "Array"){
            attributes = this.data[0].attributes
        }
        else{
            attributes = this.data.attributes
        }
        return attributes
    }
    */

    /**
     * Holds information shown to user
     * aka attributes
     * attributes example
        {
            "Street Number": 14700,
            "Street Prefix": "E",
            "Street Name": "8 Mile",
            "Street Type": "Rd",
            "Unit Type": null,
            "Unit Number": null
        }
     *
     * @return {Object} json of field info to display
     */
    setDisplayAttributes(){
        let attributes = {}
        let sourceAttributes = this.sourceAttributes
        if(Object.keys(this.data).length > 0){
            if(this.sourceAttributes.constructor.name == "Array"){
                attributes = []
                this.sourceAttributes.forEach((attrJson, i) => {
                    let current_attr = {}
                    Object.keys(this.displayNames).forEach(k => {
                        current_attr[k] = attrJson[this.displayNames[k]] //businessTruthData.attributes[displayNames[k]]
                    })
                    attributes.push(current_attr)
                })
            }
            else{
                Object.keys(this.displayNames).forEach(k => {
                    attributes[k] = sourceAttributes[this.displayNames[k]] //businessTruthData.attributes[displayNames[k]]
                })
            }
        }
        return attributes
    }
    /*
    get displayAttributes(){
        let attributes = {}
        sourceAttributes = this.sourceAttributes
        Object.keys(this.displayNames).forEach(k => {
            attributes[k] = sourceAttributes[this.displayNames[k]] //businessTruthData.attributes[displayNames[k]]
        })
        return attributes
    }
    */

    /*
    // Getter
  get area() {
    return this.calcArea();
  }
  // Method
  calcArea() {
    return this.height * this.width;
  }
    */
  }

  export default BusinessTruthDataset