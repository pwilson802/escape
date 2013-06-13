
EMS.Services.communicationMode = "CrossDomain";
EMS.InteractiveMarkerStyles = {
    SLIM: 1,
    THICK: 2,
    TEXT: 3,
    SLIM_MULTI: 4,
    MULTI: 5,
    SLIM_CIRCLE: 6,
    THICK_CIRCLE: 7
};
EMS.InteractiveMarkerPopupSizes = {
    MINI: 1,
    SMALL: 2,
    SMALL_WITH_HEADER: 3,
    LARGE: 4,
    LARGE_WITH_HEADER: 5
};
EMS.InteractiveIcon = OpenLayers.Class({
    defaultOptions: {
        markerStyle: EMS.InteractiveMarkerStyles.SLIM,
        dockedInfoBoxId: null,
        title: "",
        text: "",
        popupEdgeMargin: 10,
        fadeDuration: 20
    },
    size: null,
    slidePx: null,
    offset: null,
    div: null,
    px: null,
    _showingPopup: false,
    _originalDiv: null,
    _popupDiv: null,
    _popupBox: null,
    initialize: function(b, a) {
        a = a ? a : {};
        this.options = OpenLayers.Util.extend(this.defaultOptions, a);
        var c = OpenLayers.Util.createUniqueID("EMS_InteractiveIcon_");
        this._showingPopup = false;
        switch (this.options.markerStyle) {
        case EMS.InteractiveMarkerStyles.SLIM:
            this.div = this.createSlimPoi();
            this.size = new OpenLayers.Size(30, 33);
            this.slidePx = new OpenLayers.Size(15, 24);
            break;
        case EMS.InteractiveMarkerStyles.THICK:
            this.div = this.createThickPoi();
            this.size = new OpenLayers.Size(50, 33);
            this.slidePx = new OpenLayers.Size(8, 24);
            break;
        case EMS.InteractiveMarkerStyles.TEXT:
            this.div = this.createTextPoi();
            this.size = new OpenLayers.Size(201, 50);
            this.slidePx = new OpenLayers.Size(0, 20);
            break;
        case EMS.InteractiveMarkerStyles.SLIM_MULTI:
            this.div = this.createSlimMultiPoi();
            this.size = new OpenLayers.Size(30, 33);
            this.slidePx = new OpenLayers.Size(15, 24);
            break;
        case EMS.InteractiveMarkerStyles.MULTI:
            this.div = this.createThickMultiPoi();
            this.size = new OpenLayers.Size(50, 33);
            this.slidePx = new OpenLayers.Size(8, 24);
            break;
        case EMS.InteractiveMarkerStyles.SLIM_CIRCLE:
            this.div = this.createSlimCirclePoi();
            this.size = new OpenLayers.Size(20, 20);
            this.slidePx = new OpenLayers.Size(2, -26);
            break;
        case EMS.InteractiveMarkerStyles.THICK_CIRCLE:
            this.div = this.createThickCirclePoi();
            this.size = new OpenLayers.Size(25, 25);
            this.slidePx = new OpenLayers.Size(2, -35);
            break;
        default:
        }
        this.div.icon = this;
        this._originalDiv = this.div;
        this.map = b
    },
    createDiv: function(c, a) {
        var b = document.createElement("div");
        b.setAttribute("class", c);
        if (a) {
            a.appendChild(b)
        }
        return b
    },
    createMarkerPoi: function() {
        var a = this.createDiv("marker");
        var i = this.createDiv("marker-shadow", a);
        var h = this.createDiv("main-shadow", i);
        var j = this.createDiv("triangle-shadow", i);
        var g = this.createDiv("clip", a);
        var d = this.createDiv("box", g);
        var e = this.createDiv("inside", d);
        if (this.options.text != "") {
            var f = this.createDiv("text", e);
            f.innerText = this.options.text
        } else {
            var f = this.createDiv("text point", e);
            f.innerText = "."
        }
        var b = this.createDiv("triangle-box", a);
        var c = this.createDiv("inside", b);
        this.textDiv = f;
        return a
    },
    createSlimPoi: function() {
        var a = this.createMarkerPoi();
        a.setAttribute("class", "marker mini");
        return a
    },
    createThickPoi: function() {
        var a = this.createMarkerPoi();
        a.setAttribute("class", "marker fat");
        return a
    },
    createMultiMarkerComponent: function(e, h) {
        var c = this.createDiv(e);
        var i = this.createDiv("clip", c);
        var d = this.createDiv("box", i);
        var f = this.createDiv("inside", d);
        if (h) {
            var g = this.createDiv("text point", f);
            g.innerText = "..."
        }
        var a = this.createDiv("triangle-box", c);
        var b = this.createDiv("inside", a);
        return c
    },
    createMultiMarkerPoi: function() {
        var b = this.createDiv("marker");
        var a = this.createDiv("marker-shadow", b);
        var d = this.createDiv("main-shadow", a);
        var c = this.createDiv("triangle-shadow", a);
        b.appendChild(this.createMultiMarkerComponent("multi-component back"));
        b.appendChild(this.createMultiMarkerComponent("multi-component middle"));
        b.appendChild(this.createMultiMarkerComponent("multi-component front", true));
        return b
    },
    createSlimMultiPoi: function() {
        var a = this.createMultiMarkerPoi();
        a.setAttribute("class", "marker mini multi");
        return a
    },
    createThickMultiPoi: function() {
        var a = this.createMultiMarkerPoi();
        a.setAttribute("class", "marker fat multi");
        return a
    },
    createTextPoi: function() {
        var a = this.createDiv("poi");
        var f = this.createDiv("box", a);
        var g = this.createDiv("inside", f);
        var h = false;
        if (this.options.title != "") {
            var e = this.createDiv("title", g);
            e.innerText = this.options.title;
            this.titleDiv = e;
            h = true
        }
        var i = this.createDiv("text", g);
        i.innerText = this.options.text;
        if (h) {
            i.setAttribute("class", "text with-title")
        }
        var j = this.createDiv("disclosure", f);
        this.disclosureDiv = j;
        var b = this.createDiv("triangle-box", a);
        var d = this.createDiv("inside", b);
        var c = this.createDiv("triangle-cover", a);
        this.textDiv = i;
        return a
    },
    createPopup: function(f) {
        var c = this.createDiv("poi");
        var h = this.createDiv("box", c);
        this._popupBox = h;
        var e = this.createDiv("inside", h);
        if (f) {
            var b = this.createDiv("popup-contents", e);
            b.appendChild(f)
        }
        var g = this.createDiv("triangle-box", c);
        var a = this.createDiv("inside", g);
        var d = this.createDiv("triangle-cover", c);
        return c
    },
    createCirclePoi: function() {
        var d = this.createDiv("non-geo-marker");
        var a = this.createDiv("marker-shadow", d);
        var b = this.createDiv("clip", d);
        var e = this.createDiv("inside", d);
        if (this.options.text != "") {
            var c = this.createDiv("text", e);
            c.innerText = this.options.text
        } else {
            var c = this.createDiv("text point", e);
            c.innerText = "."
        }
        this.textDiv = c;
        return d
    },
    createSlimCirclePoi: function() {
        var a = this.createCirclePoi();
        a.setAttribute("class", "non-geo-marker mini");
        return a
    },
    createThickCirclePoi: function() {
        var a = this.createCirclePoi();
        a.setAttribute("class", "non-geo-marker fat");
        return a
    },
    showPopup: function(c, i, j) {
        if (this.map.resetPan) {
            this.map.resetPan()
        }
        if (!this.marker) {
            return
        }
        if (!this._showingPopup) {
            if (!this._popupDiv) {
                this._popupDiv = this.createPopup(c);
                var h = this._popupDiv.getAttribute("class") + " popup";
                this._popupDiv.setAttribute("class", h);
                if (!j) {
                    j = EMS.InteractiveMarkerPopupSizes.SMALL
                }
                switch (j) {
                case EMS.InteractiveMarkerPopupSizes.MINI:
                    this._popupDiv.size = new OpenLayers.Size(202, 110);
                    this._popupDiv.slidePx = new OpenLayers.Size(0, 54);
                    this._popupBox.setAttribute("class", "box mini");
                    break;
                default:
                case EMS.InteractiveMarkerPopupSizes.SMALL:
                    this._popupDiv.size = new OpenLayers.Size(202, 210);
                    this._popupDiv.slidePx = new OpenLayers.Size(0, 104);
                    this._popupBox.setAttribute("class", "box small");
                    break;
                case EMS.InteractiveMarkerPopupSizes.SMALL_WITH_HEADER:
                    this._popupDiv.size = new OpenLayers.Size(202, 244);
                    this._popupDiv.slidePx = new OpenLayers.Size(0, 118);
                    this._popupBox.setAttribute("class", "box small-with-head");
                    break;
                case EMS.InteractiveMarkerPopupSizes.LARGE:
                    this._popupDiv.size = new OpenLayers.Size(206, 246);
                    this._popupDiv.slidePx = new OpenLayers.Size(0, 120);
                    this._popupBox.setAttribute("class", "box large");
                    break;
                case EMS.InteractiveMarkerPopupSizes.LARGE_WITH_HEADER:
                    this._popupDiv.size = new OpenLayers.Size(202, 280);
                    this._popupDiv.slidePx = new OpenLayers.Size(2, 134);
                    this._popupBox.setAttribute("class", "box large-with-head");
                    break
                }
                this._originalDiv.size = this.size;
                this._originalDiv.slidePx = this.slidePx
            }
            this.fadeIn(this._popupDiv);
            this.fadeOut(this._originalDiv);
            this.map.markersLayer.removeMarker(this.marker);
            this.size = this._popupDiv.size;
            this.slidePx = this._popupDiv.slidePx;
            this.div = this._popupDiv;
            this.map.markersLayer.addMarker(this.marker);
            if (i) {
                var d = moveY = 0;
                var f = this.map.getPixelFromLonLat(this.marker.lonlat);
                var e = this.options.popupEdgeMargin;
                var a = f.y - this.size.h;
                var g = f.x - 0.5 * this.size.w;
                var b = this.map.getSize().w - (f.x + 0.5 * this.size.w);
                if (a < e) {
                    moveY = a - e
                }
                if (g < e) {
                    d = g - e
                } else {
                    if (b < e) {
                        d = e - b
                    }
                }
                this.map.pan(d, moveY)
            }
            this._showingPopup = true;
            return this._popupDiv
        }
        return null
    },
    hidePopup: function() {
        if (this._showingPopup) {
            this.map.markersLayer.removeMarker(this.marker);
            this.size = this._originalDiv.size;
            this.slidePx = this._originalDiv.slidePx;
            this.fadeOut(this._popupDiv);
            this.fadeIn(this._originalDiv);
            this.div = this._originalDiv;
            this.map.markersLayer.addMarker(this.marker);
            this._showingPopup = false
        }
    },
    fadeTween: function(c, f, a) {
        c.style.opacity = f;
        var b = new OpenLayers.Tween(OpenLayers.Easing.Linear.easeIn);
        this.animationTween = b;
        b.type = "fade";
        var h = {
            opacity: f
        };
        var g = {
            opacity: a
        };
        var e = this.options.fadeDuration;
        var d = {
            eachStep: function(j) {
                var i = j.opacity;
                if (i > 1) {
                    i = 1
                } else {
                    if (i < 0) {
                        i = 0
                    }
                }
                c.style.opacity = i
            }
        };
        b.start(h, g, e, {
            callbacks: d
        })
    },
    fadeIn: function(a) {
        this.fadeTween(a, 0, 1)
    },
    fadeOut: function(a) {
        this.fadeTween(a, 1, 0)
    },
    destroy: function() {
        this.erase();
        OpenLayers.Event.stopObservingElement(this._originalDiv);
        this._originalDiv.innerHTML = "";
        this._originalDiv = null;
        OpenLayers.Event.stopObservingElement(this._popupDiv);
        this._popupDiv.innerHTML = "";
        this._popupDiv = null
    },
    draw: function(a) {
        this.moveTo(a);
        return this.div
    },
    erase: function() {
        if (this.div != null && this.div.parentNode != null) {
            OpenLayers.Element.remove(this.div)
        }
    },
    moveTo: function(a) {
        if (a != null) {
            this.px = a
        }
        if (this.div != null) {
            if (this.px == null) {
                this.display(false)
            } else {
                if (this.calculateOffset) {
                    this.offset = this.calculateOffset(this.size)
                }
                var b = this.px.offset(this.offset);
                OpenLayers.Util.modifyDOMElement(this.div, null, b)
            }
        }
    },
    calculateOffset: function() {
        var a = new OpenLayers.Pixel(-(this.size.w / 2) - this.slidePx.w, -(this.size.h / 2) - this.slidePx.h);
        return a
    },
    isDrawn: function() {
        var a = (this.div && this.div.parentNode && (this.div.parentNode.nodeType != 11));
        return a
    },
    CLASS_NAME: "EMS.InteractiveIcon"
});
window.addEventListener("load", function() {
    var c = function() {
            var g = MAP.instances[0].Map;
            var d = (g.getCenter()).asWGS84();
            var f = (g.getExtent()).asWGS84();
            var e = g.getZoom();
            return {
                center: d,
                bounds: f,
                zoom: e
            }
        };
    var b = function(e) {
            var d;
            if (MAP.instances[0].Map.whereis_street_wms.visibility) {
                d = "Map"
            } else {
                if (MAP.instances[0].Map.whereis_photo_wms.visibility) {
                    d = "Photo"
                }
            }
            if (e === true) {
                $("searchLayer").value = d;
                return
            }
            return d
        };
    if ($("searchSubmit")) {
        $("searchSubmit").addEventListener("click", function(i) {
            var h = c();
            var d = h.center;
            var g = h.bounds;
            var f = h.zoom;
            $("searchLat").value = d.lat;
            $("searchLon").value = d.lon;
            $("searchTop").value = g.top;
            $("searchBottom").value = g.bottom;
            $("searchLeft").value = g.left;
            $("searchRight").value = g.right;
            $("searchZoom").value = (16 - f) <= 0 ? 1 : (16 - f);
            b(true);
            return
        }, true)
    }
    var a = $$("a.snl");
    if (a.length > 0) {
        a.addEvent("click", function(n) {
            n.stop();
            var h = n.target.href;
            var g = c();
            var f = g.center;
            var d = g.bounds;
            var p = (16 - p) <= 0 ? 1 : (16 - p);
            var l = new RegExp("(.*)&lat=[-.0-9]+(.*)", "i");
            h = h.replace(l, "$1&lat=" + f.lat + "$2");
            var i = new RegExp("(.*)&lon=[.0-9]+(.*)", "i");
            h = h.replace(i, "$1&lon=" + f.lon + "$2");
            var j = new RegExp("(.*)&top=[-.0-9]+(.*)", "i");
            h = h.replace(j, "$1&top=" + d.top + "$2");
            var r = new RegExp("(.*)&left=[.0-9]+(.*)", "i");
            h = h.replace(r, "$1&left=" + d.left + "$2");
            var m = new RegExp("(.*)&bottom=[-.0-9]+(.*)", "i");
            h = h.replace(m, "$1&bottom=" + d.bottom + "$2");
            var k = new RegExp("(.*)&right=[.0-9]+(.*)", "i");
            h = h.replace(k, "$1&right=" + d.right + "$2");
            var q = new RegExp("(.*)&lastZoom=[0-9](1,2)(.*)", "i");
            h = h.replace(q, "$1&lastZoom=" + p + "$2");
            var o = new RegExp("(.*)&lastLayer=[a-zA-Z]+(.*)", "i");
            h = h.replace(o, "$1&lastLayer=" + b(false) + "$2");
            window.location = h
        })
    }
}, true);
MAP = {};
MAP.instances = new Array();
var MobEMS = new Class({
    Map: null,
    Geocoder: new EMS.Services.Geocoder(),
    Itin: null,
    RouteManager: null,
    Control: null,
    routeHistory: new Array(),
    nth: null,
    initialize: function(e, a, b, d, c) {
        _MapControlsCompulsory_ = _MapControlsCompulsory_.concat(this.filterOptionalMapControls());
        window.addEvent("load", function() {
            if (this.injectMapDiv(e)) {
                this.Map = new EMS.Services.Map("map-div", {
                    controls: _MapControlsCompulsory_,
                    showMaxExtent: false,
                    onInit: function(n) {
                        var l = n.controls.length;
                        for (var k = 0; k < l; k++) {
                            if (n.controls[k].CLASS_NAME == "EMS.Control.ViewMode") {
                                if ($defined(a) && $defined(a.layer)) {
                                    n.controls[k].switchTo(a.layer)
                                }
                            }
                            if (n.controls[k].CLASS_NAME == "EMS.Control.LocateMe") {
                                n.controls[k].setMapNth(this.nth)
                            }
                        }
                        this.RouteManager = new EMS.Services.RouteManager(this.Map);
                        if ($defined(b)) {
                            if ($defined(b.boundingBox)) {
                                var m = new OpenLayers.Bounds();
                                m.extend(this.formatLatLon(b.boundingBox.topLeft));
                                m.extend(this.formatLatLon(b.boundingBox.bottomRight));
                                var g = this.Map.getZoomForExtent(m);
                                if ($defined(b.zoomInThreshold)) {
                                    var j = g >= b.zoomInThreshold ? b.zoomInThreshold : g
                                } else {
                                    var j = g
                                }
                                this.Map.setCenter(m.getCenterLonLat(), j)
                            } else {
                                if ($defined(b.latitude) && $defined(b.longitude)) {
                                    var f = new EMS.LonLat(b.longitude, b.latitude);
                                    this.Map.setCenter(f, b.zoom)
                                }
                            }
                            if ($defined(b.dock)) {
                                this.addDock(n, b.dock)
                            }
                        }
                        if ($defined(d)) {
                            this.addPois(n, d)
                        }
                        if ($defined(c)) {
                            var h = c.wayPoints.length;
                            for (var k = 0; k < h; k++) {
                                this.routeHistory.push(this.routeAddress(c.wayPoints[k]))
                            }
                            this.route(c.fastest, c.tolls, c.transportType)
                        }
                        this.createDeviceLocationInstance(n)
                    }.bind(this)
                })
            }
        }.bind(this));
        this.nth = MAP.instances.push(this) - 1
    },
    injectMapDiv: function(c) {
        if ($defined(c)) {
            $(c).empty();
            var a = new Element("div");
            a.id = "map-div";
            $(c).appendChild(a);
            return true
        } else {
            try {
                sensis.warn("mapWrapper element is not defined")
            } catch (b) {}
            return false
        }
    },
    filterOptionalMapControls: function() {
        var d = new Array();
        for (var a = 0; a < _MapControlsOptional_.length; a++) {
            var c = _MapControlsOptional_[a];
            if ($defined(EMS.Control[c])) {
                var b = new EMS.Control[c];
                if (this.crossCheckOptionalIsNotDuplicateOfCompulsory(b)) {
                    d.push(b)
                }
            }
        }
        return d
    },
    crossCheckOptionalIsNotDuplicateOfCompulsory: function(b) {
        for (var a = 0; a < _MapControlsCompulsory_.length; a++) {
            if (b.CLASS_NAME == _MapControlsCompulsory_[a].CLASS_NAME) {
                return false;
                break
            }
        }
        return true
    },
    isEMSLatLon: function(a) {
        if ($defined(a.CLASS_NAME) && a.CLASS_NAME == "OpenLayers.LonLat") {
            return true
        }
        return false
    },
    formatLatLon: function(a) {
        if (this.isEMSLatLon(a)) {
            return a
        } else {
            return new EMS.LonLat(a.longitude, a.latitude)
        }
    },
    isLatLonEqual: function(b, a) {
        if (b.longitude == a.longitude && b.latitude == a.latitude) {
            return true
        }
        return false
    },
    createIcon: function(a) {
        if (!$defined(a)) {
            return false
        }
        return new OpenLayers.Icon(a.url, new OpenLayers.Size(a.width, a.height), new OpenLayers.Pixel(a.offsetX, a.offsetY))
    },
    __addPoi: function(b, c) {
        var a = new OpenLayers.Marker(this.formatLatLon(b.coordinates), this.createIcon(c));
        this.Map.markersLayer.addMarker(a);
        a.display(true);
        return a
    },
    addPoi: function(a, b) {
        return this.__addPoi(a, b)
    },
    addPois: function(d, f) {
        var e = f.length;
        if (e > 0) {
            for (var c = 0; c < e; c++) {
                var a = {
                    coordinates: f[c].coordinates
                };
                var b = {
                    url: f[c].url,
                    width: f[c].width,
                    height: f[c].height,
                    offsetX: f[c].offsetX,
                    offsetY: f[c].offsetY
                };
                this.addPoi(a, b)
            }
        }
    },
    clearPois: function() {
        this.Map.markersLayer.clearMarkers()
    },
    routeAddress: function(b) {
        var a = {};
        a.coordinates = b.coordinates;
        a.street = {
            name: ""
        };
        return a
    },
    route: function(b, c, a) {
        if (this.routeHistory.length >= 2) {
            this.RouteManager.route(this.routeHistory, b, c, a, this.Map.vlayer, {})
        }
    },
    clearRoutes: function() {
        this.RouteManager.clearRoute();
        this.routeHistory.empty()
    },
    clearMap: function() {
        this.clearRoutes();
        this.clearPois()
    },
    createDeviceLocationInstance: function() {},
    addDock: function() {}
});
EMS.Control.Ornaments = OpenLayers.Class(OpenLayers.Control, {
    Device: "Advance-NonGesturalTouch",
    CLASS_NAME: "EMS.Control.Ornaments",
    ornamentButtonPadding: 5,
    active: false,
    northSize: null,
    northImage: null,
    northDiv: null,
    logoSize: null,
    logoImage: null,
    logoDiv: null,
    positions: {},
    initialize: function() {
        this.active = true;
        this.northImage = new Image();
        this.northImage.src = _MapOrnamentsPath_ + "north.image";
        this.northImage.id = "northOrnament";
        this.logoImage = new Image();
        this.logoImage.src = _MapOrnamentsPath_ + "copyright.image";
        this.logoImage.id = "copyrightOrnament"
    },
    calcPosition: function() {
        this.positions.north = new OpenLayers.Pixel(this.ornamentButtonPadding, this.ornamentButtonPadding);
        this.positions.logo = new OpenLayers.Pixel(this.map.size.w - this.logoSize.w - this.ornamentButtonPadding, 0)
    },
    draw: function() {
        this.northSize = new OpenLayers.Size(this.northImage.width, this.northImage.height);
        this.logoSize = new OpenLayers.Size(this.logoImage.width, this.logoImage.height);
        this.calcPosition();
        this.northDiv = OpenLayers.Util.createDiv("NorthLogo", this.positions.north, this.northSize, "", "absolute", "0px none", "", "1");
        this.logoDiv = OpenLayers.Util.createDiv("CopyrightLogo", this.positions.logo, this.logoSize, "", "absolute", "0px none", "", "1");
        this.northDiv.style.zIndex = "750";
        this.logoDiv.style.zIndex = "750";
        this.northDiv.appendChild(this.northImage);
        this.logoDiv.appendChild(this.logoImage);
        this.northDiv.addEventListener("resize", function(a) {
            this.rePosition()
        }.bind(this), false);
        this.map.div.appendChild(this.northDiv);
        this.map.div.appendChild(this.logoDiv)
    },
    rePosition: function() {
        this.calcPosition();
        this.northDiv.style.top = this.positions.north.y + "px";
        this.northDiv.style.left = this.positions.north.x + "px";
        this.logoDiv.style.top = this.positions.logo.y + "px";
        this.logoDiv.style.left = this.positions.logo.x + "px"
    },
    destroy: function() {
        if (this.handler) {
            this.handler.destroy()
        }
        this.handler = null
    }
});
_MapControlsCompulsory_.push(new EMS.Control.Ornaments);
EMS.Control.ViewMode = OpenLayers.Class(OpenLayers.Control, {
    Device: "Advance-NonGesturalTouch",
    CLASS_NAME: "EMS.Control.ViewMode",
    viewButtonSize: null,
    viewButtonPadding: 5,
    active: false,
    inPhotoMode: false,
    div: null,
    photoImage: null,
    mapImage: null,
    updateServerURL: null,
    initialize: function() {
        this.active = true;
        this.photoImage = new Image();
        this.photoImage.src = _MapControlsPath_ + "photo.image";
        this.photoImage.style.display = "block";
        this.photoImage.id = "grow";
        this.mapImage = new Image();
        this.mapImage.src = _MapControlsPath_ + "map.image";
        this.mapImage.style.display = "none";
        this.mapImage.id = "shrink"
    },
    calcPosition: function() {
        return new OpenLayers.Pixel(this.viewButtonPadding, this.map.size.h - this.viewButtonSize.h - this.viewButtonPadding)
    },
    draw: function() {
        this.viewButtonSize = new OpenLayers.Size(this.photoImage.width, this.photoImage.height);
        if ($("mapStateChangeUrl")) {
            this.updateServerURL = $("mapStateChangeUrl").href
        }
        var a = this.calcPosition();
        this.div = OpenLayers.Util.createDiv("ViewMode_Controller", a, this.viewButtonSize, "", "absolute", "0px none", "", "1");
        this.div.style.zIndex = "750";
        this.div.appendChild(this.photoImage);
        this.div.appendChild(this.mapImage);
        this.map.events.register("changelayer", this, function(b) {
            this.div.style.opacity = "1"
        });
        this.div.addEventListener("click", function(b) {
            this.div.style.opacity = "0.3";
            this.doViewChange()
        }.bind(this), false);
        this.map.div.appendChild(this.div)
    },
    doViewChange: function() {
        if (this.inPhotoMode) {
            this.switchTo("map");
            Reporting.to(this.updateServerURL, {
                lyr: "m"
            })
        } else {
            this.switchTo("photo");
            Reporting.to(this.updateServerURL, {
                lyr: "p"
            })
        }
    },
    switchTo: function(a) {
        if (a == "photo") {
            this.map.whereis_photo_wms.setVisibility(1);
            this.map.whereis_street_wms.setVisibility(0);
            this.inPhotoMode = true;
            this.toggle()
        } else {
            if (a == "map") {
                this.map.whereis_street_wms.setVisibility(1);
                this.map.whereis_photo_wms.setVisibility(0);
                this.inPhotoMode = false;
                this.toggle()
            }
        }
    },
    toggle: function() {
        if (this.inPhotoMode) {
            this.photoImage.style.display = "none";
            this.mapImage.style.display = "block"
        } else {
            this.photoImage.style.display = "block";
            this.mapImage.style.display = "none"
        }
    },
    destroy: function() {
        if (this.handler) {
            this.handler.destroy()
        }
        this.handler = null
    }
});
EMS.Control.Zoom = OpenLayers.Class(OpenLayers.Control, {
    Device: "Advance-NonGesturalTouch",
    CLASS_NAME: "EMS.Control.Zoom",
    zoomButtonSize: null,
    zoomButtonPadding: 5,
    active: false,
    div: null,
    zoomInImage: null,
    zoomOutImage: null,
    ziDiv: null,
    zoDiv: null,
    controlEnabled: true,
    initialize: function() {
        this.active = true;
        this.zoomInImage = new Image();
        this.zoomInImage.src = _MapControlsPath_ + "in.image";
        this.zoomInImage.id = "in";
        this.zoomOutImage = new Image();
        this.zoomOutImage.src = _MapControlsPath_ + "out.image";
        this.zoomOutImage.id = "out"
    },
    calcPosition: function() {
        return new OpenLayers.Pixel(this.map.size.w - this.zoomButtonSize.w - this.zoomButtonPadding, this.map.size.h - this.zoomButtonSize.h - this.zoomButtonPadding)
    },
    draw: function() {
        this.zoomButtonSize = new OpenLayers.Size(this.zoomInImage.width + this.zoomOutImage.width, this.zoomInImage.height);
        var a = this.calcPosition();
        this.div = OpenLayers.Util.createDiv("Zoom_Controller", a, this.zoomButtonSize, "", "absolute", "0px none", "", "1");
        this.div.style.zIndex = "750";
        this.map.events.register("zoomend", this, function() {
            this.ziDiv.style.opacity = this.zoDiv.style.opacity = "1";
            this.controlEnabled = true;
            if (this.map.getZoom() == 0) {
                $("onMapZoomOut").style.opacity = "0.3"
            } else {
                if (this.map.getZoom() == 16) {
                    $("onMapZoomIn").style.opacity = "0.3"
                } else {
                    $("onMapZoomIn").style.opacity = $("onMapZoomOut").style.opacity = "1"
                }
            }
        });
        this.ziDiv = new Element("div");
        this.ziDiv.id = "onMapZoomIn";
        this.ziDiv.appendChild(this.zoomInImage);
        this.ziDiv.style.display = "inline";
        this.ziDiv.addEventListener("click", function(b) {
            if (this.map.isValidZoomLevel(this.map.getZoom() + 1)) {
                if (this.controlEnabled) {
                    this.controlEnabled = false;
                    this.ziDiv.style.opacity = "0.3";
                    this.map.zoomIn()
                }
            }
        }.bind(this), false);
        this.zoDiv = new Element("div");
        this.zoDiv.id = "onMapZoomOut";
        this.zoDiv.appendChild(this.zoomOutImage);
        this.zoDiv.style.display = "inline";
        this.zoDiv.addEventListener("click", function(b) {
            if (this.map.isValidZoomLevel(this.map.getZoom() - 1)) {
                if (this.controlEnabled) {
                    this.controlEnabled = false;
                    this.zoDiv.style.opacity = "0.3";
                    this.map.zoomOut()
                }
            }
        }.bind(this), false);
        this.div.appendChild(this.ziDiv);
        this.div.appendChild(this.zoDiv);
        this.map.div.appendChild(this.div)
    },
    destroy: function() {
        if (this.handler) {
            this.handler.destroy()
        }
        this.handler = null
    }
});
_MapControlsCompulsory_.push(new EMS.Control.Zoom);
EMS.Control.MobileDefaults = OpenLayers.Class(OpenLayers.Control, {
    performedDrag: false,
    wheelObserver: null,
    initialize: function() {
        this.active = true;
        OpenLayers.Control.prototype.initialize.apply(this, arguments)
    },
    destroy: function() {
        if (this.handler) {
            this.handler.destroy()
        }
        this.handler = null;
        this.map.events.unregister("click", this, this.defaultClick);
        this.map.events.unregister("dblclick", this, this.defaultDblClick);
        this.map.events.unregister("mousedown", this, this.defaultMouseDown);
        this.map.events.unregister("mouseup", this, this.defaultMouseUp);
        this.map.events.unregister("mousemove", this, this.defaultMouseMove);
        this.map.events.unregister("mouseout", this, this.defaultMouseOut);
        OpenLayers.Event.stopObserving(window, "DOMMouseScroll", this.wheelObserver);
        OpenLayers.Event.stopObserving(window, "mousewheel", this.wheelObserver);
        OpenLayers.Event.stopObserving(document, "mousewheel", this.wheelObserver);
        this.wheelObserver = null;
        OpenLayers.Control.prototype.destroy.apply(this, arguments)
    },
    draw: function() {
        this.map.events.register("click", this, this.defaultClick);
        this.map.events.register("dblclick", this, this.defaultDblClick);
        this.map.events.register("mousedown", this, this.defaultMouseDown);
        this.map.events.register("mouseup", this, this.defaultMouseUp);
        this.map.events.register("mousemove", this, this.defaultMouseMove);
        this.map.events.register("mouseout", this, this.defaultMouseOut);
        this.registerWheelEvents();
        this.map.viewPortDiv.style.cursor = "url('" + EMS.Util.getImagesLocation() + "grab.cur'), move"
    },
    registerWheelEvents: function() {
        this.wheelObserver = this.onWheelEvent.bindAsEventListener(this);
        OpenLayers.Event.observe(window, "DOMMouseScroll", this.wheelObserver);
        OpenLayers.Event.observe(window, "mousewheel", this.wheelObserver);
        OpenLayers.Event.observe(document, "mousewheel", this.wheelObserver)
    },
    defaultMouseDown: function(a) {
        if (!this.active) {
            return
        }
        this.mouseDownStart = a.xy.clone();
        this.mouseDownStartTime = new Date().valueOf();
        this.doubleClickCalled = false;
        this.clickCalled = false;
        this.map.viewPortDiv.style.cursor = "url('" + EMS.Util.getImagesLocation() + "grabbing.cur'), move";
        if (!OpenLayers.Event.isLeftClick(a)) {
            return
        }
        this.mouseDragStart = a.xy.clone();
        this.performedDrag = false;
        if (a.shiftKey) {
            this.map.div.style.cursor = "crosshair";
            this.zoomBox = OpenLayers.Util.createDiv("zoomBox", this.mouseDragStart, null, null, "absolute", "2px solid red");
            this.zoomBox.style.backgroundColor = "white";
            this.zoomBox.style.filter = "alpha(opacity=50)";
            this.zoomBox.style.opacity = "0.50";
            this.zoomBox.style.fontSize = "1px";
            this.zoomBox.style.zIndex = this.map.Z_INDEX_BASE.Popup - 1;
            this.map.viewPortDiv.appendChild(this.zoomBox)
        }
        document.onselectstart = function() {
            return false
        };
        OpenLayers.Event.stop(a)
    },
    defaultClick: function(b) {
        if (!this.active) {
            return
        }
        this.clickCalled = true;
        var a = OpenLayers.Control.MouseDefaults.prototype.defaultClick.apply(this, arguments);
        if (!OpenLayers.Event.isLeftClick(b)) {
            return a
        }
        this.mouseDownStart = null;
        return a
    },
    defaultMouseMove: function(e) {
        if (!this.active) {
            return
        }
        this.mousePosition = e.xy.clone();
        if (this.mouseDragStart != null) {
            if (this.zoomBox) {
                var d = Math.abs(this.mouseDragStart.x - e.xy.x);
                var b = Math.abs(this.mouseDragStart.y - e.xy.y);
                this.zoomBox.style.width = Math.max(1, d) + "px";
                this.zoomBox.style.height = Math.max(1, b) + "px";
                if (e.xy.x < this.mouseDragStart.x) {
                    this.zoomBox.style.left = e.xy.x + "px"
                }
                if (e.xy.y < this.mouseDragStart.y) {
                    this.zoomBox.style.top = e.xy.y + "px"
                }
            } else {
                var d = this.mouseDragStart.x - e.xy.x;
                var b = this.mouseDragStart.y - e.xy.y;
                if (!this.performedDrag && (Math.abs(d) < 7 && Math.abs(b) < 7)) {
                    return
                }
                var f = this.map.getSize();
                var a = new OpenLayers.Pixel(f.w / 2 + d, f.h / 2 + b);
                var c = this.map.getLonLatFromViewPortPx(a);
                this.map.setCenter(c, null, true);
                this.mouseDragStart = e.xy.clone();
                this.map.div.style.cursor = "move";
                this.performedDrag = true
            }
        }
    },
    defaultMouseOut: function(a) {
        if (!this.active) {
            return
        }
        if (this.mouseDragStart != null && OpenLayers.Util.mouseLeft(a, this.map.div)) {
            if (this.zoomBox) {
                this.removeZoomBox()
            }
            this.mouseDragStart = null
        }
    },
    cancelRecenter: function() {
        this.doubleClickCalled = true
    },
    defaultWheelUp: function(b) {
        if (!this.active) {
            return
        }
        var d = this.map.getLonLatFromPixel(b.xy);
        var a = this.map.getCenter();
        var c = this.map.getResolution();
        var e = new OpenLayers.Pixel((d.lon - a.lon) / c, (d.lat - a.lat) / c);
        if (this.map.baseLayer != null) {
            var f = this.map.baseLayer.resolutions[this.map.getZoom() + 1]
        } else {
            var f = this.map.getResolution()
        }
        this.map.setCenter(new OpenLayers.LonLat(a.lon + (e.x * f), a.lat + (e.y * f)), this.map.getZoom() + 1)
    },
    defaultWheelDown: function(b) {
        if (!this.active) {
            return
        }
        if (this.map.getZoom() > 0) {
            var e = this.map.getLonLatFromPixel(b.xy);
            var a = this.map.getCenter();
            var d = this.map.getResolution();
            var f = new OpenLayers.Pixel((e.lon - a.lon) / d, (e.lat - a.lat) / d);
            if (this.map.baseLayer != null) {
                var c = this.map.baseLayer.resolutions[this.map.getZoom() - 1]
            } else {
                var c = this.map.getResolution()
            }
            this.map.setCenter(new OpenLayers.LonLat(e.lon - (f.x * c), e.lat - (f.y * c)), this.map.getZoom() - 1)
        }
    },
    defaultMouseUp: function(a) {
        if (!this.active) {
            return
        }
        this.map.viewPortDiv.style.cursor = "url('" + EMS.Util.getImagesLocation() + "grab.cur'), move";
        if (!OpenLayers.Event.isLeftClick(a)) {
            return
        }
        if (this.zoomBox) {
            this.zoomBoxEnd(a)
        } else {
            if (this.performedDrag) {
                this.map.setCenter(this.map.center)
            }
        }
        document.onselectstart = null;
        this.mouseDragStart = null;
        this.map.div.style.cursor = "";
        this.performedDrag = false
    },
    zoomBoxEnd: function(b) {
        if (this.mouseDragStart != null) {
            if (Math.abs(this.mouseDragStart.x - b.xy.x) > 5 || Math.abs(this.mouseDragStart.y - b.xy.y) > 5) {
                var h = this.map.getLonLatFromViewPortPx(this.mouseDragStart);
                var a = this.map.getLonLatFromViewPortPx(b.xy);
                var g = Math.max(h.lat, a.lat);
                var c = Math.min(h.lat, a.lat);
                var f = Math.min(h.lon, a.lon);
                var d = Math.max(h.lon, a.lon);
                var e = new OpenLayers.Bounds(f, c, d, g);
                this.map.zoomToExtent(e)
            } else {
                var a = this.map.getLonLatFromViewPortPx(b.xy);
                this.map.setCenter(new OpenLayers.LonLat((a.lon), (a.lat)), this.map.getZoom() + 1)
            }
            this.removeZoomBox()
        }
    },
    removeZoomBox: function() {
        this.map.viewPortDiv.removeChild(this.zoomBox);
        this.zoomBox = null
    },
    defaultDblClick: function(b) {
        if (!this.active) {
            return
        }
        this.doubleClickCalled = true;
        var a = this.map.getLonLatFromViewPortPx(b.xy);
        this.map.setCenter(a, this.map.zoom + 1);
        OpenLayers.Event.stop(b);
        return false
    },
    onWheelEvent: function(c) {
        var b = false;
        var a = OpenLayers.Event.element(c);
        while (a != null) {
            if (this.map && a == this.map.div) {
                b = true;
                break
            }
            a = a.parentNode
        }
        if (b) {
            var d = 0;
            if (!c) {
                c = window.event
            }
            if (c.wheelDelta) {
                d = c.wheelDelta / 120;
                if (window.opera) {
                    d = -d
                }
            } else {
                if (c.detail) {
                    d = -c.detail / 3
                }
            }
            if (d) {
                c.xy = this.mousePosition;
                if (d < 0) {
                    this.defaultWheelDown(c)
                } else {
                    this.defaultWheelUp(c)
                }
            }
            OpenLayers.Event.stop(c)
        }
    },
    CLASS_NAME: "EMS.Control.MobileDefaults",
    Device: "Master"
});
_MapControlsCompulsory_.push(new EMS.Control.MobileDefaults);