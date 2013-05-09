Ext.define("escape.model.ProductSearch", {
    requires: [''],
    extend: 'Ext.data.Model',
    config: {
        fields: [{
            name: 'startIndex',
            mapping: 'Start Index'
        }, {
            name: 'endIndex',
            mapping: 'End Index'
        }, {
            name: 'total',
            mapping: 'Total'
        }, {
            name: 'types',
            mapping: 'Type'
        }, {
            name: 'features',
            mapping: 'Features'
        }, {
            name: 'kind',
            mapping: 'By kind'
        }, {
            name: 'kind_2',
            mapping: 'Kind'
        }, {
            name: 'starRating',
            mapping: 'Star Rating'
        }, {
            name: 'experinces',
            mapping: 'Experience'
        }, {
            name: 'activities',
            mapping: 'Activities'
        },{
            name: 'results',
            mapping: 'Results',
            type: 'Array'
        },{
            name:'destinations',
            mapping:'Destination'
        },{
            name:'experiences',
            mapping:'Experience'
        },{
            name:'features',
            mapping:'Features'
        },{
            name:'activities',
            mapping:'Activities'
        },{
            name:'starRatings',
            mapping:'starRatings'
        },{
            name:'type',
            mapping:'Type'
        },{
            name:'duration',
            mapping:'Duration'
        }]
    }
});