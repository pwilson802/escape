Ext.define("escape.view.page.Area", {
    extend: 'escape.view.page.Page',
    requires: ['Ext.Map', 'escape.view.ui.FavoriteBtn', 'escape.view.ui.MapDisplay', 'escape.view.ui.LoadingDisplay'],
    xtype: 'areaPage',
    config: {
        title: 'Inner Sydney',
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        items: [{
            xtype: 'loadingDisplay'
        }],
        listeners: {
            painted: 'buildPage'
        }
    },
    loadData: function() {

    },
    buildPage: function(data) {
        items = [{
            xtype: 'expandableInfo',
            heading: 'About Inner Sydney',
            introText: '<p>Vestibulum vel nibh tellus, a accumsan enim. Ut ultrices lorem eu nibh consequat id suscipit tortor vestibulum. Sed blandit erat scelerisque augue congue id tincidunt velit molestie. Donec ac erat nisl. Nam eu ante felis, in rutrum diam. Curabitur et orci lacus. Nunc id sem purus, in porta eros. Morbi dictum nisl eu nisi sodales eleifend.</p>'
        }, {
            xtype: 'list',
            margin: '10 10 10 10',
            itemTpl: '{title}',
            cls: 'pageList',
            scrollable: false,
            data: [{
                title: escape.utils.Translator.translate('Things to do'),
                type: 'season',
                season: 'winter'
            }, {
                title: escape.utils.Translator.translate('Food & Wine'),
                type: 'season',
                season: 'summer'
            }, {
                title: escape.utils.Translator.translate('Accommodation'),
                type: 'local'
            }, {
                title: escape.utils.Translator.translate('Events'),
                type: 'areas'
            }]
        }];
         this.setItems(items);
    }


});