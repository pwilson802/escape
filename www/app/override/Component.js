Ext.define('escape.override.Component', {
    override: 'Ext.Component',
    hide: function(animation) {
        return this.callParent([false]);
    }
});