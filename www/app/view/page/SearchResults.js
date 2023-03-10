Ext.define("escape.view.page.SearchResults", {
    extend: 'escape.view.page.Page',
    xtype: 'searchResultsPage',
    requires: [''],
    config: {
        resultsBuilt: false,
        cls: 'searchResultsPage',
        pageTitle: 'Search Results',
        rightBtn: 'hide',
        layout: 'vbox',
        margin: '10px',
        items: [{
            xtype: 'loadingDisplay'
        }],
        pageTypeId: 11,
        pageTrackingId: 2
    },
    buildPage: function(moreResullts,total) {
        if (!this.getResultsBuilt()) {
            this.setMargin(0);
            this.setResultsBuilt(true);
            var items = [{
                xtype: 'segmentedbutton',
                layout: 'hbox',
                allowMultiple: false,
                allowDepress: false,
                docked: 'top',
                items: [{
                    cls: 'listBtn',
                    type: 'list',
                    pressed: true,
                    flex: 1
                }, {
                    cls: 'mapBtn',
                    type: 'map',
                    flex: 1
                }]
            }, {
                xtype: 'container',
                itemId: 'cardView',
                layout: 'card',
                flex: 1
            }];
            this.setItems(items);
        }

        if (Number(total)===0) {
            this.removeAll(true,true);
            this.setItems({
                cls:'noResults'
            });
            this.addCls('bgTexture');
        }

    }
});