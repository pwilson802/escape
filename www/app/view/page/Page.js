/**
 *  Provides extended functionality to Containers that are pages within the application
 *  @author Ryan O'Connell
 */
Ext.define("escape.view.page.Page", {
    extend: 'Ext.Container',
    xtype: 'page',
    requires: ['escape.view.ui.MenuBtn', 'escape.utils.AppVars'],
    config: {
        isBuilt: false,
        title: "",
        rightBtn: "searchBtn",
        pageTitle: "",
        pageTypeId: 0,
        pageTrackingId: 0,
        addToItemId: -1,
        hasInputs: false,
        itemsToAdd: []
    },
    setNavTitle: function(title) {
        if (title) {
            try {
                escape.utils.AppVars.currentSection.getTopText().setHtml(title);
            } catch (e) {
            }
        }
    },

    viewCreated: function() {
        this.setNavTitle(this.getPageTitle());
    },
    refreshPage: function() {
        this.setNavTitle(this.getPageTitle());
        // deselect all the list
        var lists = Ext.ComponentQuery.query('page list');
        for (var i = lists.length - 1; i >= 0; i--) {
            var list = lists[i];
            list.deselectAll();
        }
    },
    /**
     *   Called when view is ready for it's full content to be load.
     *   All items defined in the itemsToAdd arry are added to the view
     **/
    viewOpened: function() {
        if (!this.getIsBuilt()) {
            this.setIsBuilt(true);
            this.setNavTitle(this.getPageTitle());
            // get the item to add to
            this.openView();
            this.fireEvent('openView', this);
        } else {
            this.reOpenView();
        }
        // after the view has opened and set up track the open event
        escape.utils.Tracking.trackEvent(this.getPageTypeId(), this.getPageTrackingId(), 1);
    },
    openView: function() {},
    viewClose: function() {
         if (this.getHasInputs()){
            // only run if the page has input fields
            escape.utils.AppFuncs.unfousFields();
        }
        this.fireEvent('closeView', this);
        this.closeView();
    },
    reOpenView: function() {
         this.fireEvent('reOpenView', this);
    },
    closeView: function() {}
   
});