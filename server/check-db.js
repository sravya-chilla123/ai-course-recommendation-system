const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from server/.env or root .env
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');

const checkMongoDB = async () => {
  console.log('\n=======================================================');
  console.log('         🔍 MONGODB CONNECTION STATUS CHECK           ');
  console.log('=======================================================');

  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('\n❌ STATUS: NOT CONNECTED');
    console.error('👉 REASON: No MONGO_URI found in .env file.');
    console.log('\n💡 TO FIX:');
    console.log('   Add your MongoDB connection string to .env:');
    console.log('   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/dbname\n');
    process.exit(1);
  }

  // Mask credentials for display
  const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
  console.log(`📡 Target URI: ${maskedUri}`);
  console.log('⏳ Connecting to MongoDB (timeout: 6s)...\n');

  try {
    const startTime = Date.now();
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 6000
    });
    const duration = Date.now() - startTime;

    console.log('=======================================================');
    console.log('  ✅ SUCCESS: CONNECTED TO MONGODB ATLAS!');
    console.log('=======================================================');
    console.log(`  🏠 Host:        ${conn.connection.host}`);
    console.log(`  🗄️  Database:    ${conn.connection.name}`);
    console.log(`  ⚡ Response:    ${duration} ms`);
    console.log(`  📊 Ready State: ${conn.connection.readyState === 1 ? 'Connected (1)' : conn.connection.readyState}`);

    // Fetch collection info
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`  📁 Collections: ${collections.length > 0 ? collections.map(c => c.name).join(', ') : 'None yet (empty database)'}`);
    console.log('=======================================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.log('=======================================================');
    console.log('  ❌ STATUS: NOT CONNECTED TO MONGODB');
    console.log('=======================================================');
    console.error(`⚠️  Error Message: ${err.message}\n`);

    if (err.message.includes('IP that isn\'t whitelisted') || err.message.includes('Could not connect to any servers')) {
      console.log('🔴 COMMON CAUSE: Atlas IP Access List (Whitelist) Restriction');
      console.log('───────────────────────────────────────────────────────');
      console.log('MongoDB Atlas blocks incoming connections by default until');
      console.log('your IP address is whitelisted.\n');
      console.log('📋 STEP-BY-STEP FIX:');
      console.log('1. Open your browser and log into https://cloud.mongodb.com');
      console.log('2. In the left sidebar, click "Network Access" (under Security)');
      console.log('3. Click the "+ ADD IP ADDRESS" button');
      console.log('4. Click "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0) or "ADD CURRENT IP ADDRESS"');
      console.log('5. Click "Confirm"');
      console.log('6. Wait ~30-60 seconds for Atlas to apply the change, then run this check again!');
    } else if (err.message.includes('bad auth') || err.message.includes('Authentication failed')) {
      console.log('🔴 COMMON CAUSE: Invalid Username or Password');
      console.log('───────────────────────────────────────────────────────');
      console.log('Verify your database user credentials under "Database Access" in Atlas.');
    } else {
      console.log('🔴 CAUSE: Network or Configuration Issue');
      console.log('Check your internet connection, firewall, or connection string format.');
    }
    console.log('=======================================================\n');

    process.exit(1);
  }
};

checkMongoDB();
