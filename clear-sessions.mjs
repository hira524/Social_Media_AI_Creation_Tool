import { MongoClient } from 'mongodb';
import 'dotenv/config';

async function clearSessions() {
  const client = new MongoClient(process.env.DATABASE_URL || 'mongodb://localhost:27017/test');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const sessionsCollection = db.collection('sessions');
    
    // Drop the entire sessions collection to remove all corrupted data
    try {
      await sessionsCollection.drop();
      console.log('Dropped sessions collection');
    } catch (error) {
      if (error.code === 26) {
        console.log('Sessions collection does not exist, nothing to drop');
      } else {
        console.error('Error dropping collection:', error);
      }
    }
    
    console.log('Session cleanup completed successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  } finally {
    await client.close();
  }
}

clearSessions();
