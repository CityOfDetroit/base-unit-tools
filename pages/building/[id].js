import { queryFeatures } from "@esri/arcgis-rest-feature-layer";
import { useRouter } from "next/router";
import layers from "../../src/data/layers";
import SiteSidebar from "../../src/layout/SiteSidebar";
import BuildingMap from "../../src/maps/BuildingMap";
import { CategoryItem, UnitCategory } from "../../src/components/UnitCategory";
import IssueReporter from "../../src/components/IssueReporter";
export async function getServerSideProps(context) {
  const { id } = context.params;

  const lyr = layers.buildings;

  console.log(lyr, id);
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

const Building = ({ geojson, lyr, session }) => {
  const router = useRouter();
  const { id } = router.query;
  console.log(geojson);

  let { use_category, ted_build_type, bldg_status, parcel_id } = geojson.properties;

  const buildingData = {
    "Building information": {
      "Building ID": id,
      Status: bldg_status,
      "Use type": use_category,
      "Building type": ted_build_type,
    },
    "Base unit links": {
      Parcel: (
        <a href={`/parcel/${parcel_id}`} target="_blank">
          {parcel_id}
        </a>
      ),
    },
  };

  return (
    <>
      <SiteSidebar></SiteSidebar>
      <main>
        <div
          className="p-2 w-full flex items-center justify-between px-4"
          style={{ backgroundColor: `${lyr.color}` }}
        >
          <h2>{lyr.label}</h2>
        </div>

        <div className="sidebar-section grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
          {Object.keys(buildingData).map((category, idx) => {
            return (
              <>
                <UnitCategory key={category} categoryName={category}>
                  {Object.keys(buildingData[category]).map((column, idx) => (
                    <CategoryItem
                      column={column}
                      value={buildingData[category][column]}
                      borderBottom={Object.keys(buildingData[category]).length - 1 > idx}
                    />
                  ))}
                </UnitCategory>
                {idx === 0 && <BuildingMap geojson={geojson} />}
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

export default Building;
