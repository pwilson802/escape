Ext.define("escape.model.Map", {
    loaded: false,
    offlineFilesLoaded: false,
    singleton: true,
    config: {},
    checkOfflineSettings: function(callback, scope) {
        // Check to see if the user has picked a useOffline setting
        var selfRef = this;
        escape.model.UserSettings.getSetting('useOfflineMap', {
            success: function(useOffline) {
                if (useOffline === null) {
                    // no user isDegrees has been selected
                    selfRef.setUseOffline(true);
                } else {
                    var setting = true;
                    if (useOffline == 'false') {
                        setting = false;
                    }
                    if (useOffline === 0) {
                        setting = false;
                    }
                    selfRef.setUseOffline(setting);
                }
            },
            error: function(error) {
                // no user temp has been selected
                selfRef.setIsDegrees(true);
            },
            scope: this
        });
    },

    loadFiles: function(online,callback, scope){
        if (online){
            this.loadRequiredFiles(callback, scope);
        } else {
            this.loadOfflineRequiredFiles(callback, scope);
        }
    },

    loadRequiredFiles: function(callback, scope) {
        if (this.loaded) {
            Ext.callback(callback.success, scope, []);
        } else {
            var selfRef = this;
           //'resources/js/OpenLayers.js' 'http://www.destinationnsw.com.au/smartphoneapps/whereis/v1/web/js/ol/OpenLayers.js'
            var whereIsOpenLayers = 'http://www.destinationnsw.com.au/smartphoneapps/whereis/v1/web/js/ol/OpenLayers.js';
            var ems = 'http://www.destinationnsw.com.au/smartphoneapps/whereis/v1/web/js/ems/EMS.js?profile=mobi&token=' + AppSettings.whereis.token;
            var iPhoneDefaults = 'resources/js/IPhoneDefaults.js';
            LazyLoad.js([whereIsOpenLayers, ems, iPhoneDefaults], function() {
                selfRef.loaded = true;
                Ext.callback(callback.success, scope, []);
            });
        }
    },
    /***
    /*  load offline files
    **/
    loadOfflineRequiredFiles: function(callback, scope) {
        var selfRef = this;
        if (this.offlineFilesLoaded) {
            Ext.callback(callback.success, scope, []);
        } else {
            //var styles = 'resources/js/theme/default/style.css';
            var js = 'resources/js/OpenLayers.js';
            LazyLoad.js([js], function() {
                selfRef.offlineFilesLoaded = true;
                Ext.callback(callback.success, scope, []);
            });
        }
    }

});