Ext.define('escape.utils.Tracking', {
    requires: ['escape.model.UserSettings'],
    singleton: true,
    sendingTracking: false,
    uploadSize: 10,
    RegID: 0,
    trackEvent: function(pageCode, pageId, eventId) {

        this.insertTracking(pageCode, pageId, eventId);
    },
    trackEventOnCurrent: function(eventId) {
        var trackBy = escape.utils.AppVars.currentPage;
        if (!trackBy) {
            trackBy = escape.utils.AppVars.currentSection;
        }
        var pageCode = trackBy.getPageTypeId();
        var pageId = trackBy.getPageTrackingId();
        this.insertTracking(pageCode, pageId, eventId);
    },
    getRegID: function() {
        if (this.RegID === 0 || this.RegID === null || this.RegID === undefined) {
            // if the device has not been registered use dev reg id ( 5 is one of Ryans Reg IDs )
            return 5;
        } else {
            return this.RegID;
        }
    },

    // if the users table has not been created then create it values are stored as key value pairs
    checkTable: function() {
        var db = escape.utils.DatabaseManager.getBDConn('user');
        //db.queryDB('DROP TABLE Tracking');
        db.queryDB('CREATE TABLE IF NOT EXISTS Tracking (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, pageCode INTEGER, pageId INTEGER, eventId INTEGER, eventDesc STRING, eventDate INTEGER, stage INTEGER)');
    },
    // insert the tracking code into the user settings
    insertTracking: function(pageCode, pageId, eventId) {
        if (this.RegID === 0) {
            this.loadRegInfo();
        }
        // eventDesc
        var eventDesc = '';
        if (isNaN(pageId)) {
            eventDesc = pageId;
            pageId = 0;
        }
        //
        var date = new Date();
        var mili = Date.parse(date);
        this.checkTable();
        var selfRef = this;
        var db = escape.utils.DatabaseManager.getBDConn('user');
        db.queryDB('INSERT INTO Tracking (pageCode,pageId,eventId,eventDesc,eventDate,stage) VALUES (?,?,?,?,?,?)', function(t, rs) {
            // tracking was saved
            selfRef.checkSendTracking();
        }, function(t, e) {
            // error return null for the user value
        }, [pageCode, pageId, eventId, eventDesc, mili, 0]);
    },
    // check in we want to send the the tracking to the server
    checkSendTracking: function(pageCode, pageId, eventId) {
        var selfRef = this;
        // dont need to check if we are already sending the records
        if (!this.sendingTracking) {
            var db = escape.utils.DatabaseManager.getBDConn('user');
            db.queryDB('SELECT * FROM Tracking WHERE stage = 0', function(t, rs) {
                // see if we have reached our uplaod limit
                if (rs.rows.length >= selfRef.uploadSize) {
                    // the row was found return the value
                    selfRef.saveTracking(rs.rows);
                }
            }, function(t, e) {
                // error take no action
            }, []);
        }
    },
    // currently saving rows
    saveTracking: function(rows) {
        if (Ext.device.Connection.isOnline()) {
            // only try to send tracking if the device is online
            this.sendingTracking = true;
            var trackingObj = {
                RegID: this.getRegID(),
                AppID: AppSettings.AppID,
                activities: []
            };
            //pageCode,,eventId
            for (var i = 0; i < rows.length; i++) {
                var eventObj = rows.item(i);
                var saveData = {};
                saveData.DateTime = "/Date(" + eventObj.eventDate + ")/";
                saveData.EvtCode = eventObj.pageCode;
                saveData.EvtCode2 = eventObj.pageId;
                saveData.EvtCode3 = eventObj.eventId;
                saveData.EvtDesc = eventObj.eventDesc;
                trackingObj.activities.push(saveData);
            }
            //
            var selfRef = this;
            // send the tracking
            Ext.Ajax.useDefaultXhrHeader = false;
            Ext.Ajax.request({
                headers: {
                    'Content-Type': 'application/json'
                },
                url: 'http://ws2.tiltandco.net/RestServiceImpl.svc/BulkLogActivity',
                method: "POST",
                jsonData: trackingObj,
                success: function(response) {
                    var regData = JSON.parse(Ext.decode(response.responseText));
                    if (regData.EvtID > 0) {
                        selfRef.deleteTrackingEvents(rows);
                    } else {
                        selfRef.sendingTracking = false;
                    }

                },
                failure: function(response, opts) {
                    selfRef.sendingTracking = false;
                }
            });
        }

    },
    deleteTrackingEvents: function(rows) {
        this.sendingTracking = false;
        var db = escape.utils.DatabaseManager.getBDConn('user');
        var selfRef = this;
        var SQL = 'DELETE FROM Tracking WHERE';
        for (var i = rows.length - 1; i >= 0; i--) {
            var eventObj = rows.item(i);
            SQL += '  id = ' + eventObj.id;
            if (i > 0) {
                SQL += ' OR';
            }
        }
        db.queryDB(SQL, function(t, rs) {}, function(e) {}, []);
    },
    // laod the Reg info
    loadRegInfo: function() {
        var selfRef = this;
        escape.model.UserSettings.getSetting('RegID', {
            success: function(RegID) {
                selfRef.RegID = RegID;
            },
            error: function(error) {},
            scope: this
        });
    }
});


// Request URL
// http://ws2.tiltandco.net/RestServiceImpl.svc/LogEvent
// Request Payload
// {"RegID":"1","AppID":"1","DateTime":"/Date(1345521600000)
// /","EvtCode":"29","EvtCode2":"12","EvtCode3":"14"}