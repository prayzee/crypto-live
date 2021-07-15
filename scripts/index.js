const API_URL = 'http://localhost:3000/api/';
const socket = new WebSocket('ws://localhost:9999/api/');
const main = document.getElementById('main');
const spinner = document.getElementById('spinner');

// TODO:: Currently the webpage dies after some time
//        due to excess memory usage?

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
    }, 1500);
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
    })
    .catch(err => { console.log(err) });

}

window.onload = initalisePage;