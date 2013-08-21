/*

___ <Triple Underscore>

like underscore, but with fewer things and more underscores

*/
;(function(global){

	var ___ = function(obj){
		if(!(this instanceof ___)) return new ___(obj);
		this._obj = obj;
	}

	___.prototype.each = function(fn){
		for (var i = 0; i < this._obj.length; i++) {
			fn(this._obj[i]);
		}
	};

	___.prototype.map = function(fn){
		var mapped = [];
		this.each(function(i){
			mapped.push(fn(i))
		});
		return mapped;
	};

	___.prototype.any = function(fn){
		var yes = false
		this.each(function(i){
			if(!yes&&fn(i)) yes = true;
		});
		return yes;
	};

	___.prototype.contains = function(val){
		return this.any(function(n){return n === val});
	};

	___.prototype.first = function(){
		return this._obj[0];
	};


	// set to global scope
	global.___ = ___;

})(this);