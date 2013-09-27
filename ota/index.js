var pubnub = PUBNUB.init({
	publish_key   : 'pub-c-0776ca68-c17d-4d5e-9955-72425215955d',
	subscribe_key : 'sub-c-4e3d33da-15a8-11e3-92f9-02ee2ddab7fe'
	// uuid          : id
});

var watchID;

bean.on(start_button, 'click', function(){
	if(watchID){
		navigator.geolocation.clearWatch(watchID);
	} else {
		watchID = navigator.geolocation.watchPosition(function(position) {
			pubnub.publish({
				channel : "positions",
				message : position
			});
			counter.innerText = parseInt(counter.innerText) + 1;
		});
	}
});

var subscribed;

bean.on(view_button, 'click', function(){
	if(subscribed) return;
	subscribed = true;

	pubnub.subscribe({
		channel : "positions",
		callback : function(message){
			// prepend to the list
			positions_el.innerText = JSON.stringify(message) + "\n" + positions_el.innerText;
		}
	});
});



// not sure if this is a great idea

// bean.on(document.getElementById('fullscreen'), 'click', function(e){

// 	if (document.documentElement.requestFullscreen) {
//       document.documentElement.requestFullscreen();
//     } else if (document.documentElement.mozRequestFullScreen) {
//       document.documentElement.mozRequestFullScreen();
//     } else if (document.documentElement.webkitRequestFullscreen) {
//       document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
//     }

// });
