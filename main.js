var messages = document.getElementById('messages');
var roomNameInput = document.getElementById('roomname-input');
var sendButton = document.getElementById('send-btn');

sendButton.addEventListener('click', sendUserMessage);


start();

function start() {
  getMessagesFromServer();
  setInterval(getMessagesFromServer, 2000);
}

var lastMessages = [];

async function getMessagesFromServer() {

  var roomname = roomNameInput.value;
  var response = await fetch(`https://fchatiavi.herokuapp.com/get/mc/?offset=0&limit=1000000`);
  response = await response.json();

  if (response == null) {
    messages.innerHTML = 'No messages';
    return;
  }
  var messagesHTML = fromMessagesHTML(response);
  messages.innerHTML = messagesHTML;

  if (lastMessages.length < response.length) {
    scrollToEnd();
  }

  lastMessages = response;
}

async function sendUserMessage() {
  var roomname = roomNameInput.value;

  var userNickname = document.getElementById('nickname-input').value;
  var userMessage = document.getElementById('message-input').value;

  if (userNickname.length === 0) {
    alert("Ты должен ввести имя!");
    return;
  }

  if (userMessage.length === 0) {
    alert("Ты должен ввести сообщение!");
    return;
  }

  await fetch(`https://fchatiavi.herokuapp.com/send/mc/`, {
    method: 'POST',
    body: JSON.stringify({
      Name: userNickname,
      Message: userMessage
    })
  });

  getMessagesFromServer();
}

function fromMessagesHTML(messages) {
  var allMessagesHTML = '';
  for (var i = 0; i < messages.length; i++) {
      var messageData = messages[i];
      var message = `
        <div class="message">
            <div class="message-nickname"> ${messageData.Name} </div>
            <div class="message-text"> ${messageData.Message} </div>
        </div>
      `
      allMessagesHTML = allMessagesHTML + message;
  }
  return allMessagesHTML;
}

function scrollToEnd() {
  messages.scrollTop = messages.scrollHeight;
}