Ext.define("escape.view.page.Directions", {
    extend: 'escape.view.page.Page',
    xtype: 'directionsPage',
    requires: ['escape.view.ui.MapDisplay'],
    config: {
        pageTitle: 'Directions',
        rightBtn: '',
        listeners: {
            initialize: function() {
                this.buildMap();
            }
        }
    },
    buildMap: function() {
        this.setItems([{
            xtype: 'mapDisplay',
            height: Ext.Viewport.getSize().height - 43
        }]);
    }
});