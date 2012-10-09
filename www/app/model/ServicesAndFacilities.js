Ext.define("escape.model.ServicesAndFacilities", {
    singleton: true,
    query: null,
    search: function($query) {
        console.log('model search!!! ' + $query);
        this.query = $query;
        this.loadLibaries();
    },

    loadLibaries: function() {
        console.log('model loadLibaries!!!');
        var selfRef = this;
        escape.model.MapFiles.loadRequiredFiles({
            success: function(results) {
                EMS.Util.getDomain = function() {
                    return "destinationnsw.com.au";
                };
                selfRef.getLocation();
            },
            error: function(error) {},
            scope: this
        });
    },
    getLocation: function() {
        var selfRef = this;
        Ext.device.Geolocation.getCurrentPosition({
            success: function(position) {
                selfRef.runQuery(position.coords);
            },
            failure: function() {
                selfRef.runQuery(false);
            }
        });
    },
    runQuery: function(geoLocation) {
        console.log('model runQuery!!!');
        var geocoder = new EMS.Services.Geocoder();
        var query = {};
        query.keyword = this.query;
         query.size = 10;
        // if (geoLocation) {
        //     query.address = {
        //         coordinates: {
        //             latitude: geoLocation.latitude,
        //             longitude: geoLocation.longitude
        //         }
        //     };
        // } else {
        //query.address = AppSettings.appAddress;
        // }
        console.log(AppSettings.bounds.left);
        bounds = new OpenLayers.Bounds(AppSettings.bounds.left, AppSettings.bounds.bottom, AppSettings.bounds.right, AppSettings.bounds.top);
        query.bounds = bounds.asWGS84();
        console.log(query);
        //query.size = 25;
        geocoder.poiSearch(query, this.resultsLoaded);
    },
    loadMore: function() {},
    resultsLoaded: function(poiResults) {
        console.log('resultsLoaded');
        console.log(poiResults);
    }
});