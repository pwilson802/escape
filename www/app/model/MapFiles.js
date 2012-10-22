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
        //'resources/js/OpenLayers.js' 'http://www.destinationnsw.com.au/smartphoneapps/whereis/v1/web/js/ol/OpenLayers.js'
        LazyLoad.js(['http://www.destinationnsw.com.au/smartphoneapps/whereis/v1/web/js/ol/OpenLayers.js'], function() {
            selfRef.loadEMS(callback, scope);
        });
    },

    loadEMS: function(callback, scope) {
        var selfRef = this;
        //var url = 'http://www.tiltandco.com/staging/dnsw/escapechina/EMS.js';
        var url = 'http://www.destinationnsw.com.au/smartphoneapps/whereis/v1/web/js/ems/EMS.js?profile=mobi&token=8348923927920532480';
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

    }

    // loadMootTools: function(callback, scope) {
    //     this.loaded = true;
    //     var selfRef = this;
    //     //var url = 'http://www.tiltandco.com/staging/dnsw/escapechina/EMS.js';
    //     var url = 'resources/js/MootTools.js';
    //     LazyLoad.js([url], function() {
    //         selfRef.loadTablet(callback, scope);
    //     });

    // },

    // loadTablet: function(callback, scope) {
    //     this.loaded = true;
    //     var selfRef = this;
    //     //var url = 'http://www.tiltandco.com/staging/dnsw/escapechina/EMS.js';
    //     var url = 'resources/js/WhereIsMobileUI.js';
    //     LazyLoad.js([url], function() {
    //         Ext.callback(callback.success, scope, []);
    //     });

    // }
});