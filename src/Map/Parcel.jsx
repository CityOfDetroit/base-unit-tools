import { Text, Tooltip } from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { queryFeatures } from "@esri/arcgis-rest-feature-service";
import { Attribute, Category } from "../components/TableComponents";
import { useAuth } from "../contexts/AuthContext";

// org-only, so this row only shows for signed-in City of Detroit users (same layer as /ownership)
const OWNERSHIP_LAYER_URL =
  "https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/Verified_Parcel_Ownership/FeatureServer/0";

// "Verified owner" for City staff, linking to the parcel in the Ownership tool (new window)
const VerifiedOwner = ({ parcelId }) => {
  const { isCityEmployee, token } = useAuth();
  const [record, setRecord] = useState(undefined); // undefined = loading, null = not in the layer

  useEffect(() => {
    if (!isCityEmployee || !token || !parcelId) return;
    let cancelled = false;
    setRecord(undefined);
    queryFeatures({
      url: OWNERSHIP_LAYER_URL,
      where: `parcel_id = '${String(parcelId).replace(/'/g, "''")}'`,
      outFields: "entity_owner,is_verified",
      returnGeometry: false,
      authentication: token,
    })
      .then((r) => !cancelled && setRecord(r.features[0]?.attributes ?? null))
      .catch(() => !cancelled && setRecord(null));
    return () => {
      cancelled = true;
    };
  }, [parcelId, token, isCityEmployee]);

  if (!isCityEmployee || record === null) return null;
  return (
    <Attribute
      label={
        <Tooltip content="The actual owner of this parcel, according to the City’s ownership data. Click through to see this owner's portfolio on the Ownership tool.">
          <span className="inline-flex cursor-help items-center gap-1">
            Verified owner <InfoCircledIcon />
          </span>
        </Tooltip>
      }
      value={
        record === undefined ? (
          "…"
        ) : (
          <a
            href={`/ownership?parcel=${encodeURIComponent(parcelId)}`}
            target="_blank"
            // "opener", not the default noopener: the ArcGIS sign-in lives in this tab's
            // sessionStorage, which Chrome copies into a new tab only when it keeps its opener;
            // otherwise the new tab asks to sign in again. Same app, so the opener link is safe.
            rel="opener"
            className="underline"
          >
            {record.is_verified === 1 ? record.entity_owner : "Not yet verified"} ↗
          </a>
        )
      }
    />
  );
};


const currency = (value) => {
  const num = parseInt(value);
  return Number.isNaN(num) ? null : `$${num.toLocaleString()}`;
};

const Parcel = ({ parcel, loading }) => {

  if (!parcel) {
    return;
  }

  let { properties: props } = parcel;

  return (
    <>
      <Category label="Ownership">
        <Attribute label="Taxpayer" value={props?.taxpayer_1} />
        <VerifiedOwner parcelId={props?.parcel_id} />
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
          value={currency(props.amt_sale_price)}
        />
      </Category>

      <Category label="Usage & classification">
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

      <Category label="Taxation">
        <Attribute
          label="Taxable status"
          value={props.tax_status_description}
        />
        <Attribute
          label="Taxable value"
          value={currency(props.amt_taxable_value)}
        />
        <Attribute
          label="Assessed value"
          value={currency(props.amt_assessed_value)}
        />
      </Category>
      <Category label="Dimensions">
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
