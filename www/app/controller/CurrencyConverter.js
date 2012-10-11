Ext.define('escape.controller.CurrencyConverter', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.Picker'],
    config: {
        refs: {
            currencyConverterPage: 'currencyConverterPage',
            orgField: 'currencyConverterPage numberfield[name=orginal]',
            convertedField: 'currencyConverterPage numberfield[name=converted]'
        },
        control: {
            'slidenavigationview': {
                menuOpened: 'unfousFields'
            },
            'currencyConverterPage container': {
                tap: 'unfousFields'
            },
            'currencyConverterPage button[action=selectOrginal]': {
                tap: 'selectOrginal'
            },

            'currencyConverterPage button[action=selectConverted]': {
                tap: 'selectConverted'
            },
            'currencyConverterPage button[action=swapCurrencys]': {
                tap: 'swapCurrencys'
            },
            'currencyConverterPage numberfield': {
                keyup: 'doConverstion',
                change: 'doConverstion',
                action: 'unfousFields'
            },
            'currencyConverterPage': {
                scrollstart: 'unfousFields',
                built: 'built'
            }
            //scrollstart(
        }
    },
    built: function() {
        this.getCurrencyConverterPage().getScrollable().getScroller().on('scrollstart', this.unfousFields);
    },
    unfousFields: function() {
        console.log('unfousFields');
        
        try {
            this.doConverstion();
            //this.getOrgField().blur();
            this.hideKeyboard();
        } catch (e) {
            console.log(e);
        }
    },
    hideKeyboard: function() {
        var activeElement = document.activeElement;
        activeElement.setAttribute('readonly', 'readonly'); // Force keyboard to hide on input field.
        activeElement.setAttribute('disabled', 'true'); // Force keyboard to hide on textarea field.
        Ext.defer(function() {
            activeElement.blur();
            // Remove readonly attribute after keyboard is hidden.
            activeElement.removeAttribute('readonly');
            activeElement.removeAttribute('disabled');
        }, 100);
    },
    createPicker: function() {
        var cm = escape.model.Currency;
        var currencyItems = [];
        for (var i = cm.currencys.length - 1; i >= 0; i--) {
            currencyItems.push({
                cls: cm.currencys[i].code.toLowerCase(),
                text: cm.currencys[i].code+ ' ' +cm.currencys[i].name,
                value: i
            });
        }

        var picker = Ext.create('Ext.Picker', {
            cancelButton: 'cancel',
            doneButton: 'select',
            slots: [{

                data: currencyItems
            }]

        });
        return picker;
    },
    selectOrginal: function() {
        this.unfousFields();
        var picker = this.createPicker();
        picker.on('change', this.orgCurrencySelected, this);
        Ext.Viewport.add(picker);
        picker.show();
    },
    orgCurrencySelected: function(picker, value) {
        var cm = escape.model.Currency;
        selectedValue = picker.getValue()[null];
        cm.setOrginalCurrency(cm.currencys[selectedValue].code);
        this.getCurrencyConverterPage().setItems({
            xtype: 'loadingDisplay'
        });
        this.getCurrencyConverterPage().loadOrginal();
    },
    selectConverted: function() {
        this.unfousFields();
        var picker = this.createPicker();
        picker.on('change', this.converstionCurrencySelected, this);
        Ext.Viewport.add(picker);
        picker.show();
    },
    converstionCurrencySelected: function(picker, value, options) {
        var cm = escape.model.Currency;
        var selectedValue = picker.getValue()[null];
        cm.setConvertedCurrency(cm.currencys[selectedValue].code);
        this.getCurrencyConverterPage().setItems({
            xtype: 'loadingDisplay'
        });
        this.getCurrencyConverterPage().loadConverted();
    },
    doConverstion: function() {
        var cm = escape.model.Currency;
        var orgCurrency = cm.getOrginalCurrency();
        var conCurrency = cm.getConvertedCurrency();
        var rate = cm.getConverstionRate(cm.getOrginalCurrency(), cm.getConvertedCurrency());

        var orgValue = this.getOrgField().getValue();
        var converted = orgValue * rate;
        this.getConvertedField().setValue((Math.round(converted * 1000) / 1000));
    },
    swapCurrencys: function() {
        this.unfousFields();
        var cm = escape.model.Currency;
        var orgCurrency = cm.getOrginalCurrency();
        var conCurrency = cm.getConvertedCurrency();
        var orgValue = this.getOrgField().getValue();
        var conValue = this.getOrgField().getValue();

        cm.setOrginalCurrency(conCurrency);
        cm.setConvertedCurrency(orgCurrency);

        this.getCurrencyConverterPage().build();

        this.getOrgField().setValue(orgValue);
        this.doConverstion();



    },

    pickerHidden: function(picker) {
        // picker.destroy();
    }
});