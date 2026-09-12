const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('c:/Users/Khizer/Desktop/FishLegerSystem/FishLegerSystem/app').concat(walk('c:/Users/Khizer/Desktop/FishLegerSystem/FishLegerSystem/components'));
const matches = [];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  // Replace >${ with >RS {
  // We should be careful. Actually let's just do it manually with multi_replace_file_content or a robust replace.
  // Wait, I can just use a regex in Node to do the replacements!
  // It's safer to do this with Node regex than manual multi_replace since there might be many.
  
  // 1. JSX text replacements: >${...} to >RS ${...}
  if (content.includes('>$')) {
    content = content.replace(/>\$\{/g, '>RS ${');
    changed = true;
  }
  
  // 2. JSX text replacements with explicit amount: >$100 to >RS 100
  if (/>\$\d/.test(content)) {
    content = content.replace(/>\$(\d)/g, '>RS $1');
    changed = true;
  }
  
  // 3. String literals and template literals where $ is used as currency
  // e.g. "Total: $" => "Total: RS "
  // e.g. \`$\${value}\` => \`RS \${value}\`
  // We can look for \$ followed by \${
  if (content.includes('$${')) {
    content = content.replace(/\$\$\{/g, 'RS ${');
    changed = true;
  }
  
  // 4. "RS $" or similar we should fix to just "RS "
  if (content.includes('RS $')) {
    content = content.replace(/RS \$/g, 'RS ');
    changed = true;
  }

  // 5. Look for formatters returning \`$\${...}\` or \`$\`
  // e.g. \`$\${value}\` => \`RS \${value}\`
  if (/\`\$(\d|\{)/.test(content)) {
    content = content.replace(/\`\$(\{)/g, '`RS $1');
    content = content.replace(/\`\$(\d)/g, '`RS $1');
    changed = true;
  }
  
  // 6. Look for " $" or ' $'
  if (/['"]\$(\d|\{)/.test(content)) {
    content = content.replace(/(['"])\$(\{)/g, '$1RS $2');
    content = content.replace(/(['"])\$(\d)/g, '$1RS $2');
    changed = true;
  }

  // 7. Look for >$
  if (/>\$/.test(content)) {
    content = content.replace(/>\$/g, '>RS ');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    matches.push(file);
  }
});

console.log('Modified files:', matches);
