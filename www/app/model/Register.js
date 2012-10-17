Ext.define("escape.model.Register", {
    singleton: true,

    // Loads the full weather including the forcasts
    check: function(callback, scope) {
        // Check to see if the user has picked a language
        var selfRef = this;
        escape.model.UserSettings.getSetting('RegID', {
            success: function(RegID) {
                if (!RegID) {
                    // no RegID has been selected
                    selfRef.getReistration(callback, scope);
                }
            },
            error: function(error) {
                // no user language has been selected
                selfRef.getReistration();
            },
            scope: this
        });

    },
    getReistration: function(callback, scope) {
        console.log('getReistration');
        var jsonData = {
            "UUIDNum": device.uuid,
            "AppID": AppSettings.AppID,
            "AppName": AppSettings.appAreaName,
            "App1Ver": "1.1.001",
            "App2Ver": "2.00",
            "DeviceType": device.name,
            "Language": escape.model.LanguageContent.getLangCode(),
            "OSType": device.platform,
            "OSVer": device.version
        };
        console.log(jsonData);
        var selfRef = this;
        // load the waeather
        Ext.Ajax.useDefaultXhrHeader = false;
        Ext.Ajax.request({
            headers: {
                'Content-Type': 'application/json'
            },
            url: 'http://ws2.tiltandco.net/RestServiceImpl.svc/RegisterBrief',
            method: "POST",
            jsonData: jsonData,
            success: function(response) {
                console.log('reg success');
                var regData = JSON.parse(Ext.decode(response.responseText));
                // process server response here
                selfRef.registerComplete(regData, callback, scope);
            },
            failure: function(response, opts) {
                console.log('reg failure');
                Ext.callback(callback.error, scope);
            }
        });
    },
    registerComplete: function(regData, callback, scope) {
        escape.model.UserSettings.setSetting('DevID', regData.DevID, {
            success: function(DevID) {},
            error: function(error) {},
            scope: this
        });
        escape.model.UserSettings.setSetting('RegID', regData.RegID, {
            success: function(RegID) {},
            error: function(error) {},
            scope: this
        });
        Ext.callback(callback.success, scope);
    }
});