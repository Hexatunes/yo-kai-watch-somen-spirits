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
const songs = ["battle1.mp3", "battle2.mp3", "battle3.mp3", "battle4.mp3", "battle5.mp3", "battle6.mp3", "battle7.mp3"]

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

document.getElementById("bgm").addEventListener("ended", function() {
    document.getElementById("bgm").currentTime = 0;
    const randomSong = Math.floor(Math.random() * songs.length);
    const path = "./audios/music/battleBGMs/" + songs[randomSong];
    document.getElementById("bgm").src = path;
    document.getElementById("bgm").play()
});

//DO NOT CHANGE THIS LINK UNLESS YOU KNOW WHAT YOU ARE DOING!!!
//YOU WILL BE CONNECTING TO A 3RD PARTY SERVER
//I AM NOT RESPONSIBLE FOR ANYTHING THAT HAPPENS BY USING AN UNOFFICIAL SERVER
const socket = io('https://somen-spirits-server.glitch.me');

var myTeam = []
var otherTeam = []

var myUID = parseInt(getCookie("uid"))
var otherUsername = parseInt(getCookie("oUsername"))

var isConductor = false

var BATTLE_ID = getCookie("BATTLE_ID")

var cursor = document.getElementById('targetCursor');

var battling = true

function hideTransition() {
    document.getElementById("enterBattle").style.display = "none"
}

// Determine the conductor and initialize battle
function set_up() {
    const randomSong = Math.floor(Math.random() * songs.length);
    const path = "./audios/music/battleBGMs/" + songs[randomSong];
    document.getElementById("bgm").src = path;

    document.getElementById("enterBattle").play()
    document.getElementById("enterBattle").style.animation = "fadeOut 1.4s"
    document.getElementById("enterBattle").volume = 0.0
    setTimeout(hideTransition, 1000)

    var musicToggle = getCookie("BGMute")

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

    document.getElementById("pin0").style.display = "none"
    document.getElementById("pin1").style.display = "none"
    document.getElementById("pin2").style.display = "none"
    document.getElementById("results").style.display = "none"
    document.getElementById("switchingText").style.display = "none"
    document.getElementById("switchTimer").style.display = "none"
    document.getElementById("switchCooldown").style.display = "none"
    document.getElementById("infoDisplay").style.display = "none";
    document.getElementById("allDown").style.display = "none"

    document.getElementById("myPosInsp0").style.display = "none"
    document.getElementById("myPosInsp1").style.display = "none"
    document.getElementById("myPosInsp2").style.display = "none"
    document.getElementById("otherPosInsp0").style.display = "none"
    document.getElementById("otherPosInsp1").style.display = "none"
    document.getElementById("otherPosInsp2").style.display = "none"

    document.getElementById("myNegInsp0").style.display = "none"
    document.getElementById("myNegInsp1").style.display = "none"
    document.getElementById("myNegInsp2").style.display = "none"
    document.getElementById("otherNegInsp0").style.display = "none"
    document.getElementById("otherNegInsp1").style.display = "none"
    document.getElementById("otherNegInsp2").style.display = "none"

    socket.emit("determine_conductor", myUID, BATTLE_ID)
}


socket.on('is_conductor', (data) => {
    isConductor = data.isConductor
    console.log(data.isConductor)
    socket.emit('initialize_battle', myUID, BATTLE_ID, isConductor)
})

// Get starting data from server
socket.on('initialize_data', (data) => {
    myTeam = data.myTeam
    otherTeam = data.otherTeam
    myOG = data.myOG

    refreshDisplays()
    cursor.style.display = "none"

    setTimeout(ping_server, 2000)
});

