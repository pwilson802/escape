Ext.define('escape.controller.Accommodation', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.Anim'],
    config: {
        refs: {
            navView: '#accommodationSection > navigationview',
            listView: '#accommodationSection listTypesSubSection'
        },
        control: {
            '#accommodationSection listTypesSubSection': {
                activate: 'setUpListPage'
            },
            '#accommodationSection listTypesSubSection segmentedbutton': {
                toggle: 'listViewByChange'
            },
            '#accommodationSection listTypesSubSection list': {
                select: 'productSelected'
            }
        }
    },
    setUpListPage: function() {
        this.getListView().setListOptions([{
            text: escape.utils.Translator.translate('By Destination'),
            pressed: true,
            flex: 1
        }, {
            text: escape.utils.Translator.translate('By Kind'),
            flex: 1
        }]);
        this.getListView().setFirstView(new Ext.List({
            padding: '10 10 10 10',
            itemTpl: '<div>{title}<span>{note}</span></div>{imgHTML}',
            cls: 'imgList',
            scrollable: false,
            data: [{
                title: escape.utils.Translator.translate('Inner Sydney'),
                note:'5 local towns',
                imgHTML: escape.utils.Img.getImgDiv('resources/images/example-image2.jpg', 300, 88)
            }, {
                title: escape.utils.Translator.translate('Sydney City'),
                note:'5 local towns',
                imgHTML: escape.utils.Img.getImgDiv('resources/images/example-image2.jpg', 300, 88)
            }, {
                title: escape.utils.Translator.translate('Sydney East'),
                note:'5 local towns',
                imgHTML: escape.utils.Img.getImgDiv('resources/images/example-image2.jpg', 300, 88)
            }, {
                title: escape.utils.Translator.translate('Sydney North'),
                note:'5 local towns',
                imgHTML: escape.utils.Img.getImgDiv('resources/images/example-image2.jpg', 300, 88)
            }, {
                title: escape.utils.Translator.translate('Sydney South'),
                note:'5 local towns',
                imgHTML: escape.utils.Img.getImgDiv('resources/images/example-image2.jpg', 300, 88)
            }, {
                title: escape.utils.Translator.translate('Sydney West'),
                note:'5 local towns',
                imgHTML: escape.utils.Img.getImgDiv('resources/images/example-image2.jpg', 300, 88)
            }]
        }));
    },
    listViewByChange: function() {
    },
    productSelected: function() {
        this.getNavView().push({
            title: 'Accomodation',
            xtype: 'productPage'
        });
    }
});