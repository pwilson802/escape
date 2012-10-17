Ext.define('escape.controller.Sharing', {
    requires: ['escape.view.ui.SharingOptions', 'escape.utils.Facebook', 'escape.utils.Twitter'],
    extend: 'Ext.app.Controller',
    config: {
        sharingData: null,
        refs: {
            sharingOptions: 'sharingOptions'
        },
        control: {
            'section button[cls="shareBtn iconBtn"]': {
                tap: 'showSharingOptions'
            },
            'sharingOptions button[action=email]': {
                tap: 'sendEmail'
            },
            'sharingOptions button[action=facebook]': {
                tap: 'shareFacebook'
            },
            'sharingOptions button[action=twitter]': {
                tap: 'shareTwitter'
            },
            'sharingOptions button[action=cancel]': {
                tap: 'cancelSharing'
            },
            'sharingOptions button[action=postToFacebook]': {
                tap: 'postToFacebook'
            },
            'sharingOptions button[action=postToTwitter]': {
                tap: 'postToTwitter'
            },
            'sharingOptions': {
                hide: 'removeSharingOptions'
            }
        }
    },
    showSharingOptions: function(btn) {
        var sharingOptions = Ext.create('escape.view.ui.SharingOptions');

        var sharingData = escape.utils.AppVars.currentPage.getSharingData();
        console.log(sharingData);
        if (!sharingData){
            sharingData = AppSettings.defualtShareData;
        }
        console.log(sharingData);
        
        this.setSharingData(sharingData);
        Ext.Viewport.add(sharingOptions);
        sharingOptions.show();
        //this.getSharingOptions().showMessageForm('postToFacebook');
    },
    removeSharingOptions: function() {
        Ext.Viewport.remove(this.getSharingOptions());
    },
    sendEmail: function() {
        var sharingData = this.getSharingData();
        var subject = sharingData.name;
        var body = sharingData.emailBody;
        try {
            window.plugins.emailComposer.showEmailComposer(subject, body);
        } catch (e) {
            window.open('mailto:?subject='+subject+'&body='+body, '_blank');
        }
        escape.utils.Tracking.trackEventOnCurrent(10);
    },
    cancelSharing: function() {
        var sharingOptions = this.getSharingOptions();
        Ext.Viewport.remove(sharingOptions);
    },
    ///////////////////////////////////////////////////////////////////
    // FACEBOOK
    ///////////////////////////////////////////////////////////////////
    shareFacebook: function() {
        console.log('!!!! shareFacebook');
        // this device does not support native twitter use the OAuth method
        this.getSharingOptions().showLoading();
        var selfRef = this;
        escape.utils.Tracking.trackEventOnCurrent(11);
        var sharingData = this.getSharingData();
        // Get access code
        escape.utils.Facebook.getAccess({
            success: function(accessToken) {
                console.log('!!!! get acceess success');
                console.log(accessToken);
                selfRef.getSharingOptions().showMessageForm('postToFacebook',sharingData.defaultMessage);

            },
            error: function(error) {
                console.log('!!!! get acceess error');
                console.log(accessToken);
            },
            scope: this
        });



    },
    postToFacebook: function(btn) {

        var messageArea = btn.parent.getComponent('messagebox');
        var message = messageArea.getValue();
        this.getSharingOptions().showLoading();
        var selfRef = this;
        console.log(message);
        var sharingData = this.getSharingData();
        escape.utils.Facebook.postMessage('feed', {
            message: message,
            name: sharingData.name,
            description: sharingData.description,
            link: sharingData.link,
            picture : sharingData.picture
        }, {
            success: function(accessToken) {
                console.log('!!!! facebook post success');
                selfRef.getSharingOptions().showSuccess();
            },
            error: function(error) {
                console.log('!!!! facebook post error');
                selfRef.getSharingOptions().showError();
            }
        }, this);
    },
    ///////////////////////////////////////////////////////////////////
    // TWITTER
    ///////////////////////////////////////////////////////////////////
    shareTwitter: function() {
        console.log('!!!! shareTwitter');
        escape.utils.Tracking.trackEventOnCurrent(12);
        var selfRef = this;
        var sharingData = this.getSharingData();
        
        window.plugins.twitter.isTwitterSetup(function(r) {
            console.log('isTwitterSetup: ' + r);
            if (r === 1) {
                window.plugins.twitter.composeTweet(

                function() {
                    console.log("tweet success");
                }, function(error) {
                    console.log("tweet failure: " + error);
                }, sharingData.defaultMessage, {
                    urlAttach: sharingData.link,
                    imageAttach: sharingData.picture
                });
            } else {
                selfRef.useOAuthTwitter();
            }
        });
        //this.useOAuthTwitter();
    },
    useOAuthTwitter: function() {
        // this does not supports iOS native tweeting!
        console.log('!!!! oAuth shareTwitter');
        var sharingData = this.getSharingData();
        var selfRef = this;
        this.getSharingOptions().showLoading();
        escape.utils.Twitter.getAccess({
            success: function(accessToken) {
                console.log('!!!! Twitter get acceess success');
                console.log(accessToken);
                selfRef.getSharingOptions().showMessageForm('postToTwitter',sharingData.defaultMessage);
                //
            },
            error: function(error) {
                console.log('!!!! Twitter get acceess error');
                console.log(accessToken);
            },
            scope: this
        });
    },
    postToTwitter: function(btn) {
        console.log("!!! postToTwitter");
        var selfRef = this;
        var messageArea = btn.parent.getComponent('messagebox');
        var message = messageArea.getValue();
        console.log('!!! message');
        console.log(message);
        var sharingData = this.getSharingData();
        this.getSharingOptions().showLoading();
        escape.utils.Twitter.tweet(message, sharingData.link, {
            success: function(accessToken) {
                console.log('!!!! post success');
                selfRef.getSharingOptions().showSuccess();
            },
            error: function(error) {
                console.log('!!!! post error');
                selfRef.getSharingOptions().showError();
            }
        }, this);
    }

});