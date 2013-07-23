//////////////////////////////////////////////////////////////////////
// GENERAL
/////////////////////////////////////////////////////////////////////
AppSettings = {};
// The Tilt and Co App ID used for tracking, get id from glen
AppSettings.AppID = 6;
// The Apps area shown to the user
AppSettings.appAreaName = 'Blue Mountains';
// path to load unqiue images for the app from
AppSettings.imgfolder = 'resources/app-images/blue-mountains/';
// Path to load images from
AppSettings.regionImagePath = 'resources/region-images/green/';
// Path to load offile maps from
AppSettings.mapsTilesPath = AppSettings.imgfolder +'maptiles/';
// offile maps max zoom level
AppSettings.offlineMapsMaxZoom = 14;
// Website URL sydney.com or visitnsw.com
AppSettings.displayWebsiteURL = 'visitnsw.com';
AppSettings.websiteURL = 'http://www.visitnsw.com/';
// The Area of the app which is used for services and faclitices searches
AppSettings.appAddress = {
    state: 'nsw',
    suburb: 'blue mountains'
};
// The default map center
AppSettings.center = [-33.71463,150.311508];
// The bound of the app, used to find products and services
AppSettings.bounds = {
    "left": 150.240784,
    "bottom": -33.744897,
    "right": 150.720062,
    "top": -33.517354
};
// used with the center for alerts search in KM
AppSettings.radius = 50;
// The detinations to perform all funnel back serches within
// look at the structure of the path on http://www.visitnsw.com/ Example http://www.visitnsw.com/destinations/blue-mountains
AppSettings.destinationWebpath = '/blue-mountains/';
// List of sub desinations to be used in the search. the Local areas listed at the bootom of the destinations page on visitnsw.com
AppSettings.appSubDestination = [{
    name: "Katoomba-Area",
    towns: [{
        name: "Blackheath"
    }, {
        name: "Faulconbridge"
    }, {
        name: "Katoomba"
    }, { 
        name: "Leura"
    }, {
        name: "Megalong Valley"
    }, {
        name: "Mount Victoria"
    }, {
        name: "Springwood"
    }, {
        name: "Wentworth Falls"
    }]
}, {
    name: "Lithgow-Area",
    towns: [{
        name: "Hartley"
    }, {
        name: "Lithgow"
    }]
}, {
    name: "Oberon-Area",
    towns: [{
        name: "Jenolan Caves"
    }, {
        name: "Oberon"
    }]
}];
// The url of the squiz search
AppSettings.searchURL = 'http://tnsw-search.squiz.net/s/search.html';
// The name of the events calender in the database to search for events in
AppSettings.eventCalName = 'SYDNEY EVENTS CALENDAR';
AppSettings.eventsIncludeFeatured = false;
// - dev url: http://tnsw-search03.squiz.net/s/search.html', // - live url http://tnsw-search.squiz.net/s/search.html
// matrix destination ids for this app - Get DNSW to provide
// Or get list from http://www.visitnsw.com/widgets/mobile-app-platform-feeds/listings/destinations/_nocache
AppSettings.destinationIds = '324;335;4113;9;1;3;10;11;8;4115;4;336;12;6;4116;337;2;5;4117';
// The smartphone cms section
AppSettings.forceRemoteContent = false; // should always be set to false. Just for testing while the backend is been built
AppSettings.smartphoneCMSSection = 'blue-mountains';
AppSettings.smartphoneURL = 'http://www.destinationnsw.com.au/smartphoneapps/';
AppSettings.getSMPSectionURL = function() {
    return AppSettings.smartphoneURL + AppSettings.smartphoneCMSSection;
};
//////////////////////////////////////////////////////////////////////
// SHARING
/////////////////////////////////////////////////////////////////////
AppSettings.defualtShareData = {
    name: AppSettings.appAreaName + ' App',
    defaultMessage: 'Check out the ' + AppSettings.appAreaName + ' App on the app store',
    description: 'The ' + AppSettings.appAreaName + ' App has been devloped by Destination NSW to assist visitors in planning their journey in ' + AppSettings.appAreaName + '.',
    emailBody: 'The ' + AppSettings.appAreaName + ' App has been devloped by Destination NSW to assist visitors in planning their journey in ' + AppSettings.appAreaName + '.',
    link: AppSettings.websiteURL,
    // maybe chnage picture
    picture: 'http://getconnected.dnsw.com.au/multimedia/GTOPromo__9131570_AF02_JWP2584.jpg'
};
// FACEBOOK settings
AppSettings.facebook = {
    clientId: "522195534476569",
    // FACEBOOK APP ID
    secret: "9079d25a28945c3d9e6ac6ec880b6197",
    // FACEBOOK APP SECRET
    redirectUrl: "http://www.sydney.com/",
    // CHANGE THIS THE USER WILL SEE IT AFTER THEY LOGIN
    type: "user_agent",
    // LEAVE THIS
    display: "touch",
    // LEAVE THIS
    token: "fbToken" // OUR TOKEN KEEPER
};
// TWITTER settings
AppSettings.twitter = {
    consumerKey: '6TRaloNDL4sZWQxPRfFw',
    // REPLACE WITH YOUR CONSUMER_KEY
    consumerSecret: 'C0TmFAYUYZEw6zopz1sxLKCSEyddFqeu9YO00MX1PA',
    // Replace with your thankyou URL
    callbackUrl: AppSettings.websiteURL
    // YOUR URL
};
//////////////////////////////////////////////////////////////////////
// WEATHER List of the weather station to use for the App
// Glen to provide a list of weather stations for each app
/////////////////////////////////////////////////////////////////////
AppSettings.weatherStations = [{
    stationId: 499,
    lat: -33.7122,
    lon: 150.3087,
    name: 'Katoomba'
}, {
    stationId: 501,
    lat: -33.7065,
    lon: 150.5848,
    name: 'Springwood'
}, {
    stationId: 502,
    lat: -33.4769,
    lon: 150.1303,
    name: 'Lithgow'
}];
//////////////////////////////////////////////////////////////////////
// SERVICES
/////////////////////////////////////////////////////////////////////
// SENSIS
AppSettings.sensis = {
    ApiKey: 'ajjxy6c2uwu6gsr6gwtwbmr5',
    url: 'http://api.sensis.com.au/ob-20110511/prod/search',
    location: "Blue Mountains NSW" // ** You will need to updated this
};
AppSettings.whereis = {
    token: '8348923927920532480',
    password: '2121133n!s!w828'
};
AppSettings.bing = {
    key: 'At6i83RWspt0FyjmEpFHnY3YGbguN21C40zyg6St8ab0xOYu38Vz2pAvTEb3iIJB'
};

