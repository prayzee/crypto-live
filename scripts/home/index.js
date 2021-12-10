import * as chart from "./chart.js";
import * as table from "./table.js";
import * as coin from "./coinData.js";
import * as messaging from "./messaging.js";
import * as ws from "./socket.js";

export const CHAT_VIEWPORT_SIZE_PCT = 0.25;
export var chatViewPortWidth = document.documentElement.clientWidth * CHAT_VIEWPORT_SIZE_PCT;
export const API_URL = 'https://crypto-backend-app.herokuapp.com/api/';
export const socket = new WebSocket('wss://crypto-backend-app.herokuapp.com/api/');
export var initialChartLoad = true;

export default function initialisePage() {

    const main = document.getElementById('main');
    const animatedText = document.getElementById('animatedText');

    typeAnimatedText();

    if (getCookie('selectedCoin')) {
        coin.setSelectedCoin(getCookie('selectedCoin'));
    }

    chart.default();
    coin.default();
    table.default();
    messaging.default();
    ws.default();

    chart.displayTradingViewChart();
    addSupportedCoins();
    initialiseCoinData();
    table.displayPaginatedCoinData();
    updateTime();
    coin.updateRSI();

    setTimeout(function () {
        animatedText.style.display = "none";
        main.style.display = "block";
    }, 2500);

    window.addEventListener('resize', () => {
        const chat = document.getElementById('chat');
        if (!initialChartLoad) {
            let newChatWidth = Math.round(document.documentElement.clientWidth * CHAT_VIEWPORT_SIZE_PCT);

            chat.style.width = `${newChatWidth}px`;
            chatViewPortWidth = newChatWidth;
        }
        chart.displayTradingViewChart();
        initialChartLoad = false;
    });
}


function addSupportedCoins() {
    // Add supported coins
    fetch(API_URL + "binance/coins")
        .then(response => response.json())
        .then(res => { coin.displaySupportedCoins(res['coins']) })
        .catch(err => { console.log(err) });
}

export function initialiseCoinData() {
    // Display full day data for specified coin
    fetch(API_URL + "binance/24hr/" + coin.selectedCoin)
        .then(response => response.json())
        .then(res => {
            const changePercent = (res["lastPrice"] - res["prevClosePrice"]) / res["prevClosePrice"] * 100;
            const extractedData = {
                "24hr High": coin.adjustSigFig(res["highPrice"]),
                "24hr Low": coin.adjustSigFig(res["lowPrice"]),
                "24hr Change": parseFloat(changePercent).toFixed(2)
            }

            coin.displayFullDayData(extractedData);

            // set live price to be initially the last price from retrieved 24hr price
            const lastPrice = document.getElementById('livePrice');
            lastPrice.innerText = coin.adjustSigFig(res['lastPrice']);

            // set tab title with live fetched price
            document.title = `${coin.adjustSigFig(res['lastPrice'])} | ${coin.selectedCoin}`;
        })
        .catch(err => { console.log(err) });
}

export function setCookie(cname, cvalue) {
    document.cookie = cname + '=' + cvalue + ';';
}

function getCookie(cname) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name == cname) {
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
        if (i < toType.length) {
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
        const clock = document.getElementById('clock');
        clock.innerText = new Date().toLocaleTimeString();
    }, 1000);
}