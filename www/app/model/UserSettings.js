Ext.define("escape.model.UserSettings", {
    singleton: true,
    config: {},


    // if the users table has not been created then create it values are stored as key value pairs
    createTable: function() {
        var db = escape.utils.DatabaseManager.getBDConn('user');
        db.queryDB('DROP TABLE UserSettings');
        db.queryDB('CREATE TABLE IF NOT EXISTS UserSettings (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, key, value)');
    },

    // return a user a settings
    getSetting: function(key, callback, scope) {
        this.createTable();
        var selfRef = this;
        var db = escape.utils.DatabaseManager.getBDConn('user');
        db.queryDB('SELECT * FROM UserSettings WHERE key = (?)', function(t, rs) {
            // make sure the key is in the database
            if (rs.rows.length > 0) {
                // the row was found return the value
                Ext.callback(callback.success, scope, [rs.rows.item(0).value]);
            } else {
                // no key found return null for the user value
                Ext.callback(callback.success, scope, []);
            }
        }, function(t, e) {
            // error return null for the user value
            Ext.callback(callback.success, scope, []);
        }, [key]);
    },


    // set the user setting
    setSetting: function(key, value, callback, scope) {
        // create the table if it does not exist
        this.createTable();
        var selfRef = this;
        // connect to the database
        var db = escape.utils.DatabaseManager.getBDConn('user');
        db.queryDB('SELECT * FROM UserSettings WHERE key = (?)', function(t, rs) {
            // make sure the key is in the database
            if (rs.rows.length > 0) {
                // the row was found return the value
                selfRef.updateSetting(key, value, callback, scope);
            } else {
                // no key found return null for the user value
                selfRef.insertSetting(key, value, callback, scope);
            }
        }, function(t, e) {
            console.log(e);
            // error return null for the user value
            Ext.callback(callback.success, scope, []);
        }, [key]);
    },


    // update a user seeting
    updateSetting: function(key, value, callback, scope) {
        var db = escape.utils.DatabaseManager.getBDConn('user');
        db.queryDB('UPDATE UserSettings SET value=(?) WHERE key = (?)', function(t, rs) {
            Ext.callback(callback.success, scope, [value]);
        }, function(t, e) {
            // error return null for the user value
            Ext.callback(callback.success, scope, [value]);
        }, [value, key]);
    },

    // insert into user settings
    insertSetting: function(key, value, callback, scope) {
        var db = escape.utils.DatabaseManager.getBDConn('user');
        db.queryDB('INSERT INTO UserSettings (key,value) VALUES (?,?)', function(t, rs) {
            // make sure the product is not database
            Ext.callback(callback.success, scope, [value]);
        }, function(t, e) {
            // error return null for the user value
            Ext.callback(callback.success, scope, [value]);
        }, [key, value]);
    }

});