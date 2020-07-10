### Template for websocket based application

Consists of nodejs server with socket.io.

**Requirements:**
- NodeJs version 10 or higher
- npm or yarn

**Run**
- `npm install`
- `npm start`
- open localhost:3000, you should be able to see "Connected" messages in server and browser consoles
- open more tabs or browsers to see them sending "Connected" messages to each other

**Structure**

`server.js` - node http server with setup of socket.io and express

`app.js` - file with socket handling logic

`static/*` - directory with static files served by express
