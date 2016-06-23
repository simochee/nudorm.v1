$(function() {
	var params = getParams();
	$('#search .search-word').val(params.wd);
	$('h2').append(params.wd);
	startSearch(params.wd);
});

var startSearch = function(key) {
	$.getJSON('/menu/index.json', function(json) {
		var result = [];
		getSearchResult(key, result, json, 0, 0);
	});
}

var getSearchResult = function(key, result, json, y, m) {
	$.getJSON('/menu/' + json[y].year + zero(json[y].month[m]) + '.json', function(data) {
		result.push(search(key, data, json[y].year, json[y].month[m]));
		if(json[y].month[m+1]) {
			getSearchResult(key, result, json, y, m+1);
		} else if(!json[y+1].end) {
			getSearchResult(key, result, json, y+1, 0);
		} else {
			makeResultList(result);
		}
	});
}

var search = function(key, data, year, month) {
	var tmp = [{year: year, month: month}];
	for(var i=0, len=data.length; i<len; i++) {
		if( i ) {
			var item = data[i];
			if( ~item.breakfast.wes.indexOf(key) ||
				~item.breakfast.jap.indexOf(key) ||
				~item.lunch.main.indexOf(key) || 
				~item.dinner.a.indexOf(key) || 
				~item.dinner.b.indexOf(key) || 
				indexOfArray(key, item.breakfast.sides) ||
				indexOfArray(key, item.lunch.sides) || 
				indexOfArray(key, item.dinner.sides) ) {
				tmp.push(item);
			}
		}
			
	}
	return tmp;
}

var indexOfArray = function(key, arr) {
	for(var i=0, len=arr.length; i<len; i++) {
		if( ~arr[i].indexOf(key)) {
			return true;
		}
	}
	return false;
}

var makeResultList = function(result) {
	var html = '';
	for(var i=0, iLen=result.length; i<iLen; i++) {
		var data = result[i];
		for(var j=0, jLen=data.length; j<jLen; j++) {
			var item = data[j];
			if( j ) {
				html += makeMenuItem(item.breakfast, item.lunch, item.dinner, data[0].year, data[0].month, item.date, false);
				if( j == jLen - 1) {
					html += '</ol>';
				}
			} else {
				html += '<h3>' + MONTH[item.month - 1] + '<span class="small">' + data[0].year + '<span class="label">年</span>' + item.month + '<span class="label">月</span></span></h3><ol class="menu-archives">'
			}
		}
	}
	$('#resultList').html(html);

	makePopup();
	setupPopupHistory();

	$('.openMenuPopup').click(function() {
		var year = $(this).data('year');
		var month = $(this).data('month');
		var date = $(this).data('date');
		var json = getJSONItem(result, year, month, date);
		makeMenuPopup(json, year, month, date);
	});
}

var getJSONItem = function(json, year, month, date) {
	for(var i=0, iLen=json.length; i<iLen; i++) {
		var data = json[i];
		if(data[0].year == year && data[0].month == month) {
			return data;
		}
	}
}