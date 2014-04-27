
// add a test for webrtc
try{ Modernizr.addTest('webrtc', !!Modernizr.prefixed('RTCPeerConnection',window)) } catch (e){}

Modernizr.addTest('devicemotion', 'DeviceMotionEvent' in window);
Modernizr.addTest('deviceorientation', 'DeviceOrientationEvent' in window);

// Modernizr.addTest('borderradiusprefixed', Modernizr.testAllProps('borderRadius'));
// Modernizr.addTest('borderradius', Modernizr.testProp('borderRadius'));


function partyHandler(message){

}

function show(type, id){
	var slide = document.getElementById(id);
	if(slide){
		var slides = document.getElementsByClassName(type);
		for (var i = 0; i < slides.length; i++) {
			slides[i].className = slides[i] === slide ? type + ' on' : type;
		};
	}
}


// setTimeout(function(){
// 	// show('slide','web2');
// }, 1500)


// var blob = document.getElementById('blob');// not needed, but whatever
// var inner = document.getElementById('inner');// not needed, but whatever


//d3.scale.category20()
// var innerC = '#1f77b4 #aec7e8 #ff7f0e #ffbb78 #2ca02c #98df8a #d62728 #ff9896 #9467bd #c5b0d5 #8c564b #c49c94 #e377c2 #f7b6d2 #7f7f7f #c7c7c7 #bcbd22 #dbdb8d #17becf #9edae5'.split(' ')[Math.floor(Math.random()*20)];

//d3.scale.category20c()
// var outerC = '#3182bd #6baed6 #9ecae1 #c6dbef #e6550d #fd8d3c #fdae6b #fdd0a2 #31a354 #74c476 #a1d99b #c7e9c0 #756bb1 #9e9ac8 #bcbddc #dadaeb #636363 #969696 #bdbdbd #d9d9d9'.split(' ')[Math.floor(Math.random()*20)];

// setTimeout(function(){
// blob.style.background = outerC;
// inner.style.background = innerC;	
// }, 500)



// gather the used features
var feats = [];
for(var feat in Modernizr){
	if(Modernizr[feat] === true) feats.push(feat);
}

// var pixels = 0;
// try{
// 	pixels = screen.height * screen.width
// }catch(e){}

var id = document.location.hash || (document.location.hash = PUBNUB.uuid());

if(id.charAt(0) === '#'){
	id = id.substr(1);
}

var pubnub = PUBNUB.init({
	publish_key   : 'pub-c-0776ca68-c17d-4d5e-9955-72425215955d',
	subscribe_key : 'sub-c-4e3d33da-15a8-11e3-92f9-02ee2ddab7fe',
	uuid          : id
});

pubnub.publish({
	channel : "guests",
	message : {
		uuid: id,
		type: 'hello',

		features: feats.join(' '),
		// pixels: pixels,
		// outer: outerC,
		// inner: innerC,

    width:  window.innerWidth,
    height: window.innerHeight
	}
})


// console.log({
// 		uuid: id,
// 		type: 'hello',

// 		features: feats.join(' '),
// 		// pixels: pixels,
// 		// outer: outerC,
// 		// inner: innerC,

//     width:  window.innerWidth,
//     height: window.innerHeight
// 	})

/*
pubnub.subscribe({
    channel : "party",
    message : function(c){
    	console.log(c);
    	// console.log(arguments);
    },
	presence   : function( message, env, channel ) {   // PRESENCE
		console.log( "Channel: ",            channel           );
		console.log( "Join/Leave/Timeout: ", message.action    );
		console.log( "Occupancy: ",          message.occupancy );
		console.log( "User ID: ",            message.uuid      ); 
	}
})
*/

// var pubnub = PUBNUB.init({
// 	subscribe_key   : 'sub-c-5c70c8e0-15a8-11e3-946c-02ee2ddab7fe'
// });


