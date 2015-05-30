
var CanvasHandler = {
	backgroundColor: '#cdcdcd',
	id: 'animator',
	styles: {
		position: 'fixed',
		top: 0,
		left: 0,
		zIndex: -1,
	},
	init: function() {
		var self = this;
		self._canvas = document.getElementById(self.id);
		self.ctx = self._canvas.getContext("2d");
		self.playing = false;

		for(var key in self.styles) {
			self._canvas.style[key] = self.styles[key];
		}
	},
	get: function() {
		return this._canvas;
	},
	resize: function() {
		var self = this,
			_c = self._canvas;

		_c.width = window.innerWidth;
		_c.height = window.innerHeight;

		_c.style.width = _c.width + "px";
		_c.style.height = _c.height + "px";

		var ctx = self.ctx;
		ctx.fillStyle=self.backgroundColor;
		ctx.fillRect(0,0,_c.width,_c.height);
	},
	clear: function(ctx) {
		var self = this;
		var _c = self._canvas;
		if(typeof ctx === 'undefined') {
			ctx = _c.getContext("2d");
		}
		
		ctx.clearRect ( 0 , 0 , _c.width, _c.height );
		ctx.fillStyle=self.backgroundColor;
		ctx.fillRect(0,0,_c.width,_c.height);
	},
	    // 現在進行しているアニメーションを停止する
    animateStop: function() {
        var self = this;
        clearTimeout(self.time_id);
    },
    isPlaying: function() {
        var self = this;
        return self.playing;
    },
    getCurrentStyle: function() {
        var self = this;
        return self.currentStyle;
    },
    calcCount: function(beginStyle, diffStyle) {
        var self = this;
        if(diffStyle.x_d > 0) {
        	return parseInt((self.currentStyle.x - beginStyle.x) / diffStyle.x_d) + 1;
        }else if(diffStyle.y_d > 0) {
        	return parseInt((self.currentStyle.y - beginStyle.y) / diffStyle.y_d) + 1;
        }else if(diffStyle.w_d > 0) {
        	return parseInt((self.currentStyle.w - beginStyle.w) / diffStyle.w_d) + 1;
        }else if(diffStyle.h_d > 0) {
        	return parseInt((self.currentStyle.h - beginStyle.h) / diffStyle.h_d) + 1;
        }
        return 1;
    },
    //アニメーション
    animateStart: function (beginStyle, endStyle, duration) {
        //変数定義---------------------------------------------------------
        var count = 1;
        var self = this;
        //spanミリ秒ごとにtimeoutする
        var span = self.span || 33;

        // アニメーションを停止します
        self.animateStop();

        //spanミリ秒ごとの差分を出す
        var diffStyle = {
            x_d: (endStyle.x - beginStyle.x) / (duration / span),
            y_d: (endStyle.y - beginStyle.y) / (duration / span),
            w_d: (endStyle.w - beginStyle.w) / (duration / span),
            h_d: (endStyle.h - beginStyle.h) / (duration / span)
        };

        if(self.isPlaying()) {
            //　アニメーションは途中から始まるので、countを再計算する
            count = self.calcCount(beginStyle, diffStyle);
        }
        self.playing = true;

        //------------------------------------------------------------------
        //アニメーション関数
        var animation = function () {
            //確認
            //画面クリア
            self.clear();
            //差分を考慮して要素を出す
            self.currentStyle = {
                x: beginStyle.x + (diffStyle.x_d * (count-1)),
                y: beginStyle.y + (diffStyle.y_d * (count-1)),
                w: beginStyle.w + (diffStyle.w_d * (count-1)),
                h: beginStyle.h + (diffStyle.h_d * (count-1))
            };
            self.draw(count, self.currentStyle);
            count++;
            if ((count * span) > duration) {
                self.playing = false;
                self.clear();
                self.draw(count, endStyle);
                self.animationEndCallback();
                return;
            }
            else {
                //タイムアウト
                self.time_id=setTimeout(animation, span);
            }
        };
        //タイムアウト
        self.time_id=setTimeout(animation, span);
    },
    draw: function(count, styles) {
    	// override by ScrollHandler.init
    },
    animationEndCallback: function() {
    	// override by ScrollHandler.init 
    },
};

// img_path = src_prefix + leading_zero(j) + src_extension
// where variable j is index number between options.begin and options.end
var FramesHandler = {
	section_imgs: [],
	max_frame_index: 0,
	src_prefix: 'imgs/frames/a0',
	src_extension: 'jpg',
	getFramesOption: function() {
		var options = [];

		options[0] = {begin:  18, end: 43};
		options[1] = {begin:  43, end: 82};
		options[2] = {begin:  117,end: 156};

		return options;
	},
	init: function() {
		var self = this,
			options = self.getFramesOption();


		for(var i = 0; i < options.length; i++) {
			var frame_length = options[i].end - options[i].begin;
			var imgs = [];
			for (var j = 0; j <= frame_length; j++) {

				var leading_zero = "000000" + (j + options[i].begin);
				leading_zero = leading_zero.substr(leading_zero.length - 3);

				var image = new Image();
				image.src = self.src_prefix + leading_zero + "." + self.src_extension;
				imgs.push(image);

				self.max_frame_index += 1;
			};
			self.section_imgs.push(imgs);
		}
	},
};

