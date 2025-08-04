

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
const socket = io('https://somen-spirits-server.onrender.com/');
// 

var myTeam = []
var otherTeam = []

var myUID = parseInt(getCookie("uid"))
var myUsername = getCookie("myUsername")

var isConductor = false

var BATTLE_ID = getCookie("BATTLE_ID")

var cursor = document.getElementById('targetCursor');
var checkCursor = document.getElementById('checkCursor');


var battling = true

var mode = "normal"

var pinned = -1

// Determine the conductor and initialize battle
function set_up() {
    console.log(myUsername)

    const randomSong = Math.floor(Math.random() * songs.length);
    const path = "./audios/music/battleBGMs/" + songs[randomSong];
    document.getElementById("bgm").src = path;


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

    document.getElementById("soultSelect").style.display = "none"
    document.getElementById("cancelSoult").style.display = "none"
    document.getElementById("purifySelect").style.display = "none"
    document.getElementById("cancelPurify").style.display = "none"

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

    document.getElementById("pokeDamageButton").style.display = "none"
    document.getElementById("pokeSoulButton").style.display = "none"


    document.getElementById("myGuard0").style.display = "none"
    document.getElementById("myGuard1").style.display = "none"
    document.getElementById("myGuard2").style.display = "none"
    document.getElementById("otherGuard0").style.display = "none"
    document.getElementById("otherGuard1").style.display = "none"
    document.getElementById("otherGuard2").style.display = "none"

    document.getElementById("soultCharge").style.display = "none"
    document.getElementById("soultimateBG").style.display = "none"

    document.getElementById("pokeDamageCharge").style.display = "none"
    document.getElementById("pokeSoulCharge").style.display = "none"

    document.getElementById("yokaiThumbnail").style.display = "none"
    document.getElementById("chargedLabel").style.display = "none"

    document.getElementById("minigameTypeLabel").style.display = "none"
    document.getElementById("minigameTypeInput").style.display = "none"

    document.getElementById("oneSoult").style.display = "none"
    document.getElementById("twoSoult").style.display = "none"
    document.getElementById("threeSoult").style.display = "none"

    document.getElementById("onePurify").style.display = "none"
    document.getElementById("twoPurify").style.display = "none"
    document.getElementById("threePurify").style.display = "none"

    document.getElementById("soultimateVideo").style.display = "none"

    document.getElementById("alertMessage").style.display = "none"

    socket.emit("determine_conductor", myUID, BATTLE_ID)
}


socket.on('is_conductor', (data) => {
    isConductor = data.isConductor
    socket.emit('initialize_battle', myUID, BATTLE_ID, isConductor)
})

// Get starting data from server
socket.on('initialize_data', (data) => {
    myTeam = data.myTeam
    otherTeam = data.otherTeam
    myOG = data.myOG

    document.getElementById("pro0").max = myTeam[0]["hp"]
    document.getElementById("pro1").max = myTeam[1]["hp"]
    document.getElementById("pro2").max = myTeam[2]["hp"]
    document.getElementById("pro3").max = myTeam[3]["hp"]
    document.getElementById("pro4").max = myTeam[4]["hp"]
    document.getElementById("pro5").max = myTeam[5]["hp"]

    refreshDisplays()
    cursor.style.display = "none"
    checkCursor.style.display = "none"

    setTimeout(ping_server, 5000)
});

