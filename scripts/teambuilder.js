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



function actuallySwitchHome(){
  location.href = "./";
}

function switchHome(){
  document.getElementById("padTrans").style.display = "block";
  document.getElementById("padTrans").style.animation = "fadeIn 1s";
  setTimeout(actuallySwitchHome, 1000)
}



function toggleMusic(){
  var musicToggle = getCookie("BGMute")
  if(musicToggle == "true"){
    document.getElementById("toggleMusic").src = "./images/musicOFF.png";
    document.getElementById("bgm").volume = 0.0;
    document.cookie = "BGMute=false";

  }else{
    document.getElementById("toggleMusic").src = "./images/musicON.png";
    document.getElementById("bgm").volume = 0.5;
    document.cookie = "BGMute=true";
  }
}



const songs = ["Harrisville.mp3", "Springdale.mp3", "Blossom.mp3", "SoAlone.mp3", "Uptown.mp3", "SanFantastico.mp3", "OldHarrisville.mp3", "Sakura.mp3"]



var currentTeam = 0;
var selectedYokai = -1;
var selectedID = ""
var teams = []

function intoFinished(){
  document.getElementById("padTrans").style.display = "none";
}

function clearBattle(){
  document.cookie = "myTeam=null"
  document.cookie = "myUsername=null"
  document.cookie = "otherTeam=null"
  document.cookie = "otherUsername=null"
}

function setUp(){
  clearBattle()
  const randomSong = Math.floor(Math.random() * songs.length);
  const path = "./audios/music/" + songs[randomSong];
  document.getElementById("bgm").src = path;
  
  var musicToggle = getCookie("BGMute")

  console.log(musicToggle)
  if(musicToggle == "true"){
    document.getElementById("toggleMusic").src = "./images/musicON.png";
    document.getElementById("bgm").volume = 0.5;

  }else if(musicToggle == "false"){
    document.getElementById("toggleMusic").src = "./images/musicOFF.png";
    document.getElementById("bgm").volume = 0.0;
  }else{
    document.getElementById("toggleMusic").src = "./images/musicON.png";
    document.getElementById("bgm").volume = 0.5;
    document.cookie = "BGMute=true";
  }

  document.getElementById("bgm").play()
  document.getElementById("itemList").style.display = "none"
  document.getElementById("currentInfo").style.display = "none"
  document.getElementById("statsChart").style.display = "none"
  document.getElementById("probChart").style.display = "none"
  document.getElementById("apDisplay").style.display = "none"

  document.getElementById("setBony").style.display = "none"
  document.getElementById("setFleshy").style.display = "none"

  document.getElementById("pasteOutput").style.display = "none"
 

  const tiers = ["OU"]
  
  for(var i = 0; i < tiers.length; i++){
     var OU = document.createElement("p")
      OU.innerHTML = "-------" + tiers[i] + "-------"
      //OU.setAttribute("class", "yokaiOption")
     // OU.setAttribute("onclick", `appendYokai("${key}")`)

      var br = document.createElement("br")


      document.getElementById("yokaiList").appendChild(OU)
      document.getElementById("yokaiList").appendChild(br)
    for (const [key, value] of Object.entries(YOKAI_DATABASE)) {
      if(value["tier"] == tiers[i]){
        var icon = document.createElement("input")
        icon.type = "image"
        icon.src = value["medal"]
        icon.setAttribute("class", "medalList")
        document.getElementById("yokaiList").appendChild(icon)
    
        var nameInfo = document.createElement("button")
        nameInfo.innerHTML = value["displayName"] + " | Rank: " + value["rank"]
        nameInfo.setAttribute("class", "yokaiOption")
        nameInfo.setAttribute("onclick", `appendYokai("${key}")`)
    
        var br = document.createElement("br")
    
        
        document.getElementById("yokaiList").appendChild(nameInfo)
        document.getElementById("yokaiList").appendChild(br)
      }
    }
  }

  for (const [key, value] of Object.entries(ITEM_DATABASE)) {
    var icon = document.createElement("input")
    icon.type = "image"
    icon.src = value["icon"]
    icon.setAttribute("class", "medalList")
    document.getElementById("itemList").appendChild(icon)

    var nameInfo = document.createElement("button")
    nameInfo.innerHTML = value["displayName"] + " | " + value["description"]
    nameInfo.setAttribute("class", "yokaiOption")
    nameInfo.setAttribute("onclick", `appendItem("${key}")`)

    var br = document.createElement("br")


    document.getElementById("itemList").appendChild(nameInfo)
    document.getElementById("itemList").appendChild(br)
  }
  
  document.getElementById("padTrans").style.animation = "fadeOut 1s";
  setTimeout(intoFinished, 1000)

  teams = JSON.parse(localStorage.getItem("teams"))
  if(!teams){
    localStorage.setItem('teams', JSON.stringify([["Untitled Team"]]));
    teams = [["Untitled Team"]]
  }else if(teams.length == 0){
    teams = [["Untitled Team"]]
    localStorage.setItem('teams', JSON.stringify(teams));
  }
  console.log(teams)
  
  document.getElementById("teamSelect").selectedIndex = 0
  refreshTeamList()
  loadTeam()
}

