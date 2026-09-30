const fs = require('fs');
let c = fs.readFileSync('src/pages/Universe.jsx', 'utf8');
c = c.replace(/\\`/g, '`');
c = c.replace(/\\\$/g, '$');
fs.writeFileSync('src/pages/Universe.jsx', c);
console.log('Fixed Universe.jsx syntax');
