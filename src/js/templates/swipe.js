(function(){

	var	$ = jQuery,
	tabletAds = this.tabletAds = {};

	tabletAds.swiper = function() {
		var overlay = $('.overlay');
		document.body.addEventListener('touchmove',function(event){ event.preventDefault(); },false);
		$('body').on('movestart', function(e) {
			if ((e.distX > e.distY && e.distX < -e.distY) || (e.distX < e.distY && e.distX > -e.distY)) {
				e.preventDefault();
				return;
			}
			if (e.distX > 0) {
				if (overlay.css('left') === '1024px') {
					e.preventDefault();
					return;
				}
				overlay.data('direction', 'left');
			} else {
				if (overlay.css('left') === '0px') {
					e.preventDefault();
					return;
				}
				overlay.data('direction', 'right');
			}
		})
		.on('move', function(e) {
			var left = 1000 * e.distX / overlay.width(),
			direction = overlay.data('direction');
			if ((direction === 'left') && (e.distX < overlay.width())) {
				overlay.css({
					'left': left + 'px',
					'background-position': '-' + left + 'px 0'
				});
			} else if ((direction === 'right')) {
				overlay.css({
					'left': overlay.width() + left + 'px',
					'background-position': - (overlay.width() + left) + 'px 0'
				});
			}
		})
		.on('moveend', function(e) {
			if (e.distX > (overlay.width() / 2)) {
				overlay.animate({
					'left': overlay.width(),
					'background-position-x': '-' + overlay.width() + 'px'
				}, 100);
			} else {
				overlay.animate({
					'left': 0,
					'background-position-x': 0
				}, 100);
			}
		});
	};

}).call(this);