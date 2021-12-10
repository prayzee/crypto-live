import * as messaging from "./messaging.js";
import * as coin from "./coinData.js";
import { socket } from "./index.js";

export default function() {
    socket.onopen = () => {
        console.log('WS connected');
    };
    
    // display new message
    socket.onmessage = function (message) {
        const data = JSON.parse(message.data);
        switch (data.event) {
            case 'chatMessage':
                messaging.displayChatMessage(data.message);
                break;
            case 'livePrice':
                coin.updateLiveCoinData(data.message);
                break;
            default:
                console.log('unknown message type recieved: ' + message);
        }
    };
}
