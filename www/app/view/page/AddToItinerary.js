Ext.define("escape.view.page.AddToItinerary", {
    extend: 'escape.view.page.Page',
    xtype: 'addToItineraryPage',
    requires: ['Ext.field.Select', 'Ext.form.Panel', 'Ext.form.FieldSet', 'Ext.field.Spinner'],
    config: {
        cls: 'searchPage formPage addToItineraryPage',
        collectionType: null,
        pageTitle: 'Add to Itinerary',
        rightBtn: 'hide',
        layout: 'hbox',
        productId: null,
        productType: null,
        productData: null,
        productName: null,
        pageTypeId: 14,
        pageTrackingId: 6,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        items: [{
            xtype: 'loadingDisplay'
        }]


    },
    openView: function() {
        var selfRef = this;
        escape.model.Itineraries.getItineraries({
            success: function(itineraries) {
                if (itineraries.length > 0) {
                    // you have itineraies build the list
                    selfRef.buildPage(itineraries);
                } else {
                    // error you have no itineraries
                    selfRef.fireEvent('addToNewItinerary', this);
                }
            },
            error: function(error) {
                // error show the create button
                selfRef.fireEvent('addToNewItinerary', this);
            },
            scope: this
        });
    },
    buildPage: function(itineraries) {
        var formItems = [];
        if (itineraries !== null) {
            if (itineraries.length > 0) {
                for (var i = 0; i < itineraries.length; i++) {
                    var itinerary = itineraries.item(i);
                    var itineraryOptions = [{
                        label: itinerary.name,
                        labelWidth: '80%',
                        xtype: 'checkboxfield',
                        name: 'add-' + itinerary.id,
                        checked: (itineraries.length===1) ? true : false
                    }];
                    var startDate = new Date(itinerary.startDate);
                    var endDate = new Date(itinerary.endDate);
                    var oneDay = 1000 * 60 * 60 * 24;
                    var daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (oneDay));


                    if (daysDiff > 0) {
                        itineraryOptions.push({
                            label: 'Day',
                            xtype: 'spinnerfield',
                            increment: 1,
                            minValue: 1,
                            maxValue: daysDiff+1,
                            name: 'day-' + itinerary.id
                        });
                    }

                    formItems.push({
                        xtype: 'fieldset',
                        items: itineraryOptions
                    });
                }


            }
        }

        var items = [{
            xtype: 'formpanel',
            layout: 'hbox',
            width: '100%',
            flex: 1,
            items: [{
                xtype: 'container',
                cls: 'options',
                flex: 1,
                padding: '10px',
                items: formItems
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
                    text: 'Add',
                    action: 'add',
                    cls: 'search'
                }, {
                    xtype: 'button',
                    text: 'Create new Itinerary',
                    action: 'create',
                    cls: 'search'
                }, {
                    xtype: 'button',
                    text: 'Cancel',
                    action: 'cancel',
                    cls: 'reset'
                }]
            }]
        }];

        this.setItems(items);
    }
});