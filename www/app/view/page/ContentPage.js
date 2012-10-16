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
        subPageXtype: null,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        pageTypeId: 1,
        pageTrackingId: 0
    },
    //
    buildPage: function(content) {
        this.setContent(content);
        console.log('content');
        var items = [];
        for (var i = 0; i < content.productLists.length; i++) {
            var productList = content.productLists[i];
            if (productList.type == 'mustDo') {
                items.push({
                    xtype: 'segmentedbutton',
                    layout: 'hbox',
                    allowMultiple: false,
                    allowDepress: false,
                    docked: 'top',
                    items: [{
                        text: 'About',
                        type: 'about',
                        action: 'aboat',
                        pressed: true,
                        flex: 1
                    }, {
                        text: 'Must Do',
                        type: 'mustDo',
                        action: 'mustDo',
                        flex: 1
                    }]
                });
                break;
            }
        }
        var pageItems = escape.model.Content.buildItems(content);
        //var fullItems = menuItems.concat(items);
        var viewportSize = Ext.Viewport.getSize();

        if (items.length > 0) {
            this.setScrollable(false);
            // there is a menu
            // items.push({
            //     xtype: 'container',
            //     itemId: 'contents',
            //     height: 2000,
            //     scrollable: {
            //         direction: 'vertical',
            //         directionLock: true
            //     },
            //     items: pageItems
            // });
            items.push({
                xtype: 'container',
                layout: 'card',
                 itemId: 'cardView',
                width: viewportSize.width,
                height: viewportSize.height - 89,
                items: {
                    xtype: 'container',
                    width: viewportSize.width,
                    scrollable: {
                        direction: 'vertical',
                        directionLock: true
                    },
                    itemId: 'contents',
                    items: pageItems
                }
            });
        } else {
            items = pageItems;
        }
        console.log(items)
        this.setItems(items);
        this.fireEvent('built');
    }
});