const fs = require('fs');
const files = [
    'product/detail.html',
    'product/detail_n.html',
    'mob/mobile5/product/detail.html'
];
const snippet = `
<!-- Custom Option Cleaner Script -->
<style>
    /* Removed hiding of .selectButton to allow "연동형 옵션" (Linked Options) to be added */
    
    /* Hide minimum quantity info completely */
    .guideArea .info {
        display: none !important;
    }
    
    .totalPrice .title {
        color: #333 !important;
    }

    /* ----------------------------------------------------
       FLEXBOX Option Layout
       Tables are too inconsistent across devices. 
       We force the option rows into a flex layout for perfect alignment.
       ---------------------------------------------------- */
    table.custom-option-table {
        width: 100% !important;
        display: block !important;
    }
    table.custom-option-table > tbody,
    table.custom-option-table > colgroup {
        display: block !important;
        width: 100% !important;
    }
    table.custom-option-table tr.custom-option-tr {
        display: flex !important;
        width: 100% !important;
        align-items: center !important;
        box-sizing: border-box !important;
        margin-bottom: 5px !important;
    }
    table.custom-option-table tr.custom-option-heading {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
    }
    table.custom-option-table th {
        display: block !important;
        width: 130px !important;
        min-width: 130px !important;
        max-width: 130px !important;
        flex: 0 0 130px !important; /* Force exact 130px width */
        word-break: keep-all !important;
        padding-left: 0 !important;
        box-sizing: border-box !important;
        text-align: left !important;
    }
    table.custom-option-table td {
        display: block !important;
        flex: 1 1 auto !important; /* Take all remaining space */
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        box-sizing: border-box !important;
    }
    table.custom-option-table td.custom-heading-td {
        display: block !important;
        width: 100% !important;
        flex: none !important;
    }
    
    /* Extreme Specificity to override Cafe24 inline JS and default styles */
    body .xans-product-detail table.custom-option-table select,
    body .xans-product-detail table select.ProductOption0,
    body select[id^="product_option_id"] {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        display: block !important;
    }
    
    /* Only apply the 20px top padding to the option THs, not regular info rows */
    tr.custom-option-tr > th {
        padding-top: 10px !important;
        padding-bottom: 20px !important;
    }
    tr.custom-option-tr > td {
        padding-top: 10px !important;
        padding-bottom: 20px !important;
    }
    
    /* Hide any text byte counters that Cafe24 adds next to additional options */
    .txtByte, .length {
        display: none !important;
    }

    /* ----------------------------------------------------
       Total Price Layout matching Options
       ---------------------------------------------------- */
    #totalPrice, .totalPrice {
        display: flex !important;
        align-items: center !important;
        width: 100% !important;
        padding-top: 20px !important;
        padding-bottom: 20px !important;
        border-top: 1px solid #e5e5e5 !important;
        box-sizing: border-box !important;
        margin-top: 0 !important;
        font-size: 0 !important; /* Hide stray colons or text nodes */
    }

    .totalPrice .title, .totalPrice > strong:first-child {
        display: block !important;
        width: 130px !important;
        min-width: 130px !important;
        max-width: 130px !important;
        flex: 0 0 130px !important;
        font-size: 14px !important;
        color: #333 !important;
        font-weight: bold !important;
        text-align: left !important;
        margin: 0 !important;
        padding: 0 !important;
    }

    .totalPrice .total {
        flex: 1 1 auto !important;
        text-align: right !important;
        font-size: 13px !important; /* Style the (0개) text node */
        color: #777 !important;
        font-weight: normal !important;
        display: flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
    }
    
    .totalPrice .total > strong {
        font-size: 18px !important; /* Style the price value */
        color: #000 !important;
        font-weight: bold !important;
    }
    
    .totalPrice .total em {
        font-style: normal !important;
    }

    .totalPrice .total > span, .totalPrice .total > img {
        font-size: 13px !important;
        color: #777 !important;
        font-weight: normal !important;
        margin-left: 5px !important;
    }
    
    /* Clean up the duplicated "(0개)" injected by older scripts in HTML */
    .totalPrice .title span.old-qty, .totalPrice > strong:first-child span.old-qty {
        display: none !important;
    }

    /* ----------------------------------------------------
       Selected Products Row Layout (Option Name / Qty / Price)
       ---------------------------------------------------- */
    tbody.option_products tr:not([style*="display: none"]):not([style*="display:none"]):not(.displaynone), 
    #totalProducts tbody tr:not([style*="display: none"]):not([style*="display:none"]):not(.displaynone), 
    div[id^="totalProducts"] tbody tr:not([style*="display: none"]):not([style*="display:none"]):not(.displaynone) {
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        justify-content: space-between !important;
        padding: 10px 0 !important;
        border-bottom: none !important;
        width: 100% !important;
        box-sizing: border-box !important;
    }
    
    tbody.option_products tr td, 
    #totalProducts tbody tr td, 
    div[id^="totalProducts"] tbody tr td {
        border: none !important;
        padding: 0 !important;
        display: flex !important;
        align-items: center !important;
    }
    
    #totalProducts table, .option_products {
        display: block !important;
        width: 100% !important;
    }
    #totalProducts tbody, tbody.option_products {
        display: block !important;
        width: 100% !important;
    }
    
    /* PC / Default Layout */
    @media (min-width: 769px) {
        tbody.option_products tr:not([style*="display: none"]):not([style*="display:none"]):not(.displaynone), 
        #totalProducts tbody tr:not([style*="display: none"]):not([style*="display:none"]):not(.displaynone), 
        div[id^="totalProducts"] tbody tr:not([style*="display: none"]):not([style*="display:none"]):not(.displaynone) {
            flex-wrap: nowrap !important;
        }
        tbody.option_products tr td:first-child, 
        #totalProducts tbody tr td:first-child {
            flex: 1 1 0% !important;
            min-width: 0 !important;
            justify-content: flex-start !important;
        }
        tbody.option_products tr td:not(:first-child), 
        #totalProducts tbody tr td:not(:first-child) {
            flex: 0 0 auto !important;
            justify-content: flex-end !important;
            margin-left: 10px !important;
        }
    }

    /* Mobile Layout */
    @media (max-width: 768px) {
        tbody.option_products tr td:first-child, 
        #totalProducts tbody tr td:first-child,
        div[id^="totalProducts"] tbody tr td:first-child {
            flex: 1 1 100% !important;
            width: 100% !important;
            margin-bottom: 15px !important;
        }
        tbody.option_products tr td:nth-child(2), 
        #totalProducts tbody tr td:nth-child(2),
        div[id^="totalProducts"] tbody tr td:nth-child(2) {
            flex: 0 0 auto !important;
            justify-content: flex-start !important;
        }
        tbody.option_products tr td:last-child, 
        #totalProducts tbody tr td:last-child,
        div[id^="totalProducts"] tbody tr td:last-child {
            flex: 1 1 auto !important;
            justify-content: flex-end !important;
        }
    }

    tbody.option_products tr td .ec-base-qty,
    #totalProducts tbody tr td .ec-base-qty {
        margin-right: 0 !important;
    }
    
    tbody.option_products tr td .price,
    #totalProducts tbody tr td .price {
        order: 2 !important;
        font-size: 15px !important;
        font-weight: bold !important;
    }
    
    tbody.option_products tr td .delete,
    tbody.option_products tr td a[href*="option_product_del"],
    #totalProducts tbody tr td .delete,
    #totalProducts tbody tr td img[src*="delete"] {
        order: 99 !important; /* Force to far right */
        margin-left: 15px !important;
    }
    
    /* Make Cafe24's quantity box look neat */
    .ec-base-qty {
        display: flex !important;
        align-items: center !important;
        margin-right: 5px !important;
    }
    
    tbody.option_products tr td .price, #totalProducts tbody tr td .price, div[id^="totalProducts"] tbody tr td .price {
        font-size: 15px !important;
        font-weight: bold !important;
        color: #000 !important;
    }

    /* ----------------------------------------------------
       Fix for the dark border overlapping issue.
       Place the dark border at the very bottom, right above the action buttons
       ---------------------------------------------------- */
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
            
            // Check if it's the base product row in a "추가 옵션" layout
            var hasDeleteBtn = tr.querySelector('.delete, img[src*="delete"], a[href*="option_product_del"]');
            var hasOptionClass = tr.classList.contains('option_product');
            
            var selects = document.querySelectorAll('select');
            var optionSelects = Array.from(selects).filter(function(s) {
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
        var selects = document.querySelectorAll('select');
        var optionSelects = Array.from(selects).filter(function(s) {
            return s.id.includes('option_id') || s.name.includes('option') || s.id.includes('product_addoption');
        });
        var hasOptions = optionSelects.length > 0;
        
        var hasSelectedProduct = false;
        var selectedProducts = document.querySelectorAll('tbody.option_products tr, #totalProducts tbody tr, div[id^="totalProducts"] tbody tr');
        selectedProducts.forEach(function(tr) {
            // Check true visibility using offsetWidth/offsetHeight. This handles cases where the parent wrapper is hidden.
            if (tr.offsetWidth > 0 && tr.offsetHeight > 0 && !tr.classList.contains('custom-option-heading')) {
                if (tr.querySelector('input.quantity_opt, input.eProductQuantityClass, .ec-base-qty input, input[name^="quantity"]')) {
                    hasSelectedProduct = true;
                }
            }
        });

        var totalPriceDivs = document.querySelectorAll('.totalPrice');
        totalPriceDivs.forEach(function(totalPriceDiv) {
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
                nodesToModify.forEach(function(n) {
                    if (n.nodeValue.includes('개') || n.nodeValue.includes('(') || n.nodeValue.includes(')')) {
                        n.nodeValue = n.nodeValue.replace(/[()]/g, '').replace(/[0-9,\s]+개/, '').trim();
                    }
                });
            }



            if (hasOptions && !hasSelectedProduct) {
                totalPriceDiv.style.setProperty('display', 'none', 'important');
            } else {
                totalPriceDiv.style.setProperty('display', 'flex', 'important');
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
        var selects = document.querySelectorAll('select');
        
        var optionSelects = Array.from(selects).filter(function(s) {
            return s.id.includes('option_id') || s.name.includes('option') || s.id.includes('product_addoption');
        });

        var selectBtns = document.querySelectorAll('.infoArea .selectButton, .ec-base-product .selectButton, .selectButton');
        if (optionSelects.length === 0) {
            selectBtns.forEach(function(btn) {
                btn.style.setProperty('display', 'none', 'important');
            });
        } else {
            selectBtns.forEach(function(btn) {
                if (btn.style.getPropertyValue('display') === 'none') {
                    btn.style.removeProperty('display');
                }
            });
        }

        optionSelects.forEach(function(select) {
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

            Array.from(select.options).forEach(function(opt) {
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
        console.log('Fixed flexbox layout for total price in ' + f);
    }
});
