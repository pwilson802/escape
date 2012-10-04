Ext.define("escape.view.ui.ContentImg", {
    requires: ['Ext.device.Connection', 'Ext.device.Device', 'Ext.env.OS', 'escape.utils.Img'],
    extend: 'Ext.Img',
    xtype: 'contentImg',
    config: {
        imagePath: '',
        width: 320,
        height: 200,
        altId: null,
        infoOpen: false,
        cls: 'contentImg',
        listeners: {
            initialize: 'requestSize',
            tap: 'infoRequested'
        }
    },
    infoRequested: function() {
        if (!this.getInfoOpen()) {
            var selfRef = this;
            if (this.getAltId()) {
                escape.model.LanguageContent.load(this.getAltId(), {
                    success: function(translation) {
                        selfRef.dispalyInfo(translation);
                    },
                    error: function(error) {},
                    scope: this
                });
            }
        }
    },
    dispalyInfo: function(translation) {
        if (!this.getInfoOpen()) {
            this.setInfoOpen(true);
            var selfRef = this;
            var infoPanel = Ext.create('Ext.Panel', {
                cls: 'infoMsg',
                modal: true,
                centered: true,
                html: translation,
                hideOnMaskTap: true,
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
            infoPanel.on('hide', function() {
                selfRef.setInfoOpen(false);
            });
            Ext.Viewport.add(infoPanel);
            infoPanel.show();
        }

    },
    requestSize: function() {
        var path = this.getImagePath();
        //path = escape.utils.Img.getImgPath(path, this.getWidth(), this.getHeight());
        //this.setStyle(escape.utils.Img.getImgStyle(this.getWidth(), this.getHeight()));
        // set the image path
        this.setSrc(path);
    }
});