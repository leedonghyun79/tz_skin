const fs = require('fs');

const inputFile = '삼성 키오스크 _ 옵션.csv';
const outputFile = '삼성 키오스크 _ 옵션_완성본.csv';

// Read file (assuming it is UTF-8 with BOM based on previous tests)
let text = fs.readFileSync(inputFile, 'utf8');

// A robust CSV parser for Cafe24 (handles quotes and newlines)
function parseCSV(str) {
    let rows = [];
    let row = [];
    let cell = '';
    let insideQuote = false;
    for (let i = 0; i < str.length; i++) {
        let c = str[i];
        if (insideQuote) {
            if (c === '"') {
                if (i + 1 < str.length && str[i + 1] === '"') {
                    cell += '"';
                    i++;
                } else {
                    insideQuote = false;
                }
            } else {
                cell += c;
            }
        } else {
            if (c === '"') {
                insideQuote = true;
            } else if (c === ',') {
                row.push(cell);
                cell = '';
            } else if (c === '\n') {
                // remove trailing CR if exists
                if (cell.endsWith('\r')) cell = cell.slice(0, -1);
                row.push(cell);
                rows.push(row);
                row = [];
                cell = '';
            } else {
                cell += c;
            }
        }
    }
    if (cell || row.length > 0) {
        if (cell.endsWith('\r')) cell = cell.slice(0, -1);
        row.push(cell);
        rows.push(row);
    }
    return rows;
}

function stringifyCSV(rows) {
    return rows.map(row => {
        return row.map(cell => {
            if (cell === null || cell === undefined) cell = '';
            cell = String(cell);
            // Quote if it contains comma, double quote, or newline
            if (cell.includes(',') || cell.includes('"') || cell.includes('\n') || cell.includes('\r')) {
                return '"' + cell.replace(/"/g, '""') + '"';
            }
            return cell;
        }).join(',');
    }).join('\r\n');
}

let rows = parseCSV(text);
const header = rows[0];

// Find column indices
let modelIdx = -1;
let priceIdx = -1;
let optionIdx = -1;

for (let i = 0; i < header.length; i++) {
    const colName = header[i].replace(/^\uFEFF/, '').trim(); // strip BOM
    if (colName === '모델명') modelIdx = i;
    if (colName === '판매가') priceIdx = i;
    if (colName === '옵션입력') optionIdx = i;
}

if (modelIdx === -1 || priceIdx === -1 || optionIdx === -1) {
    console.error("Could not find required columns:", {modelIdx, priceIdx, optionIdx});
    process.exit(1);
}

for (let i = 1; i < rows.length; i++) {
    let row = rows[i];
    if (row.length < optionIdx) continue;
    
    let model = row[modelIdx].trim();
    if (!model) continue;
    
    let basePrice = parseFloat(row[priceIdx]);
    if (isNaN(basePrice)) continue;
    
    function fmt(val) {
        return val >= 0 ? '+ ' + val : '- ' + Math.abs(val);
    }
    
    let stb_str = 'DID전용 SetTop Box{USB 미디어타입 (+ 165000원)|안드로이드타입 (+ 220000원)|PC타입(i5/RAM4G/SSD128/OS포함) (+ 770000원)}';
    let tcms_str = '솔루션프로그램추가{안드로이드/PC 타입 T-CMS 3년 (' + fmt(330000 - basePrice) + '원)}';
    let touch_str = '터치{정전압식 터치 (' + fmt(770000 - basePrice) + '원)}';
    let spk_str = '스피커 추가{추가함 (' + fmt(55000 - basePrice) + '원)}';
    let wheel_str = '이동형 바퀴{부착함 (' + fmt(44000 - basePrice) + '원)}';
    
    let zero_fmt = fmt(-basePrice);
    let installBase = (model === 'QH65C-SW') ? 330000 : 99000;
    let inst_str = '설치비{지역/도서산간 차등설치(비용문의) (' + zero_fmt + '원)|직접설치함 (' + zero_fmt + '원)|설치/교육비 (' + fmt(installBase - basePrice) + '원)}';
    
    let option_str = stb_str + '//' + tcms_str + '//' + touch_str + '//' + spk_str + '//' + wheel_str + '//' + inst_str;
    
    row[optionIdx] = option_str;
}

// Write the file back with exactly the same formatting logic (only quotes when necessary)
let outputText = stringifyCSV(rows);
fs.writeFileSync(outputFile, outputText, 'utf8');
console.log("Successfully generated:", outputFile);
