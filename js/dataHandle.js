var listArray=new Array();//初始数据
var listBuffer = [];
var selectOptions = ['特色餐饮','时尚购物','生活服务','精品酒店','休闲娱乐','运动健身','美容养生','母婴亲子','旅游出行','家电数码','教育培训'];
var selectOption = [];
var selectBuffer = [];
var cityBuffer = [];//城市排序数据
var arrayBuffer = [];//城市无条件搜索数据
var shopBuffer =[];//商户搜索数据
//获取定位
getLoction();


//下拉菜单隐藏
$('body').on('tap','.mui-page-content',function(){
	if($('#bank-type-select > span').attr('data-flag')){
		$('#bank-type-select').removeClass('active').children('.mui-scroll-wrapper').addClass('mui-hidden');
		$('#bank-type-select > span').removeAttr('data-flag');
	}
});
//下拉菜单显示
$('.bank-type-select').on('tap', function(){
	var _this=$(this).find('span')
	if(_this.next().hasClass('mui-hidden')){
		_this.next().removeClass('mui-hidden').parent().addClass('active'); 
		setTimeout(function(){
			_this.attr('data-flag',1)
		},100);	
	}

});
//下拉菜单选择option搜索数据
$('.bank-type-select').on('tap', 'p', function(e){
	$(this).parent().parent().addClass('mui-hidden').prev().text($(this).text()).parent().removeClass('active'); 
	$('#bank-type-select > span').attr('data-value',$(this).attr('data-value')).removeAttr('data-flag');
	if($('#bank-activity-txtsearch').val()==''){
		handleData($(this).attr('data-value'),listBuffer,2);
	}else{
		handleData($(this).attr('data-value'),shopBuffer,2);
	}	
});


//活动规则弹窗
$("#ActivityRule").on('tap', function() {
	mui('#alertBox .mui-scroll-wrapper').scroll().scrollTo(0,0,0);
	$('.alert-backdrop,.alerttips').show();
});
//活动规则弹窗隐藏
$('.alert-button').on('tap',function(){
	$('.alert-backdrop,.alerttips').hide();
})


//首页地址文字点击切换
$('.AddressTxt').on('tap',function(){
	if($('#AddressTxt').attr('data-flag')=="false"){
		insertNumber();
		$('#AddressTxt').attr('data-flag','true');
	}
	$('#citySearch').val('').parent().removeClass('mui-active');
	$('#bank-type-select .mui-scroll-wrapper').addClass('mui-hidden');
	indexedList.search('');
});


//子地址页面城市列表搜索
$('#Address .mui-indexed-list').on('tap','.bank-action-back',function(){
	shopBuffer=[];
	localStorage.setItem('city',$(this).attr('data-value').substr(0,$(this).attr('data-value').indexOf('市')))
	handleData($(this).attr('data-value'),listArray,1);
	typeSelect();
	$('.AddressTxt').text($(this).attr('data-value').substr(0,$(this).attr('data-value').indexOf('市')));
	$('#searchShopTxt').val('');
	$('#bank-activity-txtsearch').val('');
	$('#shopIcon').addClass('mui-hidden');
	$('#SearchList .mui-table-view').empty().append('<li class="mui-table-view-cell">暂无数据！</li>');
	$('#bank-type-select>span').text('全部分类');
	viewApi.back();
})
//子地址页面地址热门城市点击搜索
$('#Address .mui-city-list').on('tap','span',function(){
	shopBuffer=[];
	localStorage.setItem('city',$(this).text())
	handleData($(this).text(),listArray,1);
	typeSelect();
	$('.AddressTxt').text($(this).text());
	$('#searchShopTxt').val('');
	$('#bank-activity-txtsearch').val('');
	$('#shopIcon').addClass('mui-hidden');
	$('#SearchList .mui-table-view').empty().append('<li class="mui-table-view-cell">暂无数据！</li>');
	$('#bank-type-select>span').text('全部分类');
	viewApi.back();
})

