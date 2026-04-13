#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests the connection to PostgreSQL database
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

async function testConnection() {
  console.log('🔍 Testing database connection...\n');
  
  try {
    // Test basic connection
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL successfully!');
    
    // Get server version
    const versionResult = await client.query('SELECT version();');
    console.log(`✅ Server version: ${versionResult.rows[0].version.split(',')[0]}\n`);
    
    // Count tables
    const tablesResult = await client.query(`
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log(`✅ Tables in database: ${tablesResult.rows[0].table_count}`);
    
    // List all tables
    const listTablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    console.log('\n📊 Tables:');
    listTablesResult.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.table_name}`);
    });
    
    // Count indexes
    const indexesResult = await client.query(`
      SELECT COUNT(*) as index_count 
      FROM pg_indexes 
      WHERE schemaname = 'public'
    `);
    console.log(`\n✅ Indexes in database: ${indexesResult.rows[0].index_count}`);
    
    // Get database size
    const sizeResult = await client.query(`
      SELECT pg_size_pretty(pg_database_size(current_database())) as db_size
    `);
    console.log(`✅ Database size: ${sizeResult.rows[0].db_size}`);
    
    client.release();
    
    console.log('\n✅ All tests passed! Database is ready for use.\n');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\nTroubleshooting tips:');
    console.error('1. Verify PostgreSQL is running: sudo systemctl status postgresql');
    console.error('2. Check .env file has correct credentials');
    console.error('3. Verify database exists: sudo -u postgres psql -l');
    console.error('4. Check user permissions: sudo -u postgres psql -c "\\du"');
    process.exit(1);
  }
}

testConnection();
