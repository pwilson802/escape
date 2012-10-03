Ext.define('escape.controller.Sharing', {
    requires: ['escape.view.ui.SharingOptions', 'escape.utils.Facebook', 'escape.utils.Twitter'],
    extend: 'Ext.app.Controller',
    config: {
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
    showSharingOptions: function() {
        var sharingOptions = Ext.create('escape.view.ui.SharingOptions');
        Ext.Viewport.add(sharingOptions);
        sharingOptions.show();
    },
    removeSharingOptions: function() {
        console.log('!!!! removeSharingOptions');
        Ext.Viewport.remove(this.getSharingOptions());
    },
    sendEmail: function() {
        console.log('!!!! sendEmail');
        try {
            window.plugins.emailComposer.showEmailComposer("Check this out", "sharing msgs");
        } catch (e) {
            window.open('mailto:' + emailAddress, '_blank');
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
        // Get access code
        escape.utils.Facebook.getAccess({
            success: function(accessToken) {
                console.log('!!!! get acceess success');
                console.log(accessToken);
                selfRef.getSharingOptions().showMessageForm('postToFacebook');

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
        escape.utils.Facebook.postMessage('feed', {
            message: message,
            name: 'Kosciuszko National Park',
            description: 'Check out Kosciuszko National Park at Visit NSW.',
            link: 'http://www.visitnsw.com/destinations/snowy-mountains/kosciuszko-national-park/kosciuszko/attractions/kosciuszko-national-park'
        }, {
            success: function(accessToken) {
                console.log('!!!! post success');
                selfRef.getSharingOptions().showSuccess();
            },
            error: function(error) {
                console.log('!!!! post error');
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
        window.plugins.twitter.isTwitterSetup(function(r) {
            console.log('isTwitterSetup: ' + r);
            if (r === 1) {
                window.plugins.twitter.composeTweet(

                function() {
                    console.log("tweet success");
                }, function(error) {
                    console.log("tweet failure: " + error);
                }, "Check out Kosciuszko National Park at Visit NSW.", {
                    urlAttach: "http://www.visitnsw.com/destinations/snowy-mountains/kosciuszko-national-park/kosciuszko/attractions/kosciuszko-national-park"
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
        var selfRef = this;
        this.getSharingOptions().showLoading();
        escape.utils.Twitter.getAccess({
            success: function(accessToken) {
                console.log('!!!! Twitter get acceess success');
                console.log(accessToken);
                selfRef.getSharingOptions().showMessageForm('postToTwitter');
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
        this.getSharingOptions().showLoading();
        escape.utils.Twitter.tweet(message, {
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