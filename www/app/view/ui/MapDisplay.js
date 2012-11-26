Ext.define("escape.view.ui.MapDisplay", {
    extend: 'Ext.Container',
    requires: ['escape.utils.Maps', 'escape.model.Map'],
    xtype: 'mapDisplay',
    config: {
        cls: 'mapDisplay',
        useOnlineMaps: true,
        forceUseOffline:false,
        map: null,
        created: false,
        mapId: 0,
        width: '100%',
        built: false,
        intialMarkers: [],
        height: 150,
        zoomLevel: 13,
        lat: -33.873651,
        lon: 151.2068896,
        address: null,
        markerAtCenter: false,
        locationMarker: null,
        interaction: true,
        zoomToBounds: true,
        listeners: {
            painted: 'createMapDom'
        }
    },
    createMapDom : function(){
        if (!this.getCreated()) {
            this.setCreated(true);
            if (this.getHeight() > 200) {
                this.addCls('mapLarge');
            } else {
                this.removeCls('mapLarge');
            }
            this.setMapId('mapContainier' + Math.random() * 1000000000);
            var divHeight = (isNaN(this.getHeight())) ? this.getHeight() : this.getHeight() + 'px';
            this.add({
                html: '<div id="' + this.getMapId() + '" style="width:100%; height:' + divHeight + ';"  class="mapHolder"></div>'
            });
        }
        this.loadLibaries();
    },
    loadLibaries: function() {
        // check to see if the user is online or not
        if (Ext.device.Connection.isOnline() && !escape.model.Map.getUseOffline() || this.getForceUseOffline()) {
            this.setUseOnlineMaps(true);
        } else {
             this.setUseOnlineMaps(false);
        }
        var selfRef = this;
        escape.model.Map.loadFiles(
        this.getUseOnlineMaps(), {
            success: function(results) {
                // if using online set up online maps
                if (selfRef.getUseOnlineMaps()) {
                    selfRef.buildWhereIsMap();
                } else {
                    selfRef.buildOfflineMap();
                }


            },
            error: function(error) {},
            scope: this
        });
    },
    getMarkerLayer: function() {
        var map = this.getMap();
        if (this.getUseOnlineMaps()) {
            return map.markersLayer;
        } else {
            return map.getLayersByName("Markers")[0];
        }

    },
    getLatLon: function(lat, lon) {
        if (this.getUseOnlineMaps()) {
            return new EMS.LonLat(lon, lat);
        } else {
            return escape.utils.Maps.getLatLon(lat, lon);
        }
    },
    buildWhereIsMap: function() {
        if (!this.getBuilt()) {
            var selfRef = this;
            EMS.Util.getDomain = function() {
                return "destinationnsw.com.au";
            };
            EMS.Services.communicationMode = "CrossDomain";
            // the map logo
            this.add({
                xtype: 'button',
                cls: 'map-provider-logo',
                action: 'openMapTerms',
                bottom: 10,
                left: 10,
                width: 100,
                zIndex: 1000
            });


            var controls = [];
            map = new EMS.Services.Map(this.getMapId(), {
                controls: [],
                onInit: function() {
                    selfRef.setUpWhereIsMap(map);
                }
            });
            this.setMap(map);
            //  Center the map
            lonlat = this.getLatLon(this.getLat(), this.getLon());
            map.setCenter(lonlat, this.getZoomLevel());
            this.setBuilt(true);
            this.defineMap();
            this.fireEvent('mapCreated', this);
        }
    },
    buildOfflineMap: function() {
        if (!this.getBuilt()) {
            //
            var options = {
                projection: "EPSG:900913",
                controls: []
            };
            //
            map = new OpenLayers.Map(this.getMapId(), options);

            if (this.getInteraction()) {
                map.addControl(new OpenLayers.Control.TouchNavigation());
            }


            this.setMap(map);
            // create the offline layer
            var mapLayer = new OpenLayers.Layer.OSM("OfflineMaps", "resources/maptiles/${z}/${x}/${y}.png", {
                numZoomLevels: 14,
                alpha: true,
                isBaseLayer: true
            });
            map.addLayer(mapLayer);
            // create a point
            var lonLat = escape.utils.Maps.getLatLon(this.getLat(), this.getLon());
            // add a markers layer
            var markers = new OpenLayers.Layer.Markers("Markers");
            map.addLayer(markers);

            this.setBuilt(true);
             // position the map
            map.setCenter(lonLat, this.getZoomLevel());
            this.defineMap();
            this.fireEvent('mapCreated', this);
        }
    },
    setUpWhereIsMap: function() {
        var map = this.getMap();
        if (this.getInteraction()) {
            if (hasTouch) {
                var iphoneControls = new EMS.Control.IPhoneDefaults({
                    supportsScale3d: true
                });
                map.iphoneControls = iphoneControls;
                map.addControl(iphoneControls);
            } else { //PC
                map.addControl(new OpenLayers.Control.KeyboardDefaults());
                map.addControl(new EMS.Control.MouseDefaults());
            }
        }

    },
    defineMap: function() {
        var map = this.getMap();
        // add any intial markers
        var intialMarkers = this.getIntialMarkers();
        // make sure the makers are added in the right order
        intialMarkers = intialMarkers.sort(function(obj1, obj2) {
            return Number(obj2.lat) - Number(obj1.lat);
        });
        for (var m = 0; m < intialMarkers.length; m++) {
            var marker = intialMarkers[m];
            this.addMarker(marker.lat, marker.lon, marker.data, marker.iconPath, marker.iconSize);
        }

        if (this.getMarkerAtCenter()) {
            var markerData = {
                latlon: [this.getLat(), this.getLon()],
                address: this.getAddress()
            };
            this.addMarker(this.getLat(), this.getLon(), markerData);
        }

        if (intialMarkers.length >= 1 && this.getZoomToBounds()) {
            map.zoomToExtent(map.markersLayer.getDataExtent());
            this.setIntialMarkers([]);
        }

        this.addControls();
    },
    addControls: function() {
        if (this.getInteraction()) {
            // show users location
            this.showUsersLoction();
            // add zoom controls
            try {
                if (!Ext.os.is.iOS) {
                    this.add({
                        xtype: 'button',
                        cls: 'zoomIn',
                        action: 'zoomIn',
                        top: 10,
                        right: 10,
                        height: 40,
                        width: 40,
                        zIndex: 1000
                    });
                    this.add({
                        xtype: 'button',
                        cls: 'zoomOut',
                        action: 'zoomOut',
                        top: 50,
                        right: 10,
                        height: 40,
                        width: 40,
                        zIndex: 1000
                    });
                }
            } catch (e) {

            }
        }
    },
    showUsersLoction: function() {
        var selfRef = this;
        // get the user location
        Ext.device.Geolocation.getCurrentPosition({
            success: function(position) {
                var yourlocation = selfRef.addMarker(position.coords.latitude, position.coords.longitude, null, 'resources/images/markers/marker_yourlocation.png', [17, 16], true);
                selfRef.setLocationMarker(yourlocation);
                selfRef.showUsersDirection();
            },
            failure: function() {
                Ext.callback(callback.error, scope);
            }
        }, this);
    },
    showUsersDirection: function() {
        //  var selfRef = this;
        //  try {
        //      navigator.compass.getCurrentHeading(function(heading) {
        //          console.log('heading: ' + heading);
        //      }, function() {
        //          console.log('error getthing the users diection');
        //      });
        //  } catch (e) {
        //  }
        //  var yourlocationMarker = selfRef.getLocationMarker();
        //  var origin = new OpenLayers.Geometry.Point(yourlocationMarker.lonlat);
        // new  OpenLayers.Feature(yourlocationMarker).geometry.rotate(90, origin);
    },

    clearMarkers: function() {
        if (this.getUseOnlineMaps()) {
            this.getMarkerLayer().clearMarkers();
        } else {
            this.getMap().getLayersByName("Markers")[0].destroy();
            var markers = new OpenLayers.Layer.Markers("Markers");
            this.getMap().addLayer(markers);
        }
    },
    zoomToMarkers: function() {
        var map = this.getMap();
        map.zoomToExtent(this.getMarkerLayer().getDataExtent());
        this.setIntialMarkers([]);
    },
    addMarker: function(lat, lon, data, imgPath, iconSize, centre) {
        if (this.getBuilt()) {
            var map = this.getMap();
            var icon;
            var useIcon = true;
            try {
                var d = data.iconText;
                if (!d) {
                    useIcon = false;
                }
            } catch (e) {
                useIcon = false;
            }

            if (imgPath) {
                if (escape.utils.Img.useRetinaImg) {
                    // use 2x icon if needed
                    imgPath = imgPath.split('.png')[0] + '@2x.png';
                }
            } else {
                // use default icon
                imgPath = 'resources/images/pin_red.png';
                if (escape.utils.Img.useRetinaImg) {
                    imgPath = 'resources/images/pin_red@2x.png';
                }
            }
            // pin icon
            var size = new OpenLayers.Size(45, 38);
            if (iconSize) {
                size = new OpenLayers.Size(iconSize[0], iconSize[1]);

            }
            var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
            if (centre) {
                offset = new OpenLayers.Pixel(-(size.w / 2), -(size.h / 2));
            }


            if (useIcon) {
                size = new OpenLayers.Size(50, 42);
                var iconNumber = (Number(data.iconText));
                iconNumber = (iconNumber > 99) ? 'star' : iconNumber;
                var imgSize = '';
                if (window.devicePixelRatio > 1.2) {
                    imgSize = '@2x';
                }
                imgPath = 'resources/images/markers/marker_' + iconNumber + '' + imgSize + '.png';
            }
            //
            icon = new OpenLayers.Icon(imgPath, size, offset);
            //
            var lonlat = this.getLatLon(lat, lon);
            var marker = new OpenLayers.Marker(lonlat, icon);

            // custom marker
            this.getMarkerLayer().addMarker(marker);
            var selfRef = this;
            var markerClick = function(evt) {
                    selfRef.fireEvent('markerSelected', data);
                };
            marker.events.register('click', marker, markerClick);
            // marker.events.register('mousedown', marker, markerClick);
            // marker.events.register('touchend', marker, markerClick);
            // marker.events.register("touchstart", marker, function(e) {
            // });
            icon.imageDiv.addEventListener('touchend', function() {
                selfRef.fireEvent('markerSelected', data);
            });
            return marker;
        } else {
            this.getIntialMarkers().push({
                data: data,
                lat: lat,
                lon: lon
            });
        }

    }
});