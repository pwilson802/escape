Ext.define("escape.view.subSection.Itinerary", {
    extend: 'escape.view.subSection.SubSection',
    requires: ['Ext.Toolbar', 'Ext.Button', 'escape.view.page.ItineraryDay'],
    xtype: 'itinerarySubSection',
    config: {
        rightBtn: "editBtn",
        cardViewItemId: 1,
        itinerary: null,
        layout: 'vbox',
        viewType:'list',
        pageTypeId: 14,
        pageTrackingId: 2
    },
    openView: function() {
        this.pageName = this.getItinerary().name;
        this.setPageTitle(this.pageName);
        this.setNavTitle(this.getItinerary().name);
        var startDate = new Date(this.getItinerary().startDate);
        var endDate = new Date(this.getItinerary().endDate);
        var oneDay = 1000 * 60 * 60 * 24;
        var daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (oneDay));

        var btns = [];

        if (daysDiff !== 0) {
            btns.push();
        }


        items = [{
            padding: '10px 5px 10px 0px',
            xtype: 'toolbar',
            layout: 'hbox',
            docked: 'top',
            cls: 'pageNav itineraryDayToolbar',
            items: [{
                width: 30,
                xtype: 'button',
                action: 'back',
                cls: 'backBtn'
            }, {
                flex: 1,
                xtype: 'container',
                itemId: 'dayDisplay',
                tpl: '<div class="info"><b>Day {dayNum} </b><br><span>{date}</span></div>',
                data: {
                    dayNum: 1,
                    totalDays: daysDiff + 1,
                    date: Ext.Date.format(startDate, 'd/m/y')
                }
            }, {
                width: 40,
                xtype: 'button',
                action: 'next',
                cls: 'nextBtn'
            }, {
                xtype: 'segmentedbutton',
                layout: 'hbox',
                width: 120,
                allowMultiple: false,
                allowDepress: false,
                items: [{
                    cls: 'listBtn',
                    type: 'list',
                    pressed: true,
                    action: 'list',
                    flex: 1
                }, {
                    cls: 'mapBtn',
                    type: 'map',
                    action: 'map',
                    flex: 1
                }, {
                    cls: 'notesBtn',
                    type: 'map',
                    action: 'notes',
                    flex: 1
                }]
            }]
        }, {
            xtype: 'container',
            layout: 'card',
            flex: 1,
            cls: 'cardView',


            items: []

        }];
        this.setItems(items);
        this.fireEvent('built', this);
    }

});