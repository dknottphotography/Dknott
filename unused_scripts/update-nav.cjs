const fs = require('fs');
const path = require('path');

const replacementStr = `@media (max-width: 780px){
  .site-nav .wrap { padding: 0 1.25rem; }
  .nav-row { padding: 1.5rem 0; }
  .logo { position: relative; z-index: 100; }
  .nav-links {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: var(--paper);
    flex-direction: column; justify-content: center; align-items: center;
    padding: 2rem; display: flex;
    opacity: 0; visibility: hidden; pointer-events: none;
    transform: translateY(-10px);
    transition: opacity 0.4s ease, transform 0.4s ease, visibility 0.4s;
    z-index: 90;
  }
  .nav-links.open {
    opacity: 1; visibility: visible; pointer-events: auto;
    transform: translateY(0);
  }
  .nav-toggle { display: block; z-index: 100; }
  .nav-links a {
    color: var(--ink) !important;
    font-family: var(--serif);
    font-size: 1.8rem;
    font-weight: 400;
    letter-spacing: 0.02em;
    text-transform: none;
    padding: 1.2rem 0;
    width: auto;
    text-align: center;
    border-bottom: none;
    opacity: 0;
    transform: translateY(15px);
    transition: opacity 0.4s ease, transform 0.4s ease;
  }
  .nav-links.open a {
    opacity: 1; transform: translateY(0);
  }
  .nav-links.open a:nth-child(1) { transition-delay: 0.1s; }
  .nav-links.open a:nth-child(2) { transition-delay: 0.15s; }
  .nav-links.open a:nth-child(3) { transition-delay: 0.2s; }
  .nav-links.open a:nth-child(4) { transition-delay: 0.25s; }
  .nav-links.open a:nth-child(5) { transition-delay: 0.3s; }
  .nav-links.open a:nth-child(6) { transition-delay: 0.35s; }
}`;

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

const regex = /@media\s*\(max-width:\s*780px\)\s*\{[\s\S]*?\.nav-links\s*a:last-child\s*\{\s*border-bottom:\s*none;\s*\}\s*\}/;

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (regex.test(content)) {
    content = content.replace(regex, replacementStr);
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  } else {
    console.log(`Target string not found in ${file}`);
  }
}
