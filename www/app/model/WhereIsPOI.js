Ext.define("escape.model.WhereIsPOI", {
    mixins: ['Ext.mixin.Observable'],
    singleton: true,
    query: null,
    distance: -1,
    geoLocation: false,
    pageSize: 25,
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
                selfRef.defineQurey();
                selfRef.runQuery();
            },
            error: function(error) {},
            scope: this
        });
    },
    defineQurey: function() {
        var query = {};
        // the keyword to search by
        query.keyword = this.query;
        if (this.distance != -1) {
            // convert your lat lon into a EMS lat lon
            var latlon = new EMS.LonLat(this.geoLocation.longitude, this.geoLocation.latitude);
            // one approx km in degress
            var dist = this.distance / 6371;
            // search by lat long to radians
            var lon1 = latlon.lon * Math.PI / 180;
            var lat1 = latlon.lat * Math.PI / 180;
            // get the lat lon in the north west
            var brng = 315 * (Math.PI / 180);
            var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) + Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));
            var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) * Math.cos(lat1), Math.cos(dist) - Math.sin(lat1) * Math.sin(lat2));
            // get the lat lon in the south east
            brng = 135 * (Math.PI / 180);
            var lat3 = Math.asin(Math.sin(lat1) * Math.cos(dist) + Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));
            var lon3 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) * Math.cos(lat1), Math.cos(dist) - Math.sin(lat1) * Math.sin(lat3));
            // convert lat back to deimails
            lon1 = (lon1 * 180 / Math.PI);
            lon2 = (lon2 * 180 / Math.PI);
            lon3 = (lon3 * 180 / Math.PI);
            lat1 = (lat1 * 180 / Math.PI);
            lat2 = (lat2 * 180 / Math.PI);
            lat3 = (lat3 * 180 / Math.PI);
            // create the bounds object
            bounds = new OpenLayers.Bounds(lon2, lat3, lon3, lat2);
            query.bounds = bounds.asWGS84();
        } else {
            // search within the app bounds
            bounds = new OpenLayers.Bounds(AppSettings.bounds.left, AppSettings.bounds.bottom, AppSettings.bounds.right, AppSettings.bounds.top);
            query.bounds = bounds.asWGS84();
        }
        // the amount of results to be returned
        query.size = this.pageSize;
        this.query = query;
    },
    runQuery: function() {
        var selfRef = this;
        var geocoder = new EMS.Services.Geocoder();
        // request the search
        geocoder.poiSearch(this.query, function(poiResults) {
            selfRef.resultsLoaded(poiResults);
        });

    },
    loadMore: function(page) {
        this.query.offset = this.pageSize * page;
        this.query.id = new Date().getTime();
        this.runQuery();
    },
    resultsLoaded: function(poiResults) {
        this.fireEvent('resultsLoaded', poiResults);
    }
});