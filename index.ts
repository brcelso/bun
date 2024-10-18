interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

const server = Bun.serve({
  port: 3000,
  fetch(request: Request) {
    const url = new URL(request.url);

    if (url.pathname === '/users') {

      if (request.method === 'GET') {
        
        const users: User[] = [];

        return Response.json ({
          users
        })
      
      } 
    }

    return new Response('Not found', { status: 404 });
    
  },
});

console.log(`Listening on localhost:${server.port}`);
