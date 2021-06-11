const xpath = require('xpath');
const { DOMParser, XMLSerializer } = require('xmldom');
const fs = require('fs');

// info.plist から Authorization Codeを削除する
const deleteAuthorizationCode = (authorizationCode) => {
  const infoXml = fs.readFileSync('./info.plist', 'utf-8');
  const doc = new DOMParser().parseFromString(infoXml);
  const authorizationCodeElement = xpath.select1(
    `//string[contains(text(), '${authorizationCode}')]`,
    doc
  );
  authorizationCodeElement.firstChild.data = '';
  fs.writeFileSync('info.plist', new XMLSerializer().serializeToString(doc));
}

module.exports = deleteAuthorizationCode;
