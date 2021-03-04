import LoginWindow from './js/LoginWindow.js';
import MainWindow from './js/MainWindow.js';
import UserName from './js/UserName.js';
import UserList from './js/UserList.js'; 
import UserPhoto from './js/UserPhoto.js'; 
import MessageList from './js/MessageList.js'; 
import MessageSender from './js/MessageSender.js'; 
import WSClient from './wsClient.js';



export default class MyChat {
    constructor() {
        this.wsClient = new WSClient(
            `ws://${location.host}/MyChat/ws`,
            this.onMessage.bind(this)
        );
        
        this.ui = {
            loginWindow: new LoginWindow(
                document.querySelector("#login"),
                this.onLogin.bind(this)
            ),
            mainWindow: new MainWindow(document.querySelector("#main")),
            userName: new UserName(document.querySelector('[data-role="user-name"]')),
            userList: new UserList(document.querySelector('[data-role="user-list"]')),
            messageList: new MessageList(document.querySelector('[data-role="message-list"]')),
            messageSender: new MessageSender (
                document.querySelector('[data-role="message-sender"]'),
                this.onSend.bind(this)
            ),
            userPhoto: new UserPhoto(
                document.querySelector('[data-role="user-photo"]'),
                this.onUpload.bind(this),
            ),
        };

        this.ui.loginWindow.show();
    }

   onUpload(data) {
    this.ui.userPhoto.set(data);
 
    fetch('/MyChat/upload-photo', {
        method: 'post',
        body: JSON.stringify( {
            name: this.ui.userName.get(),
            image: data,
        }),
            
        });
        }
    


    onSend(message) {
        this.wsClient.sendTextMessage(message);
        this.ui.messageSender.clear();
    };

    async onLogin(name) {
        await this.wsClient.connect();
        this.wsClient.sendHello(name);
        this.ui.loginWindow.hide();
        this.ui.mainWindow.show();
        this.ui.userName.set(name);

    };

    onMessage({ type, from, data }) {
        console.log(type, from, data);

        if (type === 'hello') {
            this.ui.userList.add(from);
            this.ui.messageList.addSystemMessage(`${from} вошёл в чат`);
        } else if (type === 'user-list') {
            for (const item of data) {
                this.ui.userList.add(item);
            }
        } else if (type === 'bye-bye') {
            this.ui.userList.remove(from);
            this.ui.messageList.addSystemMessage(`${from} вышел из чата`);
        }  else if (type === 'text-message') {
            this.ui.messageList.add(from, data.message);
          } else if (type === 'photo-changed') {
            const avatars = document.querySelectorAll(
              `[data-role=user-avatar][data-user=${data.name}]`
            );
      
            for (const avatar of avatars) {
              avatar.style.backgroundImage = `url(/MyChat/photos/${
                data.name
              }.png?t=${Date.now()})`;
            }
          }
        }
      }
      