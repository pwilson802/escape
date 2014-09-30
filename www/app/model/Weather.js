Ext.define("escape.model.Weather", {
    requires: ['Ext.DateExtras', 'escape.model.UserSettings'],
    singleton: true,
    lastUpdatedDate: null,
    lastBriefUpdatedDate: null,
    reloadIn: 1 * 60 * 15 * 1000,
    // time is in minliseconds set for 15 mins
    cache: null,
    lastUpdated: 0,
    weatherData: null,
    currentTemp: null,
    currentDate: null,
    forcatsByDay: [],
    todaysDate: null,
    translations: null,
    closestName: null,
    closestId: null,
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
        isDegrees: null,
        stationId: -1
    },
    getIconName: function(icon) {
        for (var i = this.weatherTerms.length - 1; i >= 0; i--) {
            var item = this.weatherTerms[i];
            if (item.icon === icon) {
                return item.term;
            }
        }
        return '';
    },
    //
    setUp: function(callback, scope) {
        // this.checkDegrees(callback, scope);
    },
    checkDegrees: function(callback, scope) {
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
    checkStation: function(callback, scope) {
        // Check to see if the user has picked a temp measurement
        var selfRef = this;
        escape.model.UserSettings.getSetting('weatherStationId', {
            success: function(stationId) {
                if (stationId) {
                    selfRef.setStationId(stationId);

                } else {
                    // no user isDegrees has been selected
                    selfRef.setStationId(0);
                }
                selfRef.setStationId(0);
                Ext.callback(callback.success, scope);
            },
            error: function(error) {
                // no user temp has been selected
                selfRef.setStationId(0);
                Ext.callback(callback.success, scope);
            },
            scope: this
        });
    },
    // called when degrees is updated
    updateIsDegrees: function(newValue, oldValue) {
        this.saveTempSettings(newValue);
    },
    // Save the users tempature setting degrees OR fahrenheit
    saveTempSettings: function(isDegrees) {
        escape.model.UserSettings.setSetting('isDegrees', String(isDegrees), {

            success: function(isDegrees) {},
            error: function(error) {},
            scope: this
        });
    },
    // called when degrees is updated
    updateStationId: function(newValue, oldValue) {
        this.saveStationId(newValue);
    },
    // Save the users stationId
    saveStationId: function(stationId) {
        escape.model.UserSettings.setSetting('weatherStationId', stationId, {
            success: function(stationId) {},
            error: function(error) {},
            scope: this
        });
    },
    // convert weather
    convertTempature: function(tempInDegrees) {
        if (this.getIsDegrees() === false) {
            return Math.round(tempInDegrees * 1.8 + 32);
        } else if (this.getIsDegrees() === true) {
            return Math.round((tempInDegrees - 32) / 1.8);
        }
        return tempInDegrees;
    },
    checkLocation: function(callback, scope) {
        var selfRef = this;
        if (this.getStationId() === 0) {
            Ext.device.Geolocation.getCurrentPosition({
                success: function(position) {
                    selfRef.loadWeather(position.coords.latitude, position.coords.longitude, callback, scope);
                },
                failure: function() {
                    selfRef.loadWeather(0, 0, callback, scope);
                }
            });
        } else {
            selfRef.loadWeather(0, 0, callback, scope);
        }
    },

    convert: function() {
        this.cache.currentTemperature = this.convertTempature(this.cache.currentTemperature);
        for (var i = this.cache.days.length - 1; i >= 0; i--) {
            if (this.cache.days[i].max) {
                this.cache.days[i].max = this.convertTempature(this.cache.days[i].max);
            }
            if (this.cache.days[i].min) {
                this.cache.days[i].min = this.convertTempature(this.cache.days[i].min);
            }
        }
        return this.cache;
    },
    distanceFormula: function(point1, point2) {
        return Math.sqrt(Math.pow((point1.lat - point2.lat), 2) + Math.pow((point1.lon - point2.lon), 2));
    },
    /*
    *   Get the users location if that was included in the options
    */
    get: function(callback, scope) {
        var selfRef = this;
        if (callback.getClosest && callback.getClosest === true) {
            Ext.device.Geolocation.getCurrentPosition({
                timeout : 10000,
                success: function(position) {
                    var userLocation = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    };
                    var closestStation = AppSettings.weatherStations[0].stationId;
                    var closestDistance = selfRef.distanceFormula(userLocation, AppSettings.weatherStations[0]);
                    var closestName = AppSettings.weatherStations[0].name;
                    for (var i = 1; i < AppSettings.weatherStations.length; i++) {
                        var distance = selfRef.distanceFormula(userLocation, AppSettings.weatherStations[i]);
                        if (distance < closestDistance) {
                            closestDistance = distance;
                            closestStation = AppSettings.weatherStations[i].stationId;
                            closestName = AppSettings.weatherStations[i].name;
                        }
                    }
                    selfRef.closestName = closestName;
                    selfRef.stationId = closestStation;
                    selfRef.closestId = closestStation;
                    selfRef.loadDegrees(callback, scope);
                },
                failure: function() {
                    selfRef.loadDegrees(callback, scope);
                }
            }, this);
        } else {
            selfRef.loadDegrees(callback, scope);
        }
    },
    loadDegrees: function(callback, scope) {
        var selfRef = this;
        if (this.getIsDegrees() === null) {
            this.checkDegrees({
                success: function() {
                    selfRef.doRequest(callback, scope);
                },
                scope: this
            });
        } else {
            selfRef.doRequest(callback, scope);
        }
    },
    doRequest: function(callback, scope) {
        var selfRef = this;

        // Make sure we actually have a reading for degree type

        // Use our cache if we can.
        // if (new Date() - this.lastUpdated < this.reloadIn && this.cache && callback.forceUpdate !== true) {
        //     console.log(this.getStationId(), this.cache);
        //     if (this.getStationId() == this.cache.siteId) {
        //         console.log('Use Cache');
        //         Ext.callback(callback.success, scope, [this.cache]);
        //         return;
        //     }
        // }
        var site = (selfRef.stationId) ? selfRef.stationId : AppSettings.weatherStations[0].stationId;
        // Get the weather
        Ext.Ajax.useDefaultXhrHeader = false;
        Ext.Ajax.request({
            url: 'http://services.tiltandco.net/weather/forecast',
            method: "GET",
            params: {
                "site": site,
                "nocache": new Date().getTime()
            },
            success: function(response) {
                var weatherData = JSON.parse(response.responseText);
                var day = new Date();
                for (var i = 0; i < weatherData.days.length; i++) {
                    weatherData.days[i].term = selfRef.getIconName(weatherData.days[i].icon); //weatherTerms[weatherData.days[i].icon].term;
                    weatherData.days[i].day = Ext.Date.dayNames[day.getDay()];
                    day.setDate(day.getDate() + 1);
                }
                selfRef.cache = weatherData;
                if (selfRef.getIsDegrees() === false) {
                    weatherData = selfRef.convert();
                }
                selfRef.setStationId(weatherData.siteId);
                selfRef.cache = weatherData;
                selfRef.lastUpdated = new Date();
                Ext.callback(callback.success, scope, [weatherData]);
            },
            failure: function() {
                Ext.callback(callback.error, scope);
            }
        });
    }
});