// servive and facilities list
AppSettings.poi = [{
    label: 'Hospitals'
}, {
    label: 'Police'
}, {
    label: 'Doctors'
}, {
    label: 'Dentist'
}, {
    label: 'Optometrist'
}, {
    label: 'Chemists'
}, {
    label: 'Service Stations'
}, {
    label: 'Veterinarian'
}, {
    label: 'Post Office'
}, {
    label: 'Beaches'
}, {
    label: 'Lookouts'
}, {
    label: 'Toilets'
}, {
    label: 'Supermarket'
}, {
    label: 'Hairdressers'
}, {
    label: 'Electrician'
}, {
    label: 'Plumber'
}, {
    label: 'Florist'
}, {
    label: 'Mechanics'
}, {
    label: 'Auto Electrictian'
}];
//////////////////////////////////////////////////////////////////////
// APP CONTENTS
/////////////////////////////////////////////////////////////////////
// Home Images
AppSettings.homeImgs = [{
    imagePath: AppSettings.imgfolder+'home1.jpg',
    altText: 'Aerial view of Capertee Valley in the Blue Mountains by Hamilton Lund'
}, {
    imagePath: AppSettings.imgfolder+'home2.jpg',
    altText: 'Kanangra Falls in the Blue Mountains by Chris Jones'
}, {
    imagePath: AppSettings.imgfolder+'home3.jpg',
    altText: 'Fairmont Resort at Leura by James Horan'
}, {
    imagePath: AppSettings.imgfolder+'home4.jpg',
    altText: 'Gardens of Stone National Parks by Hamilton Lund'
}, {
    imagePath: AppSettings.imgfolder+'home5.jpg',
    altText: 'Close up view of the Three Sisters by Destination NSW'
}, {
    imagePath: AppSettings.imgfolder+'home6.jpg',
    altText: 'View across the Blue Lake to Jenolan Caves'
}];
// Things to do sections. This list is used on the home page as well and on the things to do page
AppSettings.attractionCats = [
// {
//     title: 'Beach Lifestyle',
//     subheading: 'Beach lifestyle in ' + AppSettings.appAreaName,
//     imgPath: AppSettings.imgfolder+'todo_beach.png',
//     contentPath: AppSettings.getSMPSectionURL() + '/things-to-do/beach-lifestyle'
// }, 
{
    title: 'Nature & Parks',
    subheading: 'Explore ' + AppSettings.appAreaName + '’s great outdoors',
    imgPath: AppSettings.imgfolder+'home_experience_a.jpg',
    contentPath: AppSettings.getSMPSectionURL() + '/things-to-do/nature-and-parks',
    relatedSearchSelection: 'Nature based'
}, {
    title: 'Dining & Entertainment',
    subheading: 'Dining & entertainment in ' + AppSettings.appAreaName,
    imgPath: AppSettings.imgfolder+'home_experience_b.jpg',
    hideInSubSections: true,
    // hides this section from subsections as it has it's own section
    contentPath: AppSettings.getSMPSectionURL() + '/dining-and-entertainment',
    relatedSearchSelection: 'Food and Wine'
}, {
    title: 'Fashion & Shopping',
    subheading: 'Shopping in ' + AppSettings.appAreaName,
    imgPath: AppSettings.imgfolder+'home_experience_c.jpg',
    contentPath: AppSettings.getSMPSectionURL() + '/things-to-do/shopping',
    relatedSearchSelection: 'Shopping'
}, {
    title: 'Arts & Culture',
    subheading: 'Best of arts and culture in ' + AppSettings.appAreaName,
    imgPath: AppSettings.imgfolder+'home_experience_d.jpg',
    contentPath: AppSettings.getSMPSectionURL() + '/things-to-do/arts-and-culture',
    relatedSearchSelection: 'The Arts'
}, {
    title: 'Family Holidays',
    subheading: 'Family travel in ' + AppSettings.appAreaName,
    imgPath: AppSettings.imgfolder+'home_experience_e.jpg',
    contentPath: AppSettings.getSMPSectionURL() + '/things-to-do/family-holidays',
    relatedSearchSelection: 'Family Friendly'
}];


