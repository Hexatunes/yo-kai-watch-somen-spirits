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

function weightedRandom(options) {
    let i, sum = 0, r = Math.random();
    for (i in options) {
        sum += options[i];
        if (r <= sum) return i;
    }
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

var turnIDX = 0

var myTeam = [];
var otherTeam = [];

let myCurrent = [];
let otherCurrent = [];

let turnOrder = [];


var myUsername = "";
var otherUsername = "";
var myUID = getCookie("myUID")
var otherUID = getCookie("otherUID")

var myReady = false;
var otherReady = false;

var checkInterval
var countingDown = false


var cursor = document.getElementById('targetCursor');

function calcSPD(code, ivSPD, evSPD, gpSPD) {
    var part1 = parseFloat(YOKAI_DATABASE[code][`spdB`]) - parseFloat(YOKAI_DATABASE[code][`spdA`]) + parseFloat(ivSPD)
    var part2 = (part1 * 59) / 98
    var part3 = YOKAI_DATABASE[code][`spdA`] + part2
    var part4 = Math.floor(part3 + (parseFloat(evSPD) * (61 / 198)))
    part4 += (parseFloat(gpSPD * 5))
    return part4
}

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
}

function getRangeAP(code) {
    var lowSPD = calcSPD(code, 0, 0, 0)
    var highSPD = calcSPD(code, 20, 26, 5)
    var lowAP = rangeAP(lowSPD)
    var highAP = rangeAP(highSPD)

    var finalRange = [lowAP, highAP]
    return finalRange
}

var pendingPin

function showInfo(side, kai) {
    if (targetting && !otherCurrent[kai].down && side == "other") {
        pendingPin = kai + 1
        return
    } else if ((targetting && otherCurrent[kai].down) || !(side == "other")) {
        pendingPin = false
        return
    }
    var apRange
    document.getElementById("infoDisplay").style.display = "block";
    if (side == "my") {
        apRange = getRangeAP(myCurrent[kai].code)
        document.getElementById("nameLabel").innerHTML = "Name: " + myCurrent[kai].displayName + " | Tribe: " + YOKAI_DATABASE[myCurrent[kai].code].tribe;
        document.getElementById("hpLabel").innerHTML = "HP: " + Math.floor(myCurrent[kai].currentHP / myCurrent[kai].hp * 100) + "%";
        document.getElementById("fireLabel").innerHTML = "Fire Res: " + YOKAI_DATABASE[myCurrent[kai].code].fire
        document.getElementById("waterLabel").innerHTML = "Water Res: " + YOKAI_DATABASE[myCurrent[kai].code].water
        document.getElementById("lightningLabel").innerHTML = "Lightning Res: " + YOKAI_DATABASE[myCurrent[kai].code].lightning
        document.getElementById("earthLabel").innerHTML = "Earth Res: " + YOKAI_DATABASE[myCurrent[kai].code].earth
        document.getElementById("windLabel").innerHTML = "Wind Res: " + YOKAI_DATABASE[myCurrent[kai].code].wind
        document.getElementById("iceLabel").innerHTML = "Ice Res: " + YOKAI_DATABASE[myCurrent[kai].code].ice
        document.getElementById("apLabel").innerHTML = "AP Range: " + apRange[0] + " to " + apRange[1]
    } else {
        apRange = getRangeAP(otherCurrent[kai].code)
        document.getElementById("nameLabel").innerHTML = "Name: " + otherCurrent[kai].displayName + " | Tribe: " + YOKAI_DATABASE[otherCurrent[kai].code].tribe;
        document.getElementById("hpLabel").innerHTML = "HP: " + Math.floor(otherCurrent[kai].currentHP / otherCurrent[kai].hp * 100) + "%";
        document.getElementById("fireLabel").innerHTML = "Fire Res: " + YOKAI_DATABASE[otherCurrent[kai].code].fire
        document.getElementById("waterLabel").innerHTML = "Water Res: " + YOKAI_DATABASE[otherCurrent[kai].code].water
        document.getElementById("lightningLabel").innerHTML = "Lightning Res: " + YOKAI_DATABASE[otherCurrent[kai].code].lightning
        document.getElementById("earthLabel").innerHTML = "Earth Res: " + YOKAI_DATABASE[otherCurrent[kai].code].earth
        document.getElementById("windLabel").innerHTML = "Wind Res: " + YOKAI_DATABASE[otherCurrent[kai].code].wind
        document.getElementById("iceLabel").innerHTML = "Ice Res: " + YOKAI_DATABASE[otherCurrent[kai].code].ice
        document.getElementById("apLabel").innerHTML = "AP Range: " + apRange[0] + " to " + apRange[1]
    }
}

function hideInfo() {
    document.getElementById("infoDisplay").style.display = "none";
}


