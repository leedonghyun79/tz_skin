// placeholder
$(function() {
    function loginPlaceholder(){
        if ($('.xans-member-login').val() != undefined) {
            var loginId = $('#member_id').parent().attr('title');
            $('#member_id').attr('placeholder', loginId);
            $('#member_passwd').attr('placeholder', 'Password');
        }
    }
    loginPlaceholder();

    // ── 비회원 주문조회 폼을 기존회원 탭 아래(fieldset 앞)로 이동 ──
    var $noMemberForm = $('.xans-myshop-orderhistorynologin .login .form').detach();
    if ($noMemberForm.length) {
        $noMemberForm.addClass('tz-nologin-form').hide();
        // 기존회원 fieldset 바로 앞에 삽입 (탭 아래, 폼과 동일 위치)
        $('.xans-member-login fieldset.form').before($noMemberForm);

        // placeholder 설정
        var defaults = ['주문자명', '주문번호', '비회원주문 비밀번호'];
        $noMemberForm.find('input[type="text"], input[type="password"]').each(function(i) {
            if (!$(this).attr('placeholder')) {
                var title = $(this).attr('title') || $(this).closest('label').attr('title') || defaults[i] || '';
                $(this).attr('placeholder', title);
            }
        });

        // 비회원 파라미터가 있을 때 초기 상태를 비회원 탭으로 설정
        if (location.search.indexOf('noMemberOrder') !== -1) {
            $('.xans-member-login .ec-base-tab .menu li').removeClass('selected');
            $('.xans-member-login .ec-base-tab .menu li:last-child').addClass('selected');
            $('.xans-member-login fieldset.form').hide();
            $('.tz-nologin-form').show();
        }
    }

    // 아래 탭·nologin 모듈 전체 숨김
    $('.xans-myshop-orderhistorynologin').hide();

});

// keyboard
$('.keyboard button').on('click', function(){
    if($(this).hasClass('selected')==true){
        $('.keyboard .btnKey').removeClass('selected');
        $('.view div').hide();
    }
    else{
        $('.keyboard .btnKey').removeClass('selected');
        $('.view div').hide();
        $(this).addClass('selected');
        var key=$(this).attr('title');
        $(this).parent().next().children('.'+key+'').show();
    }
});

// ── 탭 전환 (URL 이동 방식) ──
$('body').on('click', '.xans-member-login .ec-base-tab a', function(e) {
    var _target = $(this).attr('href');
    
    if (_target === '#member') {
        if (location.search.indexOf('noMemberOrder') !== -1) {
            e.preventDefault();
            location.href = '/member/login.html';
        } else {
            e.preventDefault(); // 이미 기존회원이면 아무 동작 안함
        }
    } else {
        if (location.search.indexOf('noMemberOrder') === -1) {
            e.preventDefault();
            location.href = '/member/login.html?noMemberOrder&returnUrl=%2Fmyshop%2Forder%2Flist.html';
        } else {
            e.preventDefault(); // 이미 비회원이면 아무 동작 안함
        }
    }
});