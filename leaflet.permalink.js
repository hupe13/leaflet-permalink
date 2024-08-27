L.Permalink = {
	setup: function (map) {
		'use strict';
		let debug = false;
		if (debug) {
			map.on(
				"moveend",
				function (e) {
					console.log( "moveend zoom " + map.getZoom() );
				}
			);
		}
		var shouldUpdate    = true;
		var updatePermalink = function () {
			// console.log( "updatePermalink shouldUpdate",shouldUpdate );
			// console.log( "updatePermalink reload",map.options.reload );
			if (map.options.reload) {
				// do not update the URL when the user has gone back to the first call in the browser history
				map.options.reload = false;
				return;
			}
			if ( ! shouldUpdate) {
				// do not update the URL when the view was changed in the 'popstate' handler (browser history navigation)
				shouldUpdate = true;
				return;
			}
			if ( ! map.options.initZoom && ! map.options.initCenter) {
				// wait for user interaction
				return;
			}

			var center = map.getCenter();
			var hash   = '#' +
			Math.round( center.lat * 100000 ) / 100000 + ',' +
			Math.round( center.lng * 100000 ) / 100000 + ',' +
			map.getZoom() + 'z';
			var state  = {
				zoom: map.getZoom(),
				center: center
			};
			if (debug) {
				console.log( "old ",window.location.hash," new ", hash );
			}
			if (window.location.hash !== hash) {
				if (debug) {
					console.log( "new location" );
				}
				window.history.pushState( state, 'map', hash );
			}
		};
		// end updatePermalink

		// if the init url is with a hash
		if (window.location.hash !== '') {
			var hash  = window.location.hash.replace( '#', '' );
			var parts = hash.split( ',' );
			if (parts.length === 3) {
				map.options.initCenter = {
					lat: parseFloat( parts[0] ),
					lng: parseFloat( parts[1] )
				};
				map.options.initZoom   = parseInt( parts[2].slice( 0, -1 ), 10 );
				map.setView( map.options.initCenter,map.options.initZoom );
				if (debug) {
					console.log( "init fixed", map.options.initCenter,map.options.initZoom );
				}
			}
		} else {
			// we don't know, when all elements are loaded on the map
			// whenReady: https://leafletjs.com/reference.html#map-whenready
			// so we wait for first user interaction
			document.getElementsByClassName( 'leaflet-container' )[0]
			.addEventListener(
				'pointermove',
				() =>
				{
						// try to store initial center and zoom
						map.options.initZoom   = map.getZoom();
						map.options.initCenter = map.getCenter();
					if (debug) {
						console.log( "init", map.options.initCenter,map.options.initZoom );
					}
				},
				{
					capture: true, once: true
				}
			);
		}

		if (debug) {
			console.log( "trigger moveend" );
		}
		map.on( 'moveend', updatePermalink );

		// restore the view state when navigating through the history, see
		// https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
		window.addEventListener(
			'popstate',
			function (event) {
				if (debug) {
					console.log( 'popstate' );
				}
				if (event.state === null) {
					return;
				}
				map.setView( event.state.center, event.state.zoom );
				shouldUpdate = false;
			}
		);
		// if the user goes back and forward
		window.addEventListener(
			'hashchange',
			function (event) {
				// console.log( 'hashchange shouldUpdate',shouldUpdate,window.location.hash );
				if (shouldUpdate) {
					if (window.location.hash !== '') {
						var hash  = window.location.hash.replace( '#', '' );
						var parts = hash.split( ',' );
						if (parts.length === 3) {
							let center = {
								lat: parseFloat( parts[0] ),
								lng: parseFloat( parts[1] )
							};
							let zoom   = parseInt( parts[2].slice( 0, -1 ), 10 );
							map.setView( center,zoom );
						}
					} else {
						if (debug) {
							console.log( "should reload" );
						}
						map.options.reload = true;
						map.setView( map.options.initCenter,map.options.initZoom );
					}
				}
			}
		);
	}
};
