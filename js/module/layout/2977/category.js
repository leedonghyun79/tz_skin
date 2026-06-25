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
            var wasOpen = $('#mega-menu-module').is(':visible');

            if (methods.aSubCategory[iCateNo].length == 0) {
                return;
            }

            // 1. 왼쪽 카테고리 목록 업데이트
            var leftHtml = '<ul>';
            $(methods.aSubCategory[iCateNo]).each(function() {
                leftHtml += '<li><a href="/' + this.design_page_url + this.param + '">' + this.name + '</a></li>';
            });
            leftHtml += '</ul>';
            $('#mega-menu-left-content').html(leftHtml);

            // 2. 배너 영역 업데이트
            var categoryName = $(overNode).text().trim();
            $('#mega-banner-content').html(
                '<div class="banner-placeholder">추후 여기에 <b>[' + categoryName + ']</b> 관련 이미지 삽입</div>'
            );

            // 3. 메가메뉴 준비

            // 4. 추천상품 로드
            methods.loadRecommendProduct(iCateNo);

            // 5. 메가메뉴 표시
            if (!wasOpen) {
                $('#mega-menu-module').slideDown(200);
            } else {
                $('#mega-menu-module').show();
            }
        },

        loadRecommendProduct: function(iCateNo) {
            $.ajax({
                url: '/exec/front/Product/Recommend',
                data: {
                    cate_no: iCateNo,
                    count: 1
                },
                dataType: 'json',
                success: function(aData) {
                    if (aData && aData.length > 0) {
                        var product = aData[0];
                        var html = '<a href="' + product.link_product_detail + '" style="display: block; text-decoration: none; color: inherit;">';
                        html += '<img src="' + product.image_medium + '" alt="' + product.product_name + '" style="width: 100%; height: 140px; object-fit: cover; border-radius: 4px; margin-bottom: 12px;">';
                        html += '<strong style="display: block; font-weight: 600; color: #333; font-size: 13px; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + product.product_name + '</strong>';
                        html += '<span style="display: block; font-weight: 700; color: #000; font-size: 14px;">' + product.product_price + '</span>';
                        html += '</a>';
                        $('#mega-recommend-product').html(html);
                    }
                },
                error: function() {
                    $('#mega-recommend-product').html('<div class="banner-placeholder">추천상품</div>');
                }
            });
        },

        close: function() {
            $('#mega-menu-module').slideUp(200);
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

        // 메가메뉴 마우스 이벤트
        $('#mega-menu-module').on('mouseenter', function(){
            if (closeTimer) {
                clearTimeout(closeTimer);
                closeTimer = null;
            }
        }).on('mouseleave', function(){
            closeTimer = setTimeout(function(){ methods.close(); }, 150);
        });
});
