Ext.define('escape.controller.Directions', {
    extend: 'Ext.app.Controller',
    requires: ['escape.model.Directions'],
    config: {
        refs: {
            directionsPage: 'directionsPage'
        },
        control: {
            'directionsPage button[action=route]': {
                tap: 'createRoute'
            }
        }
    },
    createRoute: function(btn) {
        console.log('createRoute');
        var map = this.getDirectionsPage().getMapDisplay().getMap();
        escape.model.Directions.setup(map);
        // var routeList = [{
        //     "coordinates": {
        //         "latitude": -37.81081,
        //         "longitude": 144.96051
        //     },
        //     "postcode": "",
        //     "state": "",
        //     "street": {
        //         "directionalPrefix": "",
        //         "directionalSuffix": "",
        //         "fullName": "",
        //         "name": "",
        //         "type": ""
        //     },
        //     "streetNumber": "",
        //     "suburb": ""
        // }, {
        //     "coordinates": {
        //         "latitude": -33.7164264,
        //         "longitude": 151.2974117
        //     },
        //     "postcode": "",
        //     "state": "",
        //     "street": {
        //         "directionalPrefix": "",
        //         "directionalSuffix": "",
        //         "fullName": "",
        //         "name": "",
        //         "type": ""
        //     },
        //     "streetNumber": "",
        //     "suburb": ""
        // }];
        //
        this.getRouteList({
            success: function(routeList) {
                console.log(routeList);
                escape.model.Directions.getRoute(routeList);
            },
            failure: function() {
            }
        });

    },
    getRouteList: function(callback, scope) {
        this.getStartLocation(callback, scope);
    },
    getLocation: function(callback, scope) {
        var selfRef = this;
        Ext.device.Geolocation.getCurrentPosition({
            success: function(position) {
                selfRef.getEndLocation(position.coords, callback, scope);
            },
            failure: function() {
                Ext.callback(callback.error, scope);
            }
        });
    },
    getStartLocation: function(callback, scope) {
        var selfRef = this;
        escape.model.Directions.geocodeAddress('Manly NSW', {
            success: function(startAddress) {
                console.log(startAddress.address);
                selfRef.getEndLocation(startAddress.address, callback, scope);
            },
            failure: function() {
                Ext.callback(callback.error, scope);
            }
        });
    },
    getEndLocation: function(startAddress, callback, scope) {
        var selfRef = this;
        escape.model.Directions.geocodeAddress('Narrabeen NSW', {
            success: function(endAddress) {
                console.log(endAddress);
                Ext.callback(callback.success, scope, [
                    [startAddress, endAddress.address]
                ]);
            },
            failure: function() {
                Ext.callback(callback.error, scope);
            }
        });

    }
});