Ext.define('escape.store.AppVersion', {
    extend: 'Ext.data.Store',
    requires: ['Ext.ux.proxy.AjaxCache', 'escape.model.AppVersion'],
    config: {
        model: 'escape.model.AppVersion',
        proxy: {
            type: 'ajax',
            url: 'http://ws2.tiltandco.net/RestServiceImpl.svc/AppVersion2',
            noCache: false,
            headers: {
                'Content-Type': 'application/json'
            },
            enablePagingParams: false,
            actionMethods: {
                create: 'POST',
                read: 'POST',
                update: 'POST',
                destroy: 'POST'
            },
            extraParams: {
                AppID: 3,
                AppName: 'ARTN'
            },
            reader: {
                type: 'json'
            },
            writer : {
                type: 'json'
            }
        }
    }
});