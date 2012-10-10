Ext.define("escape.model.ServicesAndFacilities", {
    mixins: ['Ext.mixin.Observable'],
    singleton: true,
    query: null,
    distance: -1,
    geoLocation: false,
    search: function($query, $distance, $geoLocation) {
        this.query = $query;
        this.distance = $distance;
        this.geoLocation = $geoLocation;
        this.loadLibaries();
    },

    loadLibaries: function() {
        var selfRef = this;
        escape.model.MapFiles.loadRequiredFiles({
            success: function(results) {
                EMS.Util.getDomain = function() {
                    return "destinationnsw.com.au";
                };
                selfRef.runQuery();
            },
            error: function(error) {},
            scope: this
        });
    },

    runQuery: function() {
        var selfRef = this;
        var geocoder = new EMS.Services.Geocoder();
        var query = {};
        // the keyword to search by
        query.keyword = this.query;
        if (this.distance != -1) {

            // one approx km in degress
            var dist = this.distance / 6371;
            var brng = 315 * (Math.PI / 180);
            console.log(brng)
            // search by lat long
            var lon1 = this.geoLocation.longitude * Math.PI / 180;
            var lat1 = this.geoLocation.latitude * Math.PI / 180;

            var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) + Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));
            var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) * Math.cos(lat1), Math.cos(dist) - Math.sin(lat1) * Math.sin(lat2));


            brng = 135 * (Math.PI / 180);
            console.log(brng);
            var lat3 = Math.asin(Math.sin(lat1) * Math.cos(dist) + Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));
            var lon3 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) * Math.cos(lat1), Math.cos(dist) - Math.sin(lat1) * Math.sin(lat3));


            lon1 = (lon1 * 180 / Math.PI);
            lon2 = (lon2 * 180 / Math.PI);
            lon3 = (lon3 * 180 / Math.PI);
            lat1 = (lat1 * 180 / Math.PI);
            lat2 = (lat2 * 180 / Math.PI);
            lat3 = (lat3 * 180 / Math.PI);


            console.log('lon1: ' + lon1);
            console.log('lat1: ' + lat1);

            
            console.log('lon2: ' + lon2);
            console.log('lon3: ' + lon3);

           
            console.log('lat2: ' + lat2);
            console.log('lat3: ' + lat3);

            bounds = new OpenLayers.Bounds(lon2, lat3, lon3, lat2);
            query.bounds = bounds.asWGS84();



        } else {
            // search within the app bounds
            bounds = new OpenLayers.Bounds(AppSettings.bounds.left, AppSettings.bounds.bottom, AppSettings.bounds.right, AppSettings.bounds.top);
            query.bounds = bounds.asWGS84();
        }
        // the amount of results to be returned
        //query.size = 25;
        console.log(query);
        // request the search
        geocoder.poiSearch(query, function(poiResults) {
            selfRef.resultsLoaded(poiResults);
        });

    },
    loadMore: function() {},
    resultsLoaded: function(poiResults) {
        this.fireEvent('resultsLoaded', poiResults);
    }
});