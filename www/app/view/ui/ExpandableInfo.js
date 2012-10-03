Ext.define("escape.view.ui.ExpandableInfo", {
    extend: 'Ext.Container',
    xtype: 'expandableInfo',
    config: {
        heading: '',
        completeText: '',
        introText: '',
        fullText: '',
        showBorder: true,
        showParagraphs: 3,
        cls: 'expandableInfo',
        items: [{
            cls: 'text',
            html: '',
            itemId: 'text'
        }, {
            xtype: 'button',
            cls: 'textBtn',
            text: "More Information",
            action: 'moreInfo',
            itemId: 'moreInfo'

        }],
        control: {
            'button[action=moreInfo]': {
                tap: 'showMoreInfo'
            }
        },
        listeners: {
            initialize: function() {
                this.build();
            }
        }

    },
    build: function() {
        if (this.getShowBorder()) {
            this.addCls('border');
        }
        var output = '';
        this.setFullText(this.getCompleteText());
        var text = Ext.String.trim(this.getCompleteText());
        var paragraphs = text.split('</p>');


        // if a heading was defined add one
        var titleText = this.getHeading();
        if (titleText.length > 0) {
            output += '<h2>' + titleText + '</h2>';
        }
        if (paragraphs.length > (this.getShowParagraphs() + 1)) {
            var introText = '';
            for (var i = 0; i < this.getShowParagraphs(); i++) {
                introText += paragraphs[i] + '</p>';
            }
            this.setIntroText(introText);
            output += this.getIntroText();
        } else {
            output += this.getFullText();
            this.getComponent('moreInfo').hide();
        }
        var width = Ext.Viewport.getSize().width - 20;
        output = output.split('<p>').join('<p style="width:' + width + 'px">');

        this.getComponent('text').setWidth(width);
        this.getComponent('text').setHtml(output);

    },
    showMoreInfo: function(btn) {
        var output = '';
        var titleText = this.getHeading();
        if (titleText.length > 0) {
            output += '<h2>' + titleText + '</h2>';
        }
        output += this.getFullText();

        var width = Ext.Viewport.getSize().width - 20;
        output = output.split('<p>').join('<p style="width:' + width + 'px">');

        this.getComponent('text').setHtml(output);
        btn.hide();
    }
});