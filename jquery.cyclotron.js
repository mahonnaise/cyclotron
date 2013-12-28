(function($) {
	$.fn.cyclotron = function(options) {
		var settings = $.extend({
			dampingFactor: 0.93,
			historySize: 5
		}, options);
		var pointerEventToXY = function(e) {
			var out = {
				x: 0,
				y: 0
			};
			if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
				var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
				out.x = touch.pageX;
				out.y = touch.pageY;
			} else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover' || e.type == 'mouseout' || e.type == 'mouseenter' || e.type == 'mouseleave') {
				out.x = e.pageX;
				out.y = e.pageY;
			}
			return out;
		};

		return this.each(function() {
			var $container;
			var sx;
			var dx = 0;
			var armed;
			var offset = 0;
			var tick;
			var prev;
			var h = [];
			$container = $(this);

			$container.on('mousedown touchstart', function(e) {
				sx = pointerEventToXY(e).x - offset;
				armed = true;
				e.preventDefault();
			});
			$container.on('mousemove touchmove', function(e) {
				var px;
				if (armed) {
					px = pointerEventToXY(e).x;
					if (prev === undefined) {
						prev = px;
					}
					offset = px - sx;
					if (h.length > settings.historySize) {
						h.shift();
					}
					h.push(prev - px);

					$container.css('background-position', offset);

					prev = px;
				}
			});
			$container.on('mouseleave mouseup touchend touchcancel', function() {
				if (armed) {
					var i, len = h.length;
					var v = h[len - 1];
					for (i = 0; i < len; i++) {
						v = (v * len + (h[i])) / (len + 1);
					}
					dx = v;
				}
				armed = false;
			});
			tick = function() {
				if (!armed && dx) {
					dx *= settings.dampingFactor;
					offset -= dx;
					$container.css({
						backgroundPosition: offset
					});
					if (Math.abs(dx) < 0.001) {
						dx = 0;
					}
				}
			};
			setInterval(tick, 16);
		});
	};
}(jQuery));
