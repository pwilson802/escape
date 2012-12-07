Ext.define("escape.model.Alerts", {
    requires: ['Ext.DateExtras', 'escape.model.UserSettings'],
    mixins: ['Ext.mixin.Observable'],
    singleton: true,
    query: null,
    distance: -1,
    geoLocation: false,
    getAlerts: function(feedString,callback, scope) {
		console.log(feedString);
		var selfRef = this;
        // load the aleats
        //{"Latitude":"-33.8607","Longitude":"151.205","Radius":"100","IsMajor":"0","Types":"Fire,Flood,Incident","RegID":"1","AppID":"2"}
        var regID = escape.utils.Tracking.getRegID();
        Ext.Ajax.useDefaultXhrHeader = false;
        Ext.Ajax.request({
            headers: {
                'Content-Type': 'application/json'
            },
            url: 'http://ws2.tiltandco.net/RestServiceImpl.svc/RTAHazards?nocache=' + new Date().getTime(),
            method: "POST",
            jsonData: {
                "Radius": AppSettings.radius,
                "Latitude":  AppSettings.center[0],
                "Longitude": AppSettings.center[1],
                "IsMajor" : 0,
                "Types": feedString,
                "RegID": regID,
                "AppID": AppSettings.AppID
            },
            success: function(response) {
                var alertData = JSON.parse(Ext.decode(response.responseText));
                console.log(alertData);
                // return the results
                Ext.callback(callback.success, scope,[alertData]);
            },
            failure: function(response, opts) {
                Ext.callback(callback.error, scope);
            }
        });
    }
    
});