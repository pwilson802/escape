Ext.define("escape.view.page.ItineraryEditor", {
    extend: 'escape.view.page.Page',
    xtype: 'itineraryEditorPage',
    requires: ['Ext.field.Select', 'Ext.field.DatePicker'],
    config: {
        cls: 'searchPage formPage',
        pageTitle: '',
        rightBtn: 'hide',
        itinerary: null,
        productAddData: null,
        layout: 'vbox',
        pageTypeId: 14,
        pageTrackingId: 3
    },
    
    viewCreated: function() {
        this.setNavTitle(this.getPageTitle());

        var todaysDate = new Date();
        var maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 2);
        // Values
        var nameValue = '';
        var startDateValue = todaysDate;
        var endDateValue = todaysDate;
        var itinerary = this.getItinerary();
        var action = 'create';
        var saveLabel = 'Create Itinerary';
        //  Change the settings if we are editing the itinerary
        if (itinerary !== null) {
            nameValue = itinerary.name;
            startDateValue = new Date(itinerary.startDate);
            endDateValue = new Date(itinerary.endDate);
            action = 'update';
            saveLabel = 'Update Itinerary';
        }
        //  Define the form options
        var btns = [{
            xtype: 'button',
            text: saveLabel,
            action: action,
            cls: 'search'
        }];
        // Add delete if we need to
        if (itinerary !== null) {
            btns.push({
                xtype: 'button',
                text: 'Delete Itinerary',
                action: 'delete',
                cls: 'reset'
            });
        }
        // Items
        items = [{
            xtype: 'formpanel',
            flex: 1,
            cls: 'newItinerary',
            padding: '10px',
            defaults: {
                margin: '10px 0 0 0'
            },
            items: [{
                xtype: 'textfield',
                label: 'Name',
                name: 'name',
                value: nameValue
            }, {
                xtype: 'datepickerfield',
                label: 'Start Date',
                dateFormat: 'd/m/Y',
                value: startDateValue,
                name: 'startDate',
                itemId: 'startDate',
                picker: {
                    yearFrom: todaysDate.getFullYear(),
                    yearTo: maxDate.getFullYear()
                }
            }, {
                xtype: 'datepickerfield',
                label: 'End Date',
                dateFormat: 'd/m/Y',
                value: endDateValue,
                name: 'endDate',
                itemId: 'endDate',
                picker: {
                    yearFrom: todaysDate.getFullYear(),
                    yearTo: maxDate.getFullYear()
                }

            }]
        }, {
            xtype: 'container',
            docked: 'bottom',
            cls: 'btnsArea',
            padding: '10px',
            defaults: {
                margin: '0 0 10px 0'
            },
            items: btns
        }];
        this.removeAll(true, true);
        this.setItems(items);
    }

});