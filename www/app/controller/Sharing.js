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
            },
            'section button[action="shareApp"]': {
                tap: 'showSharingOptions'
            }
        }
    },
    showSharingOptions: function(btn) {
        // define sharing data
        try {
            sharingData = escape.utils.AppVars.currentPage.getSharingData();
        } catch (e) {
            sharingData = false;
        }

        if (!sharingData) {
            sharingData = AppSettings.defualtShareData;
        }
        // set share type
        if (!window.plugins.share) {
            // android sharing not  found
            var sharingOptions = Ext.create('escape.view.ui.SharingOptions');
            var sharingData;

            this.setSharingData(sharingData);
            Ext.Viewport.add(sharingOptions);
            sharingOptions.show();

        } else {
            // use android share plugin
            window.plugins.share.show({
                subject: sharingData.name,
                text: sharingData.defaultMessage + ' ' + sharingData.link
            }, function() {
            }, // Success function

            function() {
            } // Failure function
            );
        }

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
            window.open('mailto:?subject=' + subject + '&body=' + body, '_blank');
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
        // this device does not support native twitter use the OAuth method
        this.getSharingOptions().showLoading();
        var selfRef = this;
        escape.utils.Tracking.trackEventOnCurrent(11);
        var sharingData = this.getSharingData();
        // Get access code
        escape.utils.Facebook.getAccess({
            success: function(accessToken) {
                selfRef.getSharingOptions().showMessageForm('postToFacebook', sharingData.defaultMessage);

            },
            error: function(error) {},
            scope: this
        });



    },
    postToFacebook: function(btn) {

        var messageArea = btn.parent.getComponent('messagebox');
        var message = messageArea.getValue();
        this.getSharingOptions().showLoading();
        var selfRef = this;
        var sharingData = this.getSharingData();
        escape.utils.Facebook.postMessage('feed', {
            message: message,
            name: sharingData.name,
            description: sharingData.description,
            link: sharingData.link,
            picture: sharingData.picture
        }, {
            success: function(accessToken) {
                selfRef.getSharingOptions().showSuccess();
            },
            error: function(error) {
                selfRef.getSharingOptions().showError();
            }
        }, this);
    },
    ///////////////////////////////////////////////////////////////////
    // TWITTER
    ///////////////////////////////////////////////////////////////////
    shareTwitter: function() {
        escape.utils.Tracking.trackEventOnCurrent(12);
        var selfRef = this;
        var sharingData = this.getSharingData();

        window.plugins.twitter.isTwitterSetup(function(r) {
            if (r === 1) {
                window.plugins.twitter.composeTweet(

                function() {}, function(error) {}, sharingData.defaultMessage, {
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
        var sharingData = this.getSharingData();
        var selfRef = this;
        this.getSharingOptions().showLoading();
        escape.utils.Twitter.getAccess({
            success: function(accessToken) {
                selfRef.getSharingOptions().showMessageForm('postToTwitter', sharingData.defaultMessage);
                //
            },
            error: function(error) {},
            scope: this
        });
    },
    postToTwitter: function(btn) {
        var selfRef = this;
        var messageArea = btn.parent.getComponent('messagebox');
        var message = messageArea.getValue();
        var sharingData = this.getSharingData();
        this.getSharingOptions().showLoading();
        escape.utils.Twitter.tweet(message, sharingData.link, {
            success: function(accessToken) {
                selfRef.getSharingOptions().showSuccess();
            },
            error: function(error) {
                selfRef.getSharingOptions().showError();
            }
        }, this);
    }

});