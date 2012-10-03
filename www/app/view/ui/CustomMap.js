Ext.define("escape.view.ui.OpenLayersMap", {
    extend: 'Ext.Container',
    requires: ['escape.utils.OpenLayers'],
    xtype: 'openLayersMap',
    config: {
        map: null,
        mapId: 0,
        width: 320,
        height: 150,
        listeners: {
            initialize: 'createMapElement',
            painted: 'buildMap'
        }
    },
    createMapElement: function() {
        this.setMapId('mapContainier'+ Math.random()*1000000000);
        this.add({
            html: '<div id="'+this.getMapId()+'" style="width:100%; height:'+this.getHeight()+'px;"></div>'
        });

    },
    buildMap: function() {
        map = new OpenLayers.Map(this.getMapId(), {
            controls: []
        });
        this.setMap(map);
        map.addControl(new OpenLayers.Control.TouchNavigation());
        // add map layer
        map.addLayer(new OpenLayers.Layer.OSM());
        // create a point
        var lonLat = escape.utils.OpenLayers.getLatLong(-33.873651, 151.2068896);
        // add the directions layer
        var directionsLayer = new OpenLayers.Layer.Vector("DirectionsLayer");
        map.addLayer(directionsLayer);
        // add a markers layer
        var markers = new OpenLayers.Layer.Markers("Markers");
        map.addLayer(markers);
        markers.addMarker(new OpenLayers.Marker(lonLat));
        // position the map
        map.setCenter(lonLat, 13);
        //this.getDirections();
    }
    /**
    getDirections: function() {
        var directionsService = new google.maps.DirectionsService();
        var start = 'Sydney, Austraila';
        var end = '21 Margaret Street Fairlight';
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
        var selfRef = this;
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                var routePoints = escape.utils.OpenLayers.createRoute(response.routes[0]);
                var line = new OpenLayers.Geometry.LineString(routePoints);
                var style = {
                    strokeColor: '#0000ff',
                    strokeOpacity: 0.5,
                    strokeWidth: 5
                };
                var lineFeature = new OpenLayers.Feature.Vector(line, null, style);
                selfRef.getMap().getLayersByName("DirectionsLayer")[0].addFeatures([lineFeature]);
            }
        });
    }
    **/
});