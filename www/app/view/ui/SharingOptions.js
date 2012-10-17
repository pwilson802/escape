Ext.define("escape.view.ui.SharingOptions", {
    extend: 'Ext.Panel',
    requires: ['Ext.DomQuery', 'Ext.form.Panel'],
    xtype: 'sharingOptions',
    config: {
        cls: 'sharingOptions',
        modal: true,
        centered: true,
        hideOnMaskTap: true,
        padding: '10px',
        items: [{
            xtype: 'button',
            margin: '10px 0',
            action: 'email',
            cls:'email',
            text: 'Email'
        }, {
            xtype: 'button',
            margin: '10px 0',
            action: 'facebook',
            cls:'facebook',
            text: 'Facebook'
        }, {
            xtype: 'button',
            margin: '10px 0',
             cls:'twitter',
            action: 'twitter',
            text: 'Twitter'
        }, {
            xtype: 'button',
            margin: '10px 0',
            cls:'reset',
            action: 'cancel',
            text: 'Close'
        }],
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
    },
    showMessageForm: function(action) {
        console.log('!!! showMessageForm: ' + action);
        var items = [];
        items.push({
            itemId:'messagebox',
            xtype: 'textareafield',
            maxRows: 5,
            name: 'meesage'
        });
         items.push({
            xtype: 'button',
            text: 'Post',
            maxRows: 5,
            action: action
        });
         this.setItems(items);
    },
    showLoading : function(){
        this.setItems({xtype: 'loadingDisplay'});
    },
    showSuccess : function(){
        this.setItems({html: 'sucess'});
        var selfRef = this;
        var task = new Ext.util.DelayedTask(function() {
            selfRef.hide();
        }, this);
        task.delay(1000);
    },
    showError : function(){
        this.setItems({html: 'loadError'});
         var task = new Ext.util.DelayedTask(function() {
            selfRef.hide();
        }, this);
        task.delay(1000);
    }
});