/**
 * 创建 tabBar 图标的脚本
 * 生成简单的 PNG 图标文件
 */

const fs = require('fs');
const path = require('path');

// 创建简单的 SVG 图标
const icons = {
  home: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#7A7E83" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9 22V12H15V22" stroke="#7A7E83" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  
  homeActive: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#667eea" fill-opacity="0.1"/>
    <path d="M9 22V12H15V22" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  
  history: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#7A7E83" stroke-width="2"/>
    <polyline points="12,6 12,12 16,14" stroke="#7A7E83" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  
  historyActive: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#667eea" stroke-width="2" fill="#667eea" fill-opacity="0.1"/>
    <polyline points="12,6 12,12 16,14" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`
};

console.log('创建 tabBar 图标...');
console.log('请手动创建以下图标文件，或使用在线工具将 SVG 转换为 PNG：');
console.log('');

Object.keys(icons).forEach(key => {
  const filename = key === 'home' ? 'tab-home.png' : 
                  key === 'homeActive' ? 'tab-home-active.png' :
                  key === 'history' ? 'tab-history.png' : 
                  'tab-history-active.png';
  
  console.log(`文件: ${filename}`);
  console.log(`SVG 内容: ${icons[key]}`);
  console.log('---');
});

// 创建一个简单的占位符文件说明
const readmePath = path.join(__dirname, 'static/images/README.md');
const readmeContent = `# TabBar 图标

请将以下 SVG 图标转换为 24x24 像素的 PNG 图标：

## 首页图标 (tab-home.png)
\`\`\`svg
${icons.home}
\`\`\`

## 首页激活图标 (tab-home-active.png)  
\`\`\`svg
${icons.homeActive}
\`\`\`

## 历史图标 (tab-history.png)
\`\`\`svg
${icons.history}  
\`\`\`

## 历史激活图标 (tab-history-active.png)
\`\`\`svg
${icons.historyActive}
\`\`\`

## 转换工具推荐
- https://convertio.co/svg-png/
- https://cloudconvert.com/svg-to-png
- 使用设计软件如 Figma, Adobe XD 等

## 图标要求
- 尺寸：24x24 像素
- 格式：PNG
- 背景：透明
`;

fs.writeFileSync(readmePath, readmeContent);
console.log(`\n图标说明文件已创建: ${readmePath}`);