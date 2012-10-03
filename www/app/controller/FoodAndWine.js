Ext.define('escape.controller.FoodAndWine', {
    extend: 'Ext.app.Controller',
    requires: ['escape.view.page.FoodAndWine', 'escape.view.subSection.ListTypes', 'escape.view.page.Product'],
    config: {
        refs: {
            navView: '#foodAndWineSection > navigationview',
            listView: '#foodAndWineSection listTypesSubSection'
        },
        control: {
            '#foodAndWineSection foodAndWinePage list': {
                select: 'dinningTypeSelected'
            },
            '#foodAndWineSection listTypesSubSection segmentedbutton': {
                toggle: 'resultsTyleSelected'
            },
            '#foodAndWineSection listTypesSubSection list': {
                select: 'productSelected'
            },
            '#foodAndWineSection listTypesSubSection': {
                activate: 'buildDinningList'
            }
        }
    },
    dinningTypeSelected: function(list, record) {
        this.getNavView().push({xtype:'listTypesSubSection',title:record.data.title});
        list.deselectAll();
    },
    buildDinningList: function() {
        this.getListView().setListOptions([{
            text: 'Featured',
            pressed: true,
            flex: 1
        }, {
            text: 'All',
            flex: 1
        }]);
        this.getListView().setFirstView(new Ext.List({
            xtype: 'list',
            padding: '10 10 10 10',
           
            itemTpl: '<div>{title}</div>{imgHTML}',
            cls: 'imgList thumbList',
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
        }));
    },
    resultsTyleSelected: function() {

    },
    productSelected: function() {
        this.getNavView().push({
            xtype: 'productPage',
            title:'Resturant'
        });
    }
});