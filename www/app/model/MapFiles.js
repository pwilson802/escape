Ext.define("escape.model.MapFiles", {
    loaded: false,
    offlineFilesLoaded : false,
    singleton: true,
    config: {},
    createMapTilesDB: function() {
        console.log('createMapTilesDB');
    },
    loadRequiredFiles: function(callback, scope) {
        if (this.loaded) {
            Ext.callback(callback.success, scope, []);
        } else {
            this.loadOpenLayers(callback, scope);
        }
    },

    loadOpenLayers: function(callback, scope) {
        var selfRef = this;
        //'resources/js/OpenLayers.js' 'http://www.destinationnsw.com.au/smartphoneapps/whereis/v1/web/js/ol/OpenLayers.js'
        LazyLoad.js(['http://www.destinationnsw.com.au/smartphoneapps/whereis/v1/web/js/ol/OpenLayers.js'], function() {
            selfRef.loadEMS(callback, scope);
        });
    },

    loadEMS: function(callback, scope) {
        var selfRef = this;
        //var url = 'http://www.tiltandco.com/staging/dnsw/escapechina/EMS.js';
        var url = 'http://www.destinationnsw.com.au/smartphoneapps/whereis/v1/web/js/ems/EMS.js?profile=mobi&token=' + AppSettings.whereis.token;
        LazyLoad.js([url], function() {
            selfRef.loadTouchControls(callback, scope);
        });

    },
    loadTouchControls: function(callback, scope) {
        this.loaded = true;
        var selfRef = this;
        //var url = 'http://www.tiltandco.com/staging/dnsw/escapechina/EMS.js';
        var url = 'resources/js/IPhoneDefaults.js';
        LazyLoad.js([url], function() {
            Ext.callback(callback.success, scope, []);
        });

    },
/***
    /*  load offline files
    **/
    loadOfflineRequiredFiles: function(callback, scope) {
        var selfRef = this;
        if (this.offlineFilesLoaded) {
            Ext.callback(callback.success, scope, []);
        } else {
            var styles = 'resources/js/css/theme/default/style.css';
            var js = 'resources/js/OpenLayers.js';
            LazyLoad.js([styles,js], function() {
                selfRef.offlineFilesLoaded = true;
                Ext.callback(callback.success, scope, []);
            });
        }
    }

});