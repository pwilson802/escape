 Ext.define('escape.utils.Twitter', {
     singleton: true,
     twitterKey: null,
     oauth: null,
     //////////////////////////////////////////////////////
     // TWITTER ACCESS
     /////////////////////////////////////////////////////
     getAccess: function(callback, scope) {
         var selfRef = this;
         if (this.twitterKey === null) {
             escape.model.UserSettings.getSetting('twitterKey', {
                 success: function(twitterKey) {
                     if (!twitterKey) {
                         // no twitterKey has been saved
                         selfRef.startAccessProcess(callback, scope);
                     } else {
                         selfRef.twitterKey = JSON.parse(twitterKey);
                         Ext.callback(callback.success, scope, [twitterKey]);
                     }
                 },
                 error: function(error) {
                     // no twitterKey has been saved
                     selfRef.startAccessProcess(callback, scope);
                 },
                 scope: this
             });
         } else {
             Ext.callback(callback.success, scope, [this.twitterKey]);
         }

     },
     startAccessProcess: function(callback, scope) {
         var selfRef = this;
         //
         this.oauth = OAuth(AppSettings.twitter);
         this.oauth.get('https://api.twitter.com/oauth/request_token', function(data) {
             requestParams = data.text;
             var childbrowser = escape.utils.AppVars.childbrowser;
             childbrowser.showWebPage('https://api.twitter.com/oauth/authorize?' + data.text);
             childbrowser.onLocationChange = function(loc) {
                 selfRef.broswerLocChnage(loc,callback, scope);
             }; // When the ChildBrowser URL changes we need to track that
         }, function(data) {
             console.log("ERROR: " + data);
         });
     },
     broswerLocChnage: function(loc, callback, scope) {
         if (loc.indexOf(AppSettings.twitter.callbackUrl) >= 0) {
             var selfRef = this;
             // Parse the returned URL
             var index, verifier = '';
             var params = loc.substr(loc.indexOf('?') + 1);

             params = params.split('&');
             for (var i = 0; i < params.length; i++) {
                 var y = params[i].split('=');
                 if (y[0] === 'oauth_verifier') {
                     verifier = y[1];
                 }
             }
             // Exchange request token for access token
            // Once a user has given us permissions we need to exchange that request token for an access token
             this.oauth.get('https://api.twitter.com/oauth/access_token?oauth_verifier=' + verifier + '&' + requestParams, function(data) {
                 var accessParams = {};
                 var qvars_tmp = data.text.split('&');
                 for (var i = 0; i < qvars_tmp.length; i++) {
                     var y = qvars_tmp[i].split('=');
                     accessParams[y[0]] = decodeURIComponent(y[1]);
                 }
                 selfRef.oauth.setAccessToken([accessParams.oauth_token, accessParams.oauth_token_secret]);
                 // the the access data
                 var accessData = {};
                 accessData.accessTokenKey = accessParams.oauth_token;
                 accessData.accessTokenSecret = accessParams.oauth_token_secret;
                 // Saving
                 selfRef.saveAccessToken(accessData, callback, scope);
                
             }, function(data) {
                 window.plugins.childBrowser.close();
                 Ext.callback(callback.error, scope, [false]);
             });
         }
     },
     saveAccessToken: function(accessData, callback, scope) {
         this.twitterKey = accessData;
         escape.model.UserSettings.setSetting('twitterKey', JSON.stringify(accessData), {
             success: function(FacebookAccessToken) {
             },
             error: function(error) {
             },
             scope: this
         });
          window.plugins.childBrowser.close();
         Ext.callback(callback.success, scope, [accessData]);
     },
     //////////////////////////////////////////////////////
     // TWEET
     /////////////////////////////////////////////////////
     tweet: function(tweet,callback,scope) {
         AppSettings.twitter.accessTokenKey = this.twitterKey.accessTokenKey; // This is saved when they first sign in
         AppSettings.twitter.accessTokenSecret = this.twitterKey.accessTokenSecret; // this is saved when they first sign in
         // jsOAuth takes care of everything for us we just need to provide the options
         this.oauth = OAuth(AppSettings.twitter);
         var selfRef = this;
         this.oauth.get('https://api.twitter.com/1/account/verify_credentials.json?skip_status=true', function(data) {
             var entry = JSON.parse(data.text);
             selfRef.post(tweet,callback,scope);
         });
     },
    /*
    Now that we have the information we can Tweet!
    */
     post: function(tweet,url,callback,scope) {
         this.oauth.post('https://api.twitter.com/1/statuses/update.json', {
             'status': tweet+' '+url,
             // jsOAuth encodes for us
             'trim_user': 'true'
         }, function(data) {
             var entry = JSON.parse(data.text);
             Ext.callback(callback.success, scope, []);
             // FOR THE EXAMPLE
             app.done();
         }, function(data) {
             console.log(data);
             Ext.callback(callback.error, scope, []);
         });
     }
 });