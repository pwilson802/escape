Ext.define("escape.model.AppVersion", {
    requires: [''],
    extend: 'Ext.data.Model',
    config: {
        fields: [{
            name: 'AppID'
        }, {
            name: 'AppName'
        }, {
            name: 'AppVer'
        }, {
            name: 'DB1Date'
        }, {
            name: 'DB1Name'
        }, {
            name: 'DB1Path'
        }, {
            name: 'DBVer'
        }, {
            name: 'File1Date'
        }, {
            name: 'File1Name'
        }, {
            name: 'File1Path'
        }, {
            name: 'Released'
        }, {
            name: 'UpdateID'
        }]
    }
});