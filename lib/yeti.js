//           /|
//          | |  /| .
//     .  /\|  \/ |/|
//     |\/          |
//     ||\__/\____/||
//  ___|| ======== ||___
// /___||  O    O  ||___\
//     ||  ______, || 
//     /|          |\
//    /_/\\/\  /\//\_\
//        \/\\//\/
//           \/

var colors       = require('colors')
  , stringLength = require('string-length')
;

var yeti = [
  '\n           /|'
, '\n          | |  /| .'
, '\n     .  /\\|  \\/ |/|'
, '\n     |\\/          |'
, '\n     |'+'|\\__/\\____/|'.cyan+'|'
, '\n  '+'___'.gray+'|'+'|'.cyan+' '+'========'.gray+' '+'|'.cyan+'|'+'___'.gray
, '\n '+'/___'.gray+'|'+'|'.cyan+'  '+'O'.cyan+'    '+'O'.cyan+'  ||'+'___\\'.gray
, '\n     |'+'|'.cyan+'  '+'______,'.cyan+' '+'|'.cyan+'|'
, '\n     /'+'|'.cyan+'          '+'|'.cyan+'\\ '
, '\n    /_/\\'+'\\/\\'.cyan+'  '+'/\\/'.cyan+'/\\_\\ '
, '\n        \\/\\'+'\\/'.cyan+'/\\/'
, '\n           \\/'
, '\n'
];

var baseTextOffset = 5
  , longestLine = (function() {
  var highest = 0;
  for (var i = 0; i < yeti.length; i++) {
    var len = stringLength(yeti[i]);
    if (len > highest) highest = len;
  }
  return highest;
})();

// Thank you: http://stackoverflow.com/a/5450113/492553
var repeatChar = function(pattern, count) {
  if (count < 1) return '';
  var result = '';
  while (count > 1) {
    if (count & 1) result += pattern;
    count >>= 1, pattern += pattern;
  }
  return result + pattern;
}

// This function takes an array of text messages and places them next to the ASCII yeti
module.exports = function(text) {
  var yetiHeight = yeti.length - 1
    , textHeight = text.length
    , textOffset = Math.floor((yetiHeight - textHeight) / 2)
    , yetiMsg    = yeti
  ;

  for (var i = 0; i < text.length; i++) {
    var offset = textOffset + i;
    var spaceCount = longestLine - stringLength(yetiMsg[offset]) + baseTextOffset;
    yetiMsg[offset] = yetiMsg[offset] + repeatChar(' ', spaceCount) + text[i];
  }

  console.log(yetiMsg.join(''));
}