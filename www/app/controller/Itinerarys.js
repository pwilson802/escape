Ext.define('escape.controller.Itinerarys', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.Anim', 'escape.view.page.ItineraryEditor', 'escape.view.subSection.Itinerary', 'escape.model.Itineraries', 'escape.view.ui.QuestionAction'],
    config: {
        currentItineray: null,
        deleteItineraryAction: null,
        refs: {
            myItinerarySection: '#myItinerarySection',
            myItineraryPage: 'myItineraryPage',
            navView: '#myItinerarySection > navigationview',
            itinerarySubSection: 'itinerarySubSection',
            itineraryEditorPage: 'itineraryEditorPage',
            itineraryEditorForm: 'itineraryEditorPage formpanel',
            addToItineraryPage: 'addToItineraryPage',
            addToItineraryForm: 'addToItineraryPage formpanel'
        },
        control: {
            'myItineraryPage': {
                openView: 'checkItineraries',
                activate: 'checkItineraries'
            },
            'myItineraryPage list': {
                select: 'itinerarySelected',
                disclose: 'deleteFromList'
            },
            'section button[action=createItinerary]': {
                tap: 'showNewItinerary'
            },
            'itineraryEditorPage button[action=create]': {
                tap: 'createItineray'
            },
            '#myItinerarySection #deletActionSheet': {
                hide: 'removeItinerayQs'
            },
            '#myItinerarySection #deletActionSheet button[action=cancel]': {
                tap: 'hideItinerayQs'
            },
            '#myItinerarySection #deletActionSheet button[action=delete]': {
                tap: 'deleteItinerary'
            },
            'itineraryEditorPage button[action=update]': {
                tap: 'updateItineray'
            },
            'itineraryEditorPage button[action=delete]': {
                tap: 'deleteFromForm'
            },
            '#myItinerarySection button[cls="editBtn iconBtn"]': {
                tap: 'showEditItinerary'
            },
            'addToItineraryPage': {
                addToNewItinerary: 'showNewItineraryWithProduct'
            },
            'addToItineraryPage button[action=add]': {
                tap: 'addProductToItineraries'
            },
            'addToItineraryPage button[action=create]': {
                tap: 'showNewItineraryWithProduct'
            }
        }
    },




    checkItineraries: function() {

        if (this.getMyItineraryPage().getIsBuilt()) {
            var selfRef = this;
            // load items Itineraries from the database
            escape.model.Itineraries.getItineraries({
                success: function(itineraries) {
                    if (itineraries.length > 0) {
                        // you have itineraies build the list
                        selfRef.buildItineraryList(itineraries);
                    } else {
                        // error you have no itineraries
                        selfRef.showCreatePage();
                    }
                },
                error: function(error) {
                    // error show the create button
                    selfRef.showCreatePage();
                },
                scope: this
            });
        }
    },

    buildItineraryList: function(itineraries) {
        var itinerariesList = [];
        for (var i = itineraries.length - 1; i >= 0; i--) {
            var itinerary = itineraries.item(i);
            var startDate = new Date(itinerary.startDate);
            var endDate = new Date(itinerary.endDate);
            var oneDay = 1000 * 60 * 60 * 24;
            var daysDiff =1 + (Math.ceil((endDate.getTime() - startDate.getTime()) / (oneDay)));
            var days = daysDiff;
            if (daysDiff>1){
                days+=' days';
            } else {
                 days+=' day';
            }
            console.log(startDate);
            itinerariesList.push({
                id: itinerary.id,
                name: itinerary.name,
                startDateStr: Ext.Date.format(startDate, 'd/m/y'),
                endDateStr: Ext.Date.format(endDate, 'd/m/y'),
                days: days
            });
        }
        var items = [{
            xtype: 'list',
            itemTpl: '<h3>{name}</h3><h4>{days} {startDateStr} - {endDateStr}</h4>',
            cls: 'itinerariesList',
            data: itinerariesList,
            padding: '10px',
            //onItemDisclosure: true,
            flex: 1
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
                text: 'Create Itinerary',
                action: 'createItinerary',
                cls: 'search'
            }]
        }];
        this.getMyItineraryPage().removeAll(true, true);
        this.getMyItineraryPage().setItems(items);
    },
    showCreatePage: function() {
        this.getMyItineraryPage().removeAll(true, true);
        this.getMyItineraryPage().setItems([{
            xtype: 'button',
            action: 'createItinerary',
            cls: 'createItineraryBtnLarge',
            text: '',
            flex: 3
        },{
            cls: 'createItineraryInstructions',
            padding:'20px',
            html:'<p>Create a new itinerary and start planning your trip, add notes and organise your day</p>',
            flex: 1
        }, {
            xtype: 'container',
            docked: 'bottom',
            cls: 'btnsArea',
            padding: '10xp',
            defaults: {
                margin: '10px 0 0 0'
            },
            items: [{
                xtype: 'button',
                text: 'Create Itinerary',
                action: 'createItinerary',
                cls: 'search'
            }]
        }]);
    },
    showNewItinerary: function() {
        this.getNavView().push({
            pageTitle: 'Create a new Itinerary',
            xtype: 'itineraryEditorPage'
        });
    },
    showNewItineraryWithProduct: function() {

        var productId = this.getAddToItineraryPage().getProductId();
        var productType = this.getAddToItineraryPage().getProductType();
        var productData = this.getAddToItineraryPage().getProductData();
        var productName = this.getAddToItineraryPage().getProductName();


        escape.utils.AppVars.currentSection.getNavigationView().push({
            pageTitle: 'Create a new Itinerary',
            xtype: 'itineraryEditorPage',
            productAddData: {
                id: productId,
                type: productType,
                data: productData,
                name: productName
            }
        });
    },
    showEditItinerary: function() {
        this.getNavView().push({
            pageTitle: 'Edit Itinerary',
            xtype: 'itineraryEditorPage',
            itinerary: this.getCurrentItineray()
        });
    },
    checkItineraryErrors: function(data) {
        var errors = [];
        if (data.name === null || data.name === '') {
            errors.push('Please enter a Name');
        }
        var oneDay = 1000 * 60 * 60 * 24;
        var daysDiff = Math.ceil((data.endDate.getTime() - data.startDate.getTime()) / (oneDay));

        if (daysDiff < 0) {
            errors.push('Please enter a end date after your start date');
        }
        return errors;

    },
    createItineray: function() {
        var selfRef = this;
        var data = this.getItineraryEditorForm().getValues();
        var errors = this.checkItineraryErrors(data);
        var itineraryEditorPage = this.getItineraryEditorPage();

        if (errors.length === 0) {
            // create the new itinerary
            escape.model.Itineraries.createItinerary(data.name, data.startDate, data.endDate, {
                success: function(result) {
                    console.log('success');

                    // if a product was sent add it
                    var addProductData = selfRef.getItineraryEditorPage().getProductAddData();
                    console.log('addProductData: ' + addProductData);
                    if (addProductData !== null) {
                        escape.model.Itineraries.addProduct(result.item(0).id, 1, addProductData.id, addProductData.type, addProductData.name, addProductData.data, {
                            success: function() {
                                console.log('product added to itinerary');
                                // show success
                                selfRef.showAddedMsg();
                                escape.utils.AppVars.currentSection.getNavigationView().pop(2);
                            },
                            error: function(error) {
                                console.log('product add error');
                                selfRef.showItinerary(result.item(0));
                            },
                            scope: this
                        });
                    } else {
                        escape.utils.AppVars.currentSection.getNavigationView().pop();
                        selfRef.showItinerary(result.item(0));
                    }

                },
                error: function(error) {},
                scope: this
            });
        } else {
            Ext.Msg.alert('Errors', errors.join('<br>'), Ext.emptyFn);
        }

    },

    updateItineray: function() {
        var selfRef = this;
        var data = this.getItineraryEditorForm().getValues();
        var errors = this.checkItineraryErrors(data);
        if (errors.length === 0) {
            // create the new itinerary
            escape.model.Itineraries.updateItinerary(this.getCurrentItineray().id, data.name, data.startDate, data.endDate, {
                success: function(result) {
                    selfRef.showItinerary(result.item(0));
                },
                error: function(error) {},
                scope: this
            });
        } else {
            Ext.Msg.alert('Errors', errors.join('<br>'), Ext.emptyFn);
        }

    },
    itinerarySelected: function(list, record) {
        var id = record.getData().id;
        this.loadItinerary(id);

    },
    loadItinerary: function(id) {
        var selfRef = this;
        escape.model.Itineraries.getItinerary(id, {
            success: function(result) {
                selfRef.showItinerary(result.item(0));
            },
            error: function(error) {
                console.log('error creating itinerary created');
            },
            scope: this
        });
    },

    addProductToItineraries: function() {
        var selfRef = this;
        var productId = this.getAddToItineraryPage().getProductId();
        var productType = this.getAddToItineraryPage().getProductType();
        var productData = this.getAddToItineraryPage().getProductData();
        var productName = this.getAddToItineraryPage().getProductName();
        // get form data
        var values = this.getAddToItineraryForm().getValues();
        var addToItineraries = {};
        for (var key in values) {
            var breakdown = key.split('-');
            var type = breakdown[0];
            var itineraryId = Number(breakdown[1]);
            if (!addToItineraries['add-' + itineraryId]) {
                addToItineraries['add-' + itineraryId] = {
                    id: itineraryId,
                    add: null,
                    day: 1
                };
            }
            addToItineraries['add-' + itineraryId][type] = values[key];
        }
        // show loading display
        this.getAddToItineraryPage().setItems({
            xtype: 'loadingDisplay'
        });
        // add product into itineraries
        for (var row in addToItineraries) {
            var itineraryValues = addToItineraries[row];
            if (itineraryValues.add) {
                escape.model.Itineraries.addProduct(itineraryValues.id, itineraryValues.day, productId, productType, productName, productData, {
                    success: function() {
                        console.log('product added to itinerary');
                        // show success
                    },
                    error: function(error) {},
                    scope: this
                });
            }
        }

        selfRef.showAddedMsg();
        escape.utils.AppVars.currentSection.getNavigationView().pop();

    },

    showAddedMsg: function() {
        var addedMsg = Ext.create('Ext.Panel', {
            cls: 'prompt favsAddedMsg',
            modal: true,
            centered: true,
            hideOnMaskTap: true,
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

    showItinerary: function(itinerary) {
        this.setCurrentItineray(itinerary);
        escape.utils.AppVars.currentSection.getTopText().setHtml(itinerary.name);
        escape.utils.AppVars.currentSection.getNavigationView().push({
            xtype: 'itinerarySubSection',
            pageTitle: itinerary.name,
            itinerary: itinerary
        });
    },

    deleteFromForm: function() {
        this.deleteItinerayQs(this.getCurrentItineray().id);
    },

    deleteFromList: function(list, record) {
        var id = record.getData().id;
        this.deleteItinerayQs(id);
    },

    deleteItinerayQs: function(id) {
        var selfRef = this;
        var deletActionSheet = Ext.create('escape.view.ui.QuestionAction', {
            itemId: 'deletActionSheet',
            data: {
                itineraryId: id
            },
            question: 'Delete Itinerary?',
            btns: [{
                cls: 'reset',
                action: 'delete',
                text: 'Delete'
            }, {
                cls: 'reset',
                action: 'cancel',
                text: 'Cancel'
            }]
        });
        this.setDeleteItineraryAction(deletActionSheet);
        this.getMyItinerarySection().add(deletActionSheet);
        deletActionSheet.show();

    },
    hideItinerayQs: function() {
        console.log('hideItinerayQs');
        var deletActionSheet = this.getDeleteItineraryAction();
        deletActionSheet.hide();
    },
    removeItinerayQs: function() {
        console.log('removeItinerayQs');
        var deletActionSheet = this.getDeleteItineraryAction();
        this.getMyItinerarySection().remove(deletActionSheet);
    },
    deleteItinerary: function(deleteBtn) {
        var deletActionSheet = this.getDeleteItineraryAction();
        console.log(deletActionSheet);
        var id = deletActionSheet.getData().itineraryId;
        console.log('itineraryId: ' + id);
        var selfRef = this;
        escape.model.Itineraries.deleteItinerary(id, {
            success: function(result) {
                selfRef.checkItineraries();
            },
            error: function(error) {},
            scope: this
        });
        this.hideItinerayQs();
        // show removed message
        var removedMsg = Ext.create('Ext.Panel', {
            cls: 'prompt removedAddedMsg',
            modal: true,
            centered: true,
            html: 'Deleted',
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