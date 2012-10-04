Ext.define("escape.view.page.Weather", {
    extend: 'escape.view.page.Page',
    xtype: 'weatherPage',
    requires: ['Ext.field.Select', 'Ext.field.Toggle', 'escape.view.ui.LoadError', 'escape.model.Weather'],
    translations: null,
    config: {
        cls: 'weatherPanel',
        pageTitle: AppSettings.appAreaName + ' Weather',
        rightBtn: 'hide',
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
        this.setItems({
            xtype: 'loadingDisplay'
        });

    },
    getTheWeather: function() {
        // check to see if the product is a favourite or not
        var selfRef = this;
        escape.model.Weather.getFullWeather({
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
        var wm = escape.model.Weather;
        var forcastItems = [];

        for (var i = 1; i < 8; i++) {
            forcastItems.push({
                itemId: 'forecast' + i,
                html: this.buildDayWeather(i)
            });
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
                labelAlign:'top',
                options: [{
                    text: 'Sydney',
                    value: -1
                }]
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
            day.setHtml(this.buildDayWeather(i));
            var dayData = wm.forcatsByDay[i];
            imagaeName = 'we_ico_' + dayData.icon + '_med';
            if (escape.utils.Img.retinaAvailable()) {
                imagaeName = 'we_ico_' + dayData.icon + '_med@2x';
            }
            // day.setStyle('background-image:url(resources/images/' + imagaeName + '.png)');
            day.addCls('icon_' + dayData.icon);
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

        //day.forecast
        var dayHTML = '<div class="dayinfo"><h2 class="day">' + dayName + '</h2><h2>' + wm.getIconName(day.icon) + '</h2></div><div class="details"><div class="extremes"><h3 class="high">' + wm.convertTempature(day.high) + '&deg;</h3><h3 class="low">' + wm.convertTempature(day.low) + '&deg;</h3></div>';
        return dayHTML;
    },
    // build todays weather
    buildTodaysWeather: function() {
        var wm = escape.model.Weather;
        var today = wm.forcatsByDay[0];
        var todaysWeather = '<div class="info"><h1>' + wm.convertTempature(wm.currentTemp) + '&deg;</h1>';
        // check to see if the extremes are available
        //if (today.high != 999 && today.low != 999) {
        todaysWeather += '<div class="extremes"><h3 class="high">' + wm.convertTempature(today.high) + '&deg;</h3><h3 class="low">' + wm.convertTempature(today.low) + '&deg;</h3></div>';
        // }
        todaysWeather += '<h2>' + wm.getIconName(today.icon) + '</h2><p>' + today.forecast + '</p>';
        todaysWeather += '<h4 class="rain">12mm</h4><h4 class="wind">45km/h NNE</h4></div>';
        return todaysWeather;
    }

});