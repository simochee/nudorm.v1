var week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
$(function() {
	var now = new Date();
	var nowYear = now.getFullYear();
	var nowMonth = zero(now.getMonth () + 1, 2);
	var nowDate = zero(now.getDate(), 2);
	var today = nowYear + nowMonth + nowDate;
	$.ajax({
		type: 'GET',
		url: 'menu/' + nowYear + '' + nowMonth + '.json',
		datatype: 'json',
		success: function(json) {
			// only dev
			if(location.href == 'http://localhost:3000/') {
				var json = $.parseJSON(json);
			}
			var html = '';
			$.each(json, function(i, item) {
				if(i == 0) {
					var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
					var h2 = month[item.month - 1] + '<span class="small">' + item.month + '月</span>';
					$('h2').html(h2);
				} else {
					var bf = item.breakfast;
					var lc = item.lunch;
					var dn = item.dinner;
					var isToday = today == nowYear + nowMonth + zero(item.date, 2) ? true : false;
					if(!bf.wes || !lc.main || !dn.a) {
						html += notfoundMenu(nowYear, nowMonth, item.date, isToday);
					} else {
						html += normalMenu(bf, lc, dn, nowYear, nowMonth, item.date, isToday)
					}
				}
			})
			$('#menuArchives').html(html);
			activities(json, nowYear, nowMonth);
		},
		error: function() {
			alert('file not fount!');
		}
	});
});

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

var getSides = function(items) {
	var html = '';
	for(var i=0; i<items.length; i++) {
		html += '<span class="side">' + items[i] + '</span>';
	}
	return html;
}

var notfoundMenu = function(year, month, date, flag) {
	var d = new Date( year + '-' + month + '-' + zero(date, 2) );
	var w = week[d.getDay()];
	if(flag) {
		var html = '<li class="archives-item today '
			+ ((d.getDay() == 0) ? 'sun' : (d.getDay() == 6) ? 'sat' : '')
			+ '">';
	} else {
		var html = '<li class="archives-item '
			+ ((d.getDay() == 0) ? 'sun' : (d.getDay() == 6) ? 'sat' : '')
			+ '">';
	}
	html += 
		// Add date
		  '<div class="archive-date">' + date + '<span class="week">' + w + '</span></div>'
		// Add undefined area
		+ '<div class="archive-notfound"><span class="ion icon"></span></div>'
		// Close elements
		+ '</li>'
	return html;
}

var activities = function(json, year, month) {
	$('.open-popup').click(function() {
		$('body').addClass('bg-mode');
		$(window).not('#popup').on('touchmove.noScroll', function(e) {
			e.preventDefault();
		});
		var date = $(this).data('date');
		var dateElem = $(this).find('.archive-date').html();
		generatePopup(json, year, month, date, dateElem);
		$('#popup').delay(50).fadeIn('fast');
	});
}

var generatePopup = function(json, year, month, date, dateElem) {
	var d = new Date( year + '-' + month + '-' + zero(date, 2) );
	var data = $.grep(json, function(ele, index) {
		return (ele.date == date);
	})
	var bf = data[0].breakfast;
	var lc = data[0].lunch;
	var dn = data[0].dinner;
	var html = 
		// Add date
		  '<div class="date-area '
			+ ((d.getDay() == 0) ? 'sun' : (d.getDay() == 6) ? 'sat' : '')
		+ '">' + dateElem + '</div>'
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
		+ '<div class="close-area"><button id="closePopup" class="close-btn">閉じる</button></div>';
	$('#popupContent').html(html);
	$('#closePopup').click(function() {
		$('body').removeClass('bg-mode');
		$(window).off('.noScroll');
		$('#popup').fadeOut('fast');
	})
}