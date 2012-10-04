Ext.define("escape.view.ui.MapDisplay", {
    extend: 'Ext.Container',
    requires: ['escape.utils.Maps','escape.model.MapFiles'],
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
        markerAtCenter: false,
        interaction: true,
        zoomToBounds: true,
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
    initialize: function() {
        this.setIntialMarkers([]);
    },
    loadLibaries: function() {
        var selfRef = this;
       escape.model.MapFiles.loadRequiredFiles({
            success: function(results) {
                selfRef.createMapElement();
            },
            error: function(error) {
            },
            scope: this
        });
    },
    createMapElement: function() {
        if (!this.getBuilt()) {
            //EMS.Services.communicationMode = "CrossDomain";
            this.setMapId('mapContainier' + Math.random() * 1000000000);
            var divHeight = (isNaN(this.getHeight())) ? this.getHeight() : this.getHeight() + 'px';
            this.add({
                html: '<div id="' + this.getMapId() + '" style="width:100%; height:' + divHeight + ';"></div>'
            });
            this.createWhereIsMap();
        }


    },
    createWhereIsMap: function() {
        var selfRef = this;
        map = new EMS.Services.Map(this.getMapId(), {
            controls: [],
            onInit: function() {
                //selfRef.buildMap();
            }
        });
        this.setMap(map);
        // if (this.getInteraction()) {
        //     map.addControl(new OpenLayers.Control.TouchNavigation());
        // }
        //  Center the map
        lonlat = new EMS.LonLat(this.getLon(), this.getLat());
        map.setCenter(lonlat, this.getZoomLevel());
        this.setBuilt(true);

        // add any intial markers
        var intialMarkers = this.getIntialMarkers();
        for (var m = 0; m < intialMarkers.length; m++) {
            var marker = intialMarkers[m];
            this.addMarker(marker.lat, marker.lon, marker.data);
        }

        if (this.getMarkerAtCenter()) {
            this.addMarker(this.getLat(), this.getLon());
        }

        if (intialMarkers.length > 1 && this.getZoomToBounds()) {
            map.zoomToExtent(map.markersLayer.getDataExtent());
            this.setIntialMarkers([]);
        }





        // var bingMapsAPIKey = 'Al4Lpuxeh5gEXn5qMCuA6thYde_HfPSh6LYjXKif__5rASQp07kfZjioy5d1Te_Y';
        // map = new OpenLayers.Map(this.getMapId(), {
        //     controls: []
        // });
        // if (this.getInteraction()) {
        //     map.addControl(new OpenLayers.Control.TouchNavigation());
        // }
        // var options = {
        //     key: bingMapsAPIKey
        // };
        // add map layer
        //var mapLayer = new OpenLayers.Layer.Bing(options);
        // var mapLayer = new OpenLayers.Layer.OSM();
        //map.addLayer(mapLayer);
        // create a point
        // var lonLat = escape.utils.Maps.getLatLon(this.getLat(), this.getLon());
        // // add the directions layer
        // var directionsLayer = new OpenLayers.Layer.Vector("DirectionsLayer");
        // map.addLayer(directionsLayer);
        // // add a markers layer
        // var markers = new OpenLayers.Layer.Markers("Markers");
        // map.addLayer(markers);
        // this.setBuilt(true);
        // // add any intial markers
        // var intialMarkers = this.getIntialMarkers();
        // for (var m = 0; m < intialMarkers.length; m++) {
        //     var marker = intialMarkers[m];
        //     this.addMarker(marker.lat, marker.lon, marker.data);
        // }
        // if (this.getMarkerAtCenter()) {
        //     this.addMarker(this.getLat(), this.getLon());
        // }
        // // position the map
        // map.setCenter(lonLat, this.getZoomLevel());
        // // show direction
        // //this.getDirections('Sydney, Australia', 'Manly');
        // //this.getOpenDirections();
        // //this.getBingDirections();
        // //this.addMarker(this.getLat(), this.getLon());
        // if (intialMarkers.length > 1) {
        //     map.zoomToExtent(markers.getDataExtent());
        //     this.setIntialMarkers([]);
        // }
    },
    addMarker: function(lat, lon, data) {
        if (this.getBuilt()) {
            var map = this.getMap();
            var imgPath = 'resources/images/pin_red.png';
            if (escape.utils.Img.useRetinaImg) {
                imgPath = 'resources/images/pin_red@2x.png';
            }
            var size = new OpenLayers.Size(45, 38);
            var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
            var icon = new OpenLayers.Icon(imgPath, size, offset);
            var lonlat = new EMS.LonLat(lon, lat);
            var marker = new OpenLayers.Marker(lonlat, icon);
            map.markersLayer.addMarker(marker);
            var selfRef = this;
            var markerClick = function(evt) {
                    selfRef.fireEvent('markerSelected', data);
                };
            marker.events.register('mousedown', marker, markerClick);
            marker.events.register('touchend', marker, markerClick);
        } else {
            this.getIntialMarkers().push({
                data: data,
                lat: lat,
                lon: lon
            });
        }

    },

    // addMarker: function(lat, lon, data) {
    //     if (this.getBuilt()) {
    //         var lonLat = escape.utils.Maps.getLatLon(lat, lon);
    //         var size = new OpenLayers.Size(45, 38);
    //         var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
    //         var imgPath = 'resources/images/pin_red.png';
    //         if (escape.utils.Img.useRetinaImg) {
    //             imgPath = 'resources/images/pin_red@2x.png';
    //         }
    //         var icon = new OpenLayers.Icon(imgPath, size, offset);
    //         var marker = new OpenLayers.Marker(lonLat, icon);
    //         this.getMap().getLayersByName("Markers")[0].addMarker(marker);
    //         var selfRef = this;
    //         var markerClick = function(evt) {
    //                 selfRef.fireEvent('markerSelected', data);
    //             };
    //         marker.events.register('mousedown', marker, markerClick);
    //         marker.events.register('touchend', marker, markerClick);
    //     } else {
    //         this.getIntialMarkers().push({
    //             data: data,
    //             lat: lat,
    //             lon: lon
    //         });
    //     }
    // },
    clearMarkers: function() {
        this.getMap().getLayersByName("Markers").destory();
        var markers = new OpenLayers.Layer.Markers("Markers");
        this.getMap().addLayer(markers);
    }

});