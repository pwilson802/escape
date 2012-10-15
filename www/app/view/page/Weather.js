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
        this.getTheWeather();
        this.setNavTitle(this.getPageTitle());

    },
    getTheWeather: function(refresh) {
        this.setItems({
            xtype: 'loadingDisplay'
        });
        // check to see if the product is a favourite or not
        var selfRef = this;
        escape.model.Weather.getFullWeather(refresh,{
            success: function() {
                selfRef.build();
            },
            error: function(error) {
                selfRef.setItems({
                    xtype: 'loadError'
                });
            },
            scope: this
        });
    },
    // build the weather page
    build: function() {
        // get the weather model
        var wm = escape.model.Weather;
        var stationId = wm.getStationId();
        var initStationValue = -1;
        // build the weather locations
        var closesName = 'Closest';
        if (stationId === 0) {
            closesName += ' (' + wm.weatherData.SiteName + ')';
        }
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
        var forcastItems = [];

        for (var f = 1; f < 8; f++) {
            var dayData = this.buildDayWeather(f);
            if (dayData) {
                forcastItems.push({
                    itemId: 'forecast' + f,
                    html: dayData
                });
            }

        }
        var toggleValue = (wm.getIsDegrees()) ? 1 : 0;
        //
        var items = [{
            //docked: 'top',
            cls: 'todaysWeather',
            itemId: 'todaysWeather',
            padding: '20px 0 20px 20px',
            html: this.buildTodaysWeather()
        }, {
            xtype: 'container',
            cls: 'options',
            //docked: 'top',
            items: [{
                xtype: 'togglefield',
                value: toggleValue
            }, {
                xtype: 'selectField',
                label: 'Location',
                name: 'location',
                labelAlign: 'top',
                options: weatherOptions,
                value: stationId
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
                xtype: 'container',
                width: 910,
                itemId: 'weatherForcastContainer',
                defaults: {
                    cls: 'weatherDay',
                    padding: '10px'
                },
                items: forcastItems
            }]
        }];

        this.setItems(items);
        this.tempMeasureChange();
    },
    // switch tempature reading
    tempMeasureChange: function() {
        // update today
        var todaysWeather = this.getComponent('todaysWeather');
        todaysWeather.setHtml(this.buildTodaysWeather());
        var wm = escape.model.Weather;
        var today = wm.forcatsByDay[0];
        var imagaeName = 'we_ico_' + today.icon + '_lge';
        if (escape.utils.Img.retinaAvailable()) {
            imagaeName = 'we_ico_' + today.icon + '_lge@2x';
        }
        //todaysWeather.setStyle('background-image:url(resources/images/' + imagaeName + '.png)');
        todaysWeather.addCls('icon_' + today.icon);
        // update forcast
        var weatherForcast = this.getComponent('weatherForcast');
        var weatherForcastContainer = weatherForcast.getComponent('weatherForcastContainer');
        for (var i = 1; i < 8; i++) {
            var day = weatherForcastContainer.getComponent('forecast' + i);
            if (day) {
                day.setHtml(this.buildDayWeather(i));
                var dayData = wm.forcatsByDay[i];
                imagaeName = 'we_ico_' + dayData.icon + '_med';
                if (escape.utils.Img.retinaAvailable()) {
                    imagaeName = 'we_ico_' + dayData.icon + '_med@2x';
                }
                // day.setStyle('background-image:url(resources/images/' + imagaeName + '.png)');
                day.addCls('icon_' + dayData.icon);
            }

        }
    },
    // build day weather
    buildDayWeather: function(dayId) {
        var wm = escape.model.Weather;
        var day = wm.forcatsByDay[dayId];
        var dayDate = new Date();
        dayDate.setDate(wm.todaysDate.getDate() + dayId);
        var dayOfTheWeek = dayDate.getDay();
        var dayName = Ext.Date.dayNames[dayOfTheWeek];
        if (day.high == 999 || day.low == 999) {
            return false;
        }
        //day.forecast
        var dayHTML = '<div class="dayinfo"><h2 class="day">' + dayName + '</h2><h2>' + wm.getIconName(day.icon) + '</h2></div><div class="details"><div class="extremes"><h3 class="high">' + wm.convertTempature(day.high) + '&deg;</h3><h3 class="low">' + wm.convertTempature(day.low) + '&deg;</h3></div>';
        return dayHTML;
    },
    // build todays weather
    buildTodaysWeather: function() {
        var wm = escape.model.Weather;
        var today = wm.forcatsByDay[0];
        var temp =wm.convertTempature(wm.currentTemp)+'&deg;';
        if (wm.currentTemp == -9999){
            temp = '-';
        }
        var todaysWeather = '<div class="info"><h1>' + temp + '</h1>';
        // check to see if the extremes are available
        if (today.high != 999 && today.low != 999) {
            todaysWeather += '<div class="extremes"><h3 class="high">' + temp + '&deg;</h3><h3 class="low">' + wm.convertTempature(today.low) + '&deg;</h3></div>';
        }
        var forcastDetails = today.forecast;
        if (forcastDetails.toLowerCase() == wm.getIconName(today.icon).toLowerCase()) {
            forcastDetails = '';
        }

        todaysWeather += '<h2>' + wm.getIconName(today.icon) + '</h2><p>' + forcastDetails + '</p>';
        if (wm.weatherData.RainFall != -9999) {
            todaysWeather += '<h4 class="rain">' + Math.round(wm.weatherData.RainFall)+ ' mm</h4>';
        }
        if (wm.weatherData.WindSpeedmps != -9999) {
            var windKm = MathExt.prototype.roundNumber(wm.weatherData.WindSpeedmps * (3.6),2);
            todaysWeather += '<h4 class="wind">' + windKm + ' KM/H ' + wm.weatherData.WindDirection + '</h4></div>';
        }


        return todaysWeather;
    }

});