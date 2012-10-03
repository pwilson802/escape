Ext.define("escape.view.page.FoodAndWine", {
    extend: 'escape.view.page.Page',
    xtype: 'foodAndWinePage',
    requires: ['escape.view.ui.ExpandableInfo', 'escape.view.ui.MoreInfo'],
    config: {
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        addToItemId: 1,
        title: 'Food & Wine',
        //TODO get the dynamic name of the city
        items: [{
            xtype: 'expandableInfo',
            heading : escape.utils.Translator.translate1('Get to know {1}', ['Sydney']),
            completeText: '<p>Creative chefs, fresh produce and stunning outdoor locations are the essential ingredients that make eating out in Sydney so enjoyable.</p><p>Creative chefs, fresh produce and stunning outdoor locations are the essential ingredients that make eating out in Sydney so enjoyable.</p>'
        }, {
            xtype: 'list',
            margin: '10 10 10 10',
            itemTpl: '{title}',
            cls: 'selectionList',
            scrollable: false,
            data: [{
                title: escape.utils.Translator.translate('Gourmet Dining')
            }, {
                title: escape.utils.Translator.translate('Casual Dining')
            }, {
                title: escape.utils.Translator.translate('Fresh Produce')
            }, {
                title: escape.utils.Translator.translate('Cooking schools & food tours')
            }]
        }],
        itemsToAdd: []
    }
});