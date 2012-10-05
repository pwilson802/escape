Ext.define("escape.view.page.ServicesAndFacilities", {
    extend: 'escape.view.page.Page',
    xtype: 'servicesAndFacilitiesPage',
    requires: ['escape.view.ui.MenuBtn'],
    config: {
        title: "Services & Facilities",
        cls: 'searchPage',
        rightBtn: "hide",
        layout: 'vbox',
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            cls: 'searchBar',
            layout: 'hbox',
            items: [{
                xtype: 'searchfield',
                flex: 1
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
            }, {
                xtype: 'button',
                text: 'Reset',
                action: 'cancelSearch',
                cls: 'reset'
            }]
        }]
    }
});