/* require.js setup */
require.config(
	document.location.hostname == 'localhost' ?
	{
		// development
		// cache bust in development
		urlArgs:"dev="+ +new Date(),
		paths: {
			ko: 'lib/ko'
		},
    shim: {
			d3: { exports: 'd3' },
			THREE: { exports: 'THREE' }
		}
	} :
	{
		// production
		paths: {
		// use cdn jq
			"jquery": "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min",
			"d3": "https://d3js.org/d3.v3.min",
			"ko": "https://cdnjs.cloudflare.com/ajax/libs/knockout/2.3.0/knockout-min"
		},
		shim: {
			d3: { exports: 'd3' },
			THREE: { exports: 'THREE' }
		}
	}
);

// keep track of loaded modules
require.loaded_modules = [];
require._load = require.load;
require.load = function(obj,name,src){
	require.loaded_modules.push([name,src]);
	require._load.apply(this, arguments);
}

require(['cr']);