//input框焦点
$('#bank-activity-txtsearch').on('tap',function(){
	$(this).blur();
})


//商户搜索-查询结果点击返回主页面
$('#SearchList .mui-scroll-wrapper').on('tap','.shop-action-back',function(){
	if(shopBuffer.length>0){
		shopBuffer.sort(by("Distance"));
		var temp=shopBuffer[$(this).index()];
		shopBuffer.splice($(this).index(),1);
		shopBuffer.unshift(temp);
		//var temph=$('#SearchList .mui-table-view li').eq($(this).index()).html();
		//$('#SearchList .mui-table-view li').eq($(this).index()).remove();
		//$('#SearchList .mui-table-view').prepend('<li class="mui-table-view-cell shop-action-back">'+ temph +'</li>');
		//shopBuffer.unshift(temph);
		//$('#SearchList .mui-table-view li').eq(0).html($('#SearchList .mui-table-view li').eq($(this).index()).html());
		//$('#SearchList .mui-table-view li').eq($(this).index()).html(temph);

		//shopBuffer[0]=shopBuffer[$(this).index()];
		//shopBuffer[$(this).index()]=temp;
		//listBuffer=shopBuffer;
		arrayBuffer=shopBuffer;
		loadData(shopBuffer);
	}else{
		loadData(shopBuffer);
	}
	viewApi.back();
	$('#bank-activity-txtsearch').val($('#searchShopTxt').val());
	$('#bank-type-select>span').text('全部分类').attr('data-value','');
});
//商户搜索子页面按钮点击返回
$('#SearchList .bank-icon-arrowleft').on('tap',function(){
	if(shopBuffer.length>0){
		arrayBuffer=shopBuffer;
		loadData(shopBuffer);
		$('#bank-activity-txtsearch').val($('#searchShopTxt').val());
	}else{
		handleData('',listBuffer,1);
	}
	$('#searchShopTxt').blur();
	$('#bank-type-select>span').text('全部分类').attr('data-value','');	
	viewApi.back();
})



//获取定位
function getLoction(){
	$('.loading,.alert-backdrop').show();
	if(localStorage.getItem('city')&&localStorage.getItem('lo-city')==localStorage.getItem('city')&&sessionStorage.getItem('addComp')){
	   $('.AddressTxt').text(localStorage.getItem('city'));
	   getData();
	   return false;
	}
	try{
		var geolocation = new BMap.Geolocation();
	}catch(e){
		$('.AddressTxt').text('全国'); 
		$('#locationGps').text('GPS定位');
		$('#locationTxt').removeClass('mui-hidden');
	    sessionStorage.setItem('addComp',JSON.stringify({"lat":0,"lng":0}));
	    getData(); 
	    return false;
	}
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
				sessionStorage.setItem('addComp',JSON.stringify({"lat":lat,"lng":lng}));
				getData();
			});
		}else{
		    $('.AddressTxt').text('全国'); 
		    $('#locationGps').text('GPS定位');
		    $('#locationTxt').removeClass('mui-hidden');
		    sessionStorage.setItem('addComp',JSON.stringify({"lat":0,"lng":0}));
		    getData();
		}
		
	},function(error){
		var innerHTML='';
		$('.AddressTxt').text('全国'); 
		$('#locationGps').text('GPS定位');
		$('#locationTxt').removeClass('mui-hidden');
		getData();
		sessionStorage.setItem('addComp',JSON.stringify({"lat":0,"lng":0}));
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

//初始化数据
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
			typeSelect();
			$('.loading,.alert-backdrop').hide();
		},
		error:function(){
			$('.loading,.alert-backdrop').hide();
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
	    	shopHtml='<li class="mui-table-view-cell">暂无数据！</li>'
	    }
	    $('#SearchList .mui-table-view').empty().append(shopHtml);
   }else{
   	    shopBuffer=[];
   	    $('#SearchList .mui-table-view').empty().append('<li class="mui-table-view-cell">无搜索关键字！</li>');
   }
}


