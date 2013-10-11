Ext.define('escape.utils.GoogleAnalytics', {
    singleton: true,
    account: '',
    start: function($account) {
        this.account = $account;
        try {
            gaPlugin = window.plugins.gaPlugin;
            gaPlugin.init(this.registerSucess, this.registerError, this.account, 10);
        } catch (e) {}
    },
    registerSucess: function() {
        console.log('registerSucess');
    },
    registerError: function() {
        console.log('registerError');
    },
    trackEvent: function(pageCode, pageId, eventId) {
        var pageType = ['content', 'product', 'weather', 'currency', 'services', 'map', 'home', 'favourites', 'productList', 'productListType', 'search', 'settings', 'visitor information centers', 'itinerary', 'directions', 'events', 'things to do', 'alerts','otherapps','thingsToDoCatigories'];
        var eventsList = ['open', 'phone', 'email', 'share', 'map', 'directions', 'openURL', 'booking', 'share via email', 'share via facbook', 'share via twitter', 'add to favourites', 'remove from favourites', 'add to itinerary', 'remove from itineray'];
        var category = pageType[pageCode - 1];
        var eventType = eventsList[eventId - 1];
        var value = pageId;

        if (eventType == 'open') {
            var pagePath = category;
            if (category == 'content') {
                pagePath = value.split('smartphoneapps')[1];
            }
            if (category == 'product') {
                pagePath = value;
            }
            if (category == 'search') {
                if (value){
                    pagePath = 'search/'+value;
                }
            }
            if (pagePath){
                this.trackPage(pagePath);
            }
            
        }
        eventType = (eventType) ? eventType :  'na';
        category = (category) ? category : 'na';
        value = (value) ? value : 0;

        try {
            gaPlugin = window.plugins.gaPlugin;
            gaPlugin.trackEvent(this.trackEventSucess, this.trackEventFailure, category, eventType, 'value', value);
        } catch (e) {}
    },
    trackEventSucess: function() {
        console.log('trackEventSucess');
    },
    trackEventFailure: function() {
        console.log('trackEventFailure');
    },
    trackPage: function(page) {
        try {
            gaPlugin = window.plugins.gaPlugin;
            gaPlugin.trackPage(this.trackSucess, this.trackFailure, page);
        } catch (e) {
        	console.log('trackPage error');
        }
    },
    trackSucess: function() {
        console.log('trackSucess');
    },
    trackFailure: function() {
        console.log('trackFailure');
    }
});