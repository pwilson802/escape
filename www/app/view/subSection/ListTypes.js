Ext.define("escape.view.subSection.ListTypes", {
    extend: 'escape.view.subSection.SubSection',
    xtype: 'listTypesSubSection',
    requires: ['Ext.SegmentedButton', 'escape.view.page.FeaturedList'],
    config: {
        rightBtn: "searchBtn",
        cardViewItemId: 1,
        menuDocked: 'top',
        listOptions: [],
        isBuilt: false,
        firstView: '',
        addToItemId: 1,
        title: '',
        layout:'vbox'
    }
    // openView: function() {
    //     if (!this.getIsBuilt()) {
    //         this.setItems([{
    //             xtype: 'segmentedbutton',
    //             layout: 'hbox',
    //             allowMultiple: false,
    //             allowDepress: false,
    //             docked: this.getMenuDocked(),
    //             items: this.getListOptions()
    //         }, {
    //             xtype: 'container',
    //             layout: 'card',
    //             items: [this.getFirstView()]
    //         }]);
    //         this.calulateCardHeight();
    //         this.setIsBuilt(true);
    //     }

    // }
});