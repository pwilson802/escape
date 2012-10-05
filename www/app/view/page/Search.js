Ext.define("escape.view.page.Search", {
    extend: 'escape.view.page.Page',
    xtype: 'searchPage',
    requires: ['Ext.field.Select', 'Ext.form.Panel'],
    config: {
        cls: 'searchPage formPage',
        collectionType: null,
        pageTitle: 'Search',
        rightBtn: 'hide',
        layout: 'hbox',
        items: []
    },
    reOpenView: function() {
        this.openView();
    },
    closeView: function() {
        this.setItems([]);
    },
    openView: function() {
        this.setItems([{
            xtype: 'formpanel',
            layout: 'hbox',
            width: '100%',
            flex: 1,
            items: [{
                xtype: 'toolbar',
                docked: 'top',
                cls: 'searchBar',
                layout: 'hbox',
                items: [{
                    xtype: 'searchfield',
                    name: 'search',
                    flex: 1
                }]
            }, {
                xtype: 'container',
                itemId: 'searchOptions',
                cls: 'searchOptions',
                flex: 1,
                padding: '10px',
                defaults: {
                    margin: '0 0 10px 0'
                },
                items: [{
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
        }]);
    }
});