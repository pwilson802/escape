Ext.define("escape.model.ContentPage", {
    extend: 'Ext.data.Model',
    requires: 'Ext.ux.proxy.AjaxCache',
    config: {
        fields: [{
            name: 'title',
            mapping: 'Page.Title',
            type: 'string',
            defaultValue: ''
        }, {
            name: 'description',
            mapping: 'Page.Content',
            type: 'string',
            defaultValue: ''
        }, {
            name: 'images',
            mapping: 'Page.Images',
            type: 'array',
            defaultValue: []
        }, {
            name: 'geolocation',
            mapping: 'Page.Geolocation',
            type: 'object',
            defaultValue: null
        }, {
            name: 'children',
            mapping: 'Children',
            type: 'array',
            defaultValue: []
        }, {
            name: 'externalLinks',
            mapping: 'Page.External-Links',
            type: 'array',
            defaultValue: []
        },{
            name: 'page',
            mapping: 'Page',
            type: 'object',
            defaultValue: ''
        }],
        proxy: {
            type: 'ajax',
            cacheTimeout: (60 * 60 * 24 * 14),
            url: null,
            reader: {
                type: 'json'
            }
        }
    }
});