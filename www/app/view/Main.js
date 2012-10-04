Ext.define("escape.view.Main", {
    extend: 'Ext.ux.slidenavigation.View',
    requires: ['Ext.Container', 'Ext.field.Search'],
    xtype: 'mainView',
    config: {

        fullscreen: true,
        /**
         *  Any component within the container with an 'x-toolbar' class
         *  will be draggable.  To disable draggin all together, set this
         *  to false.
         */
        slideSelector: 'scrollTopTopContainer',
        /**
         *  Time in milliseconds to animate the closing of the container
         *  after an item has been clicked on in the list.
         */
        selectSlideDuration: 200,
        /**
         *  This allows us to configure how the actual list container
         *  looks.  Here we've added a custom search field and have
         *  modified the width.
         */
        list: {
            maxDrag: 400,
            width: 245
        },
        /**
         *  Example of how to re-order the groups.
         */
        groups: {
            'Group 1': 1,
            'Group 2': 3,
            'Group 3': 2,
            'Group 4': 4,
            'Group 5': 5
        },
        /**
         *  These are the default values to apply to the items within the
         *  container.
         */
        defaults: {
            style: 'background: #f6f5f1',
            xtype: 'section'
        },

        items: [{
            title: 'Home',
            group: 'Group 1',
            id: 'homeSection',
            collectionType: null,
            firstPage: {
                xtype: 'homePage',
                title: 'Sydney'
            }
        }, {

            title: 'About '+AppSettings.appAreaName,
            group: 'Group 1',
            id: 'aboutSection',
            firstPage: {
                xtype: 'contentPage',
                title: 'About '+AppSettings.appAreaName,
                contentPath: AppSettings.getSMPSectionURL() + '/about-sydney'
            }
        }, {
            title: 'My Itinerary',
            group: 'Group 1',
            id: 'myItinerarySection',
            firstPage: {
                title: 'My Itinerary',
                xtype: 'myItineraryPage'
            }
        }, {
            title: 'My Favourites',
            group: 'Group 1',
            id: 'myFavouritesSection',
            firstPage: {
                title: 'My Favourites',
                xtype: 'myFavouritesPage'
            }
        }, {
            title: 'Things to do',
            group: 'Group 2',
            id: 'thingsToDoSection',
            collectionType: 'attr',
            firstPage: {
                title: 'Things to do',
                xtype: 'thingsToDoCatigoriesPage',
                contentPath: AppSettings.getSMPSectionURL() + '/things-to-do'
            }
        }, {
            title: 'Food & Wine',
            group: 'Group 2',
            id: 'foodAndWineSection',
            collectionType: 'restaurants',
            firstPage: {
                title: 'Food & Wine',
                xtype: 'thingsToDoTypePage',
                contentPath: AppSettings.getSMPSectionURL() + '/food-and-wine'
            }
        }, {
            title: 'Accommodation',
            group: 'Group 2',
            id: 'accommodationSection',
            collectionType: 'accom',
            firstPage: {
                title: 'Accommodation',
                collectionType: 'accom',
                xtype: 'searchPage'
            }
        }, {
            title: 'Events',
            group: 'Group 2',
            id: 'eventsSection',
            collectionType: 'event',
            firstPage: {
                xtype: 'eventsPage',
                title: 'Events',
                rightBtn: 'searchBtn',
                contentPath: AppSettings.getSMPSectionURL() + '/things-to-do/arts,-culture'
            }
        }, {
            title: 'Services & Facilities',
            group: 'Group 3',
            id: 'servicesSection',
            firstPage: {
                title: 'Services & Facilities',
                xtype: 'servicesAndFacilitiesPage'
            }
        }, {
            title: 'Hire',
            group: 'Group 3',
            id: 'hireSection',
            firstPage: {
                title: 'Hire',
                collectionType: 'hire',
                xtype: 'searchPage'
            }
        }, {
            title: 'Tours',
            group: 'Group 3',
            id: 'toursSection',
            firstPage: {
                title: 'Tours',
                collectionType: 'tour',
                xtype: 'searchPage'
            }
        }, {
            title: 'Deals',
            group: 'Group 3',
            id: 'dealsSection',
            firstPage: {
                title: 'Deals',
                collectionType: 'deals',
                xtype: 'searchPage'
            }

        }, {
            title: 'Current '+  AppSettings.appAreaName +' Weather',
            group: 'Group 4',
            id: 'currentWeather',
            firstPage: {
                title:  AppSettings.appAreaName + ' Weather',
                xtype: 'weatherPage'
            }
        }, {
            title: 'Currency Converter',
            group: 'Group 4',
            id: 'currencyConverter',
            firstPage: {
                title: 'Currency Converter',
                xtype: 'currencyConverterPage'
            }
        }, {
            title: 'Transport Info',
            group: 'Group 4',
            id: 'tranportSection',
            firstPage: {
                title: 'Transport Info',
                xtype: 'contentPage',
                contentPath: AppSettings.getSMPSectionURL() + '/transport-information'
            }

        }, {
            title: 'Visitor Information Centres',
            group: 'Group 4',
            id: 'visitorInoSection',
            firstPage: {
                title: 'Visitor Information Centres',
                collectionType: 'vic',
                xtype: 'searchPage'
            }
        }, {
            title: 'About Desination NSW',
            group: 'Group 4',
            id: 'aboutDNSWSection',
            firstPage: {
                title: 'About Desination NSW',
                xtype: 'contentPage',
                contentPath: AppSettings.getSMPSectionURL() + '/about-destination-nsw'
            }
        }, {
            title: 'Other NSW Apps',
            group: 'Group 4',
            id: 'otherAppsSection',
            firstPage: {
                title: 'Other DNSW apps',
                xtype: 'contentPage',
                contentPath: AppSettings.getSMPSectionURL() + '/other-dnsw-apps'
            }
        }, {
            title: 'Settings',
            group: 'Group 5',
            id: 'settingsSection',
            firstPage: {
                title: 'Settings',
                xtype: 'settingsPage'
            }
        }]

    }
});