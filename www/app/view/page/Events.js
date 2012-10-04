Ext.define("escape.view.page.Events", {
    extend: 'escape.view.page.ContentPage',
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
    contentLoaded: function(content) {
        this.setContent(content);
        // Parse externalLinks
        content = escape.model.Content.process(content);
        this.buildPage();
    },
    //
    buildPage: function() {
        content = this.getContent();
        console.log(content);

        this.setItems([{
            xtype: 'segmentedbutton',
            layout: 'hbox',
            allowMultiple: false,
            allowDepress: false,
            docked: 'top',
            items: [{
                text: 'Featured',
                type: 'featured',
                pressed: true,
                flex: 1
            }, {
                text: 'this week',
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