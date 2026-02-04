#!/usr/bin/env node


const fs = require('fs');
const path = require('path');

const cwd = process.cwd()
const pkgPath = path.join(cwd,'package.json');

function fileExists( filePath) {
    try{
    fs.accessSync(filePath, fs.constants.F_OK);
    return true
    }catch{
        return false
    }
}

if(!fileExists(pkgPath)){
    console.error("❌ CleanDeps: No package.json found in this folder");
    console.error("➡️ Run this command inside a Node project(where package.json exists).")
    process.exit(1);
}

console.log("✅ Found package.json");
console.log(`📁 Project: ${cwd}`);