Ext.define("escape.view.page.OtherApps", {
    extend: 'escape.view.page.ContentPage',
    xtype: 'otherAppsPage',
    requires: [],
    config: {
        rightBtn: '',
        scrollable: {
            direction: 'vertical',
            directionLock: true
        }
    },
    buildPage: function(content) {
        console.log(content);
        content.description = '<div id="content_div_134035">[{"name":"Sydney 悉尼","description":"This chinese language app is designed to help you plan your trip to Sydney and help you easily get around once you arrive.","appleAppStrore":"https://itunes.apple.com/au/app/sydney-xi-ni/id559654518?mt=8","googlePlay":"https://itunes.apple.com/au/app/sydney-xi-ni/id559654518?mt=8","imgPath": "resources/images/chinaIcon-72@2x.png"}]</div>';

        console.log(content.description.split('>')[1].split('<')[0]);
        var otherApps = JSON.parse(content.description.split('>')[1].split('<')[0]);
       
        var isISO = true;
        try {
            if (device.platform==='Android'){
                isISO = false;
            }
        } catch (e){

        }

        for (var i = otherApps.length - 1; i >= 0; i--) {
            otherApps[i].link = (!isISO) ?  otherApps[i].googlePlay : otherApps[i].appleAppStrore;
        }

        this.setItems([{
            xtype: 'list',
            itemTpl: '<img src="{imgPath}" witdh="72" height="72" /><b>{name}</b><br>{description}<br><b>View on the App Store</b>',
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