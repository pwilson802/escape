Ext.define("escape.view.subSection.MapList", {
    extend: 'escape.view.subSection.SubSection',
    xtype: 'mapListSubSection',
    requires: ['Ext.SegmentedButton', 'escape.view.page.FeaturedList', 'escape.view.ui.MapDisplay'],
    config: {
        rightBtn: "searchBtn",
        title: '',
        layout: 'vbox',
        listItems: [],
        items: [{
            xtype: 'segmentedbutton',
            layout: 'hbox',
            allowMultiple: false,

            allowDepress: false,
            docked: 'top',
            items: [{
                cls: 'listBtn',
                type: 'list',
                pressed: true,
                flex: 1
            }, {
                cls: 'mapBtn',
                type: 'map',
                flex: 1
            }],
            listeners: {
                toggle: function(container, btn, pressed) {
                    if (btn.config.type == 'map') {
                        container.parent.showMap();
                    } else {
                        container.parent.showList();
                    }

                },
                scope: this
            }
        }, {
            xtype: 'container',
            layout: 'card',
            flex: 1
        }],
        listeners: {
            painted: 'showList'
        }
    },
    showMap: function() {
        var cardView = this.getItems().items[1];
        cardView.removeAll(true, true);
        var map = new escape.view.ui.MapDisplay({
            height: Ext.Viewport.getSize().height - 86
        });
        cardView.add(map);
        cardView.setActiveItem(map);
    },
    showList: function() {

        var cardView = this.getItems().items[1];
        cardView.removeAll(true, true);
        var list = new Ext.List({
            itemTpl: '{title}',
            data: this.getListItems(),
            height: Ext.Viewport.getSize().height - 86
        });
        cardView.add(list);
        cardView.setActiveItem(list);
    }
});