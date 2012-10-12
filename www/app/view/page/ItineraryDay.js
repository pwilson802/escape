Ext.define("escape.view.page.ItineraryDay", {
    extend: 'escape.view.page.Page',
    requires: ['Ext.Map', 'escape.view.ui.FavoriteBtn', 'escape.view.ui.MapDisplay', 'escape.view.ui.LoadingDisplay', 'escape.view.ui.SortableList'],
    xtype: 'itineraryDayPage',
    config: {
        title: '',
        itineraryId: null,
        dayNum: 1,
        padding: '10px 0',
        items: [{
            xtype: 'loadingDisplay'
        }],
        scrollable: {
            direction: 'vertical',
            directionLock: true
        }
    },
    openView: function() {
        this.loadProducts();
    },
    loadProducts: function() {
        var selfRef = this;
        // load items Itineraries from the database
        escape.model.Itineraries.getItineraryDay(this.getItineraryId(), this.getDayNum(), {
            success: function(products) {
                if (products.length > 0) {
                    selfRef.buildPage(products);
                    // you have itineraies build the list
                } else {
                    // error you have no product
                    selfRef.showEmptyDay();
                }
            },
            error: function(error) {
                // error show the create button
                selfRef.showEmptyDay();
            },
            scope: this
        });
    },

    showEmptyDay: function() {
        items = [{
            cls: 'itineraryInstructions',
            margin: '10 10 10 10',
            html: '<p>Start adding items to your itinerary when you see this icon.</p>'
        }, {
            xtype: 'list',
            margin: '10 10 10 10',
            itemTpl: '{title}',
            cls: 'pageList',
            action: 'changeSection',
            scrollable: false,
            data: [{
                title: escape.utils.Translator.translate('Things to do'),
                sectionId: 'thingsToDoSection'
            }, {
                title: escape.utils.Translator.translate('Food & Wine'),
                sectionId: 'foodAndWineSection'
            }, {
                title: escape.utils.Translator.translate('Accommodation'),
                sectionId: 'accommodationSection'
            }, {
                title: escape.utils.Translator.translate('Events'),
                sectionId: 'eventsSection'
            }]
        }];
        this.removeAll(true, true);
        this.removeCls('itineraryProducts');
        this.setItems(items);
        this.fireEvent('built');
    },
    buildPage: function(products) {
        var data = [];
        for (var i = 0; i < products.length; i++) {
            product = products.item(i);
            console.log(product.type);
            data.push({
                id: product.id,
                productId: product.product_id,
                name: product.name,
                type: product.type,
                suburb: JSON.parse(product.data).Contact.Address.Suburb,
                order: (i * 2),
                data: product.data
            });
        }


        var store = Ext.create('Ext.data.Store', {
            sorters: 'order',
            data: data
        });

        items = [{
            xtype: 'sortableList',
            margin: '10 10 10 10',
            itemTpl: '<div class="labels"><h3>{name}</h3><h4>{suburb}</h4><div>',
            cls: 'itineraryList',
            action: 'product',
            onItemDisclosure: true,
            itemCls: 'draggableItem',
            scrollable: false,
            store: store
        }];
        this.removeAll(true, true);
        this.setItems(items);
        this.fireEvent('built');

        this.addCls('itineraryProducts');
    }
});
//action: 'changeSection',
// , {
//             xtype: 'container',
//             docked: 'bottom',
//             cls: 'btnsArea',
//             padding: '10xp',
//             defaults: {
//                 margin: '10px 0 0 0'
//             },
//             items: [{
//                 xtype: 'button',
//                 text: 'Map',
//                 action: 'map',
//                 cls: 'secondLevelBtn',
//                 style: 'float:left'
//             },{
//                 xtype: 'button',
//                 text: 'Notes',
//                 action: 'notes',
//                 cls: 'secondLevelBtn',
//                 style: 'float:right',
//                 data: {
//                     itineraryId: this.getItineraryId(),
//                     dayNum: this.getDayNum()
//                 }
//             }]
//         }