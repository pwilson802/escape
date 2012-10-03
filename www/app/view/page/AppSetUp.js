/**
 *  {@link escape.view.AppSetUp} is a subclass of {@link Ext.Container}
 *  That show a loading display to the user while the appliction is been set up
 *  @author Ryan O'Connell
 */
Ext.define("escape.view.page.AppSetUp", {
    extend: 'Ext.Container',
    requires: [],
    config: {
        items: [{
            html: "Loading the appliction settings"
        }, {
            xtype: 'button',
            text: 'Data loaded',
            //TODO : move this functionality to a model/controller to handle the data set up
            handler: function() {
                // clear the view port
                Ext.Viewport.removeAll();
                // add the main view
                Ext.Viewport.add(Ext.create('escape.view.Main'));
                // set it to active
                Ext.Viewport.setActiveItem(1);
            }

        }]
    }
});