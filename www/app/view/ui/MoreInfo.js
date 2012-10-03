Ext.define("escape.view.ui.MoreInfo", {
	extend: 'Ext.Component',
	requires: ['Ext.DomQuery'],
	xtype: 'moreInfo',
	config: {
		data: {
			introText: 'intro',
			fullText: 'fulltext'
		},
		cls: 'expandableInfo',
		tpl: '{introText} <div class="moreInfoBtn">More Info +</div>',
		listeners: {
			painted: function() {
				this.element.on('tap', this.showMoreInfo, this, {
					single: true,
					delay: 100
				});
			}
		}
	},
	showMoreInfo: function(btn) {
		this.element.setHTML('FULL TEXT');
	}

});