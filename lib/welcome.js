#!/usr/bin/env node

var colors = require('colors');
var yeti   = require('./util/yeti');

var msg = [
  'Thanks for installing Foundation for Apps!',
  '------------------------------------------',
  'Type ' + 'foundation-apps new app'.cyan+' to create a new app,',
  'or '+'foundation-apps help'.cyan+' to see every command.',
  '',
  'We\'re '+'@zurbfoundation'.cyan+' on Twitter.',
]

yeti(msg);