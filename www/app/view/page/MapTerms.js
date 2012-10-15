Ext.define("escape.view.page.MapTerms", {
    extend: 'escape.view.page.Page',
    xtype: 'mapTerms',
    requires: [''],
    config: {
        rightBtn: '',
        pageTitle: 'Map Terms',
        pageTypeId: 6,
        pageTrackingId: 20,
        latlon: null,
        address: null,
        cls:'mapTerms',
        items: [{
            padding:'60px 10px 10px 10px',
            html: '<p>Map Terms</p>'
        }]
    },
    openView: function() {
    }
});