export const home = function home() {
    return `
        <div class="bannerWrapper">
        <select class="coin-selection" id="coinSelection"> </select>
        <h1 class="livePrice" id="livePrice"> </h1>
        <div class="fullDayData" id="fullDayData"> </div>

        <!-- Rounded switch -->
        <div class="chartTypeWrapper">
            <label class="chartViewButtonLabel"> Chart Mode </label>
            <label class="switch" id="chartViewType">
                <input type="checkbox" id="chartTypeSelection">
                <span class="slider round"></span>
            </label>
        </div>

        <div class="clock" id="clock"> </div>
    </div>


    <div class="mainWrapper">
        <div id="tradingViewChart"> <!-- Chart will be added here --> </div>
        <form class="chatWrapper" id="chatForm">
            <div class="chat" id="chat"> </div>
            <input type="text" class="messageToSend" id="messageToSend">
            <button type="submit" id="sendMessageButton"> Send message </button>
        </form>
    </div>

    <table class="cryptoTable" id="cryptoTable">
        <tr>
            <th> Ticker </th>
            <th> Price </th>
            <th> 24hr Low </th>
            <th> 24hr High </th>
            <th> Change </th>
        </tr>
    </table>
    <div class="loadingTable" id="loadingTable"> Loading... </div>
    `
}