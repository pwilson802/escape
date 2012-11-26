Ext.define("escape.view.page.Settings", {
    extend: 'escape.view.page.Page',
    xtype: 'settingsPage',
    requires: ['Ext.form.Panel', 'escape.model.Weather', 'Ext.field.Radio', 'escape.controller.Settings', 'Ext.form.Panel'],
    config: {
        pageTitle: 'Settings',
        cls: 'settings',
        rightBtn: 'hide',
        pageTypeId: 12,
        pageTrackingId: 0,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        items: [{
            xtype: 'loadingDisplay'
        }]
    },
    openView: function() {

        var items = [];
        //
        var wm = escape.model.Weather;
        var stationId = wm.getStationId();
        var initStationValue = -1;
        // build the weather locations
        var closesName = 'Closest';
        var weatherOptions = [{
            value: 0,
            text: closesName
        }];
        for (var i = 0; i < AppSettings.weatherStations.length; i++) {
            var station = AppSettings.weatherStations[i];
            weatherOptions.push({
                value: station.stationId,
                text: station.name
            });
        }
        // Tempuature
        var tempToggleValue = (escape.model.Weather.getIsDegrees()) ? 1 : 0;
        var offlineToggleValue = (escape.model.Content.getUseOffline()) ? 1 : 0;
        var offlineMapsToggleValue = (escape.model.Map.getUseOffline()) ? 0 : 1;
        items.push({
            xtype: 'container',
            cls: 'options',
            items: [{
                xtype: 'fieldset',
                title: 'Weather',
                instructions: 'Update your weather settings',
                items: [{
                    label: 'Temperature',
                    labelWidth: '60%',
                    xtype: 'togglefield',
                    itemId:'tempToggle',
                    value: tempToggleValue
                }, {
                    xtype: 'selectField',
                    labelWidth: '50%',
                    label: 'Location',
                    name: 'location',
                    options: weatherOptions,
                    value: stationId
                }]
            }, {
                xtype: 'fieldset',
                title: 'Offline content',
                cls:'switchOnOff',
                instructions: 'Controls the use offline content',
                items: [{
                    label: 'Use offline content',
                    labelWidth: '60%',
                    xtype: 'togglefield',
                    itemId:'offlineContent',
                    value: offlineToggleValue
                },{
                    label: 'Online Maps',
                    labelWidth: '60%',
                    xtype: 'togglefield',
                    itemId:'offlineMap',
                    value: offlineMapsToggleValue
                }]
            }, {
                xtype: 'fieldset',
                title: 'Cache',
                instructions: 'Controls the use of content saved to your phone as you browse the app',
                items: [{
                    text: 'Clear Cache',
                    cls:'reset',
                    xtype: 'button',
                    action: 'clearCache'
                }]
            }]
        });
        ///
        this.setItems({
            xtype: "container",
            padding: '10px',
            items: items
        });
    }
});