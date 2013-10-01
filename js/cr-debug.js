define([], function(){
	return function(element){
		if(window.location.search === '?cr-debug'){
			require(['ko'], function(ko){
				require.loaded_modules = ko.observableArray(require.loaded_modules)

				ko.applyBindings({
					modules:require.loaded_modules
				}, element)

			})
		}
	}
})