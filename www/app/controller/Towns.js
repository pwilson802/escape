Ext.define('escape.controller.Towns', {
    extend: 'Ext.app.Controller',
    requires: ['escape.view.page.Town', 'escape.view.subSection.Towns'],
    config: {
        currentTownId: 0,
        totalTowns: 0,
        towns: null,
        refs: {
            townSubSection: 'townsSubSection'
        },
        control: {
            'townsSubSection': {
                openView: 'loadContent',
                built: 'showTown'
            },
            'townsSubSection > toolbar > button[action=next]': {
                tap: 'nextTown'
            },
            'townsSubSection > toolbar > button[action=back]': {
                tap: 'backTown'
            },
            'townsSubSection > container[cls=cardView]': {
                activeitemchange: 'activeitemchange'
            },
            'townPage': {
                built: 'townPageBuilt'
            }
        }
    },
    loadContent: function(sectionPage) {
        var selfRef = this;
        console.log(sectionPage.getContentPath());
        // load the product data
        escape.model.ContentPage.getProxy().setUrl(sectionPage.getContentPath());
        escape.model.ContentPage.load(0, {
            success: function(content) {
                selfRef.setUpSection(content, sectionPage);
            },
            error: function(error) {
                console.log(error);
            },
            scope: this
        });
    },
    setUpSection: function(content, sectionPage) {
        var data = content.getData();
        this.setCurrentTownId(0);
        this.setTotalTowns(data.children.length);
        this.setTowns(data.children);
        sectionPage.buildSection(content.getData());
    },
    townPageBuilt: function() {
        this.getTownSubSection().calulateCardHeight();
    },
    activeitemchange: function(cardView, newItem, oldItem) {
        // remove the old card after a delay, to account for the animation
        console.log(oldItem);
        var task = new Ext.util.DelayedTask(function() {
            newItem.viewOpened();
            console.log(oldItem);
            try {
                oldItem.destroy();
            } catch (e) {

            }

        }, this);
        task.delay(750);
    },
    showTown: function() {
        var sectionView = this.getTownSubSection();
        sectionView.setCardView(sectionView.getItems().items[sectionView.getCardViewItemId()]);
        var cardView = sectionView.getCardView();
        console.log(cardView);
        var town = this.getTowns()[this.getCurrentTownId()];

        var townPage = Ext.create('escape.view.page.ContentPage', {
            xtype: 'contentPage',
            contentPath: town.Url,
            title: town.Name
        });

        cardView.add(townPage);
        townPage.viewOpened();
    },
    nextTown: function(btn) {
        var sectionView = this.getTownSubSection();
        var cardView = sectionView.getCardView();


        if (this.getCurrentTownId() < this.getTotalTowns() - 1) {
            this.setCurrentTownId(this.getCurrentTownId() + 1);
        } else {
            this.setCurrentTownId(0);
        }
        var town = this.getTowns()[this.getCurrentTownId()];

        var townPage = Ext.create('escape.view.page.ContentPage', {
            xtype: 'contentPage',
            contentPath: town.Url,
            title: town.Name
        });
        cardView.animateActiveItem(townPage, {
            duration: 350,
            easing: 'ease-out',
            type: 'slide',
            direction: 'left'
        });
        sectionView.calulateCardHeight();
        if (sectionView.getScrollable()) {
            sectionView.getScrollable().getScroller().scrollTo(0, 0, false);
        }
        this.updateNav();
    },
    backTown: function(btn) {
        var sectionView = this.getTownSubSection();
        var cardView = sectionView.getCardView();

        if (this.getCurrentTownId() > 0) {
            this.setCurrentTownId(this.getCurrentTownId() - 1);
        } else {
            this.setCurrentTownId(this.getTotalTowns() - 1);
        }

        var town = this.getTowns()[this.getCurrentTownId()];

        var townPage = Ext.create('escape.view.page.ContentPage', {
            xtype: 'contentPage',
            contentPath: town.Url,
            title: town.Name
        });
        cardView.animateActiveItem(townPage, {
            duration: 350,
            easing: 'ease-out',
            type: 'slide',
            direction: 'right'
        });
        sectionView.calulateCardHeight();
        if (sectionView.getScrollable()) {
            sectionView.getScrollable().getScroller().scrollTo(0, 0, false);
        }
        this.updateNav();
    },
    updateNav: function() {
        console.log('updateNav');
        var sectionView = this.getTownSubSection();
        var town = this.getTowns()[this.getCurrentTownId()];
        var navBar = sectionView.getComponent('townNav').setData({
            townName: town.Name,
            currentTown: this.getCurrentTownId() + 1,
            totalTowns: this.getTotalTowns()
        });

    }
});