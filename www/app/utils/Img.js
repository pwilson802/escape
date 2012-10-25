Ext.define('escape.utils.Img', {
    singleton: true,
    // see if the network level and phone supports the use of a retina img
    retinaAvailable: function() {
        // is the user on IOS
        if (window.devicePixelRatio) {
            if (window.devicePixelRatio > 1) {
                return true;
            } else {
                return false;
            }
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
        var allowedDomain = false;
        var imagePath = '';
        for (var i = AppSettings.imageResizing.fromURLs.length - 1; i >= 0; i--) {
            fromURL = AppSettings.imageResizing.fromURLs[i];
            if (url.indexOf(fromURL.url) != -1) {
                if (fromURL.remote) {
                    imagePath = '/remote/' + fromURL.url + url.split(fromURL.url)[1];
                } else {
                    imagePath = url.split(fromURL.url)[1];
                }
                allowedDomain = true;
                break;
            }

        }
        if (allowedDomain) {
            var ratio = 1;
            var connectionType = Ext.device.Connection.getType();
            if (window.devicePixelRatio) {
                ratio = window.devicePixelRatio;
            }
            // don't request high def images if on a low connection
            if (connectionType == 'CELL_2G') {
                ratio = 1;
            }
            //ratio = 0.5;
            // scale the width to account for pixel density
            var realWidth = Math.round(width * ratio);
            var returnURL = AppSettings.imageResizing.resizeURL + imagePath + '?width=' + realWidth;
            return returnURL;
        }
        return url;
    }
});