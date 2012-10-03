Ext.define('escape.controller.Section', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.util.DelayedTask'],
    config: {
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
        section.setNavigationView(section.getItems().items[section.getNavViewItemId()]);
        var scrollTopTopBtn = section.add({
            xtype: 'scrollTopTopBtn',
            width: Ext.Viewport.getSize().width - 120
        });
        section.setTopText(scrollTopTopBtn.getComponent('topBtn'));
        // a new section has be activate, add the first view
        var sec = Ext.ComponentQuery.query('#' + section.id);
        var navView = Ext.ComponentQuery.query('#' + section.id + ' navigationview')[0];
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
        escape.utils.AppVars.currentPage = page;
        var view = navView.parent; // reference to the parent of the Naviagtion view
        var menuBtn = Ext.ComponentQuery.query('#' + view.id + ' menuBtn')[0]; // get a referance to the menu button
        var rightBtn = Ext.ComponentQuery.query('#' + view.id + ' button[action="rightBtn"]')[0]; // get a referance to the menu button
        //rightBtn.replaceCls(rightBtn.getCls(),); // change the class of the right button of the navigation view as it is required
        rightBtn.setCls(page.getRightBtn() + ' iconBtn');
        var itemIndex = navView.items.indexOf(page); // The index of the page
        if (itemIndex > 1) {
            // hide the menu button
            menuBtn.hide();
            var task1 = Ext.create('Ext.util.DelayedTask', function() {
                page.viewOpened();
            });
            task1.delay(500);

        } else {
            // show the main menu button after a delay
            var task2 = Ext.create('Ext.util.DelayedTask', function() {
                menuBtn.show();
            });
            task2.delay(500);
        }
        // set the current page
    },
    itemHidden: function(page) {

    }
});