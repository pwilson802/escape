Ext.define("escape.view.page.Home", {
    extend: 'escape.view.page.Page',
    xtype: 'homePage',
    requires: ['Ext.Img', 'Ext.carousel.Carousel', 'escape.view.ui.AppImage', 'escape.view.ui.WeatherBtn'],
    config: {
        cls: 'homePage',
        addToItemId: 1,
        rightBtn: 'searchBtn',
        title: AppSettings.appAreaName,
        pageTypeId: 7,
        pageTrackingId: 7,
        //<h4>Destination Guide</h4>,
        homeBuilt: false,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        items: [{
            xtype: 'loadingDisplay'
        }],
        listeners: {
            activate: 'checkOpened'
        }
    },
    checkOpened: function() {
        this.setNavTitle(this.getPageTitle());
        this.openView();
    },
    closeView: function() {
        // this.setHomeBuilt(false);
        // this.removeAll(true,true);
        this.removeWeatherBtn();
    },
    reOpenView: function() {
        this.showWeather();
    },

    openView: function() {
        if (!this.getHomeBuilt()) {
            this.setHomeBuilt(true);
            var screenWidth = Ext.Viewport.getSize().width;

            var thingsToDoCats = [];
            for (var i = 0; i < AppSettings.attractionCats.length; i++) {
                var cat = AppSettings.attractionCats[i];
                cat.number = i + 1;
                thingsToDoCats.push(cat);
            }
            this.setItems([{
                xtype: 'carousel',
                height: 200,
                defaults: {
                    xtype: 'appImage',
                    width: screenWidth,
                    height: 200
                },
                items: AppSettings.homeImgs
            }, {
                cls: 'badge',
                html: '',
                top: 40,
                left: 15,
                zIndex: 15
            }, {
                xtype: 'container',
                cls: 'btnsContainer',
                items: AppSettings.homeMenu
            }, {
                xtype: 'list',
                itemId: 'thingsToDoList',
                itemTpl: '<div><span>{number}</span><h3>{title}</h3><h4>{subheading}</h4></div><div class="img" style="background-image:url({imgPath})"></div>',
                cls: 'imgList numberedList homeList',
                scrollable: false,
                data: thingsToDoCats
            }, {
                xtype: 'footer'
            }]);
            // load the brief weather
            var selfRef = this;

            escape.model.Weather.getBriefWeather({
                success: function() {
                    selfRef.showWeather();
                },
                error: function(error) {},
                scope: this
            });
            escape.model.Weather.get({
                success: function(weather) {
                    console.log(weather);
                },
                error: function() {},
                scope: this,
                forceUpdate: false
            });
        }
    },
    showWeather: function() {
        var currenctSection = escape.utils.AppVars.currentSection;
        var currentPage = escape.utils.AppVars.currentPage;
        // make sure we are in the home section
        if (currentPage.config.xtype == 'homePage') {
            // var wm = escape.model.Weather;
            var today = escape.model.Weather.forcatsByDay[0];
            if (today) {
                // get the weather btn
                var weatherBtn = currenctSection.getComponent('weatherBtn');
                // if does not exist so create it
                if (!weatherBtn) {
                    weatherBtn = currenctSection.add({
                        xtype: 'button',
                        cls: 'weatherBtn iconBtn',
                        action: 'showWeather',
                        itemId: 'weatherBtn',
                        top: -2,
                        right: 36,
                        width: 40,
                        zIndex: 10
                    });
                }
                // set the icon
                var imagaeName = 'we_ico_' + today.icon + '_sml';
                if (escape.utils.Img.retinaAvailable()) {
                    imagaeName = 'we_ico_' + today.icon + '_sml@2x';
                }
                weatherBtn.setStyle('background-image:url(' + AppSettings.regionImagePath + '' + imagaeName + '.png)');
            }

        }
    },
    removeWeatherBtn: function() {
        var currenctSection = escape.utils.AppVars.currentSection;
        if (currenctSection) {
            var weatherBtn = currenctSection.getComponent('weatherBtn');
            if (weatherBtn) {
                currenctSection.remove(weatherBtn, true);
            }
        }
    }
});

// {
//                 xtype: 'container',
//                 cls: 'btnsHomeContainer',
//                 itemId: 'btnsHomeContainer',
//                 items: [{
//                     xtype: 'button',
//                     text: "",
//                     cls: 'weatherHome',
//                     itemId: 'weatherHome',
//                     action: 'showWeather'
//                 }, {
//                     xtype: 'button',
//                     text: "Deals",
//                     cls: 'tipsHome',
//                     action: 'changeSection',
//                     sectionId: 'dealsSection'
//                 }]
//             }