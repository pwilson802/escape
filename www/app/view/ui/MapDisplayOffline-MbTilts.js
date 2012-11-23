Ext.define("escape.view.ui.MapDisplayOffline", {
    extend: 'Ext.Container',
    requires: ['escape.utils.Maps', 'escape.model.MapFiles'],
    xtype: 'mapDisplayOffline',
    config: {
        cls: 'mapDisplay',
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
            initialize: 'initialize',
            painted: 'loadLibaries'
        }
    },
    initialize: function() {},
    loadLibaries: function() {
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

        var selfRef = this;
        escape.model.Map.loadOfflineRequiredFiles({
            success: function(results) {
                selfRef.buildMap();
            },
            error: function(error) {},
            scope: this
        });

    },



    buildMap: function() {
        if (!this.getBuilt()) {
            var options = {
                projection: "EPSG:900913",
                controls: []
            };
            map = new OpenLayers.Map(this.getMapId(), options);
            this.setMap(map);
            // if (this.getInteraction()) {
            //     map.addControl(new OpenLayers.Control.TouchNavigation());
            //     try {
            //         if (device.platform == 'Android') {
            //             if (Number(device.version.split('.')[0]) < 4) {
            //                 map.addControl(new OpenLayers.Control.Zoom());
            //             }
            //         }
            //     } catch (e) {
            //     }
            // }
            map.addControl(new OpenLayers.Control.Zoom());
            // create the offline layer
            var mapLayer = new OpenLayers.Layer.TMS("offlineMaps", "", {
                getURL: this.getMbtilesURL,
                isBaseLayer: true
            });
            map.addLayer(mapLayer);
            // create a point
            var lonLat = escape.utils.Maps.getLatLon(this.getLat(), this.getLon());
            // add a markers layer
            var markers = new OpenLayers.Layer.Markers("Markers");
            map.addLayer(markers);

            this.setBuilt(true);
            // add any intial markers
            var intialMarkers = this.getIntialMarkers();
            if (intialMarkers.length > 0) {
                // make sure the makers are added in the right order
                intialMarkers = intialMarkers.sort(function(obj1, obj2) {
                    return Number(obj2.lat) - Number(obj1.lat);
                });
                for (var m = 0; m < intialMarkers.length; m++) {
                    var marker = intialMarkers[m];
                    this.addMarker(marker.lat, marker.lon, marker.data);
                }
            }
            // add marker at the center
            if (this.getMarkerAtCenter()) {
                var markerData = {
                    latlon: [this.getLat(), this.getLon()],
                    address: this.getAddress()
                };
                this.addMarker(this.getLat(), this.getLon(), markerData);
            }
            // position the map
            map.setCenter(lonLat, this.getZoomLevel());
            if (intialMarkers.length > 0) {
                map.zoomToExtent(markers.getDataExtent());
                this.setIntialMarkers([]);
            }
        }
    },
    getMbtilesURL: function(bounds) {
        var map = this.map;
        //return 'http://b.tile.openstreetmap.org/12/3754/2499.png';
        var dbName = "SydneyMap.mbtiles";
        var res = this.map.getResolution();
        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
        var z = this.map.getZoom();
        // Deal with Bing layers zoom difference...
        if (this.map.baseLayer.CLASS_NAME == 'OpenLayers.Layer.VirtualEarth' || this.map.baseLayer.CLASS_NAME == 'OpenLayers.Layer.Bing') {
            z = z + 1;
        }
        // var url = 'http://localhost/escape/mbtiles.php' + "?db=" + dbName + "&z=" + z + "&x=" + x + "&y=" + ((1 << z) - y - 1);
        // look up the tile layer in the database
        var db = escape.utils.DatabaseManager.getBDConn('offlineMap');
        db.queryDB("SELECT * FROM tiles WHERE zoom_level = ? AND tile_column = ? AND tile_row = ?", function(t, rs) {
            // a result was found
            console.log('success selecting tiles');
            if (rs.rows.length > 0) {
                // tile found
                return 'data:image/gif;base64,' + rs.rows.item(0)['tile_data'];
            } else {
                // no row found
                return '';
            }
        }, function(t, e) {
            // select error
            console.log('error selecting tiles');
            return '';
        }, [z, x, y]);
    },
    addMarker: function(lat, lon, data) {
        if (this.getBuilt()) {
            var lonLat = escape.utils.Maps.getLatLon(lat, lon);
            var size = new OpenLayers.Size(45, 38);

            var imgPath = 'resources/images/pin_red.png';
            if (escape.utils.Img.useRetinaImg) {
                imgPath = 'resources/images/pin_red@2x.png';
            }

            var useIcon = true;
            try {
                var d = data.iconText;
                if (!d) {
                    useIcon = false;
                }
            } catch (e) {
                useIcon = false;
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

            var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);



            var icon = new OpenLayers.Icon(imgPath, size, offset);
            var marker = new OpenLayers.Marker(lonLat, icon);
            this.getMap().getLayersByName("Markers")[0].addMarker(marker);
            var selfRef = this;
            var markerClick = function(evt) {
                    evt.preventDefault();
                    selfRef.fireEvent('markerSelected', data);
                };
            if (Ext.feature.has.Touch) {
                marker.events.register('touchend', marker, markerClick);
            } else {
                marker.events.register('mousedown', marker, markerClick);
            }


        } else {
            this.getIntialMarkers().push({
                data: data,
                lat: lat,
                lon: lon
            });
        }

    },
    zoomToMarkers: function() {
        var map = this.getMap();
        var markers = map.getLayersByName("Markers")[0];
        map.zoomToExtent(markers.getDataExtent());
    },
    clearMarkers: function() {
        this.getMap().getLayersByName("Markers")[0].destory();
        var markers = new OpenLayers.Layer.Markers("Markers");
        this.getMap().addLayer(markers);
    }

});