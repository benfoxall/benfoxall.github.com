/* require.js setup */
require.config({
    paths: {
		// use cdn jq
        "jquery": "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min",
    },

    // cache bust in development
    urlArgs: (
    	document.location.hostname == 'localhost' ?
    		"dev="+ +new Date() : ''
    )
 });

require(['cr']);