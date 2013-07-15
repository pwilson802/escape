//////////////////////////////////////////////////////////////////////
// GENERAL
/////////////////////////////////////////////////////////////////////
AppSettings = {};
// The Tilt and Co App ID used for tracking, get id from glen
AppSettings.AppID = 2;
// The Apps area shown to the user
AppSettings.appAreaName = 'Sydney';
// path to load unqiue images for the app from
AppSettings.imgfolder = 'resources/app-images/sydney/';
// Path to load images from
AppSettings.regionImagePath = 'resources/region-images/blue/';
// Path to load offile maps from
AppSettings.mapsTilesPath = AppSettings.imgfolder +'maptiles/';
// offile maps max zoom level
AppSettings.offlineMapsMaxZoom = 14;
// Website URL sydney.com or visitnsw.com
AppSettings.displayWebsiteURL = 'sydney.com';
AppSettings.websiteURL = 'http://www.sydney.com/';
// The Area of the app which is used for services and faclitices searches
AppSettings.appAddress = {
    state: 'nsw',
    suburb: 'sydney'
};
// The default map center
AppSettings.center = [-33.8674869, 151.2069902];
// The bound of the app, used to find products and services
AppSettings.bounds = {
    "left": 150.55337081542,
    "bottom": -36.119202120384,
    "right": 151.80337081542,
    "top": -35.494202120384
};
// used with the center for alerts search in KM
AppSettings.radius = 100;
// The detinations to perform all funnel back serches within
// look at the structure of the path on http://www.visitnsw.com/ Example http://www.visitnsw.com/destinations/blue-mountains
AppSettings.destinationWebpath = '/sydney/';
// look at the structure of the path on http://www.visitnsw.com/ Example http://www.visitnsw.com/destinations/blue-mountains
AppSettings.appSubDestination = [{
    name: "Sydney City",
    towns: []
}, {
    name: "Sydney North",
    towns: []
}, {
    name: "Sydney West",
    towns: []
}, {
    name: "Sydney South",
    towns: []
}, {
    name: "Sydney East",
    towns: []
}, {
    name: "Inner Sydney",
    towns: []
}];
// The url of the squiz search
AppSettings.searchURL = 'http://tnsw-search.squiz.net/s/search.html';
// The name of the events calender in the database to serch for events in
AppSettings.eventCalName = 'SYDNEY EVENTS CALENDAR';
AppSettings.eventsIncludeFeatured = true;
// - dev url: http://tnsw-search03.squiz.net/s/search.html', // - live url http://tnsw-search.squiz.net/s/search.html
// matrix destination ids for this app
AppSettings.destinationIds = '282;283;284;285;286;287;288;289;290;291;292;294;295;296;297;298;299;300;301;302;303;304;305;306;308;309;310;311;312;313;314;315;316;317;318;319;320;321;332;406;407;408;409;410;411;4177;4178;4179;4180;4181;4182;4188;4190';
// The smartphone cms section
AppSettings.forceRemoteContent = false; // should always be set to false. Just for testing while the backend is been built
AppSettings.smartphoneCMSSection = 'sydney';
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
/////////////////////////////////////////////////////////////////////
AppSettings.weatherStations = [{
    stationId: 517,
    lat: -33.8607,
    lon: 151.205,
    name: 'Sydney'
}, {
    stationId: 516,
    lat: -33.6908,
    lon: 151.2253,
    name: 'Terrey Hills'
}, {
    stationId: 518,
    lat: -33.7917,
    lon: 151.0181,
    name: 'Parramatta'
}, {
    stationId: 525,
    lat: -33.9214,
    lon: 150.8861,
    name: 'Liverpool'
}, {
    stationId: 625,
    lat: -34.0542,
    lon: 150.8772,
    name: 'Campbelltown'
}, {
    stationId: 535,
    lat: -34.3691,
    lon: 150.9291,
    name: 'Wollongong'
}, {
    stationId: 526,
    lat: -33.6004,
    lon: 150.7761,
    name: 'Richmond'
}, {
    stationId: 528,
    lat: -33.7195,
    lon: 150.6783,
    name: 'Penrith'
}, {
    stationId: 479,
    lat: -33.3949,
    lon: 151.3289,
    name: 'Gosford'
}, {
    stationId: 501,
    lat: -33.7065,
    lon: 150.5848,
    name: 'Springwood'
}];
//////////////////////////////////////////////////////////////////////
// SERVICES
/////////////////////////////////////////////////////////////////////
// SENSIS
AppSettings.sensis = {
    ApiKey: 'ajjxy6c2uwu6gsr6gwtwbmr5',
    url: 'http://api.sensis.com.au/ob-20110511/prod/search',
    location: "Greater Sydney NSW" // ** You will need to updated this
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
    label: 'Chemists'
}, {
    label: 'Service Stations'
}, {
    label: 'Post Office'
}, {
    label: 'Lookouts'
}, {
    label: 'Toilets'
}, {
    label: 'Supermarket'
}, {
    label: 'Florist'
}];




