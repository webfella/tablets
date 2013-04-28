(function(){

	var	$ = jQuery,
	tabletAds = this.tabletAds = {};

	tabletAds.scratcher = function(image) {
		// setting default paths for images if not passed in
		if (typeof image !== 'object') {
			// back and front images
			image = {
				'back': { 'url':'images/scratch/background-1.jpg', 'img':null },
				'front': { 'url':'images/scratch/foreground-1.jpg', 'img':null }
			};
		}

		var canvas = {'temp':null, 'draw':null}; // temp and draw canvases

		var mouseDown = false;


		/**
		 * Returns true if this browser supports canvas
		 *
		 * From http://diveintohtml5.info/
		 */
		function supportsCanvas() {
			return !!document.createElement('canvas').getContext;
		}

		/**
		 * Helper function to extract the coordinates from an event, whether the
		 * event is a mouse or touch.
		 */
		function getEventCoords(ev) {
			var first, coords = {};
			var origEv = ev.originalEvent; // get from jQuery

			if (origEv.changedTouches !== undefined) {
				first = origEv.changedTouches[0];
				coords.pageX = first.pageX;
				coords.pageY = first.pageY;
			} else {
				coords.pageX = ev.pageX;
				coords.pageY = ev.pageY;
			}

			return coords;
		}

		/**
		 * Helper function to get the local coords of an event in an element,
		 * since offsetX/offsetY are apparently not entirely supported, but
		 * offsetLeft/offsetTop/pageX/pageY are!
		 *
		 * @param elem element in question
		 * @param ev the event
		 */
		function getLocalCoords(elem, coords) {
			var ox = 0, oy = 0;

			// Walk back up the tree to calculate the total page offset of the
			// currentTarget element.  I can't tell you how happy this makes me.
			// Really.
			while (elem !== null) {
				ox += elem.offsetLeft;
				oy += elem.offsetTop;
				elem = elem.offsetParent;
			}

			return { 'x': coords.pageX - ox, 'y': coords.pageY - oy };
		}

		/**
		 * Recomposites the canvases onto the screen
		 *
		 * Note that my preferred method (putting the background down, then the
		 * masked foreground) doesn't seem to work in FF with "source-out"
		 * compositing mode (it just leaves the destination canvas blank.)  I
		 * like this method because mentally it makes sense to have the
		 * foreground drawn on top of the background.
		 *
		 * Instead, to get the same effect, we draw the whole foreground image,
		 * and then mask the background (with "source-atop", which FF seems
		 * happy with) and stamp that on top.  The final result is the same, but
		 * it's a little bit weird since we're stamping the background on the
		 * foreground.
		 *
		 * OPTIMIZATION: This naively redraws the entire canvas, which involves
		 * four full-size image blits.  An optimization would be to track the
		 * dirty rectangle in scratchLine(), and only redraw that portion (i.e.
		 * in each drawImage() call, pass the dirty rectangle as well--check out
		 * the drawImage() documentation for details.)  This would scale to
		 * arbitrary-sized images, whereas in its current form, it will dog out
		 * if the images are large.
		 */
		function recompositeCanvases() {
			var main = $('#scratchandsniff').get(0);
			var tempctx = canvas.temp.getContext('2d');
			var mainctx = main.getContext('2d');

			// Step 1: clear the temp
			canvas.temp.width = canvas.temp.width; // resizing clears

			// Step 2: stamp the draw on the temp (source-over)
			tempctx.drawImage(canvas.draw, 0, 0);

			// Step 3: stamp the background on the temp (!! source-atop mode !!)
			tempctx.globalCompositeOperation = 'source-atop';
			tempctx.drawImage(image.back.img, 0, 0);

			// Step 4: stamp the foreground on the display canvas (source-over)
			mainctx.drawImage(image.front.img, 0, 0);

			// Step 5: stamp the temp on the display canvas (source-over)
			mainctx.drawImage(canvas.temp, 0, 0);

		}

		/**
		 * Draw a scratch line
		 * 
		 * @param can the canvas
		 * @param x,y the coordinates
		 * @param fresh start a new line if true
		 */
		function scratchLine(can, x, y, fresh) {
			var ctx = can.getContext('2d');
			ctx.lineWidth = 45;
			ctx.lineCap = ctx.lineJoin = 'round';
			ctx.strokeStyle = '#f00'; // can be any opaque color
			if (fresh) {
				ctx.beginPath();
				// this +0.01 hackishly causes Linux Chrome to draw a
				// "zero"-length line (a single point), otherwise it doesn't
				// draw when the mouse is clicked but not moved:
				ctx.moveTo(x+0.01, y);
			}
			ctx.lineTo(x, y);
			ctx.stroke();
		}

		/**
		 * Set up the main canvas and listeners
		 */
		function setupCanvases() {
			var c = $('#scratchandsniff').get(0);

			// set the width and height of the main canvas from the first image
			// (assuming both images are the same dimensions)
			c.width = image.back.img.width;
			c.height = image.back.img.height;

			// create the temp and draw canvases, and set their dimensions
			// to the same as the main canvas:
			canvas.temp = document.createElement('canvas');
			canvas.draw = document.createElement('canvas');
			canvas.temp.width = canvas.draw.width = c.width;
			canvas.temp.height = canvas.draw.height = c.height;

			// draw the stuff to start
			recompositeCanvases();

			/**
			 * On mouse down, draw a line starting fresh
			 */
			function mousedown_handler(e) {
				var local = getLocalCoords(c, getEventCoords(e));
				mouseDown = true;

				scratchLine(canvas.draw, local.x, local.y, true);
				recompositeCanvases();

				return false;
			}

			/**
			 * On mouse move, if mouse down, draw a line
			 *
			 * We do this on the window to smoothly handle mousing outside
			 * the canvas
			 */
			function mousemove_handler(e) {
				if (!mouseDown) { return true; }

				var local = getLocalCoords(c, getEventCoords(e));

				scratchLine(canvas.draw, local.x, local.y, false);
				recompositeCanvases();

				return false;
			}

			/**
			 * On mouseup.  (Listens on window to catch out-of-canvas events.)
			 */
			function mouseup_handler() {
				if (mouseDown) {
					mouseDown = false;
					return false;
				}

				return true;
			}

			$('#scratchandsniff').on('mousedown', mousedown_handler)
			.on('touchstart', mousedown_handler);

			$(document).on('mousemove', mousemove_handler);
			$(document).on('touchmove', mousemove_handler);

			$(document).on('mouseup', mouseup_handler);
			$(document).on('touchend', mouseup_handler);
		}

		/**
		 * Set up the DOM when loading is complete
		 */
		function loadingComplete() {
			$('#loading').hide();
			$('#main').show();
		}

		/**
		 * Handle loading of needed image resources
		 */
		function loadImages() {
			var loadCount = 0;
			var loadTotal = 0;

			function imageLoaded() {
				loadCount++;

				if (loadCount >= loadTotal) {
					setupCanvases();
					loadingComplete();
				}
			}

			for (var k in image) {
				if (image.hasOwnProperty(k)) {
					loadTotal++;
					image[k].img = document.createElement('img'); // image is global
					$(image[k].img).on('load', imageLoaded);
					image[k].img.src = image[k].url;
				}
			}
		}

		/**
		 * Handle page load
		 */
		$(function() {
			if (supportsCanvas()) {
				loadImages();
			} else {
				$('#loading').hide();
				$('#lamebrowser').show();
			}
		});

	};

}).call(this);