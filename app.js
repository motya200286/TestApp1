// app.js

let accessToken = null;
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const authButton = document.getElementById('auth-button');

// Замените YOUR_CLIENT_ID на ваш ID приложения ВКонтакте
const CLIENT_ID = '5961097';
const REDIRECT_URI = 'https://motya200286.github.io/TestApp1/';

// Авторизация через ВК
authButton.addEventListener('click', () => {
  const url = `https://oauth.vk.com/authorize?client_id=${CLIENT_ID}&display=page&redirect_uri=${REDIRECT_URI}&scope=friends,messages&response_type=token&v=5.131`;
  window.location.href = url;
});

// Проверка наличия токена в URL после авторизации
function getAccessTokenFromUrl() {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  return params.get('access_token');
}

accessToken = getAccessTokenFromUrl();

if (accessToken) {
  authButton.style.display = 'none';
  loadMessages();
}

// Загрузка сообщений
async function loadMessages() {
  try {
    const response = await fetch(
      `https://api.vk.com/method/messages.getConversations?access_token=${accessToken}&v=5.131`
    );
    const data = await response.json();
    if (data.error) {
      console.error('Ошибка при загрузке сообщений:', data.error);
      return;
    }

    const conversations = data.response.items;
    messagesDiv.innerHTML = '';
    conversations.forEach((item) => {
      const message = item.last_message.text;
      const fromId = item.last_message.from_id;
      const messageElement = document.createElement('div');
      messageElement.textContent = `ID ${fromId}: ${message}`;
      messagesDiv.appendChild(messageElement);
    });
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
  }
}

// Отправка сообщения
sendButton.addEventListener('click', async () => {
  const messageText = messageInput.value.trim();
  if (!messageText) return;

  try {
    const response = await fetch(
      `https://api.vk.com/method/messages.send?access_token=${accessToken}&user_id=RECIPIENT_USER_ID&message=${encodeURIComponent(messageText)}&random_id=0&v=5.131`
    );
    const data = await response.json();
    if (data.error) {
      console.error('Ошибка при отправке сообщения:', data.error);
      return;
    }

    messageInput.value = '';
    loadMessages();
  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error);
  }
});
