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
    .infoArea table, .ec-base-product table, table[summary="상품 옵션"], .prdDesc .ec-base-table table, .prdDesc table {
        width: 100% !important;
        table-layout: fixed !important;
    }
    .infoArea th, .ec-base-product th, table[summary="상품 옵션"] th, .prdDesc .ec-base-table th, .prdDesc table th {
        width: 140px !important;
        min-width: 140px !important;
        max-width: 140px !important;
        word-break: keep-all !important;
    }
    
    /* Only apply the 20px top padding to the option THs, not regular info rows */
    tr.custom-option-tr > th {
        padding-top: 20px !important;
    }
    
    /* Ensure all selects inside infoArea take full width */
    .infoArea select, .ec-base-product select, table select, tbody.xans-product-option select, .prdDesc select {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        display: block !important;
    }
    
    /* Remove padding from infoArea td to ensure perfectly flush select alignment */
    .xans-product-detail .infoArea td:not(.custom-heading-td), .prdDesc .ec-base-table td:not(.custom-heading-td) {
        padding-left: 0 !important;
        padding-right: 0 !important;
    }
    
    /* Hide any text byte counters that Cafe24 adds next to additional options */
    .txtByte, .length {
        display: none !important;
    }

    /* ----------------------------------------------------
       Fix for the dark border overlapping issue.
       Place the dark border at the very bottom, right above the Total Price
       ---------------------------------------------------- */
    #totalPrice, .totalPrice {
        /* Reverting this rule just in case, though we applied border on .xans-product-action */
        margin-top: 20px !important;
    }

    /* ----------------------------------------------------
       Make Buy Now and Cart side-by-side 50/50 using Floats
       ---------------------------------------------------- */
    /* Place the dark border at the very bottom, right above the action buttons */
    .xans-product-action {
        border-top: 1px solid #000 !important;
        padding-top: 23px !important;
        margin-top: 23px !important;
    }
       
    .xans-product-action > div:not(.soldout) {
        overflow: hidden !important;
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
    }
    
    .xans-product-action > div:not(.soldout) > a,
    .xans-product-action > div:not(.soldout) > span.gActionButtonColumn,
    .xans-product-action .ec-base-button > a,
    .xans-product-action .ec-base-button > button#actionCart,
    .xans-product-action .ec-base-button > button#actionCartClone {
        width: 49% !important;
        height: 50px !important;
        box-sizing: border-box !important;
        margin: 0 !important;
        padding: 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    }
    
    .xans-product-action > div:not(.soldout) > a,
    .xans-product-action .ec-base-button > a {
        float: right !important;
        text-align: center !important;
        background: #000 !important;
        border: 1px solid #000 !important;
        color: #fff !important;
        text-decoration: none !important;
    }
    
    .xans-product-action > div:not(.soldout) > span.gActionButtonColumn,
    .xans-product-action .ec-base-button > button#actionCart,
    .xans-product-action .ec-base-button > button#actionCartClone {
        float: left !important;
    }
    
    span.gActionButtonColumn > #actionCart,
    span.gActionButtonColumn > .actionCart,
    .xans-product-action .ec-base-button > button#actionCart,
    .xans-product-action .ec-base-button > button#actionCartClone {
        background: #fff !important;
        border: 1px solid #000 !important;
        color: #000 !important;
    }
    
    .xans-product-action > div:not(.soldout) > a:hover,
    .xans-product-action .ec-base-button > a:hover {
        background: #000 !important;
        border: 1px solid #000 !important;
        color: #fff !important;
        opacity: 1 !important;
    }
    
    span.gActionButtonColumn > #actionCart:hover,
    span.gActionButtonColumn > .actionCart:hover,
    .xans-product-action .ec-base-button > button#actionCart:hover,
    .xans-product-action .ec-base-button > button#actionCartClone:hover {
        background: #fff !important;
        border: 1px solid #000 !important;
        color: #000 !important;
        opacity: 1 !important;
    }
    
    #actionWish, #actionWishSoldout, #actionWishClone, .actionWish, .btnNormal.actionWish {
        display: none !important;
    }
    
    span.gActionButtonColumn > #actionCart,
    span.gActionButtonColumn > .actionCart {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
        height: 100% !important;
        box-sizing: border-box !important;
        margin: 0 !important;
        padding: 0 !important;
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
    
    function adjustRowPaddings() {
        var trs = document.querySelectorAll('.infoArea table tbody tr, .ec-base-product table tbody tr, .prdDesc .ec-base-table tbody tr');
        
        trs.forEach(function(tr) {
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

            var tr = select.closest('tr');
            if (tr && !tr.classList.contains('custom-option-tr')) {
                tr.classList.add('custom-option-tr');
            }

            Array.from(select.options).forEach(function(opt) {
                if (opt.value === '*' || opt.value === '') {
                    if (opt.text.includes('[필수]') || opt.text.includes('필수')) {
                        opt.text = '[필수] 옵션 선택';
                    } else if (opt.text.includes('[선택]') || opt.text.includes('선택')) {
                        opt.text = '[선택] 옵션 선택';
                    }
                } else {
                    var 지저분한단어들 = convertNegativePrices(opt.text);
                    if (지저분한단어들 !== opt.text) {
                        opt.text = 지저분한단어들;
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
        console.log('Fixed select width issue for mobile .prdDesc class in ' + f);
    }
});
