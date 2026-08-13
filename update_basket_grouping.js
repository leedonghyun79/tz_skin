const fs = require('fs');

const files = [
    'mob/mobile5/order/basket.html',
    'mob/mobile5/order/orderform.html'
];

const scriptContent = `
<!-- Custom Cart Grouping Script -->
<style>
    /* Grouped Option Styles */
    .ec-base-prdInfo.is-grouped-option {
        border-top: 1px dashed #e8e8e8 !important;
        padding-top: 15px !important;
        background-color: #fcfcfc !important;
        margin-top: -1px !important; /* pull up to hide double border if any */
    }
    .ec-base-prdInfo.is-grouped-option .prdBox {
        display: block !important;
    }
    .ec-base-prdInfo.is-grouped-option .thumbnail {
        display: none !important;
    }
    .ec-base-prdInfo.is-grouped-option .description {
        display: block !important;
        width: 100% !important;
        padding-left: 0 !important;
    }
    .ec-base-prdInfo.is-grouped-option .prdName {
        font-size: 13px !important;
        color: #555 !important;
        font-weight: normal !important;
    }
    .ec-base-prdInfo.is-grouped-option .prdName:before {
        content: '↳ ';
        color: #999;
    }
    
    /* Make the base product look connected */
    .ec-base-prdInfo.has-grouped-options {
        border-bottom: none !important;
        padding-bottom: 10px !important;
    }
</style>
<script>
document.addEventListener('DOMContentLoaded', function() {
    function groupCartItems() {
        var lists = document.querySelectorAll('[module="Order_list"], .Order_list');
        
        lists.forEach(function(list) {
            var items = list.querySelectorAll('.ec-base-prdInfo');
            var currentBaseItem = null;
            var lastInsertedItem = null;
            
            items.forEach(function(item) {
                var prdNameEl = item.querySelector('.prdName');
                if (!prdNameEl) return;
                
                var nameText = prdNameEl.innerText.trim();
                
                var isOption = nameText.indexOf('[옵션]') === 0 || 
                               nameText.indexOf('(옵션)') === 0 || 
                               nameText.indexOf('추가옵션') > -1 ||
                               nameText.indexOf('선택:') > -1;
                               
                if (isOption) {
                    if (currentBaseItem) {
                        item.classList.add('is-grouped-option');
                        currentBaseItem.classList.add('has-grouped-options');
                        
                        // Insert after the last inserted item for this base product
                        list.insertBefore(item, lastInsertedItem.nextSibling);
                        lastInsertedItem = item;
                    }
                } else {
                    currentBaseItem = item;
                    lastInsertedItem = item;
                }
            });
        });
    }

    // Run grouping
    groupCartItems();
    
    // Also run after ajax complete if Cafe24 updates cart via ajax
    if (typeof window.$ !== 'undefined') {
        $(document).ajaxComplete(function(event, xhr, settings) {
            if (settings.url && settings.url.indexOf('basket') > -1) {
                setTimeout(groupCartItems, 300);
            }
        });
    }
});
</script>
<!-- // Custom Cart Grouping Script -->
`;

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(/<!-- Custom Cart Grouping Script -->[\s\S]*?<!-- \/\/ Custom Cart Grouping Script -->\n?/g, '');
        content += '\n' + scriptContent;
        fs.writeFileSync(file, content);
        console.log('Updated ' + file);
    }
});
