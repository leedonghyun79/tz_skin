/**
 * 카테고리 마우스 오버 이미지
 * 카테고리 서브 메뉴 출력
 */

$(document).ready(function(){
    var closeTimer = null;
    // ========= [추가] 카테고리별 추천상품 세팅 =========
    // 카테고리 이름(텍스트)과 동일하게 작성하시면 됩니다.
    var categoryProducts = {
        '키오스크': {
            link: '/product/detail.html?product_no=1',
            img: 'https://ecimg.cafe24img.com/pg3042b49219970023/tvzone/web/product/medium/20260616/3fa763af308b211c03b8fa6c7836fdf0.png',
            name: '[키오스크] 추천상품명',
            price: '2,178,000원'
        },
        '멀티비전': {
            link: '/product/detail.html?product_no=2',
            img: '//img.echosting.cafe24.com/thumb/img_product_big.gif',
            name: '[멀티비전] 추천상품명 적어주세요',
            price: '1,000,000원'
        },
        '기본': { // 매핑되지 않은 카테고리에 마우스를 올렸을 때 나오는 기본값
            link: '/product/detail.html?product_no=1',
            img: 'https://ecimg.cafe24img.com/pg3042b49219970023/tvzone/web/product/medium/20260616/3fa763af308b211c03b8fa6c7836fdf0.png',
            name: '[TZ-SW4300]광고용 43인치 회전형 DID/키오스크/웰컴보드/모니터',
            price: '2,178,000원'
        }
    };
    // ====================================================

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
            var wasOpen = $('#submenu-module').is(':visible');

            if (methods.aSubCategory[iCateNo].length == 0) {
                return;
            }

            // 1. 왼쪽 카테고리 목록 업데이트
            var leftHtml = '<ul>';
            $(methods.aSubCategory[iCateNo]).each(function() {
                leftHtml += '<li><a href="/' + this.design_page_url + this.param + '">' + this.name + '</a></li>';
            });
            leftHtml += '</ul>';
            $('#submenu-left-content').html(leftHtml);

            // 2. 배너 영역 업데이트
            var categoryName = $(overNode).text().trim();
            $('#submenu-banner-content').html(
                '<div class="banner-placeholder">추후 여기에 <b>[' + categoryName + ']</b> 관련 이미지 삽입</div>'
            );

            // 3. 서브메뉴 준비

            // 4. 동적 추천상품 삽입 (카테고리명에 따라 변경)
            var prod = categoryProducts[categoryName] || categoryProducts['기본'];
            var recommendHtml = 
                '<a href="' + prod.link + '" style="display: block; text-decoration: none; color: inherit; width: 100%; text-align: center;">' +
                    '<img src="' + prod.img + '" alt="추천상품" style="width: 100%; height: auto; max-height: 180px; object-fit: contain; border-radius: 4px; margin-bottom: 12px;">' +
                    '<strong style="display: block; font-weight: 600; color: #333; font-size: 13px; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + prod.name + '</strong>' +
                    '<span class="price" style="display: block; font-weight: 700; color: #000; font-size: 14px;">' + prod.price + '</span>' +
                '</a>';
            $('#submenu-recommend-product').html(recommendHtml);

            // 5. 서브메뉴 표시
            if (!wasOpen) {
                $('#submenu-module').slideDown(200);
            } else {
                $('#submenu-module').show();
            }
        },

        close: function() {
            $('#submenu-module').slideUp(200);
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
           closeTimer = setTimeout(function(){ methods.close(); }, 150);
        });

        // 서브메뉴 마우스 이벤트
        $('#submenu-module').on('mouseenter', function(){
            if (closeTimer) {
                clearTimeout(closeTimer);
                closeTimer = null;
            }
        }).on('mouseleave', function(){
            closeTimer = setTimeout(function(){ methods.close(); }, 150);
        });
});
