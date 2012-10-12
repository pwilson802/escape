Ext.define('escape.utils.Img', {
    singleton: true,
    // see if the network level and phone supports the use of a retina img
    retinaAvailable: function() {
        // is the user on IOS
        if (window.device) {
            if (device.platform == 'iOS' || device.platform == 'iPhone' || device.platform == 'iPad') {
                // does that iOS device support retina
                if (Number(device.version) >= 4) {
                    return true;
                }
            }
            return false;
        }
        return false;
    },
    useRetinaImg: function() {
        if (this.retinaAvailable()) {
            //do we have the connection required to use a retina image
            var connectionType = Ext.device.Connection.getType();
            if (connectionType == 'wifi' || connectionType == 'ethernet' || connectionType == '4g') {
                return true;
            }
        }
        return false;
    },
    // get the required styles for a retina img
    getImgStyle: function(width, height) {
        if (this.useRetinaImg) {
            return '-webkit-background-size: ' + width + 'px ' + height + 'px;';
        }
        return '';
    },
    // define an image path
    getImgPath: function(url, width, height) {
        if (this.useRetinaImg) {
            return url.split('.')[0] + '@2x.' + url.split('.')[1];
        }
        return url;
    },
    // get an img div
    getImgDiv: function(url, width, height, isLocal) {
        var imgScr = url;
        if (isLocal) {
            imgScr = this.getImgPath(url, width, height);
        }
        return '<div class="imgContainer" style="background-image:url(' + imgScr + '); background-repeat:no-repeat; ' + this.getImgStyle(width, height) + ' width:' + width + 'px; height:' + height + 'px; "></div>';
    },
    // request an image at a particular width
    getResizeURL: function(url, width) {
        // make sure the image is from our server
        if (url.indexOf(AppSettings.imageResizing.fromURL) != -1) {
            var imagePath = url.split(AppSettings.imageResizing.fromURL)[1];
            var ratio = 1;
            if (window.devicePixelRatio) {
                ratio = window.devicePixelRatio;
            }
            // scale the width to account for pixel density
            var realWidth = width * ratio;
            return AppSettings.imageResizing.resizeURL + imagePath+'?width='+realWidth;
        }
        return url;
    }
});