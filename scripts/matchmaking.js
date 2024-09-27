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
    UID = document.getElementById("usernameInput").value
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

var searching = false
var pinging = false

var intervalID

function startMatchmaking() {
    for(var i = 0; i < teams[currentTeam].length; i++){
        teams[currentTeam][i].UID = UID
    }
    if (!document.getElementById("usernameInput").value) {
        alert("No username! Please enter a username!")
    } else {
        var isValid = validateTeam(teams[currentTeam])
        if (isValid == "valid") {
            username = document.getElementById("usernameInput").value
            document.getElementById("matchmakingMenu").style.display = "block"
            document.getElementById("matchmakingMenu").style.animation = "fadeIn 0.5s"
            document.getElementById("bgm").src = "./audios/music/matchmaking.mp3"
            document.getElementById("bgm").play()
            document.getElementById("bgm").currentTime = 0;

            searching = true
            pinging = true
            setInterval(sendPing, Math.random() * 10000 + 5000)
        } else {
            alert("Team validation failed! Here are the problems: " + isValid)
        }
    }
}

function validateTeam(sentTeam) {
    var problems = []

    console.log("Validating team...")
    console.log(sentTeam)
    console.log(teams[currentTeam])

    for (var i = 1; i < sentTeam.length; i++) {
        var yokai = sentTeam[i]
        console.log(yokai.displayName)
        yokai.UID = UID

        var totalIVs = parseInt(yokai.ivHP) + parseInt(yokai.ivSTR) + parseInt(yokai.ivSPR) + parseInt(yokai.ivDEF) + parseInt(yokai.ivSPD)
        var totalEVs = parseInt(yokai.evHP) + parseInt(yokai.evSTR) + parseInt(yokai.evSPR) + parseInt(yokai.evDEF) + parseInt(yokai.evSPD)

        if (40 - totalIVs < 0) {
            problems.push(" " + yokai.displayName + " has too many IVs!")
        }
        if (26 - totalEVs < 0) {
            problems.push(" " + yokai.displayName + " has too many EVs!")
        }

        var noGP = 0
        var statsCAPS = ["STR", "SPR", "DEF", "SPD"]
        
        for (var j = 0; j < 4; j++) {
            if (yokai["gp" + statsCAPS[j]] > 0) {
                noGP += 1
            }
            if (yokai["gp" + statsCAPS[j]] > 5) {
                problems.push(" " + yokai.displayName + " has too many GP in " + statsCAPS[i] + "! (Max is 5)")
            }
        }
        
        if (noGP > 1) {
            problems.push(" " + yokai.displayName + " has multiple stats with gp boosts!")
        }
        
    }

    if (problems.length == 0) {
        return "valid"
    } else {
        return problems
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
}

var UID = "UID error LOL"
    //"" + (Math.floor(Math.random() * 10000))

var pubnub = new PubNub({
    publishKey: 'pub-c-fb886fc2-4f06-4160-ad01-d1389c03aeac',
    subscribeKey: 'sub-c-9baf1ae9-df96-468a-97b3-b8f13b04e96f',
    userId: UID
});


var channel = 'matchmaking';
pubnub.subscribe({ channels: [channel] });


var connectUID = 0
var connectTeam = []
var connectUsername = ""
var looking = true

function switchBattle() {
    location.href = "/battle.html"
}

// Add a listener to a channel and subscribe to it
pubnub.addListener({
    message: function(m) {
        if (searching) {
            console.log("Ping from " + m.message.username + " of type " + m.message.type + " with UID " + m.message.UID + " and my UID is " + UID)
            if (m.message.type == "request" && !(m.message.UID == UID) && looking) {
                console.log(username + " receieved a request from " + m.message.username + "!")
                console.log(username + " Returning...")
                pinging = false
                pubnub.publish({
                    channel: channel,
                    message: {
                        type: "return",
                        UID: UID,
                        toConnect: m.message.UID,
                        team: teams[currentTeam],
                        username: username,
                    }
                })
            } else if (m.message.type == "return") {
                if (m.message.toConnect == UID  && looking) {
                    looking = false
                    console.log(username + " Got return from " + m.message.username + "!")
                    console.log(username + " Confirming to " + m.message.username + "!")
                    connectUID = m.message.UID
                    connectTeam = m.message.team
                    connectUsername = m.message.username
                    var connectChannel = "battleChannel" + (Math.floor(Math.random() * 1000))
                    pubnub.publish({
                        channel: channel,
                        message: {
                            type: "confirm",
                            UID: UID,
                            sentTeam: teams[currentTeam],
                            username: document.getElementById("usernameInput").value,
                            toConnect: m.message.UID,
                            newChannel: connectChannel
                        }
                    })
                    document.getElementById("lookingText").innerHTML = m.username + " wants to battle! Confirming..."
                    document.cookie = `otherTeam=${JSON.stringify(connectTeam)}`
                    document.cookie = `otherUID=${JSON.stringify(connectUID)}`
                    document.cookie = `otherUsername=${JSON.stringify(connectUsername)}`
                    document.cookie = `battleChannel=${connectChannel}`
                    document.cookie = `myTeam=${JSON.stringify(teams[currentTeam])}`
                    document.cookie = `myUsername=${JSON.stringify(username)}`
                    document.cookie = `myUID=${JSON.stringify(UID)}`
                }
            } else if (m.message.type == "confirm") {
                if (m.message.toConnect == UID) {
                    looking = false
                    console.log(username + " Confirmed for " + m.message.username + "!")
                    console.log(username + " Ready!")
                    connectUID = m.message.UID
                    connectTeam = m.message.sentTeam
                    connectUsername = m.message.username
                    pubnub.publish({
                        channel: channel,
                        message: {
                            type: "ready",
                            username: username,
                            toConnect: m.message.UID
                        }
                    })
                    document.getElementById("lookingText").innerHTML = "<em>" + m.message.username + "   </em> accepted your battle! Get ready!"
                    document.cookie = `otherTeam=${JSON.stringify(connectTeam)}`
                    document.cookie = `otherUID=${JSON.stringify(connectUID)}`
                    document.cookie = `otherUsername=${JSON.stringify(connectUsername)}`
                    document.cookie = `battleChannel=${m.message.newChannel}`
                    document.cookie = `myTeam=${JSON.stringify(teams[currentTeam])}`
                    document.cookie = `myUsername=${JSON.stringify(username)}`
                    document.cookie = `myUID=${UID}`
                    pubnub.unsubscribe({ channels: [channel] });
                    setTimeout(switchBattle, 5000)
                } else if(looking) {
                    console.log(username + " was rejected by " + m.message.username + "!")
                    pinging = true
                }
            } else if (m.message.type == "ready") {
                if (m.message.toConnect == UID) {
                    document.getElementById("lookingText").innerHTML = "<em>" + m.message.username + "   </em> confirmed! Get ready!"
                    pubnub.unsubscribe({ channels: [channel] });
                    setTimeout(switchBattle, 5000)
                }
            }
        }
    }
});



function sendPing() {
    if (pinging) {
        console.log("Sent request ping!")
        pubnub.publish({
            channel: channel,
            message: {
                type: "request",
                UID: UID,
                username: username,
            },
        });
    }
}

