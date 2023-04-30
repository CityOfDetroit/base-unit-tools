import { queryFeatures } from "@esri/arcgis-rest-feature-layer";
import { useRouter } from "next/router";
import layers from "../../src/data/layers";
import SiteSidebar from "../../src/layout/SiteSidebar";
import AddressMap from "../../src/maps/AddressMap";
import Link from "next/link";
import { CategoryItem, UnitCategory } from "../../src/components/UnitCategory";
import IssueReporter from "../../src/components/IssueReporter";

export async function getServerSideProps(context) {
  const { id } = context.params;

  const lyr = layers.addresses;

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

const Address = ({ geojson, lyr, session }) => {
  const router = useRouter();
  const { id } = router.query;

  let { bldg_id, parcel_id, street_id, street_number, street_prefix, street_name, street_type, unit_type, unit_number } = geojson.properties;

  const addressData = {
    "Address information": {
      "Address ID": id,
      "Street Number": street_number,
      "Street Prefix": street_prefix,
      "Street Name": street_name,
      "Street Type": street_type,
      "Unit Type": unit_type,
      "Unit Number": unit_number,
    },
    "Base unit links": {
      Building: (
        <Link href={`/building/${bldg_id}`}>
          <a>{bldg_id}</a>
        </Link>
      ),
      Parcel: (
        <Link href={`/parcel/${parcel_id}`}>
          <a>{parcel_id}</a>
        </Link>
      ),
      Street: (
        <Link href={`/street/${street_id}`}>
          <a>{street_id}</a>
        </Link>
      ),
    },
  };

  let clicked = {
    type: "addresses",
    id: id,
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
          {Object.keys(addressData)
            .map((category, idx) => {
              return (
                <>
                <UnitCategory key={category} categoryName={category}>
                  {Object.keys(addressData[category]).map((column, idx) => (
                    <CategoryItem
                    column={column}
                    value={addressData[category][column]}
                    borderBottom={Object.keys(addressData[category]).length - 1 > idx}
                    />
                    ))}
                </UnitCategory>
                {idx === 0 && <AddressMap geojson={geojson} />}
                </>
              );
            })}
        </div>
        <IssueReporter
          geocoded={geojson}
          feature={geojson}
          clicked={{ type: lyr.name, id: id }}
          session={session}
        />
      </main>
    </>
  );
};

export default Address;
