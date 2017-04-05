<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1, user-scalable=no">
		<title>建行“百城万店”</title>
		<link rel="stylesheet" href="css/mui.min.css" />
		<link rel="stylesheet" type="text/css" href="css/bankactivity.css"/>
	</head>
	<body>
		<div class="mui-content bank-activity">
			<header class="bank-activity-head">
				<div class="bank-activity-content">
					<span class="mui-icon bank-icon-location">苏州</span>
					<input type="text" class="bank-activity-txtsearch" placeholder="请输入商户名" />
				</div>
				<div class="bank-type-content">
					<div class="bank-type-select">
						全部分类
					</div>
				</div>
			</header>
			<section>
				
				<div class="mui-content bank-shop-list">
					<ul class="mui-table-view">
						<li class="mui-table-view-cell mui-media">
							<a href="javascript:;">
								<div class="mui-media-body mui-pull-left">
									有家酸菜鱼
									<p class='mui-ellipsis'>想要这样一间小木屋，夏天挫冰吃瓜，冬天围炉取暖.</p>
								</div>
								<div class="bank-content-right">
									<span>8.5<i>折</i></span>
									<span class="bank-card">建行龙卡</span>
								</div>
							</a>
						</li>
						<li class="mui-table-view-cell mui-media">
							<a href="javascript:;">
								<div class="mui-media-body mui-pull-left">
									有家酸菜鱼
									<p class='mui-ellipsis'>想要这样一间小木屋，夏天挫冰吃瓜，冬天围炉取暖.</p>
								</div>
								<div class="bank-content-right">
									<span>8.5<i>折</i></span>
									<span class="bank-card">建行龙卡</span>
								</div>
							</a>
						</li>
						<li class="mui-table-view-cell mui-media">
							<a href="javascript:;">
								<div class="mui-media-body mui-pull-left">
									有家酸菜鱼
									<p class='mui-ellipsis'>想要这样一间小木屋，夏天挫冰吃瓜，冬天围炉取暖.</p>
								</div>
								<div class="bank-content-right">
									<span>8.5<i>折</i></span>
									<span class="bank-card">建行龙卡</span>
								</div>
							</a>
						</li>
						<li class="mui-table-view-cell mui-media">
							<a href="javascript:;">
								<div class="mui-media-body mui-pull-left">
									有家酸菜鱼
									<p class='mui-ellipsis'>想要这样一间小木屋，夏天挫冰吃瓜，冬天围炉取暖.</p>
								</div>
								<div class="bank-content-right">
									<span>8.5<i>折</i></span>
									<span class="bank-card">建行龙卡</span>
								</div>
							</a>
						</li>
					</ul>
				</div>
			</section>
			<footer></footer>
		</div>
		<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
	    <script type="text/javascript" src="js/rem.js"></script>
		<script src="http://cdn.bootcss.com/zepto/1.2.0/zepto.min.js"></script>
		<script type="text/javascript">
			//通过config接口注入权限验证配置
			wx.config({
			    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			    appId: 'wx797ea56b36d19147', // 必填，公众号的唯一标识
			    timestamp: '<?php echo time();?>', // 必填，生成签名的时间戳
			    nonceStr: '<?php echo $nonceStr;?>', // 必填，生成签名的随机串
			    signature: '<?php echo $signature;?>',// 必填，签名
			    jsApiList: [] // 必填，需要使用的JS接口列表
			});
			
			wx.checkJsApi({
			    jsApiList: ['chooseImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
			    success: function(res) {}
			        // 以键值对的形式返回，可用的api值true，不可用为false
			        // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
			        
			});
			
			//通过ready接口处理成功验证
			wx.ready(function(){
				// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后
			});
		</script>
	</body>
</html>
