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

            title: escape.utils.Translator.translate('About Sydney'),
            group: 'Group 1',
            id: 'aboutSection',
            firstPage: {
                xtype: 'contentPage',
                title: 'About Sydney',
                contentPath: escape.utils.AppVars.getSMPSectionURL() + '/about-sydney'
            }
        }, {
            title: escape.utils.Translator.translate('My Itinerary'),
            group: 'Group 1',
            id: 'myItinerarySection',
            firstPage: {
                title: 'My Itinerary',
                xtype: 'myItineraryPage'
            }
        }, {
            title: escape.utils.Translator.translate('My Favourites'),
            group: 'Group 1',
            id: 'myFavouritesSection',
            firstPage: {
                title: 'My Favourites',
                xtype: 'myFavouritesPage'
            }
        }, {
            title: escape.utils.Translator.translate('Things to do'),
            group: 'Group 2',
            id: 'thingsToDoSection',
            collectionType: 'attr',
            firstPage: {
                title: 'Things to do',
                xtype: 'thingsToDoCatigoriesPage',
                contentPath: escape.utils.AppVars.getSMPSectionURL() + '/things-to-do'
            }
        }, {
            title: escape.utils.Translator.translate('Food & Wine'),
            group: 'Group 2',
            id: 'foodAndWineSection',
            collectionType: 'restaurants',
            firstPage: {
                title: 'Food & Wine',
                xtype: 'thingsToDoTypePage',
                contentPath: escape.utils.AppVars.getSMPSectionURL() + '/food-and-wine'
            }
        }, {
            title: escape.utils.Translator.translate('Accommodation'),
            group: 'Group 2',
            id: 'accommodationSection',
            collectionType: 'accom',
            firstPage: {
                xtype: 'listTypesSubSection',
                title: 'Accommodation',
                rightBtn: 'searchBtn'
            }
        }, {
            title: escape.utils.Translator.translate('Events'),
            group: 'Group 2',
            id: 'eventsSection',
            collectionType: 'event',
            firstPage: {
                xtype: 'eventsPage',
                title: 'Events',
                rightBtn: 'searchBtn',
                contentPath: escape.utils.AppVars.getSMPSectionURL() + '/things-to-do/arts,-culture'
            }
        }, {
            title: escape.utils.Translator.translate('Services & Facilities'),
            group: 'Group 3',
            id: 'servicesSection',
            firstPage: {
                title: 'Services & Facilities',
                xtype: 'servicesAndFacilitiesPage'
            }
        }, {
            title: escape.utils.Translator.translate('Hire'),
            group: 'Group 3',
            id: 'hireSection',
            firstPage: {
                title: 'Hire',
                collectionType: 'hire',
                xtype: 'searchPage'
            }
        }, {
            title: escape.utils.Translator.translate('Tours'),
            group: 'Group 3',
            id: 'toursSection',
            firstPage: {
                title: 'Tours',
                collectionType: 'tour',
                xtype: 'searchPage'
            }
        }, {
            title: escape.utils.Translator.translate('Deals'),
            group: 'Group 3',
            id: 'dealsSection',
            firstPage: {
                title: 'Deals',
                collectionType: 'deals',
                xtype: 'searchPage'
            }

        }, {
            title: escape.utils.Translator.translate('Current Weather'),
            group: 'Group 4',
            id: 'currentWeather',
            firstPage: {
                title: 'Weather',
                xtype: 'weatherPage'
            }
        }, {
            title: escape.utils.Translator.translate('Currency Converter'),
            group: 'Group 4',
            id: 'currencyConverter',
            firstPage: {
                title: 'Currency Converter',
                xtype: 'currencyConverterPage'
            }
        }, {
            title: escape.utils.Translator.translate('Transport Info'),
            group: 'Group 4',
            id: 'tranportSection',
            firstPage: {
                title: 'Transport Info',
                xtype: 'contentPage',
                contentPath: escape.utils.AppVars.getSMPSectionURL() + '/transport-information'
            }

        }, {
            title: escape.utils.Translator.translate('Visitor Information Centres'),
            group: 'Group 4',
            id: 'visitorInoSection',
            firstPage: {
                title: 'Visitor Information Centres',
                collectionType: 'vic',
                xtype: 'searchPage'
            }
        }, {
            title: escape.utils.Translator.translate('About Desination NSW'),
            group: 'Group 4',
            id: 'aboutDNSWSection',
            firstPage: {
                title: 'About Desination NSW',
                xtype: 'contentPage',
                contentPath: escape.utils.AppVars.getSMPSectionURL() + '/about-destination-nsw'
            }
        }, {
            title: escape.utils.Translator.translate('Other NSW Apps'),
            group: 'Group 4',
            id: 'otherAppsSection',
            firstPage: {
                title: 'Other DNSW apps',
                xtype: 'contentPage',
                contentPath: escape.utils.AppVars.getSMPSectionURL() + '/other-dnsw-apps'
            }
        }, {
            title: escape.utils.Translator.translate('Settings'),
            group: 'Group 5',
            id: 'settingsSection',
            firstPage: {
                title: 'Settings',
                xtype: 'settingsPage'
            }
        }]

    }
});