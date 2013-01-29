Ext.define("escape.view.page.FeaturedList", {
    extend: 'escape.view.page.Page',
    xtype: 'featuredListPage',
    requires: ['escape.view.ui.ExpandableInfo', 'escape.view.ui.MoreInfo'],
    config: {
        addToItemId: 1,
        rightBtn: '',
        
        //TODO get the dynamic name of the city
        items: [{
            xtype: 'expandableInfo',
            padding: '10 0 0 0',
            heading: escape.utils.Translator.translate1('Get to know <br>{1}', ['Sydney']),
            showBorder: false,
            completeText: '<p>Sydney’s laid-back outdoor lifestyle and physical allure make it one of the world’s easiest and most pleasant cities to visit.</p><p>Sydney’s laid-back outdoor lifestyle and physical allure make it one of the world’s easiest and most pleasant cities to visit.</p>'
        }, {
            xtype: 'list',
            margin: '10 10 10 10',
            itemTpl: '<div>{title}</div>{imgHTML}',
            cls: 'imgList',
            scrollable: false,
            data: [{
                title: escape.utils.Translator.translate('location'),
                imgHTML: escape.utils.Img.getImgDiv('resources/'+AppSettings.regionImagePath+'example-image2.jpg', (Number(320 - 20) / 100) * 48, 88)
            }, {
                title: escape.utils.Translator.translate('location'),
                imgHTML: escape.utils.Img.getImgDiv('resources/'+AppSettings.regionImagePath+'example-image2.jpg', (Number(320 - 20) / 100) * 48, 88)
            }, {
                title: escape.utils.Translator.translate('location'),
                imgHTML: escape.utils.Img.getImgDiv('resources/'+AppSettings.regionImagePath+'example-image2.jpg', (Number(320 - 20) / 100) * 48, 88)
            }, {
                title: escape.utils.Translator.translate('location'),
                imgHTML: escape.utils.Img.getImgDiv('resources/'+AppSettings.regionImagePath+'example-image2.jpg', (Number(320 - 20) / 100) * 48, 88)
            }]
        }],
        itemsToAdd: []
    }
});