function refreshDisplays() {
    rotatable.style.transform = 'rotate(' + 0 + 'rad)';
    document.getElementById("wheelBG").style.transform = 'rotate(' + 0 + 'rad)';
    document.getElementById("wheelLines").style.transform = 'rotate(' + 0 + 'rad)';
    rotation = 0

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

    document.getElementById("soulStatus0").style.display = "none"
    document.getElementById("soulStatus1").style.display = "none"
    document.getElementById("soulStatus2").style.display = "none"
    document.getElementById("soulStatus3").style.display = "none"
    document.getElementById("soulStatus4").style.display = "none"
    document.getElementById("soulStatus5").style.display = "none"

    document.getElementById("mySoul0").value = myTeam[0]["soul"]
    document.getElementById("mySoul1").value = myTeam[1]["soul"]
    document.getElementById("mySoul2").value = myTeam[2]["soul"]

    document.getElementById("pro0").max = myTeam[0]["hp"]
    document.getElementById("pro1").max = myTeam[1]["hp"]
    document.getElementById("pro2").max = myTeam[2]["hp"]
    document.getElementById("pro3").max = myTeam[3]["hp"]
    document.getElementById("pro4").max = myTeam[4]["hp"]
    document.getElementById("pro5").max = myTeam[5]["hp"]

    for (var i = 0; i < myTeam.length; i++) {
        document.getElementById("slot" + (i + 1)).src = YOKAI_DATABASE[myTeam[i]["code"]]["medal"]
    }

    for (var i = 0; i < 3; i++) {

        if ( myTeam[i]["guard"] < 1 ) {
            document.getElementById("myGuard" + i).style.display = "block"
        } else {
            document.getElementById("myGuard" + i).style.display = "none"
        }
    }

    for (var i = 0; i < 3; i++) {
        if ( otherTeam[i]["guard"] < 1 ) {
            document.getElementById("otherGuard" + i).style.display = "block"
        } else {
            document.getElementById("otherGuard" + i).style.display = "none"
        }
    }


    for (var i = 0; i < 3; i++) {
        if ( otherTeam[i]["charging"] == "chargING" ) {
            document.getElementById("otherCharge" + i).style.display = "block"
        } else {
            document.getElementById("otherCharge" + i).style.display = "none"
        }
    }

    for (var i = 0; i < 3; i++) {
        if ( myTeam[i]["loafing"] ) {
            document.getElementById("myLoaf" + i).style.display = "block"
        } else {
            document.getElementById("myLoaf" + i).style.display = "none"
        }
    }

    for (var i = 0; i < 3; i++) {
        if ( otherTeam[i]["loafing"] ) {
            document.getElementById("otherLoaf" + i).style.display = "block"
        } else {
            document.getElementById("otherLoaf" + i).style.display = "none"
        }
    }

    for (var i = 0; i < myTeam.length; i++) {
        if ( myTeam[i]["soul"] >= 100 && myTeam[i]["currentHP"] > 0) {
            document.getElementById("soulStatus" + i).style.display = "block"
            document.getElementById("soulStatus" + i).src = "./images/battle/soultimateReady.png"
        }

        
        if (i == 0 && mode == "zero" && myTeam[i]["currentHP"] > 0) {
            if ( myTeam[5]["soul"] >= 100 && myTeam[1]["soul"] >= 100) {
                document.getElementById("soulStatus" + i).src = "./images/battle/mSkillReady.png"
            }
        }else if (i == 5 && mode == "zero" && myTeam[i]["currentHP"] > 0) {
            if ( myTeam[0]["soul"] >= 100 && myTeam[4]["soul"] >= 100) {
                document.getElementById("soulStatus" + i).src = "./images/battle/mSkillReady.png"
            }
        } else if (i > 0 && i < 5 && myTeam[i]["currentHP"] > 0) {
            if ( myTeam[i + 1]["soul"] >= 100 && myTeam[i - 1]["soul"] >= 100 && mode == "zero") {
                document.getElementById("soulStatus" + i).src = "./images/battle/mSkillReady.png"
            }
        }
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
        document.getElementById("pro" + i).value = myTeam[i]["currentHP"]
    }

    for ( var i = 0; i < myTeam.length; i++ ) {
        document.getElementById("soul" + i).value = myTeam[i]["soul"]
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
            document.getElementById("slot" + (i + 1)).src = "./images/battle/Spirit.webp"
            if ( i == chargingIDX ) {
                document.getElementById("chargedLabel").style.display = "none"
                document.getElementById("soultimateBG").style.display = "none"
                document.getElementById("yokaiThumbnail").style.display = "none"
                document.getElementById("minigameTypeLabel").style.display = "none"
                document.getElementById("minigameTypeInput").style.display = "none"
                document.getElementById("soultCharge").style.display = "none"

                chargingIDX = -1
                soultProgress = 0
            }

            
        }
    }

    for ( var i = 0; i < otherTeam.length; i++ ) {
        if ( otherTeam[i]["currentHP"] <= 0 && i == pinned - 1) {
  
            socket.emit("pinned", BATTLE_ID, myUID, -1)
            pinned = -1
            document.getElementById("pin0").style.display = "none"
            document.getElementById("pin1").style.display = "none"
            document.getElementById("pin2").style.display = "none"
            
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
    if ( isConductor && battling ) {
        socket.emit("next_turn", BATTLE_ID)
    }
    
    if ( battling ) {
        setTimeout(ping_server, 5000)
    }
    
}

var checkDisconnect

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
    if (inSoult) return;
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

    

    var r = Math.round(rotation / step)

    if ( battling ) {
        socket.emit("rotate_wheel", BATTLE_ID, myUID, r)
    }
    
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

    if (data.downUID == myUID) {
        rotation += Math.PI;
        rotatable.style.transform = 'rotate(' + rotation + 'rad)';
    }
    
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
    location.href = "./matchmaking.html"
}

