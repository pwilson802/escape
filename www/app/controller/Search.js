Ext.define('escape.controller.Search', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.Anim', 'escape.view.page.Product', 'escape.view.page.SearchResults', 'escape.model.ProductResult', 'Ext.device.Geolocation', 'Ext.util.Geolocation', 'escape.model.QueryCompletion'],
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
        queryDelay: null,
        suggestionsPanel: null,
        suggestionsStore: null,
        searchBuilt: false,
        refs: {
            searchPage: 'searchPage',
            searchField: 'searchPage searchfield',
            searchForm: 'searchPage formpanel',
            searchResultsPage: 'searchResultsPage',
            optionsArea: 'searchResultsPage optionsArea',
            loadMore: 'searchResultsPage optionsArea button[action=loadMore]',
            loadingMore: 'searchResultsPage optionsArea loadingDisplay',
            resultsMap: 'searchResultsPage mapDisplay'
        },
        control: {
            'searchPage': {
                openView: 'loadOptions',
                closeView: 'closeSearch',
                remove: 'hideSuggestions'
            },
            'searchPage searchfield': {
                keyup: 'queryChange',
                change: 'hideSuggestions',
                blur: 'hideSuggestionsDelay'
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
            },
            '#ext-viewport #suggestionList': {
                select: 'querySeclected',
                disclose: 'queryDisclose'
            }
        }
    },

    querySeclected: function(list, record) {
        var newquery = record.getData().suggestion;
        this.getSearchField().setValue(newquery);
        this.hideSuggestionsDelay();
        // runn the search
        this.search();
    },
    queryDisclose: function(list, record, node, index, event, eOpts) {
        var newquery = record.getData().suggestion;
        this.getSearchField().setValue(newquery + ' ');
        event.stopEvent();
        this.hideSuggestionsDelay();
    },

    queryChange: function() {
        // if (Ext.os.is.iOS) {
        connectionStrong = true;
        // make sure the user has a strong enough connection
        var connectionType = Ext.device.Connection.getType();
        if (connectionType === Ext.device.NONE || connectionType === Ext.device.CELL_2G) {
            // connectionStrong = false;
        }
        if (connectionStrong) {
            // make sure the query is long enough
            var query = this.getSearchField().getValue();
            // make sure the query is long enough
            if (query.length > 0) {
                // cancel any running delays
                if (this.getQueryDelay()) {
                    this.getQueryDelay().cancel();
                }
                // wait for a delay then load the query compeltion
                this.getQueryDelay().delay(300);
            }
        }

        //}
    },
    loadQueryCompletion: function() {
        if (escape.utils.AppVars.currentPage.getXTypes().indexOf('searchPage') != -1) {
            var selfRef = this;
            if (this.getSearchField()) {
                var query = this.getSearchField().getValue();
                var searchParams = this.getSearchParams();
                Ext.Ajax.request({
                    url: 'http://tnsw-search02.squiz.net/s/suggest.json',
                    params: {
                        partial_query: query,
                        collection: searchParams.collection,
                        show: 3,
                        sort: 0,
                        alpha: 0.5,
                        fmt: 'json',
                        profile: '_default_preview'
                    },
                    success: function(response) {
                        var text = response.responseText;
                        var suggestionsList = JSON.parse(text);
                        selfRef.queryCompetionLoaded(suggestionsList);
                    }
                });
            }

        }

    },
    // show completion options
    queryCompetionLoaded: function(suggestionsList) {
        // make sure we are still on the right page
        if (escape.utils.AppVars.currentPage.getXTypes().indexOf('searchPage') != -1) {
            // make sure the panel has been set up
            var selfRef = this;
            var suggestionsData = [];
            var query = this.getSearchField().getValue();
            for (var i = 0; i < suggestionsList.length; i++) {
                if (suggestionsList[i].toLowerCase() !== query.toLowerCase()) {
                    suggestionsData.push({
                        suggestion: suggestionsList[i]
                    });
                }

            }
            if (suggestionsData.length) {
                var height = (suggestionsData.length == 1) ? 49 : 98;
                if (this.getSuggestionsPanel()) {
                    this.getSuggestionsPanel().setStyle('display:block');
                    this.getSuggestionsPanel().setHidden(false);
                    this.getSuggestionsPanel().setHeight(height);
                    this.getSuggestionsPanel().getComponent('suggestionList').setHeight(height);
                    this.getSuggestionsStore().removeAll();
                    this.getSuggestionsStore().add(suggestionsData);
                } else {}

            }
        }
    },
    hideSuggestionsDelay: function() {
        var selfRef = this;
        var task = Ext.create('Ext.util.DelayedTask', function() {
            selfRef.hideSuggestions();
        });
        task.delay(500);
    },

    hideSuggestions: function() {
        // if (Ext.os.is.iOS) {
        if (this.getSuggestionsPanel()) {
            this.getSuggestionsPanel().setStyle('display:none');
            //var viewportsize = Ext.Viewport.getSize();
            // this.getSuggestionsPanel().setTop(viewportsize.height);
        }
        //}
    },
    removeSuggestions: function() {
        // if (Ext.os.is.iOS) {
        if (this.getSuggestionsPanel()) {
            var selfRef = this;
            var task = Ext.create('Ext.util.DelayedTask', function() {
                Ext.Viewport.remove(selfRef.getSuggestionsPanel(), true);
            });
            task.delay(200);
        }
        // }
    },

    setUpQueryCompletion: function() {
        if (!this.getSuggestionsPanel()) {
            var selfRef = this;
            var suggestionsStore = Ext.create('Ext.data.Store', {
                model: 'escape.model.QueryCompletion'
            });
            this.setSuggestionsStore(suggestionsStore);
            // add the suggestion list
            var viewportsize = Ext.Viewport.getSize();
            var suggestionsListDisplay = Ext.create('Ext.List', {
                itemTpl: '{suggestion}',
                itemId: 'suggestionList',
                cls: 'suggestionList',
                store: suggestionsStore,
                onItemDisclosure: true,
                height: 98
            });
            // build the panel
            var listPanel = Ext.create('Ext.Panel', {
                masked: false,
                cls: 'suggestionPanel',
                width: viewportsize.width - 80,
                height: 98,
                top: 90,
                left: 40,
                hidden: true
            });
            listPanel.add(suggestionsListDisplay);
            this.setSuggestionsPanel(listPanel);
            // add panel
            Ext.Viewport.add(listPanel);
            // define the query delay
            var task = Ext.create('Ext.util.DelayedTask', function() {
                selfRef.loadQueryCompletion();
            });
            this.setQueryDelay(task);
        }
    },
    loadOptions: function() {
        console.log('loadOptions');
        var selfRef = this;
        if (!this.getSearchBuilt()) {

            this.getSearchBuilt(true);
            if (Ext.device.Connection.isOnline()) {
                console.log('loadOptions go ahead');

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
                        // value: new Date(),
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
                        // value: new Date(),
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
                console.log(params);
                params.query = '';
                // perform the seach
                var optionsSearch = Ext.create('escape.store.ProductSearch');
                // add the extra paramaters to the search
                optionsSearch.getProxy().setExtraParams(params);
                // only request one result
                optionsSearch.setPageSize(1);
                console.log(optionsSearch);
                // request results
                console.log('loadPage');
                optionsSearch.loadPage(1, {
                    callback: function(records, operation, success) {
                        console.log('optionsSearch: ' + success);
                        // the operation object contains all of the details of the load operation
                        if (success) {
                            selfRef.buildOptions(records[0].getData());
                        } else {
                            // fails silently
                            console.log('fails silently');
                        }
                    },
                    scope: this
                });
                // set up query completion
                this.setUpQueryCompletion();
            }
        }

    },
    /***
     * Build the return optins for this search type
     */
    buildOptions: function(options) {
        var collectionType = this.getCollectionType();
        console.log(options);
        console.log(collectionType);
        console.log(options.type);
        if (options.type) {
            this.addOption('Type', options.type);
        }
        if (options.features && collectionType != 'deals') {
            this.addOption('Features', options.features);
        }
        if (options.experiences && collectionType != 'deals') {
            this.addOption('Experience', options.experiences);
        }
        if (options.activities && collectionType != 'deals') {
            this.addOption('Activities', options.activities);
        }
        if (options.starRating && collectionType != 'deals') {
            this.addOption('Star Rating', options.starRating);
        }

    },

    addOption: function(name, options) {
        var choices = [];
        for (var key in options) {
            if (key !== '__NULL__') {
                choices.push({
                    text: key,
                    value: key
                });
            }

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

        var lastValues = this.getSearchValues();
        var presetValue = 'all';
        if (lastValues) {
            try {
                presetValue = lastValues[name.toLowerCase()];
            } catch (e) {
                presetValue = 'all';
            }
        }

        if (choices.length > 2) {
            // add a destinations
            var selectfield = {
                xtype: 'selectField',
                label: name,
                labelWidth: '50%',
                name: name.toLowerCase(),
                options: choices,
                value: presetValue
            };
            this.getSearchForm().getComponent('searchOptions').add(selectfield);
        }

    },
    search: function() {
        this.hideSuggestions();
        // add the results page
        escape.utils.AppVars.currentSection.getNavigationView().push({
            xtype: 'searchResultsPage'
        });
    },
    closeSearch: function() {
        this.setSearchBuilt(false);
        this.saveValues();
        this.hideSuggestions();
    },
    saveValues: function() {
        try {
            var values = this.getSearchForm().getValues();
            this.getSearchPage().setSearchValues(values);
            this.setSearchValues(values);
        } catch (e) {

        }
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
        console.log('collectionType: ' + collectionType);
        // set the serach to use the right collection
        var collectionType = this.getSearchPage().getCollectionType();
        this.setCollectionType(collectionType);
        if (collectionType === 'restaurants') {
            params.collection = 'restaurants'; //'prototype-dnsw-' +
            params.form = 'mobile-restaurant-json';
            params.meta_C_not = 'dest';
        } else if (collectionType === 'deals') {
            params.collection = 'tourism-nsw-meta';
            params.form = 'mobile-all-json';
            params.meta_C_not = 'dest';
            params.meta_o_phrase = 1; // search only were items have a deal
        } else if (collectionType == 'vic') {
            params.collection = 'visitor-information-centres'; //'prototype-dnsw-' +
            params.form = 'mobile-vic-json';
            params.meta_C_not = 'dest';
        } else if (collectionType) {
            params.collection = collectionType; //'prototype-dnsw-' +
            params.form = 'mobile-' + collectionType + '-json';
            params.meta_C_not = 'dest';
        } else {
            params.collection = 'tourism-nsw-meta';
            params.form = 'mobile-all-json';
            params.meta_C_not = 'dest';
        }
        return params;
    },

    defineSearch: function(geoLocation) {
        console.log('defineSearch');
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
        if (this.getResultsPage() > 1) {
            var cardView = this.getSearchResultsPage().getItems().items[1];
            var resultsContainer = cardView.getActiveItem();
            var optionsArea = resultsContainer.getComponent('optionsArea');
            var loadMore = optionsArea.getComponent('loadMore');
            var loading = optionsArea.getComponent('loadingDisplay');
            loadMore.hide();
            loading.show();
        }
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
        var total = Number(records.getData().total.split(',').join(''));
        var moreResults = (Number(records.getData().endIndex) < total) ? true : false;

        this.getSearchResultsPage().buildPage(moreResults, total);
        if (total > 0) {
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
            //
            // set the results to the next page
            this.setResultsPage(this.getResultsPage() + 1);
            //
            if (this.getListShowing()) {
                if (this.getResultsPage() > 1) {
                    var cardView = this.getSearchResultsPage().getItems().items[1];
                    var resultsContainer = cardView.getActiveItem();
                    var optionsArea = resultsContainer.getComponent('optionsArea');

                    if (moreResults) {
                        var loadMore = optionsArea.getComponent('loadMore');
                        var loading = optionsArea.getComponent('loadingDisplay');
                        loadMore.show();
                        loading.hide();
                    } else {
                        if (optionsArea) {
                            optionsArea.hide();
                        }

                    }
                }

            }
        }


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
            if (cardView) {
                try {
                    cardView.removeAll(true, true);
                } catch (e) {

                }

                var collectionType = this.getSearchPage().getCollectionType();
                var itemTPL = (collectionType == 'restaurants' || collectionType == 'event' || collectionType == 'tour' || collectionType == 'deals' || collectionType === null) ? '{Title}' : '{Name}';
                var fullTPL = '{resultIndex} ' + itemTPL;
                var list = new Ext.List();
                // add this list
                //cardView.add(list);
                //
                var container = new Ext.Container({
                    itemId: 'resultsContainer',
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
                        padding: '10px',
                        defaults: {
                            margin: '0'
                        },
                        items: [{
                            xtype: 'button',
                            text: 'Load More Results',
                            action: 'loadMore',
                            cls: 'loadMore search',
                            itemId: 'loadMore'
                        }, {
                            xtype: 'component',
                            cls: 'loadingDisplay',
                            html: '<div class="x-loading-spinner"></div>',
                            hidden: true,
                            itemId: 'loadingDisplay'
                        }]
                    });
                }
                // add load more button
                cardView.add(container);
                //
                cardView.setActiveItem(container);
            }
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