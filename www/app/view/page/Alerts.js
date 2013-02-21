Ext.define("escape.view.page.Alerts", {
    extend: 'escape.view.page.Page',
    xtype: 'alertsPage',
    config: {
        pageTitle: 'Alerts',
        cls: 'alertsPage',
        rightBtn: 'editBtn',
        scrollable: false,
        padding: 0,
        IsPageBuilt: false,
        pageTypeId: 18,
        pageTrackingId: 18,
        layout: 'vbox',
        margin: '10px',
        items: [{
            xtype: 'loadingDisplay'
        }]
    },
    buildPage: function(featuresList) {
        console.log("Build page alerts");
        this.removeAll(true, true);
        this.setMargin(0);
        this.setIsPageBuilt(true);
        var items = [{
            xtype: 'container',
            layout: 'hbox',
            docked: 'top',
            items: [{
                xtype: 'segmentedbutton',
                layout: 'hbox',
                allowMultiple: false,
                allowDepress: false,
                flex: 4,
                
                items: [{
                    cls: 'listBtn',
                    type: 'list',
                    pressed: true,
                    flex: 1
                }, {
                    cls: 'mapBtn',
                    type: 'map',
                    flex: 1
                }]
            }, {
                xtype: 'button',
                cls: 'refreshBtn iconBtn',
                width: 45
            }]
        }, {
            xtype: 'container',
            itemId: 'cardView',
            layout: 'card',
            flex: 1
        }];
        this.setItems(items);
    }
});