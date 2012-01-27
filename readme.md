# jquery.cyclotron.js

1. You need some element with a background image. E.g.

	<div class="cycle" style="background:url(panorama.jpg);height:512px"></div>

2. Cyclotronify:

	$(document).ready(function ($) {
		$('.cycle').cyclotron();
	});

3. Options:

`dampingFactor` - should be somewhere around 0.9, should be > 0 and < 1 (default: 0.93)

`historySize` - size of the array which stores the deltas (default: 5)