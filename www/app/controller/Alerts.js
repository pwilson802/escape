Ext.define('escape.controller.Alerts', {
    extend: 'Ext.app.Controller',
    requires: ['escape.model.Alerts', 'escape.view.page.Alerts', 'escape.view.page.AlertSettings', 'Ext.plugin.PullRefresh'],
    config: {
        listShowing: null,
        alertsStore: null,
        feeds: null,
        refs: {
            alertsPage: 'alertsPage',
            settingsForm: 'alertSettingsPage formpanel',
            settingsBtn: '#alertsSection button[cls="editBtn iconBtn"]'
        },
        selectedRecord: null,
        currentSection: 'about',
        control: {
            'alertsPage': {
                openView: 'checkSettings'
            },
            'alertsPage segmentedbutton': {
                toggle: 'toggleView'
            },
            'alertsPage mapDisplay': {
                markerSelected: 'markerSelected'
            },
            'alertsPage list': {
                select: 'alertSelected'
            },
            '#alertsSection button[cls="refreshBtn iconBtn"]': {
                tap: 'checkSettings'
            },
            '#alertsSection button[cls="editBtn iconBtn"]': {
                tap: 'showSetting'
            },
            'alertSettingsPage': {
                closeView: 'feedOptionsChange'
            }
        }
    },
    feedOptionsChange: function() {
        var data = this.getSettingsForm().getValues();
        var feedOptions = [];
        for (var key in data) {
            feedOptions.push({
                label: key,
                load: (data[key] === 0) ? false : true
            });
        }
        this.setFeeds(feedOptions);
    },
    checkSettings: function() {
        var selfRef = this;
        if (!Ext.device.Connection.isOnline()) {
            // Show offline Message
            this.getSettingsBtn().setHidden(true); // Hide Settings Btn
            this.getAlertsPage().setMargin(0);
            var offlineHeight = window.innerHeight; // Set to window height
            this.getAlertsPage().setItems([{height:offlineHeight, xtype:'offlineMessage'}]);
        } else {
            if (!this.getFeeds()) {
                // load the feeds
                escape.model.UserSettings.getSetting('alertsFeeds', {
                    success: function(feeds) {
                        if (!feeds) {
                            selfRef.setFeeds([{
                                label: 'Incidents',
                                load: true
                            }, {
                                label: 'Road Works',
                                load: false
                            }, {
                                label: 'Alpine Conditions',
                                load: false
                            }, {
                                label: 'Major Events',
                                load: true
                            }, {
                                label: 'Floods',
                                load: true
                            }, {
                                label: 'Fire',
                                load: true
                            }]);
                        } else {
                            selfRef.setFeeds(JSON.parse(feeds));
                        }
                    },
                    error: function(error) {},
                    scope: this
                });
            } else {
                this.loadAlerts();
            }
        }
    },
    // called when alertsFeeds is updated
    updateFeeds: function(newValue, oldValue) {
        escape.model.UserSettings.setSetting('alertsFeeds', JSON.stringify(newValue), {
            success: function(alertsFeeds) {

            },
            error: function(error) {},
            scope: this
        });
        this.loadAlerts();
    },
    loadAlerts: function() {
        var alertsFeeds = this.getFeeds();
        var alltrue = true;
        var feedString = '';
        var feedList = [];
        for (var i = 0; i < alertsFeeds.length; i++) {
            var feed = alertsFeeds[i];
            if (feed.load) {
                feedList.push(feed.label.split(' ').join(''));
            } else {
                alltrue = false;
            }
        }
        if (alltrue) {
            feedString = 'All';
        } else {
            feedString = feedList.join(',');
        }

        this.getAlertsPage().removeAll(true, true);
        this.getAlertsPage().setItems({
            xtype: 'loadingDisplay'
        });
        var selfRef = this;
        escape.model.Alerts.getAlerts(feedString, {
            success: function(alerts) {
                selfRef.alertsLoaded(alerts);
            },
            error: function(error) {}
        });
    },
    showSetting: function() {
        escape.utils.AppVars.currentSection.getNavigationView().push({
            pageTitle: 'Alert Settings',
            xtype: 'alertSettingsPage',
            feeds: this.getFeeds()
        });
    },
    alertsLoaded: function(alerts) {
        if (Number(alerts.length) === 0) {
            this.getAlertsPage().removeAll(true,true);
            this.getAlertsPage().setItems({
                cls: 'noResults'
            });
            this.getAlertsPage().setMargin(0);
            this.getAlertsPage().addCls('bgTexture');
        } else {

            this.getAlertsPage().removeCls('bgTexture');
            this.getAlertsPage().buildPage();
            // process results
            var results = [];
            for (var i = 0; i < alerts.length; i++) {
                console.log(alerts[i]);
                var feature = JSON.parse(alerts[i].jObject);
                var result = {};

                result.type = Ext.String.trim(alerts[i].MainType).toLowerCase();
                result.displayName = feature.properties.displayName;
                result.mainCategory = feature.properties.mainCategory;
                result.created = new Date(feature.properties.created);
                result.lastUpdated = new Date(feature.properties.lastUpdated);
                result.isMajor = feature.properties.isMajor;
                result.lat = feature.geometry.coordinates[1];
                result.lon = feature.geometry.coordinates[0];
                result.attendingGroups = feature.properties.attendingGroups;
                result.additionalInfo = feature.properties.additionalInfo;
                result.diversions = feature.properties.diversions;
                result.advice = Ext.String.trim(feature.properties.adviceA + ' ' + feature.properties.adviceB + ' ' + feature.properties.otherAdvice);
                result.otherAdvice = feature.properties.otherAdvice;
                result.suburb = '';
                result.region = '';
                result.road = '';
                result.trafficVolume = '';


                if (feature.properties.roads.length > 0) {
                    result.suburb = feature.properties.roads[0].suburb;
                    result.region = feature.properties.roads[0].region;
                    if (feature.properties.roads.length === 1) {
                        result.road = feature.properties.roads[0].mainStreet;
                        result.trafficVolume = feature.properties.roads[0].trafficVolume;
                    } else {
                        result.road = 'Various roads';
                    }
                }
                // push obj into the list
                // if (feature.properties.isNewIncident)
                results.push(result);
            }
            var store = Ext.create('Ext.data.Store', {
                fields: ['type', 'displayName', 'created', 'mainCategory', 'lastUpdated', 'isMajor', 'lat', 'lon', 'suburb', 'region', 'road', 'trafficVolume', 'attendingGroups', 'additionalInfo', 'advice', 'otherAdvice', 'diversions'],
                data: results
            });
            this.setAlertsStore(store);

            this.showList();
        }




    },
    /**
     * Toggle between the two views
     */
    toggleView: function() {
        if (this.getListShowing()) {
            this.showMap();
        } else {
            this.showList();
        }
    },
    /**
     * Show the selected alerts as a list
     */
    showList: function() {
        this.setListShowing(true);
        var cardView = this.getAlertsPage().getItems().items[1];
        try {
            cardView.removeAll(true, true);
        } catch (e) {

        }
        var list = new Ext.List({
            flex: 1,
            cls: 'alerts',
            itemTpl: '<div class="icon {type}"></div><div class="infoArea"><b>{suburb}</b> {road},<br>{displayName}</div>',
            store: this.getAlertsStore()
        });
        // add load more button
        cardView.add(list);
        cardView.setActiveItem(list);
    },
    alertSelected: function(list, record) {
        this.showAlert(record.getData());
    },

    markerSelected: function(marker) {
        this.showAlert(marker);
    },

    showAlert: function(data) {
        escape.utils.AppVars.currentSection.getNavigationView().push({
            pageTitle: 'Alert Details',
            xtype: 'alertDetailsPage',
            alertData: data
        });
    },
    /**
     * Show the selected alerts on a map
     */
    showMap: function() {
        this.setListShowing(false);
        var intialMarkers = [];
        var resultsList = this.getAlertsStore().getData().items;
        for (var i = resultsList.length - 1; i >= 0; i--) {
            var marker = resultsList[i].getData();
            //marker.iconText = marker.resultIndex;
            intialMarkers.push({
                lat: marker.lat,
                lon: marker.lon,
                data: marker,
                iconPath: 'resources/region-images/general/alerts_marker_incidents.png',
                iconSize: [57, 37]
            });
        }
        var cardView = this.getAlertsPage().getItems().items[1];
        cardView.removeAll(true, true);
        var map = Ext.create('escape.view.ui.MapDisplay', {
            height: Ext.Viewport.getSize().height - 86,
            intialMarkers: intialMarkers
        });
        cardView.add(map);
        cardView.setActiveItem(map);
        this.setListShowing(false);

    }
});