//////////////////////////////////////////////////////////////////////
// APP CONTENTS
/////////////////////////////////////////////////////////////////////
// Home Images
AppSettings.homeImgs = [{
    imagePath: AppSettings.imgfolder+'content/dnsw1375318-399-c.jpg',
    altText: 'North Sydney Olympic Pool by Kajo Merket'
}, {
    imagePath: AppSettings.imgfolder+'content/dnsw1087014-399-c.jpg',
    altText: 'Guillame at Bennelong with Opera sails by Steve Back'
}, {
    imagePath: AppSettings.imgfolder+'content/dnsw1375320-399-c.jpg',
    altText: 'Sydney Harbour at twilight by Kajo Merket'
}, {
    imagePath: AppSettings.imgfolder+'content/dnsw1184096-399-c.jpg',
    altText: 'Fireworks celebrating the new year in Sydney Harbour by Hamilton Lund'
}, {
    imagePath: AppSettings.imgfolder+'content/dnsw1369455-399-c.jpg',
    altText: 'View of Sydney Harbour from Bradley\'s Head, Mosman by Hamilton Lund'
}];
// Things to do sections. This list is used on the home page as well and on the things to do page
AppSettings.attractionCats = [{
    title: 'Beach Lifestyle',
    subheading: 'Beach lifestyle in ' + AppSettings.appAreaName,
    imgPath: AppSettings.imgfolder+'home_experience_e.png',
    contentPath: AppSettings.getSMPSectionURL() + '/things-to-do/beach-lifestyle'
}, {
    title: 'Nature & Parks',
    subheading: 'Explore ' + AppSettings.appAreaName + '’s great outdoors',
    imgPath: AppSettings.imgfolder+'home_experience_c.png',
    contentPath: AppSettings.getSMPSectionURL() + '/things-to-do/nature-and-parks'
}, {
    title: 'Dining & Entertainment',
    subheading: 'Dining & entertainment in ' + AppSettings.appAreaName,
    imgPath: AppSettings.imgfolder+'home_experience_b.png',
    hideInSubSections: true,
    // hides this section from subsections as it has it's own section
    contentPath: AppSettings.getSMPSectionURL() + '/food-and-wine'
}, {
    title: 'Fashion & Shopping',
    subheading: 'Shopping in ' + AppSettings.appAreaName,
    imgPath: AppSettings.imgfolder+'home_experience_d.png',
    contentPath: AppSettings.getSMPSectionURL() + '/things-to-do/fashion-and-shopping'
}, {
    title: 'Arts & Culture',
    subheading: 'Best of arts and culture in ' + AppSettings.appAreaName,
    imgPath: AppSettings.imgfolder+'home_experience_a.png',
    contentPath: AppSettings.getSMPSectionURL() + '/things-to-do/arts,-culture'
}, {
    title: 'Family Holidays',
    subheading: 'Family travel in ' + AppSettings.appAreaName,
    imgPath: AppSettings.imgfolder+'home_experience_f.png',
    contentPath: AppSettings.getSMPSectionURL() + '/things-to-do/family-holidays'
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
        contentPath: AppSettings.getSMPSectionURL() + '/about-sydney'
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
        contentPath: AppSettings.getSMPSectionURL() + '/food-and-wine'
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
    title: 'Hire',
    group: 'Group 3',
    id: 'hireSection',
    firstPage: {
        title: 'Hire',
        collectionType: 'hire',
        xtype: 'searchPage'
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
                }, {
                    xtype: 'button',
                    html: "<span class='icon'></span><span>Events</span>",
                      cls: 'eventsHome',
                    action: 'changeSection',
                    sectionId: 'eventsSection'
                }, {
                    xtype: 'button',
                    html: "<span class='icon'></span><span>My Itinerary</span>",
                    cls: 'itineraryHome',
                    action: 'changeSection',
                    sectionId: 'myItinerarySection'
                }, {
                    xtype: 'button',
                    html: "<span class='icon'></span><span>Deals</span>",
                    cls: 'dealsHome',
                    action: 'changeSection',
                    sectionId: 'dealsSection'
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

