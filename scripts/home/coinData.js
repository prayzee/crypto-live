import * as table from "./table.js";
import * as index from "./index.js";
import * as chart from "./chart.js";

export var selectedCoin = "BTCAUD";

export default function initialise() {
    // main selected coin
    const coinForm = document.getElementById('coinSelection');
    
    // changes to coin selection reflected throughout page
    coinForm.addEventListener('change', (event) => {
        selectedCoin = coinForm.value;
        index.initialiseCoinData();
        chart.displayTradingViewChart();
        index.setCookie('selectedCoin', coinForm.value);
    });

    updateRSI();
}

export function setSelectedCoin(coin) {
    selectedCoin = coin;
}

// Update live price of selected coin through socket
// @ param message
// 24hr rolling window mini-ticker statistics for all symbols that changed in an array.
// These are NOT the statistics of the UTC day, but a 24hr rolling window for the 
// previous 24hrs. Note that only tickers that have changed will be present in the array.
// Message looks like this:
//  [{
//     "e": "24hrMiniTicker",  // Event type
//     "E": 123456789,         // Event time
//     "s": "BNBBTC",          // Symbol
//     "c": "0.0025",          // Close price
//     "o": "0.0010",          // Open price
//     "h": "0.0025",          // High price
//     "l": "0.0010",          // Low price
//     "v": "10000",           // Total traded base asset volume
//     "q": "18"               // Total traded quote asset volume
//   } ...]
export function updateLiveCoinData(message) {
    for (let coin in message) {
        table.updateCryptoTableCoinRow(message[coin]);

        // Note coin data will only appear if its data has changed
        if (message[coin]['s'] === selectedCoin) {
            updateSelectedCoinNavBarData(coin, message);
        }
    }
};

// if coins are less than $1 keep the default sig fig
// otherwise remove excess 0's
export function adjustSigFig(num) {
    num = parseFloat(num);
    if (num > 1) {
        return num.toFixed(2);
    }
    return num;
}


// Coins for which data is available
export function displaySupportedCoins(coins) {
    coins.sort();

    const DataElement = document.getElementById('coinSelection');

    for (var i in coins) {
        const option = document.createElement('option');
        if (coins[i] === selectedCoin) {
            option.selected = true;
        }
        option.value = coins[i];
        option.innerText = coins[i];
        DataElement.appendChild(option);
    }
}

// update RSI every 15 seconds
export const updateRSI = function updateRSI() {
    setInterval(() => {
        fetch(index.API_URL + 'binance/rsi/' + selectedCoin + '/1m/14')
            .then(response => response.json())
            .then(res => {
                const rsiElement = document.getElementById('rsi');
                rsiElement.innerHTML = 'RSI: ' + res[res.length - 1];
            })
            .catch(err => { console.log(err) });
    }, 15000);
}

// Displays 24hr low, 24hr high, low and change in top banner
// @param binanceData   {
//                          "key1": "value1",
//                          "key2": "value2"
//                      }
export function displayFullDayData(binanceData) {
    const fullDayData = document.getElementById('fullDayData');
    fullDayData.innerText = '';
    for (var i in binanceData) {
        var dataElement = document.createElement('h9');
        dataElement.innerHTML = `${i}<br>${binanceData[i]}`;

        dataElement.style.paddingLeft = '10px';
        dataElement.style.paddingRight = '10px';

        if (i == '24hr Change') {
            if (parseFloat(binanceData[i]) > 0) {
                // green
                dataElement.innerHTML = `${i}<br><span style="color: #078f07;">${binanceData[i]}%</span>`;
            } else {
                // red
                dataElement.innerHTML = `${i}<br><span style="color: #d00;">${binanceData[i]}%</span>`;
            }
        }

        fullDayData.appendChild(dataElement);
    }
}

function updateSelectedCoinNavBarData(coin, message) {
    document.title = `${adjustSigFig(message[coin]['c'])} | ${selectedCoin}`;

    var newPrice = adjustSigFig(message[coin]['c']);
    var price = document.getElementById('livePrice');
    var currentPrice = adjustSigFig(price.innerText);

    if (price.innerText.length != 0 && currentPrice < newPrice) {
        price.innerText = newPrice;
        price.style.color = '#078f07'; // green
    } else if (price.innerText.length != 0 && currentPrice > newPrice) {
        price.innerText = newPrice;
        price.style.color = '#d00'; // red
    } else if (price == null) {
        price.innerHTML = message[coin]['c'];
    }

    const changePercent = (message[coin]['c'] - message[coin]['o']) / message[coin]['c'] * 100;
    const extractedFullDayData = {
        "24hr High": adjustSigFig(message[coin]['h']),
        "24hr Low": adjustSigFig(message[coin]['l']),
        "24hr Change": parseFloat(changePercent).toFixed(2)
    }
    displayFullDayData(extractedFullDayData);
}

export function extractCoinInfoFromWS(coin) {
    const ticker = coin['s'];
    const close = coin['c'];
    const low = coin['l'];
    const high = coin['h'];
    const open = coin['o'];
    return { ticker, close, low, high, open }
}