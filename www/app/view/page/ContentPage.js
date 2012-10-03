Ext.define("escape.view.page.ContentPage", {
    extend: 'escape.view.page.Page',
    requires: ['escape.view.ui.ContentImg', 'escape.model.ProductList'],
    xtype: 'contentPage',
    config: {
        content: null,
        contentPath: '',
        productLists: [],
        rightBtn: 'hide',
        padding: '10px 0 0 0',
        subPageXtype : null,
        items: [{
            xtype: 'loadingDisplay'
        }],
        scrollable: {
            direction: 'vertical',
            directionLock: true
        }
    },
    contentLoaded: function(content) {
        this.setContent(content);
        // Parse externalLinks
        content = escape.model.Content.process(content);
        this.buildPage();
    },
    //
    buildPage: function() {
        content = this.getContent();
        var items =  escape.model.Content.buildItems(content);
        this.setItems(items);
        this.fireEvent('built');
    }
});

