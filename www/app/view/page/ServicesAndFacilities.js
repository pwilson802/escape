Ext.define("escape.view.page.ServicesAndFacilities", {
    extend: 'escape.view.page.Page',
    xtype: 'servicesAndFacilitiesPage',
    requires: ['escape.view.ui.MenuBtn'],
    config: {
        title: "Services & Facilities",
        cls: 'searchPage formPage',
        rightBtn: "hide",
        layout: 'vbox'
    },
    openView: function() {
        var items = [{
            xtype: 'formpanel',
            layout: 'vbox',
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
                    xtype: 'selectField',
                    label: 'Distance',
                    name: 'distance',
                    options: [{
                        text: 'Any',
                        value: -1
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
                data: AppSettings.pointsOfInterests
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