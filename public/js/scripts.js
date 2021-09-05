const socket = io('/chattings'); // io는 index.hbs에 있는 cdn.socket.io의 하나의 메소드이다.
const getElementById = (id) => document.getElementById(id) || null;

// * get DOM element

const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

// * global socket handler 
socket.on('user_connected', (username) => {
  drawNewChat(`${username} connected!`)
})

socket.on("new_chat", (data) => {
  const {
    chat,
    username
  } = data;
  drawNewChat(`${username} : ${chat}`)
})

// * event callback functions 
const handleSubmit = (event) => {
  event.preventDefault(); // 기본적으로 form에서 submit을 할때 이벤트 버블이 발생한다.(새로고침이 됨) 이것을 방지하기 위해서 preventDefault로 이벤트의 기본값을 막는다. 
  const inputValue = event.target.elements[0].value;
  if (inputValue !== '') {
    socket.emit('submit_chat', inputValue);
    // 화면에 그리기 
    drawNewChat(`me : ${inputValue}`)
    event.target.elements[0].value = ''
  }
}

// * draw functions 
const drawHelloStranger = (username) => {
  (helloStrangerElement.innerHTML = `Hello ${username} Stranger :)`)
}
const drawNewChat = (message) => {
  const wrapperChatBox = document.createElement('div')
  const chatBox = `<div>${message}</div>`;
  wrapperChatBox.innerHTML = chatBox;
  chattingBoxElement.append(wrapperChatBox)
}

function helloUser() {
  const username = prompt('What is your name?');
  socket.emit('new_user', username, (data) => {
    drawHelloStranger(data);
  }); // 첫번째 인자에는 이벤트 이름, 두번재 인자에는 데이터를 보낼수 있다.

}

function init() {
  helloUser();
  //이벤트 연결 
  formElement.addEventListener('submit', handleSubmit)
}

init();