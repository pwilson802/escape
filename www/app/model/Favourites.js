Ext.define("escape.model.Favourites", {
    singleton: true,
    config: {},

    getFavourites: function(callback, scope) {
        var selfRef = this;
        var db = escape.utils.DatabaseManager.getBDConn('user');
        db.queryDB('SELECT * FROM Favourites', function(t, rs) {
            // make sure the product is not database
            if (rs.rows.length > 0) {
                // you have favourites load the favourites from the products
                var favs = [];
                for (var i = 0; i < rs.rows.length; i++) {
                    favs.push(rs.rows.item(i));
                }
                Ext.callback(callback.success, scope, [favs]);
            } else {
                // you have no favourites
                Ext.callback(callback.success, scope, []);
            }
        }, function(t, e) {}, []);
    },
    add: function(productId, productType, productName, productData, callback, scope) {
        var db = escape.utils.DatabaseManager.getBDConn('user');
        var selfRef = this;
        db.queryDB('SELECT * FROM Favourites WHERE product_id = (?)', function(t, rs) {
            // make sure the product is not database
            if (rs.rows.length > 0) {
                //'product is already in your favorites'
                Ext.callback(callback.success, scope, []);
            } else {
                selfRef.addToDB(productId, productType, productName, productData, callback, scope);
            }
        }, function(t, e) {
            console.log(e);
            console.log('error selecteing');
        }, [productId]);
    },
    addToDB: function(productId, productType, productName, productData, callback, scope) {
        var selfRef = this;
        var db = escape.utils.DatabaseManager.getBDConn('user');
        db.queryDB('INSERT INTO Favourites (product_id,type,name,data) VALUES (?,?,?,?)', function(t, rs) {
            Ext.callback(callback.success, scope, []);
        }, function(t, e) {
            console.log(e);
        }, [productId, productType, productName, JSON.stringify(productData)]);
    },

    remove: function(productId, callback, scope) {
        var selfRef = this;
        var db = escape.utils.DatabaseManager.getBDConn('user');
        db.queryDB('DELETE FROM Favourites WHERE product_id = (?)', function(t, rs) {
            // make sure the product is not database
            Ext.callback(callback.success, scope, []);
        }, function(t, e) {

        }, [productId]);

    },

    isFav: function(productId, callback, scope) {
        var selfRef = this;
        var db = escape.utils.DatabaseManager.getBDConn('user');
        db.queryDB('SELECT * FROM Favourites WHERE product_id = (?)', function(t, rs) {
            // make sure the product is not database
            if (rs.rows.length > 0) {
                //'product is already in your favorites';
                Ext.callback(callback.success, scope, [true]);
            } else {
                Ext.callback(callback.success, scope, [false]);
            }
        }, function(t, e) {
            Ext.callback(callback.success, scope, [false]);
        }, [productId]);
    }
});