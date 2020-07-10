import Util from './util.js';

class App {
  user = {
    name: 'Unnamed User',
    id: Math.round(Math.random() * 1000),
    cursorIndex: 0,
  };
  users = {};
  previousCode = null;

  isTyping = false;
  isTypingTimer;

  init() {
    this.editorEl = document.querySelector('.editor');
    this.updateNameBtnEl = document.querySelector('.update-name-btn');
    this.usersEl = document.querySelector('.users');
    this.titleEl = document.querySelector('.title');
    this.caretsEl = document.querySelector('.editor-carets');

    this.updateTitle();
    this.updateNameBtnEl.addEventListener('click', () => this.updateNameBtn());

    this.socket = io();

    this.socket.on('connect', () => {
      console.log('Connected');
    });

    this.socket.on('update', ({ users, code }) => {
      if (this.hasCodeChanged()) {
        return;
      }
      this.users = users;
      if (code !== this.getCode()) {
        this.setCode(code);
      }
    });

    this.timer = setInterval(() => {
      this.update();
    }, 1000);

    this.editorEl.addEventListener('keyup', () => this.editorKeyUp());
  }

  /**
   * Periodic update function to update code and users from server
   */
  update() {
    if (this.isTyping) {
      return;
    }
    this.user.cursorIndex = Util.getCaretPosition(this.editorEl);
    console.log(this.user.cursorIndex);
    this.socket.emit('updateClient', {
      user: this.user,
      code: this.hasCodeChanged() ? this.getCode() : null,
    });
    this.previousCode = this.getCode();

    this.updateUsersList();
  }

  /**
   * Update the users on the page
   */
  updateUsersList() {
    let users = [];
    for (const i in this.users) {
      users.push(this.users[i]);
    }
    const usersExceptMe = users.filter((user) => user.id !== this.user.id);

    // Update list below users
    this.usersEl.innerHTML = usersExceptMe.map((user) => user.name).join(', ');

    // Update carets
    const caretHTML = usersExceptMe
      .map((user) => {
        return (
          '<div class="editor-caret" style="left: ' +
          user.cursorIndex * 9.6 +
          'px">' +
          user.name +
          '</div>'
        );
      })
      .join('');
    if (this.caretsEl.innerHTML !== caretHTML) {
      console.log('update caret', caretHTML);
      this.caretsEl.innerHTML = caretHTML;
    }
  }

  /**
   * Update page title with the user's name
   */
  updateTitle() {
    this.titleEl.innerHTML = 'Hello, ' + this.user.name;
  }

  /**
   * Get the code from the editor
   */
  getCode() {
    return this.editorEl.innerHTML;
  }

  /**
   * Update the code in the editor
   * @param {String} code Code to update
   */
  setCode(code) {
    return (this.editorEl.innerHTML = code);
  }

  /**
   * Determine if the code in the editor has been changed by the user
   */
  hasCodeChanged() {
    if (!this.previousCode) {
      return false;
    }
    if (this.previousCode === this.getCode()) {
      return false;
    }
    return true;
  }

  /**
   * Update name btn is pressed
   */
  updateNameBtn() {
    const newName = prompt('Enter your name');
    this.user.name = newName;
    this.updateTitle();
  }

  /**
   * Set isTyping to true, and back to false after 1200ms
   */
  editorKeyUp() {
    this.isTyping = true;
    if (this.isTypingTimer) {
      clearTimeout(this.isTypingTimer);
    }
    this.isTypingTimer = setTimeout(() => {
      this.isTyping = false;
      clearTimeout(this.isTypingTimer);
    }, 300);
  }
}

export default App;
