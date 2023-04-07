import sha1 from 'sha1';
import dbClient from '../utils/db.js';
import Queue from 'bull';

const userQueue = new Queue('userQueue', 'redis://127.0.0.1:6379');

class UsersController {
  static postNew(request, response) {
    const { email } = request.body;
    const { password } = request.body;

    if (!email) {
      response.status(400).json({ error: 'Missing email' });
      return;
  }
    if (!password) {
      response.status(400).json({ error: 'Missing password' });
      return;
    }

    const users = dbClient.db.collection('users');
    users.findone({ email }, (err, user) => {
      if (user) {
        response.status(400).json({ error: 'Already exist' });
      } else {
        const hashedPassword = sha1(password);
        users.insertOne(
          {
            email,
            password: hashedPassword
          },
        ).then((result) => {
          response.status(201).json({ id: result.insertId, email });
          userQueue.add({ userId: result.insertedId });
        }).catch((err) => console.log(err));
      }
    });
  }
}

module.exports = UsersController;