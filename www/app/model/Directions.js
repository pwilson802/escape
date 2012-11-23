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
        console.log(this.routeManager);
    },
    // Save the users stationId
    setTransportType: function(transportType) {
        escape.model.UserSettings.setSetting('transportType', transportType, {
            success: function(transportType) {},
            error: function(error) {},
            scope: this
        });
    },
    // given an address will return a latlon via the  processAddress return func
    geocodeAddress: function(addressStr, callback, scope) {
        var selfRef = this;
        // this.geocoder.findGeocodedAddress(addressStr, function(addresses) {
        //     console.log(addresses);
        //     //selfRef.processAddress(addresses, callback);
        // });
        //?format=json&json_callback=renderBasicSearchNarrative&q=

        // Ext.Ajax.request({
        //     url: 'http://dev.virtualearth.net/REST/v1/Locations/' + addressStr,
        //     method: 'GET',
        //     params: {
        //         output: 'json',
        //         key: AppSettings.bing.key
        //     },
        //     success: function(response) {
        //         console.log(response);
        //         var responseObj = JSON.parse(response.responseText);
        //         console.log(responseObj.resourceSet[0]);
        //         var addresess = [];
        //         for (var i = responseObj.resourceSets.length - 1; i >= 0; i--) {
        //             var coords  = responseObj.resourceSet[i].resources[0].geocodePoints[0].coordinates;
        //             addresess.push({lat:coords[0],lon:coords[1]});
        //         }
        //         Ext.callback(callback.success, scope, [addresess]);
        //         // process server response here
        //     },
        //     failure: function() {
        //         Ext.callback(callback.error, scope, [response]);
        //     }
        // });

        // Ext.Ajax.request({
        //     url: 'http://open.mapquestapi.com/nominatim/v1/search',
        //     method: 'GET',
        //     params: {
        //         format: 'json',
        //         q: addressStr
        //     },
        //     success: function(response) {
        //         console.log(response);
        //         var addresess = JSON.parse(response.responseText);
        //         console.log(addresess);
        //         Ext.callback(callback.success, scope, [addresess]);
        //         // process server response here
        //     },
        //     failure: function() {
        //         Ext.callback(callback.error, scope, [response]);
        //     }
        // });


        Ext.Ajax.request({
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token':AppSettings.whereis.token,
                'X-Auth-Password':AppSettings.whereis.password
            },
            url: ' http://ems.whereis.com/v1/service/geocode/unstructured',
            method: "POST",
            jsonData: {
                "address": {"freeFormAddress": addressStr}
            },
            success: function(response) {
                var addresess = JSON.parse(response.responseText);
                 Ext.callback(callback.success, scope, [addresess]);

                // process server response here
            },
            failure: function(response, opts) {
                Ext.callback(callback.error, scope);
            }
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
        try {
            this.routeManager.clearRoute();
            this.map.markersLayer.clearMarkers();
        } catch (e) {

        }


    },
    getRoute: function(routeList, transportType, callback, scope) {
        var useTransportType = "ALL_VEHICLES";
        if (transportType == 'walk') {
            useTransportType = "PEDESTRIAN";
        }
        this.routeManager.clearRoute();
        this.routeManager.route(routeList, true, true, useTransportType, this.map.vlayer, {
            onComplete: function(routeResult) {
                Ext.callback(callback.success, scope, [routeResult]);
            }
        });
    }
});