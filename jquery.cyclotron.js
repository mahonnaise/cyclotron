(function ($) {
	$.fn.cyclotron = function (options) {
		return this.each(function () {
			var container, sx, dx = 0, armed, offset = 0, tick, prev, h = [], max=0, min=0;
			container = $(this);
			var settings = $.extend({
				dampingFactor: 0.93,
				historySize: 5,
				autorotation: 0,
				continuous: 1
			}, options);
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
				var image_url = container.css('background-image').replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
				var image = new Image();
				$(image).load(function () {
					max=image.width - container.width();
				});
				image.src = image_url;
			}
			// set autorotation
			if(settings.autorotation!=0) {
				armed=false;
				dx=settings.autorotation;
			}
			container.bind('touchstart mousedown', function (e) {
				var px = (e.pageX>0?e.pageX:e.originalEvent.touches[0].pageX);
				sx = px - offset;
				armed = true;
				e.preventDefault();
			});
			container.bind('touchmove mousemove', function (e) {
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
			container.bind('mouseleave mouseup touchend', function () {
				if (armed) {
					var len = h.length, v = h[len - 1];
					for (var i = 0; i < len; i++) {
						v = (v * len + (h[i])) / (len + 1);
					}
					dx = v;
				}
				armed = false;
			});
			tick = function () {
				if (!armed && dx) {
					dx *= settings.dampingFactor;
					offset -= dx;
					checkOffset();
					container.css('background-position', offset);
					if (Math.abs(dx) < 0.001) {
						dx = 0;
					}
				}
			};
			setInterval(tick, 16);
			function checkOffset() {
				if(settings.continuous===0) {
					if (-offset<min) {
						dx=0;
						offset=-min;
					}
					if (-offset>max) {
						dx=0;
						offset=-max;
					}
				}
			}
		});
	};
}(jQuery));
$(document).ready(function() {
	$('.cyclotron').cyclotron();
});