function setUp() {
    document.getElementById("pin0").style.display = "none"
    document.getElementById("pin1").style.display = "none"
    document.getElementById("pin2").style.display = "none"
    document.getElementById("results").style.display = "none"
    document.getElementById("switchingText").style.display = "none"
    document.getElementById("switchTimer").style.display = "none"
    document.getElementById("switchCooldown").style.display = "none"
    document.getElementById("infoDisplay").style.display = "none";
    document.getElementById("allDown").style.display = "none"
    otherTeam = getCookie("otherTeam")
    if (otherTeam == "none" || !otherTeam) {
        alert("Error! Data failed to load or you're not in a battle! Data received: " + otherTeam)
        location.href = "./matchmaking.html"
    }

    myTeam = JSON.parse(getCookie("myTeam"))

    otherTeam = JSON.parse(getCookie("otherTeam"))
    console.log(myTeam)
    console.log(otherTeam)

    myTeam.splice(0, 1)
    otherTeam.splice(0, 1)
    

    for (var i = 0; i < myTeam.length; i++) {
        for(var x = 0; x < myTeam[i]["items"].length; x++){
            console.log(myTeam[i]["items"][x])
        }
        myTeam[i].currentHP = myTeam[i].hp
        
    }

    for (var i = 0; i < otherTeam.length; i++) {
        otherTeam[i].currentHP = otherTeam[i].hp
    }

    for (var i = 0; i < myTeam.length; i++) {
        myCurrent.push(myTeam[i])
    }

    for (var i = 0; i < otherTeam.length; i++) {
        otherCurrent.push(otherTeam[i])
    }

    document.getElementById("myHP0").max = myCurrent[0].hp
    document.getElementById("myHP1").max = myCurrent[1].hp
    document.getElementById("myHP2").max = myCurrent[2].hp

    document.getElementById("otherHP0").max = otherCurrent[0].hp
    document.getElementById("otherHP1").max = otherCurrent[1].hp
    document.getElementById("otherHP2").max = otherCurrent[2].hp

    document.getElementById("pro0").max = myCurrent[0].hp
    document.getElementById("pro1").max = myCurrent[1].hp
    document.getElementById("pro2").max = myCurrent[2].hp
    document.getElementById("pro3").max = myCurrent[3].hp
    document.getElementById("pro4").max = myCurrent[4].hp
    document.getElementById("pro5").max = myCurrent[5].hp

    refreshDisplays()


    myUsername = JSON.parse(getCookie("myUsername"))
    otherUsername = JSON.parse(getCookie("otherUsername"))

    pubnub.subscribe({ channels: [getCookie("battleChannel")] });
    console.log("Subscribed to channel: " + getCookie("battleChannel"))

    myUID = parseInt(myUID.replace(/"/g, ''), 10)
    console.log("My UID: " + myUID)

    for (var i = 0; i < myTeam.length; i++) {
        document.getElementById("slot" + (i + 1)).src = YOKAI_DATABASE[myTeam[i]["code"]]["medal"]
    }



    cursor.style.display = "none"

    document.getElementById("myName0").innerHTML = myTeam[0]["displayName"]
    document.getElementById("myName1").innerHTML = myTeam[1]["displayName"]
    document.getElementById("myName2").innerHTML = myTeam[2]["displayName"]

    document.getElementById("otherName0").innerHTML = otherTeam[0]["displayName"]
    document.getElementById("otherName1").innerHTML = otherTeam[1]["displayName"]
    document.getElementById("otherName2").innerHTML = otherTeam[2]["displayName"]

    document.getElementById("myYokaiLeft").src = YOKAI_DATABASE[myCurrent[5]["code"]]["backIdle"]
    document.getElementById("myYokai0").src = YOKAI_DATABASE[myCurrent[0]["code"]]["backIdle"]
    document.getElementById("myYokai1").src = YOKAI_DATABASE[myCurrent[1]["code"]]["backIdle"]
    document.getElementById("myYokai2").src = YOKAI_DATABASE[myCurrent[2]["code"]]["backIdle"]
    document.getElementById("myYokaiRight").src = YOKAI_DATABASE[myCurrent[3]["code"]]["backIdle"]

    document.getElementById("otherYokaiLeft").src = YOKAI_DATABASE[otherCurrent[5]["code"]]["frontIdle"]
    document.getElementById("otherYokai0").src = YOKAI_DATABASE[otherCurrent[0]["code"]]["frontIdle"]
    document.getElementById("otherYokai1").src = YOKAI_DATABASE[otherCurrent[1]["code"]]["frontIdle"]
    document.getElementById("otherYokai2").src = YOKAI_DATABASE[otherCurrent[2]["code"]]["frontIdle"]
    document.getElementById("otherYokaiRight").src = YOKAI_DATABASE[otherCurrent[3]["code"]]["frontIdle"]



    const randomSong = Math.floor(Math.random() * songs.length);
    const path = "./audios/music/battleBGMs/" + songs[randomSong];
    document.getElementById("bgm").src = path;


    for (var i = 0; i < otherTeam.length; i++) {
        document.getElementById("opreload" + i).src = YOKAI_DATABASE[otherCurrent[i]["code"]]["frontIdle"]
    }

    for (var i = 0; i < myTeam.length; i++) {
        document.getElementById("mpreload" + i).src = YOKAI_DATABASE[myCurrent[i]["code"]]["backIdle"]
    }



    var musicToggle = getCookie("BGMute")

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

    myReady = true;

    console.log("I'm ready!")

    checkInterval = setInterval(function() {
        if (myReady && otherReady && !countingDown) {
            countdown()
        }
        pubnub.publish({
            channel: getCookie("battleChannel"),
            message: {
                type: "ready",
                UID: "" + myUID,
            }
        })
    }, 1000)
}

function countdown() {
    countingDown = true
    for (let i = 0; i <= 6; i++) {
        setTimeout(function() {
            if (i == 0) {
                if (myUID > parseInt(otherUID.replace(/"/g, ''), 10)) {
                    turnOrder = [myCurrent[0], myCurrent[1], myCurrent[2], otherCurrent[0], otherCurrent[1], otherCurrent[2]]
                    console.log("Before mods: ")
                    console.log(turnOrder)
                    console.log(myCurrent)
                    console.log(otherCurrent)
                } else {
                    turnOrder = [otherCurrent[0], otherCurrent[1], otherCurrent[2], myCurrent[0], myCurrent[1], myCurrent[2]]
                    console.log("Before mods: ")
                    console.log(turnOrder)
                    console.log(myCurrent)
                    console.log(otherCurrent)
                }
                document.getElementById("startText").innerHTML = "Get ready!"
            } else {
                document.getElementById("startText").innerHTML = (6 - i) + "..."
            }
            if (i == 6) {
                if (myUID > parseInt(otherUID.replace(/"/g, ''), 10)) {
                    console.log("My UID is higher. Calculating APs...")
                    let randMod0 = Math.round((Math.random() * 0.1 + 0.5) * 100) / 100
                    let randMod1 = Math.round((Math.random() * 0.1 + 0.5) * 100) / 100
                    let randMod2 = Math.round((Math.random() * 0.1 + 0.5) * 100) / 100
                    let randMod3 = Math.round((Math.random() * 0.1 + 0.5) * 100) / 100
                    let randMod4 = Math.round((Math.random() * 0.1 + 0.5) * 100) / 100
                    let randMod5 = Math.round((Math.random() * 0.1 + 0.5) * 100) / 100
                    //console.log(randMod0)
                    //console.log(randMod1)
                    //console.log(randMod2)
                    //console.log(randMod3)
                    //console.log(randMod4)
                    //console.log(randMod5)

                    pubnub.publish({
                        channel: getCookie("battleChannel"),
                        message: {
                            type: "endMod",
                            sentMod0: "" + randMod0,
                            sentMod1: "" + randMod1,
                            sentMod2: "" + randMod2,
                            sentMod3: "" + randMod3,
                            sentMod4: "" + randMod4,
                            sentMod5: "" + randMod5,
                            UID: "" + myUID
                        }
                    })

                    calcAP(0, randMod0)
                    calcAP(1, randMod1)
                    calcAP(2, randMod2)
                    calcAP(3, randMod3)
                    calcAP(4, randMod4)
                    calcAP(5, randMod5)
                    console.log("After mods: ")
                    refreshOrder()
                    console.log(turnOrder)

                    if (parseInt(turnOrder[0].UID.replace(/"/g, ''), 10) == myUID) {
                        console.log("* It's my turn! " + turnIDX)
                        setTimeout(function() {
                            advanceTurn()
                        }, 1000)
                    }else{
                        console.log("* Not my turn. Waiting for opponent. " + turnIDX)
                    }
                } else {
                    console.log("My UID is lower. Waiting for APs.")
                }
                document.getElementById("switchCooldown").style.display = "block"
                document.getElementById("cooldownCount").innerHTML = "10"

                for (let j = 0; j <= 3; j++) {
                    setTimeout(function() {
                        document.getElementById("cooldownCount").innerHTML = 3 - j
                        if (j == 3) {
                            document.getElementById("switchCooldown").style.display = "none"
                        }
                    }, 1000 * j)

                    document.getElementById("startMenu").style.display = "none"

                    clearInterval(checkInterval)
                }
            }


        }, i * 1000)
    }

}

var yourInput = document.getElementById('targetButton');
yourInput.addEventListener('mouseup', function() {
    this.classList.add('fadeIn'); /* Add the fadeIn class when the mouse button is released */
});
yourInput.addEventListener('transitionend', function() {
    this.classList.remove('fadeIn'); /* Remove the fadeIn class after the transition has completed */
});

var targetting = false



var offsetX = window.innerWidth * 0.03
var offsetY = window.innerHeight * 0.045

var offsetXInfo = window.innerWidth * 0.1
var offsetYInfo = window.innerHeight * 0.1

function toggleTarget() {
    if (targetting) {
        cursor.style.display = "none"
        document.getElementById("mainBody").style.cursor = "auto"

        document.getElementById("otherHP0").style.display = "none"
        document.getElementById("otherHP1").style.display = "none"
        document.getElementById("otherHP2").style.display = "none"
        document.getElementById("otherName0").style.display = "none"
        document.getElementById("otherName1").style.display = "none"
        document.getElementById("otherName2").style.display = "none"



        targetting = false
    } else {
        cursor.style.display = "block"
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

document.addEventListener('mousemove', function(e) {
    cursor.style.left = e.pageX - offsetX + 'px';
    cursor.style.top = e.pageY - offsetY + 'px';
    document.getElementById("infoDisplay").style.left = e.pageX - offsetXInfo + 'px';
    document.getElementById("infoDisplay").style.top = e.pageY - offsetYInfo + 'px';
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

var myYokaiLeft = document.getElementById('myYokaiLeft');
var myYokai0 = document.getElementById('myYokai0');
var myYokai1 = document.getElementById('myYokai1');
var myYokai2 = document.getElementById('myYokai2');
var myYokaiRight = document.getElementById('myYokaiRight');

var otherYokaiLeft = document.getElementById('otherYokaiLeft');
var otherYokai0 = document.getElementById('otherYokai0');
var otherYokai1 = document.getElementById('otherYokai1');
var otherYokai2 = document.getElementById('otherYokai2');
var otherYokaiRight = document.getElementById('otherYokaiRight');


let lastRotation = 0;
var currentFirst = 0;
var saveR = 0;
var lastSave = 0;
var otherR

let currentlyRotating = false;

function syncArrays(r) {
    saveR = r

    if (r < 0) {
        r = Math.floor((2 * Math.PI) - (r % (2 * (Math.PI))))
        otherR = Math.floor((2 * Math.PI) - (Math.abs(r) % (2 * (Math.PI))))
    } else {
        r = Math.floor(Math.abs(r) % (2 * (Math.PI)))
        otherR = r
    }

    console.log("r: " + r)
    console.log("last: " + lastRotation)


    if (r == lastRotation) {
        currentlyRotating = false
    }
    
    if (r == 0) {
        myCurrent = []
        myCurrent.push(myTeam[0])
        myCurrent.push(myTeam[1])
        myCurrent.push(myTeam[2])
        myCurrent.push(myTeam[3])
        myCurrent.push(myTeam[4])
        myCurrent.push(myTeam[5])
        currentFirst = 0
    } else if (r == Math.floor(Math.PI / 3)) {
        myCurrent = []
        myCurrent.push(myTeam[5])
        myCurrent.push(myTeam[0])
        myCurrent.push(myTeam[1])
        myCurrent.push(myTeam[2])
        myCurrent.push(myTeam[3])
        myCurrent.push(myTeam[4])
        currentFirst = 5
    } else if (r == Math.floor(2 * (Math.PI / 3))) {
        myCurrent = []
        myCurrent.push(myTeam[4])
        myCurrent.push(myTeam[5])
        myCurrent.push(myTeam[0])
        myCurrent.push(myTeam[1])
        myCurrent.push(myTeam[2])
        myCurrent.push(myTeam[3])
        currentFirst = 4
    } else if (r == Math.floor(Math.PI)) {
        myCurrent = []
        myCurrent.push(myTeam[3])
        myCurrent.push(myTeam[4])
        myCurrent.push(myTeam[5])
        myCurrent.push(myTeam[0])
        myCurrent.push(myTeam[1])
        myCurrent.push(myTeam[2])
        currentFirst = 3
    } else if (r == Math.floor(4 * (Math.PI / 3))) {
        myCurrent = []
        myCurrent.push(myTeam[2])
        myCurrent.push(myTeam[3])
        myCurrent.push(myTeam[4])
        myCurrent.push(myTeam[5])
        myCurrent.push(myTeam[0])
        myCurrent.push(myTeam[1])
        currentFirst = 2
    } else if (r == Math.floor(5 * (Math.PI / 3))) {
        myCurrent = []
        myCurrent.push(myTeam[1])
        myCurrent.push(myTeam[2])
        myCurrent.push(myTeam[3])
        myCurrent.push(myTeam[4])
        myCurrent.push(myTeam[5])
        myCurrent.push(myTeam[0])
        currentFirst = 1
    }

    


    if (myCurrent[0]["down"] && myCurrent[1]["down"] && myCurrent[2]["down"]) {
        document.getElementById("allDown").style.display = "block"
    } else {
        document.getElementById("allDown").style.display = "none"
    }

    if (myCurrent[5]["down"]) {
        document.getElementById("myYokaiLeft").src = "./images/battle/Spirit.webp"
    } else {
        document.getElementById("myYokaiLeft").src = YOKAI_DATABASE[myCurrent[5]["code"]]["backIdle"]
    }

    if (myCurrent[0]["down"]) {
        document.getElementById("myYokai0").src = "./images/battle/Spirit.webp"
    } else {
        document.getElementById("myYokai0").src = YOKAI_DATABASE[myCurrent[0]["code"]]["backIdle"]
    }

    if (myCurrent[1]["down"]) {
        document.getElementById("myYokai1").src = "./images/battle/Spirit.webp"
    } else {
        document.getElementById("myYokai1").src = YOKAI_DATABASE[myCurrent[1]["code"]]["backIdle"]
    }

    if (myCurrent[2]["down"]) {
        document.getElementById("myYokai2").src = "./images/battle/Spirit.webp"
    } else {
        document.getElementById("myYokai2").src = YOKAI_DATABASE[myCurrent[2]["code"]]["backIdle"]
    }

    if (myCurrent[3]["down"]) {
        document.getElementById("myYokaiRight").src = "./images/battle/Spirit.webp"
    } else {
        document.getElementById("myYokaiRight").src = YOKAI_DATABASE[myCurrent[3]["code"]]["backIdle"]
    }

    console.log(myCurrent)


    document.getElementById("myName0").innerHTML = myCurrent[0]["displayName"]
    document.getElementById("myName1").innerHTML = myCurrent[1]["displayName"]
    document.getElementById("myName2").innerHTML = myCurrent[2]["displayName"]
    refreshDisplays()

    turnOrder = [myCurrent[0], myCurrent[1], myCurrent[2], otherCurrent[0], otherCurrent[1], otherCurrent[2]]
    refreshOrder()


    var direction = saveR - lastSave;
    let diff = Math.abs(otherR - lastRotation)


    pubnub.publish({
        channel: getCookie("battleChannel"),
        message: {
            type: "turnWheel",
            r: r,
            lastRotation: lastRotation,
            UID: "" + myUID
        }
    })



    //console.log("direction: " + direction)
    //console.log("difference: " + diff)


    currentlyRotating = false


    lastSave = saveR
    lastRotation = r

    //console.log(myCurrent)
    document.getElementById("switchCooldown").style.display = "block"
    document.getElementById("cooldownCount").innerHTML = "10"


    for (let i = 0; i <= 3; i++) {
        setTimeout(function() {
            document.getElementById("cooldownCount").innerHTML = 3 - i
            if (i == 3) {
                document.getElementById("switchCooldown").style.display = "none"
            }
        }, 1000 * i)
    }
}

let released = true


rotatable.addEventListener('mousedown', function(e) {
    released = false
    pubnub.publish({
        channel: getCookie("battleChannel"),
        message: {
            type: "draggingWheel",
            UID: "" + myUID
        }
    })
    dragging = true;
    currentlyRotating = true;
    document.getElementById("switchTimer").style.display = "block"
    var rect = rotatable.getBoundingClientRect();
    centerX = rect.left + rect.width / 2;
    centerY = rect.top + rect.height / 2;
    initialAngle = calculateAngle(e) - rotation;

    for (let i = 0; i <= 3; i++) {
        setTimeout(function() {
            if (!released) {
                document.getElementById("timerCount").innerHTML = 3 - i
                if (i == 3) {
                    // You can trigger it like this
                    var event = new MouseEvent('mouseup', {
                        'view': window,
                        'bubbles': true,
                        'cancelable': true
                    });

                    document.dispatchEvent(event);

                    document.getElementById("switchTimer").style.display = "none"
                }
            } else {
                document.getElementById("switchTimer").style.display = "none"
            }
        }, 1000 * i)
    }
});

document.addEventListener('mousemove', function(e) {
    if (!dragging) return;
    currentAngle = calculateAngle(e);
    rotation = currentAngle - initialAngle;
    rotatable.style.transform = 'rotate(' + rotation + 'rad)';
    document.getElementById("wheelBG").style.transform = 'rotate(' + rotation + 'rad)';
    document.getElementById("wheelLines").style.transform = 'rotate(' + rotation + 'rad)';
});

var cRotate = false
var isRotating = false

function canRotate() {
    cRotate = true
}

function noRotate() {
    cRotate = false
}

document.addEventListener('mouseup', function() {
    dragging = false;
    released = true
    // Snap to the nearest step
    rotation = Math.round(rotation / step) * step;
    rotatable.style.transform = 'rotate(' + rotation + 'rad)';
    document.getElementById("wheelBG").style.transform = 'rotate(' + rotation + 'rad)';
    document.getElementById("wheelLines").style.transform = 'rotate(' + rotation + 'rad)';
    console.log(rotation)
    if (cRotate && currentlyRotating) {
        console.log("Finished rotating!")
        syncArrays(rotation)
    }

});

var typing = false

document.onkeydown = function keyDetected(e) {
    if (e.key == "Enter") {
        if (typing) {
            var newMessage = document.createElement("p")
            newMessage.innerHTML = "<em id = 'myMessage'>" + myUsername + ":</em> " + document.getElementById("messageInput").value
            document.getElementById("chatBox").appendChild(newMessage)

            document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight


            pubnub.publish({
                channel: getCookie("battleChannel"),
                message: {
                    type: "userMessage",
                    content: document.getElementById("messageInput").value,
                    UID: "" + myUID
                }
            })
            document.getElementById("messageInput").value = ""
            console.log("Sending your chat message...")
        }
    }
}

function setTyping(toggle) {
    if (toggle == "true") {
        typing = true
    } else {
        typing = false
    }
}

function subtractAP() {
    for (var i = 1; i < turnOrder.length; i++) {
        turnOrder[i].AP -= turnOrder[0].AP
        if (turnOrder[i].AP < 0) {
            turnOrder[i].AP = 0
        }
    }
}

function calcAP(kai, mod) {

    var SPD = turnOrder[kai].spd
    if (SPD <= 170) {
        turnOrder[kai].AP = Math.floor((369 - Math.floor(SPD / 3) * 3) * mod)
    } else if (SPD <= 200) {
        turnOrder[kai].AP = Math.floor((198 - Math.floor((SPD - 171) / 5) * 3) * mod)
    } else if (SPD <= 500) {
        turnOrder[kai].AP = Math.floor((180 - Math.floor((SPD - 201) / 10) * 3) * mod)
    }

    console.log("New AP: " + turnOrder[kai].AP)

    //syncArrays(rotation)
}

function refreshOrder() {
    turnOrder.sort((a, b) => a.AP - b.AP)

}

var pinned = false

function advanceTurn() {
    console.log("Next turn!")



    //for(var i = 0; i < turnOrder.length; i++){
    //console.log(turnOrder[i].displayName + " with AP of " + turnOrder[i].AP)
    //}



    if (!currentlyRotating && parseInt(turnOrder[0].UID.replace(/"/g, ''), 10) == myUID) {

        console.log("deciding")
        // Usage:
        let decisions = {
            "attack": 1,  // 10% chance
            "technique": 0,  // 30% chance
        };

        var choice = weightedRandom(decisions)

        var d2 = 0
        var choiceTargets = []
        if (!otherCurrent[0].down) {
            choiceTargets.push(0)
        }
        if (!otherCurrent[1].down) {
            choiceTargets.push(1)
        }
        if (!otherCurrent[2].down) {
            choiceTargets.push(2)
        }
        var target = -1

        if (pinned) {
            console.log("target exists")
            target = pinned - 1
        } else if (choiceTargets.length > 0) {
            console.log("no target")
            target = choiceTargets[Math.random() * choiceTargets.length | 0]
        } else {
            setTimeout(function() {
                advanceTurn()
            }, 10000)
            return
        }

        if (choice == "attack") {
            for (var i = 0; i < ATTACK_DATABASE[turnOrder[0].na].hits; i++) {


                var bp = ATTACK_DATABASE[turnOrder[0].na].bp
                var element = ATTACK_DATABASE[turnOrder[0].na].element


                d2 += attack(bp, element, target)
            }

            var newMessage = document.createElement("p")
            newMessage.innerHTML = "Your " + turnOrder[0].displayName + " used <em id = 'na'>" + ATTACK_DATABASE[turnOrder[0].na].displayName + "</em> on " + otherCurrent[target].displayName + "! Damage: <em id = 'damage'>" + d2 + "</em> (<em id = 'damage'>" + Math.floor(d2 / otherCurrent[target].hp * 100) + "%</em>)",
                newMessage.setAttribute("class", "systemMessage")
            document.getElementById("chatBox").appendChild(newMessage)

            document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight


            pubnub.publish({
                channel: getCookie("battleChannel"),
                message: {
                    type: "moveAttack",
                    content: "Opponent " + turnOrder[0].displayName + " used <em id = 'na'>" + ATTACK_DATABASE[turnOrder[0].na].displayName + "</em> on " + otherCurrent[target].displayName + "! Damage: <em id = 'damage'>" + d2 + "</em> (<em id = 'damage'>" + Math.floor(d2 / otherCurrent[target].hp * 100) + "%</em>)",
                    UID: "" + myUID,
                    damage: d2,
                    sentTarget: target
                }
            })
        } else if (choice == "technique") {
            if (TECHNIQUE_DATABASE[turnOrder[0].tech].type == "heal") {
                for (var i = 0; i < TECHNIQUE_DATABASE[turnOrder[0].tech].hits; i++) {


                    var bp = TECHNIQUE_DATABASE[turnOrder[0].tech].bp
                    var element = TECHNIQUE_DATABASE[turnOrder[0].tech].element


                    d2 += technique(bp, element, target, TECHNIQUE_DATABASE[turnOrder[0].tech].type)
                }

                var newMessage = document.createElement("p")
                newMessage.innerHTML = "Your " + turnOrder[0].displayName + " used <em id = 'tech'>" + TECHNIQUE_DATABASE[turnOrder[0].tech].displayName + "</em> on " + myCurrent[target].displayName + "! Healed: <em id = 'heal'>" + d2 + "</em> (<em id = 'heal'>" + Math.floor(d2 / myCurrent[target].hp * 100) + "%</em>)",
                    newMessage.setAttribute("class", "systemMessage")
                document.getElementById("chatBox").appendChild(newMessage)

                document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight


                pubnub.publish({
                    channel: getCookie("battleChannel"),
                    message: {
                        type: "moveHeal",
                        content: "Opponent " + turnOrder[0].displayName + " used <em id = 'tech'>" + TECHNIQUE_DATABASE[turnOrder[0].tech].displayName + "</em> on " + myCurrent[target].displayName + "! Healed: <em id = 'heal'>" + d2 + "</em> (<em id = 'heal'>" + Math.floor(d2 / otherCurrent[target].hp * 100) + "%</em>)",
                        UID: "" + myUID,
                        damage: d2,
                        sentTarget: target
                    }
                })
            } else if (TECHNIQUE_DATABASE[turnOrder[0].tech].type == "drain") {
                for (var i = 0; i < TECHNIQUE_DATABASE[turnOrder[0].tech].hits; i++) {


                    var bp = TECHNIQUE_DATABASE[turnOrder[0].tech].bp
                    var element = TECHNIQUE_DATABASE[turnOrder[0].tech].element


                    d2 += technique(bp, element, target, TECHNIQUE_DATABASE[turnOrder[0].tech].type)
                }

                var newMessage = document.createElement("p")
                newMessage.innerHTML = "Your " + turnOrder[0].displayName + " used <em id = 'tech'>" + TECHNIQUE_DATABASE[turnOrder[0].tech].displayName + "</em> on " + otherCurrent[target].displayName + "! Drained: <em id = 'drain'> " + d2 + " Healed: <em id = 'heal'>" + (d2 * 0.25) + "</em> (<em id = 'heal'>" + Math.floor(d2 / myCurrent[target].hp * 100) + "%</em>)",
                    newMessage.setAttribute("class", "systemMessage")
                document.getElementById("chatBox").appendChild(newMessage)

                document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight


                pubnub.publish({
                    channel: getCookie("battleChannel"),
                    message: {
                        type: "moveDrain",
                        content: "Opponent " + turnOrder[0].displayName + " used <em id = 'tech'>" + TECHNIQUE_DATABASE[turnOrder[0].tech].displayName + "</em> on " + otherCurrent[target].displayName + "! Drained: <em id = 'drain'> " + d2 + " Healed: <em id = 'heal'>" + (d2 * 0.25) + "</em> (<em id = 'heal'>" + Math.floor(d2 / myCurrent[target].hp * 100) + "%</em>)",
                        UID: "" + myUID,
                        damage: d2,
                        sentTarget: target
                    }
                })
            } else {
                for (var i = 0; i < TECHNIQUE_DATABASE[turnOrder[0].tech].hits; i++) {


                    var bp = TECHNIQUE_DATABASE[turnOrder[0].tech].bp
                    var element = TECHNIQUE_DATABASE[turnOrder[0].tech].element


                    d2 += technique(bp, element, target, TECHNIQUE_DATABASE[turnOrder[0].tech].type)
                }

                var newMessage = document.createElement("p")
                newMessage.innerHTML = "Your " + turnOrder[0].displayName + " used <em id = 'tech'>" + TECHNIQUE_DATABASE[turnOrder[0].tech].displayName + "</em> on " + otherCurrent[target].displayName + "! Damage: <em id = 'damage'>" + d2 + "</em> (<em id = 'damage'>" + Math.floor(d2 / otherCurrent[target].hp * 100) + "%</em>)",
                    newMessage.setAttribute("class", "systemMessage")
                document.getElementById("chatBox").appendChild(newMessage)

                document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight


                pubnub.publish({
                    channel: getCookie("battleChannel"),
                    message: {
                        type: "moveAttack",
                        content: "Opponent " + turnOrder[0].displayName + " used <em id = 'tech'>" + TECHNIQUE_DATABASE[turnOrder[0].tech].displayName + "</em> on " + otherCurrent[target].displayName + "! Damage: <em id = 'damage'>" + d2 + "</em> (<em id = 'damage'>" + Math.floor(d2 / otherCurrent[target].hp * 100) + "%</em>)",
                        UID: "" + myUID,
                        damage: d2,
                        sentTarget: target
                    }
                })
            }
        }



        refreshDisplays()
        subtractAP()
        calcAP(0, 1)
        console.log(turnOrder)
        refreshOrder()
        turnIDX += 1
        if (parseInt(turnOrder[0].UID.replace(/"/g, ''), 10) == myUID) {
            console.log("* It's my turn! " + turnIDX)
            setTimeout(function() {
                advanceTurn()
            }, 1000)
        }else{
            console.log("* Not my turn. " + turnIDX)
        }
    }else{
        if (parseInt(turnOrder[0].UID.replace(/"/g, ''), 10) == myUID) {
            console.log("* Action failed. Retrying..." + turnIDX)
            setTimeout(function() {
                advanceTurn()
            }, 1000)
        }
    }
    
}

function technique(bp, element, target, type) {
    if (type == "damage") {
        var res = 1
        if (element == "none") {
            res = 1
        } else {
            res = YOKAI_DATABASE[otherCurrent[target].code][element]
        }

        console.log("Res: " + res)

        var randMult = Math.random() * 0.2 + 0.9
        var finalMult = Math.round(randMult * 100) / 100 //Use this- not randMult!

        var d1 = Math.floor(((turnOrder[0].spr / 2) + (bp / 2) - (otherCurrent[target].def / 4)) * finalMult * res * otherCurrent[target].guard)



        otherCurrent[target].currentHP -= d1

        if (otherCurrent[target].currentHP <= 0) {
            document.getElementById("otherYokai" + target).src = "./images/battle/Spirit.webp"
            wheelClean()
            otherCurrent[target].down = true
            if ((pinned - 1) == target) {
                pinned = false
                document.getElementById("pin0").style.display = "none"
                document.getElementById("pin1").style.display = "none"
                document.getElementById("pin2").style.display = "none"
            }
        }
        console.log(turnOrder[0].displayName + " technique " + otherCurrent[target].displayName + " for " + d1)
        return d1
    } else if (type == "drain") {
        var res = 1

        console.log("Res: " + res)

        var randMult = Math.random() * 0.2 + 0.9
        var finalMult = Math.round(randMult * 100) / 100 //Use this- not randMult!

        var d1 = Math.floor(((turnOrder[0].spr / 2) + (bp / 2) - (otherCurrent[target].def / 4)) * finalMult * res * otherCurrent[target].guard)



        otherCurrent[target].currentHP -= d1
        turnOrder[0].currentHP += d1 * 0.25

        if (otherCurrent[target].currentHP <= 0) {
            document.getElementById("otherYokai" + target).src = "./images/battle/Spirit.webp"
            otherCurrent[target].down = true
            if ((pinned - 1) == target) {
                pinned = false
                document.getElementById("pin0").style.display = "none"
                document.getElementById("pin1").style.display = "none"
                document.getElementById("pin2").style.display = "none"
            }
        }

        return d1
    } else {

        var randMult = Math.random() * 0.2 + 0.9
        var finalMult = Math.round(randMult * 100) / 100 //Use this- not randMult!

        var d1 = Math.floor(((turnOrder[0].spr / 2) + (bp / 2) - (otherCurrent[target].def / 4)) * finalMult * otherCurrent[target].guard)



        myCurrent[target].currentHP += d1

        if (myCurrent[target].currentHP >= myCurrent[target].hp) {
            myCurrent[target].currentHP = myCurrent[target].hp
        }

        return d1
    }


}

function attack(bp, element, target) {


    var res = 1
    if (element == "none") {
        res = 1
    } else if (element == "lightning") {
        res = YOKAI_DATABASE[otherCurrent[target].code].lightning
    }

    var randMult = Math.random() * 0.2 + 0.9
    var finalMult = Math.round(randMult * 100) / 100 //Use this- not randMult!

    var d1 = Math.floor(((turnOrder[0].str / 2) + (bp / 2) - (otherCurrent[target].def / 4)) * finalMult * res * otherCurrent[target].guard)



    otherCurrent[target].currentHP -= d1

    if (otherCurrent[target].currentHP <= 0) {
        document.getElementById("otherYokai" + target).src = "./images/battle/Spirit.webp"
        wheelClean()
        otherCurrent[target].down = true
        if ((pinned - 1) == target) {
            pinned = false
            document.getElementById("pin0").style.display = "none"
            document.getElementById("pin1").style.display = "none"
            document.getElementById("pin2").style.display = "none"
        }
    }

    console.log(turnOrder[0].displayName + " attacked " + otherCurrent[target].displayName + " for " + d1)

    return d1
}

function wheelClean(){
    for(var i = 1; i <= 6; i++){
        if(myTeam[i - 1].currentHP <= 0){
            document.getElementById("slot" + i).src = "./images/battle/Spirit.webp"
        }
    }
}


function refreshDisplays() {
    document.getElementById("myHP0").max = myCurrent[0].hp
    document.getElementById("myHP1").max = myCurrent[1].hp
    document.getElementById("myHP2").max = myCurrent[2].hp

    document.getElementById("otherHP0").max = otherCurrent[0].hp
    document.getElementById("otherHP1").max = otherCurrent[1].hp
    document.getElementById("otherHP2").max = otherCurrent[2].hp

    document.getElementById("myHP0").value = myCurrent[0].currentHP
    document.getElementById("myHP1").value = myCurrent[1].currentHP
    document.getElementById("myHP2").value = myCurrent[2].currentHP

    document.getElementById("otherHP0").value = otherCurrent[0].currentHP
    document.getElementById("otherHP1").value = otherCurrent[1].currentHP
    document.getElementById("otherHP2").value = otherCurrent[2].currentHP

    document.getElementById("pro0").value = myTeam[0].currentHP
    document.getElementById("pro1").value = myTeam[1].currentHP
    document.getElementById("pro2").value = myTeam[2].currentHP
    document.getElementById("pro3").value = myTeam[3].currentHP
    document.getElementById("pro4").value = myTeam[4].currentHP
    document.getElementById("pro5").value = myTeam[5].currentHP
}

let OlastRotation = 0;
var OcurrentFirst = 0;
var OsaveR = 0;
var OlastSave = 0;
var OotherR = 0;


pubnub.addListener({
    message: function(m) {
        var oUID = parseInt(otherUID.replace(/"/g, ''), 10)
        var mUID = parseInt(m.message.UID.replace(/"/g, ''), 10)
        //console.log(oUID)
        //console.log(mUID)
        //console.log(myUID)
        if (m.message.type == "ready" && mUID == oUID) {
            otherReady = true
            if (myReady && otherReady && !countingDown) {
                countdown()
            }
        }
        if (m.message.type == "userMessage" && mUID == oUID) {

            console.log("Received a user message!")
            var newMessage = document.createElement("p")
            newMessage.innerHTML = "<em id = 'otherMessage'>" + otherUsername + ":</em> " + m.message.content
            document.getElementById("chatBox").appendChild(newMessage)

            document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight
        }



        if (m.message.type == "defeat" && mUID == oUID) {
            document.getElementById("bgm").src = "audios/music/Victory.mp3"
            document.getElementById("bgm").play()
            document.getElementById("results").style.display = "block"
            document.getElementById("resultsImage").src = "images/battle/victory.webp"
            document.getElementById("resultsImage").style.display = "block"

            setTimeout(function() {
                location.href = "/matchmaking.html"
            }, 60000)
        }






        if (m.message.type == "moveHeal" && mUID == oUID) {
            console.log("Opponent healed!")

            var newMessage = document.createElement("p")
            newMessage.innerHTML = m.message.content
            newMessage.setAttribute("class", "systemMessage")
            document.getElementById("chatBox").appendChild(newMessage)

            document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight
            otherCurrent[m.message.sentTarget].currentHP += m.message.damage
            if (otherCurrent[m.message.sentTarget].currentHP > otherCurrent[m.message.sentTarget].hp) {
                otherCurrent[m.message.sentTarget].currentHP = otherCurrent[m.message.sentTarget].hp
            }

            refreshDisplays()

            if (!currentlyRotating) {
                refreshDisplays()
                subtractAP()
                calcAP(0, 1)

                refreshOrder()
            }
            turnIDX += 1
            if (parseInt(turnOrder[0].UID.replace(/"/g, ''), 10) == myUID) {
               
                console.log("* It's my turn! " + turnIDX)
                setTimeout(function() {
                    advanceTurn()
                }, 10000)
            }
        }
        if (m.message.type == "moveDrain" && mUID == oUID) {
            console.log("Opponent drained!")
            var newMessage = document.createElement("p")
            newMessage.innerHTML = m.message.content
            newMessage.setAttribute("class", "systemMessage")
            document.getElementById("chatBox").appendChild(newMessage)

            document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight
            myCurrent[m.message.sentTarget].currentHP -= m.message.damage
            if (myCurrent[m.message.sentTarget].currentHP <= 0) {
                wheelClean()
                document.getElementById("myYokai" + m.message.sentTarget).src = "./images/battle/Spirit.webp"
                myCurrent[m.message.sentTarget].down = true
                document.getElementById("slot" + myCurrent[m.message.sentTarget].order).src = "./images/battle/Spirit.webp"
            }

            if (myCurrent[0].currentHP <= 0 && myCurrent[1].currentHP <= 0 && myCurrent[2].currentHP <= 0) {
                wheelClean()
                // Snap to the nearest step
                rotation += Math.PI
                rotatable.style.transform = 'rotate(' + rotation + 'rad)';
                document.getElementById("wheelBG").style.transform = 'rotate(' + rotation + 'rad)';
                document.getElementById("wheelLines").style.transform = 'rotate(' + rotation + 'rad)';
                console.log(rotation)
                console.log("Finished rotating!")
                syncArrays(rotation)
            }

            turnOrder[0].currentHP += (m.message.damage * 0.25)
            if (turnOrder[0].currentHP > turnOrder[0].hp) {
                turnOrder[0].currentHP = turnOrder[0].hp
            }

            refreshDisplays()

            if (!currentlyRotating) {
                refreshDisplays()
                subtractAP()
                calcAP(0, 1)

                refreshOrder()
            }
            if (parseInt(turnOrder[0].UID.replace(/"/g, ''), 10) == myUID) {
                setTimeout(function() {
                    advanceTurn()
                }, 10000)
            }
            turnIDX += 1
            console.log("The opponent took a turn! Turn IDX: " + turnIDX)
        }
        if (m.message.type == "moveAttack" && mUID == oUID) {

            console.log("Opponent attacked! Damage: " + m.message.damage)

            //for(var i = 0; i < turnOrder.length; i++){
            //console.log(turnOrder[i].displayName + " with AP of " + turnOrder[i].AP)
            //}

            var newMessage = document.createElement("p")
            newMessage.innerHTML = m.message.content
            newMessage.setAttribute("class", "systemMessage")
            document.getElementById("chatBox").appendChild(newMessage)

            document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight
            myCurrent[m.message.sentTarget].currentHP -= m.message.damage
            if (myCurrent[m.message.sentTarget].currentHP <= 0) {
                wheelClean()
                document.getElementById("myYokai" + m.message.sentTarget).src = "./images/battle/Spirit.webp"
                myCurrent[m.message.sentTarget].down = true
                document.getElementById("slot" + myCurrent[m.message.sentTarget].order).src = "./images/battle/Spirit.webp"
            }

            if (myCurrent[0].currentHP <= 0 && myCurrent[1].currentHP <= 0 && myCurrent[2].currentHP <= 0) {

                console.log("all down 2")
                document.getElementById("allDown").style.display = "block"

                if (myCurrent[3].currentHP <= 0 && myCurrent[4].currentHP <= 0 && myCurrent[5].currentHP <= 0) {
                    console.log("Defeat!")

                    document.getElementById("bgm").src = "audios/music/Defeat.mp3"
                    document.getElementById("bgm").play()
                    document.getElementById("results").style.display = "block"
                    document.getElementById("resultsImage").src = "images/battle/defeat.webp"
                    document.getElementById("resultsImage").style.display = "block"
                    pubnub.publish({
                        channel: getCookie("battleChannel"),
                        message: {
                            type: "defeat",
                            UID: "" + myUID
                        }
                    })
                    setTimeout(function() {
                        location.href = "/matchmaking.html"
                    }, 60000)
                    return
                }



            }

            refreshDisplays()

            subtractAP()
            calcAP(0, 1)
            console.log(turnOrder)
            refreshOrder()
            turnIDX += 1
            if (parseInt(turnOrder[0].UID.replace(/"/g, ''), 10) == myUID) {
                console.log("* I'm taking a turn! " + turnIDX)
                setTimeout(function() {
                    advanceTurn()
                }, 10000)
            }else{
                console.log("* Not my turn. " + turnIDX)
            }
            
        }
        if (m.message.type == "endMod" && mUID == oUID) {
            console.log("Got Mods!")
            //console.log(parseFloat(m.message.sentMod0.replace(/"/g, ''), 10))
            //console.log(parseFloat(m.message.sentMod1.replace(/"/g, ''), 10))
            //console.log(parseFloat(m.message.sentMod2.replace(/"/g, ''), 10))
            //console.log(parseFloat(m.message.sentMod3.replace(/"/g, ''), 10))
            //console.log(parseFloat(m.message.sentMod4.replace(/"/g, ''), 10))
            //console.log(parseFloat(m.message.sentMod5.replace(/"/g, ''), 10))
            calcAP(0, parseFloat(m.message.sentMod0.replace(/"/g, ''), 10))
            calcAP(1, parseFloat(m.message.sentMod1.replace(/"/g, ''), 10))
            calcAP(2, parseFloat(m.message.sentMod2.replace(/"/g, ''), 10))
            calcAP(3, parseFloat(m.message.sentMod3.replace(/"/g, ''), 10))
            calcAP(4, parseFloat(m.message.sentMod4.replace(/"/g, ''), 10))
            calcAP(5, parseFloat(m.message.sentMod5.replace(/"/g, ''), 10))
            refreshOrder()
            console.log("After mods: ")
            console.log(turnOrder)

            if (parseInt(turnOrder[0].UID.replace(/"/g, ''), 10) == myUID) {
                console.log("* I'm taking a turn! " + turnIDX)
                setTimeout(function() {
                    advanceTurn()
                }, 10000)
            }else{
                console.log("* Not my turn. Waiting for opponent. " + turnIDX)
            }
        }
        if (m.message.type == "draggingWheel" && mUID == oUID) {
            currentlyRotating = true
            document.getElementById("switchingText").style.display = "block"
        }
        if (m.message.type == "turnWheel" && mUID == oUID) {
            console.log("enemy turn")
            var Or = m.message.r
            OsaveR = Or

            OotherR = Or
            OlastRotation = m.message.lastRotation

            console.log("Or: " + Or)
            console.log("Olast: " + OlastRotation)


            console.log(OlastRotation < Or)
            console.log(OlastRotation > Or)


            let Odiff = Math.abs(OotherR - OlastRotation)

            

            if (Or == OlastRotation) {
                currentlyRotating = false
            }
            if (Or == 0) {
                otherCurrent = []
                otherCurrent.push(otherTeam[0])
                otherCurrent.push(otherTeam[1])
                otherCurrent.push(otherTeam[2])
                otherCurrent.push(otherTeam[3])
                otherCurrent.push(otherTeam[4])
                otherCurrent.push(otherTeam[5])
                currentFirst = 0
            } else if (Or == Math.floor(Math.PI / 3)) {
                otherCurrent = []
                otherCurrent.push(otherTeam[5])
                otherCurrent.push(otherTeam[0])
                otherCurrent.push(otherTeam[1])
                otherCurrent.push(otherTeam[2])
                otherCurrent.push(otherTeam[3])
                otherCurrent.push(otherTeam[4])
                currentFirst = 5
            } else if (Or == Math.floor(2 * (Math.PI / 3))) {
                otherCurrent = []
                otherCurrent.push(otherTeam[4])
                otherCurrent.push(otherTeam[5])
                otherCurrent.push(otherTeam[0])
                otherCurrent.push(otherTeam[1])
                otherCurrent.push(otherTeam[2])
                otherCurrent.push(otherTeam[3])
                currentFirst = 4
            } else if (Or == Math.floor(Math.PI)) {
                otherCurrent = []
                otherCurrent.push(otherTeam[3])
                otherCurrent.push(otherTeam[4])
                otherCurrent.push(otherTeam[5])
                otherCurrent.push(otherTeam[0])
                otherCurrent.push(otherTeam[1])
                otherCurrent.push(otherTeam[2])
                currentFirst = 3
            } else if (Or == Math.floor(4 * (Math.PI / 3))) {
                otherCurrent = []
                otherCurrent.push(otherTeam[2])
                otherCurrent.push(otherTeam[3])
                otherCurrent.push(otherTeam[4])
                otherCurrent.push(otherTeam[5])
                otherCurrent.push(otherTeam[0])
                otherCurrent.push(otherTeam[1])
                currentFirst = 2
            } else if (Or == Math.floor(5 * (Math.PI / 3))) {
                otherCurrent = []
                otherCurrent.push(otherTeam[1])
                otherCurrent.push(otherTeam[2])
                otherCurrent.push(otherTeam[3])
                otherCurrent.push(otherTeam[4])
                otherCurrent.push(otherTeam[5])
                otherCurrent.push(otherTeam[0])
                currentFirst = 1
            }

            console.log(Or)

            document.getElementById("otherName0").innerHTML = otherCurrent[0]["displayName"]
            document.getElementById("otherName1").innerHTML = otherCurrent[1]["displayName"]
            document.getElementById("otherName2").innerHTML = otherCurrent[2]["displayName"]
            refreshDisplays()

            if (otherCurrent[5]["down"]) {
                document.getElementById("otherYokaiLeft").src = "./images/battle/Spirit.webp"
            } else {
                document.getElementById("otherYokaiLeft").src = YOKAI_DATABASE[otherCurrent[5]["code"]]["frontIdle"]
            }

            if (otherCurrent[0]["down"]) {
                document.getElementById("otherYokai0").src = "./images/battle/Spirit.webp"
            } else {
                document.getElementById("otherYokai0").src = YOKAI_DATABASE[otherCurrent[0]["code"]]["frontIdle"]
            }

            if (otherCurrent[1]["down"]) {
                document.getElementById("otherYokai1").src = "./images/battle/Spirit.webp"
            } else {
                document.getElementById("otherYokai1").src = YOKAI_DATABASE[otherCurrent[1]["code"]]["frontIdle"]
            }

            if (otherCurrent[2]["down"]) {
                document.getElementById("otherYokai2").src = "./images/battle/Spirit.webp"
            } else {
                document.getElementById("otherYokai2").src = YOKAI_DATABASE[otherCurrent[2]["code"]]["frontIdle"]
            }

            if (otherCurrent[3]["down"]) {
                document.getElementById("otherYokaiRight").src = "./images/battle/Spirit.webp"
            } else {
                document.getElementById("otherYokaiRight").src = YOKAI_DATABASE[otherCurrent[3]["code"]]["frontIdle"]
            }

            console.log(otherCurrent)

            turnOrder = [myCurrent[0], myCurrent[1], myCurrent[2], otherCurrent[0], otherCurrent[1], otherCurrent[2]]
            refreshOrder()
            console.log(turnOrder)
            document.getElementById("switchingText").style.display = "none"
            currentlyRotating = false




            //console.log("direction: " + direction)
            //console.log("difference: " + diff)





            OlastSave = OsaveR
            OlastRotation = Or

            //console.log(myCurrent)
        }
    }
});

function backToMatchmaking() {
    location.href = "/matchmaking.html"
}

function selectTarget() {
    if (pendingPin) {
        pinned = pendingPin
        console.log("pinned: " + (pinned - 1))
        document.getElementById("pin0").style.display = "none"
        document.getElementById("pin1").style.display = "none"
        document.getElementById("pin2").style.display = "none"
        document.getElementById("pin" + (pinned - 1)).style.display = "block"
    }
}