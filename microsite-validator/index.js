#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Parse CLI flags
const args = process.argv.slice(2);
const isSummary = args.includes('--summary');
const isFix = args.includes('--fix');

// Helper to recursively walk a directory
function getFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, fileList);
    } else {
      fileList.push(name);
    }
  }
  return fileList;
}

// Find the project root directory
function findProjectRoot() {
  let currentDir = process.cwd();
  for (let i = 0; i < 5; i++) {
    if (fs.existsSync(path.join(currentDir, 'src')) && fs.existsSync(path.join(currentDir, 'package.json'))) {
      return currentDir;
    }
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) break;
    currentDir = parentDir;
  }
  return process.cwd();
}

const projectRoot = findProjectRoot();

// 1. Style attribute check
function checkStyleAttributes() {
  const violations = [];
  const srcDir = path.join(projectRoot, 'src');
  const files = getFiles(srcDir).filter(f => f.endsWith('.html') || f.endsWith('.hbs'));

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const hasStyle = /\sstyle\s*=\s*["']/i.test(line);
      if (hasStyle) {
        violations.push({
          file: path.relative(projectRoot, file),
          line: i + 1,
          content: line.trim()
        });
      }
    }
  }
  return violations;
}

// 2. Metadata and OpenGraph check
function checkMetadata() {
  const indexHtmlPath = path.join(projectRoot, 'src/index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    return { error: 'src/index.html not found', missing: ['All SEO tags (index.html missing)'] };
  }
  
  const content = fs.readFileSync(indexHtmlPath, 'utf8');
  const headMatch = content.match(/<head>([\s\S]*?)<\/head>/i);
  const headContent = headMatch ? headMatch[1] : '';

  const requiredMetadata = [
    { name: 'Title Tag (<title>)', regex: /<title>/i },
    { name: 'Description Meta', regex: /<meta\s+name=["']description["']/i },
    { name: 'OG Title', regex: /<meta\s+property=["']og:title["']/i },
    { name: 'OG Description', regex: /<meta\s+property=["']og:description["']/i },
    { name: 'OG Image', regex: /<meta\s+property=["']og:image["']/i },
    { name: 'OG URL', regex: /<meta\s+property=["']og:url["']/i },
    { name: 'OG Type', regex: /<meta\s+property=["']og:type["']/i },
    { name: 'Canonical Link', regex: /<link\s+rel=["']canonical["']/i }
  ];

  const missing = [];
  for (const item of requiredMetadata) {
    if (!item.regex.test(headContent)) {
      missing.push(item.name);
    }
  }
  return { missing };
}

// Auto-fix missing metadata tags
function fixMetadata(missing) {
  const indexHtmlPath = path.join(projectRoot, 'src/index.html');
  if (!fs.existsSync(indexHtmlPath)) return;
  
  let content = fs.readFileSync(indexHtmlPath, 'utf8');
  let tagsToInject = '';
  
  if (missing.includes('OG Title')) tagsToInject += '\n    <meta property="og:title" content="{{seo.title}}" />';
  if (missing.includes('OG Description')) tagsToInject += '\n    <meta property="og:description" content="{{seo.description}}" />';
  if (missing.includes('OG Image')) tagsToInject += '\n    <meta property="og:image" content="./assets/images/og-image.png" />';
  if (missing.includes('OG URL')) tagsToInject += '\n    <meta property="og:url" content="" />';
  if (missing.includes('OG Type')) tagsToInject += '\n    <meta property="og:type" content="website" />';
  if (missing.includes('Canonical Link')) tagsToInject += '\n    <link rel="canonical" href="" />';
  
  if (tagsToInject) {
    content = content.replace('</head>', `${tagsToInject}\n</head>`);
    fs.writeFileSync(indexHtmlPath, content, 'utf8');
    console.log('🛠️  [Auto-Fix] Injected missing metadata tags into src/index.html');
  }
}

// 3. Image Optimization check
function checkImageOptimization() {
  const warnings = [];
  const imagesDir = path.join(projectRoot, 'src/assets/images');
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'];
  
  if (!fs.existsSync(imagesDir)) {
    return warnings;
  }
  
  const files = getFiles(imagesDir).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return imageExtensions.includes(ext);
  });
  
  const backupDir = path.join(projectRoot, '.media-backup');
  
  for (const file of files) {
    const stat = fs.statSync(file);
    const sizeKB = stat.size / 1024;
    const relPath = path.relative(projectRoot, file);
    const basename = path.basename(file);
    const backupPath = path.join(backupDir, basename);
    const hasBackup = fs.existsSync(backupPath);
    
    if (sizeKB > 200) {
      warnings.push({
        file: relPath,
        issue: `File size is large (${sizeKB.toFixed(1)} KB). Recommend optimization.`
      });
    } else if (!hasBackup && !file.endsWith('.svg') && !file.endsWith('.gitkeep')) {
      warnings.push({
        file: relPath,
        issue: `Uncompressed image. No backup found in .media-backup/. Run python3 media-compressor/compress.py.`
      });
    }
  }
  return warnings;
}

// 4. Google Analytics check
function checkAnalytics() {
  const indexHtmlPath = path.join(projectRoot, 'src/index.html');
  const dataJsPath = path.join(projectRoot, 'src/data.js');
  
  let htmlHasTag = false;
  if (fs.existsSync(indexHtmlPath)) {
    const htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
    htmlHasTag = htmlContent.includes('googletagmanager.com/gtag/js') || htmlContent.includes('googletagmanager.com/ns.html?id=');
  }
  
  let dataHasId = false;
  let gtmIdVal = '';
  if (fs.existsSync(dataJsPath)) {
    const dataContent = fs.readFileSync(dataJsPath, 'utf8');
    const match = dataContent.match(/gtmId:\s*["']([^"']*)["']/);
    if (match) {
      gtmIdVal = match[1].trim();
      dataHasId = gtmIdVal.length > 0 && !gtmIdVal.includes('G-XXXXXXXX');
    }
  }
  
  return {
    htmlHasTag,
    dataHasId,
    gtmId: gtmIdVal
  };
}

// 5. Log maintenance and analysis
function processLog(summary) {
  const logPath = path.join(projectRoot, 'log.md');
  let logContent = '';
  if (fs.existsSync(logPath)) {
    logContent = fs.readFileSync(logPath, 'utf8');
  }
  
  const entries = logContent.split(/##\s+\[/).slice(1);
  const recentRuns = entries.slice(0, 5);
  
  let repeatStyleViolations = 0;
  let repeatMetadataIssues = 0;
  let repeatUnoptimizedImages = 0;
  let repeatAnalyticsIssues = 0;
  
  for (const entry of recentRuns) {
    if (entry.includes('Style Attributes Check**: FAIL')) {
      repeatStyleViolations++;
    }
    if (entry.includes('Metadata & OpenGraph Check**: FAIL')) {
      repeatMetadataIssues++;
    }
    if (entry.includes('Image Optimization Check**: FAIL')) {
      repeatUnoptimizedImages++;
    }
    if (entry.includes('Google Analytics Check**: FAIL')) {
      repeatAnalyticsIssues++;
    }
  }
  
  const repeatThreshold = 3;
  const repeatAlerts = [];
  if (repeatStyleViolations >= repeatThreshold && summary.styleFailures > 0) {
    repeatAlerts.push(`Style attribute violations have occurred in ${repeatStyleViolations} of the last 5 runs! Move inline styles to Tailwind classes or src/assets/css/style.css.`);
  }
  if (repeatMetadataIssues >= repeatThreshold && summary.metadataFailures > 0) {
    repeatAlerts.push(`Metadata/OpenGraph elements have been missing in ${repeatMetadataIssues} of the last 5 runs! Add required meta tags to <head> of src/index.html.`);
  }
  if (repeatUnoptimizedImages >= repeatThreshold && summary.imageFailures > 0) {
    repeatAlerts.push(`Unoptimized images have been detected in ${repeatUnoptimizedImages} of the last 5 runs! Optimize them using python3 media-compressor/compress.py.`);
  }
  if (repeatAnalyticsIssues >= repeatThreshold && summary.analyticsFailure) {
    repeatAlerts.push(`Google Analytics tracking ID has been missing or empty in ${repeatAnalyticsIssues} of the last 5 runs! Provide gtmId in src/data.js.`);
  }
  
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  const timestamp = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  
  const status = (summary.styleFailures === 0 && summary.metadataFailures === 0 && summary.imageFailures === 0 && !summary.analyticsFailure) ? 'PASS' : 'FAIL';
  
  let entryMarkdown = `## [${timestamp}] - ${status}\n`;
  entryMarkdown += `- **Style Attributes Check**: ${summary.styleFailures === 0 ? 'PASS (0 violations)' : `FAIL (${summary.styleFailures} violations found)`}\n`;
  if (summary.styleDetails.length > 0) {
    summary.styleDetails.slice(0, 5).forEach(v => {
      entryMarkdown += `  - \`${v.file}:${v.line}\`: \`${v.content}\`\n`;
    });
    if (summary.styleDetails.length > 5) {
      entryMarkdown += `  - ...and ${summary.styleDetails.length - 5} more.\n`;
    }
  }
  
  entryMarkdown += `- **Metadata & OpenGraph Check**: ${summary.metadataFailures === 0 ? 'PASS (All present)' : `FAIL (${summary.metadataFailures} missing elements)`}\n`;
  if (summary.metadataDetails.length > 0) {
    entryMarkdown += `  - Missing: ${summary.metadataDetails.join(', ')}\n`;
  }
  
  entryMarkdown += `- **Image Optimization Check**: ${summary.imageFailures === 0 ? 'PASS (All optimized)' : `FAIL (${summary.imageFailures} unoptimized/uncompressed images)`}\n`;
  if (summary.imageDetails.length > 0) {
    summary.imageDetails.slice(0, 5).forEach(img => {
      entryMarkdown += `  - \`${img.file}\`: ${img.issue}\n`;
    });
    if (summary.imageDetails.length > 5) {
      entryMarkdown += `  - ...and ${summary.imageDetails.length - 5} more.\n`;
    }
  }
  
  entryMarkdown += `- **Google Analytics Check**: ${!summary.analyticsFailure ? 'PASS (GTM script and ID present)' : `FAIL (${summary.analyticsDetails})`}\n`;
  
  if (repeatAlerts.length > 0) {
    entryMarkdown += `- **Repeat Heavy Tasks / Alerts**:\n`;
    repeatAlerts.forEach(alert => {
      entryMarkdown += `  - ⚠️ ${alert}\n`;
    });
  }
  entryMarkdown += `\n---\n\n`;
  
  let newLogContent = '';
  if (!logContent.startsWith('# Microsite Validation Log')) {
    newLogContent = `# Microsite Validation Log\n\nHistory of automated validation runs.\n\n---\n\n` + entryMarkdown + logContent;
  } else {
    const headerEnd = logContent.indexOf('---') + 3;
    newLogContent = logContent.substring(0, headerEnd) + '\n\n' + entryMarkdown + logContent.substring(headerEnd);
  }
  
  fs.writeFileSync(logPath, newLogContent, 'utf8');
  
  return {
    status,
    alerts: repeatAlerts
  };
}

function main() {
  if (!isSummary) {
    console.log('🔍 Starting Microsite Audit...\n');
  }
  
  const styleViolations = checkStyleAttributes();
  let metadataResult = checkMetadata();
  
  // Handle auto-fix if requested
  if (isFix && metadataResult.missing && metadataResult.missing.length > 0) {
    fixMetadata(metadataResult.missing);
    // Recheck metadata after fix
    metadataResult = checkMetadata();
  }
  
  const imageWarnings = checkImageOptimization();
  const analyticsResult = checkAnalytics();
  
  const analyticsFailure = !analyticsResult.htmlHasTag || !analyticsResult.dataHasId;
  let analyticsDetails = '';
  if (analyticsFailure) {
    if (!analyticsResult.htmlHasTag && !analyticsResult.dataHasId) {
      analyticsDetails = 'GTM script tag missing in HTML AND GTM ID missing in data.js';
    } else if (!analyticsResult.htmlHasTag) {
      analyticsDetails = 'GTM script tag missing in HTML';
    } else {
      analyticsDetails = 'GTM ID is missing or empty in src/data.js';
    }
  }
  
  const summary = {
    styleFailures: styleViolations.length,
    styleDetails: styleViolations,
    metadataFailures: metadataResult.missing ? metadataResult.missing.length : 0,
    metadataDetails: metadataResult.missing || [],
    imageFailures: imageWarnings.length,
    imageDetails: imageWarnings,
    analyticsFailure,
    analyticsDetails
  };
  
  const logResult = processLog(summary);
  
  if (isSummary) {
    const styleStatus = summary.styleFailures === 0 ? 'Style: PASS' : `Style: FAIL (${summary.styleFailures} violations)`;
    const metaStatus = summary.metadataFailures === 0 ? 'Metadata: PASS' : `Metadata: FAIL (${summary.metadataFailures} missing)`;
    const imgStatus = summary.imageFailures === 0 ? 'Image: PASS' : `Image: FAIL (${summary.imageFailures} issues)`;
    const gaStatus = !summary.analyticsFailure ? 'Analytics: PASS' : 'Analytics: FAIL';
    console.log(`STATUS: ${logResult.status} [${styleStatus} | ${metaStatus} | ${imgStatus} | ${gaStatus}]`);
  } else {
    console.log('==================================================');
    console.log(`STATUS: ${logResult.status}`);
    console.log('==================================================\n');
    
    console.log(`🎨 Style Attributes Check: ${summary.styleFailures === 0 ? '✅ PASS' : `❌ FAIL (${summary.styleFailures} violations)`}`);
    if (summary.styleFailures > 0) {
      summary.styleDetails.slice(0, 10).forEach(v => {
        console.log(`   - ${v.file}:${v.line} -> ${v.content}`);
      });
      if (summary.styleFailures > 10) {
        console.log(`   - ...and ${summary.styleFailures - 10} more violations.`);
      }
    }
    
    console.log(`\n🏷️  Metadata & OpenGraph Check: ${summary.metadataFailures === 0 ? '✅ PASS' : `❌ FAIL (${summary.metadataFailures} missing)`}`);
    if (summary.metadataFailures > 0) {
      console.log(`   - Missing: ${summary.metadataDetails.join(', ')}`);
    }
    
    console.log(`\n🖼️  Image Optimization Check: ${summary.imageFailures === 0 ? '✅ PASS' : `⚠️  WARNING (${summary.imageFailures} issues)`}`);
    if (summary.imageFailures > 0) {
      summary.imageDetails.slice(0, 10).forEach(img => {
        console.log(`   - ${img.file}: ${img.issue}`);
      });
      if (summary.imageFailures > 10) {
        console.log(`   - ...and ${summary.imageFailures - 10} more image warnings.`);
      }
    }
    
    console.log(`\n📈 Google Analytics Check: ${!summary.analyticsFailure ? '✅ PASS' : '❌ FAIL'}`);
    if (summary.analyticsFailure) {
      console.log(`   - ${analyticsDetails}`);
    }
    
    if (logResult.alerts.length > 0) {
      console.log('\n⚠️  REPEAT HEAVY TASKS / ALERT:');
      logResult.alerts.forEach(alert => {
        console.log(`   - ${alert}`);
      });
    }
    
    console.log('\n📝 Results logged to log.md');
  }
  
  if (logResult.status === 'FAIL') {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main();
