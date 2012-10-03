Ext.define("escape.view.subSection.Itinerary", {
    extend: 'escape.view.subSection.SubSection',
    requires: ['Ext.Toolbar', 'Ext.Button', 'escape.view.page.ItineraryDay'],
    xtype: 'itinerarySubSection',
    config: {
        rightBtn: "editBtn",
        cardViewItemId: 1,
        itinerary: null,
        layout:'vbox'
    },
    openView: function() {
        this.pageName = this.getItinerary().name;
        this.setNavTitle(this.getItinerary().name);
        var startDate = new Date(this.getItinerary().startDate);
        var endDate = new Date(this.getItinerary().endDate);
        var oneDay = 1000 * 60 * 60 * 24;
        var daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (oneDay));

        var btns = [{
            xtype: 'button',
            action: 'back',
            docked: 'left',
            cls: 'backBtn'
        }, {
            xtype: 'button',
            action: 'next',
            docked: 'right',
            cls: 'nextBtn'
        }];

        if (daysDiff === 0) {
            btns = [];
        }


        items = [{
            padding:'10px',
            xtype: 'toolbar',
            tpl: '<h3>Day {dayNum} / {totalDays}  </h3><h4>{date}</h4>',
            data: {
                dayNum: 1,
                totalDays: daysDiff + 1,
                date: Ext.Date.format(startDate, 'd/m/y')
            },
            docked: 'top',
            cls: 'pageNav itineraryDayToolbar',
            items: btns
        }, {
            xtype: 'container',
            layout: 'card',
            flex:1,
            cls: 'cardView',


            items: []

        }];
        this.setItems(items);
        this.fireEvent('built', this);
    }

});