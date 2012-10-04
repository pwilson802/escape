Ext.define("escape.view.page.Home", {
    extend: 'escape.view.page.Page',
    xtype: 'homePage',
    requires: ['Ext.Img', 'Ext.carousel.Carousel', 'escape.view.ui.AppImage', 'escape.view.ui.WeatherBtn'],
    config: {
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
        // var task = new Ext.util.DelayedTask(function() {
        //     this.openView();
        // }, this);
        // task.delay(1000);
        this.openView();
    },




    openView: function() {
        if (!this.getHomeBuilt()) {
            this.setHomeBuilt(true);
            var screenWidth = Ext.Viewport.getSize().width;

            var thingsToDoCats = [];
            for (var i = 0; i < AppSettings.attractionCats.length; i++) {
                var cat = AppSettings.attractionCats[i];
                cat.number = i+1;
                thingsToDoCats.push(cat);
            }


            this.setItems([{
                cls: 'badge',
                html: ''
            }, {
                xtype: 'carousel',
                layout: 'fit',

                height: 200,
                defaults: {
                    xtype: 'appImage',
                    width: screenWidth,
                    height: 200
                },
                items: [{
                    imagePath: 'resources/images/content/tnsw1086897-c.jpg',
                    altText: 'Sydney Harbour by Hamilton Lund'
                }, {
                    imagePath: 'resources/images/content/tnsw1038472-c.jpg',
                    altText: 'Bondi Baths by Sally Mayman'
                }, {
                    imagePath: 'resources/images/content/dnsw1147828-c.jpg',
                    altText: 'Picnic at Mrs Macquarie\'s Chair by Pierre Toussaint'
                }, {
                    imagePath: 'resources/images/content/dnsw1116000-c1.jpg',
                    altText: 'Sydney Harbour by Hamilton Lund'
                }, {
                    imagePath: 'resources/images/content/dnsw1377836-c.jpg',
                    altText: 'Walsh Bay Piers by James Horan'
                }]
            }, {
                xtype: 'container',
                cls: 'btnsHomeContainer',
                itemId: 'btnsHomeContainer',
                items: [{
                    xtype: 'button',
                    text: "",
                    cls: 'weatherHome',
                    itemId: 'weatherHome',
                    action: 'showWeather'
                }, {
                    xtype: 'button',
                    text: "Deals",
                    cls: 'tipsHome',
                    action: 'changeSection',
                    sectionId: 'dealsSection'
                }]
            }, {
                xtype: 'container',
                cls: 'btnsContainer',
                items: [{
                    xtype: 'button',
                    text: "My Itinerary",
                    cls: 'intinerayHome',
                    action: 'changeSection',
                    sectionId: 'myItinerarySection'
                }, {
                    xtype: 'button',
                    text: "My Favourites",
                    cls: 'favouritesHome',
                    action: 'changeSection',
                    sectionId: 'myFavouritesSection'
                }, {
                    xtype: 'button',
                    text: "Accomodation",
                    action: 'changeSection',
                    sectionId: 'accommodationSection'
                }, {
                    xtype: 'button',
                    text: "Events",
                    action: 'changeSection',
                    sectionId: 'eventsSection'
                }]
            }, {
                xtype: 'list',
                margin: '10 10 20 10',
                itemId: 'thingsToDoList',
                itemTpl: '<div><span>{number}</span><h3>{title}</h3><h4>{subheading}</h4></div><div class="img" style="background-image:url({imgPath})"></div>',
                cls: 'imgList numberedList',
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
        }
    },
    showWeather: function() {
        var wm = escape.model.Weather;
        var btnsHomeContainer = this.getComponent('btnsHomeContainer');
        var todaysWeather = btnsHomeContainer.getComponent('weatherHome');
        var today = wm.forcatsByDay[0];
        var imagaeName = 'we_ico_' + today.icon + '_sml';
        if (escape.utils.Img.retinaAvailable()) {
            imagaeName = 'we_ico_' + today.icon + '_sml@2x';
        }
        //todaysWeather.setStyle('background-image:url(resources/images/' + imagaeName + '.png)');
        todaysWeather.addCls('icon_' + today.icon);
        todaysWeather.setText('<h2>' + wm.convertTempature(wm.currentTemp) + '&deg;</h2><h4>' + today.forecast + '</h4>');
    }
});