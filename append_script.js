const fs = require('fs');
const files = [
    'product/detail.html',
    'mob/mobile5/product/detail.html'
];
const snippet = `
<!-- Custom Option Cleaner Script -->
<script>
document.addEventListener("DOMContentLoaded", function() {
    var firstOptionPrices = new Set();
    var isInitialized = false;

    function cleanOptions() {
        var selects = document.querySelectorAll('select[id^="product_option_id"], select[name^="option"]');
        if(selects.length === 0) return;
        
        selects.forEach(function(select, index) {
            Array.from(select.options).forEach(function(opt) {
                // Change placeholder text
                if (opt.value === '*' || opt.value === '') {
                    if (opt.text.includes('[필수]') || opt.text.includes('[선택]')) {
                        opt.text = '옵션 선택';
                    }
                } else {
                    // Match "(+ 50,000원)" or "(-50,000원)" or "(+50,000원)" etc.
                    var match = opt.text.match(/(\\s*\\([+-]\\s*[\\d,]+원\\))$/);
                    if (index === 0) {
                        // First option: record its prices to not delete them from the total area later
                        if (match && !isInitialized) {
                            firstOptionPrices.add(match[1].trim());
                        }
                    } else {
                        // 2nd option onwards: remove the price text
                        if (match) {
                            opt.text = opt.text.replace(match[1], '');
                        }
                    }
                }
            });
        });
        isInitialized = true;

        // Clean dynamically added selected options
        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        var node;
        while ((node = walker.nextNode())) {
            // Target areas where Cafe24 renders selected options and quantities
            if (node.parentElement && node.parentElement.closest('.infoArea, #totalProducts, tbody, .totalPrice, .option_product, .productSet, .ec-base-desc')) {
                var text = node.nodeValue;
                var priceMatches = text.match(/\\(\\s*[+-]\\s*[\\d,]+원\\s*\\)/g);
                if (priceMatches) {
                    var newText = text;
                    priceMatches.forEach(function(pMatch) {
                        // Only remove if it doesn't belong to the first option
                        if (!firstOptionPrices.has(pMatch.trim())) {
                            newText = newText.replace(pMatch, '');
                        }
                    });
                    if (newText !== text) {
                        node.nodeValue = newText;
                    }
                }
            }
        }
    }

    // Run immediately
    cleanOptions();
    
    // Run continuously for dynamic changes (like adding an option)
    var observer = new MutationObserver(function(mutations) {
        cleanOptions();
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
});
</script>
`;

files.forEach(f => {
    if(fs.existsSync(f)) {
        let text = fs.readFileSync(f, 'utf8');
        if(!text.includes('Custom Option Cleaner Script')) {
            text += '\n' + snippet;
            fs.writeFileSync(f, text, 'utf8');
            console.log('Appended to ' + f);
        } else {
            console.log('Already exists in ' + f);
        }
    }
});
