Ext.define('escape.controller.ProductSections', {
    extend: 'Ext.app.Controller',
    requires: ['escape.view.subSection.Product', 'escape.model.Content', 'escape.view.ui.ProductListItem'],
    config: {
        currentSection: 'about',
        refs: {
            navView: '#thingsToDoSection > navigationview',
            listView: '#thingsToDoSection listTypesSubSection',
            thingsToDoSection: '#thingsToDoSection'
        },
        control: {
            'homePage #thingsToDoList': {
                select: 'catigoriesSelected'
            },
            '#thingsToDoSection thingsToDoCatigoriesPage list': {
                select: 'catigoriesSelected'
            },
            'productSubSection': {
                openView: 'loadContent'
            },
            'productSubSection segmentedbutton': {
                toggle: 'switchType'
            },
            'productListItem': {
                initialize: 'loadProduct',
                tap: 'openProductListItem'
            },
            'productSubSection list[action=productList]': {
                select: 'productSelected'
            }

        }
    },
    loadProduct: function(productListItem) {
        var data = productListItem.getData();
        escape.model.Product.getProxy().setUrl(AppSettings.smartphoneURL + 'product-details/' + Ext.String.trim(data.type.toLowerCase()) + '-details');
        escape.model.Product.load(data.productId, {
            success: function(product) {
                var data = productListItem.getData();
                try {
                    if (product.raw.Contact.Address.Suburb) {
                        data.suburb = product.raw.Contact.Address.Suburb;
                    }
                } catch (e) {

                }

                if (product.raw.Images) {
                    if (product.raw.Images.length > 0) {
                        data.imagePath = escape.utils.Img.getResizeURL(product.raw.Images[0]['Full Size'], Ext.Viewport.getSize().width - 20);
                    }
                }
                productListItem.setData(data);
            },
            error: function(error) {
                this.setItems({
                    xtype: 'loadError'
                });
            },
            scope: this
        });
    },
    catigoriesSelected: function(list, record) {
        escape.utils.AppVars.thingsToDoSearchType = null;
        if (record.data.relatedSearchSelection) {
            escape.utils.AppVars.thingsToDoSearchType = record.data.relatedSearchSelection;
        }
        console.log('CategorySelected, Things to do type ' + escape.utils.AppVars.thingsToDoSearchType);


        this.getApplication().getController('Section').pushPage({
            pageTitle: record.data.title,
            contentPath: record.data.contentPath,
            xtype: 'productSubSection'
        })

        escape.utils.AppVars.currentSection.getNavigationView().push();
    },
    loadContent: function(productSubSection) {
        var linkbreakDown = productSubSection.getContentPath().split('smartphoneapps');
        console.log('smartphoneapps' + linkbreakDown[linkbreakDown.length - 1]);
        productSubSection.setPageTrackingId('smartphoneapps' + linkbreakDown[linkbreakDown.length - 1]);
        var selfRef = this;
        // load the content data
        escape.model.Content.getContentPageData(productSubSection.getContentPath(), {
            success: function(content) {
                selfRef.buildSubSection(productSubSection, content.getData());
            },
            error: function(error) {},
            scope: this
        });
    },
    buildSubSection: function(productSubSection, content) {
        content = escape.model.Content.process(content);
        // link the content to the page
        productSubSection.setContent(content);
        //
        var menuOptions = [{
            text: escape.utils.Translator.translate('About'),
            type: 'about',
            pressed: true,
            flex: 1
        }];
        for (var i = 0; i < content.productLists.length; i++) {
            var productList = content.productLists[i];
            menuOptions.push({
                text: escape.utils.Translator.translate(productList.name),
                type: productList.type,
                url: productList.url,
                flex: 1
            });
        }

        var items = [];
        if (menuOptions.length > 1) {
            items.push({
                xtype: 'segmentedbutton',
                layout: 'hbox',
                allowMultiple: false,
                allowDepress: false,
                docked: 'top',
                items: menuOptions
            });
        }
        items.push({
            xtype: 'container',
            layout: 'card',
            flex: 1,
            items: {
                xtype: 'container',

                scrollable: {
                    direction: 'vertical',
                    directionLock: true
                },
                itemId: 'contents',
                items: escape.model.Content.buildItems(productSubSection.getContent(), 'productSubSection')
            }
        });

        productSubSection.setItems(items);
        productSubSection.setCardView(productSubSection.getItems().items[productSubSection.getCardViewItemId()]);
    },
    switchType: function(container, btn, pressed) {
        this.setCurrentSection(btn.config.type);
        var productSubSection = container.parent;

        if (btn.config.type == 'about') {
            productSubSection.getCardView().getComponent('contents').setPadding(0);
            productSubSection.getCardView().getComponent('contents').setItems(escape.model.Content.buildItems(productSubSection.getContent(), 'productSubSection'));
        } else {
            var loadingDislay = Ext.create('escape.view.ui.LoadingDisplay');
            productSubSection.getCardView().getComponent('contents').setPadding("10px");
            productSubSection.getCardView().getComponent('contents').setItems(loadingDislay);
        }
        if (btn.config.type == 'mustDo') {
            this.loadMustDos(btn.config.url, productSubSection);
        }
        if (btn.config.type == 'productList') {
            this.loadProductList(btn.config.url, productSubSection);
        }


    },
    loadMustDos: function(url, productSubSection) {
        var selfRef = this;
        // Don't load must do's if offline.
        if (!Ext.device.Connection.isOnline()) {
            // show offline messgae
            var offlineHeight = window.innerHeight;
            productSubSection.getCardView().getComponent('contents').setPadding(0);
            productSubSection.getCardView().getComponent('contents').setItems([{
                height: offlineHeight,
                xtype: 'offlineMessage'
            }]);
        } else {
            escape.model.Content.getContentPageData(url, {
                success: function(content) {
                    selfRef.mustDosLoaded(content.getData(), productSubSection);
                },
                error: function(error) {},
                scope: this
            });
        }
    },

    mustDosLoaded: function(content, productSubSection) {
        if (this.getCurrentSection() == 'mustDo') {
            var linksStartBreakdown = content.description.split('<a href="');
            var output = '';
            var mustDoItems = [];
            for (var i = 0; i < linksStartBreakdown.length; i++) {
                var linksEndBreakdown = linksStartBreakdown[i].split('</a>');
                if (linksEndBreakdown.length > 1) {
                    // process the link
                    var linkParts = linksEndBreakdown[0].split('">');
                    var link = linkParts[0];
                    var linkText = linkParts[1];

                    var urlBreakdown = link.split('/');
                    var type = urlBreakdown[urlBreakdown.length - 2];
                    var productId = urlBreakdown[urlBreakdown.length - 1];
                    if (type == 'attractions') {
                        type = 'attraction';
                    }
                    if (type == 'restaurants') {
                        type = 'restaurant';
                    }
                    if (type == 'tours') {
                        type = 'tour';
                    }
                    if (type !== null && productId !== null) {

                        var typeAllowed = false;
                        for (var t = escape.utils.AppVars.collectionMapping.length - 1; t >= 0; t--) {
                            if (type == escape.utils.AppVars.collectionMapping[t].matrix) {
                                typeAllowed = true;
                                break;
                            }
                        }
                        if (typeAllowed) {
                            mustDoItems.push({
                                xtype: 'productListItem',
                                data: {
                                    name: linkText,
                                    type: type,
                                    productId: productId,
                                    suburb: '-'
                                }

                            });
                        }
                    }
                }
            }
            mustDoItems.push({
                margin: '20px 0 0 0',
                xtype: 'footer'
            });
            productSubSection.getCardView().getComponent('contents').setPadding(0);
            productSubSection.getCardView().getComponent('contents').setItems(mustDoItems);
        }
    },
    loadProductList: function(url, productSubSection) {
        // Don't load must do's if offline.
        if (!Ext.device.Connection.isOnline()) {
            // show offline messgae
            var offlineHeight = window.innerHeight;
            productSubSection.getCardView().getComponent('contents').setPadding(0);
            productSubSection.getCardView().getComponent('contents').setItems([{
                height: offlineHeight,
                xtype: 'offlineMessage'
            }]);
        } else {
            if (url.indexOf('/product-list-generator/') >= 0) { // Make sure the product list generator exists
                // If the links are generated for us.
                var selfRef = this;
                var currentList = 0;
                var productList = '';
                var values = url.split('/product-list-generator/')[1].split('&');
                var params = {};
                var productType = 'attraction';
                for (var i = 0; i < values.length; i++) {
                    var param = values[i].split('=');
                    if (param[0] == 'product_types') {
                        producType = param[1].split(',')[0];
                        params[param[0]] = producType;
                    } else {
                        params[param[0]] = param[1].split(',').join(';');
                    }

                }
                // if no destination are sent use the default ones
                if (!params.destination_id) {
                    params.destination_id = AppSettings.destinationIds;
                }
                // if no limit is sent add one
                if (!params.limit_by) {
                    params.limit_by = 10;
                }

                Ext.Ajax.request({
                    method: 'GET',
                    url: 'http://www.visitnsw.com/widgets/mobile-app-platform-feeds/listings/product-list-generator',
                    params: params,
                    success: function(response) {
                        productList = (JSON.parse(response.responseText));
                        console.log(productList);
                        selfRef.productListLoaded(productList, productSubSection, producType);

                    },
                    failure: function(response, opts) {}
                });
            } else {
                // The links aren't generated for us, we need to find and parse our own.
                var selfRef = this;
                Ext.Ajax.request({
                    method: 'GET',
                    url: url,
                    success: function(response) {
                        productList = (JSON.parse(response.responseText)); // Parse response
                        var internalDontMiss = productList.Page.Content;
                        if (internalDontMiss) {
                            var productList = [];
                            try {
                                // Get the JSON array
                                internalDontMiss = internalDontMiss.substring(internalDontMiss.indexOf('['), internalDontMiss.lastIndexOf(']') + 1);
                                // Replace &quote;'s
                                internalDontMiss = internalDontMiss.replace(/&quot;/g, '"');
                                // Parse our new JSON
                                internalDontMiss = (JSON.parse(internalDontMiss));
                                console.log(internalDontMiss);
                                for (var i = 0; i < internalDontMiss.length; i++) {
                                    productList.push({
                                        Name: internalDontMiss[i].Name,
                                        'Web Path': internalDontMiss[i]['Web Path'],
                                        producType: 'productList'
                                    });
                                }
                            } catch (event) {
                                console.log(event);
                            }
                            console.log(productList);
                        }

                        var producType = "attractions";
                        selfRef.productListLoaded(productList, productSubSection, producType);

                    },
                    failure: function(response, opts) {}
                });
            }
        }
    },
    productListLoaded: function(productList, productSubSection, producType) {
        if (this.getCurrentSection() == 'productList') {
            // loop over the data and add a producType.
            for (var i = productList.length - 1; i >= 0; i--) {
                productList[i].producType = producType;
            }
            var items = {
                xtype: 'list',
                margin: '10 10 10 10',
                itemTpl: '{Name}',
                cls: 'selectionList',
                action: 'productList',
                scrollable: false,
                data: productList
            };
            productSubSection.getCardView().getComponent('contents').setPadding(0);
            productSubSection.getCardView().getComponent('contents').setItems(items);
        }
    },
    openProductListItem: function(openProductListItem) {
        var data = openProductListItem.getData();
        console.log('openProductListItem');
        console.log(data);
        escape.utils.AppVars.currentSection.getNavigationView().push({
            pageTitle: String(data.type).toProperCase(),
            xtype: 'productPage',
            productId: data.productId,
            productType: data.type
        });
    },
    productSelected: function(list, record) {
        var data = record.getData();
        escape.utils.AppVars.currentSection.getNavigationView().push({
            pageTitle: String(data.producType).toProperCase().removePuralS(),
            xtype: 'productPage',
            productId: data['Web Path'],
            productType: data.producType.removePuralS().toLowerCase()
        });
    }
});