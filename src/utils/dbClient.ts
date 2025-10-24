import { Pool } from 'pg';

// Create a PostgreSQL connection pool with timeout settings
const pool = new Pool({
  connectionString: process.env.DATABASE_URL?.replace('channel_binding=require', ''),
  ssl: {
    rejectUnauthorized: false // Required for some PostgreSQL providers like Neon
  },
  connectionTimeoutMillis: 10000, // 10 seconds
  idleTimeoutMillis: 30000, // 30 seconds
  max: 10, // Maximum number of clients in the pool
  query_timeout: 10000, // 10 seconds for query execution
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000
});

// Test the connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
});

// Initialize the database schema
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Create the reminders table if it doesn't exist
    // Use queryWithRetries to handle potential connection issues
    await queryWithRetries(() =>
      pool.query(`
        CREATE TABLE IF NOT EXISTS reminders (
          id SERIAL PRIMARY KEY,
          email TEXT NOT NULL,
          date TEXT NOT NULL,
          time TEXT NOT NULL,
          sent_confirmation BOOLEAN DEFAULT FALSE,
          sent_reminder BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)
    );
    console.log('Database schema initialized');
  } catch (error) {
    console.error('Error initializing database schema:', error);
    throw error;
  }
};

/**
 * Utility function to execute a database query with retry logic
 * @param queryFn - Function that returns a promise with the query to execute
 * @param maxRetries - Maximum number of retry attempts (default: 5)
 * @param initialDelay - Initial delay in milliseconds before the first retry (default: 1000)
 * @returns Promise with the query result
 */
export const queryWithRetries = async <T>(
  queryFn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> => {
  let lastError: any;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Execute the query with a timeout
      let timeoutId: NodeJS.Timeout;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error('Query execution timed out'));
        }, 25000); // 25 seconds timeout
      });

      // Race between the query and the timeout
      const result = await Promise.race([
        queryFn(),
        timeoutPromise
      ]) as T;
      
      // Clear the timeout if the query succeeds
      clearTimeout(timeoutId!);
      return result;
    } catch (error: any) {
      lastError = error;

      // Log the error for debugging
      console.error(`Database query attempt ${attempt + 1} failed:`, error.message || error);

      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        console.error('Maximum retry attempts reached. Giving up.');
        throw error;
      }

      // Check if the error is a connection error or an AggregateError that we should retry
      const isAggregateError = error.name === 'AggregateError' || 
                              (error.constructor && error.constructor.name === 'AggregateError');

      const shouldRetry =
        isAggregateError ||
        error.code === 'ETIMEDOUT' ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ECONNRESET' ||
        error.code === '08006' || // Connection failure
        error.code === '08001' || // Unable to connect
        error.message?.includes('timeout') ||
        error.message?.includes('timed out');

      if (!shouldRetry) {
        console.error('Error is not retryable. Throwing error.');
        throw error; // Don't retry for other types of errors
      }

      console.log(`Database query attempt ${attempt + 1} failed, retrying in ${delay}ms...`);

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));

      // Exponential backoff with jitter to prevent thundering herd
      delay = Math.floor(delay * 2 * (0.9 + Math.random() * 0.2));
    }
  }

  // This should never be reached due to the throw in the loop, but TypeScript needs it
  throw lastError;
};

// Export the pool for use in other modules
export default pool;
