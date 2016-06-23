$(function() {
	if(isMonthly) {
	} else {
		var now = getNow();
	}
	$.ajax({
		type: 'GET',
		url: '/menu/' + now.year + now.month + '.json',
		datatype: 'json',
		success: function(json) {
			// onlyDev
			if(location.href.match(/localhost/)) {
				json = $.parseJSON(json);
			}
			var html = '';
			for(var i=0, len=json.length; i<len; i++) {
				var item = json[i];
				if(i == 0) {
					var h2 = MONTH[item.month - 1] + '<span class="small">' + item.month + '月</span>';
					$('h2').html(h2);
				} else {
					var bf = item.breakfast;
					var lc = item.lunch;
					var dn = item.dinner;
					var isToday = now.today == now.year + now.month + zero(item.date);
					if(!bf.wes && !lc.main && !dn.a) {
						html += makeNoMenu(now.year, now.month, item.date, isToday);
					} else {
						html += makeMenuItem(bf, lc, dn, now.year, now.month, item.date, isToday);
					}
					if(isToday) {
						var tomorrow = json[i+1];
						makeNextMenu(item, tomorrow, now);
					}
				}
			}
			$('#menuArchives').html(html);

			makePopup();
			setupPopupHistory();

			// メニューポップアップ実装
			$('.openMenuPopup').click(function() {
				var year = $(this).data('year');
				var month = $(this).data('month');
				var date = $(this).data('date');
				makeMenuPopup(json, year, month, date);
			});

			if( !isMonthly ) {
				makeNextMenu(json, now);
			}
		},
		error: function() {
			makePopup();
			alert('Sorry not found')
		}
	});
});

var makeNoMenu = function(year, month, date, isToday) {
	var d = newDate(year, month, date);
	var day = d.getDay();
	var w = WEEK[day];
	if(isToday) {
		var html = '<li class="archives-item today '
			+ ((day == 0) ? 'sun' : (day == 6) ? 'sat' : '')
			+ '">';
	} else {
		var html = '<li class="archives-item '
			+ ((day == 0) ? 'sun' : (day == 6) ? 'sat' : '')
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

var getNow = function() {
	var d = new Date();
	var tmp = {};
	tmp['year'] = d.getFullYear();
	tmp['month'] = zero(d.getMonth() + 1);
	tmp['date'] = zero(d.getDate());
	tmp['hour'] = zero(d.getHours());
	tmp['min'] = zero(d.getMinutes());
	tmp['today'] = tmp['year'] + tmp['month'] + tmp['date'];
	return tmp;
}

var makeNextMenu = function(data, tomorrow, now) {
	var html, time;
	var time = now.hour + now.min
	// at morning
	if( time < 840 ) {
		html = generateNextHTML(data.breakfast, 0);
		time = '朝';
	}
	// at evening
	else if( time >= 840 && time < 1250 ) {
		html = generateNextHTML(data.lunch, 1);
		time = '昼';
	}
	// at night
	else if( time >= 1250 && time < 1940 ) {
		html = generateNextHTML(data.dinner, 2);
		time = '夜';
	} else {
		console.log('mid night')
		html = generateNextHTML(tomorrow.breakfast, 0);
		time = '明日 朝';
	}
	$('#nextMenuList').html(html);
	$('#nextTime').prepend(time);
}

var generateNextHTML = function(data, time) {
	var html = '';
	if(time == 0) {
		if(data.jap == '' || data.wes == '') {
			html += '<li class="main">' + (data.jap == '' ? data.wes : data.jap) + '</li>';
		} else {
			html += '<li class="main">' + data.jap + ' / ' + data.wes + '</li>';
		}
	} else if(time == 1) {
		html += '<li class="main">' + data.main + '</li>';
	} else {
		html += '<li class="main dinnerA">' + data.a + '</li>'
			  + '<li class="main dinnerB">' + data.b + '</li>';
	}
	for(var i=0, len=data.sides.length; i<len; i++) {
		html += '<li class="side">' + data.sides[i] + '</li>';
	}
	$('#nextMenuList').html(html);
}