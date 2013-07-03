Ext.define("escape.view.page.Search", {
    extend: 'escape.view.page.Page',
    xtype: 'searchPage',
    requires: ['Ext.field.Select', 'Ext.form.Panel','Ext.field.DatePicker'],
    config: {
        cls: 'searchPage formPage',
        collectionType: null,
        pageTitle: 'Search',
        rightBtn: 'hide',
        layout: 'hbox',
        items: [],
        pageTypeId: 11,
        pageTrackingId: 1,
        searchValues: null,
        hasInputs: true
    },
    reOpenView: function() {

    },
    closeView: function() {
        //this.setItems([]);
        //this.setIsBuilt(false);
    },

    // Ensures town validity when the area value is changed.
    destinationChange: function(e, newValue, oldValue, eOpts) {
        if (newValue != oldValue) {
            // If we have a new area, we're going to have to reload the towns.
            var townOptions = [];
            for (var i = 0; i < AppSettings.appSubDestination.length; i++) {
                currentTown = AppSettings.appSubDestination[i].name.toLowerCase();
                if ((newValue.raw.text == AppSettings.appSubDestination[i].name)||(newValue.raw.text == 'All')) { // If we find the town we need, or are on 'All'
                    for (var k = 0; k < AppSettings.appSubDestination[i].towns.length; k++) {
                        townOptions.push({
                            text: AppSettings.appSubDestination[i].towns[k].name,
                            value: currentTown + '/' + AppSettings.appSubDestination[i].towns[k].name.toLowerCase()
                        });
                    }
                }
            }
            townOptions.sort(function(a, b) {
                var textA = a.text.toUpperCase();
                var textB = b.text.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
            
            townOptions.unshift({
                text: 'All',
                value: ''
            });
            if (newValue.raw.text == 'All') { // If we have selected all the destinations we want all the towns too
                this.getParent().innerItems[2].setValue('All');
            }
            this.getParent().innerItems[2].setOptions(townOptions);
        } 
    },

    // Ensures area validity when the towns value is changed.
    townChange: function(e, newValue, oldValue, eOpts) {
        if (newValue.raw.text != 'All') { // No need to change destination if we have selected all the towns
            var selected = newValue.raw.value.split('/'); // Get the URL stored on that town
            this.getParent().innerItems[1].setValue(selected[0]); // Change the destination to match the town
        }
    },

    openView: function() {
        if (!Ext.device.Connection.isOnline()){
            // show offline messgae
             this.setItems([{xtype:'offlineMessage'}]);
        } else {
            // build destination options
        var destinationOptions = [{
            text: 'All',
            value: AppSettings.destinationWebpath
        }];
        for (var i = 0; i < AppSettings.appSubDestination.length; i++) {
            destinationOptions.push({
                text: AppSettings.appSubDestination[i].name,
                value: AppSettings.appSubDestination[i].name.toLowerCase()
            });
        }

        var townOptions = [];
        var currentTown;
        for (var i = 0; i < AppSettings.appSubDestination.length; i++) {
            currentTown = AppSettings.appSubDestination[i].name.toLowerCase();
            for (var k = 0; k < AppSettings.appSubDestination[i].towns.length; k++) {
                townOptions.push({
                    text: AppSettings.appSubDestination[i].towns[k].name,
                    value: currentTown + '/' + AppSettings.appSubDestination[i].towns[k].name.toLowerCase()
                });
            }
        }

        townOptions.sort(function(a, b) {
            var textA = a.text.toUpperCase();
            var textB = b.text.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });

        townOptions.unshift({
            text: 'All',
            value: ''
        });

        //
        var savedValues =  this.getSearchValues();
        var seachString = (savedValues) ? savedValues.search : '';
        var aroundMeValue = (savedValues) ? savedValues.distance : -1;
        var destinationValue = (savedValues) ? savedValues.destination : 'all';
        this.setItems([{
            xtype: 'formpanel',
            layout: 'hbox',
            width: '100%',
            flex: 1,
            items: [{
                xtype: 'toolbar',
                docked: 'top',
                cls: 'searchBar',
                layout: 'hbox',
                items: [{
                    xtype: 'searchfield',
                    name: 'search',
                    value: seachString,
                    flex: 1
                }]
            }, {
                xtype: 'container',
                itemId: 'searchOptions',
                cls: 'searchOptions',
                flex: 1,
                padding: '10px',
                defaults: {
                    margin: '0 0 10px 0'
                },
                items: [{
                    xtype: 'selectField',
                    label: 'Around me',
                    labelWidth: '100px',
                    name: 'distance',
                    value : aroundMeValue,
                    options: [{
                        text: 'Off',
                        value: -1
                    },{
                        text: '1 km',
                        value: 1
                    }, {
                        text: '5 km',
                        value: 5
                    }, {
                        text: '10 km',
                        value: 10
                    }, {
                        text: '15 km',
                        value: 15
                    }, {
                        text: '25 km',
                        value: 25
                    }, {
                        text: '50 km',
                        value: 50
                    }, {
                        text: '75 km',
                        value: 75
                    }, {
                        text: '100 km',
                        value: 100
                    }, {
                        text: '150 km',
                        value: 150
                    }, {
                        text: '200 km',
                        value: 200
                    }]
                }, {
                    xtype: 'selectField',
                    label: 'Area',
                    name: 'destination',
                    labelWidth: '100px',
                    options: destinationOptions,
                    value: destinationValue,
                    listeners:{
                        change: this.destinationChange
                    }
                }, {
                    xtype: 'selectField',
                    label: 'Town',
                    name: 'town',
                    labelWidth: '100px',
                    options: townOptions,
                    value: 'All',
                    listeners:{
                        change: this.townChange
                    }
                }]

            }, {
                xtype: 'container',
                docked: 'bottom',
                cls: 'btnsArea',
                padding: '10px',
                defaults: {
                    margin: '10px 0 0 0'
                },
                items: [{
                    xtype: 'button',
                    text: 'Search',
                    action: 'search',
                    cls: 'search'
                }]
            }]
        }]);
        }
        
    }
});