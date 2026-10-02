const { Filter } = require('content-checker');
const fs = require('fs');
const path = require('path');
const pathFile = path.resolve(__dirname, 'lista_badwords.txt');

let filter;
try {

    const fileContent = fs.readFileSync(pathFile, 'utf-8');
    const forbiddenWords = fileContent.split(/\r?\n/).map(word => word.trim()).filter(Boolean);
    filter = new Filter({ placeHolder: '*' });
    filter.addWords(...forbiddenWords);    
    
} catch (error) {
    filter = new Filter({ placeHolder: '*' });
}


const cleanText = (text) => {
    if (!text || typeof text !== 'string') return '';
    return filter.clean(text);
};

module.exports = {
    cleanText
};



