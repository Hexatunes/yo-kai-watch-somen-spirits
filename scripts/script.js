function actuallySwitchTeambuilder(){
  location.href = "./teambuilder.html";
}

function intoFinished(){
  document.getElementById("padTrans").style.display = "none";
}

function switchTeambuilder(){
  document.getElementById("padTrans").style.display = "block";
  document.getElementById("padTrans").style.animation = "fadeIn 1s";
  setTimeout(actuallySwitchTeambuilder, 1000)
}

const songs = ["Harrisville.mp3", "Springdale.mp3", "Blossom.mp3"]

function startGame(){
  document.getElementById("startMenu").style.display = "none";
  const randomSong = Math.floor(Math.random() * songs.length);
  const path = "./audios/music/" + songs[randomSong];
  document.getElementById("bgm").src = path;
  document.getElementById("bgm").play()
  document.getElementById("bgm").volume = 0.5
}

var musicPlaying = true;

function toggleMusic(){
  if(musicPlaying){
    document.getElementById("toggleMusic").src = "./images/musicOFF.png";
    document.getElementById("bgm").volume = 0.0;
    musicPlaying = false;
  }else{
    document.getElementById("toggleMusic").src = "./images/musicON.png";
    document.getElementById("bgm").volume = 0.5;
    musicPlaying = true;
  }
}

function hidePad(){
  document.getElementById("padTrans").style.animation = "fadeOut 1s";
  setTimeout(intoFinished, 1000)
}