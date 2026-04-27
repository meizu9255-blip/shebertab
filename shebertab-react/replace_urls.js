const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const oldUrl = /http:\/\/localhost:5000/g;

function processDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            processDir(filePath);
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            let content = fs.readFileSync(filePath, 'utf8');
            if (content.includes('http://localhost:5000')) {
                console.log(`Processing ${filePath}`);
                
                // Add import if not present
                if (!content.includes("import API_URL from '../config'") && !content.includes("import API_URL from './config'") && !filePath.includes('config.js')) {
                    // Determine relative path to config.js
                    const depth = filePath.split(path.sep).length - srcDir.split(path.sep).length;
                    const relPath = depth === 1 ? './config' : '../'.repeat(depth - 1) + 'config';
                    content = `import API_URL from '${relPath}';\n` + content;
                }
                
                // Replace URL
                content = content.replace(oldUrl, '${API_URL}');
                
                // If it was in a template literal like `http://localhost:5000/api...`, it becomes `${API_URL}/api...`
                // If it was in a single/double quote like 'http://localhost:5000/api...', we need to change it to template literal
                // The replace with ${API_URL} might leave it as '${API_URL}/api/...' which is wrong if it wasn't already a template literal.
                
                // Better regex to handle quotes
                content = content.replace(/'http:\/\/localhost:5000(.*?)'/g, '`${API_URL}$1`');
                content = content.replace(/"http:\/\/localhost:5000(.*?)"/g, '`${API_URL}$1`');
                
                fs.writeFileSync(filePath, content);
            }
        }
    });
}

processDir(srcDir);
console.log('Finished global URL replacement.');
