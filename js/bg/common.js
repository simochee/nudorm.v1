$(function() {
	$('.scrollTop').click(function(e) {
		e.preventDefault();
		if($(this).attr('id') == 'footerScrollTop') {
			$('#scrollTop').addClass('hide');
		}
		$('body,html').animate({
			scrollTop: 0
		}, {
			duration: 200, easing: 'swing',
			complete: function() {
				$('#scrollTop').removeClass('hide');
			}
		});
	});
	$('a[href^=#]:not(.hash)').click(function(e) {
		e.preventDefault();
		var href = $(this).attr('href');
		var target = $(href == "#" || href == "" ? 'html' : href);
		var pos = target.offset().top - 30;
		$('body,html').animate({scrollTop:pos}, 250, 'swing');
	});

	$('#searchBtn').click(function() {
		$('body').addClass('bg-mode');
		$('#search').delay(50).fadeIn('fast');
		$(window).on('touchmove.noScroll', function(e) {
			e.preventDefault();
		});
		$('.closePopup').click(function() {
			$('#search').fadeOut('fast');
			$('body').removeClass('bg-mode');
		})
	})
})

$(window).load(function() {
	showScrollTop();
	$(window).scroll(function() {
		showScrollTop();
	});
});

var showScrollTop = function() {
	var $ele = $('#scrollTop');
	var winH = $(window).height();
	var eleH = $('.container').height();
	var scrT = $(window).scrollTop();
	console.log(winH, eleH);
	if(scrT < 150 || scrT > eleH - (winH + 170) || $ele.hasClass('hide')) {
		$ele.fadeOut();
	} else {
		$ele.fadeIn();
	}
}

var zero = function(val, n) {
	return ('00000000' + val).slice(-n);
}







var normalMenu = function(bf, lc, dn, year, month, date, flag) {
	var d = new Date( year + '-' + month + '-' + zero(date, 2) );
	var w = week[d.getDay()];
	var html = '';
	if(flag) {
		// Today
		html += '<li class="archives-item today '
				+ ((d.getDay() == 0) ? 'sun' : (d.getDay() == 6) ? 'sat' : '')
			+ '" id="today">'
			// Add date
			+ '<div class="archive-date">' + date + '<span class="week">' + w + '</span></div>'
			// Add menus list
			+ '<ol class="archive-list">'
			// Add breakfast
			+ '<li class="list-item"><div class="label">朝</div><div class="menu breakfast">'
				+ '<span class="main">' + (bf.jap ? (bf.jap + ' / ' + bf.wes) : bf.wes) + '</span>'
				+ '<hr class="partition">'
				+ getSides(bf.sides)
			+ '</div></li>'
			// Add lunch
			+ '<li class="list-item"><div class="label">昼</div><div class="menu lunch">'
				+ '<span class="main">' + lc.main + '</span>'
				+ '<hr class="partition">'
				+ getSides(lc.sides)
			+ '</div></li>'
			// Add dinner
			+ '<li class="list-item"><div class="label">夜</div><div class="menu dinner">'
				+ '<span class="main">' + dn.a + '</span>'
				+ '<span class="main">' + dn.b + '</span>'
				+ '<hr class="partition">'
				+ getSides(dn.sides)
			+ '</div></li>'
			// Close element
			+ '</ol></li>';
	} else {
		// Others
		html += '<li class="archives-item open-popup '
				+ ((d.getDay() == 0) ? 'sun' : (d.getDay() == 6) ? 'sat' : '')
			+ '" data-date="' + date + '">'
			// Add date
			+ '<div class="archive-date">' + date + '<span class="week">' + w + '</span></div>'
			// Add main menus list
			+ '<ol class="archive-list">'
			// Add breakfast
			+ '<li class="list-item"><div class="label">朝</div><div class="menu breakfast">'
				+ '<span>' + (bf.jap ? (bf.jap + ' / ' + bf.wes) : bf.wes) + '</span>'
			+ '</div></li>'
			// Add lunch
			+ '<li class="list-item"><div class="label">昼</div><div class="menu lunch">'
				+ '<span>' + lc.main + '</span>'
			+ '</div></li>'
			// Add dinner
			+ '<li class="list-item"><div class="label">夜</div><div class="menu dinner">'
				+ '<span>' + dn.a + '</span>'
				+ '<span>' + dn.b + '</span>'
			+ '</div></li>'
			// Close element
			+ '</ol></li>';
	}
	return html;
}