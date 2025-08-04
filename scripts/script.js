function getCookie(name) {
    let cookieArr = document.cookie.split(";");

    for(let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");

        if(name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }

    // Return null if the cookie by name does not exist
    return null;
}

function clearBattle(){
  document.cookie = "myTeam=null"
  document.cookie = "myUsername=null"
  document.cookie = "otherTeam=null"
  document.cookie = "otherUsername=null"
}


function actuallySwitchTeambuilder(){
  location.href = "./teambuilder.html";
}

function actuallySwitchMatchmaking(){
  location.href = "./matchmaking.html";
}

function intoFinished(){
  document.getElementById("padTrans").style.display = "none";
}

function switchTeambuilder(){
  document.getElementById("padTrans").style.display = "block";
  document.getElementById("padTrans").style.animation = "fadeIn 1s";
  setTimeout(actuallySwitchTeambuilder, 1000)

  document.getElementById("menuSFX").src = "./audios/SFX/UI/menuButtonClick.wav"
  document.getElementById("menuSFX").play()
}

function switchBattle(){
  document.getElementById("padTrans").style.display = "block";
  document.getElementById("padTrans").style.animation = "fadeIn 1s";
  setTimeout(actuallySwitchMatchmaking, 1000)

  document.getElementById("menuSFX").src = "./audios/SFX/UI/menuButtonClick.wav"
  document.getElementById("menuSFX").play()
}

const songs = ["Harrisville.mp3", "Springdale.mp3", "Blossom.mp3", "SoAlone.mp3", "Uptown.mp3", "SanFantastico.mp3", "OldHarrisville.mp3", "Sakura.mp3"]

function startGame(){
  clearBattle()
  

  document.getElementById("startMenu").style.display = "none";


  const randomSong = Math.floor(Math.random() * songs.length);
  const path = "./audios/music/" + songs[randomSong];
  document.getElementById("bgm").src = path;
  document.getElementById("bgm").play()
  document.getElementById("beachSFX").play()

  var musicToggle = getCookie("BGMute")

  console.log(musicToggle)
  if(musicToggle == "true"){
    document.getElementById("toggleMusic").src = "./images/musicON.png";
    document.getElementById("bgm").volume = 0.5;
    document.getElementById("beachSFX").volume = 0.3;

  }else if(musicToggle == "false"){
    document.getElementById("toggleMusic").src = "./images/musicOFF.png";
    document.getElementById("bgm").volume = 0.0;
    document.getElementById("beachSFX").volume = 0.0;
  }else{
    document.getElementById("toggleMusic").src = "./images/musicON.png";
    document.getElementById("bgm").volume = 0.5;
    document.getElementById("beachSFX").volume = 0.3;
    document.cookie = "BGMute=true";
  }
}

function toggleMusic(){
  var musicToggle = getCookie("BGMute")
  if(musicToggle == "true"){
    document.getElementById("toggleMusic").src = "./images/musicOFF.png";
    document.getElementById("bgm").volume = 0.0;
    document.getElementById("beachSFX").volume = 0.0;
    document.cookie = "BGMute=false";

  }else{
    document.getElementById("toggleMusic").src = "./images/musicON.png";
    document.getElementById("bgm").volume = 0.5;
    document.getElementById("beachSFX").volume = 0.3;
    document.cookie = "BGMute=true";
  }
}

function loadMusic(){
  
}

function scrollTop() {
  window.scrollTo(0, 0);
}

function hidePad(){
  document.getElementById("padTrans").style.animation = "fadeOut 1s";
  setTimeout(intoFinished, 1000)


  addParallaxEffect(document.getElementById("bg"), -10)
  addParallaxEffect(document.getElementById("dialogPortrait"), -15)
}

document.getElementById("bgm").addEventListener("ended", function(){
  document.getElementById("bgm").currentTime = 0;
  const randomSong = Math.floor(Math.random() * songs.length);
  const path = "./audios/music/" + songs[randomSong];
  document.getElementById("bgm").src = path;
  document.getElementById("bgm").play()
});

document.getElementById("beachSFX").addEventListener("ended", function(){
  document.getElementById("beachSFX").currentTime = 0;
  document.getElementById("beachSFX").play()
});


function addParallaxEffect(element, strength = 20) {
  const rect = element.getBoundingClientRect();

  window.addEventListener('mousemove', (e) => {
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    const moveX = (x / window.innerWidth) * strength - 100;
    const moveY = (y / window.innerHeight) * strength - 100;

    element.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });

  window.addEventListener('mouseleave', () => {
    element.style.transform = `translate(0px, 0px)`;
  });
}