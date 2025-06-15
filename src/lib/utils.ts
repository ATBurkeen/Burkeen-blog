export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, '-') // 将空格和非单词字符替换为连字符
        .replace(/^-+|-+$/g, '') // 移除开头和结尾的连字符
}

// 简单的中文转拼音映射
const pinyinMap: { [key: string]: string } = {
    '阿': 'a', '八': 'ba', '嚓': 'ca', '哒': 'da', '蛾': 'e',
    '发': 'fa', '噶': 'ga', '哈': 'ha', '击': 'ji', '喀': 'ka',
    '啦': 'la', '妈': 'ma', '拿': 'na', '哦': 'o', '啪': 'pa',
    '期': 'qi', '然': 'ran', '撒': 'sa', '他': 'ta', '哇': 'wa',
    '昔': 'xi', '压': 'ya', '匝': 'za', '的': 'de', '和': 'he',
    '是': 'shi', '在': 'zai', '有': 'you', '我': 'wo', '们': 'men',
    '都': 'dou', '不': 'bu', '就': 'jiu', '要': 'yao', '这': 'zhe',
    '会': 'hui', '好': 'hao', '到': 'dao', '说': 'shuo', '能': 'neng'
    // 可以根据需要添加更多映射
}

export function chineseToPinyin(text: string): string {
    let result = '';
    for (let char of text) {
        if (/[\u4e00-\u9fa5]/.test(char)) { // 是否为中文字符
            result += pinyinMap[char] || char;
        } else {
            result += char;
        }
    }
    return result;
}

export function generateChineseSlug(title: string): string {
    const pinyin = chineseToPinyin(title);
    return generateSlug(pinyin);
} 