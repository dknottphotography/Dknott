import fs from 'fs';
import path from 'path';

const files = ['original_html/index.html', 'original_html/home.html', 'original_html/our-story.html', 'original_html/wedding-films.html', 'original_html/real-weddings.html', 'original_html/client-guide.html', 'original_html/contact.html'];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  
  // Extract body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) continue;
  let body = bodyMatch[1];
  
  const basename = path.basename(file, '.html');
  if (basename === 'index') {
    body = `<div className="bg-brand-bg font-sans text-brand-title text-center overflow-x-hidden m-0 p-0 min-h-screen">\n${body}\n</div>`;
  }
  
  // Extract ALL style content from the whole file
  let styleContent = '';
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/g;
  let match;
  while ((match = styleRegex.exec(html)) !== null) {
    styleContent += match[1] + '\n';
  }
  
  // Remove <style> tags from body so they don't cause JSX syntax errors with {}
  body = body.replace(/<style[^>]*>[\s\S]*?<\/style>/g, '');

  // Escape backslashes in CSS so template literals don't parse \1F4F7 as invalid octal
  styleContent = styleContent.replace(/\\/g, '\\\\');

  // Convert HTML comments to JSX comments
  body = body.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

  // Convert class to className
  body = body.replace(/class="/g, 'className="');
  
  // Convert style="..." to style={{...}}
  body = body.replace(/style="([^"]*)"/g, (m, styles) => {
    const styleObj = {};
    styles.split(';').forEach(style => {
      if (!style.trim()) return;
      const [key, value] = style.split(':').map(s => s.trim());
      if (key && value) {
        const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
        styleObj[camelKey] = value;
      }
    });
    return `style={${JSON.stringify(styleObj)}}`;
  });

  // Self close tags: img, input, hr, br
  body = body.replace(/<(img|input|br|hr)([^>]*?)(?<!\/)>/g, '<$1$2 />');
  
  // Fix svg elements
  body = body.replace(/<path([^>]*?)(?<!\/)>/g, '<path$1 />');
  body = body.replace(/<rect([^>]*?)(?<!\/)>/g, '<rect$1 />');
  body = body.replace(/<line([^>]*?)(?<!\/)>/g, '<line$1 />');

  // Remove {{ url_for('...') }}
  body = body.replace(/\{\{\s*url_for\('([^']+)'\)\s*\}\}/g, '/$1');
  
  // Replace event handlers
  body = body.replace(/onclick="window\.scrollTo\(\{top:0,behavior:'smooth'\}\)"/gi, 'onClick={() => window.scrollTo({top:0,behavior:"smooth"})}');
  body = body.replace(/onclick="([^"]*)"/gi, 'onClick={() => { $1 }}');
  body = body.replace(/onmouseover="this\.style\.opacity='([^']+)'"/gi, 'onMouseOver={(e) => e.currentTarget.style.opacity="$1"}');
  body = body.replace(/onmouseout="this\.style\.opacity='([^']+)'"/gi, 'onMouseOut={(e) => e.currentTarget.style.opacity="$1"}');

  // Fix SVG attributes
  body = body.replace(/stroke-width/g, 'strokeWidth');
  body = body.replace(/stroke-linecap/g, 'strokeLinecap');
  body = body.replace(/stroke-linejoin/g, 'strokeLinejoin');
  body = body.replace(/fill-rule/g, 'fillRule');
  body = body.replace(/clip-rule/g, 'clipRule');

  // Handle <script>
  let scriptContent = '';
  body = body.replace(/<script[^>]*>([\s\S]*?)<\/script>/g, (m, script) => {
    scriptContent += script + '\n';
    return '';
  });

  const componentName = basename.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  
  // Remove backticks inside styleContent because we are using backticks for the template literal
  styleContent = styleContent.replace(/`/g, '\\`');

  const jsx = `import React, { useEffect } from 'react';

export default function ${componentName}() {
  useEffect(() => {
    if (window.__${componentName}ScriptLoaded) return;
    window.__${componentName}ScriptLoaded = true;

    ${scriptContent.replace(/document\.addEventListener\(['"]DOMContentLoaded['"],\s*/g, 'setTimeout(')}
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: \`${styleContent}\` }} />
      ${body}
    </>
  );
}
`;
  if (!fs.existsSync('src/pages')) {
    fs.mkdirSync('src/pages', { recursive: true });
  }
  fs.writeFileSync(`src/pages/${componentName}.jsx`, jsx);
  console.log(`Converted ${file} to ${componentName}.jsx`);
}
