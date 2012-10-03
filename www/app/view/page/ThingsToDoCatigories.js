Ext.define("escape.view.page.ThingsToDoCatigories", {
    extend: 'escape.view.page.ContentPage',
    xtype: 'thingsToDoCatigoriesPage',
    requires: [],
    config: {
        title: 'Things To Do',
        rightBtn: 'searchBtn',
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        items: [{
            xtype: 'loadingDisplay'
        }]

    },
    buildPage: function() {

        var content = this.getContent();
        var listData = [];
        if (content.children) {
            for (var i = 0; i < content.children.length; i++) {
                var child = content.children[i];
                listData.push({
                    number: i + 1,
                    title: child.Name,
                    imgPath: 'resources/images/home_hero_carousel_a.png',
                    contentPath: child.Url
                });
            }
        }
        var items = [{
            xtype: 'list',
            margin: '10 10 20 10',
            itemTpl: '<div><span>{number}</span><h3>{title}</h3></div><div class="img" style="background-image:url({imgPath})"></div>',
            cls: 'imgList numberedList',
            action: 'changeListPage',
            scrollable: false,
            data: listData
        }];
        this.setItems(items);
    }
});