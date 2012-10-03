Ext.define("escape.view.ui.WeatherBtn", {
    extend: 'Ext.Button',
    xtype: 'weatherBtn',
    config: {
        cls: 'weatherBtn',
        action: 'showWeather',
        top: 0,
        right: 0,
        width: 65,
        height: 90,
        html:'26'
    }
});