Ext.define("escape.view.page.AlertSettings", {
    extend: 'escape.view.page.Page',
    xtype: 'alertSettingsPage',
    config: {
        pageTitle: 'Alerts',
        cls: 'alertSettingsPage',
        rightBtn: '',
        scrollable: false,
        padding: 0,
        IsPageBuilt: false,
        pageTypeId: 18,
        pageTrackingId: 18,
        feeds: [],
        layout: 'hbox'
    },
    openView: function() {
        // build the list of feed options
        var options = [];
        for (var i = 0; i < this.getFeeds().length; i++) {
            var feed = this.getFeeds()[i];
            options.push({
                label: feed.label,
                name: feed.label,
                xtype: 'togglefield',

                labelWidth: '60%',
                cls: 'switchOnOff ' +feed.label.split(' ').join('').toLowerCase(),
                value: (Boolean(feed.load)) ? 0 : 1
            });
        }
        // create the page items
        items = {
            xtype: 'formpanel',
            cls: 'options',
            padding: 10,
            flex:1,
            items: [{
                xtype: 'fieldset',
                instructions: 'Update your which alerts you would like to be shown',
                name:'feedOptions',
                items: options
            }]
        };
        // set the pages items
        this.setItems(items);
    }
});