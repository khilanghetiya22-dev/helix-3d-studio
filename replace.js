const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /Formiq/g, to: 'Helix' },
  { from: /FORMIQ/g, to: 'HELIX' },
  { from: /formiq/g, to: 'helix' },
  { from: /#1A1A1A/gi, to: '#0A0A0F' },
  { from: /#1B2A4A/gi, to: '#0D1B2A' },
  { from: /#C9920A/gi, to: '#C9A84C' },
  { from: /#F5F4F0/gi, to: '#F5F0E8' },
  { from: /201,146,10/g, to: '201,168,76' },
  { from: /201, 146, 10/g, to: '201, 168, 76' },
  { from: /Layer by layer\. Smarter by design\./g, to: 'Where ideas take shape.' },
  { from: /ESTABLISHED · MMXXV/g, to: 'EST. 2025' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.css') || fullPath.endsWith('.md')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let newContent = content;
      for (const { from, to } of replacements) {
        newContent = newContent.replace(from, to);
      }
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src'));
console.log('Done.');