var inSoult = false
var inPurify = false

function selectSoultimate() {
    if ( inSoult ){
        document.getElementById("toggleMid").style.display = "block"
        document.getElementById("soultSelect").style.display = "none"
        document.getElementById("cancelSoult").style.display = "none"

        document.getElementById("oneSoult").style.display = "none"
        document.getElementById("twoSoult").style.display = "none"
        document.getElementById("threeSoult").style.display = "none"

        document.getElementById("chargedLabel").style.display = "none"
        document.getElementById("soultimateBG").style.display = "none"
        document.getElementById("yokaiThumbnail").style.display = "none"

        document.getElementById("soultCharge").style.display = "none"


        inSoult = false
    } else if (!checking && !targetting && !inPurify) {
        document.getElementById("toggleMid").style.display = "none"
        document.getElementById("soultSelect").style.display = "block"
        document.getElementById("cancelSoult").style.display = "block"

        document.getElementById("oneSoult").style.display = "block"
        document.getElementById("twoSoult").style.display = "block"
        document.getElementById("threeSoult").style.display = "block"
        inSoult = true
    }
    
}

var pendingPin = false
var checking = false

function showInfo(side, kai) {

    if (targetting && !otherTeam[kai].down && side == "other") {
        pendingPin = kai + 1
    } else if ((targetting && otherTeam[kai].down) || !(side == "other")) {
        pendingPin = false
    }
    var apRange

    if ( checking ) {
        document.getElementById("infoDisplay").style.display = "block";
        if (side == "my") {
            apRange = getRangeAP(myTeam[kai].code)
            document.getElementById("nameLabel").innerHTML = "Name: " + myTeam[kai].displayName + " | Tribe: " + YOKAI_DATABASE[myTeam[kai].code].tribe;
            document.getElementById("hpLabel").innerHTML = "HP: " + Math.floor(myTeam[kai].currentHP / myTeam[kai].hp * 100) + "%";
            document.getElementById("inspiritsLabel").innerHTML = "Active inspirits: <br>"
            for (var i = 0; i < myTeam[kai]["currentInspirits"].length; i++ ) {
                document.getElementById("inspiritsLabel").innerHTML += INSPIRIT_DATABASE[myTeam[kai]["currentInspirits"][i]["code"]]["displayBuff"] + "<br>"
            }
        } else {
            apRange = getRangeAP(otherTeam[kai].code)
            document.getElementById("nameLabel").innerHTML = "Name: " + otherTeam[kai].displayName + " | Tribe: " + YOKAI_DATABASE[otherTeam[kai].code].tribe;
            document.getElementById("hpLabel").innerHTML = "HP: " + Math.floor(otherTeam[kai].currentHP / otherTeam[kai].hp * 100) + "%";

            document.getElementById("inspiritsLabel").innerHTML = "Active inspirits: <br>"
            for (var i = 0; i < otherTeam[kai]["currentInspirits"].length; i++ ) {
                document.getElementById("inspiritsLabel").innerHTML += INSPIRIT_DATABASE[otherTeam[kai]["currentInspirits"][i]["code"]]["displayBuff"] + "<br>"
            }
        }
    } else {
        document.getElementById("infoDisplay").style.display = "none";
    }
    
}

var pokeIDX
var inPoke = false

