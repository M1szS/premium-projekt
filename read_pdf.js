const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('MaszynaRAM.pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('pdf_text.txt', data.text);
    console.log('Done!');
});
