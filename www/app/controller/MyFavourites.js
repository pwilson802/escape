Ext.define('escape.controller.MyFavourites', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.Anim', 'escape.view.page.Product'],
    config: {
        refs: {
            myFavouritesSection: '#myFavouritesSection',
            removeActionSheet: '#myFavouritesSection #removeActionSheet',
            myFavouritesPage: 'myFavouritesPage'
        },
        control: {
            'myFavouritesPage': {
                openView: 'loadList',
                activate: 'loadList'
            },
            'myFavouritesPage list': {
                select: 'productSelected',
                disclose: 'showRemoveQuestion'
            },
            '#myFavouritesSection #removeActionSheet': {
                hide: 'removeRemoveQs'
            },
            '#myFavouritesSection #removeActionSheet button[action=cancel]': {
                tap: 'hideRemoveQs'
            },
            '#myFavouritesSection #removeActionSheet button[action=remove]': {
                tap: 'removeFromFavourites'
            }
        }
    },
    reLoadList: function() {
        if (this.getMyFavouritesPage().getIsBuilt()) {
            this.loadList(this.getMyFavouritesPage());
        }
    },
    loadList: function(myFavouritesPage) {

        if (myFavouritesPage.getIsBuilt()) {
            var selfRef = this;
            // load items products from the database
            escape.model.Favourites.getFavourites({
                success: function(productList) {
                    selfRef.buildList(myFavouritesPage, productList);
                },
                error: function(error) {},
                scope: this
            });
        }


    },
    buildList: function(myFavouritesPage, productList) {
        var haveFavs = false;
        if (productList) {
            if (productList.length > 0) {
                haveFavs = true;
            }
        }
        if (haveFavs) {
            var items = [];
            for (var i = 0; i < productList.length; i++) {
                var product = productList[i];
                var productData = JSON.parse(product.data);


                items.push({
                    productId: product.product_id,
                    title: product.name,
                    lat: productData.Contact.Latitude,
                    lon: productData.Contact.Longitude,
                    data: productData,
                    suburb: productData.Contact.Address.Suburb,
                    type: product.type
                });
            }

            console.log(items);

            var list = new Ext.List({
                itemTpl: '<div class="icon {type}"></div><div class="labels"><h3>{title}</h3><h4>{suburb}</h4><div>',
                cls: 'favouritesList',
                data: items,
                onItemDisclosure: true,
                padding:'10px',
                flex: 1
            });
            myFavouritesPage.setItems(list);
        } else {
            myFavouritesPage.setItems({
                html: '',
                cls: 'noFavourites'
            });
        }
    },
    productSelected: function(list, record) {
        var productData = record.getData();
        console.log(productData);
        escape.utils.AppVars.currentSection.getNavigationView().push({
           
            xtype: 'productPage',
            pageTitle: String(productData.data.Type).toProperCase(),
            productId: productData.productId,
            productData: productData.data
        });
    },
    showRemoveQuestion: function(list, record) {
        var selfRef = this;
        var productId = record.getData().productId;
        // var msgBox = Ext.create('Ext.Msg');
        // Ext.Msg.show({
        //     message: 'Remove from favourites?',
        //     buttons: [{
        //         text: 'NO',
        //         itemId: 'no'
        //     }, {
        //         text: 'YES',
        //         itemId: 'yes'
        //     }],
        //     fn: function(buttonId) {
        //         if (buttonId == 'yes') {
        //             selfRef.removeFromFavourites(productId);
        //         }
        //     }
        // });
        var removeActionSheet = Ext.create('escape.view.ui.QuestionAction', {
            itemId: 'removeActionSheet',
            data: {
                productId: productId
            },
            question: 'Remove from favourites?',
            btns: [{
                cls: 'reset',
                action: 'remove',
                text: 'Remove'
            }, {
                cls: 'reset',
                action: 'cancel',
                text: 'Cancel'
            }]
        });
        this.getMyFavouritesSection().add(removeActionSheet);
        removeActionSheet.show();

    },
    hideRemoveQs: function() {
        console.log('hideRemoveQs');
        var removeActionSheet = this.getRemoveActionSheet();
        removeActionSheet.hide();
    },
    removeRemoveQs: function() {
        console.log('removeRemoveQs');
        var removeActionSheet = this.getRemoveActionSheet();
        this.getMyFavouritesSection().remove(removeActionSheet);
    },
    removeFromFavourites: function() {
        var selfRef = this;
        var productId = this.getRemoveActionSheet().getData().productId;
        console.log('productId');
        escape.model.Favourites.remove(productId, {
            success: function(result) {
                selfRef.reLoadList();
            },
            error: function(error) {

            },
            scope: this
        });

        this.hideRemoveQs();

        var removedMsg = Ext.create('Ext.Panel', {
            cls: 'prompt removedAddedMsg',
            //modal: true,
            centered: true,
            html: 'Removed',
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
        var task = new Ext.util.DelayedTask(function() {
            removedMsg.hide();
        }, this);
        task.delay(1000);

        Ext.Viewport.add(removedMsg);
        removedMsg.show();
    }

});