Ext.define("escape.view.Main", {
    extend: 'Ext.ux.slidenavigation.View',
    requires: ['Ext.Container', 'Ext.field.Search'],
    xtype: 'mainView',
    config: {

        fullscreen: true,
        /**
         *  Any component within the container with an 'x-toolbar' class
         *  will be draggable.  To disable draggin all together, set this
         *  to false.
         */
        slideSelector: 'scrollTopTopContainer',
        /**
         *  Time in milliseconds to animate the closing of the container
         *  after an item has been clicked on in the list.
         */
        selectSlideDuration: 200,
        /**
         *  This allows us to configure how the actual list container
         *  looks.  Here we've added a custom search field and have
         *  modified the width.
         */
        list: {
            maxDrag: 400,
            width: 245
        },
        /**
         *  Example of how to re-order the groups.
         */
        groups: {
            'Group 1': 1,
            'Group 2': 3,
            'Group 3': 2,
            'Group 4': 4,
            'Group 5': 5
        },
        /**
         *  These are the default values to apply to the items within the
         *  container.
         */
        defaults: {
            style: 'background: #f6f5f1',
            xtype: 'section'
        },

        items: AppSettings.mainMenu

    }
});