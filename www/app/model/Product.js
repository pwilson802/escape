Ext.define("escape.model.Product", {
    extend: 'Ext.data.Model',
    requires: 'Ext.ux.proxy.AjaxCache',
    config: {
        idProperty : 'product',
        proxy: {
            type: 'ajaxcache',
            noCache: false,
            cacheTimeout: AppSettings.caching.productCacheLength,
            reader: {
                type: 'json'
            }
        }
    }
});