function toYokai(){
  document.getElementById("yokaiList").style.display = "block"
  document.getElementById("itemList").style.display = "none"
}

function toItems(){
  document.getElementById("yokaiList").style.display = "none"
  document.getElementById("itemList").style.display = "block"
}

function refreshTeamList(){
  document.getElementById("teamSelect").innerHTML = ""
  for(var i = 0; i < teams.length; i++){
    var addOption = document.createElement("option");
    addOption.innerHTML = teams[i][0];
    document.getElementById("teamSelect").appendChild(addOption)
  }
}

function loadTeam(){
  //code to refresh and load in yokais
  currentTeam = document.getElementById("teamSelect").selectedIndex
  document.getElementById("slot1").src = ""
  document.getElementById("slot2").src = ""
  document.getElementById("slot3").src = ""
  document.getElementById("slot4").src = ""
  document.getElementById("slot5").src = ""
  document.getElementById("slot6").src = ""
  for(let i = 0; i < teams[currentTeam].length - 1; i++){
    document.getElementById("slot" + (i + 1)).src = YOKAI_DATABASE[teams[currentTeam][i + 1]["code"]]["medal"]
  }

  for (var i = 1; i < teams[currentTeam].length; i++) {
    teams[currentTeam][i]["order"] = i
  }

  document.getElementById("currentInfo").style.display = "none"
  document.getElementById("statsChart").style.display = "none"
  document.getElementById("probChart").style.display = "none"
  document.getElementById("apDisplay").style.display = "none"

  document.getElementById("setBony").style.display = "none"
  document.getElementById("setFleshy").style.display = "none"

  document.getElementById("yokaiName").innerHTML = "Select a Yokai!"
  document.getElementById("yokaiGif").src = "./images/teambuilder/whisperPlaceholder.webp"
}

function createTeam(){
  if(teams.length == 0){
    teams.push([document.getElementById("nameTeam").value])
    localStorage.setItem('teams', JSON.stringify(teams));
    refreshTeamList()
    document.getElementById("nameTeam").value = ""
    document.getElementById("teamSelect").selectedIndex = 0
    currentTeam = 0
  }else if(teams.length <= 50){
    teams.push([document.getElementById("nameTeam").value])
    localStorage.setItem('teams', JSON.stringify(teams));
    refreshTeamList()
    document.getElementById("nameTeam").value = ""
    document.getElementById("teamSelect").selectedIndex = 0
    currentTeam = 0
  }
  else{
    alert("Too many teams! Why do you need 51 of them?")
  }
}

function renameTeam(){
  teams[currentTeam][0] = document.getElementById("nameTeam").value
  document.getElementById("nameTeam").value = ""
  refreshTeamList()
  document.getElementById("teamSelect").selectedIndex = currentTeam
  localStorage.setItem('teams', JSON.stringify(teams));
  console.log()
}

function deleteTeam(){
  document.getElementById("currentInfo").style.display = "none"
  document.getElementById("statsChart").style.display = "none"
  document.getElementById("probChart").style.display = "none"
  document.getElementById("apDisplay").style.display = "none"

  document.getElementById("setBony").style.display = "none"
  document.getElementById("setFleshy").style.display = "none"

  if(teams.length == 1){
    teams.push(["Untitled Team"])
    localStorage.setItem('teams', JSON.stringify(teams));
  }
  teams.splice(currentTeam, 1)
  localStorage.setItem('teams', JSON.stringify(teams));
  console.log(localStorage.getItem('teams'))
  refreshTeamList()
  document.getElementById("teamSelect").selectedIndex = 0
  currentTeam = 0
  selectedYokai = -1
  document.getElementById("yokaiName").innerHTML = "Select a Yokai!"
  document.getElementById("yokaiGif").src = "./images/teambuilder/whisperPlaceholder.webp"
  
  loadTeam()
}