var callback = (function(){
	var timeout, messages = [], backfillProcessed = false;
	return function (message){

		// first batch of messages is backfill
		if(!backfillProcessed){
			if(timeout){clearTimeout(timeout)}

			messages.push(message)
			timeout = setTimeout(function(){
				backfillProcessed = true;

				var index = 0;
				for (var i = 0; i < messages.length; i++) {
					if(messages[i].party_started){
						index = i;
					}
				};

				messages = messages.slice(index);
				for (var i = 0; i < messages.length; i++) {
					callback(messages[i]);
				}

			},50)

		} else {
			// process the message
			if(console) console.log("message!", message)

			if(message.slide){
				show('slide',message.slide);
			}
			if(message.fragment){
				show('fragment',message.fragment);

				// if(message.fragment === 'capabilities'){
				// 	// document.getElementById('blobpanel').style.display = 'block';
				// }
			}
			if(message.hello){
				var i = document.createElement('img');
				i.src = message.hello;
				document.getElementById('hello-image').innerHTML = '';
				document.getElementById('hello-image').appendChild(i);
			}

			if(message.tweet){
				document.getElementById('tweet').innerHTML = message.tweet;

				var js = document.createElement('script'); 
				js.async = true;
				js.src = "//platform.twitter.com/widgets.js";
				document.body.appendChild(js);
			}

			// if(message.show_all){
			// 	document.getElementById('blobpanel').style.display = 'block';
			// }

		}
	}
})();

pubnub.subscribe({
	channel : "host",
	// message : function(m){
	// 	console.log("party says", m)
	// 	if(m.slide){
	// 		show('slide',m.slide);
	// 	}
	// 	if(m.fragment){
	// 		show('fragment',m.fragment);
	// 	}
	// 	if(m.hello){
	// 		var i = document.createElement('img');
	// 		i.src = m.hello;
	// 		document.getElementById('hello-image').innerHTML = '';
	// 		document.getElementById('hello-image').appendChild(i);
	// 		// show('fragment',m.fragment);
	// 	}
	// },
	connect:function(){
		document.getElementById('hello').style.color = '#08f';
		document.getElementById('intro').style.opacity = '1';
	},
	restore : true,
	backfill : true,
	callback : callback
});





function coordecode(e, el){
	var posx = 0;
	var posy = 0;
	if (!e) var e = window.event;
	if (e.pageX || e.pageY) 	{
		posx = e.pageX;
		posy = e.pageY;
	}
	else if (e.clientX || e.clientY) 	{
		posx = e.clientX + document.body.scrollLeft
			+ document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop;
	}
	// posx and posy contain the mouse position relative to the document
	// Do something with this information

	var rect = el.getBoundingClientRect()
	return {
		x: posx - rect.left - (rect.width/2),
		y: posy - rect.top - (rect.height/2)
	}
}

function touchCoord(e, el){
	// console.log(e.touches[0]);

	var posx = e.touches[0].pageX;
	var posy = e.touches[0].pageY;
	
	var rect = el.getBoundingClientRect()
	return {
		x: posx - rect.left - (rect.width/2),
		y: posy - rect.top - (rect.height/2)
	}
}

/*
var fTimeout;
function feedback(coords){
	blob.style.backgroundColor = innerC;
	inner.style.backgroundColor = outerC;

	blob.style.webkitTransform = 'translate3D('+coords.x/3+'px, '+coords.y/3+'px, 0)';

	if(fTimeout){clearTimeout(fTimeout);}
	fTimeout = setTimeout(function(){
		blob.style.backgroundColor = outerC;
		inner.style.backgroundColor = innerC;
		blob.style.webkitTransform = '';
	},100)
	// console.log(fTimeout, "fTimeout");
}

bean.on(blob, 'click', function(e){
	e.stop();
	e.stopImmediatePropagation();

	var coords = coordecode(e, blob);

	pubnub.publish({
		channel : "guests",
		message : {
			uuid: id,
			type: 'go',
			x:coords.x,
			y:coords.y
		}
	});


	feedback(coords);

})

bean.on(blob, 'touchstart', function(e){
	e.stop();
	e.stopImmediatePropagation();

	var coords = touchCoord(e, blob);

	pubnub.publish({
		channel : "guests",
		message : {
			uuid: id,
			type: 'go',
			x:coords.x,
			y:coords.y
		}
	});

	feedback(coords);

})
*/
// bean.one(document.getElementById('party'), 'click touchstart', function(){
// 	pubnub.publish({
// 		channel : "guests",
// 		message : {
// 			uuid: id,
// 			type: 'start_playing'
// 		}
// 	});
// 	document.getElementById('blobpanel').style.display = 'block'
// })

