import express, { Express } from 'express';
import * as http from 'http';
import next, { NextApiHandler } from 'next';
import * as socketio from 'socket.io';
import { prisma } from '../services/db';

const port: number = parseInt(process.env.PORT || '3000', 10);
const dev: boolean = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

type Room = {
  id: string;
  users: Map<string, any>;
};

nextApp.prepare().then(async () => {
  const app: Express = express();
  const server: http.Server = http.createServer(app);
  const io: socketio.Server = new socketio.Server();

  const rooms: Room[] = [];

  io.attach(server);

  io.on('connection', (socket: socketio.Socket) => {
    socket.on('createRoom', (id: string) => {
      const room = rooms.filter((room) => room.id == id);

      if (room.length > 0) {
        return;
      }

      console.log(`Room ${id} created`);
      rooms.push({ id, users: new Map() });
    });

    socket.on('joinRoom', (id: string, name: string) => {
      const room = rooms.filter((room) => room.id === id)[0];
      socket.join(id);
      room.users.set(name, socket);
      console.log(`${name} joined ${id}`);
      io.in(id).emit('updateRoom', Array.from(room.users.keys()));
    });

    socket.on('messageSent', (id, message, user) => {
      console.log(`[${id}] ${user}: ${message}`);

      io.in(id).emit('newMessage', message, user);
    });

    socket.on('disconnect', async () => {
      // Gets the room in which the current user who disconnected was in
      const room = rooms.filter((room) =>
        Array.from(room.users.values()).filter(
          (userSocket) => userSocket === socket
        )
      )[0];

      if (room === undefined) return;

      // Given that there is a mapping from an username to a socket, we can get the username of the user who disconnected by filtering the sockets and matching `socket` to the user's socket
      const user = Array.from(room.users.entries()).filter(
        (user) => user[1] === socket
      )[0];

      if (user === undefined) return;

      console.log(`[${room.id} LEAVE] ${user[0]}`);
      room.users.delete(user[0]);

      socket.broadcast
        .in(room.id)
        .emit('updateRoom', Array.from(room.users.keys()));

      if (room.users.size === 0) {
        try {
          await prisma.room.delete({
            where: {
              id: room.id
            }
          });
          console.log(`[${room.id} DELETED]`);
        } catch (error) {
          console.error('could not delete room');
        }
      }
    });
  });

  app.all('*', (req: any, res: any) => nextHandler(req, res));

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