//关键字处理数据
function handleData(keys,data,typeFun){
	var addComp=JSON.parse(sessionStorage.getItem('addComp'));
	if(addComp == null ){
		addComp={"lat":0,"lng":0}
	}
	var keyword = (keys || '');
    arrayBuffer=[];
	if(keyword){
		if(typeFun == 1){
			data.forEach(function(item,index){
				if(keyword && item.TheCity.indexOf(keyword) > -1 ){
					item.Distance= getDistance(addComp.lng,addComp.lat,item.Lng,item.Lat);
					//Object.assign(item,{"Distance":getDistance(addComp.lng,addComp.lat,item.Lng,item.Lat)});
					arrayBuffer.push(item);
				}
			});
		}else if(typeFun == 2){
			data.forEach(function(item,index){
				if(keyword && item.MerchantNumber==keyword){
					//Object.assign(item,{"Distance":index})
					arrayBuffer.push(item);
				}
			});			
		}
	}else{
		arrayBuffer = data;
	}
    arrayBuffer=arrayBuffer.sort(by("Distance"))
	if(typeFun == 1){
		listBuffer = arrayBuffer;
		console.log(listBuffer);
	}else if(typeFun == 2){
		selectBuffer = arrayBuffer;
		console.log(selectBuffer);
	}
	loadData(arrayBuffer);
	
}


//页面渲染数据
function loadData(data){
	console.log(data);
	var _data= (data || '');
	$('#pullrefresh .mui-table-view').empty();
	mui('#pullrefresh').pullRefresh().refresh(true);
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
			_strHtml+='<span class="bank-card">建行信用卡</span>';
			_strHtml+='</div>';
			_strHtml+='</a>';
			_strHtml+='</li>';

			$('#pullrefresh .mui-table-view').append(_strHtml);
		    mui('#pullrefresh').pullRefresh().scrollTo(0,0,100);
		}
	}else{
		$('#pullrefresh .mui-table-view').append('<li class="mui-table-view-cell mui-media" id="NoData" style="font-size:14px">暂无数据！</li>');
	    mui('#pullrefresh').pullRefresh() .scrollTo(0,0,100)
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
    for (var i = 0; i < 26; i++) {
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


//分类检索
function typeSelect(){
	selectOption=[];
	var optionArray = [];
	arrayBuffer.forEach(function(item,index){
		if(!optionArray[item.MerchantNumber]){
			optionArray[item.MerchantNumber] = true;
			selectOption.push(item.MerchantNumber);
		}
	});
	var _li='<p data-value="" class="bank-type-item">全部分类</p>';
	for(var i=0; i < selectOption.length; i++){
		_li+='<p data-value="'+ selectOption[i] +'" class="bank-type-item">'+selectOptions[selectOption[i]-1]+'</p>' 
	}
	$('#bank-type-select .mui-scroll').empty().html(_li).css('transform','translate3d(0px, 0px, 0px) translateZ(0px)').next().children('.mui-scrollbar-indicator').css('transform','translate3d(0px, 0px, 0px) translateZ(0px)');
	$('#bank-type-select .mui-scroll-wrapper').css('height',(selectOption.length+1)*0.7+'rem')
}



//地理位置两点距离计算
function getDistance(longitude1,latitude1,longitude2,latitude2) {
    // 维度
    var lat1 = (Math.PI / 180) * latitude1;
    var lat2 = (Math.PI / 180) * latitude2;
    // 经度
    var lon1 = (Math.PI / 180) * longitude1;
    var lon2 = (Math.PI / 180) * longitude2;
    // 地球半径
    var R = 6371;
    // 两点间距离 km，如果想要米的话，结果*1000就可以了
    var d = Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)) * R;
    return d * 1000;
}