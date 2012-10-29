Ext.define("escape.model.Alerts", {
    extend: 'Ext.data.Model',
    requires: 'Ext.ux.proxy.AjaxCache',
    config: {
        proxy: {
            type: 'ajaxcache',
            cacheTimeout: (12 * 60 * 60 * 1000),
            url: 'http://livetraffic.rta.nsw.gov.au/traffic/hazards/incident.json',
            reader: {
                type: 'json'
            }
        }
    }
});