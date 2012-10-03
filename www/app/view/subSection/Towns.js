Ext.define("escape.view.subSection.Towns", {
    extend: 'escape.view.subSection.SubSection',
    requires: ['Ext.Toolbar', 'Ext.Button', 'escape.view.page.Town'],
    xtype: 'townsSubSection',
    config: {
        pageTitle: 'Like a Local',
        contentPath: null,
        rightBtn: "",
        cardViewItemId: 1,
        items: [{
            xtype: 'loadingDisplay'
        }],
        layout: 'vbox'
    },
    buildSection: function(content) {
        console.log(content);
        var firstTown = content.children[0];

        var items = [{
            xtype: 'toolbar',
            itemId: 'townNav',
            tpl: '<h3>{townName}</h3><h3>{currentTown}/{totalTowns}</h3>',
            data: {
                townName: firstTown.Name,
                currentTown: 1,
                totalTowns: content.children.length
            },
            docked: 'top',
            cls: 'pageNav',
            items: [{
                xtype: 'button',
                action: 'back',
                docked: 'left',
                cls: 'backBtn'
            }, {
                xtype: 'button',
                action: 'next',
                docked: 'right',
                cls: 'nextBtn'
            }]
        }, {
            xtype: 'container',
            layout: 'card',
            flex: 1,
            cls: 'cardView'
        }];
        this.setItems(items);
        this.fireEvent('built');
    }

});