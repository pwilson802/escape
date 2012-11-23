Ext.define('escape.controller.Page', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.util.DelayedTask'],
    config: {
        control: {
            
            'page': {
                activate: 'pageActivated',
                show: 'showPage'
            }

        }
    },
    pageActivated: function(page) {
        page.viewCreated();
    },
    showPage: function(page) {
        page.refreshPage();
    }
});