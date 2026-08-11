const fs = require('fs');
const files = [
    'product/detail.html',
    'mob/mobile5/product/detail.html'
];
const snippet = `
<!-- Custom Option Cleaner Script -->
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
        selects.forEach(function(select, index) {
            var tr = select.closest('tr');
            if (tr && !tr.dataset.headingAdded) {
                tr.dataset.headingAdded = "true";
                var titleTr = document.createElement('tr');
                titleTr.className = 'custom-option-heading';
                
                var titleText = "";
                var isFirst = false;
                
                if (index === 0) {
                    titleText = "필수 옵션";
                    isFirst = true;
                } else if (index === 1) {
                    titleText = "추가 옵션";
                    isFirst = false;
                }
                
                if (titleText !== "") {
                    var paddingTop = isFirst ? '15px' : '25px';
                    var borderTop = isFirst ? 'none' : '1px solid #e5e5e5';
                    
                    titleTr.innerHTML = '<td colspan="2" style="width:100%; padding-top:'+paddingTop+'; padding-bottom:10px; border-bottom:none; border-top:'+borderTop+'; text-align:left;"><strong style="font-size:14px; color:#333; font-weight:bold; display:block; width:100%;">' + titleText + '</strong></td>';
                    tr.parentNode.insertBefore(titleTr, tr);
                }
            }
        });
    }

    function cleanOptions() {
        var selects = document.querySelectorAll('select[id^="product_option_id"], select[name^="option"]');
        if (selects.length > 0) {
            addOptionHeadings(selects);
        }
        
        selects.forEach(function(select) {
            // Ensure all select tags have the exact same width (filling their container)
            if (select.style.width !== '100%') {
                select.style.width = '100%';
                select.style.boxSizing = 'border-box';
                select.style.maxWidth = '100%';
            }

            Array.from(select.options).forEach(function(opt) {
                if (opt.value === '*' || opt.value === '') {
                    if (opt.text.includes('[필수]')) {
                        opt.text = '[필수] 옵션 선택';
                    } else if (opt.text.includes('[선택]')) {
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

        // Clean dynamically added selected options
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
    }

    // Run once on load
    cleanOptions();
    
    // Setup observer
    var observer = new MutationObserver(function(mutations) {
        // Disconnect to prevent infinite loop while updating DOM
        observer.disconnect();
        
        cleanOptions();
        
        // Re-observe after changes are done
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
        console.log('Fixed select widths in ' + f);
    }
});
