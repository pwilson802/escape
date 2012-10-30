Ext.define("escape.view.page.AlertDetails", {
    extend: 'escape.view.page.Page',
    xtype: 'alertDetailsPage',
    config: {
        pageTitle: 'Alert',
        cls: 'alertDetailsPage',
        alertData: null,
        rightBtn: '',
        scrollable: false,
        padding: 0,
        IsPageBuilt: false,
        pageTypeId: 18,
        pageTrackingId: 18,
        layout: 'vbox'
    },
    openView: function() {
        console.log('open details');
        console.log(this.getAlertData());
        var data = this.getAlertData();
        var items = [];
        // map
        items.push({
            xtype: 'mapDisplay',
            lat: Number(data.lat),
            lon: Number(data.lon),
            address: '',
            interaction: false,
            markerAtCenter: true
        });
        // headling
        items.push({
            xtype: 'container',
            cls: 'actionHeader',
            padding: '10px',
            html: '<h3>' + data.suburb + '</h3><h3>' + data.road + '</h3><h3>' + data.displayName + '</h3>'
        });
        // deatils
        var detailsTable = [];
        // started
        detailsTable.push({
            heading: 'Started',
            value: Ext.Date.format(data.created, 'j/d/Y h:ia')
        });
        // updated
        if (data.lastUpdated.getTime() !== data.created.getTime()) {
            detailsTable.push({
                heading: 'Last Updated',
                value: Ext.Date.format(data.lastUpdated, 'j/d/Y h:ia')
            });
        }
        // trafficVolume
        if (data.trafficVolume.length > 1) {
            detailsTable.push({
                heading: 'Traffic Volume',
                value: data.trafficVolume
            });
        }
        // attendingGroups
        if (data.attendingGroups.length > 0) {
            detailsTable.push({
                heading: 'Attending Groups',
                value: data.attendingGroups.join('</br>')
            });
        }
        // advice
        if (data.advice.length > 3) {
            detailsTable.push({
                heading: 'Advice',
                value: data.advice
            });
        }
        // diversions
         if (data.diversions.length > 3) {
            detailsTable.push({
                heading: 'Diversions',
                value: data.diversions
            });
        }
        items.push({
            padding: '10px',
            cls: 'dataTable',
            tpl: Ext.create('Ext.XTemplate', '<table>', '<tpl for=".">', '<tr>', '<th>{heading}</th>', '<td>{value}</td>', '</tr>', '</tpl>', '</table>'),
            data: detailsTable
        });
        this.setItems(items);
    }
});