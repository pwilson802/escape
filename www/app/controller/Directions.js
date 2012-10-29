Ext.define('escape.controller.Directions', {
    extend: 'Ext.app.Controller',
    requires: ['escape.model.Directions'],
    config: {
        transportType: 'car',
        refs: {
            directionsPage: 'directionsPage',
            loadingDisplay: 'directionsPage loadingDisplay',
            routeForm: 'directionsPage formpanel',
            transportBtn: 'directionsPage formpanel button[action=switchTranport]',
            routeBtn: 'directionsPage formpanel button[action=route]',
            startLocation: 'directionsPage formpanel textfield[name=startLocation]',
            endLocation: 'directionsPage formpanel textfield[name=endLocation]'
        },
        control: {
            'directionsPage mapDisplay': {
                mapCreated: 'mapCreated'
            },
            'directionsPage button[action=switchDirection]': {
                tap: 'switchDirection'
            },
            'directionsPage button[action=route]': {
                tap: 'createRoute'
            },
            'directionsPage segmentedbutton': {
                toggle: 'switchType'
            },
            'directionsPage button[action=switchTranport]': {
                tap: 'switchTranport'
            }
        }
    },
    mapCreated: function() {
        var selfRef = this;
        this.setTransportType('car');
        var map = this.getDirectionsPage().getMapDisplay().getMap();
        escape.model.Directions.setup(map);
        this.getRouteBtn().enable();
        var transportBtn = this.getTransportBtn();
        escape.model.UserSettings.getSetting('transportType', {
            success: function(transportType) {
                console.log('transportType: ' + transportType);
                if (!transportType) {
                    transportType = 'car';
                }
                selfRef.setTransportType(transportType);
                if (transportType == 'car') {
                    transportBtn.setCls('car');
                } else {
                    transportBtn.setCls('walk');
                }


            },
            error: function(error) {},
            scope: this
        });
    },
    switchDirection: function() {
        var data = this.getRouteForm().getValues();
        var startLoc = data.startLocation;
        var endLoc = data.endLocation;
        console.log('startLoc: ' + startLoc);
        console.log('endLoc: ' + endLoc);
        this.getStartLocation().setValue(endLoc);
        this.getEndLocation().setValue(startLoc);
    },
    switchTranport: function(btn) {
        if (this.getTransportType() == 'car') {
            this.setTransportType('walk');
            btn.setCls('walk');
        } else {
            this.setTransportType('car');
            btn.setCls('car');
        }
        escape.model.Directions.setTransportType(this.getTransportType());
    },
    switchType: function(container, btn, pressed) {
        if (btn.config.type == 'map') {
            this.getDirectionsPage().getComponent('cardLayout').setActiveItem(0);
        } else {
            this.getDirectionsPage().getComponent('cardLayout').setActiveItem(1);
        }
    },
    createRoute: function(btn) {
        this.getLoadingDisplay().show();
        this.getRouteForm().hide();
        //
        var selfRef = this;
        console.log('createRoute');
        var data = this.getRouteForm().getValues();
        this.getRouteList(data, {
            success: function(routeList) {
                console.log('route list created');
                selfRef.createRouteFromList(routeList);
            },
            failure: function() {
                console.log('route list failure');
                this.getLoadingDisplay().hide();
                this.getRouteForm().show();
            }
        });
    },
    createRouteFromList: function(routeList) {

        var selfRef = this;
        // clear route
        escape.model.Directions.clearRoute();
        // clear markers
        var mapDisplay = this.getDirectionsPage().getMapDisplay();
        mapDisplay.clearMarkers();
        // add markers at the start and end of the route
        mapDisplay.addMarker(routeList[0].coordinates.latitude, routeList[0].coordinates.longitude, {});
        mapDisplay.addMarker(routeList[1].coordinates.latitude, routeList[1].coordinates.longitude, {});

        escape.model.Directions.getRoute(routeList, this.getTransportType(), {
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
                            travelDistance = mathExt.roundNumber((seg.metres / 1000), 2) + ' km';
                        } else {
                            travelDistance = mathExt.roundNumber(seg.metres, 2) + ' m';
                        }
                        var travelTime;
                        if (seg.travelTime > 59) {
                            travelTime = mathExt.roundNumber((seg.travelTime / 60), 2) + ' hrs';
                        } else {
                            travelTime = mathExt.roundNumber(seg.travelTime, 2) + ' mins';
                        }
                        instructions += "<div class='segment'>";
                        instructions += "<h2>" + seg.routeDirection + "</h2>";
                        instructions += "<h3 class='distance'>" + travelDistance + "</h3>";
                        instructions += "<h3 class='time'>" + travelTime + "</h3>";
                        instructions += "<p>" + seg.textualInstruction.split('_').join('') + "</p>";
                        instructions += "</div>";
                    }
                }
                selfRef.getDirectionsPage().getComponent('cardLayout').getComponent('listDisplay').setHtml(instructions);
            },
            failure: function() {}
        });

        this.getLoadingDisplay().hide();
        this.getRouteForm().show();

    },


    getRouteList: function(data, callback, scope) {
        console.log('getRouteList');
        var routeList = [];
        // find your start location
        this.getLocation(data.startLocation, {
            success: function(locationObj) {
                console.log('start location found');
                console.log(locationObj);
                routeList.push(locationObj);
                // find your end location
                this.getLocation(data.endLocation, {
                    success: function(locationObj) {
                        console.log('end location found');
                        console.log(locationObj)
                        routeList.push(locationObj);
                        //
                        Ext.callback(callback.success, scope, [routeList]);
                    },
                    failure: function() {
                        Ext.callback(callback.error, scope);
                        console.log('could not find your end location');
                    }
                }, this);
            },
            failure: function() {
                Ext.callback(callback.error, scope);
                console.log('could not find your start location');
            }
        }, this);
    },
    getCurrentLocation: function(callback, scope) {
        console.log('getCurrentLocation');
        var selfRef = this;
        Ext.device.Geolocation.getCurrentPosition({
            success: function(position) {
                Ext.callback(callback.success, scope, [position]);

                // selfRef.getEndLocation(position.coords, callback, scope);
            },
            failure: function() {
                Ext.callback(callback.error, scope);
            }
        }, this);
    },
    getLocation: function(searchAddress, callback, scope) {
        console.log('getLocation: ' + searchAddress);
        var selfRef = this;
        var directionPage = this.getDirectionsPage();
        var address = directionPage.getAddress();
        var addressString = address.Street + ' ' + address.Suburb + ' ' + address.State + ' ' + address.Postcode;

        if (searchAddress.toLowerCase() == 'current location') {
            // find the usesr current locatio
            this.getCurrentLocation({
                success: function(position) {
                    console.log('current location found');
                    console.log(position);
                    var locationObj = {
                        "coordinates": {
                            "latitude": Number(position.coords.latitude),
                            "longitude": Number(position.coords.longitude)
                        },
                        "postcode": "",
                        "state": "",
                        "street": {
                            "directionalPrefix": "",
                            "directionalSuffix": "",
                            "fullName": "",
                            "name": "",
                            "type": ""
                        },
                        "streetNumber": "",
                        "suburb": ""
                    };
                    // return the location object
                    Ext.callback(callback.success, scope, [locationObj]);
                },
                failure: function() {
                    Ext.callback(callback.error, scope);
                }
            });



            // search via current location
        } else if (searchAddress.toLowerCase() == addressString.toLowerCase()) {
            // the address in the same as sent to the directions page use than address object
            //address.Street + ' ' + address.Suburb + ' ' + address.State + ' ' + address.Postcode;
            var locationObj = {
                "coordinates": {
                    "latitude": Number(directionPage.getLatlon()[0]),
                    "longitude": Number(directionPage.getLatlon()[1])
                },
                "postcode": address.Postcode,
                "state": address.State,
                "street": {
                    "directionalPrefix": "",
                    "directionalSuffix": "",
                    "fullName": address.Street,
                    "name": "",
                    "type": ""
                },
                "streetNumber": "",
                "suburb": address.Suburb
            };
            // return the location object
            Ext.callback(callback.success, scope, [locationObj]);
        } else {
            if (searchAddress.indexOf('NSW') == -1) {
                searchAddress += ' NSW';
            }
            if (searchAddress.indexOf('Australia') == -1) {
                searchAddress += ' Australia';
            }
            console.log('searchAddress: ' + searchAddress);
            // the user has entered their own custom address look that up
            escape.model.Directions.geocodeAddress(searchAddress, {
                success: function(addresses) {
                    console.log(addresses[0]);
                    var locationObj = {
                        "coordinates": {
                            "latitude": Number(addresses[0].lat),
                            "longitude": Number(addresses[0].lon)
                        },
                        "postcode": "",
                        "state": "",
                        "street": {
                            "directionalPrefix": "",
                            "directionalSuffix": "",
                            "fullName": "",
                            "name": "",
                            "type": ""
                        },
                        "streetNumber": "",
                        "suburb": ""
                    };
                    // return the location object
                    Ext.callback(callback.success, scope, [locationObj]);
                },
                failure: function() {
                    Ext.callback(callback.error, scope);
                }
            });
        }




    }
});