function selectTarget() {
    if (pendingPin && otherTeam[pendingPin - 1]["currentHP"] > 0 && mode == "normal" && targetting) {
        pinned = pendingPin
        document.getElementById("pin0").style.display = "none"
        document.getElementById("pin1").style.display = "none"
        document.getElementById("pin2").style.display = "none"
        document.getElementById("pin" + (pinned - 1)).style.display = "block"

        socket.emit("pinned", BATTLE_ID, myUID, pinned - 1)
    } else if ( pendingPin && otherTeam[pendingPin - 1]["currentHP"] > 0 && mode == "zero" && !inPoke && targetting) {

        var canPoke = false

        for ( var i = 0; i < otherTeam[pendingPin - 1]["currentInspirits"].length; i++ ){
            if ( otherTeam[pendingPin - 1]["currentInspirits"][i]["type"] == "negative" ) {
                canPoke = true
                break
            }
        }

        if ( otherTeam[pendingPin - 1]["poked"] ) {
            canPoke = false
        }

        if ( canPoke ) {
            pokeIDX = pendingPin - 1
            inPoke = true
            startPoke()
            toggleTarget()
        }
    }
}

var targetting = false

var offsetX = window.innerWidth * 0.04
var offsetY = window.innerHeight * 0.07

var offsetXInfo = window.innerWidth * 0.1
var offsetYInfo = window.innerHeight * 0.1

function toggleTarget() {
    if (targetting) {
        cursor.style.display = "none"
        checkCursor.style.display = "none"
        document.getElementById("mainBody").style.cursor = "auto"

        document.getElementById("otherHP0").style.display = "none"
        document.getElementById("otherHP1").style.display = "none"
        document.getElementById("otherHP2").style.display = "none"
        document.getElementById("otherName0").style.display = "none"
        document.getElementById("otherName1").style.display = "none"
        document.getElementById("otherName2").style.display = "none"



        targetting = false
    } else {
        if ( mode == "zero" ) {
            cursor.src = "./images/battle/pokeCursor.png"
        } else {
            cursor.src = "./images/battle/targetCursor.png"
        }
        cursor.style.display = "block"
        checkCursor.style.display = "none"
        targetting = true

        document.getElementById("otherHP0").style.display = "block"
        document.getElementById("otherHP1").style.display = "block"
        document.getElementById("otherHP2").style.display = "block"
        document.getElementById("otherName0").style.display = "block"
        document.getElementById("otherName1").style.display = "block"
        document.getElementById("otherName2").style.display = "block"



        document.getElementById("mainBody").style.cursor = "none"
    }

}


function hideInfo() {
    document.getElementById("infoDisplay").style.display = "none";
}

document.addEventListener('mousemove', function(e) {
    cursor.style.left = e.pageX - offsetX + 'px';
    cursor.style.top = e.pageY - offsetY + 'px';

    checkCursor.style.left = e.pageX - offsetX + 'px';
    checkCursor.style.top = e.pageY - offsetY + 'px';


    document.getElementById("infoDisplay").style.left = e.pageX - offsetXInfo + 'px';
    document.getElementById("infoDisplay").style.top = e.pageY - offsetYInfo + 'px';
});

function calcSPD(code, ivSPD, evSPD, gpSPD) {
  var part1 = parseFloat(YOKAI_DATABASE[code][`spdB`]) - parseFloat(YOKAI_DATABASE[code][`spdA`]) + parseFloat(ivSPD)
  var part2 = (part1 * 59) / 98
  var part3 = YOKAI_DATABASE[code][`spdA`] + part2
  var part4 = Math.floor(part3 + (parseFloat(evSPD) * (61 / 198)))
  part4 += (parseFloat(gpSPD * 5))
  return part4
} //Needs to be properly ported!!!

function rangeAP(sentSPD) {
  var SPD = sentSPD
  var AP = -1
  if (SPD <= 170) {
    AP = Math.floor((369 - Math.floor(SPD / 3) * 3))
  } else if (SPD <= 200) {
    AP = Math.floor((198 - Math.floor((SPD - 171) / 5) * 3))
  } else if (SPD <= 500) {
    AP = Math.floor((180 - Math.floor((SPD - 201) / 10) * 3))
  }

  return AP
} //Needs to be properly ported!!!

function getRangeAP(code) {
  var lowSPD = calcSPD(code, 0, 0, 0)
  var highSPD = calcSPD(code, 20, 26, 5)
  var lowAP = rangeAP(lowSPD)
  var highAP = rangeAP(highSPD)

  var finalRange = [lowAP, highAP]
  return finalRange
} //Needs to be properly ported!!!

