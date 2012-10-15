Ext.define('escape.controller.ServicesAndFacilities', {
    extend: 'Ext.app.Controller',
    requires: ['escape.view.page.SevicesAndFacilitiesResults', 'escape.model.POI', 'escape.model.WhereIsPOI', 'escape.view.page.ServicesAndFacilitiesDetails'],
    config: {
        searchValues: null,
        resultsPage: 1,
        resultsStore: null,
        listShowing: false,
        refs: {
            searchForm: 'servicesAndFacilitiesPage formpanel',
            servicesAndFacilitiesPage: 'servicesAndFacilitiesPage',
            sevicesAndFacilitiesResultsPage: 'sevicesAndFacilitiesResultsPage',
            keywordField: 'servicesAndFacilitiesPage searchfield',
            resultsMap: 'sevicesAndFacilitiesResultsPage mapDisplay'
        },
        control: {
            'servicesAndFacilitiesPage': {
                closeView: 'saveValues'
            },
            'servicesAndFacilitiesPage list[action=selectKeyword]': {
                select: 'selectKeyword'
            },
            'servicesAndFacilitiesPage button[action=search]': {
                tap: 'search'
            },
            'sevicesAndFacilitiesResultsPage': {
                openView: 'resultsOpened'
            },
            'sevicesAndFacilitiesResultsPage segmentedbutton': {
                toggle: 'toggleView'
            },
            'sevicesAndFacilitiesResultsPage button[action=loadMore]': {
                tap: 'loadMore'
            },
            'sevicesAndFacilitiesResultsPage list': {
                select: 'showDetails'
            },
            'sevicesAndFacilitiesResultsPage mapDisplay': {
                markerSelected: 'markerSelected'
            }
        }
    },
    selectKeyword: function(list, record) {
        this.getKeywordField().setValue(record.getData().keyword);
    },
    showDetails: function(list, record) {
        escape.utils.AppVars.currentSection.getNavigationView().push({
            xtype: 'servicesAndFacilitiesDetails',
            resultsData: record.getData()
        });
    },
     markerSelected: function(data) {
        escape.utils.AppVars.currentSection.getNavigationView().push({
            xtype: 'servicesAndFacilitiesDetails',
            resultsData: data
        });
    },
    saveValues: function() {
        // craete the results store
        var store = Ext.create('Ext.data.Store', {
            model: 'escape.model.POI'
        });
        this.setResultsStore(store);
    },
    // search selected
    search: function() {
        // save the for values
        var values = this.getSearchForm().getValues();
        this.setSearchValues(values);
        this.setListShowing(false);
        this.setResultsPage(1);
        // add the results page
        if (values.keyword !== '' && values.keyword !== null) {
            escape.utils.AppVars.currentSection.getNavigationView().push({
                xtype: 'sevicesAndFacilitiesResultsPage'
            });
        }

    },
    resultsOpened: function() {
        escape.model.WhereIsPOI.on('resultsLoaded', this.resultsLoaded, this);
        if (this.getSearchValues().distance != -1) {
            this.getLocation();
        } else {
            this.performSearch(false);
        }

    },
    getLocation: function() {
        var selfRef = this;
        Ext.device.Geolocation.getCurrentPosition({
            success: function(position) {
                selfRef.performSearch(position.coords);
            },
            failure: function() {
                selfRef.performSearch(false);
            }
        });
    },
    loadMore: function() {
        escape.model.WhereIsPOI.loadMore(this.getResultsPage());
        // set the results to the next page
        this.setResultsPage(this.getResultsPage() + 1);
    },
    performSearch: function(geoLocation) {
        escape.model.WhereIsPOI.search(this.getSearchValues().keyword, this.getSearchValues().distance, geoLocation);
    },
    resultsLoaded: function(data) {
        var moreResults = ((data.offset + data.results.length) < data.total) ? true : false;
        this.getSevicesAndFacilitiesResultsPage().buildPage(moreResults);
        var results = data.results;

        var startIndex = this.getResultsStore().getData().items.length;
        for (var i = 0; i < results.length; i++) {
            results[i].resultNum = startIndex + (i + 1);
        }
        this.getResultsStore().add(results);
        if (this.getResultsPage() == 1) {
            // build the list page if the results have been return for the first time
            this.showListResults();
        } else if (!this.getListShowing()) {
            // the map is showing add the extra results markers
            this.addResultsToTheMap();
        }
        // set the results to the next page
        this.setResultsPage(this.getResultsPage() + 1);

    },
    toggleView: function(container, btn, pressed) {
        if (btn.config.type == 'map') {
            this.showMapResults();
        } else {
            this.showListResults();
        }
    },
    showListResults: function() {
        if (!this.getListShowing()) {
            var cardView = this.getSevicesAndFacilitiesResultsPage().getItems().items[1];
            cardView.removeAll(true, true);
            var itemTPL = '<span>{resultNum}</span> {name}';
            

            
            
             var container = new Ext.Container({
                scrollable: {
                    direction: 'vertical',
                    directionLock: true
                },
                flex: 1,
                //height: Ext.Viewport.getSize().height - 43,
                items: [{
                    xtype: 'list',
                    itemTpl: itemTPL,
                    store: this.getResultsStore(),
                    scrollable: false
                }, {
                    xtype: 'container',
                    itemId: 'optionsArea',
                    cls: 'btnsArea',
                    padding: '10xp',
                    defaults: {
                        margin: '0'
                    },
                    items: [{
                        xtype: 'button',
                        text: 'Load More Results',
                        action: 'loadMore',
                        cls: 'loadMore search'
                    }]
                }]

            });



            // add this list
            cardView.add(container);
            cardView.setActiveItem(container);
        }
        this.setListShowing(true);

    },

    showMapResults: function() {
        var intialMarkers = [];
        var resultsList = this.getResultsStore().getData().items;
        for (var i = resultsList.length - 1; i >= 0; i--) {
            var marker = resultsList[i].getData();
            marker.iconText = i + 1;
            intialMarkers.push({
                lat: marker.address.coordinates.latitude,
                lon: marker.address.coordinates.longitude,
                data: marker
            });
        }

        var cardView = this.getSevicesAndFacilitiesResultsPage().getItems().items[1];
        cardView.removeAll(true, true);

        var map = Ext.create('escape.view.ui.MapDisplay', {
            height: Ext.Viewport.getSize().height - 86,
            intialMarkers: intialMarkers
        });
        cardView.add(map);
        cardView.setActiveItem(map);
        this.setListShowing(false);
    },

    addResultsToTheMap: function() {
        var resultsList = this.getResultsStore().getData().items;
        for (var i = resultsList.length - 1; i >= 0; i--) {
            var marker = resultsList[i];
            this.getResultsMap().addMarker(marker.Latitude, marker.Longitude, marker);
        }
        this.getResultsMap().zoomToMarkers();
    }

});