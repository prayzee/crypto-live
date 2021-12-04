const API_URL = 'https://crypto-backend-app.herokuapp.com/api/';
const socket = new WebSocket('wss://crypto-backend-app.herokuapp.com/api/');

const main = document.getElementById('main');
const spinner = document.getElementById('spinner');
const animatedText = document.getElementById('animatedText');

var chatViewPortWidth = visualViewport.width * 0.2;

const initalisePage = function () {
    main.style.display = "none";
    
    typeAnimatedText();

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
        animatedText.style.display = "none";
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

function updateTime() {
    const clock = document.getElementById('clock');
    clock.innerText = new Date().toLocaleTimeString();
    setInterval(() => {
        updateTime();
    }, 1000);
}

window.addEventListener('resize', () => {
    chatViewPortWidth = chat.offsetWidth;
    displayTradingViewChart();
});

window.onload = initalisePage;