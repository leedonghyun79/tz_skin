/* 인스타그램   */
var feed = new Instafeed({
	get: 'user',
	resolution: 'low_resolution',
	userId: '고객 유저 넘버',
	limit: '4', // 총 출력 이미지갯수
	accessToken: '인스타그램 토큰넘버',
	template: '<a href="{{link}}" target="_blank"><img src="{{image}}" /></a>'
});
feed.run();

jQuery(document).ready(function() {	
	setTimeout(function(){
		var instafeed_now = jQuery('#instagramWidgetManual iframe').html();
		var instafeed_now2 = jQuery('.main_insta_box #instafeed').html();

		/* 인스타그램이 없다면 실행 */
		if ( instafeed_now != false && instafeed_now2 == '' )  {
			jQuery('.main_insta_box').html('<img src="/images/instafeed_m.JPG" style="width:90%;margin-top:20px;">').css('text-align','center');
		}
	}, 500);
});