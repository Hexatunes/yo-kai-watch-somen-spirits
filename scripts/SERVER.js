const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const YOKAI_DATABASE = require('./Databases/YOKAI_DATABASE.js');
const ATTACK_DATABASE = require('./Databases/ATTACK_DATABASE.js');
const TECHNIQUE_DATABASE = require('./Databases/TECHNIQUE_DATABASE.js');
const SKILL_DATABASE = require('./Databases/SKILL_DATABASE.js');
const INSPIRIT_DATABASE = require('./Databases/INSPIRIT_DATABASE.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (or specify your GitHub Pages URL)
    methods: ["GET", "POST"]
  }
});

// Serve a simple homepage (optional)
app.get('/', (req, res) => {
  res.send('Somen Spirits Socket.IO Server is running!');
});
app.use(express.json()); // For parsing JSON bodies


// Store connected clients (optional, for better management)
const connectedClients = new Map();





// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Socket.IO connection handler
var matchmakingQueue = []

var battles = {

}

io.on('connection', (socket) => {


  console.log('A user connected:', socket.id);

  // Add the client to the connectedClients map
  connectedClients.set(socket.id, socket);




  // --- RANDOM MATCHMAKING --- 🆚
  socket.on('lfg', (sentUID, sentTeam, sentUsername) => {

    //Validate team
    sentTeam.splice(0, 1)
    var teamIsValid = validate_team(sentTeam)

    if (teamIsValid != "valid") {
      connectedClients.get(socket.id).emit("lfg_validity", teamIsValid)
    }

    connectedClients.get(socket.id).emit("lfg_validity", "valid")



    console.log("Adding ", socket.id, " to the queue...");

    //Add player to queue
    matchmakingQueue.push([socket.id, sentUID, sentUsername, sentTeam])

    if (matchmakingQueue.length >= 2) {

      //Notify players
      var playerOne = connectedClients.get(matchmakingQueue[0][0])
      var playerTwo = connectedClients.get(matchmakingQueue[1][0])

      var BATTLE_ID = Math.floor(Math.random() * 100000)
      playerOne.emit("lfg_found", { UID: matchmakingQueue[1][1], BATTLE_ID: BATTLE_ID, username: matchmakingQueue[1][2] })
      playerTwo.emit("lfg_found", { UID: matchmakingQueue[0][1], BATTLE_ID: BATTLE_ID, username: matchmakingQueue[0][2] })


      //Create new game instance
      battles["" + BATTLE_ID] = {
        "TURN_ORDER": [],
        "PLAYER_ONE": {
          "TEAM": matchmakingQueue[0][3],
          "UID": matchmakingQueue[0][1],
          "SOCKET_ID": 0
        },
        "PLAYER_TWO": {
          "TEAM": matchmakingQueue[1][3],
          "UID": matchmakingQueue[1][1],
          "SOCKET_ID": 0
        }


      }
      //Remove players from queue
      matchmakingQueue.shift()
      matchmakingQueue.shift()
    }
  });

  //Cancel matchmaking
  socket.on('cancel_lfg', (sentUID) => {
    for (var i = 0; i < matchmakingQueue.length; i++) {
      if (matchmakingQueue[i][1] == sentUID) {
        matchmakingQueue.splice(i, 1)
        break
      }
    }

    console.log(sentUID, " stopped matchmaking.")
  })

  //Determine conductor
  socket.on('determine_conductor', (sentUID, sentBATTLE_ID) => {
    connectedClients.set(socket.id, socket);
    var player = connectedClients.get(socket.id)

    var p1Conduct
    var p2Conduct

    var bInst = battles[sentBATTLE_ID]


    if (bInst["PLAYER_ONE"]["UID"] >= bInst["PLAYER_TWO"]["UID"]) {
      p1Conduct = true
      p2Conduct = false
    } else {
      p1Conduct = false
      p2Conduct = true
    }

    //Connect the socket.id to the UID, then give back the appropriate data
    if (sentUID == bInst["PLAYER_ONE"]["UID"]) {

      player.emit("is_conductor", { isConductor: p1Conduct })
    } else {
      player.emit("is_conductor", { isConductor: p2Conduct })
    }

  })


  // --- INITIALIZE BATTLE ---
  socket.on('initialize_battle', (sentUID, sentBATTLE_ID, isConductor) => {

    var bInst = battles[sentBATTLE_ID]


    var player = connectedClients.get(socket.id)


    for (var i = 0; i < bInst["PLAYER_ONE"]["TEAM"].length; i++) {
      bInst["PLAYER_ONE"]["TEAM"][i].currentHP = bInst["PLAYER_ONE"]["TEAM"][i].hp
    }

    for (var i = 0; i < bInst["PLAYER_TWO"]["TEAM"].length; i++) {
      bInst["PLAYER_TWO"]["TEAM"][i].currentHP = bInst["PLAYER_TWO"]["TEAM"][i].hp
    }

    if (isConductor) {
      //First turn AP random modding
      var p1Team = bInst["PLAYER_ONE"]["TEAM"]
      var p2Team = bInst["PLAYER_TWO"]["TEAM"]

      bInst["TURN_ORDER"] = [p1Team[0], p1Team[1], p1Team[2], p2Team[0], p2Team[1], p2Team[2]]

      for (var i = 0; i < 6; i++) {
        var randMod = Math.round((Math.random() * 0.1 + 0.5) * 100) / 100

        bInst["TURN_ORDER"][i]["AP"] = calcAP(bInst["TURN_ORDER"][i]["spd"], randMod)
      }
      bInst["TURN_ORDER"] = bInst["TURN_ORDER"].sort((a, b) => a["AP"] - b["AP"])


    }




    //Connect the socket.id to the UID, then give back the appropriate data
    if (sentUID == bInst["PLAYER_ONE"]["UID"]) {
      bInst["PLAYER_ONE"]["SOCKET_ID"] = socket.id

      player.emit("initialize_data", { myTeam: bInst["PLAYER_ONE"]["TEAM"], otherTeam: bInst["PLAYER_TWO"]["TEAM"] })
    } else {
      bInst["PLAYER_TWO"]["SOCKET_ID"] = socket.id

      player.emit("initialize_data", { myTeam: bInst["PLAYER_TWO"]["TEAM"], otherTeam: bInst["PLAYER_ONE"]["TEAM"] })
    }


  });




  // -- NEXT TURN ---
  socket.on('next_turn', (sentBATTLE_ID) => {
    var bInst = battles[sentBATTLE_ID]
    var turnOrder = bInst["TURN_ORDER"]
    var p1Team = bInst["PLAYER_ONE"]["TEAM"]
    var p2Team = bInst["PLAYER_TWO"]["TEAM"]
    var p1UID = bInst["PLAYER_ONE"]["UID"]
    var p2UID = bInst["PLAYER_TWO"]["UID"]

    var p1Skills = bInst["PLAYER_ONE"]["SKILLS_LIST"]
    var p2Skills = bInst["PLAYER_TWO"]["SKILLS_LIST"]

    var p1 = connectedClients.get(bInst["PLAYER_ONE"]["SOCKET_ID"])
    var p2 = connectedClients.get(bInst["PLAYER_TWO"]["SOCKET_ID"])



    //Decide what action to take this turn
    let decisions = {
      "attack": 0.4,
      "technique": 0.4,
      "inspirit": 0.2,
    };

    var choice = weightedRandom(decisions)

    var possibleChoices = []


    var targetSide = -1

    if (turnOrder[0]["UID"] == p1UID) {
      targetSide = 2

      if (p2Team[0]["currentHP"] > 0) {
        possibleChoices.push(0)
      }

      if (p2Team[1]["currentHP"] > 0) {
        possibleChoices.push(1)
      }

      if (p2Team[2]["currentHP"] > 0) {
        possibleChoices.push(2)
      }
    } else {
      targetSide = 1

      if (p1Team[0]["currentHP"] > 0) {
        possibleChoices.push(0)
      }

      if (p1Team[1]["currentHP"] > 0) {
        possibleChoices.push(1)
      }

      if (p1Team[2]["currentHP"] > 0) {
        possibleChoices.push(2)
      }
    }

    var targetIDX = possibleChoices[Math.floor(Math.random() * possibleChoices.length)] // NEEDS TO ACCOUNT FOR FAINTED YOKAI!

    var finalDamage = 0

    var overwrite = false

    switch (choice) {
      case "attack":

        //Increase soultimate meter
        if (targetSide == 1) {
          for (var i = 0; i < p2Team.length; i++) {
            if (turnOrder[0]["order"] == p2Team[i]["order"]) {
              p2Team[i]["soul"] += 50
            }
          }
        } else {
          for (var i = 0; i < p1Team.length; i++) {
            if (turnOrder[0]["order"] == p1Team[i]["order"]) {
              p1Team[i]["soul"] += 50
            }
          }
        }

        var crits = 0
        var misses = 0

        //Needs to account for multi-hit attacks
        for (var i = 0; i < ATTACK_DATABASE[turnOrder[0]["na"]]["hits"]; i++) {


          var bp = ATTACK_DATABASE[turnOrder[0]["na"]]["bp"]
          var element = ATTACK_DATABASE[turnOrder[0]["na"]]["element"]

          d1 = attack(p1Team, p2Team, targetSide, targetIDX, turnOrder)
          finalDamage += d1[0]
          crits += d1[1]
          misses += d1[2]


        }

        var newTeam1
        var newTeam2

        //Check for abilities that activate
        for (var i = 0; i < p1Team.length; i++) {
          if (SKILL_DATABASE[p1Team[i]["skill"]]["events"].indexOf("naDamage") > -1) {
            var dataReturned = SKILL_DATABASE[p1Team[i]["skill"]]["naDamage"](p1Team, p2Team, targetSide, targetIDX, turnOrder, finalDamage, p1Team[i]["order"], 1, i)
            if (dataReturned != "skip") {
              newTeam1 = dataReturned[0]
              newTeam2 = dataReturned[1]
              overwrite = true
            }

          }
        }

        for (var i = 0; i < p2Team.length; i++) {
          if (SKILL_DATABASE[p2Team[i]["skill"]]["events"].indexOf("naDamage") > -1) {
            var dataReturned = SKILL_DATABASE[p2Team[i]["skill"]]["naDamage"](p1Team, p2Team, targetSide, targetIDX, turnOrder, finalDamage, p2Team[i]["order"], 2, i)
            if (dataReturned != "skip") {
              newTeam1 = dataReturned[0]
              newTeam2 = dataReturned[1]
              overwrite = true
            }


          }
        }

        if (overwrite) {
          p1Team = newTeam1
          p2Team = newTeam2
        }

        if (targetSide == 1) {
          if (!overwrite) {
            p1Team[targetIDX]["currentHP"] -= finalDamage
          }


          p1.emit("turn_advanced", { myTeam: p1Team, otherTeam: p2Team, chatMessage: "Opponent's " + turnOrder[0]["displayName"] + " used <em id = 'na'>" + ATTACK_DATABASE[turnOrder[0]["na"]]["displayName"] + "</em id = 'na'> on your " + p1Team[targetIDX]["displayName"] + "! Damage: <em id = 'damage'>" + finalDamage + "</em id = 'damage'> (<em id = 'damage'>" + (Math.floor(finalDamage / p1Team[targetIDX]["hp"] * 100)) + "</em id = 'damage'>%)", crits: crits, misses: misses })
          p2.emit("turn_advanced", { myTeam: p2Team, otherTeam: p1Team, chatMessage: "Your " + turnOrder[0]["displayName"] + " used <em id = 'na'>" + ATTACK_DATABASE[turnOrder[0]["na"]]["displayName"] + "</em id = 'na'> on the opponent's " + p1Team[targetIDX]["displayName"] + "! Damage: <em id = 'damage'>" + finalDamage + "</em id = 'damage'> (<em id = 'damage'>" + (Math.floor(finalDamage / p1Team[targetIDX]["hp"] * 100)) + "</em id = 'damage'%)>", crits: crits, misses: misses })
        } else {
          if (!overwrite) {
            p2Team[targetIDX]["currentHP"] -= finalDamage
          }

          p1.emit("turn_advanced", { myTeam: p1Team, otherTeam: p2Team, chatMessage: "Your " + turnOrder[0]["displayName"] + " used <em id = 'na'>" + ATTACK_DATABASE[turnOrder[0]["na"]]["displayName"] + "</em id = 'na'> on the opponent's " + p2Team[targetIDX]["displayName"] + "! Damage: <em id = 'damage'>" + finalDamage + "</em id = 'damage'> (<em id = 'damage'>" + (Math.floor(finalDamage / p2Team[targetIDX]["hp"] * 100)) + "</em id = 'damage'>%)", crits: crits, misses: misses })
          p2.emit("turn_advanced", { myTeam: p2Team, otherTeam: p1Team, chatMessage: "Opponent's " + turnOrder[0]["displayName"] + " used <em id = 'na'>" + ATTACK_DATABASE[turnOrder[0]["na"]]["displayName"] + "</em id = 'na'> on your " + p2Team[targetIDX]["displayName"] + "! Damage: <em id = 'damage'>" + finalDamage + "</em id = 'damage'> (<em id = 'damage'>" + (Math.floor(finalDamage / p2Team[targetIDX]["hp"] * 100)) + "</em id = 'damage'>%)", crits: crits, misses: misses })
        }

        break
      case "technique":
        //Increase soultimate meter
        if (targetSide == 1) {
          for (var i = 0; i < p2Team.length; i++) {
            if (turnOrder[0]["order"] == p2Team[i]["order"]) {
              p2Team[i]["soul"] += 50
            }
          }
        } else {
          for (var i = 0; i < p1Team.length; i++) {
            if (turnOrder[0]["order"] == p1Team[i]["order"]) {
              p1Team[i]["soul"] += 50
            }
          }
        }

        if (TECHNIQUE_DATABASE[turnOrder[0]["tech"]]["type"] == "heal") {

          for (var i = 0; i < TECHNIQUE_DATABASE[turnOrder[0]["tech"]]["hits"]; i++) {


            var bp = TECHNIQUE_DATABASE[turnOrder[0]["tech"]]["bp"]
            var element = TECHNIQUE_DATABASE[turnOrder[0]["tech"]]["element"]


            d1 = technique(p1Team, p2Team, targetSide, targetIDX, turnOrder)
            finalDamage += d1[0]
            crits += d1[1]
            misses += d1[2]
          }

          if (targetSide == 1) {
            p2Team[targetIDX]["currentHP"] += finalDamage

            p1.emit("turn_advanced", { myTeam: p1Team, otherTeam: p2Team, chatMessage: "Opponent's " + turnOrder[0]["displayName"] + " used <em id = 'heal'>" + TECHNIQUE_DATABASE[turnOrder[0]["tech"]]["displayName"] + "</em id = 'heal'> on their " + p2Team[targetIDX]["displayName"] + "! Heal: <em id = 'heal'>" + finalDamage + "</em id = 'heal'> (<em id = 'heal'>" + (Math.floor(finalDamage / p1Team[targetIDX]["hp"] * 100)) + "</em id = 'heal'>%)", crits: crits, misses: misses })
            p2.emit("turn_advanced", { myTeam: p2Team, otherTeam: p1Team, chatMessage: "Your " + turnOrder[0]["displayName"] + " used <em id = 'heal'>" + TECHNIQUE_DATABASE[turnOrder[0]["tech"]]["displayName"] + "</em id = 'heal'> on your " + p2Team[targetIDX]["displayName"] + "! Heal: <em id = 'heal'>" + finalDamage + "</em id = 'heal'> (<em id = 'heal'>" + (Math.floor(finalDamage / p1Team[targetIDX]["hp"] * 100)) + "</em id = 'heal'>%)", crits: crits, misses: misses })
          } else {
            p1Team[targetIDX]["currentHP"] += finalDamage

            p1.emit("turn_advanced", { myTeam: p1Team, otherTeam: p2Team, chatMessage: "Your " + turnOrder[0]["displayName"] + " used <em id = 'heal'>" + TECHNIQUE_DATABASE[turnOrder[0]["tech"]]["displayName"] + "</em id = 'heal'> on your " + p1Team[targetIDX]["displayName"] + "! Heal: <em id = 'heal'>" + finalDamage + "</em id = 'heal'> (<em id = 'heal'>" + (Math.floor(finalDamage / p2Team[targetIDX]["hp"] * 100)) + "</em id = 'heal'>%)", crits: crits, misses: misses })
            p2.emit("turn_advanced", { myTeam: p2Team, otherTeam: p1Team, chatMessage: "Opponent's " + turnOrder[0]["displayName"] + " used <em id = 'heal'>" + TECHNIQUE_DATABASE[turnOrder[0]["tech"]]["displayName"] + "</em id = 'heal'> on their " + p1Team[targetIDX]["displayName"] + "! Heal: <em id = 'heal'>" + finalDamage + "</em id = 'heal'> (<em id = 'heal'>" + (Math.floor(finalDamage / p2Team[targetIDX]["hp"] * 100)) + "</em id = 'heal'>%)", crits: crits, misses: misses })
          }

        } else if (TECHNIQUE_DATABASE[turnOrder[0]["tech"]]["type"] == "drain") {

          for (var i = 0; i < TECHNIQUE_DATABASE[turnOrder[0].tech].hits; i++) {


            var bp = TECHNIQUE_DATABASE[turnOrder[0].tech].bp
            var element = TECHNIQUE_DATABASE[turnOrder[0].tech].element


            d1 = technique(p1Team, p2Team, targetSide, targetIDX, turnOrder)
            finalDamage += d1[0]
            crits += d1[1]
            misses += d1[2]
          }

          if (targetSide == 1) {
            p1Team[targetIDX]["currentHP"] -= finalDamage

            p1.emit("turn_advanced", { myTeam: p1Team, otherTeam: p2Team, chatMessage: "Opponent's " + turnOrder[0]["displayName"] + " used <em id = 'drain'>" + TECHNIQUE_DATABASE[turnOrder[0]["tech"]]["displayName"] + "</em id = 'drain'> on your " + p1Team[targetIDX]["displayName"] + "! Damage: <em id = 'damage'>" + finalDamage + "</em id = 'damage'> (<em id = 'damage'>" + (Math.floor(finalDamage / p1Team[targetIDX]["hp"] * 100)) + "</em id = 'damage'>%)", crits: crits, misses: misses })
            p2.emit("turn_advanced", { myTeam: p2Team, otherTeam: p1Team, chatMessage: "Your " + turnOrder[0]["displayName"] + " used <em id = 'drain'>" + TECHNIQUE_DATABASE[turnOrder[0]["tech"]]["displayName"] + "</em id = 'drain'> on the opponent's " + p1Team[targetIDX]["displayName"] + "! Damage: <em id = 'damage'>" + finalDamage + "</em id = 'damage'> (<em id = 'damage'>" + (Math.floor(finalDamage / p1Team[targetIDX]["hp"] * 100)) + "</em id = 'damage'>%)", crits: crits, misses: misses })
          } else {
            p2Team[targetIDX]["currentHP"] -= finalDamage

            p1.emit("turn_advanced", { myTeam: p1Team, otherTeam: p2Team, chatMessage: "Your " + turnOrder[0]["displayName"] + " used <em id = 'drain'>" + TECHNIQUE_DATABASE[turnOrder[0]["tech"]]["displayName"] + "</em id = 'drain'> on the opponent's " + p2Team[targetIDX]["displayName"] + "! Damage: <em id = 'damage'>" + finalDamage + "</em id = 'damage'> (<em id = 'damage'>" + (Math.floor(finalDamage / p2Team[targetIDX]["hp"] * 100)) + "</em id = 'damage'>%)", crits: crits, misses: misses })
            p2.emit("turn_advanced", { myTeam: p2Team, otherTeam: p1Team, chatMessage: "Opponent's " + turnOrder[0]["displayName"] + " used <em id = 'drain'>" + TECHNIQUE_DATABASE[turnOrder[0]["tech"]]["displayName"] + "</em id = 'drain'> on your " + p2Team[targetIDX]["displayName"] + "! Damage: <em id = 'damage'>" + finalDamage + "</em id = 'damage'> (<em id = 'damage'>" + (Math.floor(finalDamage / p2Team[targetIDX]["hp"] * 100)) + "</em id = 'damage'>%)", crits: crits, misses: misses })
          }

        } else {

          for (var i = 0; i < TECHNIQUE_DATABASE[turnOrder[0].tech].hits; i++) {


            var bp = TECHNIQUE_DATABASE[turnOrder[0].tech].bp
            var element = TECHNIQUE_DATABASE[turnOrder[0].tech].element

            d1 = technique(p1Team, p2Team, targetSide, targetIDX, turnOrder)
            finalDamage += d1[0]
            crits += d1[1]
            misses += d1[2]

          }



          if (targetSide == 1) {
            p1Team[targetIDX]["currentHP"] -= finalDamage

            p1.emit("turn_advanced", { myTeam: p1Team, otherTeam: p2Team, chatMessage: "Opponent's " + turnOrder[0]["displayName"] + " used <em id = 'tech'>" + TECHNIQUE_DATABASE[turnOrder[0]["tech"]]["displayName"] + "</em id = 'tech'> on your " + p1Team[targetIDX]["displayName"] + "! Damage: <em id = 'damage'>" + finalDamage + "</em id = 'damage'> (<em id = 'damage'>" + (Math.floor(finalDamage / p1Team[targetIDX]["hp"] * 100)) + "</em id = 'damage'>%)", crits: crits, misses: misses })
            p2.emit("turn_advanced", { myTeam: p2Team, otherTeam: p1Team, chatMessage: "Your " + turnOrder[0]["displayName"] + " used <em id = 'tech'>" + TECHNIQUE_DATABASE[turnOrder[0]["tech"]]["displayName"] + "</em id = 'tech'> on the opponent's " + p1Team[targetIDX]["displayName"] + "! Damage: <em id = 'damage'>" + finalDamage + "</em id = 'damage'> (<em id = 'damage'>" + (Math.floor(finalDamage / p1Team[targetIDX]["hp"] * 100)) + "</em id = 'damage'>%)", crits: crits, misses: misses })
          } else {
            p2Team[targetIDX]["currentHP"] -= finalDamage

            p1.emit("turn_advanced", { myTeam: p1Team, otherTeam: p2Team, chatMessage: "Your " + turnOrder[0]["displayName"] + " used <em id = 'tech'>" + TECHNIQUE_DATABASE[turnOrder[0]["tech"]]["displayName"] + "</em id = 'tech'> on the opponent's " + p2Team[targetIDX]["displayName"] + "! Damage: <em id = 'damage'>" + finalDamage + "</em id = 'damage'> (<em id = 'damage'>" + (Math.floor(finalDamage / p2Team[targetIDX]["hp"] * 100)) + "</em id = 'damage'>%)", crits: crits, misses: misses })
            p2.emit("turn_advanced", { myTeam: p2Team, otherTeam: p1Team, chatMessage: "Opponent's " + turnOrder[0]["displayName"] + " used <em id = 'tech'>" + TECHNIQUE_DATABASE[turnOrder[0]["tech"]]["displayName"] + "</em id = 'tech'> on your " + p2Team[targetIDX]["displayName"] + "! Damage: <em id = 'damage'>" + finalDamage + "</em id = 'damage'> (<em id = 'damage'>" + (Math.floor(finalDamage / p2Team[targetIDX]["hp"] * 100)) + "</em id = 'damage'>%)", crits: crits, misses: misses })
          }

        }
        break
      case "inspirit":
        //Increase soultimate meter
        if (targetSide == 1) {
          for (var i = 0; i < p2Team.length; i++) {
            if (turnOrder[0]["order"] == p2Team[i]["order"]) {
              p2Team[i]["soul"] += 50
            }
          }
        } else {
          for (var i = 0; i < p1Team.length; i++) {
            if (turnOrder[0]["order"] == p1Team[i]["order"]) {
              p1Team[i]["soul"] += 50
            }
          }
        }

        var d1 = inspirit(p1Team, p2Team, targetSide, targetIDX, turnOrder)

        if (d1[0] == "positive") {
          if (targetSide == 1) {
            p1.emit("turn_advanced", { myTeam: p1Team, otherTeam: p2Team, chatMessage: "Opponent's " + turnOrder[0]["displayName"] + " gave <em id = 'inspirit'>" + INSPIRIT_DATABASE[turnOrder[0]["insp"]]["displayName"] + "</em id = 'inspirit'> on their " + p2Team[targetIDX]["displayName"], crits: -1, misses: misses })
            p2.emit("turn_advanced", { myTeam: p2Team, otherTeam: p1Team, chatMessage: "Your " + turnOrder[0]["displayName"] + " gave <em id = 'inspirit'>" + INSPIRIT_DATABASE[turnOrder[0]["insp"]]["displayName"] + "</em id = 'inspirit'> on your " + p2Team[targetIDX]["displayName"], crits: -1, misses: misses })
          } else {
            p1.emit("turn_advanced", { myTeam: p1Team, otherTeam: p2Team, chatMessage: "Your " + turnOrder[0]["displayName"] + " gave <em id = 'inspirit'>" + INSPIRIT_DATABASE[turnOrder[0]["insp"]]["displayName"] + "</em id = 'inspirit'> on your " + p1Team[targetIDX]["displayName"], crits: -1, misses: misses })
            p2.emit("turn_advanced", { myTeam: p2Team, otherTeam: p1Team, chatMessage: "Opponent's " + turnOrder[0]["displayName"] + " gave <em id = 'inspirit'>" + INSPIRIT_DATABASE[turnOrder[0]["insp"]]["displayName"] + "</em id = 'inspirit'> on their " + p1Team[targetIDX]["displayName"], crits: -1, misses: misses })
          }

        }

    }

    if (p1Team[0]["currentHP"] <= 0 && p1Team[1]["currentHP"] <= 0 && p1Team[2]["currentHP"] <= 0 && p1Team[3]["currentHP"] <= 0 && p1Team[4]["currentHP"] <= 0 && p1Team[5]["currentHP"] <= 0) {
      p1.emit("defeat")
      p2.emit("victory")

      return
    }

    if (p2Team[0]["currentHP"] <= 0 && p2Team[1]["currentHP"] <= 0 && p2Team[2]["currentHP"] <= 0 && p2Team[3]["currentHP"] <= 0 && p2Team[4]["currentHP"] <= 0 && p2Team[5]["currentHP"] <= 0) {
      p1.emit("victory")
      p2.emit("defeat")

      return
    }

    //Check if the front yokai are all down and force a switch
    if (p1Team[0]["currentHP"] <= 0 && p1Team[1]["currentHP"] <= 0 && p1Team[2]["currentHP"] <= 0) {
      var temp = [p1Team[3], p1Team[4], p1Team[5], p1Team[0], p1Team[1], p1Team[2]]
      bInst["PLAYER_ONE"]["TEAM"] = temp

      p1.emit("front_fainted", { myTeam: battles[sentBATTLE_ID]["PLAYER_ONE"]["TEAM"], otherTeam: battles[sentBATTLE_ID]["PLAYER_TWO"]["TEAM"] })
      p2.emit("front_fainted", { myTeam: battles[sentBATTLE_ID]["PLAYER_TWO"]["TEAM"], otherTeam: battles[sentBATTLE_ID]["PLAYER_ONE"]["TEAM"] })
    }

    if (p2Team[0]["currentHP"] <= 0 && p2Team[1]["currentHP"] <= 0 && p2Team[2]["currentHP"] <= 0) {
      var temp = [p2Team[3], p2Team[4], p2Team[5], p2Team[0], p2Team[1], p2Team[2]]
      bInst["PLAYER_TWO"]["TEAM"] = temp

      p1.emit("front_fainted", { myTeam: battles[sentBATTLE_ID]["PLAYER_ONE"]["TEAM"], otherTeam: battles[sentBATTLE_ID]["PLAYER_TWO"]["TEAM"] })
      p2.emit("front_fainted", { myTeam: battles[sentBATTLE_ID]["PLAYER_TWO"]["TEAM"], otherTeam: battles[sentBATTLE_ID]["PLAYER_ONE"]["TEAM"] })
    }



    //Update turn order

    for (var i = 0; i < turnOrder.length; i++) {
      if (turnOrder[i]["currentHP"] <= 0) {
        turnOrder.splice(i, 1)
        i--
      }
    }

    for (var i = 1; i < turnOrder.length; i++) {
      turnOrder[i]["AP"] -= turnOrder[0]["AP"]
      if (turnOrder[i]["AP"] < 0) {
        turnOrder[i]["AP"] = 0
      }
    }



    bInst["TURN_ORDER"][0]["AP"] = calcAP(bInst["TURN_ORDER"][0]["spd"], 1)

    bInst["TURN_ORDER"] = bInst["TURN_ORDER"].sort((a, b) => a["AP"] - b["AP"])
  });



  // -- ROTATE WHEEL ---
  socket.on('rotate_wheel', (sentBATTLE_ID, sentUID, sentRotation) => {


    var myTeam
    var otherTeam

    var bInst = battles[sentBATTLE_ID]
    var p1Team = bInst["PLAYER_ONE"]["TEAM"]
    var p2Team = bInst["PLAYER_TWO"]["TEAM"]

    if (sentUID == bInst["PLAYER_ONE"]["UID"]) {
      myTeam = bInst["PLAYER_ONE"]["TEAM"]
      otherTeam = bInst["PLAYER_TWO"]["TEAM"]
    } else {
      myTeam = bInst["PLAYER_TWO"]["TEAM"]
      otherTeam = bInst["PLAYER_ONE"]["TEAM"]
    }

    var temp = []

    var first
    var second
    var third
    var fourth
    var fifth
    var sixth

    for (var i = 0; i < myTeam.length; i++) {
      if (myTeam[i]["order"] == 1) {
        first = myTeam[i]
      }
      if (myTeam[i]["order"] == 2) {
        second = myTeam[i]
      }
      if (myTeam[i]["order"] == 3) {
        third = myTeam[i]
      }
      if (myTeam[i]["order"] == 4) {
        fourth = myTeam[i]
      }
      if (myTeam[i]["order"] == 5) {
        fifth = myTeam[i]
      }
      if (myTeam[i]["order"] == 6) {
        sixth = myTeam[i]
      }
    }



    if (sentRotation == 0) {
      temp = [first, second, third, fourth, fifth, sixth]
    } else if (sentRotation == 1) {
      temp = [sixth, first, second, third, fourth, fifth]
    } else if (sentRotation == 2) {
      temp = [fifth, sixth, first, second, third, fourth]
    } else if (sentRotation == 3) {
      temp = [fourth, fifth, sixth, first, second, third]
    } else if (sentRotation == 4) {
      temp = [third, fourth, fifth, sixth, first, second]
    } else if (sentRotation == 5) {
      temp = [second, third, fourth, fifth, sixth, first]
    }

    var p1UID = bInst["PLAYER_ONE"]["UID"]
    var p2UID = bInst["PLAYER_TWO"]["UID"]

    var p1 = connectedClients.get(bInst["PLAYER_ONE"]["SOCKET_ID"])
    var p2 = connectedClients.get(bInst["PLAYER_TWO"]["SOCKET_ID"])



    if (sentUID == bInst["PLAYER_ONE"]["UID"]) {
      battles[sentBATTLE_ID]["PLAYER_ONE"]["TEAM"] = temp

      //Check if the front yokai are all down and force a switch
      if (temp[0]["currentHP"] <= 0 && temp[1]["currentHP"] <= 0 && temp[2]["currentHP"] <= 0) {
        var newTemp = [temp[3], temp[4], temp[5], temp[0], temp[1], temp[2]]
        battles[sentBATTLE_ID]["PLAYER_ONE"]["TEAM"] = newTemp

        p1.emit("front_fainted", { myTeam: battles[sentBATTLE_ID]["PLAYER_ONE"]["TEAM"], otherTeam: battles[sentBATTLE_ID]["PLAYER_TWO"]["TEAM"] })
        p2.emit("front_fainted", { myTeam: battles[sentBATTLE_ID]["PLAYER_TWO"]["TEAM"], otherTeam: battles[sentBATTLE_ID]["PLAYER_ONE"]["TEAM"] })
      } else {
        p1.emit("update_teams", { myTeam: battles[sentBATTLE_ID]["PLAYER_ONE"]["TEAM"], otherTeam: otherTeam })
        p2.emit("update_teams", { myTeam: otherTeam, otherTeam: battles[sentBATTLE_ID]["PLAYER_ONE"]["TEAM"] })
      }


    } else {
      //Check if the front yokai are all down and force a switch
      if (temp[0]["currentHP"] <= 0 && temp[1]["currentHP"] <= 0 && temp[2]["currentHP"] <= 0) {
        var newTemp = [temp[3], temp[4], temp[5], temp[0], temp[1], temp[2]]
        battles[sentBATTLE_ID]["PLAYER_TWO"]["TEAM"] = newTemp

        p1.emit("front_fainted", { myTeam: battles[sentBATTLE_ID]["PLAYER_ONE"]["TEAM"], otherTeam: battles[sentBATTLE_ID]["PLAYER_TWO"]["TEAM"] })
        p2.emit("front_fainted", { myTeam: battles[sentBATTLE_ID]["PLAYER_TWO"]["TEAM"], otherTeam: battles[sentBATTLE_ID]["PLAYER_ONE"]["TEAM"] })
      } else {
        battles[sentBATTLE_ID]["PLAYER_TWO"]["TEAM"] = temp

        p1.emit("update_teams", { myTeam: otherTeam, otherTeam: battles[sentBATTLE_ID]["PLAYER_TWO"]["TEAM"] })
        p2.emit("update_teams", { myTeam: battles[sentBATTLE_ID]["PLAYER_TWO"]["TEAM"], otherTeam: otherTeam })
      }
    }

    bInst["TURN_ORDER"] = [p1Team[0], p1Team[1], p1Team[2], p2Team[0], p2Team[1], p2Team[2]]

    var turnOrder = battles[sentBATTLE_ID]["TURN_ORDER"]

    //Update turn order

    for (var i = 0; i < turnOrder.length; i++) {
      if (turnOrder[i]["currentHP"] <= 0) {
        turnOrder.splice(i, 1)
        i--
      }
    }

    battles[sentBATTLE_ID]["TURN_ORDER"][0]["AP"] = calcAP(bInst["TURN_ORDER"][0]["spd"], 1)

    battles[sentBATTLE_ID]["TURN_ORDER"] = battles[sentBATTLE_ID]["TURN_ORDER"].sort((a, b) => a["AP"] - b["AP"])
  })

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    connectedClients.delete(socket.id)
  });
});


// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Server functions

//VALIDATE_TEAM
function validate_team(sentTeam) {
  var problems = []


  for (var i = 1; i < sentTeam.length; i++) {
    var yokai = sentTeam[i]

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

function weightedRandom(options) {
  let i, sum = 0, r = Math.random();
  for (i in options) {
    sum += options[i];
    if (r <= sum) return i;
  }
}


function attack(p1Team, p2Team, targetSide, targetIDX, turnOrder) {
  var d1
  var overwrite = false

  var type = ATTACK_DATABASE[turnOrder[0]["na"]]["type"]
  var element = ATTACK_DATABASE[turnOrder[0]["na"]]["element"]
  var bp = ATTACK_DATABASE[turnOrder[0]["na"]]["bp"]
  var userSTR = turnOrder[0]["str"]
  var targetDEF = 0
  var targetGuard = 0
  var targetCode = ""

  var critRoll = Math.floor(Math.random() * 3)
  var isCrit = 0
  var critMult = 1

  var isMiss = 0


  if (targetSide == 1) {
    targetDEF = p1Team[targetIDX]["def"]
    targetGuard = p1Team[targetIDX]["guard"]
    targetCode = p1Team[targetIDX]["code"]
  } else {
    targetDEF = p2Team[targetIDX]["def"]
    targetGuard = p2Team[targetIDX]["guard"]
    targetCode = p2Team[targetIDX]["code"]
  }

  if (critRoll == 0) {
    isCrit = 1
    targetDEF = 0
    critMult = 1.25
  }

  var res = 1

  if (element == "none") {
    res = 1
  } else {
    res = YOKAI_DATABASE[targetCode][element]
  }

  //Check for abilities that activate
  for (var i = 0; i < p1Team.length; i++) {
    if (SKILL_DATABASE[p1Team[i]["skill"]]["events"].includes("naCalc")) {
      var dataReturned = SKILL_DATABASE[p1Team[i]["skill"]]["naCalc"](p1Team, p2Team, targetSide, targetIDX, turnOrder, type, element, bp, res, p1Team[i]["order"], 1)
      if (dataReturned != "skip") {
        d1 = dataReturned[0]
        isCrit = dataReturned[1]
        isMiss = dataReturned[2]
        overwrite = true
      }

    }
  }

  for (var i = 0; i < p2Team.length; i++) {
    if (SKILL_DATABASE[p2Team[i]["skill"]]["events"].includes("naCalc")) {
      var dataReturned = SKILL_DATABASE[p2Team[i]["skill"]]["naCalc"](p1Team, p2Team, targetSide, targetIDX, turnOrder, type, element, bp, res, p2Team[i]["order"])
      if (dataReturned != "skip") {
        d1 = dataReturned[0]
        isCrit = dataReturned[1]
        isMiss = dataReturned[2]
        overwrite = true
      }

    }
  }

  if (overwrite) {
    return [d1, isCrit, isMiss]
  }


  //No skills active, run normally.


  var randMult = Math.random() * 0.2 + 0.9
  var finalMult = Math.round(randMult * 100) / 100 //Use this- not randMult!

  d1 = Math.floor(((userSTR / 2) + (bp / 2) - (targetDEF / 4)) * critMult * finalMult * res * targetGuard)

  var missRoll = Math.floor(Math.random() * 3)

  if (missRoll == 0) {
    d1 = 0
    isMiss = 1
  }



  return [d1, isCrit, isMiss]
}

function technique(p1Team, p2Team, targetSide, targetIDX, turnOrder) {

  var d1
  var overwrite = false

  var type = TECHNIQUE_DATABASE[turnOrder[0]["tech"]]["type"]
  var element = TECHNIQUE_DATABASE[turnOrder[0]["tech"]]["element"]
  var bp = TECHNIQUE_DATABASE[turnOrder[0]["tech"]]["bp"]
  var userSPR = turnOrder[0]["spr"]
  var targetDEF = 0
  var targetGuard = 0
  var targetCode = ""

  var critRoll = Math.floor(Math.random() * 20)
  var isCrit = 0
  var critMult = 1

  var isMiss = 0

  if (critRoll == 0) {
    isCrit = 1
    targetDEF = 0
    critMult = 1.25
  }

  if (targetSide == 1) {
    targetDEF = p1Team[targetIDX]["def"]
    targetGuard = p1Team[targetIDX]["guard"]
    targetCode = p1Team[targetIDX]["code"]
  } else {
    targetDEF = p2Team[targetIDX]["def"]
    targetGuard = p2Team[targetIDX]["guard"]
    targetCode = p2Team[targetIDX]["code"]
  }

  var res = 1

  if (element == "none") {
    res = 1
  } else {
    res = YOKAI_DATABASE[targetCode][element]
  }

  //Check for abilities that activate
  for (var i = 0; i < p1Team.length; i++) {
    if (SKILL_DATABASE[p1Team[i]["skill"]]["events"].indexOf("techCalc") > -1) {
      var dataReturned = SKILL_DATABASE[p1Team[i]["skill"]]["techCalc"](p1Team, p2Team, targetSide, targetIDX, turnOrder, type, element, bp, res, p1Team[i]["order"], 1)
      if (dataReturned != "skip") {
        d1 = dataReturned[0]
        isCrit = dataReturned[1]
        isMiss = dataReturned[2]
        overwrite = true
      }

    }
  }

  for (var i = 0; i < p2Team.length; i++) {
    if (SKILL_DATABASE[p2Team[i]["skill"]]["events"].indexOf("techCalc") > -1) {
      var dataReturned = SKILL_DATABASE[p2Team[i]["skill"]]["techCalc"](p1Team, p2Team, targetSide, targetIDX, turnOrder, type, element, bp, res, p2Team[i]["order"])
      if (dataReturned != "skip") {
        d1 = dataReturned[0]
        isCrit = dataReturned[1]
        isMiss = dataReturned[2]
        overwrite = true
      }

    }
  }

  if (overwrite) {
    return [d1, isCrit, isMiss]
  }





  if (type == "damage") {


    var randMult = Math.random() * 0.2 + 0.9
    var finalMult = Math.round(randMult * 100) / 100 //Use this- not randMult!

    d1 = Math.floor(((userSPR / 2) + (bp / 2) - (targetDEF / 4)) * finalMult * critMult * res * targetGuard)


  } else if (type == "drain") {
    var res = 1

    var randMult = Math.random() * 0.2 + 0.9
    var finalMult = Math.round(randMult * 100) / 100 //Use this- not randMult!

    d1 = Math.floor(((userSPR / 2) + (bp / 2) - (targetDEF / 4)) * finalMult * critMult * res * targetGuard)


  } else {

    var randMult = Math.random() * 0.2 + 0.9
    var finalMult = Math.round(randMult * 100) / 100 //Use this- not randMult!

    d1 = Math.floor(((userSPR / 2) + (bp / 2) - (targetDEF / 4)) * finalMult * critMult * targetGuard)


  }

  var missRoll = Math.floor(Math.random() * 25)

  if (missRoll == 0) {
    d1 = 0
    isMiss = 1
  }

  return [d1, isCrit, isMiss]
}

function inspirit(p1Team, p2Team, targetSide, targetIDX, turnOrder) {
  var type = INSPIRIT_DATABASE[turnOrder[0]["insp"]]["type"]

  if (type == "positive") {
    if (targetSide == 1) {
      p2Team[targetIDX]["currentInspirits"].push({
        "tag": INSPIRIT_DATABASE[turnOrder[0]["insp"]]["tags"],
        "type": type,
        "age": 0,
      })
    } else {
      p1Team[targetIDX]["currentInspirits"].push({
        "tag": INSPIRIT_DATABASE[turnOrder[0]["insp"]]["tags"],
        "type": type,
        "age": 0,
      })
    }
  } else {
    if (targetSide == 1) {
      p1Team[targetIDX]["currentInspirits"].push({
        "tag": INSPIRIT_DATABASE[turnOrder[0]["insp"]]["tags"],
        "type": type,
        "age": 0,
      })
    } else {
      p2Team[targetIDX]["currentInspirits"].push({
        "tag": INSPIRIT_DATABASE[turnOrder[0]["insp"]]["tags"],
        "type": type,
        "age": 0,
      })
    }
  }

  return [type]
}


// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});