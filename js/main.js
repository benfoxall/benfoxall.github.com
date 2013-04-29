/* require.js setup */
require.config(
	document.location.hostname == 'localhost' ?
	{
		// development
		// cache bust in development
		urlArgs:"dev="+ +new Date()
	} :
	{
		// production
		paths: {
		// use cdn jq
			"jquery": "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min",
		}
	}
);

require(['cr']);