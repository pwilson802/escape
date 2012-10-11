Ext.define("escape.model.POI", {
    extend: 'Ext.data.Model',
    config: {
        fields: [{
            name: 'ID'
        }, {
            name: 'address'
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
        }]
    }
});