//Cookie retreival
function getCookie(name) {
    let cookieArr = document.cookie.split(";");

    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");

        if (name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }

    // Return null if the cookie by name does not exist
    return null;
}

//DO NOT CHANGE THIS LINK UNLESS YOU KNOW WHAT YOU ARE DOING!!!
//YOU WILL BE CONNECTING TO A 3RD PARTY SERVER
//I AM NOT RESPONSIBLE FOR ANYTHING THAT HAPPENS BY USING AN UNOFFICIAL SERVER
const socket = io('https://somen-spirits-server.glitch.me');

var teams = []
var currentTeam = 0
var username = ""

function intoFinished() {
    document.getElementById("padTrans").style.display = "none";
}

function clearBattle() {
    console.log("Battle cleared!")
    document.cookie = "myTeam=none"
    document.cookie = "myUsername=none"
    document.cookie = "otherTeam=none"
    document.cookie = "otherUsername=none"
    document.cookie = "battleChannel=none"
}

const songs = ["Harrisville.mp3", "Springdale.mp3", "Blossom.mp3", "SoAlone.mp3", "Uptown.mp3", "SanFantastico.mp3", "OldHarrisville.mp3", "Sakura.mp3"]

function toggleMusic() {
    var musicToggle = getCookie("BGMute")
    if (musicToggle == "true") {
        document.getElementById("toggleMusic").src = "./images/musicOFF.png";
        document.getElementById("bgm").volume = 0.0;
        document.cookie = "BGMute=false";

    } else {
        document.getElementById("toggleMusic").src = "./images/musicON.png";
        document.getElementById("bgm").volume = 0.5;
        document.cookie = "BGMute=true";
    }
}

function updateUsername() {
    console.log("Username update")
    
    document.cookie = `username=${document.getElementById("usernameInput").value}`;
}

function hidePad() {
    clearBattle()
    document.getElementById("matchmakingMenu").style.display = "none"
    teams = JSON.parse(localStorage.getItem("teams"))
    if (teams) {
        refreshTeamList()
    } else {
        alert("You have no teams! Go make at least one in the teambuilder!")
        location.href = "./";
    }
    document.getElementById("padTrans").style.animation = "fadeOut 1s";
    const randomSong = Math.floor(Math.random() * songs.length);
    const path = "./audios/music/" + songs[randomSong];
    document.getElementById("bgm").src = path;

    var musicToggle = getCookie("BGMute")
    username = getCookie("username")
    UID = username
    if (!(username == null)) {
        document.getElementById("usernameInput").value = username
    }

    console.log(musicToggle)
    if (musicToggle == "true") {
        document.getElementById("toggleMusic").src = "./images/musicON.png";
        document.getElementById("bgm").volume = 0.5;

    } else if (musicToggle == "false") {
        document.getElementById("toggleMusic").src = "./images/musicOFF.png";
        document.getElementById("bgm").volume = 0.0;
    } else {
        document.getElementById("toggleMusic").src = "./images/musicON.png";
        document.getElementById("bgm").volume = 0.5;
        document.cookie = "BGMute=true";
    }

    document.getElementById("bgm").play()


    setTimeout(intoFinished, 1000)
}

function actuallySwitchHome() {
    location.href = "./";
}

function switchHome() {
    document.getElementById("padTrans").style.display = "block";
    document.getElementById("padTrans").style.animation = "fadeIn 1s";
    setTimeout(actuallySwitchHome, 1000)
}

function switchBattle() {
    location.href = "./battle.html"
}

function loadTeam() {
    currentTeam = document.getElementById("teamSelect").selectedIndex
}


function refreshTeamList() {
    document.getElementById("teamSelect").innerHTML = ""
    for (var i = 0; i < teams.length; i++) {
        var addOption = document.createElement("option");
        addOption.innerHTML = teams[i][0];
        document.getElementById("teamSelect").appendChild(addOption)
    }
}

document.getElementById("bgm").addEventListener("ended", function() {
    document.getElementById("bgm").currentTime = 0;
    const randomSong = Math.floor(Math.random() * songs.length);
    const path = "./audios/music/" + songs[randomSong];
    document.getElementById("bgm").src = path;
    document.getElementById("bgm").play()
});

function startMatchmaking() {
    console.log(teams[currentTeam])
    UID = Math.floor( Math.random() * 1000)
    document.cookie = `uid=${UID}`;
    for(var i = 0; i < teams[currentTeam].length; i++){
        teams[currentTeam][i].UID = UID
    }
    if (!document.getElementById("usernameInput").value) {
        alert("No username! Please enter a username!")
    } else {
        socket.emit('lfg', UID, teams[currentTeam], document.getElementById("usernameInput").value)
    }
}



function hideMatchmaking() {
    document.getElementById("matchmakingMenu").style.display = "none"
}

function cancelMatchmaking() {
    document.getElementById("matchmakingMenu").style.animation = "fadeOut 1s"
    document.getElementById("bgm").currentTime = 0;
    const randomSong = Math.floor(Math.random() * songs.length);
    const path = "./audios/music/" + songs[randomSong];
    document.getElementById("bgm").src = path;
    document.getElementById("bgm").play()
    pinging = false
    setTimeout(hideMatchmaking, 1000)

    socket.emit("cancel_lfg", UID)
}

var UID = "UID error LOL"
    //"" + (Math.floor(Math.random() * 10000))




// Handle receiving messages
socket.on('lfg_validity', (data) => {
    if(data == "valid"){
        document.getElementById("matchmakingMenu").style.display = "block"
        document.getElementById("matchmakingMenu").style.animation = "fadeIn 0.5s"
        document.getElementById("bgm").src = "./audios/music/matchmaking.mp3"
        document.getElementById("bgm").play()
        document.getElementById("bgm").currentTime = 0;
    }else{
        alert("Team validation failed! Here are the problems: " + data)
    }
});


// Opponent found
socket.on('lfg_found', (data) => {
    document.getElementById("lookingText").innerHTML = "<em>" + data.username + "</em> would like to battle!"
    document.cookie = `oUsername=${data.username}`;
    document.cookie = `BATTLE_ID=${data.BATTLE_ID}`;
    
    setTimeout(switch_battle, 3000)
});

function switch_battle() {
    location.href = "./battle.html"
    
}
