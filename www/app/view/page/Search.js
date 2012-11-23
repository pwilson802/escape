Ext.define("escape.view.page.Search", {
    extend: 'escape.view.page.Page',
    xtype: 'searchPage',
    requires: ['Ext.field.Select', 'Ext.form.Panel'],
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

        this.setItems([]);
        this.setIsBuilt(false);
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
                text: AppSettings.appSubDestination[i],
                value: AppSettings.appSubDestination[i].toLowerCase()
            });
        }
        //
        var savedValues =  this.getSearchValues();
        console.log(savedValues);
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
                    labelWidth: '50%',
                    name: 'distance',
                    value : aroundMeValue,
                    options: [{
                        text: 'Off',
                        value: -1
                    },{
                        text: '1 km',
                        value: 5
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
                    label: 'Destination',
                    name: 'destination',
                    labelWidth: '50%',
                    options: destinationOptions,
                    value: destinationValue
                }]

            }, {
                xtype: 'container',
                docked: 'bottom',
                cls: 'btnsArea',
                padding: '10xp',
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