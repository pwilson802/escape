Ext.define('escape.controller.Settings', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            settingsPage: 'settingsPage'
        },
        control: {
            'settingsPage button[action=clearCache]': {
                tap: 'clearCache'
            }
        }
    },
    // clear the proxy cache
    clearCache: function() {
        // will clear all downloaded data
        console.log('clearCache');
         var localdata =  localStorage.getItem("proxyCache");
         console.log(localdata);
        localStorage.setItem("proxyCache", '{}');
        localdata =  localStorage.getItem("proxyCache");
         console.log(localdata);
        
         var addedMsg = Ext.create('Ext.Panel', {
            cls: 'prompt favsAddedMsg',
           // modal: true,
            centered: true,
            //hideOnMaskTap: true,
            masked: false,
            html: 'Cleared',
            showAnimation: {
                type: 'popIn',
                duration: 200,
                easing: 'ease-out'
            },
            hideAnimation: {
                type: 'popOut',
                duration: 100,
                easing: 'ease-out'
            }
        });

        Ext.Viewport.add(addedMsg);
        addedMsg.show();

        var task = new Ext.util.DelayedTask(function() {
            addedMsg.hide();
        }, this);
        task.delay(1000);
    }

});