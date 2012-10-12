Ext.define('escape.utils.Maps', {
    singleton: true,
    // returns a lat long object for open layers
    getLatLon: function(lat, lon) {
        var lonLat = new OpenLayers.LonLat(lon, lat).transform(
        new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
        map.getProjectionObject() // to Spherical Mercator Projection
        );
        return lonLat;
    },
    // returns a point object for open layers
    getPoint: function(lat, lon) {
        var point = new OpenLayers.Geometry.Point(lon, lat).transform(
        new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
        map.getProjectionObject() // to Spherical Mercator Projection
        );
        return point;
    },
    // creates a line feature from a google route object
    createGoogleRoute: function(route) {
        var pointsList = [];
        for (var i = route.overview_path.length - 1; i >= 0; i--) {
            var point = this.getPoint(route.overview_path[i].Ra, route.overview_path[i].Sa);
            pointsList.push(point);
        }
        return pointsList;
    },
    // creates a route from the mapquest directions service
    createMapQuestRoute: function(route) {
        var pointsList = [];
        for (var l = route.legs.length - 1; l >= 0; l--) {
            var leg = route.legs[l];
            for (var i = leg.maneuvers.length - 1; i >= 0; i--) {
                var step = leg.maneuvers[i];
                //var point = new OpenLayers.Geometry.Point(step.startPoint.lat, step.startPoint.lng);
                var point = this.getPoint(step.startPoint.lat, step.startPoint.lng);
                pointsList.push(point);
            }
        }
        return pointsList;
    },
    // creates a route from the mapquest directions service
    createBingRoute: function(route) {
        var pointsList = [];
            var cords = route.routePath.line.coordinates;
            for (var i = cords.length - 1; i >= 0; i--) {
                var p = cords[i];
               
                //var point = new OpenLayers.Geometry.Point(step.startPoint.lat, step.startPoint.lng);
                var point = this.getPoint(p[0], p[1]);
                pointsList.push(point);
            }
        return pointsList;
    }
});