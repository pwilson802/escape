Ext.define("escape.model.Itineraries", {
    requires: ['Ext.DateExtras', 'escape.model.UserSettings'],
    singleton: true,

    setup: function() {
        // create the required tables for your itineraries
        var db = escape.utils.DatabaseManager.getBDConn('user');
        db.queryDB('CREATE TABLE IF NOT EXISTS itineraries (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name, startDate, endDate)');
        db.queryDB('CREATE TABLE IF NOT EXISTS itineraryDays (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, itinerary_id, dayNum, notes)');
        db.queryDB('CREATE TABLE IF NOT EXISTS itineraryProducts (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, itinerary_id, dayNum, orderNum, product_id, type, name, data)');
    },
    // itineraries
    getItineraries: function(callback, scope) {
        var selfRef = this;
        var db = escape.utils.DatabaseManager.getBDConn('user');
        db.queryDB('SELECT * FROM itineraries', function(t, rs) {
            // make sure the product is not database
            Ext.callback(callback.success, scope, [rs.rows]);
        }, function(t, e) {
            Ext.callback(callback.success, scope, []);
        }, []);
    },
    getItinerary: function(id, callback, scope) {
        var selfRef = this;
        var db = escape.utils.DatabaseManager.getBDConn('user');
        db.queryDB('SELECT * FROM itineraries WHERE id = (?)', function(t, rs) {
            // make sure the product is not database
            Ext.callback(callback.success, scope, [rs.rows]);
        }, function(t, e) {
            Ext.callback(callback.success, scope, []);
        }, [id]);
    },
    createItinerary: function(name, startDate, endDate, callback, scope) {
        var selfRef = this;
        var db = escape.utils.DatabaseManager.getBDConn('user');
        db.queryDB('INSERT INTO itineraries (name,startDate,endDate) VALUES (?,?,?)', function(t, rs) {
            // return the new itinerary
            selfRef.getItinerary(rs.insertId, callback, scope);
        }, function(t, e) {
            Ext.callback(callback.error, scope, []);
        }, [name, startDate, endDate]);
    },
    deleteItinerary: function(id, callback, scope) {
        var selfRef = this;
        var db = escape.utils.DatabaseManager.getBDConn('user');
        db.queryDB('DELETE FROM itineraries WHERE id = (?)', function(t, rs) {
            Ext.callback(callback.success, scope, []);
            // delete the products as well
            selfRef.deleteProductByItinarey(id, callback, scope);
        }, function(t, e) {
            Ext.callback(callback.error, scope, []);
        }, [id]);
    },
    deleteProductByItinarey: function(id) {
        var selfRef = this;
        var db = escape.utils.DatabaseManager.getBDConn('user');
        db.queryDB('DELETE FROM itineraryProducts WHERE itinerary_id = (?)', function(t, rs) {
            // make sure the product is not database
        }, function(t, e) {}, [id]);
    },
    updateItinerary: function(id, name, startDate, endDate, callback, scope) {
        //UPDATE TEST_TABLE SET text = ? WHERE id = ?"
        var selfRef = this;
        var db = escape.utils.DatabaseManager.getBDConn('user');
        db.queryDB('UPDATE itineraries SET name=(?), startDate=(?), endDate=(?) WHERE id = (?) ', function(t, rs) {
            selfRef.getItinerary(id, callback, scope);
        }, function(t, e) {
            Ext.callback(callback.error, scope, []);
        }, [name, startDate, endDate, id]);
    },
    getItineraryDayNotes: function(itinerary_id, dayNum, callback, scope) {
        var selfRef = this;
        var db = escape.utils.DatabaseManager.getBDConn('user');
        db.queryDB('SELECT * FROM itineraryDays WHERE itinerary_id= (?) AND dayNum=(?)', function(t, rs) {
            if (rs.rows.length > 0) {
                // if the days notes have been created then return them
                Ext.callback(callback.success, scope, [rs.rows]);
            } else {
                // create the notes if they do not exist
                selfRef.addItineraryDayNotes(itinerary_id, dayNum, callback, scope);
            }

        }, function(t, e) {
            selfRef.addItineraryDayNotes(itinerary_id, dayNum, callback, scope);
        }, [itinerary_id, dayNum]);
    },
    addItineraryDayNotes: function(itinerary_id, dayNum, callback, scope) {
        var selfRef = this;
        var db = escape.utils.DatabaseManager.getBDConn('user');
        db.queryDB('INSERT INTO itineraryDays (itinerary_id, dayNum, notes) VALUES (?,?,?)', function(t, rs) {
            selfRef.getItineraryDayNotes(itinerary_id, dayNum, callback, scope);
        }, function(t, e) {
            Ext.callback(callback.success, scope, []);
        }, [itinerary_id, dayNum, '']);
    },
    updateItineraryDayNotes: function(itinerary_id, dayNum, notes, callback, scope) {
        var selfRef = this;
        var db = escape.utils.DatabaseManager.getBDConn('user');
        db.queryDB('UPDATE  itineraryDays SET notes=(?) WHERE itinerary_id = (?) AND dayNum = (?)', function(t, rs) {
            Ext.callback(callback.success, scope, []);
        }, function(t, e) {
            Ext.callback(callback.success, scope, []);
        }, [notes, itinerary_id, dayNum]);
    },
    // itineraries products
    addProduct: function(itinerary_id, dayNum, productId, type, name, data, callback, scope) {
        var selfRef = this;
        var db = escape.utils.DatabaseManager.getBDConn('user');
        db.queryDB('INSERT INTO itineraryProducts (itinerary_id, dayNum, product_id, type, name, data) VALUES (?,?,?,?,?,?)', function(t, rs) {
            Ext.callback(callback.success, scope, []);
        }, function(t, e) {
            Ext.callback(callback.error, scope, []);
        }, [itinerary_id, dayNum, productId, type, name, JSON.stringify(data)]);
    },
    getItineraryDay: function(itinerary_id, dayNum, callback, scope) {
        var selfRef = this;
        var db = escape.utils.DatabaseManager.getBDConn('user');
        db.queryDB('SELECT * FROM itineraryProducts WHERE itinerary_id= (?) AND dayNum=(?) ORDER BY orderNum', function(t, rs) {
            // make sure the product is not database
            Ext.callback(callback.success, scope, [rs.rows]);
        }, function(t, e) {
            Ext.callback(callback.success, scope, []);
        }, [itinerary_id, dayNum]);
    },

    deleteProduct: function(id, callback, scope) {
        var selfRef = this;
        var db = escape.utils.DatabaseManager.getBDConn('user');
        db.queryDB('DELETE FROM itineraryProducts WHERE id = (?)', function(t, rs) {
            // make sure the product is not database
            Ext.callback(callback.success, scope, []);
        }, function(t, e) {
            Ext.callback(callback.error, scope, []);
        }, [id]);
    },

    updateProductOrder: function(id, order, callback, scope) {
        var selfRef = this;
        var db = escape.utils.DatabaseManager.getBDConn('user');
        db.queryDB('UPDATE itineraryProducts SET orderNum=(?) WHERE id = (?) ', function(t, rs) {
            Ext.callback(callback.success, scope, []);
        }, function(t, e) {
            Ext.callback(callback.error, scope, []);
        }, [order, id]);
    },
    changeProductDay: function(id, day, callback, scope) {
        var selfRef = this;
        var db = escape.utils.DatabaseManager.getBDConn('user');
        db.queryDB('UPDATE itineraryProducts SET dayNum=(?) WHERE id = (?) ', function(t, rs) {
            Ext.callback(callback.success, scope, []);
        }, function(t, e) {
            Ext.callback(callback.error, scope, []);
        }, [day, id]);
    }
});