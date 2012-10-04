AppSettings = {};
AppSettings.appAreaName = 'Sydney';
AppSettings.destinationWebpath = '/sydney/';
AppSettings.searchURL = 'http://tnsw-search.squiz.net/s/search.html';
//http://tnsw-search03.squiz.net/s/search.html', //http://search-demo-au.funnelback.com/s/search.html
// destination ids
AppSettings.destinationIds = '282;283;284;285;286;287;288;289;290;291;292;294;295;296;297;298;299;300;301;302;303;304;305;306;308;309;310;311;312;313;314;315;316;317;318;319;320;321;332;406;407;408;409;410;411;4177;4178;4179;4180;4181;4182;4188;4190';
//All searches will only return results from inside this destinationnsw
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
// Things to do sections. This list is used on the home page as well and on the things to do page
AppSettings.attractionCats = [{
    title: 'Arts & Culture',
    subheading: 'Best of arts and culture in Sydney',
    imgPath: 'resources/images/home_experience_a.png',
    contentPath: AppSettings.getSMPSectionURL() + '/things-to-do/arts,-culture'
}, {
    title: 'Food & Wine',
    subheading: 'Food and wine in Sydney',
    imgPath: 'resources/images/home_experience_b.png',
    hideInSubSections: true, // hides this section from subsections as it has it's own section
    contentPath: AppSettings.getSMPSectionURL() + '/food-and-wine'
}, {
    title: 'Nature & Parks',
    subheading: 'Explore Sydney’s great outdoors',
    imgPath: 'resources/images/home_experience_c.png',
    contentPath: AppSettings.getSMPSectionURL() + '/things-to-do/nature-and-parks'
}, {
    title: 'Fashion & Shopping',
    subheading: 'Shopping in Sydney',
    imgPath: 'resources/images/home_experience_d.png',
    contentPath: AppSettings.getSMPSectionURL() + '/things-to-do/fashion-and-shopping'
}, {
    title: 'Beach Lifestyle',
    subheading: 'Beach lifestyle in Sydney',
    imgPath: 'resources/images/home_experience_e.png',
    contentPath: AppSettings.getSMPSectionURL() + '/things-to-do/beach-lifestyle'
}, {
    title: 'Family Holidays',
    subheading: 'Family travel in sydney',
    imgPath: 'resources/images/home_experience_f.png',
    contentPath: AppSettings.getSMPSectionURL() + '/things-to-do/family-holidays'
}];