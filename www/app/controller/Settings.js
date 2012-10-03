Ext.define('escape.controller.Settings', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            settingsPage: 'settingsPage'
        },
        control: {
            'settingsPage list[action=selectLang]': {
                select: 'languageSelected'
            }


        }
    },

    // a language has been selected
    languageSelected: function(list, record) {
        if (escape.model.LanguageContent.getLangCode() != record.data.value) {
            escape.model.LanguageContent.setLangCode(record.data.value);
            this.getSettingsPage().openView();
        }

    }

});