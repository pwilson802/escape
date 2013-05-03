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
        console.log('show page');
        console.log(content);
        this.setContent(content);
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
                    defaults: {
                        flex: 1
                    },
                    items: [{
                        text: 'About',
                        type: 'about',
                        action: 'aboat',
                        pressed: true

                    }, {
                        text: 'Must do',
                        type: 'mustDo',
                        action: 'mustDo',
                        flex: 1,
                        url: productList.url
                    }]
                });
                break;
            }
        }
        var pageItems = escape.model.Content.buildItems(content);
        // Don't show share button when offline.
        if (Ext.device.Connection.isOnline()){
            // add share this app button
            var urlBreakdown = this.getContentPath().split('/');
            if (urlBreakdown[urlBreakdown.length - 1].indexOf('about-destination-nsw') != -1) {
                if (content.page.hasOwnProperty("External-Links")) {
                    var appStoreURL;
                    var googlePlayURL;
                    for (var l = content.page['External-Links'].length - 1; l >= 0; l--) {
                        var link = content.page['External-Links'][l];
                        if (link.Name.indexOf("Apple App Store")) {
                            appStoreURL = link.Url;
                        }
                        if (link.Name.indexOf("Google Play")) {
                            googlePlayURL = link.Url;
                        }
                    }
                    var appLink = (Ext.os.is.iOS) ? appStoreURL : googlePlayURL;
                    AppSettings.defualtShareData.link = appLink;
                }
                pageItems.pop();
                pageItems.push({
                    margin: 10,
                    xtype: 'button',
                    text: 'Share this App',
                    cls: 'shareAppBtn',
                    action: 'shareApp'
                });
                pageItems.push({
                    xtype: 'footer'
                });
            }
        }
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
        this.setItems(items);
        this.fireEvent('built');
    }
});