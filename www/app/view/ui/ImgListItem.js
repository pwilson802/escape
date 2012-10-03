Ext.define("escape.view.ui.ImgListItem", {
    extend: 'Ext.Container',
    xtype: 'imgListItem',
    config: {
        imagePath: '',
        width: 320,
        height: 200,
        title:"Title",
        items: [{
            html: '<div>{title}</div>'
        }, {
            xtype: 'appImage',
            imagePath: '{imagePath}'
        }]
    }
});