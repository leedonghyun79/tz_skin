/**
 * 카테고리 마우스 오버 이미지
 * 카테고리 서브 메뉴 출력
 */

$(document).ready(function(){
    var closeTimer = null;
    var methods = {
        aCategory    : [],
        aSubCategory : {},

        get: function()
        {
             $.ajax({
                url : '/exec/front/Product/SubCategory',
                dataType: 'json',
                success: function(aData) {

                    if (aData == null || aData == 'undefined') return;
                    for (var i=0; i<aData.length; i++)
                    {
                        var sParentCateNo = aData[i].parent_cate_no;

                        if (!methods.aSubCategory[sParentCateNo]) {
                            methods.aSubCategory[sParentCateNo] = [];
                        }

                        methods.aSubCategory[sParentCateNo].push( aData[i] );
                    }
                }
            });
        },

        getParam: function(sUrl, sKey) {

            var aUrl         = sUrl.split('?');
            var sQueryString = aUrl[1];
            var aParam       = {};

            if (sQueryString) {
                var aFields = sQueryString.split("&");
                var aField  = [];
                for (var i=0; i<aFields.length; i++) {
                    aField = aFields[i].split('=');
                    aParam[aField[0]] = aField[1];
                }
            }
            return sKey ? aParam[sKey] : aParam;
        },


        show: function(overNode, iCateNo) {
            var wasOpen = $('.sub-category').length > 0; // 이전에 메뉴가 열려있었는지 확인
            methods.close(); // 기존 열려있는 서브메뉴 우선 제거

            if (methods.aSubCategory[iCateNo].length == 0) {
                return;
            }

            var aHtml = [];
            aHtml.push('<div class="mega-menu-inner">');
            
            // 1. 왼쪽: 서브메뉴 텍스트 리스트
            aHtml.push('<div class="mega-menu-left">');
            aHtml.push('<ul>');
            $(methods.aSubCategory[iCateNo]).each(function() {
                aHtml.push('<li><a href="/'+this.design_page_url+this.param+'">'+this.name+'</a></li>');
            });
            aHtml.push('</ul>');
            aHtml.push('</div>');

            // 2. 오른쪽: 프로모션/상품 배너 영역
            aHtml.push('<div class="mega-menu-right">');
            aHtml.push('  <div class="mega-banner">');
            aHtml.push('    <div class="banner-placeholder">추후 여기에 <b>[' + $(overNode).text().trim() + ']</b> 관련 이미지 삽입</div>');
            aHtml.push('  </div>');
            aHtml.push('  <div class="mega-banner">');
            aHtml.push('    <div class="banner-placeholder"><b>[추천 상품]</b><br>영역</div>');
            aHtml.push('  </div>');
            aHtml.push('</div>');

            aHtml.push('</div>'); // end mega-menu-inner


            var offset = $(overNode).offset();
            // 화면 전체 가로폭(width: 100%)을 차지하도록 수정, 왼쪽 끝(left: 0)에 붙임
            // 여백 15px을 주기 위해 top 위치값에 + 15 추가
            var $sub = $('<div class="sub-category mega-menu-wrapper" style="display:none;"></div>')
                .html(aHtml.join(''))
                .css({ position: 'absolute', left: 0, width: '100%', top: offset.top + $(overNode).outerHeight() + 15, 'z-index': 10000 });

            $sub.appendTo('body');
            
            if (wasOpen) {
                $sub.show(); // 다른 메뉴에서 넘어왔을 때는 애니메이션 없이 바로 보여줌
            } else {
                $sub.slideDown(200); // 처음 열릴 때만 스르륵 내려옴
            }
            
            $sub.find('li').on('mouseover', function(e) {
                    $(this).addClass('over');
                }).on('mouseout', function(e) {
                    $(this).removeClass('over');
                });

            // keep submenu open while hovering submenu
            $sub.on('mouseenter', function(){
                if (closeTimer) {
                    clearTimeout(closeTimer);
                    closeTimer = null;
                }
            }).on('mouseleave', function(){
                closeTimer = setTimeout(function(){ methods.close(); }, 150);
            });
        },

        close: function() {
            $('.sub-category').remove();
        }
    };

    methods.get();


        $('.xans-layout-category li').mouseenter(function(e) {
            if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
            var $this = $(this).addClass('on'),
              iCateNo = Number(methods.getParam($this.find('a').attr('href'), 'cate_no'));

            if (!iCateNo) {
                return;
            }

            methods.show($this, iCateNo);
        }).mouseleave(function(e) {
           var $this = $(this).removeClass('on');
           // delay closing to allow mouse move into submenu appended to body
           closeTimer = setTimeout(function(){ methods.close(); }, 150);
        });
});
