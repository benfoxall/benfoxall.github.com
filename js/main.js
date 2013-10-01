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
	    shim: { d3: { exports: 'd3' } }
	} :
	{
		// production
		paths: {
		// use cdn jq
			"jquery": "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min",
			"d3": "http://d3js.org/d3.v3.min",
			"ko": "http://cdnjs.cloudflare.com/ajax/libs/knockout/2.3.0/knockout-min.js"
		},
		shim: { d3: { exports: 'd3' } }
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