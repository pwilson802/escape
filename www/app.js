//<debug>
Ext.Loader.setPath({
    'Ext': 'sdk/src',
    'Ext.ux': './ux'
});
//</debug>
Ext.application({
    name: 'escape',
    requires: ['escape.utils.Translator', 'escape.utils.Img', 'Ext.MessageBox','escape.utils.DatabaseManager', 'escape.utils.Tracking','escape.utils.AppFuncs','escape.utils.AppVars'],
    views: ['Main', 'section.Section', 'page.Home', 'page.Area', 'page.FeaturedList', 'page.FoodAndWine', 'page.Events', 'page.LikeALocal', 'subSection.MapList', 'page.Settings', 'page.MyItinerary', 'page.MyFavourites', 'page.ThingsToDoCatigories', 'page.ServicesAndFacilities', 'escape.view.page.ThingsToDoType', 'escape.view.ui.Footer','page.CurrencyConverter','page.ContentPage','ui.SelectField','page.Map'],
    controllers: ['GlobalActions', 'Section', 'Search', 'Sharing','Itinerarys','ItineraryViewer', 'Product', 'Towns', 'About', 'FoodAndWine', 'ProductSections', 'Accommodation', 'Events','ServicesAndFacilities','CurrencyConverter','Weather','MyFavourites','ContentPage'],

    models: ['Favourites', 'UserSettings', 'Currency', 'Register','ProductSearch','Itineraries'],
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
        
    },
    onDeviceReady: function() {
        if (!this.deviceReady) {
            this.deviceReady = true;
            var scopeRef = this;
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