import { socket } from "./index.js";

export default function initialise() {
    const chatForm = document.getElementById('chatForm');
    const messageForm = document.getElementById('messageToSend');
    messageForm.style.cssText = 'text-align: center;';
    messageForm.placeholder = 'Chat with other live users...';

    chatForm.addEventListener('submit', (event) => {
        event.preventDefault();
    
        const text = document.getElementById('messageToSend');
        if (text.value.length != 0) {
            socket.send(JSON.stringify({ event: 'chatMessage', message: text.value }));
            text.value = '';
        }
    });
}

export function displayChatMessage(message) {
    const chat = document.getElementById('chat');
    const messageTimestamp = new Date(message.time).toLocaleTimeString();
    const p = document.createElement('p');
    p.innerHTML = `<b> ${message.user} [${messageTimestamp}] </b>: ${message.message}`;
    p.style.cssText = 'margin: 1%';

    chat.appendChild(p);
    chat.scrollTop = chat.scrollHeight;
}
