const standingsButton = document.getElementById("trigger-standings")
const gamesButton = document.getElementById("trigger-games")
let standingsFiltered = false;
let gamesFiltered = false;
let playersList = [];
let playersParent = undefined;
let games = []
let gamesParent = undefined;
let currentGameTab = "";

function toggleButtonClass(target, flag) {
    const unclickedClasses = ["bg-white", "hover:bg-gray-100", "text-gray-800"]
    const clickedClasses = ["bg-gray-900", "text-white"]
    if(flag) {
        unclickedClasses.forEach(function(val) {target.classList.remove(val)});
        clickedClasses.forEach(function(val) {target.classList.add(val)});
    } else {
        clickedClasses.forEach(function(val) {target.classList.remove(val)});
        unclickedClasses.forEach(function(val) {target.classList.add(val)});
    }
}

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

setGamesFilter = (flag) => {
    const tabVal = document.querySelector(".cPagination > ul > li > a.active");
    if(!this.gamesList || tabVal != this.currentGameTab) {
        this.gamesList = document.querySelectorAll('.gameContainer');
        this.gamesParent = this.gamesList[0].parentNode;
        this.currentGameTab = tabVal
    }

    const games = this.gamesList;
    const parent = this.gamesParent;

    if(!flag) {
        document.querySelectorAll(".gameContainer").forEach(function(game) {
            players = game.querySelectorAll("td > h6 > a > span")
            if(players && !players[0].classList.contains('flag-IND')
              && !players[1].classList.contains('flag-IND')) {
                game.remove()
            } else {
                game.querySelector("td").style.width = "18px"
            }
        })
    } else {
        games.forEach((game) => parent.appendChild(game))
    }
}

setStandingsFilter = (flag) => {
    if(!this.playersList) {
        this.playersList = document.querySelectorAll('tr.player')
        this.playersParent = this.playersList[0].parentNode
    }
    const players = this.playersList;
    const parent = this.playersParent;

    if(!flag) { 
        players.forEach((player) => player.remove())
        Array.from(players).filter((player) => {
            return player.querySelectorAll('.flag-IND').length
        }).sort(function (a, b) {
            return a.querySelector('td').innerHTML < b.querySelector('td').innerHTML;
        }).forEach(function(indian) {
            parent.appendChild(indian)
        })
    }
    else {
        players.forEach(function(player) {
            parent.appendChild(player)
        })
    }
}

gamesButton.addEventListener("click", async() => {
    const tab = await getCurrentTab();
    toggleButtonClass(gamesButton, !gamesFiltered)
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: setGamesFilter,
        args: [gamesFiltered]
    })
    gamesFiltered = !gamesFiltered
})

standingsButton.addEventListener("click", async() => {
    const tab = await getCurrentTab();
    toggleButtonClass(standingsButton, !standingsFiltered)
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: setStandingsFilter, 
        args: [standingsFiltered]
    })
    standingsFiltered = !standingsFiltered
})
