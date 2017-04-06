var listArray=new Array();//初始数据
var listBuffer = [];
var selectBuffer =[];
var arrayBuffer = [];//城市无条件搜索数据
var cityBuffer = [];//城市排序数据
var shopBuffer =[];//商户搜索发数据
//获取定位
getLoction();
//getData()

$('body').on('tap','.mui-page-content',function(){
	if($('#bank-type-select > span').attr('data-flag')){
		$('#bank-type-select').removeClass('active').children('.mui-scroll-wrapper').addClass('mui-hidden');
		$('#bank-type-select > span').removeAttr('data-flag');
	}
});



$('.bank-type-select').on('tap', function(){
	var _this=$(this).find('span')
	if(_this.next().hasClass('mui-hidden')){
		_this.next().removeClass('mui-hidden').parent().addClass('active'); 
		setTimeout(function(){
			_this.attr('data-flag',1)
		},100);	
	}

});




$('.bank-type-select').on('tap', 'p', function(e){
	$(this).parent().parent().addClass('mui-hidden').prev().text($(this).text()).parent().removeClass('active'); 
	$('#bank-type-select > span').removeAttr('data-flag');
	handleData($(this).attr('data-value'),listBuffer,2);	
});

$("#ActivityRule").on('tap', function() {
	var _rule='<p class="bank-rule-tips">在指定商户刷龙卡信用卡，<i>每笔消费金额100元（含）以内部分，享第一次7折、第二次5折、第三次3折，</i>活动期间连环享受，每天限享1次。</p>';
	_rule+='<p class="bank-rule-list">连环折优惠，自第一笔消费开始，消费金额100元（含）以内部分可依次享受7折、5折、3折连环优惠，第4次刷卡将重新开始累计。</p>';
	_rule+='<p class="bank-rule-list">活动期间每客户每天限享受一档连环折1次，每客户在活动期间最多享受18轮连环折优惠。每笔消费金额超出100元的部分，不享受连环折优惠。</p>';
	_rule+='<p class="bank-rule-list">同一客户以客户在刷卡交易时在POS机上输入的手机号、卡号前6位和卡号后4位作为身份识别，如因持卡人前后更换手机号造成信息无法匹配的，责任由持卡人自负。</p>';
	_rule+='<p class="bank-rule-list">有关售货、商品服务等问题执行相关商业法律规定，由持卡人与商户协商解决，建设银行不承担责任。</p>';
	_rule+='<p class="bank-rule-list">持卡人若在活动期间有逾期还款、违反中国建设银行龙卡信用卡章程、领用协议或其他约定条款、或出现账户状态不正常，建行有权取消其参加活动的资格。</p>';
	_rule+='<p class="bank-rule-list">对于持卡人存在非真实交易、分单交易等恶意规避活动规则的行为，建设银行有权取消其参加活动的资格，并保留采取相应法律措施的权利。</p>';
	_rule+='<p class="bank-rule-list">建设银行有权依据法律、法规、规章或业务需要终止或取消此次活动或者修改活动方案，并经相关途径公告后生效。在法律许可范围内，建设银行保留对本活动的解释权。</p>';
	$('#alertBox .bank-rule-content').append(_rule);
	$('.alert-backdrop,.alerttips').show()
});

$('.alert-button').on('tap',function(){
	$('.alert-backdrop,.alerttips').hide();
	$('#alertBox .bank-rule-content').empty();
})



//地址切换
$('.AddressTxt').on('tap',function(){
	if($('#AddressTxt').attr('data-flag')=="false"){
		insertNumber();
		$('#AddressTxt').attr('data-flag','true');
	}
	$('#citySearch').val('').parent().removeClass('mui-active');
	$('#bank-type-select .mui-scroll-wrapper').addClass('mui-hidden');
	indexedList.search('');
});


//地址搜索
$('#Address .mui-indexed-list').on('tap','.bank-action-back',function(){
	localStorage.setItem('city',$(this).attr('data-value').substr(0,$(this).attr('data-value').indexOf('市')))
	handleData($(this).attr('data-value'),listArray,1);
	$('.AddressTxt').text($(this).attr('data-value').substr(0,$(this).attr('data-value').indexOf('市')));
	$('#searchShopTxt').val('');
	$('#bank-activity-txtsearch').val('');
	$('#shopIcon').addClass('mui-hidden');
	$('#SearchList .mui-table-view').empty().append('<li class="mui-table-view-cell mui-action-back">暂无数据！</li>');
	$('#bank-type-select>span').text('全部分类');
	viewApi.back();
})

