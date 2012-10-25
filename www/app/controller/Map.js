Ext.define('escape.controller.Map', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {},
        control: {
            'mapDisplay button[action=zoomIn]': {
                tap: 'zoomIn'
            },
            'mapDisplay button[action=zoomOut]': {
                tap: 'zoomOut'
            }
        }
    },
    // zoomIn
    zoomIn: function(btn) {

        var mapDisplay = btn.parent;
        var map = mapDisplay.getMap();
        var zoomLevel = map.zoom;
        if (zoomLevel < 16) {
            zoomLevel++;
        }
        map.zoomTo(zoomLevel);
    },
    // zoomOut
    zoomOut: function(btn) {
        console.log('zoomOut');
        var mapDisplay = btn.parent;
        var map = mapDisplay.getMap();
        var currentZoom = map.zoom;
        var zoomLevel = map.zoom;
        if (zoomLevel > 0) {
            zoomLevel--;
        }
        map.zoomTo(zoomLevel);
    }

});