// not sure if this is a great idea
/*
bean.on(document.getElementById('fullscreen'), 'click', function(e){

	if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }

});
*/
/*
if (
	document.location.hostname !== 'localhost' &&
	document.documentElement && (
		document.documentElement.requestFullscreen || 
		document.documentElement.mozRequestFullScreen||
		document.documentElement.webkitRequestFullscreen
	)
){
	bean.one(document.documentElement, 'click', function(e){
		console.log("click");

		if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
	});

}
*/

// var attemptFullScreen = true;

// bean.on(document, 'click', function(e){
// 	console.log("click")
// })

// function toggleFullScreen() {
//   if (!document.fullscreenElement &&    // alternative standard method
//       !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
//     if (document.documentElement.requestFullscreen) {
//       document.documentElement.requestFullscreen();
//     } else if (document.documentElement.mozRequestFullScreen) {
//       document.documentElement.mozRequestFullScreen();
//     } else if (document.documentElement.webkitRequestFullscreen) {
//       document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
//     }
//   } else {
//     if (document.cancelFullScreen) {
//       document.cancelFullScreen();
//     } else if (document.mozCancelFullScreen) {
//       document.mozCancelFullScreen();
//     } else if (document.webkitCancelFullScreen) {
//       document.webkitCancelFullScreen();
//     }
//   }
// }

// toggleFullScreen()



//voting
// bean.on('')

var throttles = {};
bean.on(document, 'change', 'input', function(){
	return function(e){
		var name = this.name, self = this;
		clearTimeout(throttles[name]);
		throttles[name] = setTimeout(function(){
			
			var val = self.name + ' ' + self.value;

			pubnub.publish({
				channel : "guests",
				message : {
					id: id,
					type: 'vote',
					value: val.split(' ')
				}
			})


		},500)
		// if(!throttles[name]){
		// 	throttles[name]
		// }

		// if(!throttles[this]){
		// 	throttles[this] = 
		// }
		// console.log("CHANGE", e, this)
		// console.log(this.name);
	}
}());








/// Inter-device Multi-touch


function css(m){
  // a-f in http://www.w3.org/TR/css3-transforms/#MatrixDefined
  return 'matrix(' + 
    [m.e(1,1),m.e(2,1),
     m.e(1,2),m.e(2,2),
     m.e(1,3),m.e(2,3)].join(', ') + 
  ')';
}


var element = document.getElementById('item');


var divstyle = element.style;
var tranformProp =  ('transform' in divstyle) ? 'transform' :
                    ('MozTransform' in divstyle) ? 'MozTransform' :
                    ('WebkitTransform' in divstyle) ? 'WebkitTransform' :
                    ('OTransform' in divstyle) ? 'OTransform' :
                    ('msTransform' in divstyle) ? 'msTransform' : 
                    'transform';


var localtransform = Matrix.I(3);;

pubnub.subscribe({
  channel: 'idmt-positions',
	restore : true,
  backfill : true, // not necessary, but - https://gist.github.com/benfoxall/8918328
  message: function(positions){
    for (var i = positions.length - 1; i >= 0; i--) {
      if(positions[i][0] == id){
        var x     = positions[i][1],
            y     = positions[i][2],
            scale = positions[i][3];
        // found!
        
        localtransform = $M([
          [1/scale, 0, 0],
          [0, 1/scale, 0],
          [0,0,1]
        ]).x($M([
          [1, 0, -x],
          [0, 1, -y],
          [0,0,1]
        ]));

        // console.log("FOUND!", localtransform.inspect(), css(localtransform))
        element.style.display = 'block';
        // element.style.opacity = 1;

        element.style[tranformProp] = css(localtransform);

      }
    };
  }
});



pubnub.subscribe({
	channel : "idmt-state",
	restore : true,
	backfill : true, // not necessary, but - https://gist.github.com/benfoxall/8918328
	callback : function(m){
		element.style[tranformProp] = css(localtransform) + ' ' + m;
		console.log("State -", m); 
	}
});






// twitter
function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?
'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=
p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}
(document, 'script', 'twitter-wjs');




window.fitText( document.getElementById("hello") );