var CloudHandler = {
	init: function() {
		var self = this;
		self.clouds = document.getElementsByClassName("cloud");

		self.initStyles = {};
		for (var i = 0; i < self.clouds.length; i++) {
			var cloud = self.clouds[i];
			if(cloud.className.indexOf("cloud_left") >= 0) {
				self.initStyles.cloudLeft = cloud.style.left;
			}else if(cloud.className.indexOf("cloud_right") >= 0) {
				self.initStyles.cloudRight = cloud.style.right;
			}
		};

		// self.setTransitionDuration(1000);
	},
	setTransitionDuration: function(duration) {
		var self = this;

		for (var i = 0; i < self.clouds.length; i++) {
			var cloud = self.clouds[i];
			cloud.style.webkitTransitionDuration = duration + "ms";
			cloud.style.MozTransitionDuration = duration + "ms";
			cloud.style.msTransitionDuration = duration + "ms";
			cloud.style.OTransitionDuration = duration + "ms";
			cloud.style.transitionDuration = duration + "ms";
		};
	},
	floatOut: function() {
		var self = this,
			clouds = self.clouds;

		for (var i = 0; i < clouds.length; i++) {
			var cloud = clouds[i];
			if(cloud.className.indexOf("cloud_left") >= 0) {
				
				cloud.className += " moving";
			}else if(cloud.className.indexOf("cloud_right") >= 0) {
				cloud.className += " moving";
			}
		};		
	},
	floatIn: function() {
		var self = this,
			clouds = self.clouds;

		for (var i = 0; i < clouds.length; i++) {
			var cloud = clouds[i];
			if(cloud.className.indexOf("cloud_left") >= 0) {
				cloud.className = cloud.className.replace(" moving","").replace("moving","");
			}else if(cloud.className.indexOf("cloud_right") >= 0) {
				cloud.className = cloud.className.replace(" moving","").replace("moving","");
			}
		};
	}
};


