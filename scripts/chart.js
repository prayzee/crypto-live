const CHART_PCT_OF_REMAIN_VIEWPORT = 0.9;

window.addEventListener('resize', () => {
    if(!initialChartLoad) {
        let newChatWidth = Math.round(document.documentElement.clientWidth * CHAT_VIEWPORT_SIZE_PCT);
        
        chat.style.width = `${newChatWidth}px`;
        chatViewPortWidth = newChatWidth;
    }
    displayTradingViewChart();
    initialChartLoad = false;
});

// The TradingView widget is exposed by the TradingView CDN (src in HTML file)
function displayTradingViewChart() {
    const tradingViewChart = document.getElementById('tradingViewChart');
    while(tradingViewChart.firstChild) {
        tradingViewChart.removeChild(tradingViewChart.firstChild);
    }
    
    tradingViewChart.innerHTML = `
        <div class="tradingview-widget-container">
            <div id="tradingview_widget_container"></div>
            <div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/" rel="noopener"
                target="_blank"><span class="blue-text">Charts </span></a> by TradingView</div>
        </div`;

    tradingViewChart.style.paddingTop = '15px';

    // let chartWidth = Math.round((document.documentElement.clientWidth - chatViewPortWidth) * CHART_PCT_OF_REMAIN_VIEWPORT);
    // let chartHeight = Math.round(document.documentElement.clientHeight * CHART_PCT_OF_REMAIN_VIEWPORT);
    let chartWidth = Math.round(Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) / 100 * 70);
    let chartHeight = Math.round(Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) / 100 * 85);
    
    if (chartType === 'basic') {
        new TradingView.MediumWidget(
            {
                "symbols": [
                    [
                        `${selectedCoin}|1D`,
                    ]
                ],
                "chartOnly": true,
                "width": chartWidth,
                "height": chartHeight,
                "locale": "en",
                "colorTheme": "dark",
                "gridLineColor": "rgba(159, 197, 232, 0)",
                "trendLineColor": "#2962ff",
                "fontColor": "rgba(255, 255, 255, 1)",
                "underLineColor": "rgba(41, 98, 255, 0.3)",
                "underLineBottomColor": "rgba(41, 98, 255, 0)",
                "isTransparent": true,
                "autosize": false,
                "container_id": "tradingview_widget_container"
            }
        );
    } else if (chartType === 'advanced') {
        new TradingView.widget({
            "width": chartWidth,
            "height": chartHeight,
            "symbol": `BINANCE:${selectedCoin}`,
            "interval": "1440",
            "timezone": "Australia/Sydney",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "allow_symbol_change": false,
            "hide_top_toolbar": false,
            "hide_side_toolbar": false,
            "studies": [
                "RSI@tv-basicstudies",
            ],
            "show_popup_button": true,
            "container_id": "tradingview_widget_container",
        });
    }
}

// Update chart view type upon chart mode change
chartViewCheckbox.addEventListener('input', (event) => {
    if (chartViewCheckbox.checked) {
        chartType = 'advanced';
    } else {
        chartType = 'basic';
    }
    displayTradingViewChart();
});