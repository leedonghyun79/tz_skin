const fs = require('fs');

const updateScriptPath = 'update_script42.js';
const pcCssPath = 'css/module/product/detail.css';
const mobileCssPath = 'mobile5/css/module/product/detail.css';

let scriptContent = fs.readFileSync(updateScriptPath, 'utf8');
const lines = scriptContent.split('\\n');

let styleStart = -1;
let styleEnd = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<style>')) {
        styleStart = i;
    } else if (lines[i].includes('</style>')) {
        styleEnd = i;
        break;
    }
}

if (styleStart !== -1 && styleEnd !== -1) {
    const styleLines = lines.slice(styleStart + 1, styleEnd);
    const cssToAdd = '\\n/* ----------------------------------------- */\\n/* Custom Option Cleaner Styles (moved from update_script42.js) */\\n/* ----------------------------------------- */\\n' + styleLines.join('\\n');
    
    // Append to PC CSS
    fs.appendFileSync(pcCssPath, cssToAdd, 'utf8');
    // Append to Mobile CSS
    fs.appendFileSync(mobileCssPath, cssToAdd, 'utf8');
    
    // Remove the style block from update_script42.js
    lines.splice(styleStart, styleEnd - styleStart + 1);
    fs.writeFileSync(updateScriptPath, lines.join('\\n'), 'utf8');
    
    console.log('Successfully extracted styles from update_script42.js and appended to both CSS files.');
} else {
    console.log('Could not find the <style> block in update_script42.js');
}
