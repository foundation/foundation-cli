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

//            .
//           /|     ,
//      , /|/  \/| /|
//     /|/       |/ |
// |___|            |___|
// \___|  ^^   ^^   |___/
//     | -[O]--[O]- |
//     |    ___,    |
//     |    ...     |
//      \__________/

var colors       = require('colors')
var stringLength = require('string-length');

var family = {};

family.sites = [
  '\n            .'
, '\n           /|     ,'
, '\n      , /|/  \\/| /|'
, '\n     /|/       |/ |'
, '\n |___|            |___|'
, '\n \\___|  ^^   ^^   |___/'
, '\n     | -[O]--[O]- |'
, '\n     |    ___,    |'
, '\n     |    ...     |'
, '\n      \\__________/'
];

family.apps = [
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

family.emails = [
  '\n        ____'
, '\n       /    \\'
, '\n   __ /=   . |'
, '\n  /  | ==  |/'
, '\n |   | ===  \\'
, '\n /__/| ====  |'
, '\n     (   _   )'
, '\n      (O) (O)'
, '\n     (   _,  )'
, '\n      \\_____/'
];

var baseTextOffset = 5;

function getLongestLine(yeti) {
  var highest = 0;
  for (var i = 0; i < yeti.length; i++) {
    var len = stringLength(yeti[i]);
    if (len > highest) highest = len;
  }
  return highest;
}

// Thank you: http://stackoverflow.com/a/5450113/492553
function repeatChar(pattern, count) {
  if (count < 1) return '';
  var result = '';
  while (count > 1) {
    if (count & 1) result += pattern;
    count >>= 1, pattern += pattern;
  }
  return result + pattern;
}

// This function takes an array of text messages and places them next to the ASCII mascot
module.exports = function(mascot, text) {
  var yeti = family[mascot] || family.sites;

  var yetiHeight  = yeti.length - 1;
  var textHeight  = text.length;
  var textOffset  = Math.floor((yetiHeight - textHeight) / 2);
  var longestLine = getLongestLine(yeti);
  var yetiMsg     = yeti;

  for (var i = 0; i < text.length; i++) {
    var offset = textOffset + i;
    var spaceCount = longestLine - stringLength(yetiMsg[offset]) + baseTextOffset;

    yetiMsg[offset] = yetiMsg[offset] + repeatChar(' ', spaceCount) + text[i];
  }

  console.log(yetiMsg.join(''));
}
