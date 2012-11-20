Ext.define("escape.model.POI", {
    extend: 'Ext.data.Model',
    config: {
        fields: [{
            name: 'ID'
        },{
            name: 'id'
        }, {
            name: 'address'
        }, {
            name: 'primaryAddress'
        }, {
            name: 'primaryContacts'
        }, {
            name: 'description'
        }, {
            name: 'name'
        }, {
            name: 'phoneNumber'
        }, {
            name: 'type'
        }, {
            name: 'resultNum'
        },{
            name: 'reportingId'
        }]
    }
});