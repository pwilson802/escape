/**
 *  {@link Ext.ux.slidenavigation.View} is a subclass of {@link Ext.Container}
 *  that provides a sliding main view with an underlying navigation list.  The
 *  concept was inspired by Facebook's mobile app.
 *
 *  @author Weston Nielson <wnielson@github>
 */
Ext.define('Ext.ux.slidenavigation.View', {
    extend: 'Ext.Container',

    requires: ['escape.utils.AppVars', 'Ext.Button', 'Ext.Container', 'Ext.Function', 'Ext.ModelManager', 'Ext.Toolbar', 'Ext.data.Model', 'Ext.data.Store', 'Ext.dataview.List', 'Ext.util.DelayedTask'],

    xtype: 'slidenavigationview',

    config: {
        zIndex: 1,
        /**
         * @cfg {Object} list Configuration for the navigation list
         */
        list: {
            width: 250,
            maxDrag: null,
            itemTpl: '{title}',
            grouped: true
        },

        /**
         * @cfg {Object} container Configuration for the container
         */
        container: {},

        /**
         * @cfg {Array} items An array of items to put into the navigation list.
         * The items can either be Ext components or special objects with a "handler"
         * key, which should be a function to execute when selected.
         */
        items: [],

        /**
         * @cfg {Object} defaults An object of default values to apply to any Ext
         * components created from those listed in ``items``.
         */
        defaults: {
            layout: 'card'
        },

        /**
         * @cfg {String} slideSelector Class selector of object (or parent)
         * of which dragging should be allowed.  Defaults to the entire container.
         * For example, this could be set to something like 'x-toolbar' to restrict
         * dragging only to a toolbar.
         */
        slideSelector: '',

        /**
         * @cfg {Integer} slideDuration Number of miliseconds to animate the sliding
         * of the container when "flicked".  By default the animation is disable on
         * Android.
         */
        slideDuration: 200,
        //Ext.os.is.Android ? 0 : 200,
        /**
         * @cfg {Integer} selectSlideDuration Number of miliseconds to animate the sliding
         * of the container when list item is selected (if closeOnSelect = true). The default
         * value here of 300 gives a much nicer feel.  By default the animation is disable on
         * Android.
         */
        selectSlideDuration: 300,
        // Ext.os.is.Android ? 0 : 300,
        /**
         * @cfg {Boolean} closeOnSelect Whether or not to automatically close the container
         * when an item in the list is selected.  Default is true.
         */
        closeOnSelect: true
    },

    initConfig: function() {
        var me = this;
        me._indexCount = 0;
        /**
         *  Create the store.
         */
        me.store = Ext.create('Ext.data.Store', {
            model: me.getModel(),
            sorters: 'group',
            groupField: 'group'
        });

        /**
         *  Add the items into the list.
         */
        me.addItems(me.config.items || []);
        delete me.config.items;

        me.callParent(arguments);

        /**
         *  This stores the instances of the components created.
         *  TODO: Support 'autoDestroy'.
         *  @private
         */
        me._cache = {};

        /**
         *  Default config values used for creating a slideButton.
         */
        me.slideButtonDefaults = {
            xtype: 'button',
            iconMask: true,
            iconCls: 'more',
            name: 'slidebutton',
            listeners: {
                release: me.toggleContainer,
                scope: me
            }
            /**
             *  To add the button into a toolbar, you can add the following
             *  to any item in your navigation list.
             */
            //selector: ['toolbar']
        };

        //me.config = Ext.merge({}, me.config, config || {});
        //return me.callParent(arguments);
    },

    initialize: function() {
        this.callParent();

        this.addCls('x-slidenavigation');

        this.list = this.createNavigationList();
        this.container = this.createContainer();

        this.add([
        this.list, this.container]);

        // TODO: Make this optional, perhaps by defining
        // "selected: true" in the items list
        this.list.select(0);
    },

    /**
     *  Adds an array of items (or a single item) into the list.
     */
    addItems: function(items) {
        var me = this;
        items = Ext.isArray(items) ? items : [items];

        Ext.each(items, function(item, index) {
            if (!Ext.isDefined(item.index)) {
                item.index = me._indexCount;
                me._indexCount++;
            }
            me.store.add(item);
        });
    },

    /**
     *  Creates a button that can toggle the navigation menu.  For an example
     *  config, see ``slideButtonDefaults``.
     */
    createSlideButton: function(el, config) {
        var me = this,
            parent = el.down(config.selector);

        if (parent) {
            return parent.add(Ext.merge(me.slideButtonDefaults, config));
        }

        return false;
    },
    /**
     * Called when an item in the list is tapped.
     */
    onTap: function(list, item, eOpts) {

        if (item == list.getSelection()[0].data.index) {
            // if a user tap the currently selected menu item then close the menu
            if (this.config.closeOnSelect) {
                var task = new Ext.util.DelayedTask(function() {
                    this.closeContainer(this.config.selectSlideDuration);
                }, this);

                task.delay(100);
            }
        }
    },
    /**
     * Called when an item in the list is tapped.
     */
    onSelect: function(list, item, eOpts) {
        var me = this,
            store = list.getStore(),
            index = item.raw.index;
/**
        if (me._cache[index] == undefined) {
            //container = this.down('container[cls="x-slidenavigation-container"]');
            // If the object has a handler defined, then we don't need to
            // create an Ext object
            if (Ext.isFunction(item.raw.handler)) {
                me._cache[index] = item.raw.handler;
            } else {
                me._cache[index] = container.add(Ext.merge(me.config.defaults, item.raw));

                // Add a button for controlling the slide, if desired
                if ((item.raw.slideButton || false)) {
                    me.createSlideButton(me._cache[index], item.raw.slideButton);
                }
            }
        }
        **/

        this.changePage(index, item);
    },
    /**
     * called to select a page
     **/
    select: function(sectionId, options) {
        var menuItems = this.store.data.items;
        var found = false;
        var item;
        var i;
        // loop over pages
        for (i = 0; i < menuItems.length; i++) {
            item = menuItems[i];
            if (sectionId == item.raw.id) {
                found = true;
                break;
            }
        }
        // check to see if a page was found
        if (found) {
            this.list.select(i);
            // this.changePage(i, item, options);
        }
    },
    changePage: function(index, item, options) {
        var container = this.container;
        this.config.defaults.firstPage = {
            xtype: 'homePage'
        };
        var section = container.add(Ext.merge(this.config.defaults, item.raw, options));
       
        escape.utils.AppVars.currentSection = section;
        container.setActiveItem(section);
        if (this.config.closeOnSelect) {
            var task = new Ext.util.DelayedTask(function() {
                this.closeContainer(this.config.selectSlideDuration);
            }, this);

            task.delay(100);
        }
    },
    onContainerDrag: function(draggable, e, offset, eOpts) {
        if (offset.x < 1) {
            this.setClosed(true);
        } else {
            this.setClosed(false);
        }
    },

    onContainerDragstart: function(draggable, e, offset, eOpts) {
        if (this.config.slideSelector == false) {
            return false;
        }

        if (this.config.slideSelector) {
            node = e.target;
            while (node = node.parentNode) {
                if (node.className && node.className.indexOf(this.config.slideSelector) > -1) {
                    return true;
                }
            }
            return false;
        }
        return false;
    },

    onContainerDragend: function(draggable, e, eOpts) {
        var velocity = Math.abs(e.deltaX / e.deltaTime),
            direction = (e.deltaX > 0) ? "right" : "left",
            offset = Ext.clone(draggable.offset),
            threshold = parseInt(this.config.list.width * .70);

        switch (direction) {
        case "right":
            offset.x = (velocity > 0.75 || offset.x > threshold) ? this.config.list.width : 0;
            break;
        case "left":
            offset.x = (velocity > 0.75 || offset.x < threshold) ? 0 : this.config.list.width;
            break;
        }

        this.moveContainer(offset.x);
    },

    /**
     * Registers the model with Ext.ModelManager, if it hasn't been
     * already, and returns the name of the model for use in the store.
     */
    getModel: function() {
        model = 'SlideNavigationPanelItem';

        if (!Ext.ModelManager.get(model)) {
            Ext.define(model, {
                extend: 'Ext.data.Model',
                config: {
                    idProperty: 'index',
                    fields: ['index', 'title', 'group']
                }
            });
        }

        return model;
    },

    /**
     *  Closes the container.  See ``moveContainer`` for more details.
     */
    closeContainer: function(duration) {
        duration = duration || this.config.slideDuration;
        this.moveContainer(0, duration);
    },

    /**
     *  Opens the container.  See ``moveContainer`` for more details.
     */
    openContainer: function(duration) {
        duration = duration || this.config.slideDuration;
        this.container.addCls('open');
        this.moveContainer(this.config.list.width, duration);
    },

    toggleContainer: function(duration) {
        duration = Ext.isNumber(duration) ? duration : this.config.slideDuration;
        if (this.isClosed()) {
            this.openContainer(duration);
        } else {
            this.closeContainer(duration);
        }
    },

    /**
     *  Moves the container to a specified ``offsetX`` pixels.  Positive
     *  integer values move the container that many pixels from the left edge
     *  of the window.  If ``duration`` is provided, it should be an integer
     *  number of milliseconds to animate the slide effect.  If no duration is
     *  provided, the default in ``config.slideDuration`` is used.
     */
    moveContainer: function(offsetX, duration) {
        duration = duration || this.config.slideDuration;
        draggable = this.container.draggableBehavior.draggable;
        draggable.setOffset(offsetX, 0, {
            duration: duration
        });
    },

    /**
     *  Returns true if the container is closed, false otherwise.  This is a
     *  computed value based off the current offset position of the container.
     */
    isClosed: function() {
        return (this.container.draggableBehavior.draggable.offset.x == 0);
    },

    /**
     *  Sets the container as being closed.  This shouldn't ever be called
     *  directly as it is automatically called by the ``translatable``
     *  "animationend" event after the container has stopped moving.  All this
     *  really does is set the CSS class for the container.
     */
    setClosed: function(closed) {
        /**
         *  TODO: Consider some way to mask/disable certain elements when
         *        the container is opened.  The code commented-out below
         *        'works' but I think there is a better way to approach this.
         */

        if (closed) {
            this.container.removeCls('open');

/*
            Ext.each(this.container.getActiveItem().getItems().items, function(item) {
                if (item.maskOnSlide) {
                    item.setMasked(false);
                }
            });
            */
        } else {
            this.container.addCls('open');
/*
            Ext.each(this.container.getActiveItem().getItems().items, function(item) {
                if (item.maskOnSlide) {
                    item.setMasked(true);
                }
            });
            */
        }
    },

    /**
     * Generates a new Ext.dataview.List object to be used for displaying
     * the navigation items.
     */
    createNavigationList: function(store) {
        return Ext.create('Ext.dataview.List', Ext.merge({}, this.config.list, {
            store: this.store,
            docked: 'left',
            cls: 'x-slidenavigation-list',
            style: 'position: absolute; top: 0; left: 0; height: 100%;' + 'width: 100% !important; z-index: 2',
            listeners: {
                select: this.onSelect,
                itemtap: this.onTap,
                scope: this
            }
        }));
    },

    /**
     *  Generates and returns the Ext.Container to be used for displaying
     *  content.  This is the "slideable" container that is positioned above
     *  the navigation list.
     */
    createContainer: function() {
        return Ext.create('Ext.Container', Ext.merge({}, this.config.container, {
            docked: 'left',
            cls: 'x-slidenavigation-container',
            style: 'width: 100%; height: 100%; position: absolute; opacity: 1; z-index: 5',
            layout: 'card',
            autoDestroy: true,
            draggable: {
                direction: 'horizontal',
                constraint: {
                    min: {
                        x: 0,
                        y: 0
                    },
                    max: {
                        x: this.config.list.maxDrag || Math.max(screen.width, screen.height),
                        y: 0
                    }
                },
                listeners: {
                    dragstart: {
                        fn: this.onContainerDragstart,
                        order: 'before',
                        scope: this
                    },
                    drag: Ext.Function.createThrottled(this.onContainerDrag, 100, this),
                    dragend: this.onContainerDragend,
                    scope: this
                },
                translatable: {
                    listeners: {
                        animationend: function(translatable, b, c) {
                            // Remove the class when the animation is finished, but only
                            // if we're "closed"
/**
                            var activeItem = this.container.getActiveItem();
                            if (activeItem.viewOpened) {
                                //activeItem.viewOpened();
                            }
                            **/
                            if (this.isClosed()) {
                                this.fireEvent('menuClosed');
                            }

                            this.setClosed(this.isClosed());
                        },
                        scope: this // The "x-slidenavigation" container
                    }
                }
            },
            listeners: {
                activeitemchange: function(view, newCard, oldCard) {

                   if (oldCard) {
                        var task = new Ext.util.DelayedTask(function() {
                            this.remove(oldCard, true);
                        }, this);
                        task.delay(300);
                    }

                }
            }
        }));
    }
});