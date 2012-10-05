/*

Code : http://github.com/benfoxall/lgraph

Written by @benjaminbenben - give me a shout about this,  or anything else!

*/


// # Helpers/Extensions
// ## underscore.js
_.mixin({

	// Quick hack to convert a querystring into a nicer format
	params: function(querystring){
		var params = {};
		if(querystring){
			var parts = querystring.substr(1).split('&');
			_(parts).each(function(part){
				var kv = part.split('=');
				params[kv[0]] = kv[1];
			});
		}
		return params;
	},
	
	// Formats the date into "d m y"
	formatTime: function(seconds){
		var d = new Date(parseInt(seconds,10) * 1000);
		
		return d.getDate() + ' ' + ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()] + ' ' + d.getFullYear();
	},
	
	// gives a colour that is the result of hashing the key
	// not pretty at the moment, both in looks and implemenation
	colour: function(key){
		var h = 0;
		for (var i=0; i < key.length; i++) {
			h = (h + key.charCodeAt(i)) % 768;
		}

		var r = parseInt(Math.abs(h < 512 ? h : (h - 768)),10);
		var g = parseInt(Math.abs(h - 256),10);
		var b = parseInt(Math.abs(h - 512),10);

		return "rgba("+Math.min(r,256)+","+Math.min(g,256)+","+Math.min(b,256)+",0.9)";
	},
	
	// returns the union of all keys for a set of objects
	// as a sorted array
	sharedKeys: function(collections){
		var keys = _.uniq(
			_.flatten(
				_.map(collections,function(o){
					return _.keys(o);
					}
				)
			)
		);
		keys.sort();
		return keys;
	},

	// gets the union of keys in a list of collections
	// and returns the values of each of those keys 
	// indexed by the original collection index
	// 
	//   x = {a:1, b:2}, y = {a:5, c:10}
	//   _([x,y]).valueArray()
	//     => [[1,5],[2,0],[0,10]]
	//
	//   (ie. [x[a],y[a]],[x[b],y[b]],[x[c],y[c]] )
	valueArray: function(collections,keys){
		keys = keys || _.sharedKeys(collections);

		return _.map(keys,function(key){
			return _.map(collections, function(o){
				return parseInt(o[key],0) || 0;
			});
		});
	}
});

// ## jQuery
// filters elements to which ones are horizontally
// within the viewport
$.fn.visible = function(){
	
	var left = $(window).scrollLeft();
	var right = left + $(window).width();
	
	return this.filter(function(){
		var $el = $(this);
		var l = $el.position().left;
		var r = l + $el.width(); 
		return l < right && r > left;
		
	});
};

// this won't actually do anything with the current
// implementation of jsonp callbacks - though there
// is a nice way to approach this which I'm working
// on for a different site, so I'm going to keep it
// in to remind me.
$.ajaxSetup({cache: true});





// # API wrapper
var lfm_api = (function(){

	// api request wrappers,  with the method to call
	// and how to process the returned data	
	return {
		chart: function(user){
			return request('user.getweeklychartlist',{user:user}, function(data){
				try{
					var chart = data.weeklychartlist.chart;
					chart.reverse();
					return chart;
				} catch(e){
					return [];
				}
			});
		},
		artists: function(user,from,to){
			return request('user.getweeklyartistchart', {user:user, from:from, to:to}, function(data){
				try{

					var artists = {};
					_(data.weeklyartistchart.artist).each(function(a){
						artists[a.name] = a.playcount;
					});

					return artists;
				} catch(e) {
					return {};
				}	
			});
		}
	};
	
	// The request to last fm, this returns a deferred object
	// and runs the response through a 'processor' function to 
	// transform the response into something more useful
	function request(method, params, processor){
		processor = processor || _.identity;

		var key = window.config.api_key;
		var endpoint = 'http://ws.audioscrobbler.com/2.0/?callback=?';

		$.extend(params,{
			method:method,
			api_key:key,
			format:'json'
		});

		var dfr = $.Deferred();

		$.getJSON(endpoint, params).done(function(json){
			json.error ? 
				dfr.reject(json.error) : 
				dfr.resolve(processor(json));

		}).fail(dfr.reject);

		return dfr.promise();
	}
	
	
})();





