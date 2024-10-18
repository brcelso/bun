import { Database } from 'bun:sqlite';

const db = new Database('mydb.sqlite', { create: true });

db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, password TEXT)");

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

const server = Bun.serve({
  port: 3000,
  async fetch(request: Request) {
    const url = new URL(request.url);

    if (url.pathname === '/users') {

      if (request.method === 'POST') {

          const body = await request.json();
          
          const hashedPassword = await Bun.password.hash(body.password, 'bcrypt');
          db.run('INSERT INTO users( name, email, password) VALUES (?, ?, ?)', body.name, body.email, hashedPassword)

          return new Response(null, { status:201 });
      }

      else if (request.method === 'GET') {
        
        const users: User[] = db.query('SELECT id, name, email FROM users').all() as User[]; 

        return Response.json ({
          users
        })
      
      } 
    }

    return new Response('Not found', { status: 404 });

  },
});

console.log(`Listening on localhost:${server.port}`);
