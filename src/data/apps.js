import { Crosshair2Icon, EnvelopeOpenIcon, GlobeIcon, HomeIcon } from "@radix-ui/react-icons";
import { ZONING_GROUP_ID } from "./groups";

export const apps = {
    '/': {
        name: 'Home',
        url: `/`,
        // icon: faHome,
        icon: "HomeIcon",
        private: false,
        show: true
    },
    'map': {
        name: 'Map',
        url: `/map`,
        description: `View a map of the address, building, parcel, and streets data together.`,
        questions: [
            `Which buildings are linked to that street?`
        ],
        // icon: faAtlas,
        icon: "GlobeIcon",
        private: false,
        show: true
    },
    'geocoder': {
        name: 'Geocoder',
        url: `/geocoder`,
        description: `Locate and attach information to many addresses at once.`,
        questions: [
            `What council district & neighborhood does this address fall in?`,
            `We need geographic coordinates for these addresses.`
        ],
        icon: "Crosshair2Icon",
        private: false,
        show: true
    },
    'mailer': {
        name: 'Mailer',
        url: `/mailer`,
        description: 'Create mailing lists',
        questions: [
            `I'd like to send a mailing to all owner-occupants in a historic district.`
        ],
        icon: "EnvelopeOpenIcon",
        private: true,
        show: true
    },
    'zoning': {
        name: 'Zoning Amendments',
        url: `/zoning`,
        description: `Create and edit zoning amendment applications.`,
        questions: [
            `I need to update the parcels and status for a zoning amendment.`
        ],
        icon: "GroupIcon",
        private: true,
        group: ZONING_GROUP_ID,
        show: true
    }
}

export default apps;