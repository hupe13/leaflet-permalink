# Leaflet.Permalink
Adds the maps center and zoom as a permalink for Leaflet maps.

Initially based on the [work](https://github.com/MarcChasse/leaflet.Permalink) of MarcChasse.

## Features

* works with Leaflet 1.9.4
* Should work with all modern browsers
* also works with asynchronously loaded elements
* There may be a problem to detect the initial state if you have a slow loading website or an impatient user.

## Quick Start

1. Create a leaflet map. Checkout Leaflets [Quick Start Guide](http://leafletjs.com/examples/quick-start.html) for a basic map example.

2. [Download](https://raw.githubusercontent.com/hupe13/leaflet-permalink/main/leaflet.permalink.min.js) and include leaflet.permalink.min.js

```html
	<script src="../leaflet.permalink.min.js"></script>
```

3. Add the following code to the map initialization:

```javascript
	// create map
	var map = new L.map(...);
	// call this
	map.whenReady ( function() {
		L.Permalink.setup(map);
	});
```

## Complete Example

see [here](https://github.com/hupe13/leaflet-permalink/blob/main/example/index.html).

Checkout the [DEMO](https://hupe13.github.io/leaflet-permalink/example/).
