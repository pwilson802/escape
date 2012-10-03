Ext.define("escape.view.ui.EditItineraryProduct", {
    extend: 'Ext.ActionSheet',
    xtype: 'editItineraryProduct',
    config: {
        cls: 'btnsArea',
        hideOnMaskTap: true,
        itineraryId: null,
        productId: null,
        dayNum: null,
        maxDays: null
    },
    initialize: function() {
        console.log('initialize: ' + this.getDayNum());
        var items = [];
        // make sure there are other days we can move the product to
        if (this.getMaxDays() > 1) {
            items.push({
                xtype: 'spinnerfield',
                itemId:'dayField',
                label: 'Change Day',
                labelWidth: '55%',
                increment: 1,
                minValue: 1,
                maxValue: this.getMaxDays(),
                value: this.getDayNum(),
                margin: '0 0 10px 0'
            }, {
                text: 'Update',
                action: 'update',
                cls: 'search'
            });
        }

        items.push({
            text: 'Remove',
            action: 'remove',
            cls: 'reset'
        }, {
            text: 'Cancel',
            action: 'cancel',
            cls: 'reset'
        });
        this.setItems(items);
    }

});