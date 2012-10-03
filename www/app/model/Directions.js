Ext.define("escape.model.Directions", {
    extend: 'Ext.data.Model',
    config: {
        fields: [],
        proxy: {
            type: 'jsonp',
            url: 'http://open.mapquestapi.com/directions/v1/route',
            extraParams: {
                outFormat: 'json',
                from: 'Sydney Australia',
                to: 'Manly',
                routeType: 'shortest'
            },
            reader: {
                type: 'json'
            }
        }
    }
});
//http://open.mapquestapi.com/directions/v1/route?outFormat=json&from=40.037661,-76.305977&to=39.962532,-76.728099&callback=renderNarrative
//ym4xetux9t3t9xw52da4xdun