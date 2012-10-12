Ext.define("escape.view.page.ServicesAndFacilitiesDetails", {
    extend: 'escape.view.page.Page',
    requires: ['Ext.Map', 'escape.view.ui.MapDisplay', 'escape.view.ui.FavoriteBtn', 'escape.view.ui.ItinerayBtn', 'escape.model.Product', 'escape.view.ui.LoadingDisplay', 'escape.view.ui.LoadError'],
    xtype: 'servicesAndFacilitiesDetails',
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
        contactList = [];
        var addressLines = [];
        if (data.address.street.fullName) {
            addressLines.push(data.address.street.fullName + '</br>');
        }
        if (data.address.suburb) {
            addressLines.push(data.address.suburb + '</br>');
        }
        if (data.address.state) {
            addressLines.push(data.address.state + ' ');
        }
        if (data.address.postcode) {
            addressLines.push(data.address.postcode);
        }


        contactList.push({
            title: addressLines.join(''),
            action: 'getDirections',
            data: {
                latlon: [data.address.coordinates.latitude, data.address.coordinates.longitude],
                address: data.address.street.fullName + '</br>' + data.address.suburb + '</br>' + data.address.state + ' ' + data.address.postcode
            },
            itemCls: 'directionsIcon'
        });


        if (data.phoneNumber) {
            contactList.push({
                title: '<a href="tel:' + data.phoneNumber + '">' + data.phoneNumber + '</a>',
                action: 'makePhoneCall',
                data: data.phone,
                itemCls: 'callIcon'
            });
        }

        if (data.url) {
            contactList.push({
                title: data.url,
                action: 'goToLink',
                data: data.url,
                itemCls: 'linkIcon'
            });
        }

        if (data.email) {

            contactList.push({
                title: data.email,
                action: 'sendEmail',
                data: data.email,
                itemCls: 'emailIcon'
            });
        }
        this.setItems([{
            xtype: 'mapDisplay',
            lat: Number(data.address.coordinates.latitude),
            lon: Number(data.address.coordinates.longitude),
            address: {
                Street: data.address.street.fullName,
                Suburb: data.address.suburb,
                State: data.address.state,
                PostCode: data.address.postcode
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