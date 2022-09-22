import { queryFeatures } from "@esri/arcgis-rest-feature-layer";
import { useRouter } from "next/router";
import layers from "../../src/data/layers";
import SiteSidebar from "../../src/layout/SiteSidebar";
import StreetMap from "../../src/maps/StreetMap";

export async function getServerSideProps(context) {
  const { id } = context.params;

  const lyr = layers.streets;

  console.log(lyr, id)
  const features = await queryFeatures({
    url: lyr.endpoint,
    where: `${lyr.id_column} = '${id}'`,
    outFields: "*",
    outSR: 4326,
    f: "geojson",
  });

  const geojson = features.features[0];

  return { props: { geojson, lyr } };
}

const Street = ({ geojson, lyr }) => {
  const router = useRouter();
  const { id } = router.query;

  const streetData = {
    // Ownership: {
    //   "Taxpayer": assessment.taxpayer1,
    //   "Taxpayer Address": `${assessment.taxpaddr}, ${assessment.taxpcity}, ${assessment.taxpstate}`,
    //   "Last Sale Date": assessment.saledate ? dayjs(assessment.saledate).format('MM/DD/YYYY') : `-`,
    //   "Last Sale Price": parseInt(assessment.saleprice).toLocaleString(),
    //   "PRE %": assessment.pre,
    //   "NEZ": assessment.nez,
    //   // "Related Parcel": (<Link href={`/parcels/${assessment.relatedparcel}`}><span>{assessment.relatedparcel}</span></Link>)
    // },
    // "Usage & classification": {
    //   "Property Class": `${assessment.propclass} - ${assessment.propclassdesc}` ,
    //   "Property Use": `${assessment.usecode}`,
    //   "Zoning": assessment.zoning,
    //   "# of Buildings": assessment.resbldgcount + assessment.cibldgcount,
    //   "Total Floor Area (sf)": assessment.totalfloor,
    //   "Style": assessment.style,
    // },
    // Taxation: {
    //   "Tax Status": assessment.taxstatus,
    //   "Assessed Value": parseInt(assessment.assessedvalue).toLocaleString(),
    //   "Taxable Value": parseInt(assessment.taxablevalue).toLocaleString(),
    // },
    // Dimensions: {
    //   "Total Acreage": assessment.totalacreage,
    //   "Total Square Footage": assessment.totalsqft,
    //   "Depth x Frontage (ft)": `${assessment.depth} x ${assessment.frontage}`,
    // },
  };

  return (
    <>
      <SiteSidebar>
        <div className="sidebar-section">
          <h2>{lyr.label} lookup</h2>
        </div>
      </SiteSidebar>
      <main>
        <div
          className="p-2 w-full flex items-center justify-between px-4"
          style={{ backgroundColor: `${lyr.color}` }}
        >
          <h2 className="m-0 font-extrabold" style={{ color: lyr.text_color }}>
            {lyr.label}: {id}
          </h2>
          <h3 className="m-0 font-extrabold" style={{ color: lyr.text_color }}>
            {geojson.properties.assessor_address}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <StreetMap geojson={geojson} />
        </div>
        <div className="p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
            {Object.keys(streetData).map((category) => (
              <div key={category} className="">
                <p className="font-bold text-lg text-gray-700 city-underline">{category}</p>
                {Object.keys(streetData[category]).map(column => (
                  <div className="flex items-center justify-between py-1">
                    <span className="font-semibold text-gray-700">{column}</span>
                    {streetData[category][column]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Street;
