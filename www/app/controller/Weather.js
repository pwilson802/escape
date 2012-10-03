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
            'settingsPage togglefield': {
                change: 'tempChanges'
            }
        }
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
            this.getHomePage().showWeather();
        } catch (e) {

        }
    }
});