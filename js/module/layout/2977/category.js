/**
 * 카테고리 마우스 오버 이미지
 * 카테고리 서브 메뉴 출력
 */

$(document).ready(function(){
    var closeTimer = null;
    var currentSwiper = null;
    var currentMegaMenu = null;
    var currentSlideKey = null;
    var submenuHtmlCache = {};
    var preloadedImages = {};

    // ========= [추가] 서브메뉴(세부항목)별 슬라이드 상품 세팅 =========
    // 왼쪽 세부 항목 이름(예: 실내용)과 동일하게 매핑됩니다.
    var subCategorySlides = {
        '실내용': [
            { link: '/product/list.html?cate_no=29', img: 'https://cdn.imweb.me/thumbnail/20260417/12cc50ffba0a3.png', title: '실내용 (480X480)', desc: '밝기: 600nit ~ 800nit<br>사이즈: 480X480<br>픽셀 피치: 1.875, 2.5' },
            { link: '/product/list.html?cate_no=29', img: 'https://cdn.imweb.me/thumbnail/20260417/faa535bae13d4.png', title: '실내용 (640X480) 텍스트', desc: '밝기: 600nit ~ 800nit<br>사이즈: 640X480<br>픽셀 피치: 1.25, 1.53, 1.86, 2, 2.5, 3.076' },
            { link: '/product/list.html?cate_no=29', img: 'https://cdn.imweb.me/thumbnail/20260417/12cc50ffba0a3.png', title: '실내용 (600X377.5) 텍스트', desc: '밝기: 600nit ~ 800nit<br>사이즈: 600X377.5<br>픽셀 피치: 1.25, 1.56, 1.875' },
            { link: '/product/list.html?cate_no=29', img: 'https://cdn.imweb.me/thumbnail/20260417/7283609bf69d2.png', title: '실내용 (960X540) 텍스트', desc: '밝기: 600nit ~ 800nit<br>사이즈: 960X540<br>픽셀 피치: 1.25, 1.5, 1.8, 2, 2.5' }
        ],
        '실외용': [
            { link: '/product/list.html?cate_no=30', img: 'https://cdn.imweb.me/thumbnail/20260430/becbb97792054.png', title: '실외용 (960X960)', desc: '밝기: 4500nit ~ 6500nit<br>사이즈: 960X960<br>픽셀 피치: 2, 2.5, 3, 4, 5, 6.66, 8, 10' },
            { link: '/product/list.html?cate_no=30', img: 'https://cdn.imweb.me/thumbnail/20260420/0e6580b5812cc.png', title: '실외용 (1000X1000) 텍스트', desc: '밝기: 3000nit ~ 5500nit<br>사이즈: 1000X1000<br>픽셀 피치: 2.9, 3.9, 4.8, 6.2, 7.8, 10' },
            { link: '/product/list.html?cate_no=30', img: 'https://cdn.imweb.me/thumbnail/20260420/038afd6354b1b.png', title: '실외용 (500X500X1000) 텍스트', desc: '밝기: 3000nit ~ 5500nit<br>사이즈: 500X500X1000<br>픽셀 피치: 2.604, 2.976, 4.81, 5.95' },
            { link: '/product/list.html?cate_no=30', img: 'https://cdn.imweb.me/thumbnail/20260520/a8fb0f89d6713.png', title: '실외용 (960X960) 텍스트', desc: '밝기: 5000nit ~ 6500nit<br>사이즈: 960X960<br>픽셀 피치: 4, 4.4, 5, 5.7, 6.6, 8, 10' }
        ],
        '배너형 포스터': [
            { link: '/product/list.html?cate_no=31', img: 'https://cdn.imweb.me/thumbnail/20260413/194e568ed50c3.png', title: 'TZL-ST 시리즈', desc: '밝기: 400nit ~ 800nit<br>사이즈: 480X480<br>픽셀 피치: 1.53, 1.86, 2.0, 2.5' }
        ],
        '특수형(비정형)': [
            { link: '/product/list.html?cate_no=43', img: 'https://cdn.imweb.me/thumbnail/20260413/b64572c5c78c7.png', title: 'Flexible', desc: '' },
            { link: '/product/list.html?cate_no=43', img: 'https://cdn.imweb.me/thumbnail/20260413/05dc102c7e55d.png', title: ' 투명 IED', desc: '' },
            { link: '/product/list.html?cate_no=43', img: 'https://cdn.imweb.me/thumbnail/20260413/a3b1c88271b4c.png', title: '바닥 IED', desc: '' },
            { link: '/product/list.html?cate_no=43', img: 'https://cdn.imweb.me/thumbnail/20260413/8f8b7e3eddb4c.png', title: '플렉서블 필름', desc: '' }
        ],
        // 디지털사이니지
        '디지털사이니지|멀티비전': [
            { link: '/product/list.html?cate_no=32', img: 'https://cdn.imweb.me/thumbnail/20260429/58430d3c02622.png', title: 'TMTENB 시리즈', desc: '밝기: 500nit<br>해상도: 1920X1080(FHD)' },
            { link: '/product/list.html?cate_no=32', img: 'https://cdn.imweb.me/thumbnail/20260424/6020b6278a81a.png', title: 'TMTUNB 시리즈', desc: '밝기: 500nit<br>해상도: 1920X1080(FHD)' }
        ],
        '디지털사이니지|삼성 사이니지': [
            { link: '/product/list.html?cate_no=33', img: 'https://cdn.imweb.me/thumbnail/20260413/c796f98fa516f.png', title: 'QB 시리즈', desc: '밝기: 350nit<br>해상도: 3,840X2,160(4K UHD)' },
            { link: '/product/list.html?cate_no=33', img: 'https://cdn.imweb.me/thumbnail/20260413/c796f98fa516f.png', title: 'QE 시리즈', desc: '밝기: 450nit<br>해상도: 3,840X2,160(4K UHD)' },
            { link: '/product/list.html?cate_no=33', img: 'https://cdn.imweb.me/thumbnail/20260413/c796f98fa516f.png', title: 'QM 시리즈', desc: '밝기: 500nit<br>해상도: 3,840X2,160(4K UHD)' }
        ],
        '디지털사이니지|엘지 사이니지': [ 
            { link: '/product/list.html?cate_no=44', img: 'https://cdn.imweb.me/thumbnail/20260413/6a93b4bc3d118.png', title: 'UH7J 시리즈', desc: '밝기: 700nit<br>해상도: 3,840X2,160(4K UHD)' },
            { link: '/product/list.html?cate_no=44', img: 'https://cdn.imweb.me/thumbnail/20260413/6a93b4bc3d118.png', title: 'UH5J 시리즈', desc: '밝기: 500nit<br>해상도: 3,840X2,160(4K UHD)' },
            { link: '/product/list.html?cate_no=44', img: 'https://cdn.imweb.me/thumbnail/20260413/6a93b4bc3d118.png', title: 'UH5N 시리즈', desc: '밝기: 500nit<br>해상도: 3,840X2,160(4K UHD)' }
        ],
        '디지털사이니지|전자액자': [
            { link: '/product/list.html?cate_no=45', img: 'https://cdn.imweb.me/thumbnail/20260414/0da2809719be5.png', title: 'TZ-PW 시리즈', desc: '밝기: 350nit<br>해상도: 3,840x2,160(4K UHD)' }
        ],
        // 키오스크
        '키오스크|삼성 사이니지': [
            // 스탠드
            { link: '/product/list.html?cate_no=46', img: 'https://cdn.imweb.me/thumbnail/20260430/71eb724f0eb10.png', title: 'QBC-ST 시리즈', desc: '밝기: 350nit<br>해상도: 3,840X2,160(4K UHD)' },
            { link: '/product/list.html?cate_no=46', img: 'https://cdn.imweb.me/thumbnail/20260430/71eb724f0eb10.png', title: 'QMC-ST 시리즈', desc: '밝기: 500nit<br>해상도: 3,840X2,160(4K UHD)' },
            { link: '/product/list.html?cate_no=46', img: 'https://cdn.imweb.me/thumbnail/20260430/71eb724f0eb10.png', title: 'QHC-ST 시리즈', desc: '밝기: 700nit<br>해상도: 3,840X2,160(4K UHD)' },
            // 회전형
            { link: '/product/list.html?cate_no=46', img: 'https://cdn.imweb.me/thumbnail/20260430/5904da19103c6.png', title: 'QBC-SW 시리즈', desc: '밝기: 350nit<br>해상도: 3,840X2,160(4K UHD)' },
            { link: '/product/list.html?cate_no=46', img: 'https://cdn.imweb.me/thumbnail/20260430/5904da19103c6.png', title: 'QMC-SW 시리즈', desc: '밝기: 500nit<br>해상도: 3,840X2,160(4K UHD)' },
            { link: '/product/list.html?cate_no=46', img: 'https://cdn.imweb.me/thumbnail/20260430/5904da19103c6.png', title: 'QHC-SW 시리즈', desc: '밝기: 700nit<br>해상도: 3,840X2,160(4K UHD)' },
        ],
        '키오스크|엘지 사이니지': [
            { link: '/product/list.html?cate_no=47', img: 'https://cdn.imweb.me/thumbnail/20260430/bdefb9f8d3dbc.png', title: 'UH5Q-ST 시리즈', desc: '밝기: 500nit<br>해상도: 3,840X2,160(4K UHD)' },
            { link: '/product/list.html?cate_no=47', img: 'https://cdn.imweb.me/thumbnail/20260430/18f18dff42d06.png', title: 'UH5Q-SW 시리즈', desc: '밝기: 500nit<br>해상도: 3,840X2,160(4K UHD)' }
        ],
        '키오스크|안드로이드 사이니지': [
            { link: '/product/list.html?cate_no=48', img: 'https://cdn.imweb.me/thumbnail/20260413/f55de1a5ee985.png', title: 'TZ-ST 시리즈', desc: '밝기: 450nit<br>해상도: 3,840X2,160(4K UHD)' },
            { link: '/product/list.html?cate_no=48', img: 'https://cdn.imweb.me/thumbnail/20260413/a6a43c2b97a0a.png', title: 'TZ-SW 시리즈', desc: '밝기: 450nit<br>해상도: 3,840X2,160(4K UHD)' }
        ]
    };

    function preloadSubmenuImages(slidesData) {
        $(slidesData).each(function(i, item) {
            if (item.img && !preloadedImages[item.img]) {
                var img = new Image();
                img.src = item.img;
                preloadedImages[item.img] = true;
            }
        });
    }

    function buildSubmenuHtml(slideKey, slidesData) {
        if (submenuHtmlCache[slideKey]) {
            return submenuHtmlCache[slideKey];
        }

        var html = '';
        var imageStyle = 'width: 100%; height: 100%; object-fit: cover;';
        if (slideKey.indexOf('배너형 포스터') !== -1 || slideKey.indexOf('키오스크|삼성 사이니지') !== -1 || slideKey.indexOf('키오스크|엘지 사이니지') !== -1) {
            imageStyle = 'width: 90%; height: 100%; object-fit: cover;';
        }

        if (slidesData.length === 1) {
            var item = slidesData[0];
            html = '<div class="swiper-container submenu-right-swiper" style="width: 100%; height: 100%; overflow: hidden; position: relative;">' +
                        '<div class="swiper-wrapper" style="height: 100%; display: flex;">' +
                        '<div class="swiper-slide" style="height: 100%; width: 100%; box-sizing: border-box; flex-shrink: 0;">' +
                            '<a href="' + item.link + '" style="display: flex; align-items: center; justify-content: flex-start; text-decoration: none; color: inherit; box-sizing: border-box; height: 100%; width: 100%;">' +
                                '<div style="flex: 0 0 400px; height: 100%; margin-right: 20px;">' +
                                    '<img src="' + item.img + '" alt="" style="' + imageStyle + '">' +
                                '</div>' +
                                '<div style="flex: 1; text-align: left; padding: 20px 30px;">' +
                                    '<strong style="display: block; font-size: 18px; font-weight: 700; margin-bottom: 10px; color: #222; word-break: keep-all;">' + item.title + '</strong>' +
                                    '<p style="font-size: 15px; color: #555; line-height: 1.5; margin: 0; word-break: keep-all;">' + item.desc + '</p>' +
                                '</div>' +
                            '</a>' +
                        '</div>' +
                        '</div>' +
                        '<div class="swiper-pagination"></div>' +
                        '<div class="swiper-button-prev disabled" aria-disabled="true" style="position: absolute; top: 50%; left: -6px; display: flex !important; align-items: center; justify-content: center; width: 44px !important; height: 44px !important; background: none !important; border: none !important; transform: translateY(-50%) !important; margin-top: 0 !important; text-indent: 0 !important; pointer-events: none; opacity: 0;pointer-events:none">' +
                            '<svg viewBox="0 0 24 24" width="50" height="50" stroke="#7e7e7e" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>' +
                        '</div>' +
                        '<div class="swiper-button-next disabled" aria-disabled="true" style="position: absolute; top: 50%; right: -6px; display: flex !important; align-items: center; justify-content: center; width: 44px !important; height: 44px !important; background: none !important; border: none !important; transform: translateY(-50%) !important; margin-top: 0 !important; text-indent: 0 !important; pointer-events: none; opacity: 0;pointer-events:none">' +
                            '<svg viewBox="0 0 24 24" width="50" height="50" stroke="#7e7e7e" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>' +
                        '</div>' +
                        '</div>';
        } else {
            html = '<div class="swiper-container submenu-right-swiper" style="width: 100%; height: 100%; overflow: hidden;">' +
                        '<div class="swiper-wrapper" style="height: 100%; display: flex;">';
            $(slidesData).each(function(i, item) {
                html += '<div class="swiper-slide" style="height: 100%; width: 100%; box-sizing: border-box; flex-shrink: 0;">' +
                                '<a href="' + item.link + '" style="display: flex; align-items: center; justify-content: flex-start; text-decoration: none; color: inherit; box-sizing: border-box; height: 100%;">' +
                                    '<div style="flex: 0 0 400px; height: 100%;">' +
                                        '<img src="' + item.img + '" alt="" style="' + imageStyle + '">' +
                                    '</div>' +
                                    '<div style="flex: 1; text-align: left; padding: 20px 30px;">' +
                                        '<strong style="display: block; font-size: 18px; font-weight: 700; margin-bottom: 10px; color: #222; word-break: keep-all;">' + item.title + '</strong>' +
                                        '<p style="font-size: 15px; color: #555; line-height: 1.5; margin: 0; word-break: keep-all;">' + item.desc + '</p>' +
                                    '</div>' +
                                '</a>' +
                              '</div>';
            });
            html += '</div>' +
                        '<div class="swiper-pagination"></div>' +
                        '<div class="swiper-button-prev" style="left: -6px; display: flex !important; align-items: center; justify-content: center; width: 50px !important; height: 50px !important; background: none !important; border: none !important; transform: translateY(-50%) !important; margin-top: 0 !important; text-indent: 0 !important;">' +
                            '<svg viewBox="0 0 24 24" width="50" height="50" stroke="#7e7e7e" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>' +
                        '</div>' +
                        '<div class="swiper-button-next" style="right: 6px; display: flex !important; align-items: center; justify-content: center; width: 50px !important; height: 50px !important; background: none !important; border: none !important; transform: translateY(-50%) !important; margin-top: 0 !important; text-indent: 0 !important;">' +
                            '<svg viewBox="0 0 24 24" width="50" height="50" stroke="#7e7e7e" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>' +
                        '</div>' +
                     '</div>';
        }

        submenuHtmlCache[slideKey] = html;
        return html;
    }

    function renderSubmenuSlider(subName) {
        var slideKey = currentMegaMenu ? currentMegaMenu + '|' + subName : subName;
        if (currentSlideKey === slideKey) {
            return;
        }

        console.log("renderSubmenuSlider called with:", slideKey);
        // subName에 해당하는 데이터가 없으면 현재 메가메뉴 + subName, subName, 기본값 순으로 불러옵니다.
        var slidesData = subCategorySlides[slideKey] || subCategorySlides[subName] || subCategorySlides['기본값'];
        if (!slidesData || slidesData.length === 0) {
            $('#submenu-module .submenu-banner').empty();
            if (currentSwiper && typeof currentSwiper.destroy === 'function') {
                try {
                    currentSwiper.destroy(true, true);
                } catch(e) { console.error("Swiper destroy error:", e); }
            }
            currentSwiper = null;
            currentSlideKey = null;
            return;
        }

        preloadSubmenuImages(slidesData);

        if (currentSwiper && currentSlideKey && currentSlideKey !== slideKey) {
            try {
                currentSwiper.destroy(true, true);
            } catch(e) { console.error("Swiper destroy error:", e); }
            currentSwiper = null;
        }

        var html = buildSubmenuHtml(slideKey, slidesData);
        $('#submenu-module .submenu-banner').html(html);
        currentSlideKey = slideKey;

        if (slidesData.length > 1) {
            if (!currentSwiper) {
                if (typeof Swiper !== 'undefined') {
                    try {
                        currentSwiper = new Swiper('.submenu-right-swiper', {
                            slidesPerView: 1,
                            spaceBetween: 30,
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
                            // autoplay: {
                            //     autoplay: false,
                            //     delay: 3000,
                            //     disableOnInteraction: false,
                            //     pauseOnMouseEnter: true
                            // },
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
                    } catch(e) {
                        console.error("Swiper initialization failed:", e);
                    }
                } else {
                    console.error("Swiper is undefined!");
                }
            }
        } else {
            currentSwiper = null;
        }

        console.log("Rendered submenu for", slideKey, "(slides:", slidesData.length, ")");
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
                    { name: '스탠드형 거치대', link: '/product/list.html?cate_no=49' }
                ],
                '솔루션': []
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
            currentMegaMenu = isMegaMenu ? categoryName : null;

            // 서브메뉴가 아예 없으면 닫고 리턴
            if (!subItems || subItems.length === 0) {
                $('#submenu-module').hide();
                $('.simple-submenu').remove();
                return;
            }

            if (!isMegaMenu) {
                currentMegaMenu = null;
                $('#submenu-module').hide();
                $('.simple-submenu').remove();
                
                var simpleHtml = '<ul class="simple-submenu" style="position:absolute; top:100%; left:30px; background:#fff; border:1px solid #eee; box-shadow:0 4px 12px rgba(0,0,0,0.08); padding:10px 15px; min-width:220px; z-index:10001; text-align:left; border-radius:4px; margin-top:15px;">';
                $(subItems).each(function() {
                    simpleHtml += '<li><a href="' + this.link + '" style="display:block; padding:8px 0; font-size:17px; color:#777; text-decoration:none; word-break:keep-all; transition:all 0.2s; font-weight:normal;">' + this.name + '</a></li>';
                });
                simpleHtml += '</ul>';
                
                $(overNode).css('position', 'relative').append(simpleHtml);
                $(overNode).find('.simple-submenu li').not(':last').css('margin-bottom', '12px');
                
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
            // 동적으로 헤더의 현재 높이를 가져와 top을 설정
            var headerHeight = $('#header').outerHeight() - 6; // 6px은 그림자 높이 보정
            $('#submenu-module').css('top', headerHeight + 'px');

            if (!wasOpen) {
                $('#submenu-module').slideDown(200);
            } else {
                $('#submenu-module').show();
            }
        },

        close: function() {
            currentMegaMenu = null;
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