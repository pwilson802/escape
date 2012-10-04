Ext.define("escape.view.page.Product", {
    extend: 'escape.view.page.Page',
    requires: ['Ext.Map', 'escape.view.ui.FavoriteBtn', 'escape.view.ui.ItinerayBtn', 'escape.view.ui.MapDisplay', 'escape.model.Product', 'escape.view.ui.LoadingDisplay', 'escape.view.ui.LoadError'],
    xtype: 'productPage',
    config: {
        title: '',
        cls: 'productPage',
        rightBtn: "shareBtn",
        productType: "event",
        productId: "the-life-of-patrick-white",
        productData: null,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        items: [{
            xtype: 'loadingDisplay'
        }]
    },
    openView: function() {
        if (this.getProductData() === null) {
            // load the product data
            escape.model.Product.getProxy().setUrl(AppSettings.smartphoneURL+'product-details/' +  this.getProductType().toLowerCase() + '-details');
            escape.model.Product.load(this.getProductId(), {
                success: function(product) {
                    this.setProductData(product.raw);
                    this.buildPage();
                },
                error: function(error) {
                    this.setItems({
                        xtype: 'loadError'
                    });
                },
                scope: this
            });
        } else {
            this.buildPage();
        }
    },
    checkFavorite: function() {
        // check to see if the product is a favourite or not
        var selfRef = this;
        // load the product content
        escape.model.Favourites.isFav(this.getProductId(), {
            success: function(isFav) {
                if (isFav) {
                    selfRef.addedToFavouries();
                }
            },
            error: function(error) {

            },
            scope: this
        });
    },
    removedFromFavouries: function() {
        var favBtns = this.query('button[action="removeFromFavourites"]');
        for (var i = favBtns.length - 1; i >= 0; i--) {
            var favBtn = favBtns[i];
            favBtn.removeCls('isFav');
            try {
                favBtn.config.action = 'addToFavorites';
                favBtn.setAction('addToFavorites');
            } catch (e) {

            }

            if (i === 1) {
                favBtn.setText('Add to Favourites');
            }

        }
    },

    addedToFavouries: function() {
        var favBtns = this.query('button[action="addToFavorites"]');
        for (var i = favBtns.length - 1; i >= 0; i--) {
            var favBtn = favBtns[i];
            favBtn.addCls('isFav');
            try {
                favBtn.config.action = 'removeFromFavourites';
                favBtn.setAction('removeFromFavourites');
            } catch (e) {

            }
            if (i === 1) {
                favBtn.setText('Remove from Favourites');
            }
        }
    },
    buildPage: function() {

        var viewportSize = Ext.Viewport.getSize();
        var screenWidth = viewportSize.width;

        var product = this.getProductData();
        this.setTitle(product.Type);

        var contactBtns = [];
        var contactList = [];
        var mainBtns = [];
        // check the data to see what options are avaibile
        // check direction
        if (product.Contact.Address || (product.Contact.Latitude && product.Contact.Longitude)) {
            // items
            contactBtns.push({
                xtype: 'button',
                action: 'getDirections',
                address: product.Contact.Address,
                latlon: [product.Contact.Latitude, product.Contact.Longitude],
                cls: 'directionsBtn contactSheetBtn',
                section: this
            });
            contactList.push({
                title: product.Contact.Address.Street + '</br>' + product.Contact.Address.Suburb + '</br>' + product.Contact.Address.State + ' ' + product.Contact.Address.Postcode,
                action: 'getDirections',
                data: {
                    latlog: [product.Contact.Latitude, product.Contact.Longitude],
                    address: product.Contact.Address
                },
                itemCls: 'directionsIcon'
            });
        }
        // check phone number
        var contactBtnAdded = false;
        if (product.Contact.Phone && product.Contact.Phone !== "") {
            contactBtns.push({

                html: '<a href="tel:' + product.Contact.Phone + '" onclick="escape.utils.AppFuncs.trackPhoneCall()"></a>',
                cls: 'callBtn contactSheetBtn'
            });
            contactBtnAdded = true;
            contactList.push({
                title: '<a href="tel:' + product.Contact.Phone + '" onclick="escape.utils.AppFuncs.trackPhoneCall()">' + product.Contact.Phone + '</a>',
                action: 'makePhoneCall',
                data: '02994961000',
                itemCls: 'callIcon'
            });
        }
        // check mobile number
        if (product.Contact.Mobile && product.Contact.Mobile !== "") {
            if (!contactBtnAdded) {
                contactBtns.push({
                    html: '<a href="tel:' + product.Contact.Mobile + '"  onclick="escape.utils.AppFuncs.trackPhoneCall()"></a>',
                    cls: 'callBtn contactSheetBtn'
                });
            }
            contactBtnAdded = true;
            contactList.push({
                title: '<a href="tel:' + product.Contact.Mobile + '" onclick="escape.utils.AppFuncs.trackPhoneCall()">' + product.Contact.Mobile + '</a>',
                action: 'makePhoneCall',
                data: product.Contact.Mobile,
                itemCls: 'callIcon'
            });
        }
        // check toll free number
        if (product.Contact["Toll Free"] && product.Contact["Toll Free"] !== "") {
            if (!contactBtnAdded) {
                contactBtns.push({
                    html: '<a href="tel:' + product.Contact["Toll Free"] + '" onclick="escape.utils.AppFuncs.trackPhoneCall()"></a>',
                    cls: 'callBtn contactSheetBtn'
                });
            }
            contactBtnAdded = true;
            contactList.push({
                title: '<a href="tel:' + product.Contact["Toll Free"] + '" onclick="escape.utils.AppFuncs.trackPhoneCall()">' + product.Contact["Toll Free"] + '</a>',
                action: 'makePhoneCall',
                data: product.Contact["Toll Free"],
                itemCls: 'callIcon'
            });
        }
        // check email
        if (product.Contact.Email && product.Contact.Email !== "") {
            contactBtns.push({
                xtype: 'button',
                action: 'sendEmail',
                emailAddress: product.Contact.Email,
                cls: 'emailBtn contactSheetBtn'
            });
            contactList.push({
                title: product.Contact.Email,
                action: 'sendEmail',
                data: product.Contact.Email,
                itemCls: 'emailIcon'
            });

        }
        // check website
        if (product.Contact.Website && product.Contact.Website !== "") {
            contactBtns.push({
                xtype: 'button',
                action: 'goToLink',
                linkURL: product.Contact.Website,
                cls: 'linkBtn contactSheetBtn'
            });
            contactList.push({
                title: product.Contact.Website,
                action: 'goToLink',
                data: product.Contact.Website,
                itemCls: 'linkIcon'
            });

        }

        // check booking
        if (product.Contact.Book && product.Contact.Book !== "") {
            contactBtns.push({
                xtype: 'button',
                action: 'makeBooking',
                bookingURL: product.Contact.Book,
                cls: 'bookingBtn contactSheetBtn'
            });
            mainBtns.push({
                xtype: 'button',
                text: escape.utils.Translator.translate('Make a booking'),
                action: 'makeBooking',
                data: product.Contact.Book,
                cls: 'bookingBtnLarge'
            });
        }



        mainBtns.push({
            xtype: 'button',
            text: escape.utils.Translator.translate('Add to Favourites'),
            action: 'addToFavorites',
            productPage: this,
            cls: 'favoritesBtnLarge secondLevelBtn'
        });
        mainBtns.push({
            xtype: 'button',
            text: escape.utils.Translator.translate('Add to Itinerary'),
            action: 'addToItineray',
            cls: 'itinerayBtnLarge secondLevelBtn'
        });

        items = [{
            xtype: 'favoriteBtn',
            productPage: this
        }, {
            xtype: 'itinerayBtn',
            productPage: this
        }];


        var imageItems = [];
        // add the product images to the page
        for (var i = 0; i < product.Images.length; i++) {
            var imageData = product.Images[i];
            imageItems.push({
                xtype: 'appImage',
                height: 200,
                imagePath: imageData['Full Size'],
                altText: imageData['Alt']
            });
        }
        items.push({
            xtype: 'carousel',
            height: 200,
            items: imageItems
        });


        items.push({
            xtype: 'mapDisplay',
            lat: Number(product.Contact.Latitude),
            lon: Number(product.Contact.Longitude),
            interaction: false,
            markerAtCenter: true
        });

        items.push({
            xtype: 'container',
            cls: 'actionHeader',
            items: [{
                html: '<h2>' + product.Name + '</h2><h4>' + product.Contact.Address.Suburb + '</h4>'
            }, {
                xtype: 'container',
                cls: 'contactNav',
                items: contactBtns
            }]
        });

        // if the product has start and end dates show the dates
        if (product.Dates) {
            var startDate = null;
            if (product.Dates['Start Date']) {
                var startDateBreakDown = product.Dates['Start Date'].split(' ')[0].split('-');
                startDate = new Date(Number(startDateBreakDown[0]), Number(startDateBreakDown[1]), Number(startDateBreakDown[2]));
            }
            var endDate = null;
            if (product.Dates['End Date']) {
                var endDateBreakDown = product.Dates['End Date'].split(' ')[0].split('-');
                endDate = new Date(endDateBreakDown[0], Number(endDateBreakDown[1]), Number(endDateBreakDown[2]));
            }
            console.log(endDate.getFullYear());
            if (startDate !== null) {
                var output = '<div class="dateDisplay start"><h4>' + Ext.Date.dayNames[startDate.getDay()] + '</h4><h3>' + startDate.getDate() + '<sup>th</sup></h3><h4>' + Ext.Date.monthNames[startDate.getMonth()] + '</h4></div>';
                if (endDate !== null) {
                    output += '<div class="dateDisplay end"><h4>' + Ext.Date.dayNames[endDate.getDay()] + '</h4><h3>' + endDate.getDate() + '<sup>th</sup></h3><h4>' + Ext.Date.monthNames[endDate.getMonth()] + '</h4></div><div class="year">' + endDate.getFullYear() + '</div>';
                }
                items.push({
                    xtype: 'container',
                    cls: 'productDates',
                    html: output
                });
            }

        }
        if (product.Description !== '') {
            items.push({
                xtype: 'expandableInfo',
                completeText: '<p>' + escape.utils.AppFuncs.parseCMSText(product.Description) + '</p>'
            });
        }
        //Deal
        if (product.Deal) {
            var deal = '<h2>Deal</h2>';
            if (product.Deal['Start Date']) {
               deal+='<h3>Start Date: '+product.Deal['Start Date']+'</h3>';
            }
              if (product.Deal['End Date']) {
               deal+='<h3>End Date: '+product.Deal['End Date']+'</h3>';
            }
            if (product.Deal.Description) {
                deal+='<p>'+escape.utils.AppFuncs.parseCMSText(product.Deal.Description)+'</p>';
            }
            if (product.Deal['How to get deal']) {
               deal+='<p>'+escape.utils.AppFuncs.parseCMSText(product.Deal['How to get deal'])+'</p>';
            }
            if (product.Deal['Term and Conditions']) {
               deal+='<p>'+escape.utils.AppFuncs.parseCMSText(product.Deal['Term and Conditions'])+'</p>';
            }
            items.push({
                padding:'10px',
                cls: 'deal',
                html: deal
            });

        }
        //Facilities
        if (product.Facilities) {
            var facilities = '<h2>Facilities</h2><ul>';
            for (var key in product.Facilities) {
                facilities += '<li>' + key + '</li>';
            }
            facilities += '</ul>';
            items.push({
                padding:'10px',
                cls: 'facilities',
                html: facilities
            });
        }
        // Products
        if (product.Products) {
            var productOutput = '<h2>Products</h2><ul>';
            for (var p = 0; p < product.Products.length; p++) {
                var productDetails= product.Products[p];
                productOutput += '<li><h3>' + productDetails.Name + '</h3>';
                productOutput += '<p>' + productDetails.Features + '</p>';

            }
            productOutput += '</ul>';
            items.push({
                padding:'10px',
                cls: 'rooms',
                html: productOutput
            });
        }
        // Rooms
        if (product.Rooms) {
            var rooms = '<h2>Rooms</h2><ul>';
            for (var r = 0; r < product.Rooms.length; r++) {
                var room = product.Rooms[r];
                rooms += '<li><h3>' + room.Name + '</h3>';
                rooms += '<h4>From: $' + room['Price From'] + ' to $' + room['Price To'] + '</h4>';
                rooms += '<p>' + room.Details + '</p>';

            }
            rooms += '</ul>';
            items.push({
                padding:'10px',
                cls: 'rooms',
                html: rooms
            });
        }

        items.push({
            xtype: 'list',
            width: viewportSize.width - 20,
            margin: '10px',
            itemTpl: '<div class="{itemCls}">{title}</div>',
            cls: 'contactList',
            itemCls: 'iconItem',
            action: 'contactSheet',
            scrollable: false,
            disableSelection: true,
            data: contactList
        }, {
            xtype: 'container',
            cls: 'btnsArea',
            padding:'10px',
            items: mainBtns
        });

        this.setItems(items);
        //this.fireEvent('built');
        this.checkFavorite();
    }


});