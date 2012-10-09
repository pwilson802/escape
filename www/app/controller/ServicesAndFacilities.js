Ext.define('escape.controller.ServicesAndFacilities', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            servicesAndFacilitiesPage: 'servicesAndFacilitiesPage',
            keywordField : 'servicesAndFacilitiesPage searchfield'
        },
        control: {
            'servicesAndFacilitiesPage button[action=search]': {
                tap: 'search'
            }
        }
    },

    // a language has been selected
    search: function() {
        var query = this.getKeywordField().getValue();
        console.log('query!!!: ' + query);
        escape.model.ServicesAndFacilities.search(query);

    }

});