function appendYokai(toAppend){
  if(teams[currentTeam].length <= 6){
    
    var calcHP = Math.floor(YOKAI_DATABASE[toAppend]["hpA"] + ( ( (YOKAI_DATABASE[toAppend]["hpB"] - YOKAI_DATABASE[toAppend]["hpA"] + 0) * (59) ) / 98))
    
    var calcSTR = Math.floor(YOKAI_DATABASE[toAppend]["strA"] + ( ( (YOKAI_DATABASE[toAppend]["strB"] - YOKAI_DATABASE[toAppend]["strA"] + 0) * (59) ) / 98))

    var calcSPR = Math.floor(YOKAI_DATABASE[toAppend]["sprA"] + ( ( (YOKAI_DATABASE[toAppend]["sprB"] - YOKAI_DATABASE[toAppend]["sprA"] + 0) * (59) ) / 98))

    var calcDEF = Math.floor(YOKAI_DATABASE[toAppend]["defA"] + ( ( (YOKAI_DATABASE[toAppend]["defB"] - YOKAI_DATABASE[toAppend]["defA"] + 0) * (59) ) / 98))

    var calcSPD = Math.floor(YOKAI_DATABASE[toAppend]["spdA"] + ( ( (YOKAI_DATABASE[toAppend]["spdB"] - YOKAI_DATABASE[toAppend]["spdA"] + 0) * (59) ) / 98))
      
    teams[currentTeam].push({
      code: toAppend,
      order: -1,
      displayName: YOKAI_DATABASE[toAppend]["displayName"],
      army: "bony",
      attitude: "rough",
      loafAttitude: "serious",
      na: YOKAI_DATABASE[toAppend]["normalAttack"],
      tech: YOKAI_DATABASE[toAppend]["technique"],
      soult: YOKAI_DATABASE[toAppend]["soultimate"],
      insp: YOKAI_DATABASE[toAppend]["inspirit"],
      hp: calcHP,
      str: calcSTR,
      spr: calcSPR,
      def: calcDEF,
      spd: calcSPD,
      ivHP: 0,
      ivSTR: 0,
      ivSPR: 0,
      ivDEF: 0,
      ivSPD: 0,
      evHP: 0,
      evSTR: 0,
      evSPR: 0,
      evDEF: 0,
      evSPD: 0,
      gpSTR: 0,
      gpSPR: 0,
      gpDEF: 0,
      gpSPD: 0,
      dbID: toAppend,
      items: [],
      AP: 0,
      down: false,
      UID: 0,
      currentHP: 0,
      soul: 0,
      guard: 1,
    })
    localStorage.setItem('teams', JSON.stringify(teams));
    console.log(teams)
    console.log(document.cookie)

    

    loadTeam()
  }else{
    alert("Team full! Remove a Yokai!")
  }
}

function appendItem(toAppend){
  if(selectedYokai >= 0){
    if(teams[currentTeam][selectedYokai]["items"].length < YOKAI_DATABASE[teams[currentTeam][selectedYokai].code].items){
      teams[currentTeam][selectedYokai]["items"].push(ITEM_DATABASE[toAppend])
      document.getElementById("equipName").innerHTML = teams[currentTeam][selectedYokai]["items"]
    }else{
      alert("This yokai can't hold any more items!")
    }
    localStorage.setItem('teams', JSON.stringify(teams));
  }
}

function setBony(){
  teams[currentTeam][selectedYokai]["army"] = "bony"
  document.getElementById("setBony").style.color = "rgba(255, 188, 188, 1)"
  document.getElementById("setFleshy").style.color = "rgba(128, 200, 255, 0.5)"
  localStorage.setItem('teams', JSON.stringify(teams));
}

function setFleshy(){
  teams[currentTeam][selectedYokai]["army"] = "fleshy"
  document.getElementById("setBony").style.color = "rgba(255, 188, 188, 0.5)"
  document.getElementById("setFleshy").style.color = "rgba(128, 200, 255, 1)"
  localStorage.setItem('teams', JSON.stringify(teams));
}

function setAttitude(attitudeValue){
  teams[currentTeam][selectedYokai]["attitude"] = attitudeValue
  localStorage.setItem('teams', JSON.stringify(teams));
}

function setLoafAttitude(attitudeValue){
  teams[currentTeam][selectedYokai]["loafAttitude"] = attitudeValue
  localStorage.setItem('teams', JSON.stringify(teams));
}

function clearItems(){
  if(selectedYokai >= 0){
    teams[currentTeam][selectedYokai]["items"] = []
    document.getElementById("equipName").innerHTML = teams[currentTeam][selectedYokai]["items"]
    localStorage.setItem('teams', JSON.stringify(teams));
  }
}


