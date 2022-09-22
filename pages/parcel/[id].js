import { queryFeatures } from "@esri/arcgis-rest-feature-layer";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { CategoryItem, UnitCategory } from "../../src/components/UnitCategory";
import layers from "../../src/data/layers";
import SiteSidebar from "../../src/layout/SiteSidebar";
import ParcelMap from "../../src/maps/ParcelMap";

export async function getServerSideProps(context) {
  const { id } = context.params;

  const lyr = layers.parcels;

  console.log(lyr, id);
  const features = await queryFeatures({
    url: lyr.endpoint,
    where: `${lyr.id_column} = '${id}'`,
    outFields: "*",
    outSR: 4326,
    f: "geojson",
  });

  const assessmentCall = await fetch(`https://apis.detroitmi.gov/assessments/parcel/${id}/`);
  const attributes = await assessmentCall.json();

  const geojson = features.features[0];
  const assessment = attributes;

  return { props: { geojson, assessment, lyr } };
}

const Parcel = ({ geojson, assessment, lyr }) => {
  const router = useRouter();
  const { id } = router.query;

  console.log(geojson, assessment);

  const parcelData = {
    Ownership: {
      Taxpayer: assessment.taxpayer1,
      "Taxpayer Address": `${assessment.taxpaddr}, ${assessment.taxpcity}, ${assessment.taxpstate}`,
      "Last Sale Date": assessment.saledate ? dayjs(assessment.saledate).format("MM/DD/YYYY") : `-`,
      "Last Sale Price": parseInt(assessment.saleprice).toLocaleString(),
      "PRE %": assessment.pre,
      NEZ: assessment.nez,
      // "Related Parcel": (<Link href={`/parcels/${assessment.relatedparcel}`}><span>{assessment.relatedparcel}</span></Link>)
    },
    "Usage & classification": {
      "Property Class": `${assessment.propclass} - ${assessment.propclassdesc}`,
      "Property Use": `${assessment.usecode}`,
      Zoning: assessment.zoning,
      "# of Buildings": assessment.resbldgcount + assessment.cibldgcount,
      "Total Floor Area (sf)": assessment.totalfloor,
      Style: assessment.style,
    },
    Taxation: {
      "Tax Status": assessment.taxstatus,
      "Assessed Value": parseInt(assessment.assessedvalue).toLocaleString(),
      "Taxable Value": parseInt(assessment.taxablevalue).toLocaleString(),
    },
    Dimensions: {
      "Total Acreage": assessment.totalacreage,
      "Total Square Footage": assessment.totalsqft,
      "Depth x Frontage (ft)": `${assessment.depth} x ${assessment.frontage}`,
    },
  };

  return (
    <>
      <SiteSidebar>
      </SiteSidebar>
      <main>
        <div
          className="p-2 w-full flex items-center justify-between px-4"
          style={{ backgroundColor: `${lyr.color}` }}
        >
          <h2>{lyr.label}</h2>
        </div>

        <div className="sidebar-section grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
          <div className="">
            <UnitCategory categoryName={`Base information`}>
              <CategoryItem column={`Parcel ID`} value={id} />
              <CategoryItem
                column={`Property Address`}
                value={geojson.properties.assessor_address}
                borderBottom={false}
              />
            </UnitCategory>
            <UnitCategory categoryName={`Legal description`}>
              <span className="py-1 px-2 text-md max-h-64 font-mono block">
                {assessment.legaldescription}
              </span>
            </UnitCategory>
          </div>
          <ParcelMap geojson={geojson} assessment={assessment} />
        </div>
        <div className="sidebar-section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
            {Object.keys(parcelData).map((category) => (
              <UnitCategory key={category} categoryName={category}>
                {Object.keys(parcelData[category]).map((column, idx) => (
                  <CategoryItem
                    column={column}
                    value={parcelData[category][column]}
                    borderBottom={Object.keys(parcelData[category]).length - 1 > idx}
                  />
                ))}
              </UnitCategory>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Parcel;
