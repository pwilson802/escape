Ext.define("escape.view.ui.MapDisplay", {
    extend: 'Ext.Container',
    requires: ['escape.utils.Maps', 'escape.model.MapFiles'],
    xtype: 'mapDisplay',
    config: {
        cls: 'mapDisplay',
        map: null,
        mapId: 0,
        width: '100%',
        built: false,
        intialMarkers: [],
        height: 150,
        zoomLevel: 12,
        lat: -33.873651,
        lon: 151.2068896,
        address: null,
        markerAtCenter: false,
        interaction: true,
        zoomToBounds: true,
        listeners: {
            initialize: 'initialize',
            painted: 'loadLibaries'
        }
    },
    initialize: function() {},
    loadLibaries: function() {
        if (this.getHeight() > 200) {
            this.addCls('mapLarge');
        }
        this.setMapId('mapContainier' + Math.random() * 1000000000);
        var divHeight = (isNaN(this.getHeight())) ? this.getHeight() : this.getHeight() + 'px';
        this.add({
            html: '<div id="' + this.getMapId() + '" style="width:100%; height:' + divHeight + ';"  class="mapHolder"></div>'
        });
        var selfRef = this;
        escape.model.MapFiles.loadRequiredFiles({
            success: function(results) {
                EMS.Util.getDomain = function() {
                    return "destinationnsw.com.au";
                };
                selfRef.createMapElement();
            },
            error: function(error) {},
            scope: this
        });
    },
    createMapElement: function() {
        if (!this.getBuilt()) {
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

            this.createWhereIsMap();
        }
    },
    createWhereIsMap: function() {
        var selfRef = this;
        var controls = [];
        map = new EMS.Services.Map(this.getMapId(), {
            controls: [],
            onInit: function() {
                selfRef.setupMap(map);
            }
        });
        this.setMap(map);

        //  Center the map
        lonlat = new EMS.LonLat(this.getLon(), this.getLat());
        map.setCenter(lonlat, this.getZoomLevel());
        this.setBuilt(true);

        // add any intial markers
        var intialMarkers = this.getIntialMarkers();
        // make sure the makers are added in the right order
        intialMarkers = intialMarkers.sort(function(obj1, obj2) {
            return Number(obj2.lat) - Number(obj1.lat);
        });
        for (var m = 0; m < intialMarkers.length; m++) {
            var marker = intialMarkers[m];
            this.addMarker(marker.lat, marker.lon, marker.data);
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
        // add zoom controls
        if (this.getInteraction()) {
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
    setupMap: function() {
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
    clearMarkers: function() {
        this.getMap().getLayersByName("Markers").destory();
        var markers = new OpenLayers.Layer.Markers("Markers");
        this.getMap().addLayer(markers);
    },
    zoomToMarkers: function() {
        var map = this.getMap();
        map.zoomToExtent(map.markersLayer.getDataExtent());
        this.setIntialMarkers([]);
    },
    addMarker: function(lat, lon, data) {
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



            // pin icon
            var imgPath = 'resources/images/pin_red.png';
            if (escape.utils.Img.useRetinaImg) {
                imgPath = 'resources/images/pin_red@2x.png';
            }
            var size = new OpenLayers.Size(45, 38);
            var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);




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



            icon = new OpenLayers.Icon(imgPath, size, offset);


            var lonlat = new EMS.LonLat(lon, lat);
            var marker = new OpenLayers.Marker(lonlat, icon);

            // custom marker
            map.markersLayer.addMarker(marker);
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
                console.log('!!!! marker div click');
                selfRef.fireEvent('markerSelected', data);
            });
        } else {
            this.getIntialMarkers().push({
                data: data,
                lat: lat,
                lon: lon
            });
        }

    }
});