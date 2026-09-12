const fs = require('fs');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  for (const [from, to] of replacements) {
    content = content.split(from).join(to);
  }
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', filePath);
  }
}

// 1. app/layout.tsx
replaceInFile('c:/Users/Khizer/Desktop/FishLegerSystem/FishLegerSystem/app/layout.tsx', [
  ['`RS {geistSans.variable}', '`${geistSans.variable}']
]);

// 2. app/(main)/layout.tsx
replaceInFile('c:/Users/Khizer/Desktop/FishLegerSystem/FishLegerSystem/app/(main)/layout.tsx', [
  ['`RS {isSidebarOpen', '`${isSidebarOpen']
]);

// 3. components/layout/Navbar.tsx
replaceInFile('c:/Users/Khizer/Desktop/FishLegerSystem/FishLegerSystem/components/layout/Navbar.tsx', [
  ['`RS {startDate}', '`${startDate}'],
  ['`RS {firstDay}', '`${firstDay}'],
  ['`RS {d1}', '`${d1}']
]);

// 4. app/(main)/dashboard/page.tsx
replaceInFile('c:/Users/Khizer/Desktop/FishLegerSystem/FishLegerSystem/app/(main)/dashboard/page.tsx', [
  ['`RS {f1}', '`${f1}']
]);

// 5. components/dashboard/Charts.tsx
replaceInFile('c:/Users/Khizer/Desktop/FishLegerSystem/FishLegerSystem/components/dashboard/Charts.tsx', [
  ['`RS {value/1000}k`', '`RS ${value/1000}k`'],
  ['`RS {Number(value)', '`RS ${Number(value)'],
  ['`RS {value} items`', '`${value} items`']
]);

console.log("Fixes applied!");
