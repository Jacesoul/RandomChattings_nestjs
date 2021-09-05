const socket = io('/chattings'); // io는 index.hbs에 있는 cdn.socket.io의 하나의 메소드이다.
const getElementById = (id) => document.getElementById(id) || null;

// * get DOM element

const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

document.cookie = 'same-site-cookie=foo; SameSite=Lax';
document.cookie = 'cross-site-cookie=bar; SameSite=None; Secure';

function helloUser() {
  const username = prompt('What is your name?');
  socket.emit('new_user', username, (data) => {
    console.log(data);
  }); // 첫번째 인자에는 이벤트 이름, 두번재 인자에는 데이터를 보낼수 있다.
  console.log(username);
  socket.on('hello_user', (data) => {
    console.log(data);
  }); //data를 받을때 on은 콜백함수로 받을수 있다.
}

function init() {
  helloUser();
}

init();