function calcAP(sentSPD, sentMod) {

  var calculatedAP = -1

  if (sentSPD <= 170) {
    calculatedAP = Math.floor((369 - Math.floor(sentSPD / 3) * 3) * sentMod)
  } else if (sentSPD <= 200) {
    calculatedAP = Math.floor((198 - Math.floor((sentSPD - 171) / 5) * 3) * sentMod)
  } else if (sentSPD <= 500) {
    calculatedAP = Math.floor((180 - Math.floor((sentSPD - 201) / 10) * 3) * sentMod)
  }

  return calculatedAP
}

var soultProgress = 0
var chargingIDX = -1

function startSoult(idx) {
    if ( (myTeam[idx]["soul"] >= 100) && (myTeam[idx]["currentHP"] >= 0) ) {
        chargingIDX = idx
        socket.emit("start_soult", BATTLE_ID, myUID, idx)
        document.getElementById("soultCharge").style.display = "block"
        document.getElementById("soultimateBG").style.display = "block"

        document.getElementById("minigameTypeLabel").style.display = "block"
        document.getElementById("minigameTypeInput").style.display = "block"


        document.getElementById("cancelSoult").style.display = "none"
        document.getElementById("soultSelect").style.display = "none"

        document.getElementById("oneSoult").style.display = "none"
        document.getElementById("twoSoult").style.display = "none"
        document.getElementById("threeSoult").style.display = "none"
        document.getElementById("yokaiThumbnail").style.display = "block"

        document.getElementById("yokaiThumbnail").src = YOKAI_DATABASE[myTeam[idx]["code"]]["frontIdle"]
    

        minigameType()
        soultProgress = 0
        document.getElementById("soultCharge").value = 0
    }
}

var toType = ""

function minigameType() {
    var possibleTypes = []

    for ( const [key, value] of Object.entries(YOKAI_DATABASE) ) {
        possibleTypes.push(value["displayName"])
    }

    toType = possibleTypes[Math.floor(Math.random() * possibleTypes.length)]

    document.getElementById("minigameTypeLabel").innerHTML = "Type: \n" + toType
    
}

function minigameTypeSubmit() {
    if (document.getElementById("minigameTypeInput").value == toType) {
        soultProgress += 33
        document.getElementById("soultCharge").value = soultProgress
        document.getElementById("minigameTypeInput").value = ""
        if (soultProgress >= 98 && inSoult){
            castSoult()
        }else if (soultProgress >= 98 && inPurify) {
            purifyYokai()
        }else{
            minigameType()
        }
        
    }
}

function castSoult(){
    document.getElementById("minigameTypeLabel").style.display = "none"
    document.getElementById("minigameTypeInput").style.display = "none"
    document.getElementById("soultCharge").style.display = "none"

    document.getElementById("chargedLabel").style.display = "block"

    socket.emit("cast_soult", BATTLE_ID, myUID, chargingIDX, mode)
}

// Turn advanced
socket.on('soultimate_used', (data) => {
    myTeam = data.myTeam
    otherTeam = data.otherTeam

    soultKey = data.soult

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
    document.getElementById("chargedLabel").style.display = "none"
    document.getElementById("soultimateBG").style.display = "none"
    document.getElementById("yokaiThumbnail").style.display = "none"

    document.getElementById("soultCharge").style.display = "none"



    document.getElementById("soultimateVideo").style.display = "block"
    if ( data.moxieBuff > 1 ) {
        document.getElementById("soultimateVideo").src = SOULTIMATE_DATABASE[soultKey]["videoMoxie"]
    } else {
        document.getElementById("soultimateVideo").src = SOULTIMATE_DATABASE[soultKey]["video"]
    }
    
    if ( SOULTIMATE_DATABASE[soultKey]["video"] != "./videos/battle/soultimateVideos/______.mp4" && SOULTIMATE_DATABASE[soultKey]["videoMoxie"] != "./videos/battle/soultimateVideos/______.mp4" ) {
        document.getElementById("soultimateVideo").play()
    }
    

    inSoult = false

    
});

document.getElementById('soultimateVideo').addEventListener('ended',myHandler,false);

function myHandler(e) {
    document.getElementById("soultimateVideo").style.display = "none"
}

var chatting = false

function setChatting(isChatting) {
    chatting = isChatting
}

