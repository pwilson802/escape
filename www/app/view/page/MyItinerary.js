Ext.define("escape.view.page.MyItinerary", {
    extend: 'escape.view.page.Page',
    xtype: 'myItineraryPage',
    requires: [],
    config: {
        pageTitle: 'My Itinerary',
        rightBtn: '',
         items: [{
            xtype: 'loadingDisplay'
        }],
        layout:'vbox'
    }
});

