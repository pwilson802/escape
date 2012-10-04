Ext.define("escape.model.Weather", {
    requires: ['Ext.DateExtras', 'escape.model.UserSettings'],
    singleton: true,
    lastUpdatedDate: null,
    lastBriefUpdatedDate: null,
    reloadIn: 1 * 60 * 15 * 1000,
    // time is in minliseconds set for 15 mins
    currentTemp: null,
    currentDate: null,
    forcatsByDay: [],
    todaysDate: null,
    translations: null,
    weatherTerms: [{
        icon: 1,
        term: 'Sunny'
    }, {
        icon: 2,
        term: 'Clear'
    }, {
        icon: 3,
        term: 'Partly cloudy'
    }, {
        icon: 4,
        term: 'Cloudy'
    }, {
        icon: 6,
        term: 'Hazy'
    }, {
        icon: 8,
        term: 'Light rain'
    }, {
        icon: 9,
        term: 'Windy'
    }, {
        icon: 10,
        term: 'Fog'
    }, {
        icon: 11,
        term: 'Shower'
    }, {
        icon: 12,
        term: 'Rain'
    }, {
        icon: 13,
        term: 'Dusty'
    }, {
        icon: 14,
        term: 'Frost'
    }, {
        icon: 15,
        term: 'Snow'
    }, {
        icon: 16,
        term: 'Storm'
    }, {
        icon: 17,
        term: 'Light shower'
    }],

    config: {
        isDegrees: null
    },
    getIconName : function(icon){
        for (var i = this.weatherTerms.length - 1; i >= 0; i--) {
           var item = this.weatherTerms[i];
           if (item.icon === icon){
                return item.term;
           }
        }
        return '';
    },
    //
    setUp: function(callback, scope) {
        // Check to see if the user has picked a temp measurement
        var selfRef = this;
        escape.model.UserSettings.getSetting('isDegrees', {
            success: function(isDegrees) {
                if (isDegrees === null) {
                    // no user isDegrees has been selected
                    selfRef.setIsDegrees(true);
                } else {
                    var setting = true;
                    if (isDegrees == 'false') {
                        setting = false;
                    }
                    if (isDegrees === 0) {
                        setting = false;
                    }
                    selfRef.setIsDegrees(setting);
                }
                Ext.callback(callback.success, scope);
            },
            error: function(error) {
                // no user temp has been selected
                selfRef.setIsDegrees(true);
                Ext.callback(callback.success, scope);
            },
            scope: this
        });
    },
    // Save the users tempature setting degrees OR fahrenheit
    saveTempSettings: function(isDegrees) {
        escape.model.UserSettings.setSetting('isDegrees', String(isDegrees), {

            success: function(isDegrees) {
            },
            error: function(error) {
            },
            scope: this
        });
    },
    // called when degrees is updated
    updateIsDegrees: function(newValue, oldValue) {
        this.saveTempSettings(newValue);
    },

    // convert weather
    convertTempature: function(tempInDegrees) {
        if (this.getIsDegrees() === false) {
            return Math.round(tempInDegrees * 1.8 + 32);
        }
        return tempInDegrees;
    },
    // check to see if the weather needs to be loaded
    getFullWeather: function(callback, scope) {
        if (this.getIsDegrees() === null) {
            // the weather has not been set up
            var selfRef = this;
            this.setUp({
                success: function() {
                    selfRef.getFullWeather(callback, scope);
                },
                error: function(error) {
                    Ext.callback(callback.success, scope);
                },
                scope: this
            });
        } else {
            // load the full weather
            if (this.loadedDate === null) {
                this.loadWeather(callback, scope);
            } else {
                var dateNow = new Date();
                var diff = dateNow - this.lastUpdatedDate;
                console.log(this.reloadIn);
                console.log(diff);
                console.log(this.lastUpdatedDate);
                console.log(this.forcatsByDay.length);
                if (diff > this.reloadIn || this.forcatsByDay.length <= 1) {
                    // reload the current data is old or the fullweather has not been loaded
                    this.loadWeather(callback, scope);
                } else {
                    // do not reload use the current data
                    Ext.callback(callback.success, scope);
                }
            }
        }

    },
    // Loads the full weather including the forcasts
    loadWeather: function(callback, scope) {
        console.log('loadWeather');
        var selfRef = this;
        // load the waeather
        Ext.Ajax.useDefaultXhrHeader = false;
        Ext.Ajax.request({
            headers: {
                'Content-Type': 'application/json'
            },
            url: 'http://ws2.tiltandco.net/RestServiceImpl.svc/Weather',
            method: "POST",
            jsonData: {
                "StationID": "517",
                "Latitude": "0",
                "Longitude": "0",
                "RegID": "1"
            },
            success: function(response) {
                var weatherData = JSON.parse(Ext.decode(response.responseText));
                // process server response here
                selfRef.fullWeatherLoaded(weatherData, callback, scope);
            },
            failure: function(response, opts) {
                Ext.callback(callback.error, scope);
            }
        });
    },
    fullWeatherLoaded: function(weatherData, callback, scope) {
        console.log(weatherData);
        this.todaysDate = new Date( parseInt( weatherData.Date.substr(6) ) );
        this.currentTemp = weatherData.TempCurrent;
        var forcasts = [];
        for (var i = 0; i < 8; i++) {
            forcasts.push({
                high: weatherData['max_' + i],
                low: weatherData['min_' + i],
                forecast: weatherData['forecast_' + i],
                icon: weatherData['icon_' + i]
            });
        }
        this.forcatsByDay = forcasts;
        this.lastUpdatedDate = new Date();
        Ext.callback(callback.success, scope);
    },
    // check to see if the weather needs to be loaded
    getBriefWeather: function(callback, scope) {
        if (this.getIsDegrees() === null) {
            // the weather has not been set up
            var selfRef = this;
            this.setUp({
                success: function() {
                    selfRef.getBriefWeather(callback, scope);
                },
                error: function(error) {
                    Ext.callback(callback.error, scope);
                },
                scope: this
            });
        } else {
            // load the brief weather
            if (this.loadedDate === null) {
                this.loadBriefWeather(callback, scope);
            } else {
                var dateNow = new Date();
                var diff = dateNow - this.lastBriefUpdatedDate;
                if (diff > this.reloadIn) {
                    // reload the current data is old
                    this.loadBriefWeather(callback, scope);
                } else {
                    // do not reload use the current data
                    Ext.callback(callback.success, scope);
                }
            }
        }

    },
    // load a small weather packet for the home page
    loadBriefWeather: function(callback, scope) {
        //http://ws2.tiltandco.net/RestServiceImpl.svc/WeatherBrief
        var selfRef = this;
        // load the waeather
        Ext.Ajax.useDefaultXhrHeader = false;
        Ext.Ajax.request({
            headers: {
                'Content-Type': 'application/json'
            },
            url: 'http://ws2.tiltandco.net/RestServiceImpl.svc/WeatherBrief',
            method: "POST",
            jsonData: {
                "StationID": "517",
                "Latitude": "0",
                "Longitude": "0",
                "RegID": "1"
            },
            success: function(response) {
                var weatherData = JSON.parse(Ext.decode(response.responseText));
                // process server response here
                selfRef.breifWeatherLoaded(weatherData, callback, scope);
            },
            failure: function(response, opts) {
                Ext.callback(callback.error, scope);
            }
        });
    },
    breifWeatherLoaded: function(weatherData, callback, scope) {
        this.currentTemp = weatherData.TempCurrent;
        var forcasts = [];
        if (forcasts.length === 0) {
            forcasts.push({
                forecast: weatherData.Forecast,
                icon: weatherData.Icon
            });
        } else {
            forcasts[0].forecast = weatherData.Forecast;
            forcasts[0].icon = weatherData.Icon;
        }

        this.forcatsByDay = forcasts;
        this.lastBriefUpdatedDate = new Date();
        Ext.callback(callback.success, scope);
        //
    }


});