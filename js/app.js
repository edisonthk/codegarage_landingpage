
var App = {
	activeClass: 'active',
	currentSection: 1,
	init: function() {
		var self = this;

		self._sections = document.getElementsByTagName("section");
		self.setFocusSection(self.currentSection);

		self.engine = new ScrollEvent(function(e, direction) {
			if(direction == e.MOVEMENT_UP) {
				if(self.currentSection > 1) {
					self.currentSection -= 1;
					self.setFocusSection(self.currentSection);
				}
			}else if(direction == e.MOVEMENT_DOWN) {
				if(self.currentSection < self._sections.length - 1) {
					self.currentSection += 1;
					self.setFocusSection(self.currentSection);
				}
			}
		});
	},
	setFocusSection: function(index) {
		var self = this;
		if(self._sections.length >= index) {
			console.log(index);
			for (var i = 0; i < self._sections.length; i++) {
				self._sections[i].className = self._sections[i].className.replace(" "+self.activeClass,"").replace(self.activeClass, "");
			};
			self._sections[index-1].className += " " + self.activeClass;
		}
	},
}

App.init();