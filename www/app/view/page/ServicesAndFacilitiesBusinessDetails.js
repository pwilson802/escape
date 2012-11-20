Ext.define("escape.view.page.ServicesAndFacilitiesBusinessDetails", {
    extend: 'escape.view.page.Page',
    requires: ['Ext.Map', 'escape.view.ui.MapDisplay', 'escape.view.ui.FavoriteBtn', 'escape.view.ui.ItinerayBtn', 'escape.model.Product', 'escape.view.ui.LoadingDisplay', 'escape.view.ui.LoadError'],
    xtype: 'servicesAndFacilitiesBusinessDetails',
    config: {
        resultsData: null,
        pageTitle: 'Services & Facilities',
        title: '',
        rightBtn: "hide",
        pageTypeId: 5,
        pageTrackingId: 3,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        items: [{
            xtype: 'loadingDisplay'
        }]
    },
    openView: function() {
        var selfRef = this;
        this.build();

    },
    build: function() {
        var viewportSize = Ext.Viewport.getSize();
        var screenWidth = viewportSize.width;

        var data = this.getResultsData();
        // report event with sensis
        escape.model.SensisPOI.reportEvent(data.reportingId, 'appearance');

        console.log(data);
        contactList = [];
        var addressLines = [];
        if (data.primaryAddress.addressLine) {
            addressLines.push(data.primaryAddress.addressLine + '</br>');
        }
        if (data.primaryAddress.suburb) {
            addressLines.push(data.primaryAddress.suburb + '</br>');
        }
        if (data.primaryAddress.state) {
            addressLines.push(data.primaryAddress.state + ' ');
        }
        if (data.primaryAddress.postcode) {
            addressLines.push(data.primaryAddress.postcode);
        }


        contactList.push({
            title: addressLines.join(''),
            action: 'getDirections',
            data: {
                latlon: [data.primaryAddress.latitude, data.primaryAddress.longitude],
                address: {
                    Street: data.primaryAddress.addressLine,
                    Suburb: data.primaryAddress.suburb,
                    State: data.primaryAddress.state,
                    PostCode: data.primaryAddress.postcode
                }
            },
            itemCls: 'directionsIcon'
        });


        for (var i = 0; i < data.primaryContacts.length; i++) {
            var contact = data.primaryContacts[i];
            if (contact.type == 'PHONE') {
                contactList.push({
                    title: '<a href="tel:' + contact.value + '">' + contact.value + '</a>',
                    action: 'makePhoneCall',
                    data:  contact.value,
                    itemCls: 'callIcon'
                });
            }
            if (contact.type == 'EMAIL') {
                contactList.push({
                    title: contact.value,
                    action: 'sendEmail',
                    data: contact.value,
                    itemCls: 'emailIcon'
                });
            }
            if (contact.type == 'URL') {
                contactList.push({
                    title: contact.value,
                    action: 'goToLink',
                    data: contact.value,
                    itemCls: 'linkIcon'
                });
            }
        }




        this.setItems([{
            xtype: 'mapDisplay',
            lat: Number(data.primaryAddress.latitude),
            lon: Number(data.primaryAddress.longitude),
            address: {
                Street: data.primaryAddress.addressLine,
                Suburb: data.primaryAddress.suburb,
                State: data.primaryAddress.state,
                PostCode: data.primaryAddress.postcode
            },
            interaction: false,
            markerAtCenter: true
        }, {
            html: '<h2>' + data.name + '</h2>',
            margin: '10 10 10 10'
        }, {
            xtype: 'list',
            margin: '10 10 10 10',
            width: viewportSize.width - 20,
            itemTpl: '<div class="{itemCls}">{title}</div>',
            cls: 'contactList',
            itemCls: 'iconItem',
            action: 'contactSheet',
            scrollable: false,
            disableSelection: true,
            data: contactList
        }]);
    }
});