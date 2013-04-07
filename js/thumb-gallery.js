define(['jquery'],function($){

	$.fn.thumbgallery = function(){

		var $self = this,

			// number of images in the gallery
			n = this.children().size(),

			// currently displaying child
			i = 0,

			width = $self.width(), 
			offset = $self.offset().left;

		this
		.on('mouseenter', function(){
			width = $self.width();
			offset = $self.offset().left;
		})
		.on('mousemove', function(e){
			
			// 0 -> 1
			var prop = (e.pageX - offset) / width;

			var next = Math.floor(prop * n);

			next = Math.min(next, n-1);
			if(next != i){
				var $c = $self.children();

				$c.eq(i).hide();
				$c.eq(next).show();

				i = next;
			}
		})

		.children().prop('draggable', false)
		;
	}


	return function(el){

		$(el).thumbgallery();

	}
});