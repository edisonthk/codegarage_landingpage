var engine = new ScrollEvent(function(direction) {
	if(direction == engine.MOVEMENT_UP) {
		console.log("up");
	}else if(direction == engine.MOVEMENT_DOWN) {
		console.log("down");
	}
});