function refreshDisplays() {
    console.log(myTeam)

    document.getElementById("myPosInsp0").style.display = "none"
    document.getElementById("myPosInsp1").style.display = "none"
    document.getElementById("myPosInsp2").style.display = "none"
    document.getElementById("otherPosInsp0").style.display = "none"
    document.getElementById("otherPosInsp1").style.display = "none"
    document.getElementById("otherPosInsp2").style.display = "none"

    document.getElementById("myNegInsp0").style.display = "none"
    document.getElementById("myNegInsp1").style.display = "none"
    document.getElementById("myNegInsp2").style.display = "none"
    document.getElementById("otherNegInsp0").style.display = "none"
    document.getElementById("otherNegInsp1").style.display = "none"
    document.getElementById("otherNegInsp2").style.display = "none"

    document.getElementById("mySoul0").value = myTeam[0]["soul"]
    document.getElementById("mySoul1").value = myTeam[1]["soul"]
    document.getElementById("mySoul2").value = myTeam[2]["soul"]

    for (var i = 0; i < myTeam.length; i++) {
        document.getElementById("slot" + (myTeam[i]["order"])).src = YOKAI_DATABASE[myTeam[i]["code"]]["medal"]
    }

    for (var i = 0; i < 3; i++) {
        var posCount = 0
        var negCount = 0

        var currentInspirits =  myTeam[i]["currentInspirits"]

        for (var x = 0; x < currentInspirits.length; x++) {
            if ( currentInspirits[x]["type"] == "positive" ) {
                posCount++
            } else {
                negCount++
            }
        }

        if ( posCount > 0 ) {
            document.getElementById("myPosInsp" + i).style.display = "block"
        }

        if ( negCount > 0 ) {
            document.getElementById("myNegInsp" + i).style.display = "block"
        }
    }

    for (var i = 0; i < 3; i++) {
        var posCount = 0
        var negCount = 0

        var currentInspirits =  otherTeam[i]["currentInspirits"]

        for (var x = 0; x < currentInspirits.length; x++) {
            if ( currentInspirits[x]["type"] == "positive" ) {
                posCount++
            } else {
                negCount++
            }
        }

        if ( posCount > 0 ) {
            document.getElementById("otherPosInsp" + i).style.display = "block"
        }

        if ( negCount > 0 ) {
            document.getElementById("otherNegInsp" + i).style.display = "block"
        }
    }

    document.getElementById("myHP0").max = myTeam[0].hp
    document.getElementById("myHP1").max = myTeam[1].hp
    document.getElementById("myHP2").max = myTeam[2].hp

    document.getElementById("otherHP0").max = otherTeam[0].hp
    document.getElementById("otherHP1").max = otherTeam[1].hp
    document.getElementById("otherHP2").max = otherTeam[2].hp

    document.getElementById("myHP0").value = myTeam[0].currentHP
    document.getElementById("myHP1").value = myTeam[1].currentHP
    document.getElementById("myHP2").value = myTeam[2].currentHP

    document.getElementById("otherHP0").value = otherTeam[0].currentHP
    document.getElementById("otherHP1").value = otherTeam[1].currentHP
    document.getElementById("otherHP2").value = otherTeam[2].currentHP

    for ( var i = 0; i < myTeam.length; i++ ) {
        document.getElementById("pro" + (myTeam[i]["order"] - 1)).value = myTeam[i]["currentHP"]
    }

    for ( var i = 0; i < myTeam.length; i++ ) {
        document.getElementById("soul" + (myTeam[i]["order"] - 1)).value = myTeam[i]["soul"]
    }

    document.getElementById("myName0").innerHTML = myTeam[0]["displayName"]
    document.getElementById("myName1").innerHTML = myTeam[1]["displayName"]
    document.getElementById("myName2").innerHTML = myTeam[2]["displayName"]

    document.getElementById("otherName0").innerHTML = otherTeam[0]["displayName"]
    document.getElementById("otherName1").innerHTML = otherTeam[1]["displayName"]
    document.getElementById("otherName2").innerHTML = otherTeam[2]["displayName"]

    document.getElementById("myYokai0").src = YOKAI_DATABASE[myTeam[0]["code"]]["backIdle"]
    document.getElementById("myYokai1").src = YOKAI_DATABASE[myTeam[1]["code"]]["backIdle"]
    document.getElementById("myYokai2").src = YOKAI_DATABASE[myTeam[2]["code"]]["backIdle"]

    document.getElementById("otherYokai0").src = YOKAI_DATABASE[otherTeam[0]["code"]]["frontIdle"]
    document.getElementById("otherYokai1").src = YOKAI_DATABASE[otherTeam[1]["code"]]["frontIdle"]
    document.getElementById("otherYokai2").src = YOKAI_DATABASE[otherTeam[2]["code"]]["frontIdle"]

    //Update wheel for fainted Yokai
    for ( var i = 0; i < myTeam.length; i++ ) {
        if ( myTeam[i]["currentHP"] <= 0 ) {
            document.getElementById("slot" + (myTeam[i]["order"])).src = "./images/battle/Spirit.webp"
        }
    }

    //Update field for fainted Yokai
    if ( myTeam[0]["currentHP"] <= 0 ) {
        document.getElementById("myYokai0").src = "./images/battle/Spirit.webp"
    }

    if ( myTeam[1]["currentHP"] <= 0 ) {
        document.getElementById("myYokai1").src = "./images/battle/Spirit.webp"
    }

    if ( myTeam[2]["currentHP"] <= 0 ) {
        document.getElementById("myYokai2").src = "./images/battle/Spirit.webp"
    }


    if ( otherTeam[0]["currentHP"] <= 0 ) {
        document.getElementById("otherYokai0").src = "./images/battle/Spirit.webp"
    }

    if ( otherTeam[1]["currentHP"] <= 0 ) {
        document.getElementById("otherYokai1").src = "./images/battle/Spirit.webp"
    }

    if ( otherTeam[2]["currentHP"] <= 0 ) {
        document.getElementById("otherYokai2").src = "./images/battle/Spirit.webp"
    }
}

