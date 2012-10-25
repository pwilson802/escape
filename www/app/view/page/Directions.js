Ext.define("escape.view.page.Directions", {
    extend: 'escape.view.page.Page',
    xtype: 'directionsPage',
    requires: ['escape.view.ui.MapDisplay'],
    config: {
        pageTitle: 'Directions',
        cls: 'directionsPage',
        rightBtn: '',
        layout: 'vbox',
        hasInputs: true,
        mapDisplay: null,
        address: {
            Street: '21 Margaret Street',
            Suburb: 'Fairlight',
            State: 'NSW',
            Postcode: 2094
        },
        latlon: [-33.947763, 151.09972],
        pageTypeId: 15,
        pageTrackingId: 15
    },
    openView: function() {
        var address = this.getAddress();
        var addressString = address.Street + ' ' + address.Suburb + ' ' + address.State + ' ' + address.Postcode;

        var mapDisplay = Ext.create('escape.view.ui.MapDisplay', {
            itemId: 'mapDisplay',
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
            scrollable: false,
            height: 100,
            padding: 6,
            items: [{
                xtype: 'container',

                layout: 'vbox',
                width: 45,
                items: [{
                    xtype: 'button',
                    cls: 'switchDirection',
                    action: 'switchDirection',
                    width: 41,
                    height: 41,
                    margin: '20px 0 0 0'
                }]
            }, {
                xtype: 'container',
                padding: '0 6px',
                flex: 6,
                items: [{
                    xtype: 'textfield',
                    name: 'startLocation',
                    value: 'Current Location',
                    label: 'Start:',
                    margin: '0 0 6px 0',
                    labelWidth: 55,
                    height: 41
                }, {
                    xtype: 'textfield',
                    name: 'endLocation',
                    value: addressString,
                    labelWidth: 55,
                    label: 'End:',
                    height: 41
                }]
            }, {
                xtype: 'container',
                width: 75,
                items: [{
                    xtype: 'button',
                    action: 'switchTranport',
                    cls: 'car',
                    height: 41,
                    margin: '0 0 6px 0'
                }, {
                    xtype: 'button',
                    action: 'route',
                    cls: 'search',
                    text: 'Route',
                    height: 41
                }]
            }]
        }, {
            xtype: 'segmentedbutton',
            layout: 'hbox',
            allowMultiple: false,
            allowDepress: false,
            bottom: 10,
            right: 10,
            width: 80,
            height: 41,
            zIndex: 1000,
            items: [{
                cls: 'mapBtn',
                type: 'map',
                pressed: true,
                flex: 1
            }, {
                cls: 'listBtn',
                type: 'list',
                flex: 1
            }]
        }, {
            xtype: 'container',
            layout: 'card',
            itemId: 'cardLayout',
            flex: 1

        }]);

        this.getComponent('cardLayout').add(mapDisplay);
        this.getComponent('cardLayout').add({
            xtype: 'container',
            padding: '10px 10px 60px 10px',
            itemId: 'listDisplay',
            cls:'directionsList',
            html: '<h1>No route created</h1>',
            scrollable: {
                direction: 'vertical',
                directionLock: true
            }
        });
    }
});