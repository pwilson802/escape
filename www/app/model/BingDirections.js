Ext.define("escape.model.BingDirections", {
    extend: 'Ext.data.Model',
    config: {
        fields: [],
        proxy: {
            type: 'ajax',
            url: 'http://dev.virtualearth.net/REST/v1/Routes',
            extraParams: {
                'wp.0': 'Sydney',
                'wp.1': 'Manly',
                routePathOutput: 'Points',
                output: 'json',
                key:'Al4Lpuxeh5gEXn5qMCuA6thYde_HfPSh6LYjXKif__5rASQp07kfZjioy5d1Te_Y'
            },
            reader: {
                type: 'json'
            }
        }
    }
});
//var routeRequest = "http://dev.virtualearth.net/REST/v1/Routes?wp.0=" + document.getElementById('txtStart').value + "&wp.1=" + document.getElementById('txtEnd').value + "&routePathOutput=Points&output=json&jsonp=RouteCallback&key=" + credentials;
//http://dev.virtualearth.net/REST/v1/Routes?wp.0=Sydney&wp.1=Manly&routePathOutput=Points&output=json&jsonp=RouteCallback&key=Al4Lpuxeh5gEXn5qMCuA6thYde_HfPSh6LYjXKif__5rASQp07kfZjioy5d1Te_Y