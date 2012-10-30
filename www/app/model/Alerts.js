Ext.define("escape.model.Alerts", {
    extend: 'Ext.data.Model',
    requires: 'Ext.ux.proxy.AjaxCache',
    config: {
        proxy: {
            type: 'ajax',
            url: 'http://livetraffic.rta.nsw.gov.au/traffic/hazards/incident.json',
            reader: {
                type: 'json'
            }
        }
    }
});