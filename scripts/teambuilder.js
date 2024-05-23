function actuallySwitchHome(){
  location.href = "yo-kai-watch-somen-spirits/";
}

function intoFinished(){
  document.getElementById("padTrans").style.display = "none";
}

function switchHome(){
  document.getElementById("padTrans").style.display = "block";
  document.getElementById("padTrans").style.animation = "fadeIn 1s";
  setTimeout(actuallySwitchHome, 1000)
}

const songs = ["Harrisville.mp3", "Springdale.mp3", "Blossom.mp3"]

function setUp(){
  const randomSong = Math.floor(Math.random() * songs.length);
  const path = "audios/music/" + songs[randomSong];
  document.getElementById("bgm").src = path;
  document.getElementById("bgm").play()
  document.getElementById("bgm").volume = 0.5
  
  document.getElementById("padTrans").style.animation = "fadeOut 1s";
  setTimeout(intoFinished, 1000)
}
