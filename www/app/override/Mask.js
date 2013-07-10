/**
 * app/override/Button.js
 */
Ext.define('escape.override.Mask', {
    override: 'Ext.Mask',
    onEvent: function(e) {

        var controller = arguments[arguments.length - 1];
        if (controller.info.eventName === 'tap') {
            this.fireEvent('tap', this, e);
            return false;
        }
        if (controller.info.eventName === 'swipe') {
            console.log('SWIPE');
            this.fireEvent('swipe', this, e);
            return false;
        }
        if (e && e.stopEvent) {
            e.stopEvent();
        }
        return false;
    }
});