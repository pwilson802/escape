Ext.define("escape.view.page.Settings", {
    extend: 'escape.view.page.Page',
    xtype: 'settingsPage',
    requires: ['Ext.form.Panel', 'escape.model.Weather', 'Ext.field.Radio', 'escape.controller.Settings', 'Ext.form.Panel'],
    config: {
        pageTitle: 'Settings',
        cls: 'settings',
        rightBtn: 'hide',
        pageTrackingId:0,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        items: [{
            xtype: 'loadingDisplay'
        }]
    },
    openView: function() {
      
        var items = [];
        
        //items = items.concat(languageChoices);
        // Tempuature
        var toggleValue = (escape.model.Weather.getIsDegrees()) ? 1 : 0;
        items.push({
            xtype: 'container',
            cls: 'options',
            items: [{
                label: 'Weather Temperature',
                labelWidth: '60%',
                xtype: 'togglefield',
                value: toggleValue
            }]
        });
        ///
        this.setItems({
            xtype: "container",
            padding: '10px',
            items: items
        });
    }
});