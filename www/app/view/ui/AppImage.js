Ext.define("escape.view.ui.AppImage", {
    requires: ['escape.utils.Img'],
    extend: 'Ext.Img',
    xtype: 'appImage',
    config: {
        imagePath: '',
        height: 200,
        altText: null,
        infoOpen: false,
        cls: 'appImg',
        listeners: {
            initialize: 'requestSize',
            tap: 'dispalyInfo'
        }
    },
   

    dispalyInfo: function() {
        if (!this.getInfoOpen() && this.getAltText() !== null) {
            this.setInfoOpen(true);
            var selfRef = this;
            var infoPanel = Ext.create('Ext.Panel', {
                cls: 'infoMsg',
                modal: true,
                centered: true,
                html: this.getAltText(),
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
                // delay the set of closed
                var task = new Ext.util.DelayedTask(function() {
                     selfRef.setInfoOpen(false);
                }, this);
                task.delay(300);
            });
            Ext.Viewport.add(infoPanel);
            infoPanel.show();
        }

    },
    requestSize: function() {
        var path = this.getImagePath();
        // path = escape.utils.Img.getImgPath(path, this.getWidth(), this.getHeight());
        //this.setStyle(escape.utils.Img.getImgStyle(this.getWidth(), this.getHeight()));
        // set the image path
        this.setSrc(path);
    }
});