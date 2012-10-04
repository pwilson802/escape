 Ext.define('escape.utils.Facebook', {
     singleton: true,
     accessToken: null,
     //////////////////////////////////////////////////////
     // FACEBOOK ACCESS
     /////////////////////////////////////////////////////
     getAccess: function(callback, scope) {
        console.log('!!! facebookAccessToken get access');
         var selfRef = this;
         console.log('this.accessToken: ' + this.accessToken);
         if (this.accessToken === null) {
             escape.model.UserSettings.getSetting('facebookAccessToken', {
                 success: function(accessToken) {
                    console.log('!!! accessToken: ' + accessToken);
                     if (!accessToken) {
                         // no FacebookAccessToken has been save
                         selfRef.startAccessProcess(callback, scope);
                     } else {
                         selfRef.accessToken = accessToken;
                         Ext.callback(callback.success, scope, [accessToken]);
                     }
                 },
                 error: function(error) {
                     // no FacebookAccessToken has been save
                     selfRef.startAccessProcess(callback, scope);
                 },
                 scope: this
             });
         } else {
             Ext.callback(callback.success, scope, [this.accessToken]);
         }

     },
     startAccessProcess: function(callback, scope) {
         var childbrowser = escape.utils.AppVars.childbrowser;
         // Buid Authorization URL
         var authorizeUrl = "https://graph.facebook.com/oauth/authorize?";
         authorizeUrl += "client_id=" + AppSettings.facebook.clientId;
         authorizeUrl += "&redirect_uri=" + AppSettings.facebook.redirectUrl;
         authorizeUrl += "&display=" + AppSettings.facebook.display;
         authorizeUrl += "&scope=publish_stream,offline_access";
         // Listen for child browser window changes
         var selfRef = this;
         childbrowser.onLocationChange = function(loc) {
             selfRef.broswerLocChange(loc, callback, scope);
         };
         // Open the authorization page
         if (childbrowser !== null) {
             window.plugins.childBrowser.showWebPage(authorizeUrl);
         }
     },
     broswerLocChange: function(loc, callback, scope) {
         // When the childBrowser window changes locations we check to see if that page is our success page.
         if (loc.indexOf(AppSettings.facebook.redirectUrl) >= 0) {
             var fbCode = loc.match(/code=(.*)$/)[1];
             this.getAccessToken(fbCode, callback, scope);
         }
     },
     getAccessToken: function(fbCode, callback, scope) {
         var selfRef = this;
         var url = 'https://graph.facebook.com/oauth/access_token?client_id=' + AppSettings.facebook.clientId + '&client_secret=' +AppSettings.facebook.secret + '&code=' + fbCode + '&redirect_uri=' + AppSettings.facebook.redirectUrl;

         Ext.Ajax.request({
             url: url,
             method: "POST",
             success: function(response) {
                 var accessToken = response.responseText.split("=")[1];
                 selfRef.saveAccessToken(accessToken, callback, scope);
                 window.plugins.childBrowser.close();
             },
             failure: function(response, opts) {
                 window.plugins.childBrowser.close();
                 Ext.callback(callback.success, scope, [false]);
             }
         });
     },
     saveAccessToken: function(accessToken, callback, scope) {
         this.accessToken = accessToken;
         console.log(accessToken);
         escape.model.UserSettings.setSetting('facebookAccessToken', accessToken, {
             success: function(FacebookAccessToken) {
                 console.log('facebookAccessToken Saved');
             },
             error: function(error) {
                 console.log('facebookAccessToken Error');
             },
             scope: this
         });
         Ext.callback(callback.success, scope, [accessToken]);
     },
     //////////////////////////////////////////////////////
     // FACEBOOK SHARING
     /////////////////////////////////////////////////////
     postMessage: function(fbType, extraParams,callback, scope) {
         console.log('!!!!! postMessage');
         var url = 'https://graph.facebook.com/me/' + fbType + '?access_token=' + this.accessToken;
         for (var key in extraParams) {
             if (key == "message") {
                 // We will want to escape any special characters here vs encodeURI
                 url = url + "&" + key + "=" + escape(extraParams[key]);
             } else {
                 url = url + "&" + key + "=" + encodeURIComponent(extraParams[key]);
             }
         }
         Ext.Ajax.request({
             url: url,
             method: "POST",
             success: function(response) {
                 console.log('!!! post success');
                 Ext.callback(callback.success, scope, []);
             },
             failure: function(response, opts) {
                Ext.callback(callback.error, scope, []);
                 console.log('!!! post fail');
                 console.log('server-side failure with status code ' + response.status);
             }
         });
     }

 });