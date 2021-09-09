socket.onopen = () => {
    console.log('WS connected');
};

// display new message
socket.onmessage = function (message) {
    data = JSON.parse(message.data);
    switch (data.event) {
        case 'chatMessage':
            displayChatMessage(data.message);
            break;
        case 'livePrice':
            // this could be optimised by doing both actions together
            // and preventing a double loop
            updateLiveCoinData(data.message);
            updateCryptoTable(data.message);
            break;
        default:
            console.log('unknown message type recieved: ' + message);
    }
};