Ext.define("escape.view.page.ItineraryDay", {
    extend: 'escape.view.page.Page',
    requires: ['Ext.Map', 'escape.view.ui.FavoriteBtn', 'escape.view.ui.MapDisplay', 'escape.view.ui.LoadingDisplay', 'escape.view.ui.SortableList'],
    xtype: 'itineraryDayPage',
    config: {
        title: '',
        itineraryId: null,
        dayNum: 1,
        pageTypeId: 14,
        pageTrackingId: 2,
        padding: '0',
        products: [],
        initViewType: 'list',
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
                    selfRef.setProducts(products);
                    selfRef.showInitView();
                    // you have itineraies build the list
                } else {
                    // error you have no product
                    selfRef.setProducts([]);
                    selfRef.showInitView();
                }
            },
            error: function(error) {
                selfRef.setProducts([]);
                // error show the create button
                selfRef.showInitView();
            },
            scope: this
        });
    },

    showInitView: function() {
        switch (this.getInitViewType()) {
        case 'list':
            this.showList();
            break;
        case 'map':
            this.showMap();
            break;
        case 'notes':
            this.loadNotes();
            break;
        }
    },
    showList: function() {
        var products = this.getProducts();
        if (products.length == 0) {
            this.showEmptyDay();
        } else {
            this.buildPage(products);
        }
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

    showMap: function() {
        var products = this.getProducts();
        var intialMarkers = [];
        for (var i = 0; i < products.length; i++) {
            var product = products.item(i);
            var productData = JSON.parse(product.data);
            product.iconText = i + 1;
            intialMarkers.push({
                lat: productData.Contact.Latitude,
                lon: productData.Contact.Longitude,
                data: product
            });
        }
        console.log(intialMarkers);
        var mapDisplay = Ext.create('escape.view.ui.MapDisplay', {
            height: Ext.Viewport.getSize().height - 103,
            interaction: true,
            intialMarkers: intialMarkers
        });
         this.removeAll(true, true);
        this.setItems(mapDisplay);
    },

    buildPage: function(products) {
        var data = [];
        for (var i = 0; i < products.length; i++) {
            product = products.item(i);
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
            itemTpl: '<div class="icon {type}"></div><div class="labels"><h3>{name}</h3><h4>{suburb}</h4><div>',
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
    },
    loadNotes: function() {
        var selfRef = this;
        escape.model.Itineraries.getItineraryDayNotes(this.getItineraryId(), this.getDayNum(), {
            success: function(itineraryDay) {
                selfRef.buildNotes(itineraryDay.item(0).notes);
            },
            error: function(error) {},
            scope: this
        });

    },
    buildNotes: function(notes) {
        this.removeAll(true,true);
        this.setItems([{
            html: '<h2>Notes</h2>',
            padding:'0 10px'
        }, {
            xtype: 'textareafield',
            maxRows: 10,
            name: 'notes',
            itemId: 'notesPage',
            value: notes,
            margin: '10px'
        }, {
            xtype: 'container',
            docked: 'bottom',
            cls: 'btnsArea',
            padding: '10px',
            defaults: {
                margin: '10px 0 0 0'
            },
            items: [{
                xtype: 'button',
                text: 'Save',
                action: 'save',
                cls: 'search'
            }]
        }]);
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