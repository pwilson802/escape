Ext.define('escape.controller.Product', {
    requires: ['escape.utils.AppVars', 'escape.view.page.AddToItinerary'],
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            mainView: 'mainView',
            searchPage: 'searchPage',
            weatherPage: 'weatherPage'
        },
        control: {
            'page button[action="addToFavorites"]': {
                tap: 'addToFavorites'
            },
            'page button[action="removeFromFavourites"]': {
                tap: 'removeFromFavourites'
            },
            'page button[action="addToItineray"]': {
                tap: 'addToItineray'
            }
        }
    },
    addToItineray: function(btn, event, option) {
        var viewportSize = Ext.Viewport.getSize();
        var productPage = btn.config.productPage;
        var productId = productPage.getProductId();
        var productType = productPage.getProductType();
        var productData = productPage.getProductData();
        var productName = productData.Name;
        escape.utils.AppVars.currentSection.getNavigationView().push({
            xtype: 'addToItineraryPage',
            productId: productId,
            productType: productType,
            productData: productData,
            productName: productName
        });

    },
    addToFavorites: function(btn, event, option) {
        var productPage = btn.config.productPage;
        var productId = productPage.getProductId();
        var productType = productPage.getProductType();
        var productData = productPage.getProductData();
        var productName = productData.Name;
        escape.model.Favourites.add(productId, productType, productName, productData, {
            success: function(result) {
                console.log('added to favouries');
                productPage.addedToFavouries();
            },
            error: function(error) {

            },
            scope: this
        });

        var addedMsg = Ext.create('Ext.Panel', {
            cls: 'prompt favsAddedMsg',
           // modal: true,
            centered: true,
            //hideOnMaskTap: true,
            masked: false,
            html: 'Added',
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
    removeFromFavourites: function(btn, event, option) {
        var productPage = btn.config.productPage;
        var productId = productPage.getProductId();
        escape.model.Favourites.remove(productId, {
            success: function(result) {
                productPage.removedFromFavouries();
            },
            error: function(error) {

            },
            scope: this
        });
        var removedMsg = Ext.create('Ext.Panel', {
            cls: 'prompt removedAddedMsg',
           // modal: true,
            centered: true,
            //hideOnMaskTap: true,
            masked: false,
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