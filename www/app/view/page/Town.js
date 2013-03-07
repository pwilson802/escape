Ext.define("escape.view.page.Town", {
    extend: 'escape.view.page.Page',
    requires: ['Ext.Map', 'escape.view.ui.FavoriteBtn', 'escape.view.ui.MapDisplay', 'escape.view.ui.LoadingDisplay'],
    xtype: 'townPage',
    config: {
        title: 'Paddington',
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
            xtype: 'favoriteBtn'
        }, {
            xtype: 'itinerayBtn'
        }, {
            xtype: 'carousel',
            height: 200,
            items: [{
                xtype: 'appImage',
                height: 200,
                imagePath: 'resources/'+AppSettings.regionImagePath+'example-image2.jpg'
            }, {
                xtype: 'appImage',
                height: 200,
                imagePath: 'resources/'+AppSettings.regionImagePath+'example-image2.jpg'
            }, {
                xtype: 'appImage',
                height: 200,
                imagePath: 'resources/'+AppSettings.regionImagePath+'example-image2.jpg'
            }]
        }, {
            xtype: 'mapDisplay',
            // lat: Number(data.Contact.Latitude),
            // lon: Number(data.Contact.Longitude),
            markerAtCenter: true
        }, {
            xtype: 'expandableInfo',
            completeText: '<p>Vestibulum vel nibh tellus, a accumsan enim. Ut ultrices lorem eu nibh consequat id suscipit tortor vestibulum. Sed blandit erat scelerisque augue congue id tincidunt velit molestie. Donec ac erat nisl. Nam eu ante felis, in rutrum diam. Curabitur et orci lacus. Nunc id sem purus, in porta eros. Morbi dictum nisl eu nisi sodales eleifend.</p>'
        }, {
            html: '<h2>Explore</h2>',
            margin: '10 10 10 10'
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
                title: escape.utils.Translator.translate('Dining & Entertainment'),
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
        this.fireEvent('built');
    }


});