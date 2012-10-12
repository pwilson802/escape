Ext.define("escape.view.page.Map", {
    extend: 'escape.view.page.Page',
    xtype: 'mapPage',
    requires: ['escape.view.ui.MapDisplay'],
    config: {
        pageTitle: 'Map',
        rightBtn: '',
        address: null,
        latlon: null,
        mapDisplay: null
    },
    openView: function() {
        var address = this.getAddress();
        var addressString = address.Street + '</br>' + address.Suburb + '</br>' + address.State + '</br>' + address.Postcode;

        var mapDisplay = Ext.create('escape.view.ui.MapDisplay', {
            height: Ext.Viewport.getSize().height - 143,
            lat: Number(this.getLatlon()[0]),
            lon: Number(this.getLatlon()[1]),
            interaction: true,
            markerAtCenter: true
        });
        this.setMapDisplay(mapDisplay);
        this.setItems(mapDisplay);
        this.add({
            xtype: 'container',
            height:100,
            cls: 'mapAddress',
            html: addressString
        });
    }
});