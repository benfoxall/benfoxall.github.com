define(['jquery'],function($){

	// helper function to persist the 
	// changes to localStorage and
	function storageProxy(key, updateFn){
		var store = window.localStorage;

		// udpate if the key is already set
		var initial = store.getItem(key);
		if(initial) updateFn(initial)

		// listen for updates from other windows
		window.addEventListener("storage", function(e){
			if(e.key == key) updateFn(e.newValue);
		}, false);
		
		// return a handle to update for this window
		return function(obj){
			store.setItem(key,JSON.stringify(obj));
			updateFn(obj);
		}
	};


	/*
		DEMO 1 - postMessage
	*/
	var demo1 = function(){
		var selectorWindow;

		// listen for text changes
		document.onselectionchange = function(e){
			if(selectorWindow){
				selectorWindow.postMessage(document.getSelection().toString(),'*');
			}
		}

		// fire the window to open
		return function(e){
			e.preventDefault();
			selectorWindow = window.open('/pink.html','','width=200');
		}

	}();

	/*
		DEMO 2 - Storage Events
	*/
	var demo2 = function(){

		var el = this;

		var bgSetter = storageProxy('demo', function(data){
			var hue = parseInt(data,10) % 256;
			el.style.backgroundColor = 'hsl('+hue+',70%, 80%)';
		});

		$(el).on('mousemove', function(e){
			bgSetter(e.pageX);
		});

	};


	// link up the demos to the UI
	return function(el){

		$(el).on('click', '[href=#demo1]', demo1);

		$('#demo2').each(demo2);

	}
});