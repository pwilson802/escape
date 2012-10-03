Ext.define("escape.view.page.LikeALocal", {
    extend: 'escape.view.page.Page',
    xtype: 'likeALocalPage',
    requires: ["escape.view.ui.ImgListItem", "Ext.XTemplate"],
    config: {
        title: 'Like a local',
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        items: [{
            html: "<h2>" + escape.utils.Translator.translate1('{1} like a local', ['Sydney']) + "</h2>",
            margin: '10 10 10 10'
        }, {
            xtype: 'expandableInfo',
            showBorder: false,
            completeText: '<p>Discover plenty of new experiences around every corner of Sydney’s precincts within minutes of the CBD.</p><p>Discover plenty of new experiences around every corner of Sydney’s precincts within minutes of the CBD.</p>'
        }, {
            xtype: 'list',
            margin: '10 10 10 10',
            itemTpl: '<div>{title}</div>{imgHTML}',
            cls: 'thumbList imgList',
            scrollable: false,
            data: [{
                title: escape.utils.Translator.translate('location'),
                imgHTML: escape.utils.Img.getImgDiv('resources/images/example-image2.jpg', (Number(320 - 20) / 100) * 48, 88)
            }, {
                title: escape.utils.Translator.translate('location'),
                imgHTML: escape.utils.Img.getImgDiv('resources/images/example-image2.jpg', (Number(320 - 20) / 100) * 48, 88)
            }, {
                title: escape.utils.Translator.translate('location'),
                imgHTML: escape.utils.Img.getImgDiv('resources/images/example-image2.jpg', (Number(320 - 20) / 100) * 48, 88)
            }, {
                title: escape.utils.Translator.translate('location'),
                imgHTML: escape.utils.Img.getImgDiv('resources/images/example-image2.jpg', (Number(320 - 20) / 100) * 48, 88)
            }]
        }]
    }
});