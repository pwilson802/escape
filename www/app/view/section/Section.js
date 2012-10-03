/**
 *  {@link escape.view.AppSetUp} is a subclass of {@link Ext.NavigationView}
 *  Provides extended functionality to the Container for view of the slidemenu
 *  @author Ryan O'Connell
 */
Ext.define("escape.view.section.Section", {
    extend: 'Ext.Container',
    xtype: 'section',
    requires: ['Ext.navigation.View', 'escape.view.ui.MenuBtnFloating', 'escape.view.ui.RightBtnFloating', 'Ext.layout.Card', 'escape.view.ui.ScrollToTopBtn'],
    config: {
        isBuilt: false,
        navViewItemId: 0,
        navigationView: null,
        collectionType: null,
        topText : null,
        firstPage: {
            xtype: 'homePage'
        },
        items: [{
            xtype: 'navigationview'
        }, {
            xtype: 'menuBtnFloating'
        }, {
            xtype: 'rightBtnFloating'
        }]
    }
});