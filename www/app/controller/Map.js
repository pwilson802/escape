Ext.define('escape.controller.Map', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            mapDisplay: 'mapDisplay'
        },
        control: {
            'mapDisplay button[action=zoomIn]': {
                tap: 'zoomIn'
            },
            'mapDisplay button[action=zoomOut]': {
                tap: 'zoomOut'
            },
            'mapDisplay': {
                pinchStart: 'pinchStart',
                pinchEnd: 'pinchEnd'
            },
            'mapDisplayOffline button[action=zoomIn]': {
                tap: 'zoomIn'
            },
            'mapDisplayOffline button[action=zoomOut]': {
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
        var mapDisplay = btn.parent;
        var map = mapDisplay.getMap();
        var currentZoom = map.zoom;
        var zoomLevel = map.zoom;
        if (zoomLevel > 0) {
            zoomLevel--;
        }
        map.zoomTo(zoomLevel);
    },
    pinchStart: function() {
        console.log('controller pinchStart');
        this.getMapDiplay().setPinching(true);
    },
    pinchEnd: function() {
        console.log('controller pinchEnd');
        this.getMapDiplay().setPinching(false);
    }
});