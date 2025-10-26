import pg from 'pg';
const { Pool } = pg;

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection on startup
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
});

// Helper function to execute queries
export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// User queries
export const userQueries = {
  async findByEmail(email) {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  async findById(userId) {
    const result = await query('SELECT * FROM users WHERE user_id = $1', [userId]);
    return result.rows[0];
  },

  async create(user) {
    const { email, name, targetLanguage, provider = 'email', providerId } = user;
    const result = await query(
      `INSERT INTO users (email, name, target_language, provider, provider_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING user_id, email, name, target_language, provider, created_at`,
      [email, name, targetLanguage, provider, providerId || email]
    );
    return result.rows[0];
  },
};

// Word queries
export const wordQueries = {
  async findByUser(userId) {
    const result = await query(
      'SELECT * FROM words WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  },

  async create(word) {
    const { userId, text, translation, definitions } = word;
    const result = await query(
      `INSERT INTO words (user_id, text, translation, definitions)
       VALUES ($1, $2, $3, $4)
       RETURNING word_id, user_id, text, translation, definitions, created_at, updated_at`,
      [userId, text, translation ? JSON.stringify(translation) : null, definitions ? JSON.stringify(definitions) : null]
    );
    return result.rows[0];
  },

  async delete(userId, wordId) {
    const result = await query(
      'DELETE FROM words WHERE user_id = $1 AND word_id = $2 RETURNING *',
      [userId, wordId]
    );
    return result.rows[0];
  },
};

// Phrase queries
export const phraseQueries = {
  async findByUser(userId) {
    const result = await query(
      'SELECT * FROM phrases WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  },

  async create(phrase) {
    const { userId, text, translation } = phrase;
    const result = await query(
      `INSERT INTO phrases (user_id, text, translation)
       VALUES ($1, $2, $3)
       RETURNING phrase_id, user_id, text, translation, created_at, updated_at`,
      [userId, text, translation ? JSON.stringify(translation) : null]
    );
    return result.rows[0];
  },

  async delete(userId, phraseId) {
    const result = await query(
      'DELETE FROM phrases WHERE user_id = $1 AND phrase_id = $2 RETURNING *',
      [userId, phraseId]
    );
    return result.rows[0];
  },
};

export default pool;
