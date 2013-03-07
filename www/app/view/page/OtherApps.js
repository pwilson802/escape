Ext.define("escape.view.page.OtherApps", {
    extend: 'escape.view.page.Page',
    xtype: 'otherAppsPage',
    requires: [],
    config: {
        rightBtn: '',
        scrollable: {
            direction: 'vertical',
            directionLock: true
        }
    },
    openView: function(content) {
        // var otherApps = [{
        //     "name": "Sydney 悉尼",
        //     "description": "The app features exciting things to do, interactive maps, great food and wine and tips on customs and transport for Chinese travellers to Sydney. Available in 3 languages, English, simplified Chinese and Traditional Chinese.",
        //     "appleAppStrore": "https://itunes.apple.com/au/app/sydney-xi-ni/id559654518?mt=8",
        //     "googlePlay": "https://play.google.com/store/apps/details?id=com.sydney.dnswchina&feature=search_result#?t=W251bGwsMSwxLDEsImNvbS5zeWRuZXkuZG5zd2NoaW5hIl0",
        //     "imgPath": "http://www.destinationnsw.com.au/__data/assets/image/0009/148788/chinaIcon-72@2x.png"
        // }];

        if (!Ext.device.Connection.isOnline()) {
            // show offline messgae
            var offlineHeight = window.innerHeight; // Set to window height
            this.setItems([{height:offlineHeight, xtype:'offlineMessage'}]);
        } else {
            this.getApps();
        }
    },

    /**
    *   Attempt to load the other apps from DNSW's global content
    *   The response has to be parsed then converted to a JSON object
    */

    getApps: function() {
        var otherApps;
        var selfref = this;

        this.setItems([{
            xtype: 'loadingDisplay'
        }])

        Ext.Ajax.request({
            method: 'GET',
            url: 'http://www.destinationnsw.com.au/smartphoneapps/global-content/other-dnsw-apps?no-cache=0',
            success: function(response) {
                try {
                    var productList = (JSON.parse(response.responseText));
                    /* Parse Response */
                    var body = productList.Page.Content;
                    body = body.replace(/<.*/g, "");
                    body = body.replace(/&quot;/g, '"');
                    body = (JSON.parse(body));
                    otherApps = body;

                    /* Add correct store to app */
                    for (var i = otherApps.length - 1; i >= 0; i--) {
                        otherApps[i].link = (!Ext.os.is.iOS) ? otherApps[i].googlePlay : otherApps[i].appleAppStrore;
                    }

                    var viewText = 'View on the App Store';
                    if (!Ext.os.is.iOS) {
                        viewText = 'View on Google Play';
                    }

                    /* Add items to list */
                    selfref.setItems([{
                        xtype: 'list',
                        itemTpl: '<table><tr><td style="vertical-align:top;"><img src="{imgPath}" witdh="72" height="72" /></td><td><b>{name}</b><br>{description}<br><b>' + viewText + '</b></td></tr></table>',
                        scrollable: false,
                        cls: 'selectionList appList',
                        margin: 10,
                        action: 'appList',
                        disableSelection: true,
                        data: otherApps
                    }, {
                        xtype: 'footer'
                    }]);

                } catch (e) {
                      selfref.setItems([{
                        xtype: 'loadError'
                    }])                  
                }
            },
            failure: function (response) {
                selfref.setItems([{
                    xtype: 'loadError'
                }])
            }
        });
    }
});