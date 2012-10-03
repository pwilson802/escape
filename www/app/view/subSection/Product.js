Ext.define("escape.view.subSection.Product", {
    extend: 'escape.view.subSection.SubSection',
    xtype: 'productSubSection',
    requires: [],
    config: {
        content: null,
        cardViewItemId: 1,
        contentPath: '',
        items: [{
            xtype: 'loadingDisplay'
        }],
        layout:'vbox'
    }
});