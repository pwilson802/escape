Ext.define('escape.controller.MyFavourites', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.Anim', 'escape.view.page.Product'],
    config: {
        refs: {
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
                    data: productData
                });
            }

            console.log(items);

            var list = new Ext.List({
                itemTpl: '{title}',
                cls: 'favouritesList',
                data: items,
                onItemDisclosure: true,
                flex: 1
            });
            myFavouritesPage.setItems(list);
        } else {
            myFavouritesPage.setItems({
                html: 'YOU HAVE NO FAVOURITES',
                cls: 'noFavourites'
            });
        }
    },
    productSelected: function(list, record) {
        var productData = record.getData();
        escape.utils.AppVars.currentSection.getNavigationView().push({
            xtype: 'productPage',
            pageTitle: productData.type,
            productId: productData.productId,
            productData: productData.data
        });
    },
    showRemoveQuestion: function(list, record) {
        var selfRef = this;
        var productId = record.getData().productId;
        // var msgBox = Ext.create('Ext.Msg');
        Ext.Msg.show({
            message: 'Remove from favourites?',
            buttons: [{
                text: 'NO',
                itemId: 'no'
            }, {
                text: 'YES',
                itemId: 'yes'
            }],
            fn: function(buttonId) {
                if (buttonId == 'yes') {
                    selfRef.removeFromFavourites(productId);
                }

            }
        });

    },
    removeFromFavourites: function(productId) {
        var selfRef = this;
        escape.model.Favourites.remove(productId, {
            success: function(result) {
                selfRef.reLoadList();
            },
            error: function(error) {

            },
            scope: this
        });
        var removedMsg = Ext.create('Ext.Panel', {
            cls: 'prompt removedAddedMsg',
            modal: true,
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