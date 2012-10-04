Ext.define("escape.view.page.ThingsToDoCatigories", {
    extend: 'escape.view.page.Page',
    xtype: 'thingsToDoCatigoriesPage',
    requires: [],
    config: {
        title: 'Things To Do',
        rightBtn: 'searchBtn',
        scrollable: {
            direction: 'vertical',
            directionLock: true
        }
    },
    openView: function() {
        var listData = [];
        for (var i = 0; i < AppSettings.attractionCats.length; i++) {
            var cat = AppSettings.attractionCats[i];
            if (!cat.hideInSubSections) {
                cat.number = listData.length + 1;
                listData.push(cat);
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
        }, {
            xtype: 'footer'
        }];
        this.setItems(items);
    }
});