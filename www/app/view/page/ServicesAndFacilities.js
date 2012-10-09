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
            xtype: 'toolbar',
            docked: 'top',
            cls: 'searchBar',
            layout: 'hbox',
            items: [{
                xtype: 'searchfield',
                flex: 1
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
        }];
        this.setItems(items);
    }
});