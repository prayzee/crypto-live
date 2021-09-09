const API_URL = 'https://crypto-backend-app.herokuapp.com/api/';
const socket = new WebSocket('wss://crypto-backend-app.herokuapp.com/api/');

const main = document.getElementById('main');
const spinner = document.getElementById('spinner');

const initalisePage = function () {
    main.style.display = "none";

    if(getCookie('selectedCoin')) {
        selectedCoin = getCookie('selectedCoin');
    } else {
        selectedCoin;
    }
    
    displayTradingViewChart();
    addSupportedCoins();
    initaliseCoinData();
    displayPaginatedCoinData();
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

function displayPaginatedCoinData() {
    var coinData = [];
    fetch(API_URL + "binance/24hr/coins")
        .then(response => response.json())
        .then(res => {
            for (c of coinData) {
                const { symbol, prevClosePrice, lowPrice, highPrice, priceChangePercent } = c;
                
                var ticker = document.createElement('td');
                ticker.innerText = symbol;
                
                var price = document.createElement('td');
                price.innerText = adjustSigFig(prevClosePrice);

                var low = document.createElement('td');
                low.innerText = adjustSigFig(lowPrice);

                var high = document.createElement('td');
                high.innerText = adjustSigFig(highPrice);

                var changePercentage = document.createElement('td');
                const changeValue = parseFloat(priceChangePercent).toFixed(2);
                if (parseFloat(changeValue) > 0) {
                    // green
                    changePercentage.innerHTML = `<span style="color: #078f07;">${changeValue}%</span>`;
                } else {
                    // red
                    changePercentage.innerHTML = `<span style="color: #d00;">${changeValue}%</span>`;
                }

                tr = document.createElement('tr');
                tr.id = 'table-coin-' + symbol.toLowerCase();
                
                // if row is clicked, change main data to coin on that row
                tr.onclick = function () {
                    selectedCoin = tr.id.split('-')[2].toUpperCase();
                    coinForm.value = selectedCoin;
                    initaliseCoinData();
                    displayTradingViewChart();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                };
        
                tr.appendChild(ticker);
                tr.appendChild(price);
                tr.appendChild(low);
                tr.appendChild(high);
                tr.appendChild(changePercentage);
        
                cryptoTable.appendChild(tr);
            }
        })
        .catch(err => { console.log(err) });
        
}

function setCookie(cname, cvalue) {
    document.cookie = cname + '=' + cvalue + ';';
}

function getCookie(cname) {
    const cookies = document.cookie.split('; ');
    for(cookie of cookies) {
        const [name, value] = cookie.split('=');
        if(name == cname) {
            return value;
        }
    }
}

window.addEventListener('resize', () => {
    displayTradingViewChart();
});

window.onload = initalisePage;