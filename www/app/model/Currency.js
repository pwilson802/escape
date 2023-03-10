Ext.define("escape.model.Currency", {
    requires: ['Ext.DateExtras', 'escape.model.UserSettings'],
    singleton: true,
    reloadIn: 6 * 60 * 60 * 1000,
    // set to 6 hrs
    currencys: [],
    converstions: {},
    lastUpdated: null,

    config: {
        orginalCurrency: null,
        convertedCurrency: null

    },
    constructor: function(config) {
        this.initConfig(config);
        return this;
    },
    // call the setup if need the perform the required callback
    loadDefaults: function(callback, scope) {

        var selfRef = this;
        escape.model.UserSettings.getSetting('currencyCodeList', {
            success: function(currencyCodeList) {
                if (currencyCodeList) {
                    currencyCodeList = JSON.parse(currencyCodeList);
                    selfRef.lastUpdated = new Date(currencyCodeList.lastUpdated);
                    selfRef.currencys = currencyCodeList.list;

                    if (!Ext.device.Connection.isOnline()) {
                        // if we are not online return what we have
                        Ext.callback(callback.success, scope);
                    } else {
                        // check to see if we need to reload the weather
                        var dateNow = new Date();
                        var diff = dateNow - selfRef.lastUpdated;

                        if (diff > selfRef.reloadIn || selfRef.currencys.length === 0) {
                            // reload the current data is old or does not exist
                            selfRef.loadCurrencyList(callback, scope);
                        } else {
                            // do not reload use the current data
                            if (selfRef.getOrginalCurrency() === null) {
                                selfRef.checkOrginalCurrency(callback, scope);
                            } else {
                                Ext.callback(callback.success, scope);
                            }

                        }
                    }
                } else {
                    // the currecy list has never been saved before
                    selfRef.loadCurrencyList(callback, scope);
                }


            },
            error: function(error) {
                // the currecy list has never been saved before
                selfRef.loadCurrencyList(callback, scope);
            },
            scope: this
        });
    },
    // Load the list of currencys
    loadCurrencyList: function(callback, scope) {
        var regID = escape.utils.Tracking.getRegID();
        var selfRef = this;
        // load the waeather
        Ext.Ajax.useDefaultXhrHeader = false;
        var url = 'http://ws2.tiltandco.net/RestServiceImpl.svc/ExRates?nocache=' + new Date().getTime();
        Ext.Ajax.request({
            headers: {
                'Content-Type': 'application/json'
            },
            url: url,
            method: "POST",
            jsonData: {
                "RateID": "0",
                "RateCode": "",
                "RegID": regID
            },
            success: function(response) {
                selfRef.lastUpdated = new Date();
                var currencysDataList = JSON.parse(Ext.decode(response.responseText));
                // loop over and format the orginal currencys
                var currencyCodeList = [];
                for (var i = 0; i < currencysDataList.length; i++) {
                    var currencyData = currencysDataList[i];
                    var code = currencyData.CurrencyCode;
                    currencyCodeList.push({
                        code: code,
                        name: currencyData.CurrencyName
                    });
                    selfRef.converstions[code] = {
                        lastUpdatedDate: new Date(),
                        currencyName: currencyData.CurrencyName,
                        valueToAUD: currencyData.ValueToAUD,
                        valueToUSD: currencyData.ValueToAUD
                    };
                }
                selfRef.currencys = currencyCodeList.reverse();
                // save the currency list
                escape.model.UserSettings.setSetting('currencyCodeList', Ext.JSON.encode({
                    lastUpdated: selfRef.lastUpdated.getTime(),
                    list: selfRef.currencys
                }), {
                    success: function(newValue) {},
                    error: function(error) {},
                    scope: this
                });
                // check the orginal currency has been laoded
                selfRef.checkOrginalCurrency(callback, scope);
            },
            failure: function(response, opts) {
                Ext.callback(callback.error, scope);
            }
        });
    },
    // Check to see if the user has picked a orginalCurrency
    checkOrginalCurrency: function(callback, scope) {
        var selfRef = this;
        escape.model.UserSettings.getSetting('orginalCurrency', {
            success: function(orginalCurrency) {
                if (orginalCurrency === null || orginalCurrency === undefined) {
                    // no user language has been selected
                    selfRef.setOrginalCurrency('AUD');
                } else {
                    selfRef.setOrginalCurrency(orginalCurrency);
                }
                selfRef.checkConvertedCurrency(callback, scope);
            },
            error: function(error) {
                // no user temp has been selected
                selfRef.setOrginalCurrency('AUD');
                selfRef.checkConvertedCurrency(callback, scope);
            },
            scope: this
        });
    },
    // Check to see if the user has picked a convertedCurrency
    checkConvertedCurrency: function(callback, scope) {
        var selfRef = this;

        escape.model.UserSettings.getSetting('convertedCurrency', {
            success: function(convertedCurrency) {
                if (convertedCurrency === null || convertedCurrency === undefined) {
                    // no user language has been selected
                    selfRef.setConvertedCurrency('EUR');
                } else {
                    selfRef.setConvertedCurrency(convertedCurrency);
                }
                Ext.callback(callback.success, scope);
            },
            error: function(error) {
                // no user temp has been selected
                selfRef.setConvertedCurrency('EUR');
                Ext.callback(callback.success, scope);
            },
            scope: this
        });
    },
    // Called when orginalCurrency is updated
    updateOrginalCurrency: function(newValue, oldValue) {
        // Save the users to orginalCurrency to their settings
        escape.model.UserSettings.setSetting('orginalCurrency', newValue, {
            success: function(orginalCurrency) {},
            error: function(error) {},
            scope: this
        });
    },
    // Called when degrees is updated
    updateConvertedCurrency: function(newValue, oldValue) {
        // Save the users to orginalCurrency to their settings
        escape.model.UserSettings.setSetting('convertedCurrency', newValue, {
            success: function(convertedCurrency) {},
            error: function(error) {},
            scope: this
        });
    },
    // get converstion rate
    getConverstionRate: function(codeFrom, codeTo) {
        console.log(this.converstions);
        console.log('codeFrom: ' + codeFrom);
        console.log('codeTo: ' + codeTo);
        var fromCurrency = this.converstions[codeFrom];
        var toCurrency = this.converstions[codeTo];
        console.log('### From');
        for(var i in fromCurrency){
            console.log(i + ': ' + fromCurrency[i]);
        }
        console.log('### To');
        for(var r in toCurrency){
            console.log(r + ': ' + toCurrency[r]);
        }
        var rate = (1 * fromCurrency.valueToUSD) / (1 * toCurrency.valueToUSD);
        return rate;
    },

    // check to see if the weather needs to be loaded
    getConverstion: function(currencyCode, callback, scope) {
        var loadCode = Ext.String.trim(currencyCode).toUpperCase();
        // load the conversion
        if (this.converstions[loadCode] === null || this.converstions[loadCode] === undefined) {
            // the converstion has never be loaded before
            this.loadConverstion(loadCode, callback, scope);
        } else {
            var dateNow = new Date();
            var diff = dateNow - this.converstions[loadCode].lastUpdatedDate;
            if (diff > this.reloadIn) {
                // reload the current data is old
                this.loadConverstion(currencyCode, callback, scope);
            } else {
                // do not reload use the current data
                Ext.callback(callback.success, scope);
            }
        }
    },
    // Loads the floadConverstion
    loadConverstion: function(currencyCode, callback, scope) {
        var selfRef = this;
        // load the waeather
        Ext.Ajax.useDefaultXhrHeader = false;
        Ext.Ajax.request({
            headers: {
                'Content-Type': 'application/json'
            },
            url: 'http://ws2.tiltandco.net/RestServiceImpl.svc/ExRate?nocache=' + new Date().getTime(),
            method: "POST",
            jsonData: {
                "RateID": "0",
                "RateCode": currencyCode.toUpperCase(),
                "RegID": "1"
            },
            success: function(response) {
                if (response.responseText === '"Not Found"') {
                    Ext.callback(callback.error, scope);
                } else {
                    var converstionData = JSON.parse(Ext.decode(response.responseText));
                    selfRef.lastUpdated = new Date(parseInt(converstionData.LastUpdated.substr(6)));
                    // process server response here
                    //selfRef.fullWeatherLoaded(weatherData, callback, scope);
                    var loadedCode = Ext.String.trim(converstionData.CurrencyCode).toUpperCase();
                    selfRef.converstions[loadedCode] = {
                        lastUpdatedDate: new Date(),
                        currencyName: converstionData.CurrencyName,
                        valueToAUD: converstionData.ValueToAUD,
                        valueToUSD: converstionData.ValueToAUD
                    };
                    Ext.callback(callback.success, scope);
                }

            },
            failure: function(response, opts) {
                Ext.callback(callback.error, scope);

            }
        });
    }
});