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
            { link: '/product/list.html?cate_no=29', img: 'https://cdn.imweb.me/thumbnail/20260417/12cc50ffba0a3.png', title: '실내용 (480X480)', desc: '밝기: 600nit ~ 800nit<br>사이즈: 480X480<br>픽셀 피치: 1.875, 2.5' },
            { link: '/product/list.html?cate_no=30', img: 'https://cdn.imweb.me/thumbnail/20260417/12cc50ffba0a3.png', title: '실내용 (480X480) 텍스트', desc: '밝기: 600nit ~ 800nit<br>사이즈: 480X480<br>픽셀 피치: 1.875, 2.5' }
        ],
        '실외용': [
            { link: '#', img: 'https://img.echosting.cafe24.com/skin/skin_ko_KR/main/img_collection2.jpg', title: '실외용 첫번째', desc: '설명 텍스트' }
        ],
        '배너형 포스터': [
            { link: '#', img: 'https://img.echosting.cafe24.com/skin/skin_ko_KR/main/img_collection2.jpg', title: '배너형 포스터', desc: '설명 텍스트' }
        ],
        '특수형(비정형)': [
            { link: '#', img: 'https://img.echosting.cafe24.com/skin/skin_ko_KR/main/img_collection2.jpg', title: '특수형 1', desc: '설명 텍스트' }
        ],
        // 매핑되지 않은 나머지 모든 메뉴를 위한 기본(Default) 슬라이드
        '기본값': [
            { link: '#', img: 'https://img.echosting.cafe24.com/skin/skin_ko_KR/main/img_collection2.jpg', title: '추천 상품', desc: '기본 추천 상품입니다.' }
        ]
    };

    function renderSubmenuSlider(subName) {
        console.log("renderSubmenuSlider called with:", subName);
        // subName에 해당하는 데이터가 없으면 '기본값' 데이터를 불러옵니다.
        var slidesData = subCategorySlides[subName] || subCategorySlides['기본값'];
        if (!slidesData || slidesData.length === 0) {
            $('#submenu-module .submenu-banner').empty();
            try {
                if (currentSwiper && typeof currentSwiper.destroy === 'function') {
                    currentSwiper.destroy(true, true);
                }
            } catch(e) { console.error("Swiper destroy error:", e); }
            currentSwiper = null;
            return;
        }

        try {
            if (currentSwiper && typeof currentSwiper.destroy === 'function') {
                currentSwiper.destroy(true, true);
            }
        } catch(e) { console.error("Swiper destroy error:", e); }
        currentSwiper = null;

        if (slidesData.length === 1) {
            var item = slidesData[0];
            var html = '<a href="' + item.link + '" style="display: flex; align-items: center; justify-content: flex-start; text-decoration: none; color: inherit; box-sizing: border-box; height: 100%; width: 100%;">' +
                            '<div style="flex: 0 0 400px; height: 100%;">' +
                                '<img src="' + item.img + '" alt="" style="width: 100%; height: 100%; object-fit: cover;">' +
                            '</div>' +
                            '<div style="flex: 1; text-align: left; padding: 20px 30px;">' +
                                '<strong style="display: block; font-size: 18px; font-weight: 700; margin-bottom: 10px; color: #222; word-break: keep-all;">' + item.title + '</strong>' +
                                '<p style="font-size: 13px; color: #555; line-height: 1.5; margin: 0; word-break: keep-all;">' + item.desc + '</p>' +
                            '</div>' +
                       '</a>';
            $('#submenu-module .submenu-banner').html(html);
            console.log("Injected 1-slide layout");
        } else {
            // 슬라이드가 여러 개일 때만 Swiper 렌더링
            var swiperHtml = '<div class="swiper-container submenu-right-swiper" style="width: 100%; height: 100%; overflow: hidden;">' +
                                '<div class="swiper-wrapper" style="height: 100%; display: flex;">';
            
            $(slidesData).each(function(i, item) {
                swiperHtml += '<div class="swiper-slide" style="height: 100%; width: 100%; box-sizing: border-box; flex-shrink: 0;">' +
                                '<a href="' + item.link + '" style="display: flex; align-items: center; justify-content: flex-start; text-decoration: none; color: inherit; box-sizing: border-box; height: 100%;">' +
                                    '<div style="flex: 0 0 400px; height: 100%;">' +
                                        '<img src="' + item.img + '" alt="" style="width: 100%; height: 100%; object-fit: cover;">' +
                                    '</div>' +
                                    '<div style="flex: 1; text-align: left; padding: 20px 30px;">' +
                                        '<strong style="display: block; font-size: 18px; font-weight: 700; margin-bottom: 10px; color: #222; word-break: keep-all;">' + item.title + '</strong>' +
                                        '<p style="font-size: 13px; color: #555; line-height: 1.5; margin: 0; word-break: keep-all;">' + item.desc + '</p>' +
                                    '</div>' +
                                '</a>' +
                              '</div>';
            });

            swiperHtml +=       '</div>' +
                                '<div class="swiper-pagination"></div>' +
                                '<div class="swiper-button-prev" style="color: #333; left: 10px;"></div>' +
                                '<div class="swiper-button-next" style="color: #333; right: 10px;"></div>' +
                             '</div>';

            $('#submenu-module .submenu-banner').html(swiperHtml);
            console.log("Injected Swiper HTML into #submenu-banner-content. HTML length:", swiperHtml.length);

            if (typeof Swiper !== 'undefined') {
                console.log("Initializing Swiper...");
                try {
                    currentSwiper = new Swiper('.submenu-right-swiper', {
                        slidesPerView: 1,
                        spaceBetween: 20,
                        loop: true,
                        speed: 800,
                        pagination: {
                            el: '.swiper-pagination',
                            type: 'progressbar',
                        },
                        navigation: {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        },
                        autoplay: {
                            delay: 3000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        },
                        observer: true,
                        observeParents: true,
                        on: {
                            init: function() {
                                var _this = this;
                                setTimeout(function() {
                                    _this.update();
                                }, 250);
                            }
                        }
                    });
                    console.log("Swiper initialized successfully.");
                } catch(e) {
                    console.error("Swiper initialization failed:", e);
                }
            } else {
                console.error("Swiper is undefined!");
            }
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
                    { name: '멀티비전', link: '/product/list.html?cate_no=32' },
                    { name: '삼성 사이니지', link: '/product/list.html?cate_no=33' },
                    { name: '엘지 사이니지', link: '/product/list.html?cate_no=44' },
                    { name: '전자액자', link: '/product/list.html?cate_no=45' }
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
                    { name: 'T-10 USB 광고용 최적화 솔루션 프로그램', link: '/product/list.html?cate_no=54' },
                    { name: 'T-CMS MULTIPLEX 솔루션 프로그램', link: '/product/list.html?cate_no=55' },
                    { name: 'T-서베이 소비자 만족도조사 키오스크', link: '/product/list.html?cate_no=56' }
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

            // 메가메뉴 대상인지 확인
            var megaMenus = ['LED안내전광판', '디지털사이니지', '키오스크'];
            var isMegaMenu = $.inArray(categoryName, megaMenus) !== -1;

            // 서브메뉴가 아예 없으면 닫고 리턴
            if (!subItems || subItems.length === 0) {
                $('#submenu-module').hide();
                $('.simple-submenu').remove();
                return;
            }

            if (!isMegaMenu) {
                $('#submenu-module').hide();
                $('.simple-submenu').remove();
                
                var simpleHtml = '<ul class="simple-submenu" style="position:absolute; top:100%; left:0; background:#fff; border:1px solid #eee; box-shadow:0 4px 12px rgba(0,0,0,0.08); padding:10px 0; min-width:220px; z-index:10001; text-align:left; border-radius:4px; margin-top:0;">';
                $(subItems).each(function() {
                    simpleHtml += '<li><a href="' + this.link + '" style="display:block; padding:8px 20px; font-size:14px; color:#777; text-decoration:none; word-break:keep-all; transition:all 0.2s; font-weight:normal;">' + this.name + '</a></li>';
                });
                simpleHtml += '</ul>';
                
                $(overNode).css('position', 'relative').append(simpleHtml);
                
                $(overNode).find('.simple-submenu a').hover(function() {
                    $(this).css('color', '#333');
                }, function() {
                    $(this).css('color', '#777');
                });
                
                return;
            }

            $('.simple-submenu').remove();

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
                $('#submenu-module .submenu-banner').empty();
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
            $('.simple-submenu').remove();
        }
    };

    methods.get();


        $('.xans-layout-category li').mouseenter(function(e) {
            // 모바일 화면(1024px 이하)에서는 커스텀 드롭다운 작동 방지
            if (window.innerWidth <= 1024) return;
            
            if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
            var $this = $(this).addClass('on');
            var iCateNo = Number(methods.getParam($this.find('a').attr('href'), 'cate_no'));

            methods.show($this, iCateNo);
        }).mouseleave(function(e) {
            if (window.innerWidth <= 1024) return;
            
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