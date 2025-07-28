"use strict"
const fs = require('fs');
const path = require('path');
const dictionary = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'dictionary.json'), 'utf8')
);

function cleanText(text) {
  return text.toLowerCase().replace(/[^\w\s]/g, ' ');
}

module.exports = async (event, context) => {
  // Parse JSON body if needed
  let body;
  if (typeof event.body === 'string') {
    try {
      body = JSON.parse(event.body);
    } catch (e) {
      return context.status(400).success({ error: 'Invalid JSON input.' });
    }
  } else if (typeof event.body === "object" && event.body != null) {
    body = event.body;
  } else {
    body = event.body;
  }

  const inputText = typeof body.text === 'string' ? body.text : '';

  // Nếu không có field text, trả về danh sách tất cả từ
  if (!inputText.trim()) {
    const words = Object.keys(dictionary);
    return context.status(200).success({ words });
  }

  // Xử lý văn bản bản input
  const cleaned = cleanText(inputText);
  const wordsList = Array.from(new Set(cleaned.split(/\s+/)).filter(Boolean));

  //Tìm định nghĩa
  const definitions = {};
  for (const word of wordsList) {
    if (dictionary[word]) {
      definitions[word] = dictionary[word];
    }
  }
  return context.status(200).success({ definitions });
};