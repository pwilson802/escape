/**
 *  {@link escape.view.AppSetUp} is a subclass of {@link Ext.NavigationView}
 *  Provides extended functionality to the Container for view of the slidemenu
 *  @author Ryan O'Connell
 */
Ext.define("escape.view.subSection.SubSection", {
    extend: 'Ext.Container',
    xtype: 'subSection',
    requires: ['Ext.layout.Card'],
    config: {
        isBuilt: false,
        fullscreen: true,
        pageTitle: '',
        rightBtn: "searchBtn",
        pageTypeId: 0,
        pageTrackingId: 0,
        hasInputs: false,
        cardViewItemId: 0,
        cardView: null,
        listeners: {
            activate: function() {
                this.setCardView(this.getItems().items[this.getCardViewItemId()]);
            },
            show: function() {
                this.refreshPage();
            }
        }
    },
    setNavTitle: function(title) {
        if (title) {
            try {
                this.setPageTitle(title);
                escape.utils.AppVars.currentSection.getTopText().setHtml(title);
            } catch (e) {}
        }

    },
    refreshPage: function() {
        this.setNavTitle(this.getPageTitle());
        // deselect all the list
        var lists = Ext.ComponentQuery.query('subSection list');
        for (var i = lists.length - 1; i >= 0; i--) {
            var list = lists[i];
            list.deselectAll();
        }
    },


    /**
     *   Called when view is ready for it's full content to be load.
     **/
    viewOpened: function() {
        if (!this.getIsBuilt()) {
            this.setIsBuilt(true);
            this.setNavTitle(this.getPageTitle());
            // get the item to add to
            this.openView();
            this.fireEvent('openView', this);
            // after the view has opened and set up track the open event
            escape.utils.Tracking.trackEvent(this.getPageTypeId(), this.getPageTrackingId(), 1);
        }
    },

    openView: function() {},
    viewClose: function() {
        this.fireEvent('closeView', this);
        this.closeView();
    },
    closeView: function() {},
    calulateCardHeight: function() {}
});