function ping_server() {
    if ( isConductor ) {
        console.log(BATTLE_ID)
        socket.emit("next_turn", BATTLE_ID)
    }
    
    if ( battling ) {
        setTimeout(ping_server, 2000)
    }
    
}

// Turn advanced
socket.on('turn_advanced', (data) => {
    myTeam = data.myTeam
    otherTeam = data.otherTeam

    if ( data.crits > 0 ){
        var newMessage = document.createElement("p")
        newMessage.innerHTML = "<em id = 'damage'> Critical hit(s): " + data.crits
        document.getElementById("chatBox").appendChild(newMessage)
        document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight
    }

    if ( data.misses > 0 ){
        var newMessage = document.createElement("p")
        newMessage.innerHTML = "<em id = 'tech'> Miss(es): " + data.misses
        document.getElementById("chatBox").appendChild(newMessage)
        document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight
    }
    

    var newMessage = document.createElement("p")
    newMessage.innerHTML = data.chatMessage
    document.getElementById("chatBox").appendChild(newMessage)
    document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight

    refreshDisplays()
});




// JavaScript
var rotatable = document.getElementById('wheelViewport');
var dragging = false;
var rotation = 0;
var initialAngle, currentAngle;
var centerX, centerY;
var step = Math.PI / 3; // 60 degrees in radians

function calculateAngle(e) {
    var dx = e.clientX - centerX;
    var dy = e.clientY - centerY;
    return Math.atan2(dy, dx);
}

document.addEventListener('mousemove', function(e) {
    if (!dragging) return;
    currentAngle = calculateAngle(e);
    rotation = currentAngle - initialAngle;
    rotatable.style.transform = 'rotate(' + rotation + 'rad)';
    document.getElementById("wheelBG").style.transform = 'rotate(' + rotation + 'rad)';
    document.getElementById("wheelLines").style.transform = 'rotate(' + rotation + 'rad)';
});

document.addEventListener('mouseup', function() {
    dragging = false;
    // Snap to the nearest step
    rotation = Math.round(rotation / step) * step;
    rotatable.style.transform = 'rotate(' + rotation + 'rad)';
    document.getElementById("wheelBG").style.transform = 'rotate(' + rotation + 'rad)';
    document.getElementById("wheelLines").style.transform = 'rotate(' + rotation + 'rad)';

    var r = 0
    
    if (rotation < 0) {
        r = Math.floor((2 * Math.PI) - (rotation % (2 * (Math.PI))))
    } else {
        r = Math.floor(Math.abs(rotation) % (2 * (Math.PI)))
    }

    socket.emit("rotate_wheel", BATTLE_ID, myUID, r)

    console.log(rotation, currentAngle, initialAngle)
    

});

rotatable.addEventListener('mousedown', function(e) {
    dragging = true;
    //document.getElementById("switchTimer").style.display = "block"
    var rect = rotatable.getBoundingClientRect();
    centerX = rect.left + rect.width / 2;
    centerY = rect.top + rect.height / 2;
    initialAngle = calculateAngle(e) - rotation;

    
});

// Wheels updated
socket.on('update_teams', (data) => {
    myTeam = data.myTeam
    otherTeam = data.otherTeam

    refreshDisplays()
});

// Wheels updated
socket.on('front_fainted', (data) => {
    myTeam = data.myTeam
    otherTeam = data.otherTeam

    rotation += Math.PI;
    rotatable.style.transform = 'rotate(' + rotation + 'rad)';
    
    refreshDisplays()
});


socket.on('victory', (data) => {
    battling = false
    document.getElementById("bgm").src = "audios/music/Victory.mp3"
    document.getElementById("bgm").play()
    document.getElementById("results").style.display = "block"
    document.getElementById("resultsImage").src = "images/battle/victory.webp"
    document.getElementById("resultsImage").style.display = "block"
});


socket.on('defeat', (data) => {
    battling = false
    document.getElementById("bgm").src = "audios/music/Defeat.mp3"
    document.getElementById("bgm").play()
    document.getElementById("results").style.display = "block"
    document.getElementById("resultsImage").src = "images/battle/defeat.webp"
    document.getElementById("resultsImage").style.display = "block"
});

function backToMatchmaking() {
    location.href = "/matchmaking.html"
}