// # Drawing
var canvasrenderer = (function(){
	
	
	// potentially can be run server side too
	// context callback will give the context of an appropriately sized
	// canvas element (might have been already drawn to)
	return function(previous, current, next, context_callback){
		
		var scale = window.config.scale;

		//consider making this in the method signature if we make it generic enough
		var timestamps = [previous, current, next];

		var artists = _.sharedKeys(timestamps);
		var values = _.valueArray(timestamps,artists);

		var totals = [0,0,0];
		_.each(values, function(arr){
			_.each(arr,function(v,i){
				totals[i] += v;
			});
		});
		
		
		var max_total = _.max(totals);
		var offsets = _.map(totals, function(t){
			return (max_total - t)/4;
		});
		
		var o1 = 0, o2 = 0, o3 = 0;
		_(values).each(function(delta,i){
			o1 += (delta[1] + delta[0]) / 2;
			o2 +=  delta[1];
			o3 += (delta[1] + delta[2]) / 2;
		});
		offsets = [o1,o2,o3];
		var max_offset = _.max(offsets);
		offsets = _.map(offsets,function(o){
			return (max_offset - o)/2;
		});

		var height = max_offset;// * scale;
		var width = 180;
		
		
		var ctx = context_callback(width*scale, height*scale);
		
		ctx.save();
		ctx.scale(scale,scale);

		//clear the canvas
		ctx.fillStyle = '#fcfcfc';
		ctx.fillRect(0,0,width,height);
		
		

		_(values).each(function(delta,i){
			var v1 = (delta[1] + delta[0]) / 2;
			var v2 =  delta[1];
			var v3 = (delta[1] + delta[2]) / 2;
			
			var data = [v1,v2,v3];
			
			var label;
			if(delta[1] > 15 && delta[1] > delta[0] && delta[1] > delta[2]){
				label = artists[i];
			}
			
			ctx.fillStyle = _.colour(artists[i]);
			
			drawSegment(ctx, width, offsets, data, label);
		});
		
		
		ctx.restore();
		
	};
	
	
	function drawSegment(ctx, width, current, data, label){

		var midwidth = width/2;

		ctx.beginPath();
		ctx.moveTo(0, current[0]);

		// draw line out
		ctx.bezierCurveTo(	midwidth, current[1],
							midwidth, current[1],
							width, current[2]);

		//update the current 
		for (var i = current.length - 1; i >= 0; i--){
			current[i] += data[i];
		}

		// then move back
		ctx.lineTo(width,current[2]);

		ctx.bezierCurveTo(	midwidth, current[1],
							midwidth, current[1],
							0, current[0]);

		ctx.fill();
		
		
		if(label){
			
			ctx.save();
			
			ctx.translate(0, current[0] - (data[0] / 2));
			ctx.rotate(-Math.atan((current[0] - current[1]) / 90));
			
			ctx.fillStyle = 'black';
			ctx.fillText('  ' + label, 0, 0);
			
			ctx.restore();
			
		}

	}
	
})();





$.fn.timestamp = function(chartdata,username){
	
	var $this = this;
	
	if(chartdata){
		$('<a>', {'class':'date', href:'#t' + chartdata.from, id:'t' + chartdata.from})
			.text(_.formatTime(chartdata.from))
			.appendTo($this);
		
		$this.addClass('unrequested');
	} else {
		$('<a>', {'class':'date'}).html('&nbsp;').appendTo($this);
	}
	
	
	$this.data('has-canvas', false);
	
	// --bind events
	// request - get information from the api
	$this.bind('request', function(){
		if(!chartdata){
			return true;
		}
		
		$this.attr('class','requesting');
		lfm_api.artists(username, chartdata.from, chartdata.to).done(function(data){
			$this.data('artists', data);
			
			//trigger render events
			$this.trigger('render');
			$this.prev().trigger('render');
			$this.next().trigger('render');
			
			$this.attr('class','complete');
			
		}).fail(function(){
			$this.attr('class','error');
		});
	});
	
	// render - draw information (triggered from request)
	$this.bind('render', function(){
		
		var previous = $this.prev().data('artists') || {};
		var next     = $this.next().data('artists') || {};
		var current  = $this.data('artists') || {};
		
		canvasrenderer(previous, current, next, function(width, height){
			
			// check if there is a canvas element here
			if(!$this.is(':has(canvas)')){
				$this.append('<canvas height="'+height+'" width="'+width+'"></canvas>');
			}
			
			var c = $this.find('canvas').get(0);
			c.width = width;
			c.height = height;
			
			return c.getContext('2d');
		});
		
	});
	
	// $this.click(function(){
	//	$this.trigger('request');
	// });
	
	
	return $this;
};




var fetch = function(user){
	
	//get the list of weekly charts
	return lfm_api.chart(user).done(function(chart){
		
		
		$('#times').empty();
		
		for (var i=-1; i < chart.length; i++) {
			
			$('<li>').timestamp(chart[i],user).appendTo($('#times'));
			
		}
				
	});
	
};