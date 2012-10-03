Ext.define("escape.model.Content", {
    singleton: true,
    config: {},
    process: function(content) {
        // parse over the content
        content.productLists = [];
        // parse children for must do links
        if (content.children) {
            var newChirldren = [];
            if (content.children.length > 0) {
                for (var c = 0; c < content.children.length; c++) {
                    var childLink = content.children[c];
                    if (childLink.Url.indexOf('must-do-links') != -1) {
                        content.productLists.push({
                            name: 'Must Do',
                            url: childLink.Url,
                            type: 'mustDo'
                        });
                    } else {
                        newChirldren.push(childLink);
                    }
                }
            }
            // remove any product list
            content.children = newChirldren;
        }
        // parse external links for product list
        var externalLinks = content.page['External-Links'];
        if (externalLinks) {
            var newExternalLinks = [];
            if (externalLinks.length > 0) {
                for (var e = 0; e < externalLinks.length; e++) {
                    var externalLink = externalLinks[e];
                    if (externalLink.Url.indexOf('product-list-generator') != -1) {
                        content.productLists.push({
                            name: externalLink.Name,
                            url: externalLink.Url,
                            type: 'productList'
                        });
                    } else {
                        newExternalLinks.push(externalLink);
                    }
                }
            }
            // remove any product list
            content.page['External-Links'] = newExternalLinks;
        }
        return content;
    },
    buildItems: function(content, subPageXtype) {
        subPageXtype = (!subPageXtype) ? 'contentPage' : subPageXtype;
        // screen size
        var viewportSize = Ext.Viewport.getSize();
        var screenWidth = viewportSize.width;
        //
        var items = [];
        // create images
        if (content.images.length > 1) {
            var caroselImages = [];
            for (var i = 0; i < content.images.length; i++) {
                caroselImages.push({
                    xtype: 'contentImg',
                    width: screenWidth,
                    height: 200,
                    imagePath: content.images[i]['Full Size'],
                    altText: content.images[i]['Alt']
                });
            }
            var indicator = (content.images.length > 1) ? true : false;
            items.push({
                xtype: 'carousel',
                indicator: indicator,
                height: 200,
                items: caroselImages
            });
        }
        // create map
        if (content.geolocation !== null) {
            items.push({
                xtype: 'mapDisplay',
                lat: Number(content.geolocation.Latitude),
                lon: Number(content.geolocation.Longitude),
                interaction: false,
                markerAtCenter: true
            });
        }
        // add the description
        if (content.description !== '' & content.description !== null & content.description !== undefined) {
            var description = escape.utils.AppFuncs.parseCMSText(content.description);
            items.push({
                xtype: 'expandableInfo',
                showBorder: false,
                completeText: description,
                showParagraphs: 3
            });
        }
        // check to see if the page has child pages
        if (content.children.length > 0) {
            items.push({
                xtype: 'list',
                action: 'contentPageChange',
                margin: '10 10 10 10',
                itemTpl: '{Name}',
                cls: 'selectionList',
                subPageXtype: subPageXtype,
                scrollable: false,
                data: this.buildChildren(content.children)
            });
        }
        return items;
    },

    buildChildren: function(children) {
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var urlBreakdown = child.Url.split('/');
            var typeId = urlBreakdown[urlBreakdown.length - 1];
            child.typeId = typeId;
        }
        return children;
    }
});