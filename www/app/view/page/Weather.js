Ext.define("escape.view.page.Weather", {
    extend: 'escape.view.page.Page',
    xtype: 'weatherPage',
    requires: ['Ext.field.Select', 'Ext.field.Toggle', 'escape.view.ui.LoadError', 'escape.model.Weather'],
    translations: null,
    config: {
        cls: 'weatherPanel',
        rightBtn: 'refreshBtn',
        pageTitle: AppSettings.appAreaName + ' Weather',
        pageTypeId: 3,
        pageTrackingId: 3,
        layout: 'vbox',
        scrollable: {
            direction: 'vertical',
            directionLock: true
        }
    },
    openView: function() {
        this.getTheWeather(false);
        this.setNavTitle(this.getPageTitle());

    },
    getTheWeather: function(stationId) {
        if (stationId) {
            escape.model.Weather.stationId = stationId;
        }
        if (!Ext.device.Connection.isOnline()) {
            // show offline messgae
            var offlineHeight = window.innerHeight; // Set to window height
            this.setItems([{
                height: offlineHeight,
                xtype: 'offlineMessage'
            }]);
        } else {
            this.setItems({
                xtype: 'loadingDisplay'
            });
            // check to see if the product is a favourite or not
            var selfRef = this;
            escape.model.Weather.get({
                success: function(weather) {
                    selfRef.build(weather);
                },
                error: function(error) {
                    selfRef.setItems({
                        xtype: 'loadError'
                    });
                },
                scope: this
            });
        }
    },
    // build the weather page
    build: function(weather) {
        // console.log(weather);
        // get the weather model
        // var wm = escape.model.Weather;
        var stationId = escape.model.Weather.closestId;
        if (stationId === null) {
            stationId = AppSettings.weatherStations[0].stationId;
        }

        var weatherOptions = [];

        // var initStationValue = -1;
        // // build the weather locations
        var closesName = 'Closest';
        var closestName = escape.model.Weather.closestName;
        var closestId = escape.model.Weather.closestName;
        if (closestName) {
            closesName += ' (' + closestName + ')';
            weatherOptions.push({
                value: stationId,
                text: closesName
            });
        }
        // var weatherOptions = [];
        for (var i = 0; i < AppSettings.weatherStations.length; i++) {
            var station = AppSettings.weatherStations[i];
            if (station.name != closesName) {
                weatherOptions.push({
                    value: station.stationId,
                    text: station.name
                });
            }
        }
        console.log('Just Did', weather.siteId);
        console.log('Closest', stationId);

        var toggleValue = (escape.model.Weather.getIsDegrees()) ? 1 : 0;

        var forecast = [];
        for (var i = 1; i < weather.days.length; i++) {
            var day = weather.days[i];
            if ((day.max !== 999) && (day.min !== 999)) {
                if (day.max) {
                    day.display_max = day.max + '&deg;';
                } else {
                    day.display_max = '-';
                }
                if (day.min) {
                    day.display_min = day.min + '&deg;';
                } else {
                    day.display_min = '-';
                }
                forecast.push(day);
            }
        }

        var items = [{
            cls: 'todaysWeather icon_' + weather.days[0].icon,
            itemId: 'todaysWeather',
            padding: '20px 0 20px 20px',
            html: this.buildTodaysWeather(weather)
        }, {
            xtype: 'container',
            cls: 'options',
            items: [{
                xtype: 'togglefield',
                value: toggleValue
            }, {
                xtype: 'selectField',
                label: 'Location',
                name: 'location',
                labelAlign: 'top',
                options: weatherOptions,
                value: weather.siteId,
                width: Ext.Viewport.getSize().width - 140
            }]
        }, {
            xtype: 'container',
            cls: 'weatherForcast',
            itemId: 'weatherForcast',
            padding: '15px 15px',
            flex: 1,
            scrollable: {
                direction: 'horizontal',
                directionLock: true
            },
            items: [{
                xtype: 'dataview',
                width: 130 * forecast.length,
                itemId: 'weatherForcastContainer',
                defaults: {
                    cls: 'weatherDay'
                },
                scrollable: null,
                data: forecast,
                itemTpl: new Ext.XTemplate("<div class='dayinfo'><h2 class='day'>{day}</h2><h2>{term}</h2></div><div class='details icon_{icon}'><div class='extremes'><h3 class='high'>{display_max}</h3><h3 class='low'>{display_min}</h3></div>")
            }]
        }];
        this.setItems(items);
    },
    // switch tempature reading
    tempMeasureChange: function() {
        this.build(escape.model.Weather.convert());
    },
    // build todays weather
    buildTodaysWeather: function(weather) {
        var today = weather.days[0];
        var temp = weather.currentTemperature + '&deg;';
        if (weather.currentTemperature == -9999 || weather.currentTemperature === null) {
            temp = '-';
        }
        var todaysWeather = '<div class="info"><h1>' + temp + '</h1>';
        // check to see if the extremes are available
        if (today.high != 999 && today.low != 999) {
            var min = '-',
                max = '-';
            if (today.max) {
                max = today.max + '&deg;';
            }
            if (today.min) {
                min = today.min + '&deg;';
            }
            todaysWeather += '<div class="extremes"><h3 class="high">' + max + '</h3><h3 class="low">' + min + '</h3></div>';
        }
        var forcastDetails = today.forecast;
        if (forcastDetails.toLowerCase() == today.term) {
            forcastDetails = '';
        }

        todaysWeather += '<h2>' + today.term + '</h2><p>' + forcastDetails + '</p>';
        if (weather.rainFall != -9999) {
            todaysWeather += '<h4 class="rain">' + Math.round(weather.rainFall) + ' mm</h4>';
        }
        if (weather.windSpeedKmh != -9999) {
            todaysWeather += '<h4 class="wind">' + weather.windSpeedKmh + ' KM/H ' + weather.windDirection + '</h4></div>';
        }
        return todaysWeather;
    }
});