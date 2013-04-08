// This is a slightly modified version of the tweet globe code to 
// make use of require.js and the CR being used on this site
//
// for a nicer version check https://gist.github.com/benfoxall/5332944

define(['tweet-globe-data', 'lib/sylvester'],function(data){

	// The transform matrix for rotating the ball
	var M = Matrix.I(3), 
		drawn = false;

	// set view of the globe based on mouse/touch position
	function setView(x,y){

		var a = Matrix.RotationY(x/100);
		var b = Matrix.RotationX(-y/100);

		M = a.x(b);
		drawn = false;
	}

	var handlers = {
		touch:function(e){
			//e.preventDefault();

			var x = e.touches[0].pageX;
			var y = e.touches[0].pageY;
			setView(x,y);
		},
		mouse:function(e){
			e.preventDefault();

			var x = e.clientX;
			var y = e.clientY;
			setView(x,y);

		}
	};


	window.addEventListener("mousemove",  handlers.mouse, false);
	window.addEventListener("touchmove",  handlers.touch, false);
	window.addEventListener("touchstart", handlers.touch, false);


	// map the lat/lngs into cartesian coords and the
	// extend of the hist bar
	var vectors = data.map(function(point){
		var rho = 200;
		var phi = (point.lat + 90) * (Math.PI/180);
		var theta = (point.lng + 90) * (Math.PI/180);

		var x = rho * Math.sin(phi) * Math.cos(theta);
		var y = rho * Math.sin(phi) * Math.sin(theta);
		var z = rho * Math.cos(phi);

		return {
			v: $V([x,y,z]),
			v2: $V([x,y,z]).x(1.02 + (point.count/6000)),
			count: point.count
		};
	});




	// shim layer with setTimeout fallback
	var requestAnimFrame = (function(){
	  return  window.requestAnimationFrame       || 
	          window.webkitRequestAnimationFrame || 
	          window.mozRequestAnimationFrame    || 
	          window.oRequestAnimationFrame      || 
	          window.msRequestAnimationFrame     || 
	          function( callback ){
	            window.setTimeout(callback, 1000 / 60);
	          };
	})();


	// the cr init
	return function(canvas){

		if(!canvas.getContext) return;

		// set up the drawing/animation
		// var canvas = document.getElementById('canvas');
		var context = canvas.getContext('2d');


		(function animloop(){
			requestAnimFrame(animloop);

			// only draw if the transform matrix has changed
			if(drawn) return;
			drawn = true;


			// clear / setup the canvas
			canvas.width = canvas.width;
			context.translate(300,300);
			context.strokeStyle = 'rgba(0,0,0,0.3);';
			context.beginPath();

			vectors.forEach(function(vector, i){

				// transform to the current view
				var v = M.x(vector.v);

				// skip backface points
				if(v.elements[2] < 0) return;

				var v2 = M.x(vector.v2);

				context.moveTo(v.elements[0],v.elements[1]);
				context.lineTo(v2.elements[0],v2.elements[1]);

			});

			context.closePath();
			context.stroke();
		})();

	}

})
