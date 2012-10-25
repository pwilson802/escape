//<debug>
Ext.Loader.setPath({
    'Ext': 'sdk/src',
    'Ext.ux': './ux'
});
//</debug>
Ext.application({
    refs: {
        mainView: 'mainView'
    },
    name: 'escape',
    requires: ['escape.utils.Translator', 'escape.utils.Img', 'Ext.MessageBox', 'escape.utils.DatabaseManager', 'escape.utils.Tracking', 'escape.utils.AppFuncs', 'escape.utils.AppVars'],
    views: ['Main', 'section.Section', 'page.OtherApps', 'page.Home', 'page.FeaturedList', 'page.Events', 'page.LikeALocal', 'subSection.MapList', 'page.Settings', 'page.MyItinerary', 'page.MyFavourites', 'page.ThingsToDoCatigories', 'page.ServicesAndFacilities', 'escape.view.page.ThingsToDoType', 'escape.view.ui.Footer', 'page.CurrencyConverter', 'page.ContentPage', 'ui.SelectField', 'page.Map'],
    controllers: ['Map','GlobalActions', 'Settings', 'Section', 'Search', 'Sharing', 'Itinerarys', 'ItineraryViewer', 'Product', 'ProductSections', 'Events', 'ServicesAndFacilities', 'CurrencyConverter', 'Weather', 'MyFavourites', 'ContentPage','Directions'],

    models: ['Favourites', 'UserSettings', 'Currency', 'Register', 'ProductSearch', 'Itineraries'],
    stores: ['ProductSearch'],
    icon: {
        57: 'resources/icons/Icon.png',
        72: 'resources/icons/Icon~ipad.png',
        114: 'resources/icons/Icon@2x.png',
        144: 'resources/icons/Icon~ipad@2x.png'
    },

    phoneStartupScreen: 'resources/loading/Homescreen.jpg',
    launch: function() {
        var scopeRef = this;
        // Wait for Cordova to load
        document.addEventListener("deviceready", function() {
            scopeRef.onDeviceReady();
        }, false);
        ///for testing with out cordova
        var task = new Ext.util.DelayedTask(function() {
            this.onDeviceReady();
        }, this);
        task.delay(3000);
        // listen for the back button
        // set up a listener to handle the back button for Android
        //if (Ext.os.is('Android')) {
        // }
    },
    /**
    *   Controls the back button action for android
    */
    onBackBtnPressed: function(e) {
        //e.preventDefault();
        var currentSection = escape.utils.AppVars.currentSection;
        var previousItem = currentSection.getNavigationView().getPreviousItem();
        if (previousItem) {
            // the current section has more than one item
            // navigaite to the last page
            currentSection.getNavigationView().pop();
        } else if (currentSection.getId() != 'homeSection') {
            // the current section no the home page navigatie back to the home page
            this.getMainView().select('homeSection');
        } else {
            // the current section is the home page exit the app
            navigator.app.exitApp();
        }
    },
    /**
    *  Cordova has been loaded
    */
    onDeviceReady: function() {
        var scopeRef = this;
        //
        if (!this.deviceReady) {

            // try {
            //     window.BackButton.override();
            // } catch (e) {
            //     console.log('!!! override failed');
            // }
            // back
            document.addEventListener("backbutton", function() {
                scopeRef.onBackBtnPressed();
            }, false);

            this.deviceReady = true;

            escape.utils.DatabaseManager.on('ready', function() {
                scopeRef.startApp();
            });
            // set up the required databases
            escape.utils.DatabaseManager.create([{
                name: 'user',
                fileName: 'DNSWEscapeUser',
                checkTable: 'Favourites'
            }]);

            try {
                escape.utils.AppVars.childbrowser = ChildBrowser.install();
                ShareKitPlugin.install();
            } catch (e) {

            }
        }
    },
    startApp: function() {
        // create the favourites table
        var db = escape.utils.DatabaseManager.getBDConn('user');
        // db.queryDB('DROP TABLE Favourites');
        db.queryDB('CREATE TABLE IF NOT EXISTS Favourites (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, product_id, name, type, data)');
        escape.model.Itineraries.setup();
        // Register
        escape.model.Register.check({
            success: function(reg) {},
            error: function(error) {},
            scope: this
        });
        Ext.Viewport.add(Ext.create('escape.view.Main'));
    },

    onUpdated: function() {

    }
});