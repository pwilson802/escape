Ext.define("escape.view.page.ThingsToDoType", {
    extend: 'escape.view.page.ContentPage',
    xtype: 'thingsToDoTypePage',
    requires: ['escape.view.ui.ExpandableInfo', 'escape.view.ui.MoreInfo'],
    config: {
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        subPageXtype: 'listTypesSubSection',
        rightBtn: 'searchBtn',
        pageTypeId: 17,
        pageTrackingId: 17
    }
});