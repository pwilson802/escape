Ext.define("escape.view.ui.ItineraryAdder", {
    extend: 'Ext.form.Panel',
    xtype: 'itineraryAdder',
    config: {
        cls: 'itineraryAdder prompt',
        //modal: true,
        centered: true,
        width: 300,
        height: 400,
        html: 'loading..',
        hideOnMaskTap: true,
        showAnimation: {
            type: 'popIn',
            duration: 200,
            easing: 'ease-out'
        },
        hideAnimation: {
            type: 'popOut',
            duration: 100,
            easing: 'ease-out'
        },
        listeners: {
            show: 'getItinerariesList'
        }
    },
    getItinerariesList: function() {
        var selfRef = this;
        escape.model.Itineraries.getItineraries({
            success: function(itineraries) {
                if (itineraries.length > 0) {
                    // you have itineraies build the list
                    selfRef.showAddPage(itineraries);
                } else {
                    // error you have no itineraries
                    selfRef.showAddPage();
                }
            },
            error: function(error) {
                // error show the create button
                selfRef.showAddPage();
            },
            scope: this
        });
    },
    showAddPage: function(itineraries) {
        var items = [{
            html: '<h2>Add to My Itinerary</h2>'
        }];
        // if the the user has itineraries, show them a list
        if (itineraries) {
            var formItems = [];
            if (itineraries.length > 0) {
                for (var i = 0; i < itineraries.length; i++) {
                    var itinerary = itineraries[i];
                    var itineraryOptions = [{
                        label: itinerary.name,
                        xtype: 'checkboxfield',
                        name: 'product-' + i
                    }];
                    var startDate = new Date(itinerary.startDate);
                    var endDate = new Date(itinerary.endDate);
                    var oneDay = 1000 * 60 * 60 * 24;
                    var daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (oneDay));

                    if (daysDiff > 1) {
                        itineraryOptions.push({
                            label: 'Day',
                            xtype: 'spinnerfield',
                            stepValue: 1,
                            minValue: 1,
                            maxValue: daysDiff
                        });
                    }

                    formItems.push({
                        xtype: 'fieldset',
                        items: itineraryOptions
                    });
                }

                items.push(formItems);

            }
        }

        items.push({
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
            }, {
                xtype: 'button',
                text: 'Reset',
                action: 'cancelSearch',
                cls: 'reset'
            }]
        });


        this.setItems(items);
    }
});