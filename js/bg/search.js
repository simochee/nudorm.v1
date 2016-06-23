$(function() {
	var params = getParams();
	$('#search .search-word').val(params['wd']);
	$('h2').html('<span class="ion-ios-search"></span> ' + params['wd']);
	// searchAll(params['wd']);
	search(params['wd']);
})

var getParams = function() {
	var url = location.href;
	var params = url.split('?');
	var spparams = params[1].split('&');
	var paramArray = [];
	for(var i=0; i<spparams.length; i++) {
		var vol = spparams[i].split('=');
		paramArray.push(vol[0]);
		paramArray[vol[0]] = decodeURI(vol[1]);
	}
	return paramArray;
}

var search = function(key) {
	$.getJSON('/menu/index.json', function(json) {
		var result = [];
		getResult(key, result, json, 0, 0);
	})
}

var getResult = function(key, result, json, y, m) {
	var month = json[y].month[m];
	$.getJSON('/menu/' + json[y].year + zero(json[y].month[m], 2) + '.json', function(data) {
		var result = explorer(key, data);
		if(json[y].month[m+1]) {
			getResult(key, result, json, y, m+1);
		} else {
			if( !json[y+1].end ) {
				getResult(key, result, json, y+1, 0);
			} else {
				$.each(result, function(i, item) {
					$('#menuArchives').append(normalMenu(item.breakfast,
							   item.lunch,
							   item.dinner,
							   json[y].year,
							   json[y].month[m],
							   item.date,
							   false));
				});
			}
		}
	});
}

var explorer = function(key, data) {
	var tmp = [];
	$.each(data, function(i, item) {
		if(i) {
			if( ~item.breakfast.wes.indexOf(key) ||
				~item.breakfast.jap.indexOf(key) ||
				~item.lunch.main.indexOf(key) || 
				~item.dinner.a.indexOf(key) || 
				~item.dinner.b.indexOf(key) ) {
				tmp.push(item);
			} else {
				if( indexOfArray(item.breakfast.sides, key) ) { 
					tmp.push(item);
				}
			}
		}
	});
	return tmp;
}

var indexOfArray = function(arr, key) {
	var len = arr.length;
	for(var i=0; i<len; i++) {
		if( ~arr[i].indexOf(key) ) {
			return true;
		}
	}
	return false;
}

var getMenuList = function(mode) {
	$.ajax({
		type: 'GET',
		url: '/menu/index.json',
		datatype: 'json',
		success: function(json) {
			// only dev
			if(location.href.match(/localhost/)) {
				json = $.parseJSON(json);
			}
			console.log('in fn', json);
			return json;
		}
	})
}