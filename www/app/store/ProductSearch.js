Ext.define('escape.store.ProductSearch', {
    extend: 'Ext.data.Store',
    requires: ['Ext.ux.proxy.AjaxCache'],
    config: {
        model: 'escape.model.ProductSearch',
        proxy: {
            type: 'ajaxcache',
            cacheTimeout: AppSettings.caching.searchCacheLength,
            url: AppSettings.searchURL,
            startParam: 'start_rank',
            limitParam: 'num_ranks',
            reader: {
                type: 'json',
                rootProperty: 'Results Summary'
            }
        }
    }
});