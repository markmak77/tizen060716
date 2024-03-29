/**
 * 
 */
function getFeed() {
	var FEED_URL = "http://www.3dnews.ru/news/rss/";
	var baseName = "filesBase3",	storeName = "filesStore";
	var width = screen.width;
	var db = openDatabase(baseName, '1', 'Test_DB', 200000);
	
	db.transaction(function (tx){
		tx.executeSql('CREATE TABLE IF NOT EXISTS '+storeName+' (title TEXT, description TEXT, image TEXT)', [], null, function(e){console.log(e)});
	});

	$(document).ready(
			function() {
				$.ajax({
					type : "GET",
					url : FEED_URL,
					dataType : "xml",
//					error : getStorage(function(res) {
//						for ( var field in res) {
//							for ( var fieldVal in (value = res[field])) {
//								switch (fieldVal) {
//								case 'title':
//									var title = value[fieldVal];
//									break;
//								case 'description':
//									var description = value[fieldVal];
//									break;
//								case 'url_img':
//									var url_img = value[fieldVal];
//									break;
//								}
//							}
//							$("#rssContent").append(
//									'<div class="feed"><div class="image"><img src='
//											+ url_img + ' width=' + width
//											+ 'px /></div><div class="title">'
//											+ title
//											+ '</div><div class="description">'
//											+ description + '</div></div>');
//						}
//
//					}),
					success : xmlParser
				});
			});

	function xmlParser(xml) {
		//var arr = [];
		//var i = 0;
		//clearStorage();
		db.transaction(function (tx){
			tx.executeSql('DROP TABLE ' + storeName, [], null, function(e){console.log('drop error')});
			tx.executeSql('CREATE TABLE IF NOT EXISTS '+storeName+' (title TEXT, description TEXT, image TEXT)', [], null, function(e){console.log('recreate error')});
			console.log('cleared DB');
		});
		$(xml)
				.find("item")
				.each(
						function() {
							var url_img = $(this).find("enclosure").attr("url");
							var title = $(this).find("title").text();
							var description = $(this).find("description")
									.text();

							$("#rssContent").append(
									'<div class="feed"><div class="image"><img src='
											+ url_img + ' width=' + width
											+ 'px /></div><div class="title">'
											+ title
											+ '</div><div class="description">'
											+ description + '</div></div>');
							
							db.transaction(function (tx){
								tx.executeSql('INSERT INTO '+storeName+' (title, description, image) VALUES (?, ?, ?)', [title, description, url_img], null, function(){console.log("insert error")});
							});

// arr[i] = {
// url_img : url_img,
// title : title,
// description : description
// };
							// setData(arr[i]);
							//i++;
						});
	}
}

/*var indexedDB = window.indexedDB || window.mozIndexedDB
		|| window.webkitIndexedDB || window.msIndexedDB, 
		IDBTransaction = window.IDBTransaction
		|| window.webkitIDBTransaction || window.msIDBTransaction, 
		baseName = "filesBase", 
		storeName = "filesStore";

function logerr(err) {
	console.log(err);
}

function connectDB(f) {
	var request = indexedDB.open(baseName, 1);
	request.onerror = logerr;
	request.onsuccess = function() {
		f(request.result);
	}
	request.onupgradeneeded = function(e) {
		var objectStore = e.currentTarget.result.createObjectStore(storeName, {
			autoIncrement : true
		});
		connectDB(f);
	}
}

function getData(key, f) {
	connectDB(function(db) {
		var request = db.transaction([ storeName ], "readonly").objectStore(
				storeName).get(key);
		request.onerror = logerr;
		request.onsuccess = function() {
			f(request.result ? request.result : -1);
		}
	});
}

function getStorage(f) {
	connectDB(function(db) {
		var rows = [], store = db.transaction([ storeName ], "readonly")
				.objectStore(storeName);

		if (store.mozGetAll)
			store.mozGetAll().onsuccess = function(e) {
				f(e.target.result);
			};
		else
			store.openCursor().onsuccess = function(e) {
				var cursor = e.target.result;
				if (cursor) {
					rows.push(cursor.value);
					cursor.continue();
				} else {
					f(rows);
				}
			};
	});
}

function setData(obj) {
	connectDB(function(db) {
		var request = db.transaction([ storeName ], "readwrite").objectStore(
				storeName).add(obj);
		request.onerror = logerr;
		request.onsuccess = function() {
			return request.result;
		}
	});
}

function delData(key) {
	connectDB(function(db) {
		var request = db.transaction([storeName], "readwrite").objectStore(storeName).delete(key);
		request.onerror = logerr;
		request.onsuccess = function() {
			console.log("File deleted from DB:", file);
		}
	});
}

function clearStorage() {
	connectDB(function(db) {
		var request = db.transaction([ storeName ], "readwrite").objectStore(
				storeName).clear();
		;
		request.onerror = logerr;
		request.onsuccess = function() {
			console.log("Clear");
		}
	});
}*/