$('#Address .mui-city-list').on('tap','span',function(){
	localStorage.setItem('city',$(this).text())
	handleData($(this).text(),listArray,1);
	$('.AddressTxt').text($(this).text());
	$('#searchShopTxt').val('');
	$('#bank-activity-txtsearch').val('');
	$('#shopIcon').addClass('mui-hidden');
	$('#SearchList .mui-table-view').empty().append('<li class="mui-table-view-cell mui-action-back">暂无数据！</li>');
	$('#bank-type-select>span').text('全部分类');
	viewApi.back();
})


//商户搜索
$('#SearchList .mui-scroll-wrapper').on('tap','.shop-action-back',function(){
	if(shopBuffer.length>0){
		var temph=$('#SearchList .mui-table-view li').eq(0).html();
		$('#SearchList .mui-table-view li').eq(0).html($('#SearchList .mui-table-view li').eq($(this).index()).html());
		$('#SearchList .mui-table-view li').eq($(this).index()).html(temph);
		var temp=shopBuffer[0];
		shopBuffer[0]=shopBuffer[$(this).index()];
		shopBuffer[$(this).index()]=temp;
		//listBuffer=shopBuffer;
		arrayBuffer=shopBuffer;
		loadData(shopBuffer);
	}else{
		loadData(shopBuffer);
	}
	viewApi.back();
	$('#bank-activity-txtsearch').val($('#searchShopTxt').val());
	$('#bank-type-select>span').text('全部分类');
});

$('#SearchList .bank-icon-arrowleft').on('tap',function(){
	if(shopBuffer.length>0){
		var temph=$('#SearchList .mui-table-view li').eq(0).html();
		$('#SearchList .mui-table-view li').eq(0).html($('#SearchList .mui-table-view li').eq($(this).index()).html());
		$('#SearchList .mui-table-view li').eq($(this).index()).html(temph);
		var temp=shopBuffer[0];
		shopBuffer[0]=shopBuffer[$(this).index()];
		shopBuffer[$(this).index()]=temp;
		//listBuffer=shopBuffer;
		arrayBuffer=shopBuffer;
		loadData(shopBuffer);
	}else{
		loadData(shopBuffer);
	}
	viewApi.back();
	$('#bank-activity-txtsearch').val($('#searchShopTxt').val());
	$('#bank-type-select>span').text('全部分类');
})




//获取定位
function getLoction(){
	if(localStorage.getItem('city')&&localStorage.getItem('lo-city')==localStorage.getItem('city')){
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
				localStorage.setItem('lo-city',cityTxt);
				getData();
			});
		}else{
		    $('.AddressTxt').text('全国'); 
		    getData();
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
			if($('.mui-indexed-list-group').length <= 1){
				citySort(listArray);
			}
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
		   	   shopHtml+='<li class="mui-table-view-cell shop-action-back">'+ shop.StoreName +'</li>'
		    });
	    }else{
	    	shopBuffer=[];
	    	shopHtml='<li class="mui-table-view-cell shop-action-back">暂无数据！</li>'
	    }
	    $('#SearchList .mui-table-view').empty().append(shopHtml);
   }else{
   	    shopBuffer=listBuffer;
   	    $('#SearchList .mui-table-view').empty().append('<li class="mui-table-view-cell shop-action-back">无搜索关键字！</li>');
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
			if(_data[i].MerchantDiscountRate<10){
				_strHtml+='<span>'+ _data[i].MerchantDiscountRate +'<i>折</i></span>';
			}else{
				_strHtml+='<span class="bank-hidden">'+ _data[i].MerchantDiscountRate +'<i>折</i></span>';
			}
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
		cityHtml+='<li data-value="'+item.TheCity+'" data-tags="'+item.TheCityToCh+'" class="mui-table-view-cell mui-indexed-list-item bank-action-back">'+item.TheCity+'</li>'
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