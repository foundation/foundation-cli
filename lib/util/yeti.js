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
var multiline    = require('multiline');
var stringLength = require('string-length');

var family = {};
var colors = {};

family.sites = multiline(function() {/*
           .
          /|     ,
     , /|/  \/| /|
    /|/       |/ |
|___|            |___|
\___|  ^^   ^^   |___/
    | -[O]--[O]- |
    |    ___,    |
    |    ...     |
     \__________/
*/});

colors.sites = multiline(function() {/*
           0
          00     0
     0 000  000 00
    000       00 0
11110            01111
11110            01111
    0 11 1111 11 0
    0            0
    0            0
     000000000000
*/});

family.apps = multiline(function() {/*
          /|
         | |  /| ,
    .  /\|  \/ |/|
    |\/          |
    ||\__/\____/||
 ___|| ======== ||___
/___||  O    O  ||___\
    ||  ______, || 
    /|          |\
   /_/\\/\  /\//\_\
       \/\\//\/
          \/
*/});

family.emails = multiline(function() {/*
       ____
      /    \
  __ /=   . |
 /  | ==  |/
|   | ===  \
/__/| ====  |
    (   _   )
     (O) (O)
    (   _,  )
     \_____/
*/});

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
  if (typeof text === 'string') {
    text = text.split('\n');
  }

  var yeti = family[mascot] || family.sites;
  yeti = yeti.split('\n');

  // Distance between the mascot and the text
  var baseTextOffset = 5;
  // Number of lines in the mascot image
  var yetiHeight  = yeti.length - 1;
  // Number of lines in the message
  var textHeight  = text.length;
  // Vertical offset for message
  var textOffset  = Math.floor((yetiHeight - textHeight) / 2);
  // Longest line length in the mascot image
  var longestLine = getLongestLine(yeti);

  // Prepend a newline to each line of the mascot image
  for (var i in yeti) {
    yeti[i] = '\n ' + yeti[i];
  }

  for (var i = 0; i < text.length; i++) {
    var offset = textOffset + i;
    var newLine = i > 0 ? '\n' : '';
    var spaceCount = longestLine - stringLength(yeti[offset]) + baseTextOffset;

    yeti[offset] = yeti[offset] + repeatChar(' ', spaceCount) + text[i];
  }

  console.log(yeti.join('') + '\n');
}
