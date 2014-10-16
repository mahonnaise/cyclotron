(function ($) {
	$.fn.cyclotron = function (options) {
		var settings = $.extend({
			dampingFactor: 0.93,
			historySize: 5,
			lock: false
		}, options);
		return this.each(function () {
			var container, sx, dx = 0, armed, offset = 0, tick, prev, h = [], maxScroll, windowWidth;
			container = $(this);
			windowWidth = $(window).width();

			if (settings.lock == true) {
				container.css({
					'background-position': '0px 50%',
					'background-repeat': 'no-repeat'
				});
				var img = new Image();
				img.src = container.css('background-image').replace(/url\(|\)$/ig, "");
				$(img).load(function (){
					maxScroll = img.width - windowWidth
				})
			}

			container.mousedown(function (e) {
				sx = e.pageX - offset;
				armed = true;
				e.preventDefault();
			});
			container.mousemove(function (e) {
				var px;
				if (armed) {
					px = e.pageX;
					if (prev === undefined) {
						prev = px;
					}
					offset = px - sx;
					if (h.length > settings.historySize) {
						h.shift();
					}
					h.push(prev - px);

					if (settings.lock == true) {
						offset > 0 ? offset = 0 : "";
						offset < (1-maxScroll) ? offset = (1-maxScroll) : "";
					}
					container.css('background-position', offset);

					prev = px;
				}
			});
			container.bind('mouseleave mouseup', function () {
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
					if (settings.lock == true) {
						offset > 0 ? offset = 0 : "";
						offset < (1-maxScroll) ? offset = (1-maxScroll) : "";
					}
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