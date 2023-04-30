import { queryFeatures } from "@esri/arcgis-rest-feature-layer";
import { useRouter } from "next/router";
import layers from "../../src/data/layers";
import SiteSidebar from "../../src/layout/SiteSidebar";
import StreetMap from "../../src/maps/StreetMap";
import IssueReporter from "../../src/components/IssueReporter";
import { CategoryItem, UnitCategory } from "../../src/components/UnitCategory";

export async function getServerSideProps(context) {
  const { id } = context.params;

  const lyr = layers.streets;

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

const Street = ({ geojson, lyr, session }) => {
  const router = useRouter();
  const { id } = router.query;

  const {
    street_name,
    street_prefix,
    street_type,
    fraddl,
    toaddl,
    fraddr,
    toaddr,
    fcc,
    legalsystem,
  } = geojson.properties;

  const streetData = {
    "Street information": {
      "Street ID": id,
      "Street direction": street_prefix,
      "Street name": street_name,
      "Street type": street_type,
    },
    "MGF/Address range data": {
      "Left-hand range": `${fraddl} - ${toaddl}`,
      "Right-hand range": `${fraddr} - ${toaddr}`,
    }
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
          <h2 className="m-0 font-extrabold" style={{ color: lyr.text_color }}>
            {lyr.label}: {id}
          </h2>
        </div>
        <div className="sidebar-section grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
          {Object.keys(streetData)
            .map((category, idx) => {
              return (
                <>
                <UnitCategory key={category} categoryName={category}>
                  {Object.keys(streetData[category]).map((column, idx) => (
                    <CategoryItem
                    column={column}
                    value={streetData[category][column]}
                    borderBottom={Object.keys(streetData[category]).length - 1 > idx}
                    />
                    ))}
                </UnitCategory>
                {idx === 0 && <StreetMap geojson={geojson} />}
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

export default Street;
