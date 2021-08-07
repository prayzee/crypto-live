const API_URL = 'https://crypto-backend-app.herokuapp.com/api/';
const socket = new WebSocket('wss://crypto-backend-app.herokuapp.com/api/');

const main = document.getElementById('main');
const spinner = document.getElementById('spinner');

const initalisePage = function () {
    main.style.display = "none";
    displayTradingViewChart();
    addSupportedCoins();
    initaliseCoinData();
    updateTime();
    updateRSI();

    setTimeout(function () {
        spinner.style.display = "none";
        main.style.display = "block";
    }, 2500);
}

function addSupportedCoins() {
    // Add supported coins
    fetch(API_URL + "binance/coins")
    .then(response => response.json())
    .then(res => { displaySupportedCoins(res['coins']) })
    .catch(err => { console.log(err) });
}

function initaliseCoinData() {
    // Display full day data for specified coin
    fetch(API_URL + "binance/24hr/" + selectedCoin)
    .then(response => response.json())
    .then(res => {
        const changePercent = (res["lastPrice"] - res["prevClosePrice"]) / res["prevClosePrice"] * 100;
        extractedData = {
            "24hr High": adjustSigFig(res["highPrice"]),
            "24hr Low": adjustSigFig(res["lowPrice"]),
            "24hr Change": parseFloat(changePercent).toFixed(2)
        }

        displayFullDayData(extractedData);

        // set live price to be initially the last price from retrieved 24hr price
        const lastPrice = document.getElementById('livePrice');
        lastPrice.innerText = adjustSigFig(res['lastPrice']);

        // set tab title with live fetched price
        document.title = `${adjustSigFig(res['lastPrice'])} | ${selectedCoin}`;
    })
    .catch(err => { console.log(err) });

}

window.onload = initalisePage;