import { faAtlas, faCheckSquare, faEnvelope, faHome, faLink, faMailBulk, faTasks, faWrench, faPlusCircle, faSearch, faBusinessTime } from '@fortawesome/free-solid-svg-icons';

export const apps = {
    '/': {
        name: 'Home',
        url: `/`,
        icon: faHome,
        private: false,
        show: true
    },
    'search': {
        name: 'Search',
        description: `Look up & validate an individual address`,
        questions: [
            `Is this is a valid address?`
        ],
        url: `/search`,
        icon: faSearch,
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
        icon: faAtlas,
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
        icon: faTasks,
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
        icon: faEnvelope,
        private: true,
        show: true
    },
    'linker': {
        name: 'Linker',
        url: `/linker`,
        description: 'Create or edit links for an existing address',
        questions: [
            `All these unlinked addresses are driving me crazy?`
        ],
        icon: faLink,
        private: true,
        show: false
    },
    'assignment': {
        name: 'Assignment',
        url: `/assignment`,
        description: 'Assign a new address',
        questions: [
            `I need to assign new addresses for a row of townhouses.`
        ],
        icon: faPlusCircle,
        private: true,
        show: false
    },
    'business-truth': {
      name: "Business Truth",
      url: `/business-truth`,
      description: "Show businesses",
      icon: faBusinessTime,
      private: false,
      show: true
    }
}

export default apps;