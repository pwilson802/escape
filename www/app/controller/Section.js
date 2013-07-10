Ext.define('escape.controller.Section', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.util.DelayedTask'],
    config: {
        menuBtn: null,
        rightBtn: null,
        oldPage: null,
        newPage: null,
        refs: {
            mainView: 'mainView'
        },
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
        escape.utils.AppVars.currentSection = section;
        // add the scroll to top button
        var navView = section.getItems().items[section.getNavViewItemId()];
        section.setNavigationView(navView);
        // scroll to to btn
        var scrollTopTopBtn = section.add({
            xtype: 'scrollTopTopBtn',
            width: Math.round(Ext.Viewport.getSize().width - 120)
        });
        section.setTopText(scrollTopTopBtn.getComponent('topBtn'));
        // add close mask

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
        var selfRef = this;
        // check for an open swipe
        section.element.on({
            swipe: function(e, node) {
                var direction = e.direction;
                var vaildSwipe = true;


                var targets = e.changedTouches[0].targets;
                for (var i = 0; i < targets.length; i++) {
                    var target = targets[i];
                    var el = Ext.get(target);
                    if (el.hasCls('x-carousel')) {
                        vaildSwipe = false;
                        break;
                    }
                };
                if (vaildSwipe) {
                    if (direction == 'right') {
                        if (selfRef.getMainView().isClosed()) {
                            selfRef.getMainView().toggleContainer();
                        }
                    }
                    if (direction == 'left') {
                        if (!selfRef.getMainView().isClosed()) {
                            selfRef.getMainView().toggleContainer();
                        }
                    }
                }
            }
        });
    },
    menuClosed: function() {
        var page = escape.utils.AppVars.currentPage;
        page.viewOpened();
    },
    activeItemChange: function(navView, page, oldPage) {
        // close the old page
        if (oldPage){
            oldPage.viewClose();
        }
        this.setOldPage(oldPage);
        this.setNewPage(page);
        // get references to the view
        escape.utils.AppVars.currentPage = page;
        // control which buttons are shown and hiiden
        var rightBtn = this.getRightBtn();
        rightBtn.setCls(page.getRightBtn() + ' iconBtn');
        var itemIndex = navView.items.indexOf(page); // The index of the page
        if (itemIndex === 2) {
            // hide the men1u button
            this.getMenuBtn().hide();
        }
        if (itemIndex===1) {
            // show the menu btn we are on the first page
            this.getMenuBtn().show();
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