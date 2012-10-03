Ext.define('escape.utils.AppVars', {

    singleton: true,

    appName: 'DNSW Sydney Guide',
    currentSection: null,
    currentPage: null,
    childbrowser: null,
    // funnel back
    destinationWebpath: '/sydney/',
    searchURL: 'http://tnsw-search.squiz.net/s/search.html', //http://tnsw-search03.squiz.net/s/search.html', //http://search-demo-au.funnelback.com/s/search.html
    // destination ids
    destinationIds: '282;283;284;285;286;287;288;289;290;291;292;294;295;296;297;298;299;300;301;302;303;304;305;306;308;309;310;311;312;313;314;315;316;317;318;319;320;321;332;406;407;408;409;410;411;4177;4178;4179;4180;4181;4182;4188;4190',
    //All searches will only return results from inside this destinationnsw
    smartphoneCMSSection: 'sydney',
    smartphoneURL: 'http://www.destinationnsw.com.au/smartphoneapps/',
    // FACEBOOK settings
    facebook: {
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
    },
    // TWITTER settings
    twitter: {
        consumerKey: 'z04Kkl1zVF3HilGKLre4w',
        // REPLACE WITH YOUR CONSUMER_KEY
        consumerSecret: 'Cu5Qs3Kg2PUIAYqFfVg8VNHEZmzweEdFjphVo82HGA',
        // REPLACE WITH YOUR CONSUMER_SECRET
        callbackUrl: "http://www.visitnsw.com/"
        // YOUR URL
    },
    // The funnel back destination webpath. Used to match funnelback collections names to the matrix ones
    collectionMapping: [{
        name: 'Accommodation',
        funnelback: 'accom',
        matrix: 'accommodation'
    }, {
        name: 'Attraction',
        funnelback: 'attr',
        matrix: 'attraction'
    }, {
        name: 'Event',
        funnelback: 'event',
        matrix: 'event'
    }, {
        name: 'Hire',
        funnelback: 'hire',
        matrix: 'hire'
    }, {
        name: 'Restaurant',
        funnelback: 'restaurants',
        matrix: 'restaurant'
    }, {
        name: 'Tour',
        funnelback: 'tour',
        matrix: 'tour'
    }, {
        name: 'Visitor Centre',
        funnelback: 'centres',
        matrix: 'vic'
    }],

    getSMPSectionURL: function() {
        return this.smartphoneURL + this.smartphoneCMSSection;
    }
});