Ext.define("escape.model.Directions", {
    requires: [],
    singleton: true,
    geocoder: null,
    routeManager: null,
    map: null,
    setup: function(map) {
        this.map = map;
        this.geocoder = new EMS.Services.Geocoder();
        this.routeManager = new EMS.Services.RouteManager(map);
    },
    // given an address will return a latlon via the  processAddress return func
    geocodeAddress: function(addressStr, callback, scope) {
        var selfRef = this;
        this.geocoder.findGeocodedAddress(addressStr, function(addresses) {
            selfRef.processAddress(addresses, callback);
        });
    },
    processAddress: function(addresses, callback, scope) {
        if (addresses.results.length > 0) {
            Ext.callback(callback.success, scope, [addresses.results[0]]);
        } else {
            Ext.callback(callback.error, scope, []);
        }
    },
    clearRoute: function() {
        this.routeManager.clearRoute();
        this.map.markersLayer.clearMarkers();
    },
    getRoute: function(routeList,callback, scope) {
        this.routeManager.route(routeList, true, true, "ALL_VEHICLES", this.map.vlayer, {
            onComplete: function(routeResult) {
                 Ext.callback(callback.success, scope, [routeResult]);
            }
        });
    }
});