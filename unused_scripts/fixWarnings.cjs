const fs = require('fs');

const filePath = 'src/pages/Contact.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Fix onmouseover / onmouseout (replace exact strings carefully)
content = content.replace(
    /onmouseover="this\.style\.borderColor='var\(--ink\)'"/g,
    'onMouseOver={(e)=>e.currentTarget.style.borderColor="var(--ink)"}'
);
content = content.replace(
    /onmouseout="this\.style\.borderColor='transparent'"/g,
    'onMouseOut={(e)=>e.currentTarget.style.borderColor="transparent"}'
);

// Fix iframe properties
content = content.replace(/allowfullscreen=""/g, 'allowFullScreen={true}');
content = content.replace(/referrerpolicy="no-referrer-when-downgrade"/g, 'referrerPolicy="no-referrer-when-downgrade"');

fs.writeFileSync(filePath, content);
console.log("React prop warnings fixed!");
