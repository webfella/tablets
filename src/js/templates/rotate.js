(function(){

	var	$ = jQuery,
	tabletAds = this.tabletAds = {};

	tabletAds.rotation = function() {
		document.body.addEventListener('touchmove',function(event){ event.preventDefault(); },false);
		$('.background').spritespin({
      width:        640,
      height:       437,
      frames:       34,
      resX:         21760,
      resY:         437,
      sense:        -1,
      source:       'images/rotate/bike34x1_big.jpg',
      enableCanvas: true
		});
	};

}).call(this);