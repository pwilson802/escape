Ext.define("escape.model.SensisPOI", {
    requires: ['escape.utils.Maps'],
    mixins: ['Ext.mixin.Observable'],
    singleton: true,
    query: null,
    distance: -1,
    geoLocation: false,
    pageSize: 50,
    search: function($query, $distance, $geoLocation, $page) {
        this.query = $query;
        this.distance = $distance;
        this.geoLocation = $geoLocation;
        //
        // Check to see if the user has picked a temp measurement
        var selfRef = this;
        var location = ($geoLocation) ? $geoLocation.latitude + "," + $geoLocation.longitude : AppSettings.sensis.location;

        var params = {
            "key": AppSettings.sensis.ApiKey,
            "query": this.query,
            "rows": 1000,
            "location": location
        };

        if ($distance!=-1) {
            params.radius = $distance;
        }
        if ($page) {
            params.page = $page;
        }
        Ext.Ajax.request({
            url: 'http://api.sensis.com.au/ob-20110511/prod/search',
            method: "GET",

            params: params,
            success: function(response) {
                var results = JSON.parse(response.responseText);
                // map values to whereis format
                var poiResults = {
                    offset: results.currentPage - 1 * results.count,
                    total: results.count * results.totalPages,
                    results: results.results
                };
                selfRef.fireEvent('resultsLoaded', poiResults);
            },
            failure: function(response, opts) {
                Ext.callback(callback.error, scope);
            }
        });
    },
    loadMore: function(page) {
        this.search(this.query, this.distance, this.geoLocation, page);
    },
    reportEvent: function(id,event,content){
        var userIp = 99999999999;
        try {
            userIp = device.uuid;
        } catch (e) {
            userIp = 99999999999;
        }
        var params = {
            "key": AppSettings.sensis.ApiKey,
            "userIp": userIp,
            "id": id,
            "userAgent": Ext.os.name + Ext.os.version,
            "userSessionId" : userIp
        };
        if (content){
            params.content = content;
        }
        Ext.Ajax.request({
            url: 'http://api.sensis.com.au/ob-20110511/prod/report/'+event,
            method: "GET",
            params: params,
            success: function(response) {
                var results = JSON.parse(response.responseText);
            },
            failure: function(response, opts) {
            }
        });
    }
});