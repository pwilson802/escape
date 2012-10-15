String.prototype.toProperCase = function() {
    return this.toLowerCase().replace(/^(.)|\s(.)/g, function($1) {
        return $1.toUpperCase();
    });
};
String.prototype.removePuralS = function() {
	return this.replace(/s\b/ig, '');
};



function MathExt() {
}

MathExt.prototype.roundNumber = function(num, dec) {
	var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
	return result;
}