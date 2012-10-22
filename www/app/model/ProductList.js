Ext.define("escape.model.ProductList", {
    extend: 'Ext.data.Model',
    requires: 'Ext.ux.proxy.AjaxCache',
    config: {
        proxy: {
            type: 'ajaxcache',
            cacheTimeout: AppSettings.caching.productCacheLength,
            url: null,
            reader: {
                type: 'json'
            }
        }
    }
});