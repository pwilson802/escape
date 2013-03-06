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
        layout: 'hbox',
        pageTypeId: 16,
        pageTrackingId: 16
    },
    //
    openView: function() {
        if (!Ext.device.Connection.isOnline()){
            // show offline messgae
            var offlineHeight = window.innerHeight;
            this.setItems([{height:offlineHeight, xtype:'offlineMessage'}]);
        } else {
            this.setItems([{
                xtype: 'segmentedbutton',
                layout: 'hbox',
                itemId: 'eventsSegmentedButton',
                allowMultiple: false,
                allowDepress: false,
                docked: 'top',
                items: [{
                    text: 'Featured Events',
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
    }
});