import { queryFeatures } from "@esri/arcgis-rest-feature-layer";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

const ProjectEvents = ({ project, session }) => {
  console.log(project, session);

  let [events, setEvents] = useState([]);

  useEffect(() => {
    queryFeatures({
      url: `https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/Development_Tracker/FeatureServer/1`,
      where: `development_id = '${project.properties.id}'`,
      outFields: ["*"],
      orderByFields: ["date DESC"],
      authentication: session,
      f: "geojson",
    }).then((response) => {
      setEvents(response.features);
    });
  }, [project]);

  if(events.length === 0) return null;

  return (
    <div className="mt-2">
      <div className="bg-blue-200 text-gray-700 font-bold px-2 py-1 text-sm flex items-center justify-between">
        <span>Project actions</span>
      </div>
      <section className="sidebar-section flex gap-4 flex-col">
        {
          events.map((event) => {
            return (
              <div className="flex flex-col">
                <div className="flex items-center justify-between border-b-2">
                <span className="font-semibold">{event.properties.data_source}</span>
                <span className="text-sm font-bold">{dayjs(event.properties.date).format('YYYY-MM-DD')}</span>
                </div>
                <span className="text-sm text-gray-600 m-0 pt-1 pl-1">{event.properties.description}</span>
              </div>
            )
          }
        )
        }
      </section>
    </div>
  );
};

export default ProjectEvents;