function toggleCheck() {
    checking = !checking
    cursor.style.display = "none"

    if ( checking ) {
        checkCursor.style.display = "block"
    } else {
        checkCursor.style.display = "none"
    }
}

socket.on('chat_approved', (data) => {

    var newMessage = document.createElement("p")
    newMessage.innerHTML = "<em style = 'color :rgb(130, 195, 255);' >" + myUsername + ":</em> <em style = 'color:rgb(0, 75, 145)'>" + document.getElementById("messageInput").value
    document.getElementById("chatBox").appendChild(newMessage)

    document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight


    socket.emit("send_chat", BATTLE_ID, myUID, document.getElementById("messageInput").value)
    document.getElementById("messageInput").value = ""
})

socket.on('chat_denied', (data) => {

    var newMessage = document.createElement("p")
    newMessage.innerHTML = "<em style = 'color : rgb(255, 0, 0);' > " + "Your message was blocked. Please make sure it is appropriate."
    document.getElementById("chatBox").appendChild(newMessage)
    document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight
    
})

socket.on('chat_received', (data) => {

    var newMessage = document.createElement("p")
    newMessage.innerHTML = "<em style = 'color : rgb(255, 118, 147);' > " + data.username + "</em>: <em style = 'color:rgb(144, 52, 118)'>" + data.contents
    document.getElementById("chatBox").appendChild(newMessage)
    document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight
})

document.onkeydown = function keyDetected(e) {
    if (e.key == "Enter") {
        if (chatting) {

            socket.emit("validate_chat", BATTLE_ID, myUID, document.getElementById("messageInput").value)
            
        }
    }
}

function toggleWatch() {
    if ( inPoke ) {
        return
    }
    
    if ( mode == "normal") {
        mode = "zero"
        document.getElementById("wheelMid").src = "./images/battle/wheelMidHexagonMoxie.png"
        document.getElementById("soultimateButton").src = "./images/battle/mSkillButton.png"
        document.getElementById("targetButton").src = "./images/battle/pokeButton.png"
        refreshDisplays()
    } else {
        mode = "normal"
        document.getElementById("wheelMid").src = "./images/battle/wheelMidHexagon.png"
        document.getElementById("soultimateButton").src = "./images/battle/soultimateButtonNew.png"
        document.getElementById("targetButton").src = "./images/battle/targetButtonNew.png"
        refreshDisplays()
    }
    
}

var purifyIDX

function togglePurify() {

    if ( inPurify ){
        document.getElementById("toggleMid").style.display = "block"
        document.getElementById("purifySelect").style.display = "none"
        document.getElementById("cancelPurify").style.display = "none"

        document.getElementById("onePurify").style.display = "none"
        document.getElementById("twoPurify").style.display = "none"
        document.getElementById("threePurify").style.display = "none"

        inPurify = false
    } else if (!checking && !targetting && !inSoult) {
        document.getElementById("toggleMid").style.display = "none"
        document.getElementById("purifySelect").style.display = "block"
        document.getElementById("cancelPurify").style.display = "block"

        document.getElementById("onePurify").style.display = "block"
        document.getElementById("twoPurify").style.display = "block"
        document.getElementById("threePurify").style.display = "block"
        inPurify = true
    }
    
}


function startPurify(idx) {
    if ( ( myTeam[idx]["currentInspirits"].length > 0 ) && (myTeam[idx]["currentHP"] >= 0) ) {
        purifyIDX = idx

        document.getElementById("soultCharge").style.display = "block"
        document.getElementById("soultimateBG").style.display = "block"

        document.getElementById("minigameTypeLabel").style.display = "block"
        document.getElementById("minigameTypeInput").style.display = "block"


        document.getElementById("cancelPurify").style.display = "none"
        document.getElementById("purifySelect").style.display = "none"

        document.getElementById("onePurify").style.display = "none"
        document.getElementById("twoPurify").style.display = "none"
        document.getElementById("threePurify").style.display = "none"
        document.getElementById("yokaiThumbnail").style.display = "block"

        document.getElementById("yokaiThumbnail").src = YOKAI_DATABASE[myTeam[idx]["code"]]["frontIdle"]
    

        minigameType()
        purifyProgress = 0
        document.getElementById("soultCharge").value = 0
    }
}

