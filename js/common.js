var MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

$(function() {
	console.time('timer');
	setTimeout(function() {
		console.timeEnd('timer')
	})
	// ページトップへ戻るボタン実装
	$('.scrollTop').click(function(e) {
		e.preventDefault();
		if($(this).attr('id') == 'footerScrollTop') {
			$('#scrollTop').addClass('hide');
		}
		$('body,html').animate({
			scrollTop: 0
		}, {
			duration: 400,
			easing: 'swing',
			complete: function() {
				$('#scrollTop').removeClass('hide');
			}
		});
	});

	// アンカーリンク
	$('a[href^=#]').not('.hash').click(function(e) {
		e.preventDefault();
		var href = $(this).attr('href');
		var target = $(href == "#" || href == "" ? 'html' : href);
		var pos = target.offset().top - 30;
		$('body,html').animate({scrollTop:pos}, 250, 'swing');
	});

	$(window).on('popstate', function(e) {
		var state = e.originalEvent.state;
		console.log(state)
		if(state) {
			$('body').removeClass('bg-mode');
			$('.container').off('.noScroll');
			$('.popup').fadeOut('fast');
			history.replaceState('popup', null, '#');
		} else {
			return;
		}
	});
});

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
	if(scrT < 150 || scrT > eleH - (winH + 170) || $ele.hasClass('hide')) {
		$ele.fadeOut();
	} else {
		$ele.fadeIn();
	}
}

// メニュー表示関連関数
var makeMenuItem = function(bf, lc, dn, year, month, date, isToday) {
	var d = newDate(year, month, date);
	var day = d.getDay();
	var w = WEEK[day];
	var html = '';
	if(isToday) {
		html += '<li class="archives-item today '
				+ ((day == 0) ? 'sun' : (day == 6) ? 'sat' : '')
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
		html += '<li class="archives-item open-popup openPopup openMenuPopup '
				+ ((day == 0) ? 'sun' : (day == 6) ? 'sat' : '')
			+ '" data-year="' + year + '" data-month="' + month + '" data-date="' + date + '" data-target="#menuPopup">'
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

var getSides = function(items) {
	var html = '';
	for(var i=0, len=items.length; i<len; i++) {
		html += '<span class="side">' + items[i] + '</span>';
	}
	return html;
}

// 画面操作関連
var makePopup = function() {
	$('.openPopup').click(function() {
		$('body').addClass('bg-mode');
		var target = $(this).data('target');
		$(target).delay(50).fadeIn('fast');
		$('.container').on('touchmove.noScroll', function(e) {
			e.preventDefault();
		});
		window.history.pushState('popup', null, '#popup');
	});
	closePopup();
}

var closePopup = function() {
	$('.closePopup').click(function() {
		$('body').removeClass('bg-mode');
		$('.container').off('.noScroll');
		$('.popup').fadeOut('fast');
		history.replaceState('popup', null, '#');
	});
}

var setupPopupHistory = function() {
	history.replaceState('popup', null, '#');
}

var makeMenuPopup = function(json, year, month, date) {
	var d = newDate(year, month, date);
	var day = d.getDay();
	var data = $.grep(json, function(ele, i) {
		return (ele.date == date);
	});
	var bf = data[0].breakfast;
	var lc = data[0].lunch;
	var dn = data[0].dinner;
	var html = 
		// Add date
		  '<div class="date-area '
			+ ((day == 0) ? 'sun' : (day == 6) ? 'sat' : '')
		+ '">' + date + '<span class="week">' + WEEK[day] + '</span></div>'
		+ '<div class="menu-area"><ol class="menu-list">'
		// Add breakfast
		+ '<li class="list-item"><div class="label">朝</div>'
		+ '<div class="menu breakfast">'
			+ '<span class="main">' + (bf.jap ? (bf.jap + ' / ' + bf.wes) : bf.wes) + '</span>'
			+ getSides(bf.sides)
		+ '</div></li>'
		// Add lunch
		+ '<li class="list-item"><div class="label">昼</div>'
		+ '<div class="menu lunch">'
			+ '<span class="main">' + lc.main + '</span>'
			+ getSides(lc.sides)
		+ '</div></li>'
		// Add dinner
		+ '<li class="list-item"><div class="label">夜</div>'
		+ '<div class="menu dinner">'
			+ '<span class="main">' + dn.a + '</span>'
			+ '<span class="main">' + dn.b + '</span>'
			+ getSides(dn.sides)
		+ '</div></li>'
		// Close elements
		+ '</ol></div>'
		// Add close area
		+ '<div class="close-area"><button class="close-btn closePopup">閉じる</button></div>';
	$('#popupContent').html(html);

	closePopup();
}

// 汎用関数
var newDate = function(year, month, date) {
	var d = new Date(year + '-' + zero(month) + '-' + zero(date));
	return d;
}

var getParams = function() {
	var url = location.href;
	var params = url.split('?');
	var spparams = params[1].split('&');
	var paramArray = [];
	for(var i=0; i<spparams.length; i++) {
		var vol = spparams[i].split('=');
		paramArray.push(vol[0]);
		paramArray[vol[0]] = decodeURI(vol[1]).replace('#', '');
	}
	return paramArray;
}

var zero = function(val, n) {
	var fig = n === undefined ? 2 : n;
	return ('0000000' + val).slice(-fig);
}