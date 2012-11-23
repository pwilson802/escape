Ext.define("escape.model.Content", {
    singleton: true,
    config: {
         useOffline: true
    },
    // called when useOffline is updated
    updateUseOffline: function(newValue, oldValue) {
         escape.model.UserSettings.setSetting('useOffline', String(newValue), {
            success: function(newValue) {
            },
            error: function(error) {
            },
            scope: this
        });
    },
   
    checkOfflineSettings: function(callback, scope) {
        // Check to see if the user has picked a useOffline setting
        var selfRef = this;
        escape.model.UserSettings.getSetting('useOffline', {
            success: function(useOffline) {
                if (useOffline === null) {
                    // no user isDegrees has been selected
                    selfRef.setUseOffline(true);
                } else {
                    var setting = true;
                    if (useOffline == 'false') {
                        setting = false;
                    }
                    if (useOffline === 0) {
                        setting = false;
                    }
                    selfRef.setUseOffline(setting);
                }
            },
            error: function(error) {
                // no user temp has been selected
                selfRef.setIsDegrees(true);
            },
            scope: this
        });
    },
    // based on the users setting and connectivity will return the local page data
    getContentPageData: function(url, callback, scope) {
        var loadLocal = true;
        if (Ext.device.Connection.isOnline()) {
            if (!this.getUseOffline()) {
                loadLocal = false;
            }
        }
        if (loadLocal) {
            // the device is not online load local content
            this.loadLocalContent(url, callback, scope);
        } else {
            // load the content from the remote server
            this.loadRemoteContent(url, callback, scope);
        }

    },
    loadRemoteContent: function(url, callback, scope, localData) {
        // load the content data
        escape.model.ContentPage.getProxy().setUrl(url);
        escape.model.ContentPage.load(0, {
            success: function(content) {
                Ext.callback(callback.success, scope, [content]);
                this.saveRemoteContent(url, content);
            },
            error: function(error) {},
            scope: this
        });
    },
    saveRemoteContent: function(url, content) {
        var updateTime = new Date().getTime();
        var selfRef = this;
        var db = escape.utils.DatabaseManager.getBDConn('cmsPages');
        if (content) {
            db.queryDB('UPDATE Pages SET name=(?), date_modified=(?), JSON_data=(?) WHERE url = (?)', function(t, rs) {
                // the content was updated succeesfully
            }, function(t, e) {
            }, [content.title, updateTime, JSON.stringify(content.raw), url]);
        } else {
            // error updating the content try insertint it
            db.queryDB('INSERT INTO Pages (name,url,date_modified,JSON_data) VALUES (?,?,?,?)', function(t, rs) {
                // the content was updated succeesfully
            }, function(t, e) {
                // error updating the content try insertint it
            }, [content.title, url, updateTime, JSON.stringify(content.raw)]);
        }
    },
    loadLocalContent: function(url, callback, scope) {
        var selfRef = this;
        var db = escape.utils.DatabaseManager.getBDConn('cmsPages');
        db.queryDB('SELECT * FROM Pages WHERE url = (?)', function(t, rs) {
            // make sure the product is not database
            var page = rs.rows.item(0);
            // build and map page data
            var jsonData = JSON.parse(page.JSON_data);
            // make sure the page is uptodate
            var dateNow = new Date();
            var diff = dateNow.getTime() - page.date_modified;
            // check to see if the content is out of date
            var useLocal = true;
            if (diff > (AppSettings.caching.cmsCacheLength*1000)) {
                useLocal = false;
                // make sure the user has a strong enough connection
                var connectionType = Ext.device.Connection.getType();
                if (connectionType === Ext.device.NONE || connectionType === Ext.device.CELL_2G || !Ext.device.Connection.isOnline()) {
                    useLocal = true;
                }
            }
            //
            if (useLocal) {
                var pageData = {};
                pageData.title = jsonData.Page.Title;
                pageData.description = jsonData.Page.Content;
                pageData.images = jsonData.Page.Images;
                pageData.geolocation = jsonData.Page.Geolocation;
                pageData.children = jsonData.Children;
                pageData.externalLinks = jsonData.Page['External-Links'];
                pageData.page = jsonData.Page;
                // place data into a model
                var localImagesList = page.images.split(',');
                if (localImagesList.length > 0 && page.images.length > 0) {
                    // load the images
                    selfRef.loadLocalImages(localImagesList, pageData, callback, scope);
                } else {
                    // return the data
                    selfRef.returnLocalData(pageData, callback, scope);
                }
            } else {
                // load remote data instead
                selfRef.loadRemoteContent(url, callback, scope, page);
            }
            // return the content
        }, function(t, e) {
            // error try loading the remote data
            selfRef.loadRemoteContent(url, callback, scope);
        }, [url]);
    },
    loadLocalImages: function(ids, pageData, callback, scope) {
        var selfRef = this;
        var db = escape.utils.DatabaseManager.getBDConn('cmsPages');

        var SQL = 'SELECT * FROM Images WHERE';
        for (var i = ids.length - 1; i >= 0; i--) {
            SQL += '  id = ' + ids[i];
            if (i > 0) {
                SQL += ' OR';
            }
        }
        db.queryDB(SQL, function(t, rs) {
            var imagesList = [];
            // process the images
            for (var i = 0; i < rs.rows.length; i++) {
                var image = rs.rows.item(i);
                imagesList.push({
                    "Full Size": 'resources/images/cms/' + image.image_name,
                    "Alt": image.alt_text
                });
            }
            pageData.images = imagesList;
            // return the data
            selfRef.returnLocalData(pageData, callback, scope);
        }, function(e) {
            // on error return the data without images
            selfRef.returnLocalData(pageData, callback, scope);
        }, []);
    },
    returnLocalData: function(pageData, callback, scope) {
        var modelData = Ext.create('escape.model.ContentPage');
        modelData.setData(pageData);
        Ext.callback(callback.success, scope, [modelData]);
    },
    process: function(content) {
        // parse over the content
        content.productLists = [];
        // parse children for must do links
        if (content.children) {
            var newChirldren = [];
            if (content.children.length > 0) {
                for (var c = 0; c < content.children.length; c++) {
                    var childLink = content.children[c];
                    if (childLink.Url.indexOf('must-do') != -1 || childLink.Name.indexOf('Must Do Links') != -1) {
                        content.productLists.push({
                            name: 'Must do',
                            url: childLink.Url,
                            type: 'mustDo'
                        });
                    } else {
                        newChirldren.push(childLink);
                    }
                }
            }
            // remove any product list
            content.children = newChirldren;
        }
        // parse external links for product list
        var externalLinks = content.page['External-Links'];
        if (externalLinks) {
            var newExternalLinks = [];
            if (externalLinks.length > 0) {
                for (var e = 0; e < externalLinks.length; e++) {
                    var externalLink = externalLinks[e];
                    if (externalLink.Url.indexOf('product-list-generator') != -1) {
                        content.productLists.push({
                            name: externalLink.Name,
                            url: externalLink.Url,
                            type: 'productList'
                        });
                    } else {
                        newExternalLinks.push(externalLink);
                    }
                }
            }
            // remove any product list
            content.page['External-Links'] = newExternalLinks;
        }
        return content;
    },
    buildItems: function(content, subPageXtype) {
        subPageXtype = (!subPageXtype) ? 'contentPage' : subPageXtype;
        // screen size
        var viewportSize = Ext.Viewport.getSize();
        var screenWidth = viewportSize.width;
        //
        var items = [];
        // create images
        if (content.images.length > 0) {
            var caroselImages = [];
            for (var i = 0; i < content.images.length; i++) {
                caroselImages.push({
                    xtype: 'contentImg',
                    width: screenWidth,
                    height: 200,
                    imagePath: escape.utils.Img.getResizeURL(content.images[i]['Full Size'], screenWidth),
                    altText: content.images[i]['Alt']
                });
            }
            var indicator = (content.images.length > 1) ? true : false;
            items.push({
                xtype: 'carousel',
                indicator: indicator,
                height: 200,
                items: caroselImages
            });
        }
        // create map
        if (content.geolocation !== null) {
            items.push({
                xtype: 'mapDisplay',
                lat: Number(content.geolocation.Latitude),
                lon: Number(content.geolocation.Longitude),
                interaction: false,
                markerAtCenter: true
            });
        }
        // add the description
        if (content.description !== '' & content.description !== null & content.description !== undefined) {
            var description = escape.utils.AppFuncs.parseCMSText(content.description);
            items.push({
                xtype: 'expandableInfo',
                showBorder: false,
                completeText: description,
                showParagraphs: 3,
                padding: '10px 0 0 0'
            });
        }
        // add a place holder for must do
        items.push({
            itemId: 'mustDoPlaceHolder',
            xtype: 'container',
            padding: '0',
            items: []
        });
        // check to see if the page has child pages
        if (content.children.length > 0) {
            items.push({
                xtype: 'list',
                action: 'contentPageChange',
                margin: '10 10 10 10',
                itemTpl: '{Name}',
                cls: 'selectionList',
                subPageXtype: subPageXtype,
                scrollable: false,
                data: this.buildChildren(content.children)
            });
        }
        items.push({
            xtype: 'footer'
        });
        return items;
    },

    buildChildren: function(children) {
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var urlBreakdown = child.Url.split('/');
            var typeId = urlBreakdown[urlBreakdown.length - 1];
            child.typeId = typeId;
        }
        return children;
    }
});