import csv

input_file = r'd:\작업실\study\projects\tvzone_\tz_skin\삼성 키오스크 _ 옵션.csv'
output_file = r'd:\작업실\study\projects\tvzone_\tz_skin\삼성 키오스크 _ 옵션_완성본.csv'

encoding = 'utf-8-sig'
try:
    with open(input_file, 'r', encoding='utf-8-sig') as f:
        f.read(100)
except:
    encoding = 'cp949'

with open(input_file, 'r', encoding=encoding, newline='') as f:
    reader = csv.reader(f)
    rows = list(reader)

for i in range(1, len(rows)):
    row = rows[i]
    if len(row) < 37: continue
    
    model = row[11].strip()
    if not model: continue
    
    base_price = float(row[22])
    
    def fmt(val):
        return f'+ {val}' if val >= 0 else f'- {abs(val)}'
    
    stb_str = 'DID전용 SetTop Box{USB 미디어타입 (+ 165000원)|안드로이드타입 (+ 220000원)|PC타입(i5/RAM4G/SSD128/OS포함) (+ 770000원)}'
    tcms_str = f'솔루션프로그램추가{{안드로이드/PC 타입 T-CMS 3년 ({fmt(int(330000 - base_price))}원)}}'
    touch_str = f'터치{{정전압식 터치 ({fmt(int(770000 - base_price))}원)}}'
    spk_str = f'스피커 추가{{추가함 ({fmt(int(55000 - base_price))}원)}}'
    wheel_str = f'이동형 바퀴{{부착함 ({fmt(int(44000 - base_price))}원)}}'
    
    zero_fmt = fmt(int(-base_price))
    install_val = 330000 if model == 'QH65C-SW' else 99000
    inst_str = f'설치비{{지역/도서산간 차등설치(비용문의) ({zero_fmt}원)|직접설치함 ({zero_fmt}원)|설치/교육비 ({fmt(int(install_val - base_price))}원)}}'
    
    option_str = f'{stb_str}//{tcms_str}//{touch_str}//{spk_str}//{wheel_str}//{inst_str}'
    row[36] = option_str

with open(output_file, 'w', encoding=encoding, newline='') as f:
    writer = csv.writer(f, quoting=csv.QUOTE_ALL)
    writer.writerows(rows)
print('Done!')
