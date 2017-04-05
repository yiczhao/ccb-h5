var listArray=new Array();
var listBuffer = [];
var selectBuffer =[];
var arrayBuffer = [];
var cityBuffer = [];
var shopBuffer =[];
//获取定位
getLoction();
//getData()





$('.bank-type-select').on('tap', function(){
	var _this=$(this).find('span')
	_this.next().removeClass('mui-hidden').parent().addClass('active'); 
});


$('.bank-type-select').on('tap', 'p', function(){
	$(this).parent().parent().addClass('mui-hidden').prev().text($(this).text()).parent().removeClass('active'); 
	handleData($(this).attr('data-value'),listBuffer,2);
});

$('.AddressTxt').on('tap',function(){
	if($('#AddressTxt').attr('data-flag')=="false"){
		insertNumber();
		$('#AddressTxt').attr('data-flag','true');
	}
});

$('#Address .mui-indexed-list').on('tap','.mui-action-back',function(){
	localStorage.setItem('city',$(this).attr('data-value').substr(0,$(this).attr('data-value').indexOf('市')))
	handleData($(this).attr('data-value'),listArray,1);
	$('.AddressTxt').text($(this).attr('data-value').substr(0,$(this).attr('data-value').indexOf('市')))
})

$('#SearchList .mui-scroll-wrapper').on('tap','.mui-action-back',function(){

	if(shopBuffer.length>0){
		var temp=shopBuffer[0];
		shopBuffer[0]=shopBuffer[$(this).index()];
		shopBuffer[$(this).index()]=temp;
		listBuffer=shopBuffer;
		loadData(shopBuffer);
	}else{
		handleData(localStorage.getItem('city'),listArray,1);
	}

	$('#bank-activity-txtsearch').val($('#searchShopTxt').val())
});


//获取定位
function getLoction(){
	if(localStorage.getItem('city')){
	   $('.AddressTxt').text(localStorage.getItem('city'));
	   getData();
	   return false;
	}
	var geolocation = new BMap.Geolocation();
	geolocation.getCurrentPosition(function(r) {
		if (this.getStatus() == BMAP_STATUS_SUCCESS) {
			var gc = new BMap.Geocoder();
			gc.getLocation(r.point, function(rs) {
				var addComp = rs.addressComponents;
				lng=rs.point.lng;
				lat=rs.point.lat;
				//addComp.province  addComp.city  addComp.district;
				var cityTxt= addComp.city.substring(0,addComp.city.length-1);
				$('.AddressTxt').text(cityTxt);
				$('#locationGps').text('GPS定位');
				$('#locationTxt').removeClass('mui-hidden');
				localStorage.setItem('city',cityTxt);
			});
		}else{
		    $('.AddressTxt').text('全国'); 
		}
	},function(error){
		var innerHTML='';
		getData();
		switch(error.code) { 
	        case error.PERMISSION_DENIED: 
	            innerHTML="用户拒绝对获取地理位置的请求。" 
	            break; 
	        case error.POSITION_UNAVAILABLE: 
	            innerHTML="位置信息是不可用的。" 
	            break; 
	        case error.TIMEOUT: 
	            innerHTML="请求用户地理位置超时。" 
	            break; 
	        case error.UNKNOWN_ERROR: 
	            innerHTML="未知错误。" 
	            break; 
	    } 

		mui.alert(innerHTML);
	});
	//更新数据

}

//获取原始数据
function getData(){
	$.ajax({
		type:"get",
		url:"js/Json.txt",
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		async:true,
		success:function(data){
			listArray=JSON.parse(data);
			citySort(listArray);
			handleData(localStorage.getItem('city'),listArray,1);
		},
		error:function(){
			
		}
	});
}

//商户列表模糊搜索
function shopList(keys){
   var keyword = (keys || '');
   shopBuffer=[];
   if(keyword){
   	   listBuffer.forEach(function(item){
			if(keyword && item.StoreName.indexOf(keyword) > -1 ){
				shopBuffer.push(item);
			}
	    });
	    var shopHtml='';
	    if(shopBuffer.length>0){
	    	shopBuffer.forEach(function(shop){
		   	   shopHtml+='<li class="mui-table-view-cell mui-action-back">'+ shop.StoreName +'<span class="mui-pull-right">约1个结果</span></li>'
		    });
	    }else{
	    	shopHtml='<li class="mui-table-view-cell mui-action-back">暂无数据！</li>'
	    }
	    $('#SearchList .mui-table-view').empty().append(shopHtml);
   }else{
   	    $('#SearchList .mui-table-view').empty().append('<li class="mui-table-view-cell mui-action-back">暂无数据！</li>');
   }
}

