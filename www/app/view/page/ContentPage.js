Ext.define("escape.view.page.ContentPage", {
    extend: 'escape.view.page.Page',
    requires: ['escape.view.ui.ContentImg', 'escape.model.ProductList'],
    xtype: 'contentPage',
    config: {
        content: null,
        contentPath: '',
        productLists: [],
        rightBtn: 'hide',
        padding: '0 0 0 0',
        subPageXtype : null,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        }
    },
    //
    buildPage: function(content) {
        this.setContent(content);
        console.log(content);
        var items =  escape.model.Content.buildItems(content);
        this.setItems(items);
        this.fireEvent('built');
    }
});

