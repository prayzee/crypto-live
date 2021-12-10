import { API_URL } from "./index.js";
import * as coin from "./coinData.js";
import * as index from "./index.js";
import * as chart from "./chart.js";

var skip = 0;
var limit = 10;
var finishedAddingCoins = false;
const CRYPTO_TABLE_SIZE = 4;

export default function initialise() {
    window.addEventListener('scroll', () => {
        // at end of page
        if (!finishedAddingCoins && window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            skip += limit;
            displayPaginatedCoinData();
        } else if(finishedAddingCoins) {
            document.getElementById('loadingTable').style.display = "none";
        }
    });

    displayPaginatedCoinData();
}

// Coin data will only appear if its data has changed
export function updateCryptoTableCoinRow(coinData) {
    const { ticker, close, low, high, open } = coin.extractCoinInfoFromWS(coinData);
    const coinElementId = 'table-coin-' + ticker.toLowerCase();
    const tickerTr = document.getElementById(coinElementId);

    // If ticker doesn't exist on current page, no need to update
    if (!tickerTr) {
        return;
    }

    var priceElement = document.createElement('td');
    var lowElement = document.createElement('td');
    var highElement = document.createElement('td');

    priceElement.innerText = coin.adjustSigFig(close);
    lowElement.innerText = coin.adjustSigFig(low);
    highElement.innerText = coin.adjustSigFig(high);

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

export const displayPaginatedCoinData = function displayPaginatedCoinData() {
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

            const cryptoTable = document.getElementById('cryptoTable');

            for (let c of res.data) {
                const { symbol, prevClosePrice, lowPrice, highPrice, priceChangePercent } = c;
                var ticker = document.createElement('td');
                ticker.innerText = symbol;

                var price = document.createElement('td');
                price.innerText = coin.adjustSigFig(prevClosePrice);

                var low = document.createElement('td');
                low.innerText = coin.adjustSigFig(lowPrice);

                var high = document.createElement('td');
                high.innerText = coin.adjustSigFig(highPrice);

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
                const coinForm = document.getElementById('coinSelection');

                tr.onclick = function () {
                    coin.setSelectedCoin(tr.id.split('-')[2].toUpperCase());
                    coinForm.value = coin.selectedCoin;
                    index.setCookie('selectedCoin', coinForm.value);
                    index.initialiseCoinData();
                    chart.displayTradingViewChart();
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
