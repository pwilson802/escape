Ext.define('escape.utils.DatabaseManager', {
    mixins: ['Ext.mixin.Observable'],
    requires: ['escape.utils.Database'],
    singleton: true,
    currentDB: 0,
    dbConnections: [],
    dbList: [],

    // create a database
    create: function(databaseList) {
        this.dbList = databaseList;
        this.createNextDataBase();
    },
    createNextDataBase: function() {
        var dbList = this.dbList;
        // check to see if all the databases have been created
        if (this.currentDB < dbList.length) {
            // create the database
            var dbData = dbList[this.currentDB];
            var dbConn = new escape.utils.Database(dbData);
            // push the connection into the list
            // push the connectoin into the database list
            this.dbConnections.push({
                name: dbData.name,
                connection: dbConn
            });

            // wait for the database to be creaste
            var scopeRef = this;
            dbConn.on('ready', function() {
                scopeRef.currentDB++;
                scopeRef.createNextDataBase();
            });
            dbConn.connect();
        } else {
            this.fireEvent('ready');
        }

    },
    // given a database name it will return a database connection
    getBDConn: function(dbName) {
        for (var i = this.dbConnections.length - 1; i >= 0; i--) {
            if (this.dbConnections[i].name == dbName) {
                return this.dbConnections[i].connection;
            }
        }
    }
});