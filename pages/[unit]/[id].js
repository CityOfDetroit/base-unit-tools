import { queryFeatures } from "@esri/arcgis-rest-feature-layer";
import { faLyft } from "@fortawesome/free-brands-svg-icons";
import { useRouter } from "next/router";
import layers from "../../src/data/layers";
import SiteSidebar from "../../src/layout/SiteSidebar";

export async function getServerSideProps(context) {
  const { unit, id } = context.params;

  let mapping = {
    building: layers.buildings,
    parcel: layers.parcels,
    address: layers.addresses,
    street: layers.streets
  };

  const lyr = mapping[unit];

  const features = await queryFeatures({
    url: lyr.endpoint,
    where: `${lyr.id_column} = ${unit === "parcel" ? `'${id}'` : id}`,
    outFields: "*",
    outSR: 4326,
    f: "geojson",
  });

  return { props: { features, lyr } };

  // // Fetch data from external API
  // console.log(layers.buildings.endpoint + `/` + context.params.id)
  // // const res = await fetch(layers.buildings.endpoint + `/${context.params.id}`)
  // // const data = await res.json()
  // const data = {}
  // // Pass data to the page via props
  // return { props: { data } }
}

const Unit = ({ features, lyr }) => {
  const router = useRouter();
  const { id, unit } = router.query;

  return (
    <>
    <SiteSidebar>
      
    </SiteSidebar>
    <main>
      <div className="p-2 w-full md:w-2/3" style={{ backgroundColor: lyr.color }}>
        <h2 className="m-0 font-extrabold" style={{color: lyr.text_color}}>
          {lyr.label}: {id}
        </h2>
      </div>
    </main>
    </>
  );
};

export default Unit;