function handleData(keys,data,typeFun){
	var keyword = (keys || '');
    arrayBuffer=[];
	if(keyword){
		if(typeFun == 1){
			data.forEach(function(item){
				if(keyword && item.TheCity.indexOf(keyword) > -1 ){
					arrayBuffer.push(item);
				}
			});
		}else if(typeFun == 2){
			data.forEach(function(item){
				if(keyword && item.MerchantNumber==keyword){
					arrayBuffer.push(item);
				}
			});			
		}
	}else{
		arrayBuffer = data;
	}

	if(typeFun == 1){
		listBuffer = arrayBuffer;
		console.log(listBuffer);
	}else if(typeFun == 2){
		selectBuffer = arrayBuffer;
		console.log(selectBuffer);
	}
	loadData(arrayBuffer);
	
}


//加载数据
function loadData(data){
	var _data= (data || '');
	$('#pullrefresh .mui-table-view').empty();
	if(_data.length>0){
		for (var i = 0; i < _data.length; i++) {
			if (i > 9){
				break;
			}
            var _strHtml='';
			_strHtml+='<li class="mui-table-view-cell mui-media">';
			_strHtml+='<a href="javascript:;">';
			_strHtml+='<div class="mui-media-body mui-pull-left">';
			_strHtml+=_data[i].StoreName;	
			_strHtml+='<p class="mui-ellipsis bank-icon-location">'+ _data[i].MerchantAddress +'</p>';
			_strHtml+='</div>';
			_strHtml+='<div class="bank-content-right">';
			_strHtml+='<span>'+ _data[i].MerchantDiscountRate +'<i>折</i></span>';
			_strHtml+='<span class="bank-card">建行龙卡</span>';
			_strHtml+='</div>';
			_strHtml+='</a>';
			_strHtml+='</li>';
			$('#pullrefresh .mui-table-view').append(_strHtml).parent().css("transform", "translate3d(0px, 0px, 0px)");
		}

	}else{
		$('#pullrefresh .mui-table-view').append('<li class="mui-table-view-cell mui-media" style="font-size:14px">暂无数据！</li>').parent().css("transform", "translate3d(0px, 0px, 0px)")
	}

}


//城市排序
function citySort(data){
	cityBuffer = data.sort(by("TheCityToCh"));
	console.log(cityBuffer);
	var cityHtml='';
	cityBuffer = cityBuffer.unique();	
	cityBuffer.forEach(function(item){
		cityHtml+='<li data-value="'+item.TheCity+'" data-tags="'+item.TheCityToCh+'" class="mui-table-view-cell mui-indexed-list-item mui-action-back">'+item.TheCity+'</li>'
	});
	$('#city-hot-list').after(cityHtml);
}


//城市去重
Array.prototype.unique = function(){
    var result = [], hash = {};
    var elem;
    this.forEach(function(item){
    	elem=item.TheCityToCh
    	if(elem){
    		if (!hash[elem]) {
	            result.push(item); 
	            hash[elem] = true;
	        }
    	}
    	
    })
    return result;
}

//插入首字母
function insertNumber() {
    for (var i = 0; i < 25; i++) {
        (function (upperCaseNum, lowerCaseNum, doc) {
            var caseStr = '<li data-group="' + upperCaseNum + '" class="mui-table-view-divider mui-indexed-list-group">' + upperCaseNum + '</li>'
            var self = doc.find('li[data-tags^="' + lowerCaseNum + '"]');
            doc.find('li[data-tags^="' + upperCaseNum + '"]').first().before(caseStr);
        })(String.fromCharCode((65 + i)), String.fromCharCode((97 + i)), $('#Address'))
    }
}

//字符串比较
function by(name){
    return function(o, p){
        var a, b;
        if (typeof o === "object" && typeof p === "object" && o && p) {
            a = o[name];
            b = p[name];
            if (a === b) {
                return 0;
            }
            if (typeof a === typeof b) {
                return a < b ? -1 : 1;
            }
            return typeof a < typeof b ? -1 : 1;
        }
        else {
            throw ("error");
        }
    }
}