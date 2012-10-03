Ext.define("escape.view.page.Season", {
    extend: 'escape.view.page.Page',
    xtype: 'seasonPage',
    config: {
        title: 'default title',
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        rightBtn: 'searchBtn',
        items: [{
            xtype: 'carousel',
            layout: 'fit',
            height: 200,
            items: [{
                xtype: 'image',
                src: 'resources/images/example-image.jpg'
            }, {
                xtype: 'image',
                src: 'resources/images/example-image.jpg'
            }, {
                xtype: 'image',
                src: 'resources/images/example-image.jpg'
            }]
        }, {
            xtype: 'expandableInfo',
            heading: 'Sydney in  Winter',
            completeText: '<p>During Winter, it’s perfect weather for getting out and enjoying Sydney’s stunning natural attractions. Go for a scenic coastal walk from Bondi to Coogee, climb the famous Sydney Harbour Bridge or go sailing on Sydney Harbour.</p>'
        }, {
            xtype: 'expandableInfo',
            heading: 'What\'s on in Winter',
            completeText: '<p>Sydney’s laid-back outdoor lifestyle and physical allure make it one of the world’s easiest and most pleasant cities to visit.</p><p>Sydney’s laid-back outdoor lifestyle and physical allure make it one of the world’s easiest and most pleasant cities to visit.</p>'
        }, {
            html:'<h2>Winter Events</h2>',
              margin: '10 10 10 10'
        }, {
            xtype: 'list',
            margin: '10 10 10 10',
            itemTpl: '{title}',
            cls: 'pageList',
            scrollable: false,
            data: [{
                title: escape.utils.Translator.translate('Vivid Sydney')
            }, {
                title: escape.utils.Translator.translate('Sydney Opera House')
            }, {
                title: escape.utils.Translator.translate('Sydney Writers Festival')
            }]
        }]
    }
});