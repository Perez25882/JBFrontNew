const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

// Configuration
const ROOT_DIR = path.join(__dirname);
const IGNORE_DIRS = ['node_modules', '.next', '.git', '.vscode', 'dist', 'build'];

/**
 * Recursively finds all TypeScript files in a directory
 * @param {string} dir - Directory to search in
 * @returns {Promise<string[]>} Array of TypeScript file paths
 */
async function findTypeScriptFiles(dir) {
  const files = await readdir(dir, { withFileTypes: true });
  let tsFiles = [];

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    // Skip ignored directories
    if (file.isDirectory()) {
      if (!IGNORE_DIRS.includes(file.name)) {
        tsFiles = tsFiles.concat(await findTypeScriptFiles(fullPath));
      }
    } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
      // Skip type declaration files
      if (!file.name.endsWith('.d.ts')) {
        tsFiles.push(fullPath);
      }
    }
  }

  return tsFiles;
}

/**
 * Converts TypeScript code to JavaScript
 * @param {string} tsCode - TypeScript code to convert
 * @returns {string} Converted JavaScript code
 */
function convertTypeScriptToJavaScript(tsCode) {
  // Remove TypeScript type annotations
  let jsCode = tsCode
    // Remove type imports and exports
    .replace(/import type .*?from\s+['"].*?['"];?\n?/g, '')
    // Remove type assertions (as Type)
    .replace(/\s+as\s+[\w$]+(?=[,\s\)\]\};])/g, '')
    // Remove type annotations from function parameters
    .replace(/([\w$]+)\s*:\s*[\w$|<>\[\]{}]+(\s*=\s*[^,\s\)\]]+)?(,\s*|$)/g, (match, p1, p2) => {
      return p2 ? `${p1}${p2},` : `${p1},`;
    })
    // Remove type annotations from function return types
    .replace(/\)\s*:\s*[\w$|<>\[\]{}]+\s*(?=[{\n])/g, ')')
    // Remove interface and type declarations
    .replace(/\b(interface|type)\s+\w+\s*({[^}]*})?\s*;?\n?/g, '')
    // Remove readonly modifiers
    .replace(/\breadonly\s+/g, '')
    // Remove type parameters from functions and components
    .replace(/<[\w$\s,]+>(?=\s*[=(])/g, '')
    // Remove type parameters from JSX components
    .replace(/<([A-Z]\w+)\s*<[^>]+>>/g, '<$1>')
    // Remove any remaining type annotations
    .replace(/\s*:\s*[\w$|<>\[\]{}]+/g, '');

  // Add JSDoc comments for better documentation
  jsCode = jsCode
    // Convert TypeScript parameter types to JSDoc
    .replace(
      /\/\*\*\s*\*\s*@param\s+\{\s*([^}]+)\s*}\s+(\w+)/g,
      '/**\n * @param {$1} $2'
    )
    // Convert TypeScript return types to JSDoc
    .replace(
      /\/\*\*\s*\*\s*@returns\s+\{\s*([^}]+)\s*}/g,
      '/**\n * @returns {$1}'
    );

  return jsCode;
}

/**
 * Processes a TypeScript file by converting it to JavaScript
 * @param {string} filePath - Path to the TypeScript file
 */
async function processFile(filePath) {
  try {
    // Read the TypeScript file
    const tsCode = await readFile(filePath, 'utf8');
    
    // Convert to JavaScript
    const jsCode = convertTypeScriptToJavaScript(tsCode);
    
    // Determine the new file path with .js or .jsx extension
    const newFilePath = filePath.endsWith('.tsx') 
      ? filePath.replace(/\.tsx$/, '.jsx')
      : filePath.replace(/\.ts$/, '.js');
    
    // Write the JavaScript file
    await writeFile(newFilePath, jsCode, 'utf8');
    console.log(`Converted: ${filePath} -> ${newFilePath}`);
    
    // Delete the original TypeScript file
    await unlink(filePath);
    console.log(`Deleted: ${filePath}`);
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

/**
 * Main function to convert all TypeScript files to JavaScript
 */
async function main() {
  try {
    console.log('Starting TypeScript to JavaScript conversion...');
    
    // Find all TypeScript files
    const tsFiles = await findTypeScriptFiles(ROOT_DIR);
    
    if (tsFiles.length === 0) {
      console.log('No TypeScript files found to convert.');
      return;
    }
    
    console.log(`Found ${tsFiles.length} TypeScript files to convert.`);
    
    // Process each file
    for (const file of tsFiles) {
      await processFile(file);
    }
    
    console.log('Conversion completed successfully!');
    
  } catch (error) {
    console.error('An error occurred during conversion:', error);
    process.exit(1);
  }
}

// Run the conversion
main();
