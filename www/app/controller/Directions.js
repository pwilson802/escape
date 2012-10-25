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
            },
            'directionsPage segmentedbutton': {
                toggle: 'switchType'
            }
        }
    },
    switchType: function(container, btn, pressed) {
        if (btn.config.type == 'map') {
            this.getDirectionsPage().getComponent('cardLayout').setActiveItem(0);
        } else {
            this.getDirectionsPage().getComponent('cardLayout').setActiveItem(1);
        }
    },
    createRoute: function(btn) {
        var selfRef = this;
        console.log('createRoute');
        var map = this.getDirectionsPage().getMapDisplay().getMap();
        escape.model.Directions.setup(map);
        var routeList = [{
            "coordinates": {
                "latitude": -37.81081,
                "longitude": 144.96051
            },
            "postcode": "",
            "state": "NSW",
            "street": {
                "directionalPrefix": "",
                "directionalSuffix": "",
                "fullName": "",
                "name": "",
                "type": ""
            },
            "streetNumber": "Manly",
            "suburb": ""
        }, {
            "coordinates": {
                "latitude": -33.7164264,
                "longitude": 151.2974117
            },
            "postcode": "",
            "state": "NSW",
            "street": {
                "directionalPrefix": "",
                "directionalSuffix": "",
                "fullName": "",
                "name": "",
                "type": ""
            },
            "streetNumber": "",
            "suburb": "Narrabeen"
        }];

        escape.model.Directions.getRoute(routeList, {
            success: function(routeResult) {
                console.log('route created');
                console.log(routeResult);
                map.zoomToExtent(new EMS.Bounds(routeResult.boundingBox.left, routeResult.boundingBox.bottom, routeResult.boundingBox.right, routeResult.boundingBox.top));
                // write out directions
                var instructions = "";
                for (var routeNum = 0; routeNum < routeResult.routes.length; routeNum++) {
                    myNum = routeNum + 1;
                    route = routeResult.routes[routeNum];
                    for (var i = 0; i < route.routeSegments.length; i++) {
                        seg = route.routeSegments[i];
                        var travelDistance;
                        if (seg.metres > 1000) {
                            travelDistance = mathExt.roundNumber((seg.metres / 1000),2) + ' km';
                        } else {
                            travelDistance = mathExt.roundNumber(seg.metres,2) + ' m';
                        }
                        var travelTime;
                        if (seg.travelTime > 59) {
                            travelTime = mathExt.roundNumber((seg.travelTime / 60),2) + ' hrs';
                        } else {
                            travelTime =  mathExt.roundNumber(seg.travelTime,2) + ' mins';
                        }
                        instructions += "<div class='segment'>";
                        instructions += "<h2>" + seg.routeDirection + "</h2>";
                        instructions += "<h3 class='distance'>" + travelDistance + "</h3>";
                        instructions += "<h3 class='time'>" + travelTime + "</h3>";
                        instructions += "<p>"+seg.textualInstruction.split('_').join('')+ "</p>";
                        instructions += "</div>";
                    }
                }
                selfRef.getDirectionsPage().getComponent('cardLayout').getComponent('listDisplay').setHtml(instructions);
            },
            failure: function() {}
        });


        // this.getRouteList({
        //     success: function(routeList) {
        //         escape.model.Directions.getRoute(routeList);
        //     },
        //     failure: function() {
        //     }
        // });
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
        }, this);
    },
    getStartLocation: function(callback, scope) {
        var selfRef = this;
        escape.model.Directions.geocodeAddress('Manly NSW', {
            success: function(startAddress) {
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