function purifyYokai() {

    socket.emit("purify_yokai", BATTLE_ID, myUID, purifyIDX)
    

    document.getElementById("chargedLabel").style.display = "none"
    document.getElementById("soultimateBG").style.display = "none"
    document.getElementById("yokaiThumbnail").style.display = "none"
    document.getElementById("soultCharge").style.display = "none"

    document.getElementById("minigameTypeLabel").style.display = "none"
    document.getElementById("minigameTypeInput").style.display = "none"

}

socket.on('yokai_purified', (data) => {

    var newMessage = document.createElement("p")
    newMessage.innerHTML = data.chatMessage
    document.getElementById("chatBox").appendChild(newMessage)

    document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight

})

var pokeDamageCharge = 0
var pokeSoulCharge = 0


function startPoke() {
    document.getElementById("soultimateBG").style.display = "block"
    document.getElementById("yokaiThumbnail").style.display = "block"
    cursor.style.display = "none"
    document.getElementById("yokaiThumbnail").src = YOKAI_DATABASE[otherTeam[pokeIDX]["code"]]["frontIdle"]

    pokeDamageCharge = 0
    pokeSoulCharge = 0

    document.getElementById("pokeDamageCharge").style.display = "block"
    document.getElementById("pokeSoulCharge").style.display = "block"

    document.getElementById("pokeDamageButton").style.display = "block"
    document.getElementById("pokeSoulButton").style.display = "block"

    document.getElementById("pokeDamageCharge").value = 0
    document.getElementById("pokeSoulCharge").value = 0

    document.getElementById("pokeDamageButton").style.left = (Math.floor(Math.random() * 36) + 32) + "vmin"
    document.getElementById("pokeDamageButton").style.top = (Math.floor(Math.random() * 24) + 62) + "vmin"

    document.getElementById("pokeSoulButton").style.left = (Math.floor(Math.random() * 36) + 32) + "vmin"
    document.getElementById("pokeSoulButton").style.top = (Math.floor(Math.random() * 24) + 62) + "vmin"
}


function pokeDamage() {
    pokeDamageCharge += 5
    document.getElementById("pokeDamageCharge").value = pokeDamageCharge

    if ( pokeDamageCharge >= 100 ) {
        socket.emit("poke_damage", BATTLE_ID, myUID, pokeIDX)


        inPoke = false
        document.getElementById("soultimateBG").style.display = "none"
        document.getElementById("yokaiThumbnail").style.display = "none"
        document.getElementById("pokeDamageCharge").style.display = "none"
        document.getElementById("pokeSoulCharge").style.display = "none"

        document.getElementById("pokeDamageButton").style.display = "none"
        document.getElementById("pokeSoulButton").style.display = "none"
    }
}

function pokeSoul() {
    pokeSoulCharge += 5
    document.getElementById("pokeSoulCharge").value = pokeSoulCharge

    if ( pokeSoulCharge >= 100 ) {
        socket.emit("poke_soul", BATTLE_ID, myUID, pokeIDX)
        
        inPoke = false
        document.getElementById("soultimateBG").style.display = "none"
        document.getElementById("yokaiThumbnail").style.display = "none"
        document.getElementById("pokeDamageCharge").style.display = "none"
        document.getElementById("pokeSoulCharge").style.display = "none"

        document.getElementById("pokeDamageButton").style.display = "none"
        document.getElementById("pokeSoulButton").style.display = "none"
    }
}

socket.on('yokai_poked_damage', (data) => {

    var newMessage = document.createElement("p")
    newMessage.innerHTML = data.chatMessage
    document.getElementById("chatBox").appendChild(newMessage)

    document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight

    refreshDisplays()
})

socket.on('yokai_poked_soul', (data) => {

    var newMessage = document.createElement("p")
    newMessage.innerHTML = data.chatMessage
    document.getElementById("chatBox").appendChild(newMessage)

    document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight

    refreshDisplays()
})

function serverGameLost() {
    document.getElementById("alertMessage").style.display = "block"
    document.getElementById("alertMessage").style.animation = "fadeIn 1s"
}


socket.on('opponent_disconnected', (data) => {

    document.getElementById("alertMessage").style.display = "block"
    document.getElementById("alertMessage").style.animation = "fadeIn 1s"

    document.getElementById("alertText1").innerHTML = "Your opponent disconnected... Click anywhere to return to matchmaking."
})