Ext.define('escape.controller.ContentPage', {
    extend: 'Ext.app.Controller',
    requires: ['escape.model.ContentPage'],
    config: {
        refs: {},
        control: {
            'contentPage': {
                openView: 'loadContent'
            },
            'list[action=contentPageChange]': {
                select: 'openPage'
            }
        }
    },
    loadContent: function(contentPage) {
        // load the content data
        escape.model.ContentPage.getProxy().setUrl(contentPage.getContentPath());
        escape.model.ContentPage.load(0, {
            success: function(content) {
                contentPage.contentLoaded(content.getData());
            },
            error: function(error) {},
            scope: this
        });
    },
    openPage: function(list, record) {
        console.log(list);
        
        // Content Page
        var data = record.getData();
        console.log(data);
        var xtype = (data.xtype) ? data.xtype : 'contentPage';
        if (data.typeId == 'like-a-local') {
            xtype = 'townsSubSection';
        }

        console.log('list.subPageXtype: ' + list.subPageXtype);
        if (list.subPageXtype) {
            // let the list overwrite the page type
            xtype = list.subPageXtype;
        }
        console.log('xtype: ' + xtype);
        escape.utils.AppVars.currentSection.getNavigationView().push({
            pageTitle: data.Name,
            xtype: xtype,
            contentPath: data.Url
        });
    }
});