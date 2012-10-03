Ext.define("escape.view.ui.FavoriteBtn", {
    extend: 'Ext.Button',
    xtype: 'favoriteBtn',
    config: {
        action: 'addToFavorites',
        cls: 'favoriteBtn',
        top: 116,
        right: 13,
        width: 50,
        height: 50
    }
});