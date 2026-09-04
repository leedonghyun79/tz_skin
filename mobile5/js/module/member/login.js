// 로그인폼 placeholder 추가
$(function() {
    function loginPlaceholder(){
        if ($('.tz-member-outer').val() != undefined) {
            $('#member_id').attr('placeholder', '아이디');
            $('#member_passwd').attr('placeholder', '패스워드');
        }
    }
    loginPlaceholder();

    // ── 비회원 주문조회 폼을 기존회원 탭 아래(formBox 앞)로 이동 ──
    var $noMemberForm = $('.tz-nomember-outer .formBox').detach();
    var $memberFieldset = $('.tz-member-outer .loginWrap fieldset');
    
    if ($noMemberForm.length) {
        $noMemberForm.addClass('tz-nologin-form').hide();
        // 기존회원 formBox 바로 앞에 삽입
        $memberFieldset.find('.formBox').first().before($noMemberForm);

        // placeholder 설정
        var defaults = ['주문자명', '주문번호', '비회원주문 비밀번호'];
        $noMemberForm.find('input[type="text"], input[type="password"]').each(function(i) {
            if (!$(this).attr('placeholder')) {
                $(this).attr('placeholder', defaults[i] || '');
            }
        });

        // 비회원 파라미터가 있을 때 초기 상태를 비회원 탭으로 설정
        if (location.search.indexOf('noMemberOrder') !== -1) {
            $('.tz-member-outer .ec-base-tab li').removeClass('selected');
            $('.tz-member-outer .ec-base-tab li:last-child').addClass('selected');
            
            // 기존 회원 폼 내용 숨기기
            $memberFieldset.find('.formBox:not(.tz-nologin-form)').hide();
            $('.tz-member-outer .loginHeader').hide(); // 비회원 땐 키보드 숨김
            
            // 뽑아온 비회원 폼 내용 보여주기
            $('.tz-nologin-form').show();
        }
    } else {
        // 비회원 폼이 렌더링되지 않았는데 비회원 파라미터로 들어온 경우 (강제 리다이렉트)
        if (location.search.indexOf('noMemberOrder') !== -1 || location.hash.indexOf('noMember') !== -1) {
            var qs = location.search;
            if (qs.indexOf('noMemberOrder') === -1) {
                qs += (qs.indexOf('?') !== -1 ? '&' : '?') + 'noMemberOrder';
            }
            if (qs.indexOf('returnUrl') === -1) {
                qs += '&returnUrl=%2Fmyshop%2Forder%2Flist.html';
            }
            location.replace(location.pathname + qs);
            return;
        }
    }

    // 아래 탭·nologin 모듈 전체 숨김 (PC와 동일)
    $('.tz-nomember-outer').hide();

});

// 키보드 미리보기 (PC와 유사한 구조)
$('body').delegate('.keyboard button', 'click', function(){
    if($(this).hasClass('selected')){
        $('.keyboard .btnKey').removeClass('selected');
        $('.view div').hide();
    } else {
        $('.keyboard .btnKey').removeClass('selected');
        $('.view div').hide();
        $(this).addClass('selected');
        var key=$(this).attr('title');
        $(this).parent().next().children('.'+key+'').show();
    }
});

// 탭 전환 이벤트 바인딩 (PC와 동일한 리다이렉트)
$('body').delegate('.tz-member-outer .ec-base-tab a', 'click', function(e) {
    var href = $(this).attr('href');
    
    if (href === '#member') {
        if (location.search.indexOf('noMemberOrder') !== -1) {
            e.preventDefault();
            location.href = '/member/login.html';
        } else {
            e.preventDefault();
        }
    } else if (href === '#noMember') {
        if (location.search.indexOf('noMemberOrder') === -1) {
            e.preventDefault();
            location.href = '/member/login.html?noMemberOrder&returnUrl=%2Fmyshop%2Forder%2Flist.html';
        } else {
            e.preventDefault();
        }
    }
});