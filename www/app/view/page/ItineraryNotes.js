Ext.define("escape.view.page.ItineraryNotes", {
    extend: 'escape.view.page.Page',
    xtype: 'ItineraryNotesPage',
    requires: ['Ext.field.TextArea'],
    config: {
        pageTitle: 'Notes',
        rightBtn: '',
        padding: '10px',
        itineraryId: null,
        dayNum: 1,
        pageTypeId: 14,
        pageTrackingId: 5
    },
    openView: function() {
        var selfRef = this;
        console.log('this.getItineraryId(): ' + this.getItineraryId());
        console.log('this.getDayNum(): ' + this.getDayNum());
        escape.model.Itineraries.getItineraryDayNotes(this.getItineraryId(), this.getDayNum(), {
            success: function(itineraryDay) {
                selfRef.buildPage(itineraryDay.item(0).notes);
            },
            error: function(error) {
            },
            scope: this
        });

    },
    buildPage: function(notes) {
        this.setItems([{
            xtype: 'textareafield',
            maxRows: 10,
            name: 'notes',
            itemId: 'notesPage',
            value: notes
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
                text: 'Save',
                action: 'save',
                cls: 'search'
            }]
        }]);
    }
});