Ext.define("escape.view.page.SevicesAndFacilitiesResults", {
    extend: 'escape.view.page.Page',
    xtype: 'sevicesAndFacilitiesResultsPage',
    requires: [''],
    config: {
        resultsBuilt: false,
        cls: 'sevicesAndFacilitiesResultsPage',
        pageTitle: 'Search Results',
        rightBtn: 'hide',
        layout: 'vbox',
        margin: '10px',
        items: [{
            xtype: 'loadingDisplay'
        }],
        pageTypeId: 5,
        pageTrackingId: 2
    },
    buildPage: function(moreResullts) {

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

        if (!moreResullts) {
            // there are no more results to load
            var optionsArea = this.getComponent('optionsArea');
            this.remove(optionsArea,true);
        }

    }
});