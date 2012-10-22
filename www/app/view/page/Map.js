Ext.define("escape.view.page.Map", {
    extend: 'escape.view.page.Page',
    xtype: 'mapPage',
    requires: ['escape.view.ui.MapDisplay'],
    config: {
        pageTitle: 'Map',
        rightBtn: '',
        address: null,
        latlon: null,
        mapDisplay: null,
        pageTypeId: 6,
        pageTrackingId: 6,
        cls:'mapPage'
    },
    openView: function() {
        var address = this.getAddress();
        var addressString = address.Street + '</br>' + address.Suburb + ' ' + address.State + ' ' + address.Postcode;

        var mapDisplay = Ext.create('escape.view.ui.MapDisplay', {
            height: Ext.Viewport.getSize().height - 163,
            lat: Number(this.getLatlon()[0]),
            lon: Number(this.getLatlon()[1]),
            interaction: true,
            markerAtCenter: true
        });
        this.setMapDisplay(mapDisplay);
        this.setItems(mapDisplay);
        this.add({
            xtype: 'container',
            height: 120,
            cls: 'mapAddress',
            html: addressString
        });
    }
});