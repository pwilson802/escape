Ext.define("escape.view.ui.MapDisplay", {
    extend: 'Ext.Container',
    requires: ['escape.utils.Maps', 'escape.model.Directions'],
    xtype: 'mapDisplay',
    config: {
        cls: 'mapDisplay',
        map: null,
        mapId: 0,
        width: '100%',
        built: false,
        intialMarkers: [],
        height: 140,
        zoomLevel: 15,
        lat: -33.873651,
        lon: 151.2068896,
        address: null,
        markerAtCenter: false,
        interaction: true,
        routeStyle: {
            strokeColor: '#0000ff',
            strokeOpacity: 0.5,
            strokeWidth: 5
        },
        listeners: {
            initialize: 'initialize',
            painted: 'loadLibaries'
        }
    },
    initialize: function() {},
    loadLibaries: function() {
        var loadFiles = false;
        try {
            new OpenLayers.Map();
        } catch (e) {
            loadFiles = true;
        }

        if (loadFiles) {
            var selfRef = this;
            LazyLoad.js(['resources/js/OpenLayers.js'], function() {
                selfRef.createMapElement();
            });
        } else {
            this.createMapElement();
        }

    },


    createMapElement: function() {
        if (!this.getBuilt()) {
            this.setMapId('mapContainier' + Math.random() * 1000000000);
            var divHeight = (isNaN(this.getHeight())) ? this.getHeight() : this.getHeight() + 'px';
            this.add({
                html: '<div id="' + this.getMapId() + '" style="width:100%; height:' + divHeight + ';"></div>'
            });
            this.add({
                html: '<div id="bing-map" style="width:0; height:0;"></div>'
            });
            this.add({
                xtype: 'button',
                cls: 'bing-logo',
                action: 'openBingTerms',
                bottom: 10,
                left: 10,
                width: 100,
                zIndex: 1000
            });
            this.buildMap();
        }


    },
    buildMap: function() {
        var bingMapsAPIKey = 'At6i83RWspt0FyjmEpFHnY3YGbguN21C40zyg6St8ab0xOYu38Vz2pAvTEb3iIJB';
        map = new OpenLayers.Map(this.getMapId(), {
            controls: []
        });
        this.setMap(map);
        if (this.getInteraction()) {
            map.addControl(new OpenLayers.Control.TouchNavigation());
            try {
                if (device.platform == 'Android') {
                    if (Number(device.version.split('.')[0]) < 4) {
                        map.addControl(new OpenLayers.Control.Zoom());
                    }
                }
            } catch (e) {

            }


        }

        var options = {
            name: "Road",
            key: bingMapsAPIKey,
            type: "Road"
        };

        // add map layer
        var mapLayer = new OpenLayers.Layer.Bing(options);
        // var mapLayer = new OpenLayers.Layer.OSM();
        map.addLayer(mapLayer);
        // create a point
        var lonLat = escape.utils.Maps.getLatLon(this.getLat(), this.getLon());
        // add the directions layer
        var directionsLayer = new OpenLayers.Layer.Vector("DirectionsLayer");
        map.addLayer(directionsLayer);
        // add a markers layer
        var markers = new OpenLayers.Layer.Markers("Markers");
        map.addLayer(markers);

        this.setBuilt(true);
        // terms layer
        // add a markers layer
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


        if (this.getMarkerAtCenter()) {
            var markerData = {
                latlon: [this.getLat(), this.getLon()],
                address: this.getAddress()
            };
            this.addMarker(this.getLat(), this.getLon(), markerData);
        }
        // position the map
        map.setCenter(lonLat, this.getZoomLevel());
        // show direction
        //this.getDirections('Sydney, Australia', 'Manly');
        //this.getOpenDirections();
        //this.getBingDirections();
        //this.addMarker(this.getLat(), this.getLon());
        if (intialMarkers.length > 0) {
            map.zoomToExtent(markers.getDataExtent());
            this.setIntialMarkers([]);
        }
        mapLayer.updateAttribution();
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
                imgPath = 'resources/images/markers/marker_' + iconNumber +''+imgSize+'.png';
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