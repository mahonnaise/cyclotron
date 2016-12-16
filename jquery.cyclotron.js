(function (jQuery) {
	jQuery.fn.cyclotron = function (options) {
		return this.each(function () {
			var container=jQuery(this), sx, dx = 0, armed, offset = 0, tick, prev, h = [], max=0, min=0;
			var settings = jQuery.extend({
				dampingFactor: 0.93,
				historySize: 5,
				autorotation: 0,
				continuous: 1
			}, options);
			var checkOffset = function () {
				if(settings.continuous===0) {
					if (-offset<min) {
						dx=(settings.autorotation===1?-dx:0);
						offset=-min;
					}
					if (-offset>max) {
						dx=(settings.autorotation===1?-dx:0);
						offset=-max;
					}
				}
			}
			var tick = function () {
				if (!armed && dx!==0) {
					dx *= settings.dampingFactor;
					offset -= dx;
					checkOffset();
					container.css('background-position', offset);
					if (Math.abs(dx) < 0.001) {
						dx = 0;
					}
				}
			};
			// check for dampingFactor in range
			if((settings.dampingFactor>1 || settings.dampingFactor<0)) {
				if (typeof console==='object') {
					console.log('dampingFactor out of range '+settings.dampingFactor);
				}
				settings.dampingFactor=0.93;
			}
			// check for nonContinuous class to set continuous to 0 if existing
			if(settings.continuous===1 && container.hasClass('nonContinuous')) {
				settings.continuous=0;
			}
			// check size of image if not continuous image
			if(settings.continuous===0) {
				var image = new Image(),
						src=container.css('background-image').replace(/url\((['"])?(.*?)\1\)/gi, '$2'),
						cssSize = container.css('background-size').split(' '),
						elemDim = [container.width(),container.height()],
						imagesize = [],
						ratio=1;
				// Load the image with the extracted URL.
				// Should be in cache already.
				jQuery(image).one('load',function () {
					// Determine the 'ratio'
					ratio = image.width > image.height ? image.width / image.height : image.height / image.width;
					// First property is width. It is always set to something.
					imagesize[0] = cssSize[0];
					// If height not set, set it to auto
					imagesize[1] = cssSize.length > 1 ? cssSize[1] : 'auto';
					// If both values are set to auto, return image's 
					// original width and height
					if(imagesize[0] === 'auto' && imagesize[1] === 'auto') {
							imagesize[0] = image.width;
					} else {
						if(cssSize[0] === 'cover') {
							if(elemDim[0] > elemDim[1]) {
								// Elem's ratio greater than or equal to img ratio
								if(elemDim[0] / elemDim[1] >= ratio) {
									return elemDim[0];
								} else {
									imagesize[0] = 'auto';
									imagesize[1] = elemDim[1];
								}
							} else {
								imagesize[0] = 'auto';
								imagesize[1] = elemDim[1];
							}
						} else if(cssSize[0] === 'contain') {
							// Width is less than height
							if(elemDim[0] < elemDim[1]) {
								imagesize[0] = elemDim[0];
							} else {
								// elem's ratio is greater than or equal to img ratio
								if(elemDim[0] / elemDim[1] >= ratio) {
									imagesize[0] = 'auto';
									imagesize[1] = elemDim[1];
								} else {
									imagesize[1] = 'auto';
									imagesize[0] = elemDim[0];
								}
							}
						} else {
							// If not 'cover' or 'contain', loop through the values
							for(var i = cssSize.length; i--;) {
								// Check if values are in pixels or in percentage
								if (cssSize[i].indexOf('px') > -1) {
									// If in pixels, just remove the 'px' to get the value
									imagesize[i] = cssSize[i].replace('px', '');
								} else if (cssSize[i].indexOf('%') > -1) {
									// If percentage, get percentage of elem's dimension
									// and assign it to the computed dimension
									imagesize[i] = elemDim[i] * (cssSize[i].replace('%', '') / 100);
								}
							}
						}
						// Depending on whether width or height is auto,
						// calculate the value in pixels of auto.
						// ratio in here is just getting proportions.
						ratio = imagesize[0] === 'auto' ? image.height / imagesize[1] : image.width / imagesize[0];
						imagesize[0] = (imagesize[0] === 'auto' ? image.width / ratio : imagesize[0]);
					}
					max=imagesize[0]-container.width();
				});
				image.src = src;
			}
			// set autorotation
			if(settings.autorotation!=0) {
				armed=false;
				dx=settings.autorotation;
			}
			container.on('touchstart mousedown', function (e) {
				var px = (e.pageX>0?e.pageX:e.originalEvent.touches[0].pageX);
				sx = px - offset;
				armed = true;
				e.preventDefault();
			});
			container.on('touchmove mousemove', function (e) {
				if (armed) {
					var px = (e.pageX>0?e.pageX:e.originalEvent.touches[0].pageX);
					if (typeof prev==='undefined') {
						prev = px;
					}
					offset = px - sx;
					if (h.length > settings.historySize) {
						h.shift();
					}
					h.push(prev - px);
					checkOffset();
					container.css('background-position', offset);
					prev = px;
				}
			});
			container.on('mouseleave mouseup touchend', function () {
				if (armed) {
					var len = h.length, v = h[len - 1];
					for (var i = 0; i < len; i++) {
						v = (v * len + (h[i])) / (len + 1);
					}
					dx = v;
				}
				armed = false;
			});
			// shim layer with setTimeout fallback
			window.requestAnimFrame = (function () {
					return window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					window.msRequestAnimationFrame ||
					function (callback) {
						// use 16.666 ms for better performance in older browsers
						window.setTimeout(callback, 100/6);
					};
			})();
			// the equivalent of setInterval(tick, 16);
			(function animloop(){
				requestAnimFrame(animloop);
				tick();
			})();
		});
	};
}(jQuery));
jQuery(document).ready(function(){
	jQuery('.cyclotron').cyclotron();
});
