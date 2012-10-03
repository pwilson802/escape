Ext.define('escape.utils.Translator', {
	singleton: true,
	// Performs tranlations on the strings
	// Placeholder fuction
	translate: function(str) {
		return str;
	},
	// This function will replace {1} in the message with the specified variable
	translate1: function(message, variable) {
		var translated = this.translate(message);
		return translated.replace("{1}", variable);
	},
	// This function will replace {1} and {2} in the message with the specified variables
	translate2: function(message, variable1, variable2) {
		var translated = this.translate1(message, variable1);
		return translated.replace("{2}", variable2);
	},
	// This function will replace {1} and {2} and {3} in the message with the specified variables
	translate3: function(message, variable1, variable2, variable3) {
		var translated = this.translate2(message, variable1, variable2);
		return translated.replace("{3}", variable3);
	}
});