function calcAP(sentSPD){
    var SPD = sentSPD
    var AP = -1
    if(SPD <= 170){
        AP = Math.floor((369 - Math.floor(SPD / 3) * 3))
    }else if(SPD <= 200){
        AP = Math.floor((198 - Math.floor((SPD - 171) / 5) * 3))
    }else if(SPD <= 500){
        AP = Math.floor((180 - Math.floor((SPD - 201) / 10) * 3))
    }

    return AP
}

function selectYokai(index){
  
  document.getElementById("currentInfo").style.display = "block"
  document.getElementById("statsChart").style.display = "block"
  document.getElementById("probChart").style.display = "block"
  document.getElementById("apDisplay").style.display = "block"

  document.getElementById("setBony").style.display = "block"
  document.getElementById("setFleshy").style.display = "block"

  document.getElementById("selectAttitude").value = teams[currentTeam][index]["attitude"]
  document.getElementById("selectLoafAttitude").value = teams[currentTeam][index]["loafAttitude"]

  console.log(teams[currentTeam][index]["army"])

  if(teams[currentTeam][index]["army"] == "bony"){
    document.getElementById("setBony").style.color = "rgba(255, 188, 188, 1)"
    document.getElementById("setFleshy").style.color = "rgba(128, 200, 255, 0.5)"
  }else{
    document.getElementById("setBony").style.color = "rgba(255, 188, 188, 0.5)"
    document.getElementById("setFleshy").style.color = "rgba(128, 200, 255, 1)"
  }

  document.getElementById("apDisplay").innerHTML = "AP: " + calcAP(teams[currentTeam][index]["spd"])

  document.getElementById("probAtk").innerHTML = "Chance to attack: " + Math.floor(YOKAI_DATABASE[teams[currentTeam][index]["code"]].probAtk * 100) + "%"
  document.getElementById("probTech").innerHTML = "Chance to use technique: " + Math.floor(YOKAI_DATABASE[teams[currentTeam][index]["code"]]["probTech"] * 100) + "%"
  document.getElementById("probInsp").innerHTML = "Chance to inspirit: " + Math.floor(YOKAI_DATABASE[teams[currentTeam][index]["code"]]["probInsp"] * 100) + "%"
  document.getElementById("probGuard").innerHTML = "Chance to guard: " + Math.floor(YOKAI_DATABASE[teams[currentTeam][index]["code"]]["probGuard"] * 100) + "%"
  document.getElementById("probLoaf").innerHTML = "Chance to loaf: " + Math.floor(YOKAI_DATABASE[teams[currentTeam][index]["code"]]["probLoaf"] * 100) + "%"

  document.getElementById("equipName").innerHTML = teams[currentTeam][index]["items"]
  
  if(index <= teams[currentTeam].length){
    selectedYokai = index
    selectedID = teams[currentTeam][index]["dbID"]
    
    document.getElementById("yokaiName").innerHTML = teams[currentTeam][index]["displayName"]
    document.getElementById("yokaiGif").src = YOKAI_DATABASE[teams[currentTeam][index]["code"]]["frontIdle"]

    var stats = ["hp", "str", "spr", "def", "spd"]
    var statsCAPS = ["HP", "STR", "SPR", "DEF", "SPD"]
    var totalIVs = 0
    var totalEVs = 0

    

    for(var i = 0; i < stats.length; i++){
      var currentValue = teams[currentTeam][index][`${stats[i]}`]
      document.getElementById(`${stats[i]}Display`).innerHTML = `${statsCAPS[i]}: <em>` + teams[currentTeam][index][`${stats[i]}`] + "</em>"
      document.getElementById("chart" + statsCAPS[i]).value = currentValue
    }

    for(var i = 0; i < stats.length; i++){
      document.getElementById(`iv${statsCAPS[i]}`).value = teams[currentTeam][index][`iv${statsCAPS[i]}`]
      document.getElementById(`ev${statsCAPS[i]}`).value = teams[currentTeam][index][`ev${statsCAPS[i]}`]
      if(!(stats[i] == "hp")){
        document.getElementById(`gp${statsCAPS[i]}`).value = teams[currentTeam][index][`gp${statsCAPS[i]}`]
      }

      
      totalIVs += parseFloat(teams[currentTeam][selectedYokai][`iv${statsCAPS[i]}`])
      totalEVs += parseFloat(teams[currentTeam][selectedYokai][`ev${statsCAPS[i]}`])

      
      
    }
    
    //updateStat("ivHP")
    //teams[currentTeam][selectedYokai]["ivSTR"] = document.getElementById("ivSTR").value
    //teams[currentTeam][selectedYokai]["ivSPR"] = document.getElementById("ivSPR").value
    //teams[currentTeam][selectedYokai]["ivDEF"] = document.getElementById("ivDEF").value
    //teams[currentTeam][selectedYokai]["ivSPD"] = document.getElementById("ivSPD").value

    document.getElementById("remainingIVs").innerHTML = "Remaining IVs: <em>" + (40 - totalIVs) + "</em>"
    document.getElementById("remainingEVs").innerHTML = "Remaining EVs: <em>" + (26 - totalEVs) + "</em>"
  }
}