// The main menu for this app - Should only be updated by the developer
AppSettings.mainMenu = [{
    title: 'Home',
    group: 'Group 1',
    id: 'homeSection',
    collectionType: null,
    firstPage: {
        xtype: 'homePage',
        title: AppSettings.appAreaName
    }
}, {

    title: 'About ' + AppSettings.appAreaName,
    group: 'Group 1',
    id: 'aboutSection',
    firstPage: {
        xtype: 'contentPage',
        title: 'About ' + AppSettings.appAreaName,
        contentPath: AppSettings.getSMPSectionURL() + '/about'
    }
}, {

    title: 'Local Areas',
    group: 'Group 1',
    id: 'localSection',
    firstPage: {
        xtype: 'contentPage',
        title: 'Local Areas',
        contentPath: AppSettings.getSMPSectionURL() + '/local-areas'
    }
}, {
    title: 'My Itinerary',
    group: 'Group 1',
    id: 'myItinerarySection',
    firstPage: {
        title: 'My Itinerary',
        xtype: 'myItineraryPage'
    }
}, {
    title: 'My Favourites',
    group: 'Group 1',
    id: 'myFavouritesSection',
    firstPage: {
        title: 'My Favourites',
        xtype: 'myFavouritesPage'
    }
}, {
    title: 'Things to do',
    group: 'Group 2',
    id: 'thingsToDoSection',
    collectionType: 'attr',
    firstPage: {
        title: 'Things to do',
        xtype: 'thingsToDoCatigoriesPage',
        contentPath: AppSettings.getSMPSectionURL() + '/things-to-do'
    }
}, {
    title: 'Dining & Entertainment',
    group: 'Group 2',
    id: 'foodAndWineSection',
    collectionType: 'restaurants',
    firstPage: {
        title: 'Dining & Entertainment',
        xtype: 'productSubSection',
        contentPath: AppSettings.getSMPSectionURL() + '/dining-and-entertainment'
    }
}, {
    title: 'Accommodation',
    group: 'Group 2',
    id: 'accommodationSection',
    collectionType: 'accom',
    firstPage: {
        title: 'Accommodation',
        collectionType: 'accom',
        xtype: 'searchPage'
    }
}, {
    title: 'Events',
    group: 'Group 2',
    id: 'eventsSection',
    collectionType: 'event',
    firstPage: {
        xtype: 'eventsPage',
        title: 'Events',
        rightBtn: 'searchBtn',
        contentPath: AppSettings.getSMPSectionURL() + '/things-to-do/arts,-culture'
    }
}, {
    title: 'Services & Facilities',
    group: 'Group 3',
    id: 'servicesSection',
    firstPage: {
        title: 'Services & Facilities',
        xtype: 'servicesAndFacilitiesPage'
    }
}, {
    title: 'Tours',
    group: 'Group 3',
    id: 'toursSection',
    firstPage: {
        title: 'Tours',
        collectionType: 'tour',
        xtype: 'searchPage'
    }
}, {
    title: 'Deals',
    group: 'Group 3',
    id: 'dealsSection',
    firstPage: {
        title: 'Deals',
        collectionType: 'deals',
        xtype: 'searchPage'
    }
}, {
    title: 'Alerts',
    group: 'Group 4',
    id: 'alertsSection',
    firstPage: {
        title: 'Alerts',
        xtype: 'alertsPage'
    }
}, {
    title: 'Map',
    group: 'Group 4',
    id: 'areaMap',
    firstPage: {
        title: 'Map',
        xtype: 'mapPage',
        xtype: 'directionsPage',
        address: {
            Street: ' ',
            Suburb: 'Katoomba',
            State: 'NSW',
            Postcode: 2780
        },
        latlon: AppSettings.center,
        zoomLevel: 11
    }
}, {
    title: 'Weather',
    group: 'Group 4',
    id: 'currentWeather',
    firstPage: {
        title: 'Weather',
        xtype: 'weatherPage'
    }
}, {
    title: 'Currency Converter',
    group: 'Group 4',
    id: 'currencyConverter',
    firstPage: {
        title: 'Currency Converter',
        xtype: 'currencyConverterPage'
    }
}, {
    title: 'Transport Info',
    group: 'Group 5',
    id: 'tranportSection',
    firstPage: {
        title: 'Transport Info',
        xtype: 'contentPage',
        contentPath: AppSettings.getSMPSectionURL() + '/transport-information'
    }

}, {
    title: 'Visitor Information Centres',
    group: 'Group 5',
    id: 'visitorInoSection',
    firstPage: {
        title: 'Visitor Information Centres',
        collectionType: 'vic',
        xtype: 'searchPage'
    }
}, {
    title: 'About Destination NSW',
    group: 'Group 5',
    id: 'aboutDNSWSection',
    firstPage: {
        title: 'About Destination NSW',
        xtype: 'contentPage',
        contentPath: AppSettings.getSMPSectionURL() + '/about-destination-nsw'
    }
}, {
    title: 'Other NSW Apps',
    group: 'Group 5',
    id: 'otherAppsSection',
    firstPage: {
        title: 'Other DNSW apps',
        xtype: 'otherAppsPage'
    }
}, {
    title: 'Settings',
    group: 'Group 6',
    id: 'settingsSection',
    firstPage: {
        title: 'Settings',
        xtype: 'settingsPage'
    }
}];

