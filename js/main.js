/* require.js setup */
require.config(
	document.location.hostname == 'localhost' ?
	{
		// development
		// cache bust in development
		urlArgs:"dev="+ +new Date(),
	    shim: { d3: { exports: 'd3' } }
	} :
	{
		// production
		paths: {
		// use cdn jq
			"jquery": "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min",
			"d3": "http://d3js.org/d3.v3.min"
		},
		shim: { d3: { exports: 'd3' } }
	}
);

require(['cr']);