import { faAtlas, faCheckSquare, faEnvelope, faHome, faLink, faMailBulk, faTasks, faWrench, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

export const apps = {
    '/': {
        name: 'Home',
        url: `/`,
        icon: faHome,
        private: false
    },
    'explorer': {
        name: 'Explorer',
        url: `/explorer`,
        description: `View a map of the address, building, and parcel data together.`,
        questions: [
            `Which buildings are linked to that street?`
        ],
        icon: faAtlas,
        private: false
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
        private: false
    },
    'validator': {
        name: 'Validator',
        description: `A utility to validate an individual address`,
        questions: [
            `Is this is a valid address?`
        ],
        url: `/validator`,
        icon: faCheckSquare,
        private: false
    },
    'mailer': {
        name: 'Mailer',
        url: `/mailer`,
        description: 'Create mailing lists',
        questions: [
            `I'd like to send a mailing to all owner-occupants in a historic district.`
        ],
        icon: faEnvelope,
        private: true
    },
    'linker': {
        name: 'Linker',
        url: `/linker`,
        description: 'Create or edit links for an existing address',
        questions: [
            `All these unlinked addresses are driving me crazy?`
        ],
        icon: faLink,
        private: true
    },
    'assignment': {
        name: 'Assignment',
        url: `/assignment`,
        description: 'Assign a new address',
        questions: [
            `I need to assign new addresses for a row of townhouses.`
        ],
        icon: faPlusCircle,
        private: true
    }
}

export default apps;