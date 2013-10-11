Ext.define('escape.controller.GlobalActions', {
    requires: ['escape.utils.AppVars', 'escape.view.page.Weather', 'escape.view.page.Search', 'escape.view.page.Directions', 'escape.view.page.MapTerms'],
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            mainView: 'mainView',
            searchPage: 'searchPage',
            weatherPage: 'weatherPage',
            mask: 'section mask'
        },
        control: {
            'slidenavigationview': {
                menuOpened: 'menuOpened',
                menuClosed: 'menuClosed'
            },
            'section mask': {
                tap: 'closeMenu',
                swipe: 'closeMenu'
            },
            'page button[action=showMenu]': {
                tap: 'showMenu'
            },
            'section button[action=showMenu]': {
                tap: 'showMenu'
            },
            'section button[action=scrollToTop]': {
                tap: 'scrollTopTop'
            },
            'section button[cls="searchBtn iconBtn"]': {
                tap: 'showSearch'
            },
            // 'section button[cls="searchBar iconBar"]': {
            //     tap: 'showSearch'
            // },
            'section button[action=getDirections]': {
                tap: function(btn) {
                    this.showDirections(btn.config.address, btn.config.latlon);
                }
            },
            'section button[action=makePhoneCall]': {
                tap: function(btn) {
                    this.makePhoneCall(btn.config.phoneNumber);
                }
            },
            'section button[action=addToCalender]': {
                tap: function(btn) {
                    this.addToCalender(btn.getData());
                }
            },
            'section button[action=sendEmail]': {
                tap: function(btn) {
                    this.sendEmail(btn.config.emailAddress);
                }
            },
            'section button[action=goToLink]': {
                tap: function(btn) {
                    this.goToLink(btn.config.linkURL);
                }
            },
            'section button[action=makeBooking]': {
                tap: function(btn) {
                    this.makeBooking(btn.config.bookingURL);
                }
            },
            'section list[action=appList]': {
                itemsingletap: function(list, index, element, record) {
                    var data = record.getData();
                    if (Ext.os.is.iOS) {
                        window.open(data.link, '_blank');
                    } else {
                        try {
                            cb = window.plugins.childBrowser;
                            cb.showWebPage(data.link);
                        } catch (e) {
                            window.open(data.link, '_blank');
                        }
                    }

                }
            },
            'section list[action=contactSheet]': {
                itemsingletap: function(list, index, element, record) {
                    var data = record.getData();
                    switch (data.action) {
                    case 'getDirections':
                        this.showDirections(data.data.address, data.data.latlon);
                        break;
                    case 'sendEmail':
                        this.sendEmail(data.data);
                        break;
                    case 'makePhoneCall':
                        this.makePhoneCall(data.data);
                        break;
                    case 'goToLink':
                        this.goToLink(data.data);
                        break;
                    case 'makeBooking':
                        this.makeBooking(data.data);
                        break;
                    }
                    list.deselectAll();
                }
            },
            'weatherPage button[action=closeSearch]': {
                tap: 'closeWeather'
            },
            'section button[cls="weatherBtn iconBtn"]': {
                tap: 'showWeather'
            },

            'page button[action="showWeather"]': {
                tap: 'showWeather'
            },
            'page button[action="changeSection"]': {
                tap: 'buttonSectionChange'
            },
            'page list[action="changeSection"]': {
                select: 'listSectionChange'
            },
            'selectfield label': {
                tap: 'showSelectFieldOptions'
            },
            'page button[action=openMapTerms]': {
                tap: 'showMapTerms'
            },
            'servicesAndFacilitiesDetails mapDisplay': {
                markerSelected: 'showLargeMap'
            },
            'productPage mapDisplay': {
                markerSelected: 'showLargeMap'
            },
            'panel': {
                hide: 'removePanel'
            }
        }
    },
    menuOpened: function() {
        if (escape.utils.AppVars.currentPage.getHasInputs()) {
            // only run if the page has input fields
            escape.utils.AppFuncs.unfousFields();
        }
        // add a close panel
        escape.utils.AppVars.currentSection.setMasked(true);
        var m = escape.utils.AppVars.currentSection.getMasked();
        var selfRef = this;
        console.log(m.element);
        m.element.on({
            swipe: function(e, node) {
                var direction = e.direction;
                var vaildSwipe = true;
                if (direction == 'left') {
                    selfRef.getMainView().toggleContainer();
                }

            }
        });
    },
    menuClosed: function(){
        escape.utils.AppVars.currentSection.setMasked(false);
    },
    removePanel: function(panel) {
        var baseCls = panel.getBaseCls();
        if (baseCls != 'x-sheet' && baseCls != 'x-msgbox') {
            try {
                Ext.Viewport.remove(panel, true);
            } catch (e) {
                console.log(e);
            }
        }
    },
    showLargeMap: function(data) {
        escape.utils.Tracking.trackEventOnCurrent(5);
         var pageXtype =  (Ext.device.Connection.isOnline()) ? 'directionsPage' : 'mapPage';
        this.getApplication().getController('Section').pushPage({
            xtype: pageXtype,
            latlon: data.latlon,
            address: data.address
        });

    },

    showSelectFieldOptions: function() {},
    showMapTerms: function() {
        // this.getApplication().getController('Section').pushPage({
        //     xtype: 'mapTerms'
        // });
    },
    scrollTopTop: function() {
        var currentPage = escape.utils.AppVars.currentSection.getNavigationView().getActiveItem();
        if (currentPage.getScrollable()) {
            currentPage.getScrollable().getScroller().scrollTo(0, 0, true);
        }

    },
    showSearch: function(btn) {
        var collectionType = escape.utils.AppVars.currentSection.getCollectionType();
        this.getApplication().getController('Section').pushPage({
            xtype: 'searchPage',
            collectionType: collectionType
        });
    },
    addToCalender: function(data){
         var title= data.title;
         var location = data.address.Street + ', ' + data.address.Suburb + ', ' + data.address.State + ', ' + data.address.Postcode;
         var notes = "My Notes";
         var startDate = "2012-01-23 09:30:00";
         var endDate = "2012-01-23 12:30:00";
              
         window.plugins.calendarPlugin.createEvent(title,location,notes,startDate,endDate);
    },
    showDirections: function(address, latlon) {
       var pageXtype =  (Ext.device.Connection.isOnline()) ? 'directionsPage' : 'mapPage';
        this.getApplication().getController('Section').pushPage({
            xtype: pageXtype,
            address: address,
            latlon: latlon
        });
    },
    makePhoneCall: function(phoneNumber) {
        //var number = phoneNumber.split('(').join('').split(')').join('').split(' ').join('');
        //window.plugins.phoneDialer.dial(phoneNumber);
    },
    sendEmail: function(emailAddress) {
        try {
            window.plugins.emailComposer.showEmailComposer("Enquiry", "via DNSW", emailAddress);
        } catch (e) {
            window.open('mailto:' + emailAddress, '_blank');
        }
        escape.utils.Tracking.trackEventOnCurrent(3);
    },
    goToLink: function(linkURL) {
        try {
            cb = window.plugins.childBrowser;
            cb.showWebPage(linkURL);
        } catch (e) {
            window.open(linkURL, '_blank');
        }
        escape.utils.Tracking.trackEventOnCurrent(7);
    },
    makeBooking: function(linkURL) {
        try {
            cb = window.plugins.childBrowser;
            cb.showWebPage(linkURL);
        } catch (e) {
            window.open(linkURL, '_blank');
        }
        escape.utils.Tracking.trackEventOnCurrent(8);
    },
    showShare: function(btn) {

    },
    buttonSectionChange: function(btn) {
        sectionId = btn.initialConfig.sectionId;
        options = btn.options;
        this.getMainView().select(sectionId, options);
    },
    listSectionChange: function(list, item) {
        sectionId = item.raw.sectionId;
        options = item.raw.options;
        this.getMainView().select(sectionId, options);
    },
    showMenu: function() {
        this.getMainView().openContainer();
    },
    closeMenu: function(){
        this.getMainView().toggleContainer();
    },
    showWeather: function() {
        this.getApplication().getController('Section').pushPage({
            xtype: 'weatherPage'
        });

    },
    closeWeather: function() {
        panel = this.getWeatherPage();
        this.closePanel(panel);
    },
    // animates a panel off the screen then destorys it
    closePanel: function(panel) {
        var viewportSize = Ext.Viewport.getSize();
        anim = Ext.create('Ext.Anim', {
            autoClear: false,
            from: {
                'top': '0px'
            },
            to: {
                'top': viewportSize.height + 'px'
            },
            delay: 0,
            duration: 200,
            after: function() {
                var panel = Ext.ComponentQuery.query('#' + this.el.id)[0];
                panel.destroy();
            }
        });
        anim.run(panel.element);
        //
    },
    // animates a panel on the the screen
    showPanel: function(panel) {
        var viewportSize = Ext.Viewport.getSize();
        anim = Ext.create('Ext.Anim', {
            autoClear: false,
            from: {
                'top': viewportSize.height + 'px'
            },
            to: {
                'top': '0px'
            },
            delay: 0,
            duration: 300
        });
        anim.run(panel.element);
    }
});