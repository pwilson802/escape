Ext.define("escape.view.page.Directions", {
    extend: 'escape.view.page.Page',
    xtype: 'directionsPage',
    requires: ['escape.view.ui.MapDisplay'],
    config: {
        pageTitle: 'Directions',
        rightBtn: '',
        address: null,
        latlon: null,
        mapDisplay: null,
         pageTypeId: 15,
        pageTrackingId: 15
    },
    openView: function() {
        var address = this.getAddress();
        var addressString = address.Street + ' ' + address.Suburb + ' ' + address.State + ' ' + address.Postcode;

        var mapDisplay = Ext.create('escape.view.ui.MapDisplay', {
            height: Ext.Viewport.getSize().height - 143,
            lat: Number(this.getLatlon()[0]),
            lon: Number(this.getLatlon()[1]),
            interaction: true,
            markerAtCenter: true
        });
        this.setMapDisplay(mapDisplay);

        this.setItems([{
            xtype: 'formpanel',
            layout: 'hbox',
            height: 100,
            padding: 0,
            items: [{
                xtype: 'container',
                layout: 'vbox',
                flex: 1,
                items: [{
                    xtype: 'button',
                    action: 'switchDirection',
                    flex: 1
                }]
            }, {
                xtype: 'container',
                layout: 'vbox',
                flex: 6,
                items: [{
                    xtype: 'textfield',
                    name: 'startLocation',
                    value: 'Current Location',
                    flex: 1
                }, {
                    xtype: 'textfield',
                    name: 'endLocation',
                    value: addressString,
                    flex: 1
                }]
            }, {
                xtype: 'container',
                layout: 'vbox',
                flex: 2,
                items: [{
                    xtype: 'button',
                    action: 'switchTranport',
                    flex: 1
                }, {
                    xtype: 'button',
                    action: 'route',
                    flex: 1
                }]
            }]
        }]);

        this.add(mapDisplay);
    }
});