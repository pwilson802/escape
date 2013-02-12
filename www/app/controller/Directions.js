Ext.define('escape.controller.Directions', {
    extend: 'Ext.app.Controller',
    requires: ['escape.model.Directions', 'Ext.Panel'],
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
    loadLibaries: function(map) {
        var selfRef = this;
        escape.model.Map.loadFiles(
        true, {
            success: function() {
                 escape.model.Directions.setup(map);
            },
            error: function() {},
            scope: this
        });
    },
    mapCreated: function() {
        var selfRef = this;
        this.setTransportType('car');
        var map = this.getDirectionsPage().getMapDisplay().getMap();
        this.loadLibaries(map);
        this.getRouteBtn().enable();
        var transportBtn = this.getTransportBtn();
        escape.model.UserSettings.getSetting('transportType', {
            success: function(transportType) {
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
        var data = this.getRouteForm().getValues();
        this.getRouteList(data, {
            success: function(routeList) {
                selfRef.createRouteFromList(routeList);
            },
            failure: function() {
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
                        if (seg.travelTime >= 3600) {
                            travelTime = mathExt.roundNumber(((seg.travelTime / 60) / 60), 2) + ' hrs';
                        } else if (seg.travelTime >= 60) {
                            travelTime = mathExt.roundNumber((seg.travelTime / 60), 2) + ' mins';
                        } else {
                            travelTime = mathExt.roundNumber(seg.travelTime, 2) + ' sec';
                        }
                        console.log('seg.travelTime: ' + seg.travelTime + ' travelTime: ' + travelTime);

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
        var routeList = [];
        // find your start location
        this.getLocation(data.startLocation, {
            success: function(locationObj) {
                routeList.push(locationObj);
                // find your end location
                this.getLocation(data.endLocation, {
                    success: function(locationObj) {
                        routeList.push(locationObj);
                        //
                        Ext.callback(callback.success, scope, [routeList]);
                    },
                    failure: function() {
                        Ext.callback(callback.error, scope);
                    }
                }, this);
            },
            failure: function() {
                Ext.callback(callback.error, scope);
            }
        }, this);
    },
    getCurrentLocation: function(callback, scope) {
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
        var selfRef = this;
        var directionPage = this.getDirectionsPage();
        var address = directionPage.getAddress();
        var addressString = address.Street + ' ' + address.Suburb + ' ' + address.State + ' ' + address.Postcode;

        if (searchAddress.toLowerCase() == 'current location') {
            // find the usesr current locatio
            this.getCurrentLocation({
                success: function(position) {
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
                //searchAddress += ' Australia';
            }
            // the user has entered their own custom address look that up
            escape.model.Directions.geocodeAddress(searchAddress, {
                success: function(addresses) {
                    if (addresses.length == 1) {
                        // only one address returned use it for the search
                        var addressLoc = addresses[0].geocodedAddress;
                        var locationObj = {
                            "coordinates": {
                                "latitude": Number(addressLoc.centrePoint.lat),
                                "longitude": Number(addressLoc.centrePoint.lon)
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
                    } else if (addresses.length > 1) {
                        // multiable addresses returened ask the user which one they would like to use
                        var addressList = [];
                        for (var i = 0; i < addresses.length; i++) {
                            var addressDeatils = addresses[i].geocodedAddress;
                            var displayName = '';
                            if (addressDeatils.address.number !== '') {
                                displayName += addressDeatils.address.number + ' ';
                            }
                            if (addressDeatils.address.street.name !== '') {
                                displayName += addressDeatils.address.street.name + ' ';
                            }
                            if (addressDeatils.address.street.type !== '') {
                                displayName += addressDeatils.address.street.type + ' ';
                            }
                            if (addressDeatils.address.suburb !== '') {
                                displayName += addressDeatils.address.suburb + ' ';
                            }
                            if (addressDeatils.address.postcode !== '') {
                                displayName += addressDeatils.address.postcode + ' ';
                            }
                            // push the address into the list
                            addressList.push({
                                id: i,
                                displayName: displayName
                            });
                        }
                        // build the pop ups
                        var viewportsize = Ext.Viewport.getSize();
                        var addressListDisplay = Ext.create('Ext.List', {
                            itemTpl: '{displayName}',
                            data: addressList,
                            height: viewportsize.height - 80 - 43
                        });
                        // build the panel
                        var listPanel = Ext.create('Ext.Panel', {
                            modal: true,
                            centered: true,
                            cls: 'addressPicker',
                            hideOnMaskTap: false,
                            width: viewportsize.width - 80,
                            height: viewportsize.height - 80,
                            items: [{
                                xtype: 'toolbar',
                                title: 'Did you mean?'
                            }]
                        });
                        listPanel.add(addressListDisplay);
                        // add listeners
                        addressListDisplay.on('select', function(list, record) {
                            var addressLoc = addresses[record.getData().id].geocodedAddress;
                            var locationObj = {
                                "coordinates": {
                                    "latitude": Number(addressLoc.centrePoint.lat),
                                    "longitude": Number(addressLoc.centrePoint.lon)
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
                            Ext.callback(callback.success, scope, [locationObj]);
                            Ext.Viewport.remove(listPanel);

                        });
                        // add panel
                        Ext.Viewport.add(listPanel);
                    } else {
                        // no address found
                        Ext.callback(callback.error, scope);
                    }
                },
                failure: function() {
                    Ext.callback(callback.error, scope);
                }
            });
        }




    }
});