function deleteYokai(){
  document.getElementById("currentInfo").style.display = "none"
  document.getElementById("statsChart").style.display = "none"
  document.getElementById("probChart").style.display = "none"
  document.getElementById("apDisplay").style.display = "none"

  document.getElementById("setBony").style.display = "none"
  document.getElementById("setFleshy").style.display = "none"
  
  if(teams[currentTeam].length > 1 && selectedYokai > -1){
    teams[currentTeam].splice(selectedYokai, 1)
    loadTeam()
    selectedYokai = -1
    document.getElementById("yokaiName").innerHTML = "Select a Yokai!"
    document.getElementById("yokaiGif").src = "./images/teambuilder/whisperPlaceholder.webp"
    localStorage.setItem('teams', JSON.stringify(teams));
  }
}

function updateStat(stat){
  teams[currentTeam][selectedYokai][stat] = document.getElementById(stat).value

  var stats = ["hp", "str", "spr", "def", "spd"]
  var statsCAPS = ["HP", "STR", "SPR", "DEF", "SPD"]

  var totalIVs = 0
  var totalEVs = 0

  for(var i = 0; i < stats.length; i++){
    if(statsCAPS[i] == "HP"){
      var part1 = parseFloat(YOKAI_DATABASE[selectedID][`${stats[i]}B`]) - parseFloat(YOKAI_DATABASE[selectedID][`${stats[i]}A`]) + (parseFloat(teams[currentTeam][selectedYokai][`iv${statsCAPS[i]}`]) * 2)
    }else{
      var part1 = parseFloat(YOKAI_DATABASE[selectedID][`${stats[i]}B`]) - parseFloat(YOKAI_DATABASE[selectedID][`${stats[i]}A`]) + parseFloat(teams[currentTeam][selectedYokai][`iv${statsCAPS[i]}`])
    }
    var part2 = (part1 * 59) / 98
    var part3 = YOKAI_DATABASE[selectedID][`${stats[i]}A`] + part2
    var part4 = Math.floor(part3 + (parseFloat(teams[currentTeam][selectedYokai][`ev${statsCAPS[i]}`]) * (61/198)))
    if(!(stats[i] == "hp")){
      part4 += (parseFloat(teams[currentTeam][selectedYokai][`gp${statsCAPS[i]}`] * 5))
    }
    
    teams[currentTeam][selectedYokai][stats[i]] = part4

    
    totalIVs += parseFloat(teams[currentTeam][selectedYokai][`iv${statsCAPS[i]}`])
    totalEVs += parseFloat(teams[currentTeam][selectedYokai][`ev${statsCAPS[i]}`])
    
  }

  document.getElementById("remainingIVs").innerHTML = "Remaining IVs: <em>" + (40 - totalIVs) + "</em>"
  document.getElementById("remainingEVs").innerHTML = "Remaining EVs: <em>" + (26 - totalEVs) + "</em>"
  
  localStorage.setItem('teams', JSON.stringify(teams));
  selectYokai(selectedYokai)
}

document.getElementById("bgm").addEventListener("ended", function(){
  document.getElementById("bgm").currentTime = 0;
  const randomSong = Math.floor(Math.random() * songs.length);
  const path = "./audios/music/" + songs[randomSong];
  document.getElementById("bgm").src = path;
  document.getElementById("bgm").play()
});

function importTeam(){
  let toImport = prompt("Paste the team you want to import here.");

  if (toImport != null) {
    teams.push(JSON.parse(toImport))
    localStorage.setItem('teams', JSON.stringify(teams));
    refreshTeamList()
    document.getElementById("teamSelect").selectedIndex = teams.length - 1
    loadTeam()
  }else{
    alert("Team was not provided.")
  }
}

function exportTeam(){
  document.getElementById("pasteText").innerHTML = JSON.stringify(teams[currentTeam])
  document.getElementById("pasteOutput").style.display = "block"
}

function closePaste(){
  document.getElementById("pasteOutput").style.display = "none"
}