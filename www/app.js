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
    requires: ['escape.utils.Translator', 'escape.utils.Img', 'Ext.MessageBox', 'escape.utils.DatabaseManager', 'escape.utils.Tracking', 'escape.utils.AppFuncs', 'escape.utils.AppVars','Ext.data.ArrayStore','Ext.device.Geolocation','Ext.device.Connection', 'escape.override.Mask'],
    views: ['Main', 'section.Section', 'page.OtherApps', 'page.AddToCalender', 'page.Home', 'page.Alerts', 'page.AlertDetails', 'page.FeaturedList', 'page.Events', 'page.LikeALocal', 'subSection.MapList', 'page.Settings', 'page.MyItinerary', 'page.MyFavourites', 'page.ThingsToDoCatigories', 'page.ServicesAndFacilities', 'escape.view.page.ThingsToDoType', 'escape.view.ui.Footer', 'page.CurrencyConverter', 'page.ContentPage', 'ui.SelectField', 'page.Map', 'ui.OfflineMessage'],
    controllers: ['Map', 'GlobalActions', 'Settings','Page', 'Section', 'Search', 'Alerts', 'Sharing', 'Itinerarys', 'ItineraryViewer', 'Product', 'ProductSections', 'Events', 'ServicesAndFacilities', 'CurrencyConverter', 'Weather', 'MyFavourites', 'ContentPage', 'Directions'],

    models: ['Favourites', 'UserSettings', 'Currency', 'Register', 'ProductSearch', 'Itineraries'],
    stores: ['ProductSearch','AppVersion'],
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
        if (!this.deviceReady) {
             this.deviceReady = true;
            // listen for back button pressed (Android)
            document.addEventListener("backbutton", function() {
                scopeRef.onBackBtnPressed();
            }, false);
            // listen for the databases to be set up
            escape.utils.DatabaseManager.on('ready', function() {
                scopeRef.startApp();
            });
            // set up the required databases
            escape.utils.DatabaseManager.create([{
                name: 'user',
                fileName: 'DNSWEscapeUser',
                checkTable: 'Favourites'
            }, {
                name: 'cmsPages',
                fileName: 'cmsPages',
                checkTable: 'Images',
                prePopulate: true,
                reImport: true
            }]);
            // install plugins
            try {
                escape.utils.AppVars.childbrowser = ChildBrowser.install();

            } catch (e) {

            }
        }
    },
    startApp: function() {
        // create the favourites table
        var db = escape.utils.DatabaseManager.getBDConn('user');
        escape.model.Content.checkOfflineSettings();
        escape.model.Map.checkOfflineSettings();
        // db.queryDB('DROP TABLE Favourites');
        db.queryDB('CREATE TABLE IF NOT EXISTS Favourites (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, product_id, name, type, data)');
        escape.model.Itineraries.setup();
        // Register
        escape.model.Register.check({
            success: function(reg) {},
            error: function(error) {},
            scope: this
        });
        // add the main view
        Ext.Viewport.add(Ext.create('escape.view.Main'));
        try {
            // hide the app splash screen as the app is ready
            navigator.splashscreen.hide();
        } catch (e) {

        }
        //
         var serachStore = Ext.create('escape.store.AppVersion');
        // add the extra paramaters to the search
        // request results
        var selfRef = this;
        serachStore.load({
            callback: function(records, operation, success) {
                // the operation object contains all of the details of the load operation
                console.log(records);
            },
            scope: this
        });
    },

    onUpdated: function() {

    }
});