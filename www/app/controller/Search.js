Ext.define('escape.controller.Search', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.Anim', 'escape.view.page.Product', 'escape.view.page.SearchResults', 'escape.model.ProductResult', 'Ext.device.Geolocation', 'Ext.util.Geolocation'],
    config: {
        resultsList: null,
        resultsPage: 1,
        optionsStore: null,
        searchStore: null,
        resultsStore: null,
        listShowing: false,
        searchValues: null,
        moreResults: false,
        collectionType: null,
        refs: {
            searchPage: 'searchPage',
            searchForm: 'searchPage formpanel',
            searchResultsPage: 'searchResultsPage',
            resultsMap: 'searchResultsPage mapDisplay'
        },
        control: {
            'searchPage': {
                openView: 'loadOptions',
                closeView: 'saveValues'
            },

            'searchResultsPage': {
                openView: 'resultsOpened'
            },
            'searchResultsPage segmentedbutton': {
                toggle: 'toggleView'
            },
            'searchResultsPage button[action=loadMore]': {
                tap: 'requestResults'
            },
            'searchResultsPage mapDisplay': {
                markerSelected: 'markerSelected'
            },
            'searchResultsPage list': {
                select: 'productSelected'
            },
            'searchPage button[action=search]': {
                tap: 'search'
            },
            '#searchResults list': {
                select: 'productSelected'
            }
        }
    },

    loadOptions: function() {
        // check to see if dates need to be added
        var collectionType = this.getSearchPage().getCollectionType();
        if (collectionType == 'event') {
            var todaysDate = new Date();
            var maxDate = new Date();
            maxDate.setFullYear(maxDate.getFullYear() + 2);
            var items = [{
                xtype: 'datepickerfield',
                label: 'From',
                name: 'fromDate',
                dateFormat: 'd/m/Y',
                value: new Date(),
                picker: {
                    yearFrom: todaysDate.getFullYear(),
                    yearTo: maxDate.getFullYear()
                },
                listeners: {
                    element: 'label',
                    tap: function() {
                        this.getPicker().show();
                    }
                }
            }, {
                xtype: 'datepickerfield',
                label: 'To',
                name: 'toDate',
                dateFormat: 'd/m/Y',
                value: new Date(),
                picker: {
                    yearFrom: todaysDate.getFullYear(),
                    yearTo: maxDate.getFullYear()
                },
                listeners: {
                    element: 'label',
                    tap: function() {
                        this.getPicker().show();
                    }
                }
            }];
            this.getSearchForm().getComponent('searchOptions').add(items);
        }
        // request the aviabile options by loading one results set
        var params = this.getSearchParams();
        params.query = '';
        // perform the seach
        var optionsSearch = Ext.create('escape.store.ProductSearch');
        // add the extra paramaters to the search
        optionsSearch.getProxy().setExtraParams(params);
        // only request one result
        optionsSearch.setPageSize(1);
        // request results
        var selfRef = this;
        optionsSearch.loadPage(1, {
            callback: function(records, operation, success) {
                // the operation object contains all of the details of the load operation
                if (success) {
                    selfRef.buildOptions(records[0].getData());
                } else {
                    // fails silently
                }
            },
            scope: this
        });

    },
    /***
     * Build the return optins for this search type
     */
    buildOptions: function(options) {
        // if (options.destinations) {
        //     var newDesList = {};
        //     for (var key in options.destinations) {
        //         var keys = key.split(',');
        //         for (var i = 0; i < keys.length; i++) {
        //             var keyName = Ext.String.trim(keys[i]);
        //             if (!newDesList[keyName]) {
        //                 newDesList[keyName] = keyName;
        //             }
        //         }
        //     }
        //     this.addOption('Destinations', newDesList);
        // }
        var collectionType = this.getCollectionType();
        
        if (options.type) {
            this.addOption('Type', options.type);
        }
        if (options.features  && collectionType!='deals') {
            this.addOption('Features', options.features);
        }
        if (options.experiences && collectionType!='deals') {
            this.addOption('Experience', options.experiences);
        }
        if (options.activities && collectionType!='deals') {
            this.addOption('Activities', options.activities);
        }
        if (options.starRating && collectionType!='deals') {
            this.addOption('Star Rating', options.starRating);
        }

    },

    addOption: function(name, options) {
        var choices = [];
        for (var key in options) {
            choices.push({
                text: key,
                value: key
            });
        }
        choices.sort(function(a, b) {
            var nameA = a.text.toLowerCase();
            var nameB = b.text.toLowerCase();
            if (nameA < nameB) {
                return 1;
            }
            if (nameA > nameB) {
                return -1;
            }
            return 0;
        });

        choices.push({
            text: 'All',
            value: 'all'
        });
        choices.reverse();

        if (choices.length > 2) {
            // add a destinations
            var selectfield = {
                xtype: 'selectField',
                label: name,
                labelWidth: '50%',
                name: name.toLowerCase(),
                options: choices
            };
            this.getSearchForm().getComponent('searchOptions').add(selectfield);
        }

    },
    search: function() {
        // add the results page
        escape.utils.AppVars.currentSection.getNavigationView().push({
            xtype: 'searchResultsPage'
        });
    },
    saveValues: function() {
        var values = this.getSearchForm().getValues();
        this.setSearchValues(values);
    },
    resultsOpened: function() {
        var values = this.getSearchValues();
        if (values.distance == -1) {
            this.defineSearch();
        } else {
            this.getLocation();
        }
    },

    getLocation: function() {
        var selfRef = this;
        Ext.device.Geolocation.getCurrentPosition({
            success: function(position) {
                selfRef.defineSearch(position.coords);
            },
            failure: function() {
                selfRef.defineSearch(false);
            }
        });
    },

    getSearchParams: function() {
        var params = {};
          
        // set the serach to use the right collection
        var collectionType = this.getSearchPage().getCollectionType();
        this.setCollectionType(collectionType);


        if (collectionType === 'restaurants') {
            params.collection = 'restaurants'; //'prototype-dnsw-' +
            params.form = 'mobile-restaurant-json';
        } else if (collectionType === 'deals') {
            params.collection = 'tourism-nsw-meta';
            params.form = 'mobile-all-json';
            params.meta_C_not = 'dest';
            params.meta_o_phrase = 1; // search only were items have a deal
        } else if (collectionType == 'vic') {
            params.collection = 'visitor-information-centres'; //'prototype-dnsw-' +
            params.form = 'mobile-vic-json';
        } else if (collectionType) {
            params.collection = collectionType; //'prototype-dnsw-' +
            params.form = 'mobile-' + collectionType + '-json';
        } else {
            params.collection = 'tourism-nsw-meta';
            params.form = 'mobile-all-json';
            params.meta_C_not = 'dest';
        }
        return params;
    },

    defineSearch: function(geoLocation) {
        // craete the results store
        var store = Ext.create('Ext.data.Store', {
            model: 'escape.model.ProductResult'
        });
        this.setResultsStore(store);
        // set the results page back to one
        this.setListShowing(false);
        this.setResultsPage(1);
        // get the form valuse
        var values = this.getSearchValues();
        // build the search paramaters
        var params = this.getSearchParams();
        // add the users query search
        params.query = values.search.split(' ').join('&');
        // add geolocation if selected
        if (geoLocation) {
            params.maxdist = values.distance;
            params.sort = 'prox';
            params.origin = geoLocation.latitude + ',' + geoLocation.longitude;
            // limit the serch to the app destination
            params.meta_D_phrase_sand = AppSettings.destinationWebpath;
        } else {
            // limit the serch to the users destination
            params.meta_D_phrase_sand = values.destination;
        }
        
        // check to see if extra options are selected
        params = this.checkOption(params, values.destinations, 'r');
        params = this.checkOption(params, values.features, 'f');
        params = this.checkOption(params, values.experience, 'h');
        params = this.checkOption(params, values.activities, 'J');
        params = this.checkOption(params, values.type, 'k');
        // add date params if required
        if (values.fromDate) {
            //http://www.sydney.com/events/search?meta_d3=&meta_d4=9Oct2012
            //params.meta_d3 = '2Oct2012';
            params.gt_q = Math.round(values.fromDate / 86400000);
        }
        if (values.toDate) {
            //params.meta_d4 = '9Oct2012';
            params.lt_p = Math.round(values.toDate / 86400000);
        }
        //perform the seach
        var productSearch = Ext.create('escape.store.ProductSearch');
        // add the extra paramaters to the search
        productSearch.getProxy().setExtraParams(params);
        //
        this.setSearchStore(productSearch);
        // laod the first page
        this.requestResults();
    },

    checkOption: function(params, value, metaLetter) {
        if (value) {
            if (value != 'all') {
                params['meta_' + metaLetter + '_phrase_sand'] = value;
            }
        }
        return params;
    },


    requestResults: function() {

        var selfRef = this;
        this.getSearchStore().loadPage(this.getResultsPage(), {
            callback: function(records, operation, success) {
                // the operation object contains all of the details of the load operation
                if (success) {
                    selfRef.resultsLoaded(records[0]);
                } else {
                    // selfRef.setItems({
                    //     xtype: 'loadError'
                    // });
                }
            },
            scope: this
        });

    },

    resultsLoaded: function(records) {
        var resultsList = records.getData().results;
        var startIndex = this.getResultsStore().getData().items.length;
        for (var i = 0; i < resultsList.length; i++) {
            resultsList[i].resultIndex = (startIndex + i + 1);
        }
        this.setResultsList(resultsList);
        // make the results page build itself ready for results
        var moreResults = (Number(records.getData().endIndex) < Number(records.getData().total.split(',').join(''))) ? true : false;

        this.getSearchResultsPage().buildPage(moreResults,records.getData().total);
        this.setMoreResults(moreResults);
        // update the store
        var storeData = this.getResultsStore().getData();
        this.getResultsStore().add(this.getResultsList());
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

    buildResultsPage: function() {
        this.getSearchResultsPage().setMargin(0);
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
            var cardView = this.getSearchResultsPage().getItems().items[1];
            try{
                cardView.removeAll(true, true);
            } catch(e){

            }
            
            var collectionType = this.getSearchPage().getCollectionType();
            var itemTPL = (collectionType == 'restaurants' || collectionType == 'event' || collectionType == 'tour' || collectionType == 'deals' || collectionType === null) ? '{Title}' : '{Name}';
            var fullTPL = '{resultIndex} ' + itemTPL;
            var list = new Ext.List();
            // add this list
            //cardView.add(list);
            //
            var container = new Ext.Container({
                scrollable: {
                    direction: 'vertical',
                    directionLock: true
                },
                flex: 1,
                //height: Ext.Viewport.getSize().height - 43,
                items: [{
                    xtype: 'list',
                    itemTpl: fullTPL,
                    store: this.getResultsStore(),
                    scrollable: false
                }]

            });
            if (this.getMoreResults()) {
                container.add({
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
                });
            }
            // add load more button
            cardView.add(container);
            //
            cardView.setActiveItem(container);
        }
        this.setListShowing(true);

    },

    showMapResults: function() {
        var intialMarkers = [];
        var resultsList = this.getResultsStore().getData().items;
        for (var i = resultsList.length - 1; i >= 0; i--) {
            var marker = resultsList[i].getData();
            marker.iconText = marker.resultIndex;
            intialMarkers.push({
                lat: marker.Latitude,
                lon: marker.Longitude,
                data: marker
            });
        }
        var cardView = this.getSearchResultsPage().getItems().items[1];
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
    },
    productSelected: function(list, record) {
        this.showProduct(record.getData());
    },

    markerSelected: function(marker) {
        this.showProduct(marker);
    },

    showProduct: function(data) {
        var funnelbackCollection = this.getSearchPage().getCollectionType();

        if (!funnelbackCollection || funnelbackCollection == 'deals') {
            funnelbackCollection = data.Product_Type;
        }

        if (funnelbackCollection === 'centres') {
            funnelbackCollection = 'vic';
        }
        var collection;
        // map funnel back collection to matrix collection
        for (var i = escape.utils.AppVars.collectionMapping.length - 1; i >= 0; i--) {
            var collectionMap = escape.utils.AppVars.collectionMapping[i];
            if (funnelbackCollection == collectionMap.funnelback) {
                collection = collectionMap;
                break;
            }
        }
        // get the product id
        var webpathBreakdown = data.Webpath.split('/');
        var productId = webpathBreakdown[webpathBreakdown.length - 1];
        // load the map page
        escape.utils.AppVars.currentSection.getNavigationView().push({
            pageTitle: collection.name,
            xtype: 'productPage',
            productId: productId,
            productType: collection.matrix
        });
    },
    reset: function() {

    }
});