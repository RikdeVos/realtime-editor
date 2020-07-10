import Util from './util.js';

class App {
  user = {
    name: 'Unnamed User',
    id: Math.round(Math.random() * 1000),
    cursorIndex: 0,
  };
  users = {};
  init() {
    this.editorEl = document.querySelector('.editor');
    this.updateNameBtnEl = document.querySelector('.update-name-btn');
    this.usersEl = document.querySelector('.users');
    this.titleEl = document.querySelector('.title');

    this.updateTitle();
    this.updateNameBtnEl.addEventListener('click', () => this.updateNameBtn());

    this.socket = io();

    this.socket.on('connect', () => {
      console.log('Connected');
    });

    // this.socket.on('user-connected', ({ userId }) => {
    //   console.log(`User connected, id: ${userId}`);
    // });

    // this.socket.on('user-disconnected', ({ userId }) => {
    //   console.log(`User disconnected, id: ${userId}`);
    // });

    this.socket.on('update', (update) => {
      this.users = update.users;
      //   console.log('update', update);
    });

    this.timer = setInterval(() => {
      this.update();
    }, 1000);
  }

  update() {
    console.log(Util.getCaretPosition(this.editorEl));
    this.socket.emit('updateClient', this.user);

    this.updateUsersList();
  }

  updateUsersList() {
    let users = [];
    for (const i in this.users) {
      users.push(this.users[i]);
    }
    this.usersEl.innerHTML = users
      .filter((user) => user.id !== this.user.id)
      .map((user) => user.name)
      .join(', ');
  }

  updateTitle() {
    this.titleEl.innerHTML = 'Hello, ' + this.user.name;
  }

  /**
   * When the update name btn is pressed
   */
  updateNameBtn() {
    const newName = prompt('Enter your name');
    this.user.name = newName;
    this.updateTitle();
  }
}

export default App;
