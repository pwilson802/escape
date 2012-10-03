Ext.define("escape.view.ui.SortableList", {
    extend: 'Ext.List',
    xtype: 'sortableList',
    config: {
        cls: 'sortableList',
        draggingItem: null,
        listeners: {
            itemtouchstart: 'startDrag',
            itemtouchend: 'endDrag',
            itemtouchmovie: 'dragging'
        }
    },
    startDrag: function(list, index, element, record) {
        var listElements = Ext.DomQuery.select('#' + this.getId() + ' .x-list-item');
        var topBoundry = 0;
        var bottomBoundry = 0;
        for (var i = listElements.length - 1; i >= 0; i--) {
            var rowElement = Ext.get(listElements[i]);
            if (i <= index) {
                topBoundry -= rowElement.getHeight();
            }
            if (i >= index) {
                bottomBoundry += rowElement.getHeight();
            }
        }
        // Create the element you wish to drag
        // var elHTML = Ext.get(element.getHtml());
        //var draggingEl = Ext.get(Ext.DomQuery.select('#' + this.getId())[0]).appendChild(elHTML);
        var d = new Ext.util.Draggable({
            element: element,
            direction: 'vertical'
        });


        d.setExtraConstraint({
            min: {
                x: 0,
                y: topBoundry
            },
            max: {
                x: 0,
                y: bottomBoundry
            }
        });
        element.setStyle('z-index', 10);
        this.setDraggingItem(d);
    },
    endDrag: function(list, index, element, record) {
        // get the dragging y position
        var yOffset = element.getY();
        // destory dragging
        element.setStyle('z-index', 0);
        this.getDraggingItem().disable();
        this.getDraggingItem().destroy();
        element.removeCls('x-dragging');
        element.removeCls('x-item-selected');
        element.removeCls('x-draggable');
        element.removeCls('x-item-pressed');
        // get items new position and set it
        var order = this.getOrderByY(list, index, element, yOffset);
        record.set('order', order);
        // reset the order positions to all be even
         var items = this.getStore().getData().items.concat([]);
        var orderIndex = 0;
        for (var i = 0; i < items.length; i++) {
            var rowItem = items[i];
            rowItem.set('order', orderIndex);
            orderIndex += 2;
        }
        // force the list to refresh
        this.refresh();
    },
    dragging: function() {
    },
    getOrderByY: function(list, index, element, yPosition) {
        var store = list.getStore();
        var data = this.getStore().getData();
        var listElements = Ext.DomQuery.select('#' + this.getId() + ' .x-list-item');
        var order = index;
        for (var i = 0; i < listElements.length; i++) {
            var higherElementY = Ext.get(listElements[i]).getY();
            var lowerElementY = higherElementY;
            var lowerElementHeight = Ext.get(listElements[i]).getHeight();
            if (i < listElements.length - 1) {
                lowerElementY = Ext.get(listElements[i + 1]).getY();
                lowerElementHeight = Ext.get(listElements[i + 1]).getHeight();
            }
            if (yPosition <= higherElementY) {
                order = data.items[i].get('order') - 1;
                break;
            } else if (yPosition < lowerElementY) {
                // The position is lower the lower element
                order = data.items[i].get('order') + 1;
                break;
            }

            if (i == listElements.length - 1 && yPosition > lowerElementY) {
                // We are checking the last node and the position is lower than it. Make the item the last item in the list
                order = data.items[i].get('order') + 1;
            }
        }
        return order;
    }


});