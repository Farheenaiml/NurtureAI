import type { Sql } from 'postgres';

export async function initDb(sql: Sql) {
  try {
    console.log('Initializing PostgreSQL database tables in src/backend...');
    
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        age INTEGER,
        country VARCHAR(100),
        language VARCHAR(100) DEFAULT 'English',
        stage VARCHAR(50) DEFAULT 'pregnant',
        current_week INTEGER,
        due_date VARCHAR(50),
        previous_pregnancy BOOLEAN DEFAULT false,
        baby_name VARCHAR(255),
        baby_birth_date VARCHAR(50),
        baby_age_weeks INTEGER,
        delivery_type VARCHAR(50),
        breastfeeding BOOLEAN DEFAULT false,
        height INTEGER,
        weight INTEGER,
        blood_group VARCHAR(10),
        conditions TEXT,
        allergies TEXT,
        medications TEXT,
        doctor VARCHAR(255),
        hospital VARCHAR(255),
        emergency_contact VARCHAR(100),
        emergency_relationship VARCHAR(100),
        onboarded BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Users table created or already exists.');

    // Create sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(255) PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Sessions table created or already exists.');

    // Create conversations table
    await sql`
      CREATE TABLE IF NOT EXISTS conversations (
        id UUID PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        pinned BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Conversations table created or already exists.');

    // Create messages table
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY,
        conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL,
        text TEXT,
        ai JSONB,
        file_name VARCHAR(255),
        file_type VARCHAR(100),
        file_data TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Messages table created or already exists.');

    // Ensure columns exist if table was already created earlier
    await sql`ALTER TABLE messages ADD COLUMN IF NOT EXISTS file_name VARCHAR(255)`;
    await sql`ALTER TABLE messages ADD COLUMN IF NOT EXISTS file_type VARCHAR(100)`;
    await sql`ALTER TABLE messages ADD COLUMN IF NOT EXISTS file_data TEXT`;

    console.log('Database initialization completed successfully! 🎉');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}
