Ext.define("escape.view.ui.Footer", {
    extend: 'Ext.Container',
    xtype: 'footer',
    config: {
        cls: 'footer',
        items: [{
            xtype: 'component',
            cls: 'border'
        }, {
            xtype: 'component',
            cls: 'logo'
        }]
    }
});