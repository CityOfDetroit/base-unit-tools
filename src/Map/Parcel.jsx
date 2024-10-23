import { Text } from "@radix-ui/themes";
import moment from "moment";
import React from "react";
import { Attribute, Category } from "../components/TableComponents";


const Parcel = ({ parcel, loading }) => {

  if (!parcel) {
    return;
  }

  let { properties: props } = parcel;

  return (
    <>
      <Category label="Ownership">
        <Attribute label="Taxpayer" value={props?.taxpayer_1} />
        <Attribute label="Taxpayer (ext)" value={props?.taxpayer_2} />
        <Attribute
          label="Taxpayer address"
          value={`${props.taxpayer_address}, ${props.taxpayer_city}, ${props.taxpayer_state} ${props.taxpayer_zip_code}`}
        />
        <Attribute
          label="PRE %"
          value={props.pct_pre_claimed?.toLocaleString()}
        />
        <Attribute label="NEZ" value={props.nez} />
        <Attribute
          label="Sale date"
          value={props.sale_date ? moment(props.sale_date).format("LL") : null}
        />
        <Attribute
          label="Sale price"
          value={`$${parseInt(props.amt_sale_price)?.toLocaleString()}`}
        />
      </Category>

      <Category label="Usage & classification" startOpen={false}>
        {Object.entries({
          "Property Class": `${props.property_class} - ${props.property_class_description}`,
          "Property Use": `${props.use_code} - ${props.use_code_description}`,
          "Zoning": props.zoning_district,
          "Style": props.building_style,
          "Historic Designation": props.local_historic_district,
        }).map(([label, value], idx) => {
          return <Attribute key={label} label={label} value={value} odd={idx % 2 === 0} />;
        })}
      </Category>

      <Category label="Taxation" startOpen={false}>
        <Attribute
          label="Taxable status"
          value={props.tax_status_description}
        />
        <Attribute
          label="Taxable value"
          value={`$${parseInt(props.amt_taxable_value).toLocaleString()}`}
        />
        <Attribute
          label="Assessed value"
          value={`$${parseInt(props.amt_assessed_value).toLocaleString()}`}
        />
      </Category>
      <Category label="Dimensions" startOpen={false}>
        {Object.entries({
          "Total Acreage": props.total_acreage,
          "Total Square Footage": props.total_square_footage,
          "Depth x Frontage": `${props.depth} x ${props.frontage}`
        }).map(([label, value]) => {
          return <Attribute key={label} label={label} value={value} />;
        })}
      </Category>

      <Category label="Legal description">
        <Text>{props.legal_description}</Text>
      </Category>
    </>
  );
};

export default Parcel;
