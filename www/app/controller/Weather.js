Ext.define('escape.controller.Weather', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.Anim', 'escape.model.Weather'],
    config: {
        refs: {
            weatherPage: 'weatherPage',
            homePage: 'homePage'
        },
        control: {
            'weatherPage togglefield': {
                change: 'tempChanges'
            },
            'weatherPage selectField': {
                change: 'stationChanges'
            },
            'settingsPage #tempToggle': {
                change: 'tempChanges'
            },
            'settingsPage selectField': {
                change: 'stationChanges'
            },
            '#currentWeather button[cls="refreshBtn iconBtn"]': {
                tap: 'reloadWeather'
            },
            '#homeSection button[cls="refreshBtn iconBtn"]': {
                tap: 'reloadWeather'
            }
        }
    },
    reloadWeather: function() {
        this.getWeatherPage().getTheWeather();

    },
    // a language has been selected
    tempChanges: function() {
        if (escape.model.Weather.getIsDegrees()) {
            escape.model.Weather.setIsDegrees(false);
        } else {
            escape.model.Weather.setIsDegrees(true);
        }
        try {
            this.getWeatherPage().tempMeasureChange();
            // this.getHomePage().showWeather();
        } catch (e) {

        }
    },
    // a language has been selected
    stationChanges: function(field, newValue) {
        escape.model.Weather.setStationId(newValue.getData().value);
        try {
            this.getWeatherPage().getTheWeather(newValue.getData().value);
        } catch (e) {

        }
    }
});