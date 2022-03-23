const API_URL = 'https://crypto-backend-app.herokuapp.com/api/';
const socket = new WebSocket('wss://crypto-backend-app.herokuapp.com/api/');

const main = document.getElementById('main');
const animatedText = document.getElementById('animatedText');
const CHAT_VIEWPORT_SIZE_PCT = 0.25;
var initialChartLoad = true;
var chatViewPortWidth = document.documentElement.clientWidth * CHAT_VIEWPORT_SIZE_PCT;

const CACHE_NAME = "crypto-live";

const switchPageButton = document.getElementById('switchPageButton');

// enum-like structure to represent possible pages
const Page = {
    home: 'home',
    table: 'table'
}

let currentPage = Page.home;

const initalisePage = function () {
    typeAnimatedText();
    
    if(getCookie('selectedCoin')) {
        selectedCoin = getCookie('selectedCoin');
    }

    setSymbolPriceObjCoin(selectedCoin);
    
    displayTradingViewChart();
    addSupportedCoins();
    initaliseCoinData();
    displayPaginatedCoinData();
    updateTime();
    // updateRSI();
    
    setTimeout(function () {
        animatedText.style.display = "none";
        main.style.display = "block";
    }, 2500);
}

function addSupportedCoins() {
    // Add supported coins

    const coinsListURL = API_URL + "binance/coins";

    if('caches' in window) {
        caches
            .open(CACHE_NAME)
            .then(cache => {
                cache
                    .match(coinsListURL)
                    .then(async (cachedData) => {
                        if(cachedData == undefined) {
                            const coinsListResponse = await fetch(coinsListURL);
                            await cache.put(coinsListURL, coinsListResponse);

                            cachedData = await cache.match(coinsListURL);
                        }

                        return cachedData.json();
                    })
                    .then(res => {
                        displaySupportedCoins(res['coins'])
                    })
                    .catch(err => {
                        console.log(err) 
                    });
            })
    } else {
        fetch(API_URL + "binance/coins")
            .then(response => response.json())
            .then(res => { displaySupportedCoins(res['coins']) })
            .catch(err => { console.log(err) });
    }

}

function initaliseCoinData() {
    // Display full day data for specified coin
    fetch(API_URL + "binance/24hr/" + selectedCoin)
        .then(response => response.json())
        .then(res => {
            const changePercent = (res["lastPrice"] - res["prevClosePrice"]) / res["prevClosePrice"] * 100;
            const extractedData = {
                "24hr Open": adjustSigFig(res["openPrice"]),
                "24hr High": adjustSigFig(res["highPrice"]),
                "24hr Low": adjustSigFig(res["lowPrice"]),
                "24hr Change": parseFloat(changePercent).toFixed(2),
                "Volume": adjustSigFig(res["volume"])
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

function typeAnimatedText() {
    // main display currently set to none - turn typed text on
    animatedText.style.fontSize = "100px";
    animatedText.style.alignItems = "center";
    animatedText.style.textAlign = "center";
    animatedText.style.justifyContent = "center";
    animatedText.style.display = "flex";
    animatedText.style.minHeight = "100vh";

    let toType = "Cryptocurrency Prices. Live.";
    let i = 0;

    const type = () => {
        if(i < toType.length) {
            let prev = animatedText.innerHTML;
            animatedText.innerHTML += toType.charAt(i) + "|";
            setTimeout(() => {
                animatedText.innerHTML = prev + toType.charAt(i);
                i++;
            }, 50)
            setTimeout(type, 50);
        }
    }
    type();
}

switchPageButton.addEventListener('click', () => {
    const mainWrapper = document.getElementById('mainWrapper');
    const tablePage = document.getElementById('tablePage');
    const homePageNavContent = document.getElementById('homePageNavContent');
    const tablePageNavContent = document.getElementById('tablePageNavContent');

    if(currentPage == Page.home) {
        mainWrapper.style.display = "none";
        homePageNavContent.style.display = "none";

        tablePage.style.display = "";
        tablePageNavContent.style.display = "";
        
        currentPage = Page.table;
        switchPageButton.value = "Home";

    } else if (currentPage == Page.table) {
        tablePageNavContent.style.display = "none";
        tablePage.style.display = "none";
        
        mainWrapper.style.display = "";
        homePageNavContent.style.display = "";

        currentPage = Page.home;
        switchPageButton.value = "All coins";
    }
});

function updateTime() {
    const clock = document.getElementById('clock');
    clock.innerText = new Date().toLocaleTimeString();

    setInterval(() => {
        const clock = document.getElementById('clock');
        clock.innerText = new Date().toLocaleTimeString();
    }, 1000);
}

function setSymbolPriceObjCoin(coin) {
    const div = document.getElementById('selectedCoinSymbol');
    div.innerText = coin;
}

window.onload = initalisePage;