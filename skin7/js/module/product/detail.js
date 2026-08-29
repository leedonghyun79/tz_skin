function removePagingArea(oTarget)
{
    if ($(oTarget).length < 1 && (oTarget != '#prdReview' || oTarget != '#prdQna')) return;

    if ($(oTarget).css('display') == 'block') {
        if (oTarget == '#prdReview') {
            var record = $('.xans-record-', '.xans-product-review').first();
            if (record.length < 1 || record.is(':not(:visible)')) {
                $('.xans-product-reviewpaging').remove();
             }
         } else if (oTarget == '#prdQnA') {
            var record = $('.xans-record-', '.xans-product-qna').first();
            if (record.length < 1 || record.is(':not(:visible)')) {
                $('.xans-product-qnapaging').remove();
            }
         }
     }
}

$(function() {

    $('#actionCartClone, #actionWishClone, #actionBuyClone, #actionWishSoldoutClone').off().on('click', function() {
        try {
            var id = $(this).attr('id').replace(/Clone/g, '');
            if (typeof(id) !== 'undefined') $('#' + id).trigger('click');
            else return false;
        } catch(e) {
            return false;
        }
    });

    function productDetailOrigin(){
        var imgChk = $('#prdDetailContent').find('img').length;
        if(imgChk <= 0){
            $('#prdDetailBtn').remove();
        }
    }
    productDetailOrigin();

    // Add Image
    var oTarget = $('.xans-product-mobileimage ul li');
    var oAppend = oTarget.first().children('p').clone();

    oTarget.slice(1).each(function() {
        var listHtml = $(this).html();
        $(this).children().wrap(function() {
            return '<p class="thumbnail">' + oAppend.html() + listHtml + '</p>';
        });

        $(this).children('p').children('img').first().remove();
    });
});



