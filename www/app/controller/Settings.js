Ext.define('escape.controller.Settings', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            settingsPage: 'settingsPage'
        },
        control: {
            'settingsPage button[action=clearCache]': {
                tap: 'clearCache'
            },
            'settingsPage #offlineContent': {
                change: 'switchUseOffline'
            },
             'settingsPage #offlineMap': {
                change: 'switchUseOfflineMaps'
            }
        }
    },
    // swich use offline
    switchUseOffline: function(){
        if (escape.model.Content.getUseOffline()) {
            escape.model.Content.setUseOffline(false);
        } else {
            escape.model.Content.setUseOffline(true);
        }
    },
      // swich use offline maps
    switchUseOfflineMaps: function(){
        if (escape.model.Map.getUseOffline()) {
            escape.model.Map.setUseOffline(false);
        } else {
            escape.model.Map.setUseOffline(true);
        }
    },
    // clear the proxy cache
    clearCache: function() {
        // will clear all downloaded data
         var localdata =  localStorage.getItem("proxyCache");
        localStorage.setItem("proxyCache", '{}');
        localdata =  localStorage.getItem("proxyCache");
        
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