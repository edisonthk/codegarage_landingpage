function ScrollEvent(cb) {
	var self = this;
	self.MOVEMENT_STATIC = 0;
	self.MOVEMENT_UP = 1;
	self.MOVEMENT_DOWN = -1;

	var triggleDelta = 5;

	var movement = self.MOVEMENT_STATIC;
	var last_moment = movement;

	var movementChangeEvent = function(direction) {
		if(direction == self.MOVEMENT_STATIC) {
			console.log("static");
		}else if(direction == self.MOVEMENT_UP) {
			console.log("up");
		}else if(direction == self.MOVEMENT_DOWN) {
			console.log("down");
		}else{
			console.log("wrong");
		}
	}
	if(typeof cb === 'function') {
		 movementChangeEvent = cb;
	}

	window.onload = function() {
		
		window.addEventListener("mousewheel", function(e) {
			if(e.deltaY > triggleDelta) {
				movement = self.MOVEMENT_DOWN;
			}else if(e.deltaX < -triggleDelta){
				movement = self.MOVEMENT_UP;
			}else {
				movement = self.MOVEMENT_STATIC;
			}

			if(movement != last_moment) {
				last_moment = movement;
				if(movement == self.MOVEMENT_UP || movement == self.MOVEMENT_DOWN) {
					movementChangeEvent(movement);	
				}
			}
		},false);

	}
}
