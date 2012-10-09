AppSettings = {};
// The Tilt and Co App ID
AppSettings.AppID = 2;
// The Apps area shown to the user
AppSettings.appAreaName = 'Sydney';
// The Area of the app which is used for services and faclitices searches
AppSettings.appAddress = {
    state: 'nsw',
    suburb: 'sydney'
};
AppSettings.bounds = {
    "left": 150.55337081542,
    "bottom": -36.119202120384,
    "right": 151.80337081542,
    "top": -35.494202120384
};
// The detinations to perform all funnel back serches within
AppSettings.destinationWebpath = '/sydney/';
AppSettings.searchURL = 'http://tnsw-search.squiz.net/s/search.html';
// - dev url: http://tnsw-search03.squiz.net/s/search.html', // - live url http://tnsw-search.squiz.net/s/search.html
// matrix destination ids for this app
AppSettings.destinationIds = '282;283;284;285;286;287;288;289;290;291;292;294;295;296;297;298;299;300;301;302;303;304;305;306;308;309;310;311;312;313;314;315;316;317;318;319;320;321;332;406;407;408;409;410;411;4177;4178;4179;4180;4181;4182;4188;4190';
// The smartphone cms section
AppSettings.smartphoneCMSSection = 'sydney';
AppSettings.smartphoneURL = 'http://www.destinationnsw.com.au/smartphoneapps/';
// FACEBOOK settings
AppSettings.facebook = {
    clientId: "369207786488947",
    // FACEBOOK APP ID
    secret: "553933b85e84c3650f9b3a06ad5e023c",
    // FACEBOOK APP SECRET
    redirectUrl: "https://apps.facebook.com/dnswtesting/",
    // CHANGE THIS THE USER WILL SEE IT AFTER THEY LOGIN
    type: "user_agent",
    // LEAVE THIS
    display: "touch",
    // LEAVE THIS
    token: "fbToken" // OUR TOKEN KEEPER
};
// TWITTER settings
AppSettings.twitter = {
    consumerKey: 'z04Kkl1zVF3HilGKLre4w',
    // REPLACE WITH YOUR CONSUMER_KEY
    consumerSecret: 'Cu5Qs3Kg2PUIAYqFfVg8VNHEZmzweEdFjphVo82HGA',
    // REPLACE WITH YOUR CONSUMER_SECRET
    callbackUrl: "http://www.visitnsw.com/"
    // YOUR URL
};
AppSettings.getSMPSectionURL = function() {
    return AppSettings.smartphoneURL + AppSettings.smartphoneCMSSection;
};
// Points of Interests
AppSettings.pointsOfInterests = [{
    label:'Hospitals',
    keyword:'Hospitals'
},{
    label:'Police',
    keyword:'Police'
},{
    label:'Beaches',
    keyword:'Beaches'
},{
    label:'Lookouts',
    keyword:'Lookouts'
}];
// Weather
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
// Home Images
AppSettings.homeImgs = [{
    imagePath: 'resources/images/content/tnsw1086897-c.jpg',
    altText: 'Sydney Harbour by Hamilton Lund'
}, {
    imagePath: 'resources/images/content/tnsw1038472-c.jpg',
    altText: 'Bondi Baths by Sally Mayman'
}, {
    imagePath: 'resources/images/content/dnsw1147828-c.jpg',
    altText: 'Picnic at Mrs Macquarie\'s Chair by Pierre Toussaint'
}, {
    imagePath: 'resources/images/content/dnsw1116000-c1.jpg',
    altText: 'Sydney Harbour by Hamilton Lund'
}, {
    imagePath: 'resources/images/content/dnsw1377836-c.jpg',
    altText: 'Walsh Bay Piers by James Horan'
}];
// Things to do sections. This list is used on the home page as well and on the things to do page
AppSettings.attractionCats = [{
    title: 'Arts & Culture',
    subheading: 'Best of arts and culture in ' + AppSettings.appAreaName,
    imgPath: 'resources/images/home_experience_a.png',
    contentPath: AppSettings.getSMPSectionURL() + '/things-to-do/arts,-culture'
}, {
    title: 'Food & Wine',
    subheading: 'Food and wine in ' + AppSettings.appAreaName,
    imgPath: 'resources/images/home_experience_b.png',
    hideInSubSections: true,
    // hides this section from subsections as it has it's own section
    contentPath: AppSettings.getSMPSectionURL() + '/food-and-wine'
}, {
    title: 'Nature & Parks',
    subheading: 'Explore ' + AppSettings.appAreaName + '’s great outdoors',
    imgPath: 'resources/images/home_experience_c.png',
    contentPath: AppSettings.getSMPSectionURL() + '/things-to-do/nature-and-parks'
}, {
    title: 'Fashion & Shopping',
    subheading: 'Shopping in ' + AppSettings.appAreaName,
    imgPath: 'resources/images/home_experience_d.png',
    contentPath: AppSettings.getSMPSectionURL() + '/things-to-do/fashion-and-shopping'
}, {
    title: 'Beach Lifestyle',
    subheading: 'Beach lifestyle in ' + AppSettings.appAreaName,
    imgPath: 'resources/images/home_experience_e.png',
    contentPath: AppSettings.getSMPSectionURL() + '/things-to-do/beach-lifestyle'
}, {
    title: 'Family Holidays',
    subheading: 'Family travel in ' + AppSettings.appAreaName,
    imgPath: 'resources/images/home_experience_f.png',
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
        title: 'Sydney'
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
    title: 'Food & Wine',
    group: 'Group 2',
    id: 'foodAndWineSection',
    collectionType: 'restaurants',
    firstPage: {
        title: 'Food & Wine',
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
    title: 'Current ' + AppSettings.appAreaName + ' Weather',
    group: 'Group 4',
    id: 'currentWeather',
    firstPage: {
        title: AppSettings.appAreaName + ' Weather',
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
    group: 'Group 4',
    id: 'tranportSection',
    firstPage: {
        title: 'Transport Info',
        xtype: 'contentPage',
        contentPath: AppSettings.getSMPSectionURL() + '/transport-information'
    }

}, {
    title: 'Visitor Information Centres',
    group: 'Group 4',
    id: 'visitorInoSection',
    firstPage: {
        title: 'Visitor Information Centres',
        collectionType: 'vic',
        xtype: 'searchPage'
    }
}, {
    title: 'About Desination NSW',
    group: 'Group 4',
    id: 'aboutDNSWSection',
    firstPage: {
        title: 'About Desination NSW',
        xtype: 'contentPage',
        contentPath: AppSettings.getSMPSectionURL() + '/about-destination-nsw'
    }
}, {
    title: 'Other NSW Apps',
    group: 'Group 4',
    id: 'otherAppsSection',
    firstPage: {
        title: 'Other DNSW apps',
        xtype: 'contentPage',
        contentPath: AppSettings.getSMPSectionURL() + '/other-dnsw-apps'
    }
}, {
    title: 'Settings',
    group: 'Group 5',
    id: 'settingsSection',
    firstPage: {
        title: 'Settings',
        xtype: 'settingsPage'
    }
}]