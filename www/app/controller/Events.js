Ext.define('escape.controller.Events', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.Anim', 'escape.model.ProductResult'],
    config: {
        currentSection: 'featured',
        refs: {
            eventsPage: 'eventsPage'
        },
        control: {
            'eventsPage': {
                built: 'loadFeatured'
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
        weekFromNow.setDate(todaysDate.getDate()+7);
        params.meta_d3 = Ext.Date.format(todaysDate, 'dMY');//'2Oct2012';
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
                    var date = new Date(dateStr[0],Number(dateStr[1])-1,dateStr[2]);

                    return Ext.Date.format(date, 'l jS F');//record.get('Start Date');
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
    loadFeatured: function() {
        var url = '';
        for (var i = 0; i < content.productLists.length; i++) {
            var productList = content.productLists[i];
            if (productList.type == 'mustDo') {
                url = productList.url;
            }

        }
        var selfRef = this;
        escape.model.ContentPage.getProxy().setUrl(url);
        escape.model.ContentPage.load(0, {
            success: function(content) {
                selfRef.featuredLoaded(content.getData());
            },
            error: function(error) {},
            scope: this
        });

    },
    featuredLoaded: function(content) {
        if (this.getCurrentSection() == 'featured') {
            var linksStartBreakdown = content.description.split('<a href="');
            var output = '';
            var featuredItems = [];
            for (var i = 0; i < linksStartBreakdown.length; i++) {
                var linksEndBreakdown = linksStartBreakdown[i].split('</a>');
                if (linksEndBreakdown.length > 1) {
                    // process the link
                    var linkParts = linksEndBreakdown[0].split('">');
                    var link = linkParts[0];
                    var linkText = linkParts[1];

                    var urlBreakdown = link.split('/');
                    var type = urlBreakdown[urlBreakdown.length - 2];
                    var productId = urlBreakdown[urlBreakdown.length - 1];
                    if (type == 'attractions') {
                        type = 'attraction';
                    }
                    if (type !== null && productId !== null) {

                        var typeAllowed = false;
                        for (var t = escape.utils.AppVars.collectionMapping.length - 1; t >= 0; t--) {
                            if (type == escape.utils.AppVars.collectionMapping[t].matrix) {
                                typeAllowed = true;
                                break;
                            }
                        }
                        if (typeAllowed) {
                            featuredItems.push({
                                xtype: 'productListItem',
                                data: {
                                    name: linkText,
                                    type: type,
                                    productId: productId,
                                    suburb: '-'
                                }

                            });
                        }
                    }
                }
            }
             featuredItems.push({
                margin: '20px 0 0 0',
             xtype: 'footer'
             });
            var viewportSize = Ext.Viewport.getSize();
            var contents = this.getEventsPage().getComponent('contents');
            contents.setPadding(0);
            contents.setItems({
                xtype: 'container',
                height: viewportSize.height - 89,
                scrollable: {
                    direction: 'vertical',
                    directionLock: true
                },
                items: featuredItems
            });
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