var App = {
	activeClass: 'active',
	currentSection: 0,
	last_section_index: -1,
	animePlaying: false,
	span: 33,
	duration: 1300,
	fadeInWhiteSide: function() {
		var ele = document.getElementsByClassName("whiteside")[0];
		ele.className = ele.className.replace(" hide","").replace("hide","");
	},
	fadeOutWhiteSide: function() {
		var ele = document.getElementsByClassName("whiteside")[0];
		ele.className += " hide";
	},
	getFrameLength: function() {
		return document.getElementsByClassName("whiteside")[0].offsetLeft;
	},
	wipeInText: function(section_ele) {
		if(section_ele.getElementsByClassName("whiteside").length <= 0) {
			return;
		}

		var e = section_ele.getElementsByClassName("vertical-center");
		if(e.length > 0) {
			var _e = e[0];
			for (var i = 0; i < _e.children.length; i++) {
				_e.children[i].className += " wipein";
			};
		}
	},
	wipeOutText: function(section_ele) {
		if(section_ele.getElementsByClassName("whiteside").length <= 0) {
			return;
		}

		var e = section_ele.getElementsByClassName("vertical-center");
		if(e.length > 0) {
			var _e = e[0];
			for (var i = 0; i < _e.children.length; i++) {
				_e.children[i].className = _e.children[i].className.replace(" wipein","").replace("wipein","");
			};
		}
	},
	wipeOutTitle: function() {
		var ele = document.querySelector(".page_container.title");
		ele.style.top = "-500px";
	},
	wipeInTitle: function() {
		var ele = document.querySelector(".page_container.title");
		ele.style.top = "0px";
	},
	init: function() {
		var self = this,
			w = window.innerWidth,
			h = window.innerHeight,
			frame_len = self.getFrameLength(),
			last_el = null, 
			flag_exception_moving = false,
			processing_last_section_i = self.last_section_index,
			beginStyle = {
				x: parseInt((w-h)/2),
				y: 0,
				w: h,
				h: h
			},
			leftStyle = {
				x: 0,
				y: ((h-frame_len-50) / 2),
				w: frame_len,
				h: frame_len
			}

		// console.log(frame_len);
		if(beginStyle.x < 0)beginStyle.x = 0;
		if(leftStyle.y < 0 ) leftStyle.y = 0;

		CanvasHandler.span = self.span;
		CanvasHandler.draw = function(count, styles) {
			// as moving toward next section, -1 to offset
			var currentSection = self.currentSection - 1;
			
			if(flag_exception_moving) {
				var section_imgs = FramesHandler.section_imgs[currentSection];
				var f = section_imgs[section_imgs.length - 1];				
				this.ctx.drawImage(f,styles.x,styles.y,styles.w,styles.h);		
				return;
			}

			if(self.isForward) {
				if(currentSection == 0) {
					if(count >= 15) {
						var f = FramesHandler.section_imgs[currentSection][count -14 - 1];
						this.ctx.drawImage(f,styles.x,styles.y,styles.w,styles.h);		
					}
				}else{
					var f = FramesHandler.section_imgs[currentSection][count - 1];
					this.ctx.drawImage(f,styles.x,styles.y,styles.w,styles.h);	
				}
			}else{
				var processing_last_section_i = self.processing_last_section_i - 1;
				var section_imgs = FramesHandler.section_imgs[processing_last_section_i];
				var img = section_imgs[section_imgs.length - count - 1];
				if(img) {
					this.ctx.drawImage(img,styles.x,styles.y,styles.w,styles.h);	
				}else {
					if(currentSection >= 0) {
						section_imgs = FramesHandler.section_imgs[currentSection];
						this.ctx.drawImage(section_imgs[section_imgs.length - 1], styles.x, styles.y, styles.w, styles.h);		
					}
				}
			}
		}


		var beforeMove = function(index, index_el) {
			self.isForward = (self.last_section_index)< index;
			if(last_el != null) {
  				self.wipeOutText(last_el);
  			}
	  		
	  		if(self.isForward) {
	  			// forward
	  			if(index == 1) {
	  				// 0 -> 1
	  				CloudHandler.floatOut();	
	  				self.wipeOutTitle();
	  				CanvasHandler.animateStart(beginStyle, beginStyle, self.duration);

	  			}else if(index == 2) {
	  				// 1 -> 2
	  				CanvasHandler.animateStart(leftStyle, leftStyle, self.duration);
	  			}else if(index == 3) {
	  				// 2 -> 3 
	  				CanvasHandler.animateStart(leftStyle, leftStyle, self.duration);
	  			}
	  		}else{
	  			self.processing_last_section_i = self.last_section_index;
	  			// backward
	  			if(index == 0) {
	  				// 1 -> 0
	  				CloudHandler.floatIn();	
	  				self.wipeInTitle();
	  				self.fadeOutWhiteSide(document.getElementsByClassName("whiteside")[0]);
	  				CanvasHandler.animateStart(leftStyle, beginStyle, self.duration);
	  				console.log("backwrd");
	  			}else if(index == 1) {
	  				// 2 -> 1
	  				CanvasHandler.animateStart(leftStyle, leftStyle, self.duration);
	  			}else if(index == 2) {
	  				// 3 -> 2
	  				CanvasHandler.animateStart(leftStyle, leftStyle, self.duration);
	  			}
					  			
	  		}
	  	
		},
		afterMove = function(index, next_el) {
			
			self.last_section_index = index;
			last_el = next_el;
			self.wipeInText(next_el);
			
			if(self.isForward){
				// forward
				if(index == 1) {
					// 0 -> 1
					if(!flag_exception_moving) {
						flag_exception_moving = true;
						CanvasHandler.animateStart(beginStyle, leftStyle, 500);
					} else {
						flag_exception_moving = false;
					}
					self.fadeInWhiteSide();
				}else if(index == 2) {
					// 1 -> 2

				}else if(index == 3) {
					// 2 -> 3
				}
			}else{
				// backward
				if(index == 0) {
					// 1 -> 0
				}else if(index == 1) {
					// 2 -> 1

				}else if(index == 2) {
					// 3 -> 2

				}
			}
		};

		self._sections = document.getElementsByTagName("section");
		self.setFocusSection(self.currentSection);

		self.engine = new ScrollEvent(function(e, direction) {
			if(!self.animePlaying) {
				if(direction == e.MOVEMENT_UP) {
					if(self.currentSection > 0) {
						self.currentSection -= 1;
						beforeMove(self.currentSection, self._sections[self.currentSection]);
						self.setFocusSection(self.currentSection);
						self.animePlaying = true;
						CanvasHandler.animationEndCallback = function() {
							afterMove(self.currentSection, self._sections[self.currentSection]);
							self.animePlaying = false;
						};
					}
				}else if(direction == e.MOVEMENT_DOWN) {
					if(self.currentSection < self._sections.length - 1) {
						self.currentSection += 1;
						beforeMove(self.currentSection, self._sections[self.currentSection]);
						self.setFocusSection(self.currentSection);
						self.animePlaying = true;
						CanvasHandler.animationEndCallback = function() {
							afterMove(self.currentSection, self._sections[self.currentSection]);
							self.animePlaying = false;
						};
					}
				}
			}
		});
		self.engine.setTriggleDelta(2);
	},
	setFocusSection: function(index) {
		var self = this;
		if(self._sections.length > index) {
			for (var i = 0; i < self._sections.length; i++) {
				self._sections[i].className = self._sections[i].className.replace(" "+self.activeClass,"").replace(self.activeClass, "");
			};
			self._sections[index].className += " " + self.activeClass;
		}
	},
}

// initial all element handlers
CanvasHandler.init();
FramesHandler.init();
CloudHandler.init();
App.init();

// handle elements size
CanvasHandler.resize();
window.addEventListener("resize", function() {
	CanvasHandler.resize();
	// ScrollingHandler.forceFireEvent();
});
