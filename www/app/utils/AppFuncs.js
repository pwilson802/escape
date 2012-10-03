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
    showBingTerms: function() {
        escape.utils.AppVars.currentSection.getNavigationView().push({
            xtype: 'bingTerms'
        });
    },
    openProduct: function(productId, type) {
        escape.utils.AppVars.currentSection.getNavigationView().push({
            pageTitle: type,
            xtype: 'productPage',
            productId: productId,
            productType: type
        });

    },
    parseCMSText: function(description) {
        var linksStartBreakdown = description.split('<a href="');
        var output = '';
        for (var i = 0; i < linksStartBreakdown.length; i++) {
            var linksEndBreakdown = linksStartBreakdown[i].split('</a>');
            if (linksEndBreakdown.length > 1) {
                // process the link
                var linkParts = linksEndBreakdown[0].split('">');
                var link = linkParts[0];
                var linkText = linkParts[1];
                console.log('link: ' + link);
                if (link.indexOf('www.sydney.com') > 0 || link.indexOf('www.visitnsw.com') > 0) {
                    var pathBreakdown = link.split('/');
                    // the link is a product link
                    console.log(pathBreakdown);
                    var productId = Ext.String.trim(pathBreakdown[pathBreakdown.length - 1]);
                    var type = Ext.String.trim(pathBreakdown[pathBreakdown.length - 2]);

                    if (type == 'attractions') {
                        type = 'attraction';
                    }


                    output += '<a href="javascript:void(0)" onClick="escape.utils.AppFuncs.openProduct(\'' + productId + '\',\'' + type + '\')">' + linkText + '</a>';
                } else {
                    // the link is an external link make sure it opens in a child browser
                    output += '<a href="javascript:void(0)" onClick="escape.utils.AppFuncs.openLink(' + link + ')">' + linkText + '</a>';
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