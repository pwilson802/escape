Ext.define('escape.utils.Database', {
    mixins: ['Ext.mixin.Observable'],
    config: {
        sqlPath: 'resources/sql/',
        checkTable: 'Product_Experience',
        fileName: null,
        version: "1.0",
        size: 200000,
        name: null,
        DBConn: null,
        reImport: false,
        prePopulate: false
    },
    dbConn: this,

    constructor: function(config) {
        this.initConfig(config);
        return this;
    },
    connect: function() {
        var selfRef = this;
        var db;
        try {
            // we are running on a phone
            var dbName = selfRef.getFileName() + '.db';
            this.dbConn = window.sqlitePlugin.openDatabase(dbName, selfRef.getVersion(), selfRef.getName(), selfRef.getSize());
            if (this.dbConn) {
                selfRef.fireEvent('ready');
            }

        } catch (e) {
            //  we are running in a browser
            this.dbConn = window.openDatabase(this.getFileName(), this.getVersion(), this.getName(), this.getSize());
            if (this.dbConn) {
                if (selfRef.getReImport()) {
                    // re create the database
                    selfRef.createWebSql();
                } else {
                    // check the database
                    selfRef.checkDatabase();
                }
            } else {
            }
        }
    },
    // check to see if the database has already been created
    checkDatabase: function() {
        var selfRef = this;

        this.dbConn.readTransaction(function(t) {
            t.executeSql('SELECT id FROM ' + selfRef.getCheckTable(), [], function(t, results) {
                if (results.rows.length > 0) {
                    selfRef.fireEvent('ready');
                } else {
                    selfRef.createWebSql();
                }

            }, function(t, e) {
                selfRef.createWebSql();
            });
        });
    },
    // create web database
    createWebSql: function() {
        console.log('createWebSql: ' + this.getPrePopulate());
        if (this.getPrePopulate()) {
            var selfRef = this;
            Ext.Ajax.request({
                url: selfRef.getSqlPath() + selfRef.getFileName().split('.')[0] + '.sql',
                method: "GET",
                success: function(response, request) {
                    selfRef.processQuery(selfRef.dbConn, 0, response.responseText.split(';\n'), selfRef.getName());
                },
                failure: function(response, request) {
                    console.log("failure loading slq: " + selfRef.getFileName().split('.')[0]);
                }
            });
        } else {
            this.fireEvent('ready');
        }

    },
    // Loop over a set amount queries and add them into a web database
    processQuery: function(db, i, queries, dbname) {

        var selfRef = this;
        if (i < queries.length - 1) {
            if (!queries[i + 1].match(/(INSERT|CREATE|DROP|PRAGMA|BEGIN|COMMIT)/)) {
                queries[i + 1] = queries[i] + ';\n' + queries[i + 1];
                return selfRef.processQuery(db, i + 1, queries, dbname);
            }
            db.transaction(function(query) {
                query.executeSql(queries[i] + ';', [], function(tx, result) {
                    selfRef.processQuery(db, i + 1, queries, dbname);
                });
            }, function(err) {
                selfRef.processQuery(db, i + 1, queries, dbname);
            });
        } else {
            this.fireEvent('ready');
        }
    },
    // query the database
    queryDB: function(sql, successcallback, errorcallback, params, callback) {
        if (!Ext.os.is.iOS) {
            // we only need to close an open the database connection on android
            // causes library routine called out of sequence on iOS
            try {
                this.dbConn.close();
            } catch (e) {

            }
            try {
                this.dbConn.open();
            } catch (e) {

            }
        }
        var selfRef = this;
        this.dbConn.transaction(function(tx, results) {
            if (typeof callback == 'function') {
                callback.call(scope || selfRef, results, selfRef);
            }
            tx.executeSql(
            sql, (params ? params : []), function(tx, results) {
                //  close the database
                if (!Ext.os.is.iOS) {
                    // we only need to close an open the database connection on android
                    try {
                        selfRef.dbConn.close();
                    } catch (e) {

                    }
                }
                // call the sucess function
                try {
                    successcallback(tx, results);
                } catch (e) {

                }
                
            }, function(tx, e) {
                console.log(sql);
                console.log(e);
            });
        });
    }
});