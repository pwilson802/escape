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
        var toggleValue = (escape.model.Weather.getIsDegrees()) ? 1 : 0;
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
                    value: toggleValue
                }, {
                    xtype: 'selectField',
                    labelWidth: '50%',
                    label: 'Location',
                    name: 'location',
                    options: weatherOptions,
                    value: stationId
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