Ext.define("escape.view.ui.QuestionAction", {
    extend: 'Ext.ActionSheet',
    xtype: 'questionAction',
    config: {
        cls: 'btnsArea questionAction',
        hideOnMaskTap: true,
        question: null,
        btns: null,
        padding: '10px',
        defaults: {
            margin: '10px 0 0 0'
        }
    },
    initialize: function() {
        var items = [];
        items.push({
            xtype:'container',
            cls:'question',
            html: this.getQuestion()
        });
        console.log(this.getBtns());
        items=  items.concat(this.getBtns());
        console.log(items);
        this.setItems(items);
    }

});