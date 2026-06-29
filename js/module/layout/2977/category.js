/**
 * 카테고리 마우스 오버 이미지
 * 카테고리 서브 메뉴 출력
 */

$(document).ready(function(){
    var closeTimer = null;
    var currentSwiper = null;

    // ========= [추가] 서브메뉴(세부항목)별 슬라이드 상품 세팅 =========
    // 왼쪽 세부 항목 이름(예: 실내용)과 동일하게 매핑됩니다.
    var subCategorySlides = {
        '실내용': [
            { link: '#', img: 'https://ecimg.cafe24img.com/pg3042b49219970023/tvzone/web/product/medium/20260616/3fa763af308b211c03b8fa6c7836fdf0.png', title: '실내용 (480X480)', desc: '밝기: 600nit ~ 800nit<br>사이즈: 480X480<br>픽셀 피치: 1.875, 2.5' },
            { link: '#', img: 'https://ecimg.cafe24img.com/pg3042b49219970023/tvzone/web/product/medium/20260616/3fa763af308b211c03b8fa6c7836fdf0.png', title: '실내용 2번째', desc: '설명 텍스트' },
            { link: '#', img: 'https://ecimg.cafe24img.com/pg3042b49219970023/tvzone/web/product/medium/20260616/3fa763af308b211c03b8fa6c7836fdf0.png', title: '실내용 3번째', desc: '설명 텍스트' },
            { link: '#', img: 'https://ecimg.cafe24img.com/pg3042b49219970023/tvzone/web/product/medium/20260616/3fa763af308b211c03b8fa6c7836fdf0.png', title: '실내용 4번째', desc: '설명 텍스트' }
        ],
        '실외용': [
            { link: '#', img: 'https://ecimg.cafe24img.com/pg3042b49219970023/tvzone/web/product/medium/20260616/3fa763af308b211c03b8fa6c7836fdf0.png', title: '실외용 첫번째', desc: '설명 텍스트' }
        ],
        '배너형 포스터': [
            { link: '#', img: 'https://ecimg.cafe24img.com/pg3042b49219970023/tvzone/web/product/medium/20260616/3fa763af308b211c03b8fa6c7836fdf0.png', title: '배너형 포스터', desc: '설명 텍스트' }
        ],
        '특수형(비정형)': [
            { link: '#', img: 'https://ecimg.cafe24img.com/pg3042b49219970023/tvzone/web/product/medium/20260616/3fa763af308b211c03b8fa6c7836fdf0.png', title: '특수형 1', desc: '설명 텍스트' }
        ]
    };

    function renderSubmenuSlider(subName) {
        var slidesData = subCategorySlides[subName];
        if (!slidesData || slidesData.length === 0) {
            $('#submenu-banner-content').empty();
            if (currentSwiper) {
                currentSwiper.destroy(true, true);
                currentSwiper = null;
            }
            return;
        }

        var swiperHtml = '<div class="swiper-container submenu-right-swiper" style="width: 100%; overflow: hidden;">' +
                            '<div class="swiper-wrapper">';
        
        $(slidesData).each(function(i, item) {
            swiperHtml += '<div class="swiper-slide">' +
                            '<a href="' + item.link + '" style="display: flex; align-items: center; text-decoration: none; color: inherit; background: #fff; border-radius: 8px; padding: 20px; min-height: 380px;">' +
                                // 좌측: 큼직한 이미지 영역
                                '<div style="flex: 1; text-align: center; padding-right: 30px;">' +
                                    '<img src="' + item.img + '" alt="" style="width: 100%; height: auto; max-height: 380px; object-fit: contain;">' +
                                '</div>' +
                                // 우측: 텍스트 영역
                                '<div style="flex: 1; text-align: left; padding-top: 10px;">' +
                                    '<strong style="display: block; font-size: 22px; font-weight: 700; margin-bottom: 15px; color: #222;">' + item.title + '</strong>' +
                                    '<p style="font-size: 15px; color: #555; line-height: 1.6; margin: 0;">' + item.desc + '</p>' +
                                '</div>' +
                            '</a>' +
                          '</div>';
        });

        swiperHtml +=       '</div>' +
                            '<div class="swiper-pagination" style="position: relative; margin-top: 15px;"></div>' +
                         '</div>';

        $('#submenu-banner-content').html(swiperHtml);

        if (currentSwiper) {
            currentSwiper.destroy(true, true);
        }

        if (typeof Swiper !== 'undefined') {
            currentSwiper = new Swiper('.submenu-right-swiper', {
                slidesPerView: 1,
                spaceBetween: 20,
                loop: slidesData.length > 1,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                }
            });
        }
    }
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
                leftHtml += '<li data-subname="' + this.name + '"><a href="' + this.link + '">' + this.name + '</a></li>';
            });
            leftHtml += '</ul>';
            $('#submenu-left-content').html(leftHtml);

            // 좌측 서브메뉴 항목에 마우스를 올렸을 때 슬라이더 변경
            $('#submenu-left-content li').on('mouseenter', function() {
                var subName = $(this).data('subname');
                $('#submenu-left-content li').removeClass('active');
                $(this).addClass('active');
                renderSubmenuSlider(subName);
            });

            // 2. 처음 열렸을 때 첫 번째 항목의 슬라이더 자동 표시
            if (subItems.length > 0) {
                var firstSubName = subItems[0].name;
                $('#submenu-left-content li').first().addClass('active');
                renderSubmenuSlider(firstSubName);
            } else {
                $('#submenu-banner-content').empty();
            }

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