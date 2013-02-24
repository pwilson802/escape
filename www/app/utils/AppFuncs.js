Ext.define('escape.utils.AppFuncs', {
    singleton: true,
    openLink: function(url) {
        cb = window.plugins.childBrowser;
        cb.showWebPage(url);
        escape.utils.Tracking.trackEventOnCurrent(7);
    },
    trackPhoneCall: function() {
        escape.utils.Tracking.trackEventOnCurrent(2);
    },
    openProduct: function(productId, type) {
        escape.utils.AppVars.currentSection.getNavigationView().push({
            pageTitle: type.toProperCase(),
            xtype: 'productPage',
            productId: productId,
            productType: type
        });
    },
    openCMSPage: function(title, contentPath) {
        escape.utils.AppVars.currentSection.getNavigationView().push({
            pageTitle: title,
            xtype: 'contentPage',
            contentPath: contentPath
        });
    },
    unfousFields: function() {
        // samll hack to unfous text fields on android
        if (!Ext.os.is.iOS) {
            // var field = document.createElement('input');
            // field.setAttribute('type', 'text');
            // field.setAttribute('style', 'font-size:1px');
            // document.body.appendChild(field);
            // setTimeout(function() {
            //     field.focus();
            //     setTimeout(function() {
            //         field.setAttribute('style', 'display:none;font-size:1px;');
            //     }, 50);
            // }, 50);

            var inputClearPanel = Ext.create('Ext.Panel', {
                cls: 'inputClearPanel',
                itemId: 'inputClearPanel',
                top: 0,
                right: 55,
                width: 25,
                items: [{
                    xtype: 'textfield',
                    itemId: 'inputClear'
                }]
            });

            Ext.Viewport.add(inputClearPanel);
            var input = inputClearPanel.getComponent('inputClear');
            //addedMsg.show();
            setTimeout(function() {
                input.focus();
                setTimeout(function() {
                    input.setStyle('display:none');
                    setTimeout(function() {
                        Ext.Viewport.remove(inputClearPanel);
                    }, 1000);
                }, 20);
            }, 20);
        }

    },
    parseCMSText: function(description) {
        var linksStartBreakdown = description.split('<a href="');
        var output = '';
        // Don't create hyperlinks when offline.
        var isOnline = true;
        if (!Ext.device.Connection.isOnline()){
            isOnline = false;
        }
        for (var i = 0; i < linksStartBreakdown.length; i++) {
            var linksEndBreakdown = linksStartBreakdown[i].split('</a>');
            if (linksEndBreakdown.length > 1) {
                // process the link
                var linkParts = linksEndBreakdown[0].split('">');
                var link = linkParts[0];
                var linkText = linkParts[1];
                var allowedLink = false;
                if (link.indexOf('www.sydney.com') > 0 || link.indexOf('www.visitnsw.com') > 0 || link.indexOf('www.destinationnsw.com.au') > 0) {
                    var pathBreakdown = link.split('/');
                    // the link is a product link
                    var productId = Ext.String.trim(pathBreakdown[pathBreakdown.length - 1]);
                    // check to see if the app is a valid product link
                    var allowedProduct = false;
                    var type = Ext.String.trim(pathBreakdown[pathBreakdown.length - 2]);
                    if (type == 'attractions') {
                        type = 'attraction';
                    }
                    if (type == 'restaurants') {
                        type = 'restaurant';
                    }
                    for (var t = escape.utils.AppVars.collectionMapping.length - 1; t >= 0; t--) {
                        if (type == escape.utils.AppVars.collectionMapping[t].matrix) {
                            allowedProduct = true;
                            break;
                        }
                    }
                    if (allowedProduct) {
                        allowedLink = true;
                        output += (!isOnline) ? linkText : '<a href="javascript:void(0)" onClick="escape.utils.AppFuncs.openProduct(\'' + productId + '\',\'' + type + '\')">' + linkText + '</a>';
                        //output += '<a href="javascript:void(0)" onClick="escape.utils.AppFuncs.openProduct(\'' + productId + '\',\'' + type + '\')">' + linkText + '</a>';
                    }
                    // check to see if the link is an internal smartphone cms link
                    if (link.indexOf('smartphoneapps') != -1) {
                        allowedLink = true;
                        output += (!isOnline) ? linkText : '<a href="javascript:void(0)" onClick="escape.utils.AppFuncs.openCMSPage(\'' + linkText + '\',\'' + link + '\')">' + linkText + '</a>';
                        //output += '<a href="javascript:void(0)" onClick="escape.utils.AppFuncs.openCMSPage(\'' + linkText + '\',\'' + link + '\')">' + linkText + '</a>';
                    }

                }
                if (!allowedLink) {
                    // the link is an external link make sure it opens in a child browser
                    //output += '<a href="javascript:void(0)" onClick="escape.utils.AppFuncs.openLink(' + link + ')">' + linkText + '</a>';
                    output += linkText;
                }
                // add the rest of the sentancetype
                output += linksEndBreakdown[1];
            } else {
                output += linksStartBreakdown[i];
            }
        }
        return output;

    }
});