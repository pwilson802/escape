Ext.define('escape.controller.About', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.Anim', 'escape.view.subSection.MapList', 'escape.view.page.Season', 'escape.view.page.LikeALocal', 'escape.view.page.Town', 'escape.view.page.Search', 'escape.view.subSection.Towns'],
    config: {
        refs: {
            navView: '#aboutSection > navigationview',
            likeALocalSection: 'likeALocalSection',
            mapListSubSection: '#aboutSection  mapListSubSection'
        },
        control: {
            '#aboutSection aboutPage list': {
                select: 'getToKnowAreaSelected'
            },
            '#aboutSection likeALocalPage list': {
                select: 'areasSelected'
            },
            '#aboutSection seasonPage list': {
                select: 'eventSelected'
            },
            '#aboutSection mapListSubSection list': {
                select: 'areaSelected'
            }
           
        }
    },
    getToKnowAreaSelected: function(list, record) {
        var type = record.data.type;
        var newPage;
        switch (type) {
        case 'local':
            newPage = Ext.create('escape.view.page.LikeALocal');
            break;
        case 'areas':
            newPage = Ext.create('escape.view.subSection.MapList', {
                title: 'Local Areas',
                listItems: [{
                    title: 'Inner Sydney',
                    lat: -33.899355,
                    lon: 151.11572
                }, {
                    title: 'Sydney City',
                    lat: -33.873651,
                    lon: 151.2068896
                }, {
                    title: 'Sydney East',
                    lat: -33.908035299892994,
                    lon: 151.2446594238281
                }, {
                    title: 'Sydney North',
                    lat: 33.82536404276827,
                    lon: 151.2103271484375
                }, {
                    title: 'Sydney South',
                    lat: -34.0367286748951,
                    lon: 151.10733032226562
                }, {
                    title: 'Sydney West'
                }]
            });
            break;
        case 'season':
            newPage = Ext.create('escape.view.page.Season', {
                title: record.data.season
            });
            break;
        }
        if (newPage) {
            this.getNavView().push(newPage);
        }
        list.deselect(record);
    },
    areaSelected: function(list) {
        this.getNavView().push({
            xtype: 'areaPage'
        });
    },
    areasSelected: function(list) {
        this.getNavView().push({
            xtype: 'townsSubSection'
        });
    },
    eventSelected: function(list, record) {
        console.log(record);
        this.getNavView().push({
            xtype: 'productPage',
            title: record.data.title
        });
    }
});


Ext.define('escape.controller.MapList', {
    extend: 'Ext.app.Controller',
    requires: [],
    config: {
        refs: {
            navView: '#hireSection > navigationview'
        },
        control: {

        }
    },
    viewSelected: function() {
        this.getNavView().push({
            title: 'Hire Product',
            xtype: 'productPage'
        });
    }
});