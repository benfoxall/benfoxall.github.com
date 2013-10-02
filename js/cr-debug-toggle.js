define([], function(){
	var isDebug = window.location.search === '?cr-debug';
	return function(element){
    var a = document.createElement('a');
    a.className = 'btn btn-primary btn-lg';
		a.href = isDebug ? '' : '/';
		a.search = isDebug ? '' : '?cr-debug';
		a.innerHTML = isDebug ? 'hide loading' : 'show script loading';
    element.appendChild(a);
	}
})
