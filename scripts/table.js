// Coin data will only appear if its data has changed
function updateCryptoTableCoinRow(coin) {
    const { ticker, close, low, high, open } = extractCoinInfoFromWS(coin);
    const coinElementId = 'table-coin-' + ticker.toLowerCase();
    const tickerTr = document.getElementById(coinElementId);

    // If ticker doesn't exist on current page, no need to update
    if (!tickerTr) {
        return;
    }

    var priceElement = document.createElement('td');
    var lowElement = document.createElement('td');
    var highElement = document.createElement('td');

    priceElement.innerText = adjustSigFig(close);
    lowElement.innerText = adjustSigFig(low);
    highElement.innerText = adjustSigFig(high);

    var changePctElement = document.createElement('td');
    const changeVal = parseFloat((close - open) / close * 100).toFixed(2);
    if (parseFloat(changeVal) > 0) {
        // green
        changePctElement.innerHTML = `<span style="color: #078f07;">${changeVal}%</span>`;
    } else {
        // red
        changePctElement.innerHTML = `<span style="color: #d00;">${changeVal}%</span>`;
    }

    // Remove old data except name
    while (tickerTr.hasChildNodes() && tickerTr.childElementCount > 1) {
        tickerTr.removeChild(tickerTr.lastChild);
    }

    tickerTr.appendChild(priceElement);
    tickerTr.appendChild(lowElement);
    tickerTr.appendChild(highElement);
    tickerTr.appendChild(changePctElement);
}

function displayPaginatedCoinData() {
    var coinData = [];

    fetch(API_URL + "binance/24hr/coins" + '?' + `skip=${skip}` + '&' + `limit=${limit}`)
        .then(response => response.json())
        .then(res => {
            if (res.data.length === 0) {
                finishedAddingCoins = true;
                return;
            }

            coinData = res.data.sort((a, b) => {
                if (a.symbol < b.symbol) {
                    return -1;
                } else {
                    return 1;
                }
            });

            for (c of res.data) {
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

                const tr = document.createElement('tr');
                tr.id = 'table-coin-' + symbol.toLowerCase();

                // if row is clicked, change main data to coin on that row
                tr.onclick = function () {
                    selectedCoin = tr.id.split('-')[2].toUpperCase();
                    coinForm.value = selectedCoin;
                    setCookie('selectedCoin', coinForm.value);
                    initaliseCoinData();
                    displayTradingViewChart();
                    window.scrollTo({ top: 0, behavior: 'smooth' });

                    switchPage();
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

const scroll = addEventListener('scroll', () => {
    // at end of page
    if (!finishedAddingCoins && window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        skip += limit;
        displayPaginatedCoinData();
    } else if(finishedAddingCoins) {
        document.getElementById('loadingTable').style.display = "none";
    }
});