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
        var otherApps = [{
            "name": "Sydney 悉尼",
            "description": "The app features exciting things to do, interactive maps, great food and wine and tips on customs and transport for Chinese travellers to Sydney. Available in 3 languages, English, simplified Chinese and Traditional Chinese.",
            "appleAppStrore": "https://itunes.apple.com/au/app/sydney-xi-ni/id559654518?mt=8",
            "googlePlay": "https://play.google.com/store/apps/details?id=com.sydney.dnswchina&feature=search_result#?t=W251bGwsMSwxLDEsImNvbS5zeWRuZXkuZG5zd2NoaW5hIl0",
            "imgPath": "http://www.destinationnsw.com.au/__data/assets/image/0009/148788/chinaIcon-72@2x.png"
        }];

        for (var i = otherApps.length - 1; i >= 0; i--) {
            otherApps[i].link = (!Ext.os.is.iOS) ? otherApps[i].googlePlay : otherApps[i].appleAppStrore;
        }

        var viewText = 'View on the App Store';
        if (!Ext.os.is.iOS) {
            viewText = 'View on Google Play';
        }

        this.setItems([{
            xtype: 'list',
            itemTpl: '<img src="{imgPath}" witdh="72" height="72" /><b>{name}</b><br>{description}<br><b>' + viewText + '</b>',
            scrollable: false,
            cls: 'selectionList appList',
            margin: 10,
            action: 'appList',
            disableSelection: true,
            data: otherApps
        }, {
            xtype: 'footer'
        }]);
    }
});