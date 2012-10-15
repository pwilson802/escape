Ext.define("escape.view.page.CurrencyConverter", {
    extend: 'escape.view.page.Page',
    xtype: 'currencyConverterPage',
    requires: ['Ext.field.Select', 'Ext.field.Toggle', 'Ext.field.Number', 'escape.model.Currency'],
    config: {
        cls: 'currencyConverterPage',
        rightBtn: 'hide',
        pageTitle: 'Currency Converter',
        pageTypeId: 4,
        pageTrackingId: 4,
        layout: 'vbox',
        scrollable: {
            direction: 'vertical',
            directionLock: true
        }
    },
    // load the currencys
    openView: function() {
        this.setItems({
            xtype: 'loadingDisplay'
        });
        // check to see if the product is a favourite or not
        var selfRef = this;
        escape.model.Currency.loadDefaults({
            success: function() {
                console.log('defaults set up');
                selfRef.loadOrginal();
            },
            error: function(error) {
                selfRef.setItems({
                    xtype: 'loadError'
                });
            },
            scope: this
        });




    },
    loadOrginal: function() {
        this.setItems({
            xtype: 'loadingDisplay'
        });
        var selfRef = this;
        escape.model.Currency.getConverstion(escape.model.Currency.getOrginalCurrency(), {
            success: function() {
                selfRef.loadConverted();
            },
            error: function(error) {
                selfRef.setItems({
                    xtype: 'loadError'
                });
            },
            scope: this
        });
    },
    loadConverted: function() {
        var selfRef = this;
        escape.model.Currency.getConverstion(escape.model.Currency.getConvertedCurrency(), {
            success: function() {
                selfRef.build();
            },
            error: function(error) {
                selfRef.setItems({
                    xtype: 'loadError'
                });
            },
            scope: this
        });
    },
    // build the currency page
    build: function() {
        var cm = escape.model.Currency;
        var orgCurrency = cm.converstions[cm.getOrginalCurrency()];
        var conCurrency = cm.converstions[cm.getConvertedCurrency()];
        var rate = cm.getConverstionRate(cm.getOrginalCurrency(), cm.getConvertedCurrency());
        var flagSize = '';
        var bgSize = '';
        if (window.devicePixelRatio) {
            if (window.devicePixelRatio > 1) {
                flagSize = '@2x';
                bgSize = '-webkit-background-size: 53px 33px;';
            }
        }
        flagSize = '@2x';
        bgSize = '-webkit-background-size: 53px 33px;';
        //
        var items = [{
            xtype: 'container',
            cls: 'converstion',
            padding: '10px',
            margin: '0 0 10px 0',
            items: [{
                xtype: 'button',
                text: cm.getOrginalCurrency(),
                action: 'selectOrginal',
                cls: 'currencyBtn',
                style: "background-image:url('resources/images/flags/currency_flag_" + Ext.String.trim(cm.getOrginalCurrency().toLowerCase()) + flagSize + ".png');" + bgSize
            }, {
                xtype: 'numberfield',
                minValue: 0,
                maxValue: 1000000,
                name: 'orginal'
            }, {
                xtype: 'button',
                text: cm.getConvertedCurrency(),
                action: 'selectConverted',
                cls: 'currencyBtn',
                style: "background-image:url('resources/images/flags/currency_flag_" + Ext.String.trim(cm.getConvertedCurrency().toLowerCase()) + flagSize + ".png');" + bgSize
            }, {
                xtype: 'numberfield',
                minValue: 0,
                maxValue: 1000000,
                disabled: true,
                name: 'converted'
            }, {
                cls: 'deatils',
                html: '<h3>FROM:</h3><h4>' + orgCurrency.currencyName + '</h4><h3>TO:</h3><h4>' + conCurrency.currencyName + '</h4>'
            }, {
                xtype: 'button',
                action: 'swapCurrencys',
                cls: 'swapBtn'
            }]
        }, {
            margin: '10px',
            cls: 'info',
            html: '<h3>1 ' + cm.getOrginalCurrency() + ' = ' + (Math.round(rate * 1000) / 1000) + '  ' + cm.getConvertedCurrency() + ' </h3><h4>Last updated: ' + cm.lastUpdated + '</h4>'

        }];


        this.setItems(items);
        this.fireEvent('built');
    }

});