// Extracted from detail.html

            (function () {
                function relationHasItems() {
                    return document.querySelectorAll('.relation .item, .xans-product-relation .item, [module="product_relation"] .item, [module="product_relationlist"] .item').length > 0;
                }

                function syncRelationEmptyMessage() {
                    var emptyMsg = document.querySelector('#prdDetail .empty-msg');
                    if (!emptyMsg) return;
                    if (relationHasItems()) {
                        emptyMsg.style.display = 'none';
                        emptyMsg.setAttribute('aria-hidden', 'true');
                    } else {
                        emptyMsg.style.display = '';
                        emptyMsg.removeAttribute('aria-hidden');
                    }
                }

                function initRelationObserver() {
                    var target = document.querySelector('#prdDetail') || document.body;
                    if (typeof MutationObserver !== 'undefined') {
                        var observer = new MutationObserver(function () {
                            syncRelationEmptyMessage();
                        });
                        observer.observe(target, {
                            childList: true,
                            subtree: true,
                            characterData: true
                        });
                    }
                }

                document.addEventListener('DOMContentLoaded', function () {
                    syncRelationEmptyMessage();
                    setTimeout(syncRelationEmptyMessage, 200);
                    setTimeout(syncRelationEmptyMessage, 600);
                    initRelationObserver();

                    if (typeof Swiper !== 'undefined') {
                        var relationSwiper = new Swiper('.relation-swiper', {
                            slidesPerView: 4,
                            spaceBetween: 15,
                            watchOverflow: true,
                            navigation: {
                                nextEl: '.relation-next',
                                prevEl: '.relation-prev',
                            },
                            pagination: {
                                el: '.relation-pagination',
                                clickable: true,
                            },
                            breakpoints: {
                                320: { slidesPerView: 2, spaceBetween: 10 },
                                768: { slidesPerView: 3, spaceBetween: 15 },
                                1024: { slidesPerView: 4, spaceBetween: 15 }
                            }
                        });
                    }
                });
            })();


        document.addEventListener("DOMContentLoaded", function () {
            function getBasePrice() {
                var metaPrice = document.querySelector('meta[property="product:sale_price"]') || document.querySelector('meta[property="product:price"]');
                if (metaPrice && metaPrice.content) {
                    return parseInt(metaPrice.content.replace(/[^0-9]/g, ''));
                }
                if (typeof product_price !== 'undefined') {
                    return parseInt(product_price);
                }
                var priceEl = document.querySelector('.infoArea #span_product_price_text, .infoArea .product_price');
                if (priceEl) {
                    return parseInt(priceEl.innerText.replace(/[^0-9]/g, ''));
                }
                return 0;
            }

            var basePrice = getBasePrice();

            function convertNegativePrices(text) {
                if (!basePrice || basePrice === 0) return text;
                return text.replace(/\(\s*-\s*([0-9,]+)\s*원\s*\)/g, function (match, priceStr) {
                    var negativeVal = parseInt(priceStr.replace(/[^0-9]/g, ''));
                    var realVal = basePrice - negativeVal;
                    if (realVal < 0) return match;
                    return '(+' + realVal.toLocaleString() + '원)';
                });
            }

            function addOptionHeadings(selects) {
                var hasAddedRequired = false;
                var hasAddedOptional = false;
                var headingCount = 0;

                selects.forEach(function (select, index) {
                    var tr = select.closest('tr');
                    if (!tr) return;

                    var isRequired = false;
                    var firstOpt = select.options[0];

                    if (firstOpt && (firstOpt.text.includes('[필수]') || firstOpt.text.includes('필수'))) {
                        isRequired = true;
                    } else if (firstOpt && (firstOpt.text.includes('[선택]') || firstOpt.text.includes('선택'))) {
                        isRequired = false;
                    } else {
                        isRequired = select.hasAttribute('required') || select.className.includes('required');
                    }

                    var titleText = "";
                    if (isRequired && !hasAddedRequired) {
                        titleText = "필수 옵션";
                        hasAddedRequired = true;
                    } else if (!isRequired && !hasAddedOptional) {
                        titleText = "선택 옵션";
                        hasAddedOptional = true;
                    }

                    if (titleText !== "" && !tr.dataset.headingAdded) {
                        tr.dataset.headingAdded = "true";
                        var titleTr = document.createElement('tr');
                        titleTr.className = 'custom-option-heading';

                        headingCount++;

                        var marginTop = (headingCount === 1) ? '0px' : '25px';
                        var borderTop = (headingCount === 1) ? 'none' : '1px solid #e5e5e5';
                        var paddingTop = (headingCount === 1) ? '20px' : '35px';

                        titleTr.innerHTML = '<td class="custom-heading-td" colspan="2" style="width:100%; padding:0 !important; border:none !important;"><div style="width:100%; margin-top:' + marginTop + '; padding-top:' + paddingTop + '; padding-bottom:10px; border-top:' + borderTop + '; text-align:left;"><strong style="font-size:14px; color:#333; font-weight:bold; display:block; width:100%;">' + titleText + '</strong></div></td>';
                        tr.parentNode.insertBefore(titleTr, tr);
                    } else {
                        tr.dataset.headingAdded = "true";
                    }
                });
            }

            function formatSelectedOptions() {
                var trs = document.querySelectorAll('tbody.option_products tr, #totalProducts tbody tr, div[id^="totalProducts"] tbody tr');

                trs.forEach(function (tr) {
                    if (tr.dataset.formatted) return;

                    var nameTd = tr.querySelector('td:first-child');
                    if (!nameTd) return;

                    // Check if it's the base product row in a "선택 옵션" layout
                    var hasDeleteBtn = tr.querySelector('.delete, img[src*="delete"], a[href*="option_product_del"]');
                    var hasOptionClass = tr.classList.contains('option_product');

                    var selects = document.querySelectorAll('select');
                    var optionSelects = Array.from(selects).filter(function (s) {
                        return s.id.includes('option_id') || s.name.includes('option') || s.id.includes('product_addoption');
                    });
                    var hasOptions = optionSelects.length > 0;

                    if (!hasDeleteBtn && !hasOptionClass && hasOptions) {
                        // Hide it visually! The user doesn't want the base product row to show up IF there are options available.
                        tr.style.setProperty('display', 'none', 'important');
                        tr.classList.add('base-product-hidden');
                    }

                    if (!tr.querySelector('input[type="text"]') && !tr.className.includes('option_product')) return;

                    // Append delete button properly if needed (fallback)
                    var deleteBtnEl = tr.querySelector('.delete, img[src*="delete"], a[href*="option_product_del"], img[alt="삭제"], .option_box_del, img[src*="close"]');
                    if (deleteBtnEl) {
                        var aTag = deleteBtnEl.tagName.toLowerCase() === 'img' ? (deleteBtnEl.closest('a') || deleteBtnEl) : deleteBtnEl;
                        var tdRight = tr.querySelectorAll('td')[tr.querySelectorAll('td').length - 1];
                        if (tdRight && aTag.parentElement !== tdRight) {
                            tdRight.appendChild(aTag);
                        }
                        aTag.style.setProperty('margin-left', '15px', 'important');
                        aTag.style.setProperty('order', '99', 'important');
                    }

                    var walker = document.createTreeWalker(nameTd, NodeFilter.SHOW_TEXT, null, false);
                    var textNodes = [];
                    var node;
                    while ((node = walker.nextNode())) {
                        if (node.nodeValue.trim() !== '') {
                            textNodes.push(node);
                        }
                    }

                    var optionNodeIndex = -1;
                    for (var i = 0; i < textNodes.length; i++) {
                        if (textNodes[i].nodeValue.trim().startsWith('-')) {
                            optionNodeIndex = i;
                            break;
                        }
                    }

                    if (optionNodeIndex !== -1) {
                        textNodes[optionNodeIndex].nodeValue = textNodes[optionNodeIndex].nodeValue.trim().replace(/^-\s*/, '');

                        for (var j = 0; j < optionNodeIndex; j++) {
                            textNodes[j].nodeValue = '';
                        }

                        var brs = nameTd.querySelectorAll('br');
                        brs.forEach(function (br) { br.style.display = 'none'; });

                        var prodSpans = nameTd.querySelectorAll('span:not(.option), p:not(.product)');
                        prodSpans.forEach(function (span) {
                            if (!span.innerText.includes(textNodes[optionNodeIndex].nodeValue)) {
                                span.style.display = 'none';
                            }
                        });
                    } else {
                        var optionSpan = nameTd.querySelector('.option');
                        if (optionSpan) {
                            Array.from(nameTd.childNodes).forEach(function (child) {
                                if (child.nodeType === Node.TEXT_NODE) child.nodeValue = '';
                                else if (child.nodeType === Node.ELEMENT_NODE && !child.classList.contains('option')) {
                                    child.style.display = 'none';
                                }
                            });
                            if (optionSpan.innerText.trim().startsWith('-')) {
                                optionSpan.innerText = optionSpan.innerText.replace(/^-\s*/, '');
                            }
                        }
                    }

                    // PC 버전: 개별 상품 가격 영역 숨김 (하단 총상품금액과 중복 방지)
                    var priceEls = tr.querySelectorAll('.ec-front-product-item-price, td.right span.price, td:nth-child(3) span');
                    priceEls.forEach(function(el) {
                        el.style.setProperty('display', 'none', 'important');
                    });

                    tr.dataset.formatted = "true";
                });
            }

            function isPhoneInquiryPrice() {
                // 이 상품의 판매가는 화면에는 별도 .price 요소로 노출되지 않고,
                // JSON-LD(offers.price)와 옵션 선택 후 담기는 총합 테이블에만 렌더링됩니다.
                var ldScripts = document.querySelectorAll('script[type="application/ld+json"]');
                for (var i = 0; i < ldScripts.length; i++) {
                    var priceMatch = ldScripts[i].textContent.match(/"price"\s*:\s*"([^"]*)"/);
                    if (priceMatch && priceMatch[1].indexOf('전화문의') !== -1) {
                        return true;
                    }
                }

                var totalRows = document.querySelectorAll('.totalPrice, #totalProducts, tbody.option_products');
                for (var j = 0; j < totalRows.length; j++) {
                    if ((totalRows[j].textContent || '').indexOf('전화문의') !== -1) {
                        return true;
                    }
                }

                return false;
            }

            function fixProductSchema() {
                var ldScripts = document.querySelectorAll('script[type="application/ld+json"]');
                ldScripts.forEach(function (script) {
                    var data;
                    try {
                        data = JSON.parse(script.textContent);
                    } catch (e) {
                        return;
                    }
                    if (data['@type'] === 'Product' && data.offers) {
                        var priceVal = String(data.offers.price || '');
                        var numeric = parseInt(priceVal.replace(/[^0-9]/g, ''));
                        if (!numeric || numeric === 0 || priceVal.indexOf('전화문의') !== -1) {
                            delete data.offers;
                            script.textContent = JSON.stringify(data);
                        }
                    }
                });
            }



            function formatTotalPrice() {
                var selects = document.querySelectorAll('select');
                var optionSelects = Array.from(selects).filter(function (s) {
                    return s.id.includes('option_id') || s.name.includes('option') || s.id.includes('product_addoption');
                });
                var hasOptions = optionSelects.length > 0;
                var isPhoneInquiry = isPhoneInquiryPrice();

                var hasSelectedProduct = false;
                var selectedProducts = document.querySelectorAll('tbody.option_products tr, #totalProducts tbody tr, div[id^="totalProducts"] tbody tr');
                selectedProducts.forEach(function (tr) {
                    // Check true visibility using offsetWidth/offsetHeight. This handles cases where the parent wrapper is hidden.
                    if (tr.offsetWidth > 0 && tr.offsetHeight > 0 && !tr.classList.contains('custom-option-heading')) {
                        if (tr.querySelector('input.quantity_opt, input.eProductQuantityClass, .ec-base-qty input, input[name^="quantity"]')) {
                            hasSelectedProduct = true;
                        }
                    }
                });

                var totalPriceDivs = document.querySelectorAll('.totalPrice');
                totalPriceDivs.forEach(function (totalPriceDiv) {
                    var titleStrong = totalPriceDiv.querySelector('.title, strong:first-child');
                    if (titleStrong && (titleStrong.innerText.includes('총 상품금액') || titleStrong.innerText.includes('TOTAL'))) {
                        titleStrong.innerHTML = 'TOTAL';
                    }

                    var totalCntSpan = totalPriceDiv.querySelector('.total');
                    if (totalCntSpan) {
                        var walker = document.createTreeWalker(totalCntSpan, NodeFilter.SHOW_TEXT, null, false);
                        var node;
                        var nodesToModify = [];
                        while ((node = walker.nextNode())) {
                            nodesToModify.push(node);
                        }
                        nodesToModify.forEach(function (n) {
                            if (n.nodeValue.includes('개') || n.nodeValue.includes('(') || n.nodeValue.includes(')')) {
                                n.nodeValue = n.nodeValue.replace(/[()]/g, '').replace(/[0-9,s]+개/, '').trim();
                            }
                        });
                    }


                    // 주문 페이지 기본배송/업체배송/개별배송 비용 부분 숨김처리
                    // if (isPhoneInquiry) {
                    //     totalPriceDiv.style.setProperty('display', 'none', 'important');
                    // } else if (hasOptions && !hasSelectedProduct) {
                    //     totalPriceDiv.style.setProperty('display', 'none', 'important');
                    // } else {
                    //     totalPriceDiv.style.setProperty('display', 'flex', 'important');
                    // }
                });

                // 판매가 대체문구(전화문의)인 상품은 장바구니/구매하기 버튼을 숨깁니다. (PC/모바일 고정바 모두 포함)
                var buyButtons = document.querySelectorAll('.productAction a.btnSubmit, #orderFixArea a.btnSubmit, .actionCart');
                buyButtons.forEach(function (btn) {
                    if (isPhoneInquiry) {
                        btn.style.setProperty('display', 'none', 'important');
                    } else {
                        btn.style.removeProperty('display');
                    }
                });
            }

            function adjustRowPaddings() {
                var trs = document.querySelectorAll('.infoArea table tbody tr, .ec-base-product table tbody tr, .prdDesc .ec-base-table tbody tr');

                trs.forEach(function (tr) {
                    if (tr.classList.contains('custom-option-heading') || tr.dataset.borderAdded) return;
                    if (tr.querySelector('select, input, .ec-base-qty, .qtyUp, .qtyDown')) return;
                    if (tr.style.display === 'none') return;

                    var th = tr.querySelector('th');
                    var td = tr.querySelector('td');

                    if (th && td) {
                        var title = th.innerText.trim();

                        if (title === '상품간략설명') {
                            th.style.setProperty('padding-bottom', '5px', 'important');
                            td.style.setProperty('padding-bottom', '5px', 'important');
                        } else if (title === '배송비' || title === '할인판매가') {
                            th.style.setProperty('padding-top', '5px', 'important');
                            td.style.setProperty('padding-top', '5px', 'important');
                        } else if (title !== '') {
                            th.style.setProperty('padding-top', '5px', 'important');
                            th.style.setProperty('padding-bottom', '5px', 'important');
                            td.style.setProperty('padding-top', '5px', 'important');
                            td.style.setProperty('padding-bottom', '5px', 'important');
                        }
                    }
                });
            }

            function cleanOptions() {
                var selects = document.querySelectorAll('select');

                var optionSelects = Array.from(selects).filter(function (s) {
                    return s.id.includes('option_id') || s.name.includes('option') || s.id.includes('product_addoption');
                });

                var selectBtns = document.querySelectorAll('.infoArea .selectButton, .ec-base-product .selectButton, .selectButton, [id*="option_push_button"]');
                selectBtns.forEach(function (btn) {
                    btn.style.setProperty('display', 'none', 'important');
                });



                optionSelects.forEach(function (select) {
                    // Find the parent table and add our bulletproof class
                    var table = select.closest('table');
                    if (table) {
                        table.classList.add('custom-option-table');
                    }

                    // Remove any inline widths injected by Cafe24
                    select.style.setProperty('width', '100%', 'important');
                    select.style.setProperty('max-width', '100%', 'important');
                    select.style.boxSizing = 'border-box';
                    select.style.display = 'block';

                    var tr = select.closest('tr');
                    if (tr && !tr.classList.contains('custom-option-tr')) {
                        tr.classList.add('custom-option-tr');
                    }

                    Array.from(select.options).forEach(function (opt) {
                        if (opt.value === '*' || opt.value === '') {
                            if (opt.text.includes('[필수]') || opt.text.includes('필수')) {
                                opt.text = '[필수] 옵션 선택';
                            } else if (opt.text.includes('[선택]') || opt.text.includes('선택')) {
                                opt.text = '[선택] 옵션 선택';
                            }
                        } else {
                            var cleanText = convertNegativePrices(opt.text);
                            if (cleanText !== opt.text) {
                                opt.text = cleanText;
                            }
                        }
                    });
                });

                if (optionSelects.length > 0) {
                    addOptionHeadings(optionSelects);
                }

                var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
                var node;
                while ((node = walker.nextNode())) {
                    if (node.parentElement && node.parentElement.closest('.infoArea, #totalProducts, tbody, .totalPrice, .option_product, .productSet, .ec-base-desc')) {
                        var newText = convertNegativePrices(node.nodeValue);
                        if (newText !== node.nodeValue) {
                            node.nodeValue = newText;
                        }
                    }
                }

                formatSelectedOptions();
                formatTotalPrice();
                adjustRowPaddings();
            }

            fixProductSchema();
            cleanOptions();
            // Auto-click option button when options are selected
            document.body.addEventListener('change', function(e) {
                if (e.target.tagName && e.target.tagName.toLowerCase() === 'select') {
                    if (e.target.id.includes('option_id') || e.target.name.includes('option') || e.target.id.includes('product_addoption')) {
                        var container = e.target.closest('table, .productSet, .infoArea');
                        var addBtns = container ? container.querySelectorAll('.selectButton a, a[onclick*="action_push_button"], a[onclick*="add_action_push_button"]') : [];
                        
                        if (addBtns.length > 0) {
                            var allSelects = container.querySelectorAll('select');
                            var optionSelects = Array.from(allSelects).filter(function (s) {
                                return (s.id.includes('option_id') || s.name.includes('option') || s.id.includes('product_addoption')) && 
                                       s.style.display !== 'none' && 
                                       s.offsetParent !== null && 
                                       !s.disabled;
                            });
                            
                            var allSelected = true;
                            optionSelects.forEach(function(s) {
                                if (s.value === '*' || s.value === '' || s.value.indexOf('선택') > -1) {
                                    allSelected = false;
                                }
                            });
                            
                            if (allSelected) {
                                setTimeout(function() {
                                    addBtns.forEach(function(btn) {
                                        if (btn.style.display !== 'none' || btn.closest('.selectButton')) {
                                            btn.click();
                                        }
                                    });
                                }, 150);
                            }
                        }
                    }
                }
            });

            // PC버전 커스텀 경고창 로직
            var alertShown = false;

            // alert() 대신 화면 정중앙에 뜨는 커스텀 모달 (취소/확인 버튼, 닫기버튼, 바깥 클릭으로 닫힘)
            function showCenterAlert(title, description) {
                if (description === undefined) {
                    description = title;
                    title = '알림';
                }

                var overlay = document.getElementById('custom-center-alert-overlay');
                if (!overlay) {
                    var style = document.createElement('style');
                    style.textContent =
                        '#custom-center-alert-overlay {' +
                        '  position: fixed; top: 0; left: 0; width: 100%; height: 100%;' +
                        '  background: rgba(20, 20, 20, 0.5); backdrop-filter: blur(2px);' +
                        '  z-index: 99999; display: none; align-items: center; justify-content: center;' +
                        '  animation: cca-fade-in 0.18s ease-out;' +
                        '}' +
                        '#custom-center-alert-box {' +
                        '  background: #fff; width: 360px; max-width: 88%;' +
                        '  padding: 28px 28px 24px; border-radius: 20px;' +
                        '  box-shadow: 0 20px 50px rgba(0,0,0,0.25);' +
                        '  text-align: left; position: relative;' +
                        '  font-family: inherit; animation: cca-pop-in 0.2s cubic-bezier(.34,1.56,.64,1);' +
                        '}' +
                        '#custom-center-alert-box .cca-title {' +
                        '  font-size: 19px; font-weight: 800; color: #17171a;' +
                        '  margin: 0 24px 10px 0; word-break: keep-all;' +
                        '}' +
                        '#custom-center-alert-box .cca-msg {' +
                        '  margin-bottom: 24px; word-break: keep-all; font-size: 14.5px;' +
                        '  color: #6b6f76; line-height: 1.55; font-weight: 500;' +
                        '}' +
                        '#custom-center-alert-box .cca-btns { display: flex; gap: 10px; }' +
                        '#custom-center-alert-box .cca-btn {' +
                        '  flex: 1; padding: 13px 0; border-radius: 12px; font-size: 14.5px;' +
                        '  font-weight: 700; cursor: pointer; border: none; transition: filter 0.15s;' +
                        '}' +
                        '#custom-center-alert-box .cca-btn:hover { filter: brightness(0.96); }' +
                        '#custom-center-alert-box .cca-btn-cancel { background: #ECEDF0; color: #26282c; }' +
                        '#custom-center-alert-box .cca-btn-confirm { background: #2563EB; color: #fff; }' +
                        '#custom-center-alert-box .cca-close {' +
                        '  position: absolute; top: 16px; right: 16px; width: 28px; height: 28px;' +
                        '  border-radius: 50%; background: none; border: none; cursor: pointer;' +
                        '  color: #b4b6bb; font-size: 20px; line-height: 1; display: flex;' +
                        '  align-items: center; justify-content: center; transition: background 0.15s, color 0.15s;' +
                        '}' +
                        '#custom-center-alert-box .cca-close:hover { background: #f2f2f2; color: #666; }' +
                        '@keyframes cca-fade-in { from { opacity: 0; } to { opacity: 1; } }' +
                        '@keyframes cca-pop-in { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }';
                    document.head.appendChild(style);

                    overlay = document.createElement('div');
                    overlay.id = 'custom-center-alert-overlay';
                    overlay.innerHTML =
                        '<div id="custom-center-alert-box">' +
                        '  <button type="button" class="cca-close" aria-label="닫기">&times;</button>' +
                        '  <div class="cca-title" id="custom-center-alert-title"></div>' +
                        '  <div class="cca-msg" id="custom-center-alert-msg"></div>' +
                        '  <div class="cca-btns">' +
                        '    <button type="button" class="cca-btn cca-btn-cancel">취소</button>' +
                        '    <button type="button" class="cca-btn cca-btn-confirm">확인</button>' +
                        '  </div>' +
                        '</div>';
                    document.body.appendChild(overlay);

                    var closeOverlay = function () {
                        overlay.style.display = 'none';
                    };

                    overlay.querySelector('.cca-close').addEventListener('click', closeOverlay);
                    overlay.querySelector('.cca-btn-cancel').addEventListener('click', closeOverlay);
                    overlay.querySelector('.cca-btn-confirm').addEventListener('click', closeOverlay);

                    // 모달 바깥(오버레이) 클릭 시 닫힘
                    overlay.addEventListener('click', function (e) {
                        if (e.target === overlay) {
                            closeOverlay();
                        }
                    });
                }

                document.getElementById('custom-center-alert-title').textContent = title;
                document.getElementById('custom-center-alert-msg').textContent = description;
                overlay.style.display = 'flex';
            }

            function validateOptionsAndReturn() {
                var selectedProducts = document.querySelectorAll('tbody.option_products tr, #totalProducts tbody tr, div[id^="totalProducts"] tbody tr');
                var hasSelectedProduct = false;
                selectedProducts.forEach(function (tr) {
                    if (!tr.classList.contains('custom-option-heading') && tr.style.display !== 'none' && !tr.classList.contains('base-product-hidden')) {
                        if (tr.querySelector('input[type="text"], input[type="number"], .quantity_opt, .ec-base-qty, .delete, [src*="delete"], [src*="close"], .option_box_del')) {
                            hasSelectedProduct = true;
                        }
                    }
                });

                if (hasSelectedProduct) {
                    return true;
                }

                var selects = document.querySelectorAll('.infoArea select, .ec-base-product select, .productSet select, table[module="product_option"] select');
                var missingRequired = false;
                var missingOptional = false;
                var hasAnyOptions = false;

                selects.forEach(function(s) {
                    if (s.id.includes('option_id') || s.name.includes('option') || s.id.includes('product_addoption')) {
                        if (s.style.display !== 'none' && s.offsetParent !== null && !s.disabled) {
                            hasAnyOptions = true;
                            var optText = s.options[s.selectedIndex] ? s.options[s.selectedIndex].text : '';
                            if (s.value === '*' || s.value === '' || optText.includes('옵션 선택') || optText.includes('선택해주세요')) {
                                if (optText.includes('필수')) {
                                    missingRequired = true;
                                } else {
                                    missingOptional = true;
                                }
                            }
                        }
                    }
                });

                if (hasAnyOptions && (missingRequired || missingOptional)) {
                    if (!alertShown) {
                        alertShown = true;
                        setTimeout(function() { alertShown = false; }, 1000);
                        
                        if (missingRequired) {
                            showCenterAlert('필수 옵션을 체크해주세요.');
                        } else {
                            showCenterAlert('모든 선택 옵션을 체크해주세요.');
                        }
                    }
                    return false;
                }
                return true;
            }

            function blockEvent(e) {
                var target = e.target;
                if (target && target.nodeType === 3) {
                    target = target.parentNode;
                }
                if (!target || !target.closest) return;

                var btn = target.closest('[module="product_action"] a, [module="product_action"] button, #actionCart, #actionCartClone, .btnStrong, .btnNormal');
                
                if (btn && (btn.textContent.includes('구매') || btn.textContent.includes('장바구니') || btn.id.includes('Cart') || btn.id.includes('Buy') || btn.getAttribute('onclick'))) {
                    if (!validateOptionsAndReturn()) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        return false;
                    }
                }
            }

            window.addEventListener('click', blockEvent, true);
            
            // 최후의 수단: 카페24 기본 submit 함수 래핑
            if (window.product_submit && !window.product_submit.intercepted) {
                var orig_product_submit = window.product_submit;
                window.product_submit = function() {
                    if (!validateOptionsAndReturn()) return false;
                    return orig_product_submit.apply(this, arguments);
                };
                window.product_submit.intercepted = true;
            }

            var observer = new MutationObserver(function (mutations) {
                observer.disconnect();
                cleanOptions();
                observer.observe(document.body, { childList: true, subtree: true, characterData: true });
            });

            observer.observe(document.body, { childList: true, subtree: true, characterData: true });
        });