//////////////////////////////////////////////////////////////////////
// Home Options
//////////////////////////////////////////////////////////////////////

AppSettings.homeMenu = [{
                    xtype: 'button',
                    html: "<span class='icon'></span><span>Accommodation</span>",
                    cls: 'accomHome',
                    action: 'changeSection',
                    sectionId: 'accommodationSection'
                }, { // Tours
                    xtype: 'button',
                    html: "<span class='icon'></span><span>Tours</span>",
                      cls: 'toursHome',
                    action: 'changeSection',
                    sectionId: 'toursSection'
                }, {
                    xtype: 'button',
                    html: "<span class='icon'></span><span>My Itinerary</span>",
                    cls: 'itineraryHome',
                    action: 'changeSection',
                    sectionId: 'myItinerarySection'
                }, { // Local Areas
                    xtype: 'button',
                    html: "<span class='icon'></span><span>Local Areas</span>",
                    cls: 'localHome',
                    action: 'changeSection',
                    sectionId: 'localSection'
                }];

//////////////////////////////////////////////////////////////////////
// CONSTANTS
//////////////////////////////////////////////////////////////////////

// Caching how long to cache connnet
// Should not change
var oneDay = 86400;
AppSettings.caching = {
    cmsCacheLength: (oneDay * 14),
    searchCacheLength: (oneDay * 1),
    productCacheLength: (oneDay * 14)
};

// Image resizing, allow images from the domains to be resized.
// Should not change
AppSettings.imageResizing = {
    resizeURL: 'http://m.img.getconnected.dnsw.com.au/',
    fromURLs: [{
        url: "getconnected.dnsw.com.au/",
        remote: false
    }, {
        url: "destinationnsw.com.au/",
        remote: true
    }, {
        url: "sydney.com/",
        remote: true
    }, {
        url: "visitnsw.com",
        remote: true
    }]
};

