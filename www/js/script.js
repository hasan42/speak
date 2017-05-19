

function resize() {
	w_w = $(window).width();
	w_h = $(window).height();
	if( w_w > 768){ //десктоп
		var w_h_ss = w_h - 120;
		if( w_h_ss > 300 ){
			$(".media-item").css("height", w_h_ss);
		}
	}else{//мобильник
	}
}

$(window).scroll(function(){

});

$(window).on("resize",function(){
    resize();
});

$(document).ready(function() {

	resize();

	$(".header-menu__item_submenu").click(function() {
		var data_for = $(this).attr("data-for");
		$(".header-submenu__inner").hide();
		$(".header-submenu__inner[data-for='"+data_for+"']").show();
		$(".header-menu__item_submenu").removeClass("active");
		$(".header-submenu").addClass("active");
		$(this).addClass("active");
	});
	$(".header-submenu__close").click(function() {
		$(".header-submenu").removeClass("active");
		$(".header-menu__item_submenu").removeClass("active");
	});

	$('.media-block').slick({//слайдер на главной
        slidesToShow: 1,
		slidesToScroll: 1,
        dots:true,
        arrows: true,

    });

	$(".features-item").hover(
		function () {
	        $(this).removeClass('out').addClass('over');
	    },
	    function () {
	        $(this).removeClass('over').addClass('out');
	    }
    );

});

$(document).mouseup(function (e) {
    var container = $(".header-submenu");
    if (container.has(e.target).length === 0){
        container.removeClass("active");
    }
});

