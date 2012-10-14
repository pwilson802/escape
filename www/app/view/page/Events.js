Ext.define("escape.view.page.Events", {
    extend: 'escape.view.page.Page',
    xtype: 'eventsPage',
    config: {
        pageTitle: 'Events',
        cls: 'eventsPage',
        rightBtn: 'searchBtn',
        pageTrackingId: 0,
        scrollable: false,
        padding: 0,
        layout: 'hbox'
    },
    //
    openView: function() {

        this.setItems([{
            xtype: 'segmentedbutton',
            layout: 'hbox',
            allowMultiple: false,
            allowDepress: false,
            docked: 'top',
            items: [{
                text: 'Events Calender',
                type: 'eventsCalender',
                pressed: true,
                flex: 1
            }, {
                text: 'This week',
                type: 'weekly',
                flex: 1
            }]
        }, {
            xtype: 'container',
            itemId: 'contents',
            flex: 1,
            padding:'10',
            items: [{
                xtype: 'loadingDisplay'
            }]
        }]);
        this.fireEvent('built', this);
    }
});