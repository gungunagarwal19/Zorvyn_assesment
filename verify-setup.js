#!/usr/bin/env node

/**
 * Finance Dashboard Backend - Setup Verification
 * Verifies that all project files are in place
 */

const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;

const requiredFiles = [
  // Documentation
  'README.md',
  'QUICKSTART.md',
  'API-TESTING.md',
  'ARCHITECTURE.md',
  'IMPLEMENTATION_NOTES.md',
  'PROJECT_SUMMARY.md',
  
  // Configuration
  'package.json',
  '.env.example',
  '.gitignore',
  
  // Prisma
  'prisma/schema.prisma',
  
  // Source files
  'src/server.js',
  
  'src/controllers/userController.js',
  'src/controllers/financialRecordController.js',
  'src/controllers/dashboardController.js',
  
  'src/services/userService.js',
  'src/services/financialRecordService.js',
  'src/services/dashboardService.js',
  
  'src/middleware/authenticate.js',
  'src/middleware/authorize.js',
  
  'src/routes/userRoutes.js',
  'src/routes/financialRecordRoutes.js',
  'src/routes/dashboardRoutes.js',
  
  'src/utils/database.js',
  'src/utils/jwt.js',
  'src/utils/validation.js',
  'src/utils/appError.js',
  
  'src/scripts/setup.js',
  'src/scripts/seed.js'
];

console.log('🔍 Finance Dashboard Backend - Setup Verification\n');
console.log('Checking for required files...\n');

let allFilesExist = true;
let failedFiles = [];

requiredFiles.forEach(file => {
  const filePath = path.join(projectRoot, file);
  const exists = fs.existsSync(filePath);
  
  if (exists) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - NOT FOUND`);
    allFilesExist = false;
    failedFiles.push(file);
  }
});

console.log('\n' + '='.repeat(50));

if (allFilesExist) {
  console.log('\n✅ All required files are present!\n');
  console.log('Next steps:');
  console.log('1. npm install');
  console.log('2. cp .env.example .env');
  console.log('3. Update DATABASE_URL in .env');
  console.log('4. npx prisma db push');
  console.log('5. npm run seed (optional)');
  console.log('6. npm run dev\n');
} else {
  console.log('\n❌ Missing files detected:\n');
  failedFiles.forEach(file => {
    console.log(`   - ${file}`);
  });
  console.log('\nPlease ensure all files are in place.');
  process.exit(1);
}
