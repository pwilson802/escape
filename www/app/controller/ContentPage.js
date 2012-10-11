Ext.define('escape.controller.ContentPage', {
    extend: 'Ext.app.Controller',
    requires: ['escape.model.ContentPage'],
    config: {
        refs: {},
        selectedRecord: null,
        control: {
            'contentPage': {
                openView: 'loadContent'
            },
            'list[action=contentPageChange]': {
                select: 'openPage'
            },
            'contentPage list[action=productList]': {
                select: 'productSelected'
            }
        }
    },
    productSelected: function(list, record) {
        var data = record.getData();
        escape.utils.AppVars.currentSection.getNavigationView().push({
            pageTitle: data.type.toProperCase(),
            xtype: 'productPage',
            productId: data.productId,
            productType: data.type
        });
    },
    loadContent: function(contentPage) {
        contentPage.setItems({
            xtype: 'loadingDisplay'
        });
        var selfRef = this;
        // load the content data
        escape.model.ContentPage.getProxy().setUrl(contentPage.getContentPath());
        escape.model.ContentPage.load(0, {
            success: function(content) {
                var processedContent = escape.model.Content.process(content.getData());

                contentPage.buildPage(processedContent);
                //
                for (var i = 0; i < processedContent.productLists.length; i++) {
                    var productList = processedContent.productLists[i];
                    if (productList.type == 'mustDo') {
                        selfRef.loadMustDos(productList.url, contentPage);
                        break;
                    }
                }
            },
            error: function(error) {},
            scope: this
        });
    },
    loadMustDos: function(url, contentPage) {
        var selfRef = this;
        escape.model.ContentPage.getProxy().setUrl(url);
        escape.model.ContentPage.load(0, {
            success: function(content) {
                selfRef.mustDosLoaded(content.getData(), contentPage);
            },
            error: function(error) {},
            scope: this
        });
    },

    mustDosLoaded: function(content, contentPage) {
        var linksStartBreakdown = content.description.split('<a href="');
        var output = '';
        var mustDoItems = [];
        for (var i = 0; i < linksStartBreakdown.length; i++) {
            var linksEndBreakdown = linksStartBreakdown[i].split('</a>');
            if (linksEndBreakdown.length > 1) {
                // process the link
                var linkParts = linksEndBreakdown[0].split('">');
                var link = linkParts[0];
                var linkText = linkParts[1];
                var urlBreakdown = link.split('/');
                var type = urlBreakdown[urlBreakdown.length - 2];
                var productId = urlBreakdown[urlBreakdown.length - 1];
                if (type == 'attractions') {
                    type = 'attraction';
                }
                if (type !== null && productId !== null) {
                    var typeAllowed = false;
                    for (var t = escape.utils.AppVars.collectionMapping.length - 1; t >= 0; t--) {
                        if (type == escape.utils.AppVars.collectionMapping[t].matrix) {
                            typeAllowed = true;
                            break;
                        }
                    }
                    if (typeAllowed) {
                        mustDoItems.push({
                            name: linkText,
                            type: type,
                            productId: productId
                        });
                    }
                }
            }
        }
        if (mustDoItems.length > 0) {
            var container = contentPage.getComponent('mustDoPlaceHolder');
            console.log(container);
            container.add({
                html: '<h2>Must Do\'s</h2>',
                padding: '0 10px'
            });
            container.add({
                xtype: 'list',
                action: 'productList',
                margin: '0 10 10 10',
                itemTpl: '{name}',
                cls: 'pageList',
                scrollable: false,
                data: mustDoItems
            });
        }
    },
    openPage: function(list, record) {
        var changeAllowed = true;
        this.setSelectedRecord(record);
        console.log(record);
        // Content Page
        var data = record.getData();
        console.log(data);
        var xtype = (data.xtype) ? data.xtype : 'contentPage';
        if (data.typeId == 'like-a-local') {
            xtype = 'townsSubSection';
        }
        console.log('list.subPageXtype: ' + list.subPageXtype);
        if (list.subPageXtype) {
            // let the list overwrite the page type
            xtype = list.subPageXtype;
        }
        console.log('xtype: ' + xtype);
        escape.utils.AppVars.currentSection.getNavigationView().push({
            pageTitle: data.Name,
            xtype: xtype,
            contentPath: data.Url
        });
    }
});