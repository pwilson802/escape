Ext.define("escape.view.ui.ScrollToTopBtn", {
    extend: 'Ext.Container',
    xtype: 'scrollTopTopBtn',
    config: {
        cls: 'scrollTopTopContainer',
        top: 0,
        left: 60,
        width: 10,
        height: 43,
        itemId:'topContainer',
        layout:'fit',
        items: [{
            xtype: 'button',
            itemId:'topBtn',
            action: 'scrollToTop',
            cls: 'scrollTopTopBtn',
            html:''
        }]
    }
});