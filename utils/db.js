import { MongoClient } from 'mongodb';

const dbHOST = process.env.DB_HOST || 'localhost';
const dbPORT = process.env.DB_PORT || 27017;
const db = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${dbHOST}:${dbPORT}`;

class DBClient {
  constructor() {
    this.client = new MongoClient(url, { userUnifiedTopology: true, useNewUrlParser: true });
    this.client.connect().then(() => {
      this.db = this.client.db(`${db}`);
    }).catch((err) => {
      console.log(err);
    });
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    const usersCollection = this.db.collection('users');
    const docCount = await usersCollection.countDocuments();
    return docCount;
  }

  async nbFiles() {
    const filesCollection = this.db.collection('files');
    const docCount = await filesCollection.countDocuments();
    return docCount;
  }
}
const dbClient = new DBClient();

module.exports = dbClient;
