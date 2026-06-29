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
            // 띄어쓰기/줄바꿈 등에 의한 불일치를 막기 위해 공백을 모두 제거한 이름으로 매핑
            var categoryName = $(overNode).find('a').first().text().replace(/\s+/g, '');

            // 1. 커스텀 서브메뉴(수동 정의) 구조
            // 고객님이 요청하신 뎁스 구조를 매핑합니다. (나중에 /product/?? 링크만 수정해주세요)
            var customMenus = {
                'LED안내전광판': [
                    { name: '실내용', link: '/product/list.html?cate_no=29' },
                    { name: '실외용', link: '/product/list.html?cate_no=30' },
                    { name: '배너형 포스터', link: '/product/list.html?cate_no=31' },
                    { name: '특수형(비정형)', link: '/product/list.html?cate_no=43' }
                ],
                '디지털사이니지': [
                    { name: '멀티비전', link: '/product/multivision' },
                    { name: '삼성 사이니지', link: '/product/list.html?cate_no=32' },
                    { name: '엘지 사이니지', link: '/product/list.html?cate_no=44' },
                    { name: '안드로이드 사이니지', link: '/product/list.html?cate_no=45' }
                ],
                '키오스크': [
                    { name: '삼성 사이니지', link: '/product/list.html?cate_no=46' },
                    { name: '엘지 사이니지', link: '/product/list.html?cate_no=47' },
                    { name: '안드로이드 사이니지', link: '/product/list.html?cate_no=48' }
                ],
                '거치대마운트': [
                    { name: '스탠드형 거치대', link: '/product/list.html?cate_no=49' },
                    { name: '멀티비전/메뉴보드용 거치대', link: '/product/list.html?cate_no=50' }
                ],
                '솔루션': [
                    { name: 'T-10 USB 광고용 최적화 솔루션 프로그램', link: '/solution' },
                    { name: 'T-CMS MULTIPLEX 솔루션 프로그램', link: '/solution' },
                    { name: 'T-서베이 소비자 만족도조사 키오스크', link: '/solution' }
                ]
            };

            var subItems = customMenus[categoryName];
            
            // 커스텀 메뉴가 없다면 Cafe24 기본 AJAX 데이터 사용
            if (!subItems && iCateNo && methods.aSubCategory[iCateNo]) {
                subItems = [];
                $(methods.aSubCategory[iCateNo]).each(function() {
                    subItems.push({ name: this.name, link: '/' + this.design_page_url + this.param });
                });
            }

            // 서브메뉴가 아예 없으면 닫고 리턴
            if (!subItems || subItems.length === 0) {
                $('#submenu-module').hide();
                return;
            }

            // 1. 왼쪽 카테고리 목록 업데이트
            var leftHtml = '<ul>';
            $(subItems).each(function() {
                leftHtml += '<li><a href="' + this.link + '">' + this.name + '</a></li>';
            });
            leftHtml += '</ul>';
            $('#submenu-left-content').html(leftHtml);

            // 2. 배너 영역 업데이트
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
            // 동적으로 헤더의 현재 높이를 가져와 top을 설정 (스크롤 시 변경되는 헤더 높이에도 완벽 대응)
            var headerHeight = $('#header').outerHeight();
            $('#submenu-module').css('top', headerHeight + 'px');

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
            var $this = $(this).addClass('on');
            var iCateNo = Number(methods.getParam($this.find('a').attr('href'), 'cate_no'));

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