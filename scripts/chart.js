const CHART_PCT_OF_REMAIN_VIEWPORT = 0.9;

// The TradingView widget is exposed by the TradingView CDN (src in HTML file)
function displayTradingViewChart() {
    if (chartType === 'basic') {
        new TradingView.MediumWidget(
            {
                "symbols": [
                    [
                        `${selectedCoin}|1D`,
                    ]
                ],
                "chartOnly": true,
                "width": "1300",
                "height": "800",
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
            "width": Math.round((document.documentElement.clientWidth - chatViewPortWidth) * CHART_PCT_OF_REMAIN_VIEWPORT),
            "height": Math.round(document.documentElement.clientHeight * CHART_PCT_OF_REMAIN_VIEWPORT),
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