import { faAtlas, faCheckSquare, faHome, faMailBulk, faPlusCircle, faTasks, faWrench } from '@fortawesome/free-solid-svg-icons';

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
        description: `Locate and attach information to addresses.`,
        questions: [
            `What council district & neighborhood does this address fall in?`,
            `We need geographic coordinates for these addresses.`
        ],
        icon: faTasks,
        private: false
    },
    'issue-reporter': {
        name: 'Issue Reporter',
        url: `/issue-reporter`,
        description: `Help us find problems with our address data`,
        questions: [
            `I can't get this address to geocode; can we add it to the database?`
        ],
        icon: faWrench,
        private: false
    },
    'validator': {
        name: 'Validator',
        description: `A utility to parse, clean up, and validate an individual address`,
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
        icon: faMailBulk,
        private: true
    }
    // 'assignment': {
    //     name: 'Assignment',
    //     url: `/assignment`,
    //     description: 'Assign a new address',
    //     questions: [
    //         `I need to assign new addresses for a row of townhouses.`
    //     ],
    //     icon: faPlusCircle,
    //     private: true
    // }
}

export default apps;