Ext.define("escape.view.ui.SelectField", {
    extend: 'Ext.field.Select',
    requires: [''],
    xtype: 'selectField',
    config: {
        usePicker: true,
        listeners: {
            element: 'label',
            tap: function() {
                this.showPicker();
            }
        }
    }
});