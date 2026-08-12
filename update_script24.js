const fs = require('fs');
const files = [
    'product/detail.html',
    'product/detail_n.html',
    'mob/mobile5/product/detail.html'
];
const snippet = `
<!-- Custom Option Cleaner Script -->
<style>
    /* Hide the redundant "옵션선택" button since options auto-add */
    .infoArea .selectButton,
    .ec-base-product .selectButton,
    .infoArea a.btnSubmit.sizeS,
    .ec-base-product a.btnSubmit.sizeS {
        display: none !important;
    }
    
    /* Hide minimum quantity info completely */
    .guideArea .info {
        display: none !important;
    }
    
    .totalPrice .title {
        color: #333 !important;
    }

    /* Force tables to be 100% and TH to have fixed width so all selects align perfectly */
    .infoArea table, .ec-base-product table, table[summary="상품 옵션"] {
        width: 100% !important;
        table-layout: fixed !important;
    }
    .infoArea th, .ec-base-product th, table[summary="상품 옵션"] th {
        width: 140px !important; /* Large enough to fit 9-10 Korean characters perfectly */
        min-width: 140px !important;
        max-width: 140px !important;
        word-break: keep-all !important;
        padding-top: 20px !important; /* Vertically align text with select boxes */
    }
    
    /* Ensure all selects inside infoArea take full width */
    .infoArea select, .ec-base-product select, table select, tbody.xans-product-option select {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        display: block !important;
    }
    
    /* Remove padding from infoArea td to ensure perfectly flush select alignment */
    .xans-product-detail .infoArea td:not(.custom-heading-td) {
        padding-left: 0 !important;
        padding-right: 0 !important;
    }
    
    /* Hide any text byte counters that Cafe24 adds next to additional options */
    .txtByte, .length {
        display: none !important;
    }

    /* Hide Wishlist button and expand Cart button to full width */
    #actionWish, #actionWishSoldout, .actionWish, .btnNormal.actionWish {
        display: none !important;
    }
    #actionCart, .actionCart, .btnNormal.actionCart, .gActionButtonColumn button.actionCart {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
    }
    .gActionButtonColumn {
        display: block !important;
        width: 100% !important;
    }
</style>
<script>
document.addEventListener("DOMContentLoaded", function() {
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
        return text.replace(/\\(\\s*-\\s*([0-9,]+)\\s*원\\s*\\)/g, function(match, priceStr) {
            var negativeVal = parseInt(priceStr.replace(/[^0-9]/g, ''));
            var realVal = basePrice - negativeVal;
            if (realVal < 0) return match;
            return '(+' + realVal.toLocaleString() + '원)';
        });
    }

    function addOptionHeadings(selects) {
        var hasAddedRequired = false;
        var hasAddedOptional = false;

        selects.forEach(function(select, index) {
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
                titleText = "추가 옵션";
                hasAddedOptional = true;
            }
            
            if (titleText !== "" && !tr.dataset.headingAdded) {
                tr.dataset.headingAdded = "true";
                var titleTr = document.createElement('tr');
                titleTr.className = 'custom-option-heading';
                
                var borderTop = (titleText === "필수 옵션") ? 'none' : '1px solid #e5e5e5';
                var paddingTop = (titleText === "필수 옵션") ? '0px !important' : '20px !important';
                
                titleTr.innerHTML = '<td class="custom-heading-td" colspan="2" style="width:100%; padding-top:' + paddingTop + '; padding-bottom:10px !important; border-bottom:none; border-top:'+borderTop+'; text-align:left;"><strong style="font-size:14px; color:#333; font-weight:bold; display:block; width:100%;">' + titleText + '</strong></td>';
                tr.parentNode.insertBefore(titleTr, tr);
            } else {
                tr.dataset.headingAdded = "true";
            }
        });

        if (selects.length > 0) {
            var lastSelect = selects[selects.length - 1];
            var lastTr = lastSelect.closest('tr');
            if (lastTr && !lastTr.dataset.borderAdded) {
                lastTr.dataset.borderAdded = "true";
                
                var tds = lastTr.querySelectorAll('th, td');
                tds.forEach(function(td) {
                    td.style.borderBottom = 'none';
                    td.style.paddingBottom = '15px !important';
                });
                
                var borderTr = document.createElement('tr');
                borderTr.innerHTML = '<td class="custom-heading-td" colspan="2" style="width:100%; padding:0 !important; border-top:1px solid #e5e5e5;"></td>';
                lastTr.parentNode.insertBefore(borderTr, lastTr.nextSibling);
            }
        }
    }

    function formatSelectedOptions() {
        var trs = document.querySelectorAll('tbody.option_products tr, #totalProducts tbody tr, div[id^="totalProducts"] tbody tr');
        
        trs.forEach(function(tr) {
            if (tr.dataset.formatted) return;
            
            var nameTd = tr.querySelector('td:first-child');
            if (!nameTd) return;
            
            if (!tr.querySelector('input[type="text"]') && !tr.className.includes('option_product')) return;

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
                textNodes[optionNodeIndex].nodeValue = textNodes[optionNodeIndex].nodeValue.trim().replace(/^-\\s*/, '');
                
                for (var j = 0; j < optionNodeIndex; j++) {
                    textNodes[j].nodeValue = '';
                }
                
                var brs = nameTd.querySelectorAll('br');
                brs.forEach(function(br) { br.style.display = 'none'; });
                
                var prodSpans = nameTd.querySelectorAll('span:not(.option), p:not(.product)');
                prodSpans.forEach(function(span) {
                    if (!span.innerText.includes(textNodes[optionNodeIndex].nodeValue)) {
                        span.style.display = 'none';
                    }
                });
            } else {
                var optionSpan = nameTd.querySelector('.option');
                if (optionSpan) {
                    Array.from(nameTd.childNodes).forEach(function(child) {
                        if (child.nodeType === Node.TEXT_NODE) child.nodeValue = '';
                        else if (child.nodeType === Node.ELEMENT_NODE && !child.classList.contains('option')) {
                            child.style.display = 'none';
                        }
                    });
                    if (optionSpan.innerText.trim().startsWith('-')) {
                        optionSpan.innerText = optionSpan.innerText.replace(/^-\\s*/, '');
                    }
                }
            }

            tr.dataset.formatted = "true";
        });
    }

    function formatTotalPrice() {
        var totalPriceDivs = document.querySelectorAll('.totalPrice');
        totalPriceDivs.forEach(function(totalPriceDiv) {
            var titleStrong = totalPriceDiv.querySelector('.title, strong:first-child');
            if (!titleStrong) return;
            
            var totalCntSpan = totalPriceDiv.querySelector('span:not(.title)');
            if (!totalCntSpan && titleStrong) {
                totalCntSpan = titleStrong.nextElementSibling;
            }
            if (!totalCntSpan) return;

            var qtyStr = "";
            var qtyNum = -1;
            var walker = document.createTreeWalker(totalCntSpan, NodeFilter.SHOW_TEXT, null, false);
            var node;
            while ((node = walker.nextNode())) {
                var match = node.nodeValue.match(/\\(([0-9,\\s]+)개\\)/);
                if (match) {
                    qtyStr = match[0];
                    qtyNum = parseInt(match[1].replace(/[^0-9]/g, ''));
                    node.nodeValue = node.nodeValue.replace(/\\([0-9,\\s]+개\\)/, '').trim();
                }
            }
            
            if (qtyNum === 0) {
                totalPriceDiv.style.display = 'none';
            } else {
                totalPriceDiv.style.display = '';
            }
            
            if (qtyStr) {
                titleStrong.innerHTML = '총 상품금액 <span style="font-weight:normal; font-size:14px; color:#777; margin-left:5px;">' + qtyStr + '</span>';
            } else {
                if (titleStrong.innerText.includes('TOTAL') || titleStrong.innerText.includes('총 상품금액')) {
                    titleStrong.innerHTML = '총 상품금액';
                }
            }
        });
    }

    function cleanOptions() {
        var selects = document.querySelectorAll('.infoArea select, .ec-base-product select, tbody.xans-product-option select, table select');
        
        var optionSelects = Array.from(selects).filter(function(s) {
            return s.id.includes('option_id') || s.name.includes('option') || s.id.includes('product_addoption');
        });

        optionSelects.forEach(function(select) {
            if (select.style.width !== '100%') {
                select.style.width = '100%';
                select.style.boxSizing = 'border-box';
                select.style.maxWidth = '100%';
                select.style.display = 'block';
            }

            Array.from(select.options).forEach(function(opt) {
                if (opt.value === '*' || opt.value === '') {
                    if (opt.text.includes('[필수]') || opt.text.includes('필수')) {
                        opt.text = '[필수] 옵션 선택';
                    } else if (opt.text.includes('[선택]') || opt.text.includes('선택')) {
                        opt.text = '[선택] 옵션 선택';
                    }
                } else {
                    var newText = convertNegativePrices(opt.text);
                    if (newText !== opt.text) {
                        opt.text = newText;
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
    }

    cleanOptions();
    
    var observer = new MutationObserver(function(mutations) {
        observer.disconnect();
        cleanOptions();
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    });
    
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
});
</script>
`;

files.forEach(f => {
    if(fs.existsSync(f)) {
        let text = fs.readFileSync(f, 'utf8');
        let idx = text.indexOf('<!-- Custom Option Cleaner Script -->');
        if (idx !== -1) {
            text = text.substring(0, idx).trim();
        }
        text += '\n\n' + snippet.trim();
        fs.writeFileSync(f, text, 'utf8');
        console.log('Hid wishlist and expanded cart in ' + f);
    }
});
