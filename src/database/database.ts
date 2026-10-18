import { open } from 'react-native-nitro-sqlite';

const db = open({ name: 'app.sqlite' });

db.execute(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY,
    body TEXT NOT NULL
  )
`);

const body = 'Read the docs';

db.execute('INSERT INTO notes (body) VALUES (?)', [body]);

const { rows } = db.execute<{ id: number; body: string }>(
  'SELECT id, body FROM notes WHERE body = ?',
  [body],
);

console.log(rows._array);
db.close();
