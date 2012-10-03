Ext.define("escape.view.ui.ProductListItem", {
    extend: 'Ext.Button',
    xtype: 'productListItem',
    requires: ['Ext.Button'],
    config: {
        cls: 'productListItem',
        tpl: '<h3>{name}</h3><h4>{suburb}</h4><div class="productImg" style="background-image:url({imagePath});"></div>'
    }
});