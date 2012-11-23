Ext.define("escape.view.page.Map", {
    extend: 'escape.view.page.Page',
    xtype: 'mapPage',
    requires: ['escape.view.ui.MapDisplay'],
    config: {
        pageTitle: 'Map',
        rightBtn: '',
        address: null,
        latlon: AppSettings.center,
        mapDisplay: null,
        pageTypeId: 6,
        pageTrackingId: 6,
        zoomLevel:13,
        cls: 'mapPage'
    },
    openView: function() {
        var address = this.getAddress();

        var mapHeight = Ext.Viewport.getSize().height - 43;
         if (address) {
            mapHeight = Ext.Viewport.getSize().height - 163;
         }


        var mapDisplay = Ext.create('escape.view.ui.MapDisplay', {
            height: mapHeight,
            lat: Number(this.getLatlon()[0]),
            lon: Number(this.getLatlon()[1]),
            zoomLevel: this.getZoomLevel(),
            interaction: true,
            markerAtCenter: true
        });
        this.setMapDisplay(mapDisplay);
        this.setItems(mapDisplay);

        if (address) {
            var addressString = address.Street + '</br>' + address.Suburb + ' ' + address.State + ' ' + address.Postcode;
            this.add({
                xtype: 'container',
                height: 120,
                cls: 'mapAddress',
                html: addressString
            });
        }

    }
});