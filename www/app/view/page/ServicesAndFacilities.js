Ext.define("escape.view.page.ServicesAndFacilities", {
    extend: 'escape.view.page.Page',
    xtype: 'servicesAndFacilitiesPage',
    requires: ['escape.view.ui.MenuBtn'],
    config: {
        title: "Services & Facilities",
        cls: 'searchPage formPage',
        rightBtn: "hide",
        layout: 'vbox',
        pageTypeId: 5,
        pageTrackingId: 1
       },
    openView: function() {
         Ext.define('POIModel', {
            extend: 'Ext.data.Model',
            config: {
                fields: [{
                    name: 'label',
                    type: 'string'
                }, {
                    name: 'keyword',
                    type: 'string'
                }]
            }
        });
        var store = Ext.create("Ext.data.Store", {
            model: "POIModel",
            storeId: "generalStore",
            data: AppSettings.poi
        });
        var items = [{
            xtype: 'formpanel',
            layout: 'vbox',
            scrollable: false,
            width: '100%',
            flex: 1,
            items: [{
                xtype: 'toolbar',
                docked: 'top',
                cls: 'searchBar',
                layout: 'hbox',
                items: [{
                    xtype: 'searchfield',
                    name: 'keyword',
                    flex: 1
                }]
            }, {
                xtype: 'container',
                flex: 1,
                scrollable: {
                    direction: 'vertical',
                    directionLock: true
                },
                items: [{
                    xtype: 'selectField',
                    label: 'Around me',
                    labelWidth: '50%',
                    name: 'distance',
                    options: [{
                        text: 'Off',
                        value: -1
                    }, {
                        text: '1Km',
                        value: 5
                    }, {
                        text: '5Km',
                        value: 5
                    }, {
                        text: '10Km',
                        value: 10
                    }, {
                        text: '15Km',
                        value: 15
                    }, {
                        text: '25Km',
                        value: 25
                    }, {
                        text: '50Km',
                        value: 50
                    }, {
                        text: '75Km',
                        value: 75
                    }, {
                        text: '100Km',
                        value: 100
                    }, {
                        text: '150Km',
                        value: 150
                    }, {
                        text: '200Km',
                        value: 200
                    }]
                }, {
                    xtype: 'list',
                    itemId: 'keywordList',
                    action: 'selectKeyword',
                    margin: '10px',
                    cls: 'radioList',
                    activeItem: 1,
                    scrollable: false,
                    flex: 1,
                    itemTpl: '{label}',
                    store : store
                }]
            }, {
                xtype: 'container',
                docked: 'bottom',
                cls: 'btnsArea',
                padding: '10xp',
                defaults: {
                    margin: '10px 0 0 0'
                },
                items: [{
                    xtype: 'button',
                    text: 'Search',
                    action: 'search',
                    cls: 'search'
                }]
            }]
        }];
        this.setItems(items);
    }
});