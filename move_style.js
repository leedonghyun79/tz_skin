const fs = require('fs');
const htmlFile = 'd:\\\\작업실\\\\study\\\\projects\\\\tvzone_\\\\tz_skin\\\\product\\\\detail.html';
const cssFile = 'd:\\\\작업실\\\\study\\\\projects\\\\tvzone_\\\\tz_skin\\\\css\\\\module\\\\product\\\\detail.css';

let html = fs.readFileSync(htmlFile, 'utf8');
const lines = html.split('\\n');

let startIdx = -1;
let endIdx = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<style>')) {
        let hasIdentifier = false;
        let tempEndIdx = -1;
        for (let j = i; j < lines.length; j++) {
            if (lines[j].includes('#prdDetail .cont .empty-msg')) {
                hasIdentifier = true;
            }
            if (lines[j].includes('</style>')) {
                tempEndIdx = j;
                break;
            }
        }
        if (hasIdentifier && tempEndIdx !== -1) {
            startIdx = i;
            endIdx = tempEndIdx;
            break;
        }
    }
}

if (startIdx !== -1 && endIdx !== -1) {
    const cssLines = lines.slice(startIdx + 1, endIdx);
    const cssContent = '\\n/* 관련 상품 스와이퍼 스타일 (detail.html에서 이동됨) */\\n' + cssLines.join('\\n');
    
    // Append to CSS file
    fs.appendFileSync(cssFile, cssContent, 'utf8');
    
    // Remove from HTML file
    lines.splice(startIdx, endIdx - startIdx + 1);
    fs.writeFileSync(htmlFile, lines.join('\\n'), 'utf8');
    
    console.log('Successfully moved style block from detail.html to detail.css');
} else {
    console.log('Could not find the style block in detail.html');
}
