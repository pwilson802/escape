Ext.define("escape.model.MapFiles", {
    loaded: false,
    singleton: true,
    config: {},
    loadRequiredFiles: function(callback, scope) {
        if (this.loaded) {
            Ext.callback(callback.success, scope, []);
        } else {
            this.loadOpenLayers(callback, scope);
        }
    },

    loadOpenLayers: function(callback, scope) {
        var selfRef = this;
        LazyLoad.js(['http://www.destinationnsw.com.au/smartphoneapps/whereis/v1/web/js/ol/OpenLayers.js'], function() {
            selfRef.loadEMS(callback, scope);
        });
    },

    loadEMS: function(callback, scope) {
        this.loaded = true;
        var selfRef = this;
        //var url = 'http://www.tiltandco.com/staging/dnsw/escapechina/EMS.js';
        var url = 'http://www.destinationnsw.com.au/smartphoneapps/whereis/v1/web/js/ems/EMS.js?profile=mobi&token=8348923927920532480';
        LazyLoad.js([url], function() {
            EMS.Services.communicationMode = "CrossDomain";
            Ext.callback(callback.success, scope, []);
        });

    }
});