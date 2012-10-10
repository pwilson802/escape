Ext.define('escape.controller.ServicesAndFacilities', {
    extend: 'Ext.app.Controller',
    requires: ['escape.view.page.SevicesAndFacilitiesResults', 'escape.model.POI'],
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
            'servicesAndFacilitiesPage button[action=search]': {
                tap: 'search'
            },
            'sevicesAndFacilitiesResultsPage': {
                openView: 'resultsOpened'
            },
            'sevicesAndFacilitiesResultsPage segmentedbutton': {
                toggle: 'toggleView'
            }
        }
    },
    saveValues: function() {
        // craete the results store
        var store = Ext.create('Ext.data.Store', {
            model: 'escape.model.POI'
        });
        this.setResultsStore(store);
        // save the for values
        var values = this.getSearchForm().getValues();
        this.setSearchValues(values);
    },

    // a language has been selected
    search: function() {
        this.setListShowing(false);
        this.setResultsPage(1);
        // add the results page
        escape.utils.AppVars.currentSection.getNavigationView().push({
            xtype: 'sevicesAndFacilitiesResultsPage'
        });
    },
    resultsOpened: function() {
        escape.model.ServicesAndFacilities.on('resultsLoaded', this.resultsLoaded, this);
         console.log(this.getSearchValues());
        console.log(this.getSearchValues().keyword);
        if (this.getSearchValues().distance!=-1) {
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
    performSearch: function(geoLocation) {
        escape.model.ServicesAndFacilities.search(this.getSearchValues().keyword,this.getSearchValues().distance,geoLocation);
    },
    resultsLoaded: function(results) {
        var moreResults = ((results.offset + results.results.length) < results.total) ? true : false;
        this.getSevicesAndFacilitiesResultsPage().buildPage(moreResults);
        this.getResultsStore().add(results.results);
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
            var itemTPL = '{name}';
            var list = new Ext.List({
                itemTpl: itemTPL,
                store: this.getResultsStore(),
                flex: 1
            });
            // add this list
            cardView.add(list);
            cardView.setActiveItem(list);
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
        var resultsList = this.getResultsList();
        for (var i = resultsList.length - 1; i >= 0; i--) {
            var marker = resultsList[i];
            this.getResultsMap().addMarker(marker.Latitude, marker.Longitude, marker);
        }
        this.getResultsMap().zoomToMarkers();
    }

});