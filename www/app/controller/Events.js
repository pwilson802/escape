Ext.define('escape.controller.Events', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.Anim', 'escape.model.ProductResult'],
    config: {
        currentSection: 'eventsCalender',
        refs: {
            eventsPage: 'eventsPage'
        },
        control: {
            'eventsPage': {
                built: 'loadEventsCalender'
            },
            'eventsPage segmentedbutton': {
                toggle: 'switchType'
            },
            'eventsPage list': {
                select: 'productSelected'
            }
        }
    },
    switchType: function(container, btn, pressed) {
        this.setCurrentSection(btn.config.type);
        var productSubSection = container.parent;

        var contents = this.getEventsPage().getComponent('contents');
        var loadingDislay = Ext.create('escape.view.ui.LoadingDisplay');
        contents.setPadding(10);
        contents.setItems(loadingDislay);

        if (btn.config.type == 'featured') {
            this.loadFeatured();
        }

        if (btn.config.type == 'weekly') {
            this.loadWeekly();
        }

    },
    loadWeekly: function() {
        var params = {
            // linit the search to the apps destination webpath
            meta_D_phrase_sand: AppSettings.destinationWebpath
        };
        // set the serach to use the right collection
        params.collection = 'event'; //'prototype-dnsw-' +
        params.form = 'mobile-event-json';
        var todaysDate = new Date();
        var weekFromNow = new Date();
        weekFromNow.setDate(todaysDate.getDate() + 7);
        params.meta_d3 = Ext.Date.format(todaysDate, 'dMY'); //'2Oct2012';
        params.meta_d4 = Ext.Date.format(weekFromNow, 'dMY');
        //
        // perform the seach
        var serachStore = Ext.create('escape.store.ProductSearch');
        // add the extra paramaters to the search
        serachStore.getProxy().setExtraParams(params);
        // only request one result
        serachStore.setPageSize(50);
        // request results
        var selfRef = this;
        serachStore.loadPage(1, {
            callback: function(records, operation, success) {
                // the operation object contains all of the details of the load operation
                if (success) {
                    selfRef.weeklyEventsLoaded(records[0].getData());
                } else {
                    // fails silently
                }
            },
            scope: this
        });
    },
    weeklyEventsLoaded: function(records) {
        console.log(records);
        var resultsStore = Ext.create('Ext.data.Store', {
            model: 'escape.model.ProductResult',
            data: records.results,
            grouper: {
                groupFn: function(record) {
                    var dateStr = record.get('Start Date').split('-');
                    var date = new Date(dateStr[0], Number(dateStr[1]) - 1, dateStr[2]);

                    return Ext.Date.format(date, 'l jS F'); //record.get('Start Date');
                },
                sortProperty: 'Start Date'
            }
        });
        var viewportSize = Ext.Viewport.getSize();
        var list = new Ext.List({
            itemTpl: '{Title}',
            store: resultsStore,
            height: viewportSize.height - 89,
            scrollable: true,
            grouped: true
        });

        var contents = this.getEventsPage().getComponent('contents');
        contents.setPadding(0);
        contents.setItems(list);
    },
    loadEventsCalender: function() {
        console.log('loadEventsCalender');
        var params = {};
       // params.meta_D_phrase_sand = AppSettings.destinationWebpath;
        // set the serach to use the right collection
        params.collection = 'tourism-nsw-meta';
        params.form = 'mobile-all-json';
        params.meta_C_not = 'dest';
        params.meta_h_phrase_sand = AppSettings.EventCalName;
        var dateNow = new Date();
        params.gt_q = parseInt(dateNow.getTime()/86400000);
        //perform the seach
        var productSearch = Ext.create('escape.store.ProductSearch');
        // add the extra paramaters to the search
        productSearch.getProxy().setExtraParams(params);
        // laod the first page
        var selfRef = this;
        productSearch.loadPage(1, {
            callback: function(records, operation, success) {
                // the operation object contains all of the details of the load operation
                if (success) {
                    selfRef.eventsCalenderLoaded(records[0]);
                } else {
                    // selfRef.setItems({
                    //     xtype: 'loadError'
                    // });
                }
            },
            scope: this
        });

    },
    eventsCalenderLoaded: function(data) {
        console.log('eventsCalenderLoaded');
        console.log(data);
        if (this.getCurrentSection() == 'eventsCalender') {
            var viewportSize = Ext.Viewport.getSize();
            var list = new Ext.List({
                itemTpl: '{Title}',
                data: data.data.results,
                height: viewportSize.height - 89,
                scrollable: true
            });

            var contents = this.getEventsPage().getComponent('contents');
            contents.setPadding(0);
            contents.setItems(list);
        }
    },
    productSelected: function(list, record) {
        var data = record.getData();
        var collection = 'event';
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
    }

});