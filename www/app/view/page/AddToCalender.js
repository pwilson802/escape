Ext.define("escape.view.page.AddToCalender", {
    extend: 'escape.view.page.Page',
    xtype: 'addToCalenderPage',
    requires: ['Ext.field.Select', 'Ext.form.Panel', 'Ext.form.FieldSet', 'Ext.field.Spinner'],
    config: {
        cls: 'formPage addToCalenderPage',
        collectionType: null,
        pageTitle: 'Add to Calender',
        rightBtn: 'hide',
        layout: 'hbox',
        data:null,
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
    },
    buildPage: function() {
    	var data = this.getData();
    	// items
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
                items: [{
	                xtype: 'textfield',
	                label: 'Title',
	                name: 'title',
	                value: data.title
           		 },{
	                xtype: 'datepickerfield',
	                label: 'Start Date',
	                dateFormat: 'd/m/Y',
	                value: data.startDate,
	                name: 'startDate',
	                itemId: 'startDate',
	                picker: {
	                    yearFrom: data.startDate.getFullYear(),
	                    yearTo: data.startDate.getFullYear()
	                }
           		},{
	                xtype: 'datepickerfield',
	                label: 'End Date',
	                dateFormat: 'd/m/Y',
	                value: data,
	                name: 'endDate',
	                itemId: 'endDate',
	                picker: {
	                    yearFrom: data.endDate.getFullYear(),
	                    yearTo: data.endDate.getFullYear()
	                }

            	},{
		            xtype: 'textareafield',
		            maxRows: 10,
		            name: 'notes',
		            itemId: 'notesPage',
		            value: notes
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
                    text: 'Add',
                    action: 'add',
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