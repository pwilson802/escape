    // Events
    hasTouch = 'ontouchstart' in window;
    RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize';
    START_EV = hasTouch ? 'touchstart' : 'mousedown';
    MOVE_EV = hasTouch ? 'touchmove' : 'mousemove';
    END_EV = hasTouch ? 'touchend' : 'mouseup';
    CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup';
    //WHEEL_EV = vendor == 'Moz' ? 'DOMMouseScroll' : 'mousewheel';
    CLICK_TOUCH_ST = hasTouch ? 'touchstart': "click";
    

EMS.Control.IPhoneDefaults = OpenLayers.Class( OpenLayers.Control, {
     /**
         * Property: defaultOptions
         * Contains all the default values for everything. Can be overridden on initialization.
         */
        defaultOptions: {
            supportsScale3d: true,
            doubleTapZoomDelay: 200,
            webkitTransitionSpeed:5,
            webkitScaleTransitionSpeed:20,
            distanceBeforeDoingOpenLayersPan: 200,
            timeRequiredBetweenZooms: 10,
            animatedZoomTime:250,
            enableInertia: false,
            minimumInertiaSpeed: 10,
            maxInertiaSpeed: 50,
            inertiaDuration: 40,
            inertiaDamping: 0.3,
            allowFlick: false,
            flickThreshold: 40,
            flickSpeed: 100,
       },
          /**
           * Constructor: initialize
           *
           * Constructs a new instance of the <EMS.Control.IPhoneEvents> control.
           *
           */
        initialize: function(options) {
              options = options ? options : {};
              this.options = OpenLayers.Util.extend(this.defaultOptions, options);

              OpenLayers.Control.prototype.initialize.apply(this, arguments);

              // setup any defaults
              this.touchCenterX = this.touchCenterY = 0;
              this.panTotalX = 0;
              this.panTotalY = 0;
              this.active = true;
              this.dragging = false;

              this.gestureCenterX = this.gestureCenterY = null;

              // inertia
              this.xSpeed = this.ySpeed = 0;
              this.inertiaTween = null;
        },
        setupTouchCenter: function(e) {
            if (e.touches.length > 1) {
                var t1 = e.touches[0];
                var t2 = e.touches[1];

                // get the center point of the gesture by looking at the first two touch events
                var pX = t2.clientX - t1.clientX;
                var pY = t2.clientY - t1.clientY;

                // set the gesture center to half way in the middle
                this.touchCenterX = t1.clientX + 0.5 * pX;
                this.touchCenterY = t1.clientY + 0.5 * pY;
            }
        },
        touchstart: function(e){
            e.preventDefault(); 
            // cancel any active inertia
            if (this.inertiaTween) {
                this.inertiaTween.stop();
                this.inertiaTween = null;
            }

            if (!this.zooming) {
                if(e.touches && e.touches.length >= 1) {
                    var e1 = e.targetTouches[0];
                    this.touchX = e1.clientX;
                    this.touchY = e1.clientY;
                }
                if(e.touches && e.touches.length >= 2) {
                    this.setupTouchCenter(e);
                }
            }
        },

        touchmove: function(e){
            e.preventDefault(); 
            if (!this.zooming) {
                //if(e.touches.length == 1) {
                if(e.touches && e.touches.length == 1) {
                    this.smoothPan(e);
                }
                if(e.touches && e.touches.length >= 2) {
                    this.setupTouchCenter(e);
                }
            }
        },
        animateSwipe: function(speedX,speedY) {
            var tween = new OpenLayers.Tween(OpenLayers.Easing.Linear.easeOut);
            this.animationTween = tween;

            if (speedX > this.options.maxInertiaSpeed) speedX = this.options.maxInertiaSpeed;
            if (speedX < -this.options.maxInertiaSpeed) speedX = -this.options.maxInertiaSpeed;
            if (speedY > this.options.maxInertiaSpeed) speedY = this.options.maxInertiaSpeed;
            if (speedY < -this.options.maxInertiaSpeed) speedY = -this.options.maxInertiaSpeed;

            if (this.options.allowFlick) {
                if (speedX > this.options.flickThreshold) speedX = this.options.flickSpeed;
                if (speedX < -this.options.flickThreshold) speedX = -this.options.flickSpeed;
                if (speedY > this.options.flickThreshold) speedY = this.options.flickSpeed;
                if (speedY < -this.options.flickThreshold) speedY = -this.options.flickSpeed;
            }

            var from = {xDelta: this.options.inertiaDamping * speedX, yDelta: this.options.inertiaDamping * speedY};
            var to = {xDelta: 0, yDelta: 0};

            var duration = this.options.inertiaDuration;

            var iphoneControls = this;

            var callbacks = {
                eachStep: function(value) {
                    var transform = iphoneControls.map.layerContainerDiv.style.webkitTransform;
                    var dX = parseInt(transform.replace(/translate3d./,'').replace(/,.*/,''));
                    var dY = parseInt(transform.replace(/translate3d.*?,/,'').replace(/,0.*/,''));

                    if (isNaN(dX)) dX = 0;
                    if (isNaN(dY)) dY = 0;

                    dX += value.xDelta;
                    dY += value.yDelta;

                    iphoneControls.panTotalX = -1.0 * dX;
                    iphoneControls.panTotalY = -1.0 * dY;

                    iphoneControls.map.layerContainerDiv.style.webkitTransform = 'translate3d(' + dX + 'px,' + dY + 'px,0)';

                    modX = dX% 20 - 20;
                    modY = dY% 20 - 20;
                    if (iphoneControls.map.webkitBackground) {
                        iphoneControls.map.webkitBackground.style.webkitTransform = 'translate3d(' + modX + 'px,' + modY + 'px,0)';
                    }
                },
                done: function() {
                    iphoneControls.realPan();
                    iphoneControls.xSpeed = iphoneControls.ySpeed = 0;
                    iphoneControls.inertiaTween = null;
                }
            }
            tween.start(from, to, duration, {callbacks: callbacks});
            this.inertiaTween = tween;
        },
        touchend: function(e){
            e.preventDefault(); 
            if (!this.zooming) {
                var handled = false;

                if ( this.options.enableInertia &&
                    (Math.abs(this.xSpeed) > this.options.minimumInertiaSpeed || Math.abs(this.ySpeed) > this.options.minimumInertiaSpeed)) {
                    this.animateSwipe(-1.0 * this.xSpeed,-1.0 * this.ySpeed);
                    handled = true;
                }

                if (!handled) {
                   var now = new Date().getTime();
                   var lastTouch = this.lastTouch || now + 1;
                   var delta = now - lastTouch;
                   if(delta < this.options.doubleTapZoomDelay && delta > 1){
                    var e1 = e.changedTouches[0];
                    this.touchX = e1.clientX;
                    this.touchY = e1.clientY;
                        this.animateZoom(this.touchX,this.touchY);
                   }
                }

                this.touchCenterX = this.touchCenterY = null;

               this.lastTouch = now;
            }
        },
        zoomAndResetPan:function() {
             this.map.zoomIn();
             this.realPan();
        },
        animateZoom: function(touchX,touchY) {

            var resolution = this.map.getResolution();
            var nextResolution = this.map.getResolutionForZoom(map.getZoom() + 1);

            if (nextResolution != resolution) {
                this.dragging = true;

                var xOffset = touchX;
                var yOffset = touchY;

                if (!isNaN(this.panTotalX)) {
                 xOffset += this.panTotalX;
                 yOffset += this.panTotalY;
                }

                // adjust for the case where ios patch isn't being used to conver to full webkit style properties.
                var dX = parseInt(this.map.layerContainerDiv.style.left);
                var dY = parseInt(this.map.layerContainerDiv.style.top);
                xOffset -= dX;
                yOffset -= dY;

                this.realPan();

                //this.options.animatedZoomTime = 3000;
                // calculate how far away the gesture center is from the middle of the map (used to re-align after zoom)
                var center = this.map.getCenter();
                var mouse = this.map.getLonLatFromViewPortPx(new OpenLayers.Pixel(touchX,touchY));
                var mouseToCenter = new OpenLayers.Pixel((mouse.lon - center.lon) / resolution,
                                                         (mouse.lat - center.lat) / resolution);


                var zoomAmount = resolution / nextResolution;

                this.map.layerContainerDiv.style['-webkit-transition'] = '-webkit-transform ' + this.options.animatedZoomTime + 'ms linear';
                this.map.layerContainerDiv.style['-webkit-transform-origin'] = '' + xOffset + 'px ' + yOffset + 'px 0';

                if (this.options.supportsScale3d) {
                        this.map.layerContainerDiv.style['-webkit-transform'] = 'scale3d(' + zoomAmount + ',' + zoomAmount + ',1)';
                } else {
                    this.map.layerContainerDiv.style['-webkit-transform'] = 'scale(' + zoomAmount + ')';
                }

                var iphoneControls = this;
                setTimeout(function(){
                    // re-align the map based on the previously  calculated distance from center
                    this.map.setCenter(new OpenLayers.LonLat(mouse.lon - (mouseToCenter.x * nextResolution),
                                          mouse.lat - (mouseToCenter.y * nextResolution)));

                    iphoneControls.zoomAndResetPan();
                    iphoneControls.dragging = false;
                },this.options.animatedZoomTime + 5);

            }
        },

        realPan:function() {
          var panDiv = this.map.layerContainerDiv;

          this.map.layerContainerDiv.style['-webkit-transform-origin'] = '';
          panDiv.style['-webkit-transition'] = '';
          panDiv.style['-webkit-transform'] = '';

          this.map.pan(this.panTotalX,this.panTotalY, {animate:false});
          this.panTotalX = this.panTotalY = 0;
        },

        smoothPan:function(e) {
            if (this.dragging || this.zooming) {
             return;
            }

            var e1 = e.targetTouches[0];
            if (e1 == undefined) {
             return;
            }

            this.dragging = true;

            var deltaTouchX = (this.touchX - e1.clientX);
            var deltaYouchY = (this.touchY - e1.clientY);
            this.touchX = e1.clientX;
            this.touchY = e1.clientY;

            this.panTotalX += deltaTouchX;
            this.panTotalY += deltaYouchY;

            // for inertia
            this.xSpeed = deltaTouchX;
            this.ySpeed = deltaYouchY;

            var panDiv = this.map.layerContainerDiv;

            if (Math.abs(this.panTotalX) > this.options.distanceBeforeDoingOpenLayersPan || Math.abs(this.panTotalY) > this.options.distanceBeforeDoingOpenLayersPan) {
                this.realPan();
            } else {
                panDiv.style['-webkit-transform'] = 'translate3d(' + -1.0 * this.panTotalX + 'px,' + -1.0 * this.panTotalY + 'px,0)';
            }

            var iphoneControls = this;
            setTimeout(function(){iphoneControls.dragging = false;},this.options.webkitTransitionSpeed + 5);
        },

        gesturestart: function(e) {
            e.preventDefault();

            // pan to ensure everything is zero'd and ready for scale calculations
            this.realPan();

            return false;
        },
        gesturechange: function(e){
            e.preventDefault();

            // we lock the gesture center as early as possible then set to null once it's finished
            if (this.gestureCenterX == null && this.touchCenterX != null) {
                this.zooming = true;

                this.gestureCenterX = this.touchCenterX;
                this.gestureCenterY = this.touchCenterY;

                var mouse = this.map.getLonLatFromViewPortPx(new OpenLayers.Pixel(this.gestureCenterX,this.gestureCenterY));

                this.zooming = true;
            }

            // only scale f we were able to lock the center point.
            if (this.gestureCenterX != null) {
                var scale = e.scale;

                var xOffset = this.gestureCenterX;
                var yOffset = this.gestureCenterY;

                // adjust for the case where ios patch isn't being used to conver to full webkit style properties.
                var dX = parseInt(this.map.layerContainerDiv.style.left);
                var dY = parseInt(this.map.layerContainerDiv.style.top);
                xOffset -= dX;
                yOffset -= dY;

                this.map.layerContainerDiv.style['-webkit-transform-origin'] = '' + xOffset + 'px ' + yOffset + 'px';
                this.map.layerContainerDiv.style['-webkit-transition'] = '-webkit-transform ' + this.options.webkitScaleTransitionSpeed + 'ms linear';

                this.map.layerContainerDiv.style['-webkit-transform'] = 'scale3d(' + scale + ',' + scale + ',1)';

            }

            return false;
        },
        gestureend: function(e){
            e.preventDefault();

            // zoom (but don't do it twice quickly... we get multiple of these events in a row)
            var now = new Date().getTime();
            var lastZoom = this.lastZoom || now + 1;
            if (lastZoom - now < this.options.timeRequiredBetweenZooms && this.gestureCenterX != null) {
                var scale = e.scale;

                // calculate next zoom level
                var resolution = this.map.getResolution();
                var desiredRes = resolution / scale;
                var newZoom = map.getZoomForResolution(desiredRes);

                // calculate how far away the gesture center is from the middle of the map (used later to re-align after zoom)
                var center = this.map.getCenter();
                var mouse = this.map.getLonLatFromViewPortPx(new OpenLayers.Pixel(this.gestureCenterX,this.gestureCenterY));
                var mouseToCenter = new OpenLayers.Pixel((mouse.lon - center.lon) / resolution,
                                                         (mouse.lat - center.lat) / resolution);


                // zoom to the closest integer scale
                this.map.zoomTo(newZoom);

                // re-align the map based on the previously  calculated distance from center
                var nextResolution = this.map.getResolution();
                this.map.setCenter(new OpenLayers.LonLat(mouse.lon - (mouseToCenter.x * nextResolution),
                                                      mouse.lat - (mouseToCenter.y * nextResolution)));


                this.realPan();

                var iphoneControls = this;
                setTimeout(function(){
                    iphoneControls.zooming = false;
                },20);
            }

            this.gestureCenterX = null;

            return false;
        },

       /**
           * APIMethod: draw
           */
        draw: function() {
            // note: we intentionally don't register these using openlayers as it does not have support for these events at this time.
            // note2: the with context pattern used here is important as it ensures the events are triggered with the correct context
            //           (the controls context rather than that of the mapdiv)
            var iphoneControls = this;
            // touch events
            this.map.div.addEventListener(START_EV, function(e) { with(iphoneControls) { return iphoneControls.touchstart(e);} }, false);
            this.map.div.addEventListener(MOVE_EV, function(e) { with(iphoneControls) { return iphoneControls.touchmove(e);} }, false);
            this.map.div.addEventListener(END_EV, function(e) { with(iphoneControls) { return iphoneControls.touchend(e);} }, false);
            // multi touch events
            this.map.div.addEventListener('gesturestart', function(e) { with(iphoneControls) { return iphoneControls.gesturestart(e);} }, false);
            this.map.div.addEventListener('gesturechange', function(e) { with(iphoneControls) { return iphoneControls.gesturechange(e);} }, false);
            this.map.div.addEventListener('gestureend', function(e) { with(iphoneControls) { return iphoneControls.gestureend(e);} }, false);
            this.map.resetPan = function(){with(iphoneControls){iphoneControls.realPan();}};
        },

        /**
           * APIMethod: destroy
           * Constructs contents of the control.
           *
           * Returns:
           * A reference to a div that represents this control.
           */
          destroy: function() {

              if (this.handler) {
                  this.handler.destroy();
              }
              this.handler = null;
        },
        CLASS_NAME: "EMS.Control.IPhoneEvents"
});
