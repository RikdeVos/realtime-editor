const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
let idCounter = 0;
let users = {};
let editorCode = 'This is an editable paragraph.';
// const { initSocketApp } = require('./app');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

initSocketApp(io);

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/index.html');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

/**
 * @param {SocketIO.Server} io
 */
function initSocketApp(io) {
  io.on('connection', (socket) => {
    let userId;

    // emit `user-connected` event to all open connections except this
    socket.broadcast.emit('user-connected', { userId });
    // users.push({ id: userId, name: '', cursorIndex: 0 });
    // console.log(users);

    const timer = setInterval(() => {
      console.log('UPDATE', users);
      socket.broadcast.emit('update', { users, code: editorCode });
    }, 1000);

    socket.on('disconnect', () => {
      //   console.log(`User disconnected, id: ${userId}`);
      socket.broadcast.emit('user-disconnected', { userId });
      //   users = users.filter((user) => user.id !== userId);
      if (users[userId]) {
        delete users[userId];
      }
      clearInterval(timer);
    });

    socket.on('updateClient', ({ user, code }) => {
      userId = user.id;
      if (code) {
        editorCode = code;
      }
      users[userId] = user;
      //   console.log('updateClient', user);
    });
  });
}
