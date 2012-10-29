Ext.define('escape.controller.Alerts', {
    extend: 'Ext.app.Controller',
    requires: ['escape.model.Alerts'],
    config: {
        refs: {},
        selectedRecord: null,
        currentSection: 'about',
        control: {
            'alertsPage': {
                openView: 'loadAlerts'
            }
        }
    },
    loadAlerts: function() {
        console.log('loadAlerts');
        escape.model.Alerts.load(1, {
            success: function(alerts) {
                console.log(alerts);
            },
            error: function(error) {}
        });
    }
});