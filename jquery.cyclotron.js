(function ($) {
	$.fn.cyclotron = function (options) {
		return this.each(function () {
			var container, sx, dx = 0, armed, offset = 0, tick, prev, h = [], max=0, min=0;
			container = $(this);
			var settings = $.extend({
				dampingFactor: 0.93,
				historySize: 5,
				autorotation: 0
			}, options);
			// check for dampingFactor in range
			if((settings.dampingFactor>1 || settings.dampingFactor<0)) {
				if (typeof console==='object') {
					console.log('dampingFactor out of range '+settings.dampingFactor);
				}
				settings.dampingFactor=0.93;
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
					if (prev === undefined) {
						prev = px;
					}
					offset = px - sx;
					if (h.length > settings.historySize) {
						h.shift();
					}
					h.push(prev - px);

					container.css('background-position', offset);

					prev = px;
				}
			});
			container.bind('mouseleave mouseup touchend', function () {
				if (armed) {
					var i, len = h.length, v = h[len - 1];
					for (i = 0; i < len; i++) {
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
					container.css('background-position', offset);
					if (Math.abs(dx) < 0.001) {
						dx = 0;
					}
				}
			};
			setInterval(tick, 16);
		});
	};
}(jQuery));
$(document).ready(function() {
	$('.cyclotron').cyclotron();
});