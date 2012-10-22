Ext.define("escape.model.Product", {
    extend: 'Ext.data.Model',
    requires: 'Ext.ux.proxy.AjaxCache',
    config: {
        idProperty : 'product',
        proxy: {
            type: 'ajaxcache',
            cacheTimeout: AppSettings.caching.productCacheLength,
            reader: {
                type: 'json'
            }
        }
    }
});