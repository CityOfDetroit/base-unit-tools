import React from "react";
import apps from "./data/apps";
import { Box, Card, Container, Grid, Flex, Text } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Icon from "./components/Icon";

const About = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-gray-100 dark:bg-gray-800">
      <Container size={"2"} className="min-h-96 py-6">
        <h1 className="cod-style py-2">About the Base Units Tools site</h1>

        <Box py={"5"} className="gap-4 flex flex-col">
          <Flex direction="column" gap="4">
            <div>
              <h2 className="cod-style">What's a base unit?</h2>
              <div className="my-4 flex justify-center">
              <img 
                  src="./bu_diagram.png" 
                  alt="Diagram of the base units" 
                  className="max-w-full border border-gray-300"
                />
              </div>
              <p>
                They are the fundamental units of measurement required to
                accurately describe a city.
              </p>
              <p className="py-2">
                If you had an emergency and needed to describe where you were,
                you might say "I'm at 123 Main Street in Apartment 456".
              </p>
              Dispatchers and first responders need to know:
              <ul className="list-disc pl-5">
                <li>which apartment that is in which building</li>
                <li>which street provides access to that building</li>
                <li>
                  which police precinct or fire station is nearby and should
                  respond to your emergency
                </li>
              </ul>
            </div>
            <div>
              <h2 className="cod-style">
                How is base units information managed?
              </h2>
              <p>
                The four departments that coordinate to manage this information
                are:
              </p>
              <ul className="list-disc pl-5">
                <li>
                  Addresses: The Maps and Records Division in the Department of
                  Public Works (DPW) manages the address assignment process.
                </li>
                <li>
                  Parcels: The GIS / Land Records Maintenance Division in the
                  Office of the Assessor manages the data integrity of the
                  parcel file and the parcel revision process.
                </li>
                <li>
                  Buildings and Units: The Buildings, Safety Engineering and
                  Environmental Department (BSEED) monitors the construction of
                  new buildings and the condition of existing buildings.
                </li>
                <li>
                  All: The Data Strategy and Analytics team and the Enterprise
                  GIS team in the Department of Innovation and Technology (DoIT)
                  manage the Enterprise Addresses database and coordinate with
                  the teams listed above to keep the Base Units datasets shared
                  here up to date.
                </li>
              </ul>
            </div>
            <h2 className="cod-style">How do we link data together?</h2>
            <div>
              <p>
                In the Enterprise Addresses database, each table contains at
                least one or more references to features in the other table.
              </p>

              <p>
                For example, each address can be linked to up to four other
                units through the following columns:
              </p>

              <ul className="list-disc pl-5">
                <li>
                  <strong>bldg_id</strong>: the unique ID of the row in the
                  building table, representing an individual free-standing
                  structure, which the address belongs to
                </li>
                <li>
                  <strong>parcel_id</strong>: the unique ID of the row in the
                  parcel table, representing an individual piece of real
                  property, which the address belongs to
                </li>
                <li>
                  <strong>street_id</strong>: the unique ID of the row in the
                  streets table, representing an individual street segment which
                  the address belongs to
                </li>
                <li>
                  <strong>unit_id</strong>: the unique ID of the row in the
                  units table, representing an individual subdivision of a
                  building, which the address represents.
                </li>
              </ul>

              <p>
                For most purposes, the links built in the addresses table are
                the most important links for our database. However, there are a
                few other links worth noting:
              </p>

              <ul className="list-disc pl-5">
                <li>each building must be linked to a parcel</li>
                <li>
                  a unit may be linked to a parcel, in the case of a unit which
                  represents a condo
                </li>
                <li>each street is linked to a street name</li>
              </ul>
            </div>

            <div>
              <h2 className="cod-style">A simple example</h2>
              <div className="my-4 flex justify-center">
              <img 
                  src="./address_construction.png" 
                  alt="Diagram showing how 1611 Hubbard is linked in the database" 
                  className="max-w-full border border-gray-300"
                />
              </div>
              <p>
                Let's use the simple example of a single-family home whose
                address is 1611 Hubbard.
              </p>

              <p>
                The left-most box represents the addresses table. This row
                represents the address 1611 Hubbard - although you'll notice
                that only the street number 1611 and not the street name is
                stored in this table..
              </p>

              <p>
                Instead, we store a reference to a row in the streets table,
                using the unique ID 35901. When we look up the ID 35901 in the
                streets table, we find a row that represents the particular
                street segment that the address belongs to.
              </p>

              <p>
                We then do another lookup; except, this time, we're looking up a
                value from the streetnames table -- this is ultimately where the
                value Hubbard is stored.
              </p>

              <p>
                Similarly, we can use the bldg_id and parcel_id to look up
                information associated with the building or parcel,
                respectively, that can give us more information about the
                address.
              </p>

              <p>
                Since the address belongs to a building, our final address
                points table will use the building centroid as the address point
                geometry.
              </p>
            </div>
          </Flex>
        </Box>
      </Container>
    </div>
  );
};

export default About;
