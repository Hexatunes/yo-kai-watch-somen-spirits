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

function intoFinished() {
    document.getElementById("padTrans").style.display = "none";
}

function hidePad() {
    teams = JSON.parse(getCookie("teams"))
    if(teams){
        refreshTeamList()
    }else{
        alert("You have no teams! Go make at least one in the teambuilder!")
    }
    document.getElementById("padTrans").style.animation = "fadeOut 1s";
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

function loadTeam(){
    currentTeam = document.getElementById("teamSelect").selectedIndex
}


function refreshTeamList(){
  document.getElementById("teamSelect").innerHTML = ""
  for(var i = 0; i < teams.length; i++){
    var addOption = document.createElement("option");
    addOption.innerHTML = teams[i][0];
    document.getElementById("teamSelect").appendChild(addOption)
  }
}



var pubnub = new PubNub({
    publishKey: 'pub-c-b981178a-c09c-4b1e-b772-ff7d5a51ead7',
    subscribeKey: 'sub-c-6365d256-685b-4d63-8d89-8bc0d31eb1d1',
    userId: "" + Math.random()
});


var channel = '10chat';

// Add a listener to a channel and subscribe to it
pubnub.addListener({
    message: function(m) {
        alert(m.message.content);
    }
});
pubnub.subscribe({ channels: [channel] });


function sendPing() {
    pubnub.publish({
        channel: channel,
        message: {
            content: "yo!",
        },
    });
}
