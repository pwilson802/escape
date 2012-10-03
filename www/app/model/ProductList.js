Ext.define("escape.model.ProductList", {
    extend: 'Ext.data.Model',
    requires: 'Ext.ux.proxy.AjaxCache',
    config: {
        proxy: {
            type: 'ajax',
            cacheTimeout: (60 * 60 * 24 * 14),
            url: null,
            reader: {
                type: 'json'
            }
        }
    }
});