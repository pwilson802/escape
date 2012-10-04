Ext.define('escape.controller.Section', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.util.DelayedTask'],
    config: {
        menuBtn: null,
        rightBtn: null,
        oldPage: null,
        newPage: null,
        control: {
            'slidenavigationview': {
                menuClosed: 'menuClosed'
            },
            'section > navigationview': {
                activeitemchange: 'activeItemChange'
            },
            'section > navigationview > page': {
                hide: 'itemHidden'
            },
            'section > navigationview > subSection': {
                hide: 'itemHidden'
            },
            'section > navigationview toolbar': {
                tap: 'scrollToTop'
            },
            'section': {
                initialize: 'sectionActivated'
            }

        }
    },
    sectionActivated: function(section) {
        // add the scroll to top button
        var navView = section.getItems().items[section.getNavViewItemId()];
        section.setNavigationView(navView);
        var scrollTopTopBtn = section.add({
            xtype: 'scrollTopTopBtn',
            width: Ext.Viewport.getSize().width - 120
        });
        section.setTopText(scrollTopTopBtn.getComponent('topBtn'));
        // define menu btns
        var menuBtn = section.getComponent('menuBtn'); //Ext.ComponentQuery.query('#' + section.id + ' menuBtn')[0]; // get a referance to the menu button
        var rightBtn = section.getComponent('rightBtn'); //Ext.ComponentQuery.query('#' + section.id + ' button[action="rightBtn"]')[0]; // get a referance to the menu button
        this.setMenuBtn(menuBtn);
        this.setRightBtn(rightBtn);
        // a new section has be activate, add the first view
        var firstPage = section.getFirstPage();
        if (firstPage.pageTitle !== null && firstPage.pageTitle !== '' && firstPage.pageTitle !== undefined) {
            section.getTopText().setHtml(firstPage.pageTitle);
            firstPage.title = null;
        } else if (firstPage.title !== null && firstPage.title !== '' && firstPage.title !== undefined) {
            section.getTopText().setHtml(firstPage.title);
            firstPage.pageTitle = firstPage.title;
            firstPage.title = null;
        }
        navView.push(firstPage);
    },
    menuClosed: function() {
        var page = escape.utils.AppVars.currentPage;
        page.viewOpened();
    },
    activeItemChange: function(navView, page, oldPage) {
        this.setOldPage(oldPage);
        this.setNewPage(page);
        // get references to the view
        escape.utils.AppVars.currentPage = page;
        // control which buttons are shown and hiiden
        var menuBtn = this.getMenuBtn();
        var rightBtn = this.getRightBtn();
        rightBtn.setCls(page.getRightBtn() + ' iconBtn');
        var itemIndex = navView.items.indexOf(page); // The index of the page
        if (itemIndex > 1) {
            // hide the menu button
            menuBtn.hide();
        } else {
            // show the menu btn we are on the first page
            menuBtn.show();
        }
    },
    itemHidden: function(hiddenPage) {
        if (this.getOldPage()) {
            if (hiddenPage.getId() == this.getOldPage().getId()) {
                this.getNewPage().viewOpened();
            }
        }

    }
});