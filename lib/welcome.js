#!/usr/bin/env node

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

var colors = require('colors');

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

yeti[3] = yeti[3] + '         '+'Thanks for installing Foundation for Apps!';
yeti[4] = yeti[4] + '         ------------------------------------------';
yeti[5] = yeti[5] + '      Type '+'foundation-apps new app'.cyan+' to create a new app,';
yeti[6] = yeti[6] + '     or '+'foundation-apps help'.cyan+' to see every command.';
yeti[8] = yeti[8] + '        '+'@zurbfoundation'.cyan+' on Twitter';

console.log(yeti.join(''));