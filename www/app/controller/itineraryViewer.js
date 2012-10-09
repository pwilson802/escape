Ext.define('escape.controller.ItineraryViewer', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.Anim', 'escape.view.subSection.Itinerary', 'escape.model.Itineraries', 'escape.view.page.ItineraryDay', 'escape.view.page.ItineraryNotes', 'escape.view.ui.EditItineraryProduct'],
    config: {
        refs: {
            itinerarySubSection: 'itinerarySubSection',
            itineraryToolbar: 'itinerarySubSection toolbar',
            editItineraryProduct: 'editItineraryProduct'
        },
        control: {
            '#myItinerarySection itinerarySubSection': {
                built: 'setUp'
            },

            '#myItinerarySection itinerarySubSection > toolbar > button[action=next]': {
                tap: 'nextDay'
            },
            '#myItinerarySection itinerarySubSection > toolbar > button[action=back]': {
                tap: 'previousDay'
            },
            '#myItinerarySection list[action=product]': {
                select: 'productSelected',
                disclose: 'editProduct'
            },
            'itinerarySubSection > container[cls=cardView]': {
                activeitemchange: 'activeitemchange'
            },
            'itinerarySubSection itineraryDayPage sortableList': {
                refresh: 'saveProductOrder'
            },
            'itinerarySubSection itineraryDayPage button[action=notes]': {
                tap: 'showNotes'
            },
            '#myItinerarySection ItineraryNotesPage button[action=save]': {
                tap: 'saveNotes'
            },
            'editItineraryProduct': {
                hide: 'removeEditProduct'
            },
            'editItineraryProduct button[action=update]': {
                tap: 'updateProduct'
            },
            'editItineraryProduct button[action=remove]': {
                tap: 'removeProduct'
            },
            'editItineraryProduct button[action=cancel]': {
                tap: 'closeProductEdit'
            }
        }
    },
   
    setUp: function(itinerarySubSection) {
        itinerarySubSection.setCardView(itinerarySubSection.getItems().items[itinerarySubSection.getCardViewItemId()]);
        // set the card view
        var sectionView = this.getItinerarySubSection();
        var cardView = sectionView.getCardView();
        // create the itineray day
        var itinerayData = sectionView.getItinerary();
        var itineraryDay = Ext.create('escape.view.page.ItineraryDay', {
            itineraryId: itinerayData.id,
            dayNum: 1,
            fullscreen: true
        });
        // add the itinerary day
        cardView.add(itineraryDay);
        itineraryDay.viewOpened();
    },

    activeitemchange: function(cardView, newItem, oldItem) {
        // remove the old card after a delay, to account for the animation
        var task = new Ext.util.DelayedTask(function() {
            newItem.viewOpened();
            try {
                oldItem.destroy();
            } catch (e) {

            }

        }, this);
        task.delay(750);
    },

    editProduct: function(list, record) {
        var selfRef = this;
        var productData = record.getData();
        var sectionView = this.getItinerarySubSection();
        var itineraryData = sectionView.getItinerary();
        var itineraryToolbar = this.getItineraryToolbar();
        var data = itineraryToolbar.getData();
        var actionSheet = Ext.create('escape.view.ui.EditItineraryProduct', {
            itineraryId: itineraryData.id,
            productId: productData.id,
            dayNum: data.dayNum,
            maxDays: data.totalDays
        });

        Ext.Viewport.add(actionSheet);
        actionSheet.show();
    },
     removeEditProduct: function() {
        var editSheet = this.getEditItineraryProduct();
        Ext.Viewport.remove(editSheet, true);
        
    },

    updateProduct: function() {
        var selfRef = this;
        var editSheet = this.getEditItineraryProduct();
        var dayField = editSheet.getComponent('dayField');
        escape.model.Itineraries.changeProductDay(editSheet.getProductId(),dayField.getValue(), {
            success: function() {
                console.log('product moved');
                var sectionView = selfRef.getItinerarySubSection();
                var cardView = sectionView.getCardView();
                cardView.getActiveItem().loadProducts();
            },
            error: function(error) {
                console.log('error moving product');
            },
            scope: this
        });
        editSheet.hide();
    },
    removeProduct: function() {
        var selfRef = this;
        var editSheet = this.getEditItineraryProduct();
        escape.model.Itineraries.deleteProduct(editSheet.getProductId(), {
            success: function() {
                console.log('product deleted');
                var sectionView = selfRef.getItinerarySubSection();
                var cardView = sectionView.getCardView();
                cardView.getActiveItem().loadProducts();
            },
            error: function(error) {
                console.log('error deleting product');
            },
            scope: this
        });
        editSheet.hide();

    },
    closeProductEdit: function() {
        console.log('closeProductEdit');

        var editSheet = this.getEditItineraryProduct();
        console.log(editSheet);
        editSheet.hide();
    },
    saveProductOrder: function(list) {
        var productList = list.getStore().data.items;
        for (var i = productList.length - 1; i >= 0; i--) {
            var itemData = productList[i].getData();
            escape.model.Itineraries.updateProductOrder(itemData.id, itemData.order, {
                success: function() {},
                error: function(error) {},
                scope: this
            });
        }
    },

    showNotes: function(btn) {
        var data = btn.getData();
        escape.utils.AppVars.currentSection.getNavigationView().push({
            xtype: 'ItineraryNotesPage',
            itineraryId: data.itineraryId,
            dayNum: data.dayNum
        });
    },

    saveNotes: function(btn) {
        var selfRef = this;
        var notesPage = btn.parent.parent;
        var itineraryId = notesPage.getItineraryId();
        var dayNum = notesPage.getDayNum();
        var notes = notesPage.getComponent('notesPage').getValue();


        escape.model.Itineraries.updateItineraryDayNotes(itineraryId, dayNum, notes, {
            success: function() {
                selfRef.showMessage('Saved');
                escape.utils.AppVars.currentSection.getNavigationView().pop();
            },
            error: function(error) {},
            scope: this
        });
    },
    showMessage: function(msg) {
        var addedMsg = Ext.create('Ext.Panel', {
            cls: 'prompt favsAddedMsg',
            modal: true,
            centered: true,
            hideOnMaskTap: true,
            html: msg,
            showAnimation: {
                type: 'popIn',
                duration: 200,
                easing: 'ease-out'
            },
            hideAnimation: {
                type: 'popOut',
                duration: 100,
                easing: 'ease-out'
            }
        });

        Ext.Viewport.add(addedMsg);
        addedMsg.show();

        var task = new Ext.util.DelayedTask(function() {
            addedMsg.hide();
        }, this);
        task.delay(1000);

    },
    nextDay: function(btn) {
        var itineraryToolbar = this.getItineraryToolbar();
        var data = itineraryToolbar.getData();
        // set the day
        if (data.dayNum < data.totalDays) {
            data.dayNum++;
        } else {
            data.dayNum = 1;
        }
        this.showDay(data, 'left');


    },
    previousDay: function(btn) {
        var itineraryToolbar = this.getItineraryToolbar();
        var data = itineraryToolbar.getData();
        // set the day
        if (data.dayNum > 1) {
            data.dayNum--;
        } else {
            data.dayNum = data.totalDays;
        }
        this.showDay(data, 'right');

    },
    showDay: function(data, direction) {
        var itineraryToolbar = this.getItineraryToolbar();
        var sectionView = this.getItinerarySubSection();
        var cardView = sectionView.getCardView();
        // set the date
        var itinerayData = sectionView.getItinerary();
        var dayDate = new Date(itinerayData.startDate);
        dayDate.setDate(dayDate.getDate() + (data.dayNum - 1));
        data.date = Ext.Date.format(dayDate, 'd/m/y');
        // set date data
        itineraryToolbar.setData(data);
        // add day
        var townPage = new escape.view.page.ItineraryDay({
            itineraryId: itinerayData.id,
            dayNum: data.dayNum
        });
        cardView.animateActiveItem(townPage, {
            duration: 350,
            easing: 'ease-out',
            type: 'slide',
            direction: direction
        });
        // scroll bar
        //sectionView.calulateCardHeight();
        if (sectionView.getScrollable()) {
            sectionView.getScrollable().getScroller().scrollTo(0, 0, false);
        }
    },
    productSelected: function(list, record) {
        var productData = record.getData();
        escape.utils.AppVars.currentSection.getNavigationView().push({
            xtype: 'productPage',
            pageTitle: productData.type,
            productId: productData.productId,
            productData: JSON.parse(productData.data)
        });
    }
});