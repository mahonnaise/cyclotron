# jquery.cyclotron.js

## Option 1: Create an element with a background image and class cyclotron.

```html
<div class="cyclotron" style="background:url(panorama.jpg);height:512px"></div>
```

## Option 2: Cyclotronify existing objects with additional options

```javascript
$(document).ready(function() {
	$('.cycle').cyclotron({dampingFactor:1,autorotation:2});
});
```

## Options

`dampingFactor`
*default*: 0.93  
Thit is the factor of slowing down rotation (0:immideate stop, 1:continuous rotation). **Hint:** Choose a value around 0.9  
If the value is out of range (0..1) it is reset to the default value

`historySize`
*default*: 5  
The size of the array which stores the deltas

`autorotation`
*default*:0  
The value of autorotation will be used for rotation after the image is loaded. **Hint:** You have to set dampingFactor to 1 to prevent slowdown

`continuous`
*default*: 1  
If continuous is set 0 the rotation is stopped at the border of the image. This is useful if your image is not a 360° image. **Hint:** continuous also can be set to 0 by adding the class "nonContinuous"