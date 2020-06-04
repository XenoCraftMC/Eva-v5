/**
 * @file Method Handler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const fs = require('fs');

let methodDir = '/app/xiao/methods/';
// eslint-disable-next-line no-sync
let methods = fs.readdirSync(methodDir);
for (let method of methods) {
  exports[method.replace('.js', '')] = require(methodDir+method);
}
