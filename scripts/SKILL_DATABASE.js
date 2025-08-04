const SKILL_DATABASE = {
  "windPlay" : {
    "events": ["techCalc"],
    "techCalc":  function techCalc(p1Team, p2Team, targetSide, targetIDX, turnOrder, type, attribute, bp, res, skillOrder, skillSide, skillIDX, critRoll) {
      if ( turnOrder[0]["order"] == skillOrder &&  !(skillSide == targetSide) ) {
        var d1


        var userSPR = turnOrder[0]["spr"]
        var targetDEF = 0
        var targetGuard = 0
        var targetCode = ""

        var isCrit = 0
        var critMult = 1

        var isMiss = 0

        if ( critRoll == 0 ) {
          isCrit = 1
          targetDEF = 0
          critMult = 1.25
        }

        if ( targetSide == 1 ) {
          targetDEF = p1Team[targetIDX]["def"]
          targetGuard = p1Team[targetIDX]["guard"]
          targetCode = p1Team[targetIDX]["code"]
        } else {
          targetDEF = p2Team[targetIDX]["def"]
          targetGuard = p2Team[targetIDX]["guard"]
          targetCode = p2Team[targetIDX]["code"]
        }
        

        if (type == "damage") {

            var randMult = Math.random() * 0.2 + 0.9
            var finalMult = Math.round(randMult * 100) / 100 //Use this- not randMult!

            d1 = Math.floor(((userSPR / 2) + (bp / 2) - (targetDEF / 4)) * finalMult * res * targetGuard * 1.2)


        } else if (type == "drain") {  

            var randMult = Math.random() * 0.2 + 0.9
            var finalMult = Math.round(randMult * 100) / 100 //Use this- not randMult!

            d1 = Math.floor(((userSPR / 2) + (bp / 2) - (targetDEF / 4)) * finalMult * res * targetGuard * 1.2)


        } else {

            var randMult = Math.random() * 0.2 + 0.9
            var finalMult = Math.round(randMult * 100) / 100 //Use this- not randMult!

            d1 = Math.floor(((userSPR / 2) + (bp / 2) - (targetDEF / 4)) * finalMult * targetGuard * 1.2)


        }


        return [d1, isCrit, isMiss]


      } else {
        return "skip"
      }
      
    },
 },
  "extremeCritical" : {
    "events": ["naCalc", "techCalc"],
    "naCalc":  function techCalc(p1Team, p2Team, targetSide, targetIDX, turnOrder, type, attribute, bp, res, skillOrder, skillSide, skillIDX, critRoll) {
      if ( turnOrder[0]["order"] == skillOrder &&  !(skillSide == targetSide)) {
        var d1
        var userSTR = turnOrder[0]["str"]
        var targetDEF = 0
        var targetGuard = 0
        var targetCode = ""
        
        var isCrit = 0
        var critMult = 1
        
        var isMiss = 0
          
        
        if ( targetSide == 1 ) {
          targetDEF = p1Team[targetIDX]["def"]
          targetGuard = p1Team[targetIDX]["guard"]
          targetCode = p1Team[targetIDX]["code"]
        } else {
          targetDEF = p2Team[targetIDX]["def"]
          targetGuard = p2Team[targetIDX]["guard"]
          targetCode = p2Team[targetIDX]["code"]
        }
        
        if ( critRoll == 0 ) {
          isCrit = 1
          targetDEF = 0
          critMult = 1.875
        }
      
        
      
        var randMult = Math.random() * 0.2 + 0.9
        var finalMult = Math.round(randMult * 100) / 100 //Use this- not randMult!
      
        d1 = Math.floor(((userSTR / 2) + (bp / 2) - (targetDEF / 4)) * critMult * finalMult * res * targetGuard)
    
      
        
      
        return [d1, isCrit, isMiss]
      } else {
        return "skip"
      }
      
    
    },
    "techCalc":  function techCalc(p1Team, p2Team, targetSide, targetIDX, turnOrder, type, attribute, bp, res, skillOrder, skillSide, skillIDX, critRoll) {
      if ( turnOrder[0]["order"] == skillOrder &&  !(skillSide == targetSide)) {
        var d1


        var userSPR = turnOrder[0]["spr"]
        var targetDEF = 0
        var targetGuard = 0
        var targetCode = ""

        var isCrit = 0
        var critMult = 1

        var isMiss = 0

        if ( critRoll == 0 ) {
          isCrit = 1
          targetDEF = 0
          critMult = 1.875
        }

        if ( targetSide == 1 ) {
          targetDEF = p1Team[targetIDX]["def"]
          targetGuard = p1Team[targetIDX]["guard"]
          targetCode = p1Team[targetIDX]["code"]
        } else {
          targetDEF = p2Team[targetIDX]["def"]
          targetGuard = p2Team[targetIDX]["guard"]
          targetCode = p2Team[targetIDX]["code"]
        }
        

        if (type == "damage") {

            var randMult = Math.random() * 0.2 + 0.9
            var finalMult = Math.round(randMult * 100) / 100 //Use this- not randMult!

            d1 = Math.floor(((userSPR / 2) + (bp / 2) - (targetDEF / 4)) * finalMult * res * targetGuard)


        } else if (type == "drain") {  

            var randMult = Math.random() * 0.2 + 0.9
            var finalMult = Math.round(randMult * 100) / 100 //Use this- not randMult!

            d1 = Math.floor(((userSPR / 2) + (bp / 2) - (targetDEF / 4)) * finalMult * res * targetGuard)


        } else {

            var randMult = Math.random() * 0.2 + 0.9
            var finalMult = Math.round(randMult * 100) / 100 //Use this- not randMult!

            d1 = Math.floor(((userSPR / 2) + (bp / 2) - (targetDEF / 4)) * finalMult * targetGuard)


        }



        return [d1, isCrit, isMiss]


      } else {
        return "skip"
      }
      
    },
  },
  "toadallySaved" : {
    "events": ["naDamage", "techDamage"],
    "naDamage":  function naDamage(p1Team, p2Team, targetSide, targetIDX, turnOrder, pendingDamage, skillOrder, skillSide, skillIDX, crits) {
      if (skillSide == targetSide) {
        if ( (targetSide == 1) && (p1Team[targetIDX]["currentHP"] <= pendingDamage) && (p1Team[skillIDX]["currentHP"] > 0) && ((p1Team[0]["displayName"] == "Toadal Dude") || (p1Team[1]["displayName"] == "Toadal Dude") || (p1Team[2]["displayName"] == "Toadal Dude")) ) {
          p1Team[userIDX]["currentHP"] -= pendingDamage
          return [p1Team, p2Team]
        } else if ( (targetSide == 2) && (p2Team[targetIDX]["currentHP"] <= pendingDamage) && (p2Team[skillIDX]["currentHP"] > 0) && (p2Team[targetIDX]["currentHP"] <= pendingDamage) && ((p2Team[0]["displayName"] == "Toadal Dude") || (p2Team[1]["displayName"] == "Toadal Dude") || (p2Team[2]["displayName"] == "Toadal Dude")) ) {
          p2Team[userIDX]["currentHP"] -= pendingDamage
          return [p1Team, p2Team]
        } else {
          return "skip"
        }
      } else {
        return "skip"
      }
      
    },
    "techDamage":  function techDamage(p1Team, p2Team, targetSide, targetIDX, turnOrder, pendingDamage, skillOrder, skillSide, skillIDX, crits) {
      if (skillSide == targetSide) {
        if ( (targetSide == 1) && (p1Team[targetIDX]["currentHP"] <= pendingDamage) && (p1Team[skillIDX]["currentHP"] > 0) && ((p1Team[0]["displayName"] == "Toadal Dude") || (p1Team[1]["displayName"] == "Toadal Dude") || (p1Team[2]["displayName"] == "Toadal Dude")) ) {
          p1Team[userIDX]["currentHP"] -= pendingDamage
          return [p1Team, p2Team]
        } else if ( (targetSide == 2) && (p2Team[targetIDX]["currentHP"] <= pendingDamage) && (p2Team[skillIDX]["currentHP"] > 0) && (p2Team[targetIDX]["currentHP"] <= pendingDamage) && ((p2Team[0]["displayName"] == "Toadal Dude") || (p2Team[1]["displayName"] == "Toadal Dude") || (p2Team[2]["displayName"] == "Toadal Dude")) ) {
          p2Team[userIDX]["currentHP"] -= pendingDamage
          return [p1Team, p2Team]
        } else {
          return "skip"
        }
      } else {
        return "skip"
      }
      
    },
  },
  "senseOfSmell" : {
    "events" : ["naRollAccuracy", "techRollAccuracy", "soultRollAccuracy"],
      "naRollAccuracy" : function naRollAccuracy(p1Team, p2Team, targetSide, targetIDX, turnOrder, skillOrder, skillSide, skillIDX, crits) {


        if ( skillSide == 1 && p1Team[skillIDX]["currentHP"] <= 0 ) {
          return "skip"
        }
        if ( skillSide == 2 && p2Team[skillIDX]["currentHP"] <= 0 ) {
          return "skip"
        }



        if ( turnOrder[0]["order"] == skillOrder &&  !(skillSide == targetSide) ) {
          return [999]
        } else {
          return "skip"
        }
      },
      "techRollAccuracy" : function techRollAccuracy(p1Team, p2Team, targetSide, targetIDX, turnOrder, skillOrder, skillSide, skillIDX, crits) {


        if ( skillSide == 1 && p1Team[skillIDX]["currentHP"] <= 0 ) {
          return "skip"
        }
        if ( skillSide == 2 && p2Team[skillIDX]["currentHP"] <= 0 ) {
          return "skip"
        }



        if ( turnOrder[0]["order"] == skillOrder &&  !(skillSide == targetSide) ) {
          return [999]
        } else {
          return "skip"
        }
      },
      "soultRollAccuracy" : function soultRollAccuracy(p1Team, p2Team, targetSide, targetIDX, turnOrder, skillOrder, skillSide, skillIDX, crits) {


        if ( skillSide == 1 && p1Team[skillIDX]["currentHP"] <= 0 ) {
          return "skip"
        }
        if ( skillSide == 2 && p2Team[skillIDX]["currentHP"] <= 0 ) {
          return "skip"
        }



        if ( turnOrder[0]["order"] == skillOrder &&  !(skillSide == targetSide) ) {
          return [999]
        } else {
          return "skip"
        }
      },
  },
  "caring" : {
    "events": ["turnEnd"],
    "turnEnd":  function turnEnd(p1Team, p2Team, turnOrder, skillOrder, skillSide, skillIDX) {
      if ( skillIDX == 0 &&  (skillSide == 1) ) {
        
        p1Team[1]["currentHP"] += p1Team[1]["hp"] * 0.02
        if ( p1Team[1]["currentHP"] > p1Team[1]["hp"] ) {
          p1Team[1]["currentHP"] = p1Team[1]["hp"]
        }

        p1Team[2]["currentHP"] += p1Team[2]["hp"] * 0.02
        if ( p1Team[2]["currentHP"] > p1Team[2]["hp"] ) {
          p1Team[2]["currentHP"] = p1Team[2]["hp"]
        }
      
        return [p1Team, p2Team]
      } else if ( skillIDX == 1 &&  (skillSide == 1) ) {

        p1Team[0]["currentHP"] += p1Team[0]["hp"] * 0.02
        if ( p1Team[0]["currentHP"] > p1Team[0]["hp"] ) {
          p1Team[0]["currentHP"] = p1Team[0]["hp"]
        }

        p1Team[2]["currentHP"] += p1Team[2]["hp"] * 0.02
        if ( p1Team[2]["currentHP"] > p1Team[2]["hp"] ) {
          p1Team[2]["currentHP"] = p1Team[2]["hp"]
        }
      

        return [p1Team, p2Team]
      } else if ( skillIDX == 2 &&  (skillSide == 1) ) {

        p1Team[0]["currentHP"] += p1Team[0]["hp"] * 0.02
        if ( p1Team[0]["currentHP"] > p1Team[0]["hp"] ) {
          p1Team[0]["currentHP"] = p1Team[0]["hp"]
        }

        p1Team[1]["currentHP"] += p1Team[1]["hp"] * 0.02
        if ( p1Team[1]["currentHP"] > p1Team[1]["hp"] ) {
          p1Team[1]["currentHP"] = p1Team[1]["hp"]
        }
      

        return [p1Team, p2Team]
      } else if ( skillIDX == 0 &&  (skillSide == 2) ) {
        
        p2Team[1]["currentHP"] += p2Team[1]["hp"] * 0.02
        if ( p2Team[1]["currentHP"] > p2Team[1]["hp"] ) {
          p2Team[1]["currentHP"] = p2Team[1]["hp"]
        }

        p2Team[2]["currentHP"] += p2Team[2]["hp"] * 0.02
        if ( p2Team[2]["currentHP"] > p2Team[2]["hp"] ) {
          p2Team[2]["currentHP"] = p2Team[2]["hp"]
        }

      
        return [p1Team, p2Team]
      } else if ( skillIDX == 1 &&  (skillSide == 2) ) {

        p2Team[0]["currentHP"] += p2Team[0]["hp"] * 0.02
        if ( p2Team[0]["currentHP"] > p2Team[0]["hp"] ) {
          p2Team[0]["currentHP"] = p2Team[0]["hp"]
        }

        p2Team[2]["currentHP"] += p2Team[2]["hp"] * 0.02
        if ( p2Team[2]["currentHP"] > p2Team[2]["hp"] ) {
          p2Team[2]["currentHP"] = p2Team[2]["hp"]
        }


        return [p1Team, p2Team]
      } else if ( skillIDX == 2 &&  (skillSide == 2) ) {

        p2Team[0]["currentHP"] += p2Team[0]["hp"] * 0.02
        if ( p2Team[0]["currentHP"] > p2Team[0]["hp"] ) {
          p2Team[0]["currentHP"] = p2Team[0]["hp"]
        }

        p2Team[1]["currentHP"] += p2Team[1]["hp"] * 0.02
        if ( p2Team[1]["currentHP"] > p2Team[1]["hp"] ) {
          p2Team[1]["currentHP"] = p2Team[1]["hp"]
        }
      

        return [p1Team, p2Team]
      } else {
        return "skip"
      }
      
    
    },
  },
  "purrsistence" : {
    "events": ["naDamage", "techDamage"],
    "naDamage":  function naDamage(p1Team, p2Team, targetSide, targetIDX, turnOrder, pendingDamage, skillOrder, skillSide, skillIDX, crits) {
      if (skillSide == targetSide && skillSide == 1 && p1Team[skillIDX]["currentHP"] - pendingDamage <= 0 && p1Team[skillIDX]["skillData"] <= 1) {

        p1Team[skillIDX]["skillData"] += 1
        p1Team[skillIDX]["currentHP"] = 1

        return [p1Team, p2Team]
        
      } else if (skillSide == targetSide && skillSide == 2 && p2Team[skillIDX]["currentHP"] - pendingDamage <= 0 && p2Team[skillIDX]["skillData"] <= 1) {

        p2Team[skillIDX]["skillData"] += 1
        p2Team[skillIDX]["currentHP"] = 1

        return [p1Team, p2Team]

      }else{
        return "skip"
      }
      
    },
    "techDamage":  function techDamage(p1Team, p2Team, targetSide, targetIDX, turnOrder, pendingDamage, skillOrder, skillSide, skillIDX, crits) {
      if (skillSide == targetSide && skillSide == 1 && p1Team[skillIDX]["currentHP"] - pendingDamage <= 0 && p1Team[skillIDX]["skillData"] <= 1) {

        p1Team[skillIDX]["skillData"] += 1
        p1Team[skillIDX]["currentHP"] = 1

        return [p1Team, p2Team]
        
      } else if (skillSide == targetSide && skillSide == 2 && p2Team[skillIDX]["currentHP"] - pendingDamage <= 0 && p2Team[skillIDX]["skillData"] <= 1) {

        p2Team[skillIDX]["skillData"] += 1
        p2Team[skillIDX]["currentHP"] = 1

        return [p1Team, p2Team]

      }else{
        return "skip"
      }
      
    },
  },
  "prediction" : {
      "events": ["naRollAccuracy"],
      "naRollAccuracy" : function naRollAccuracy(p1Team, p2Team, targetSide, targetIDX, turnOrder, skillOrder, skillSide, skillIDX, crits) {


        if ( skillSide == 1 && p1Team[skillIDX]["currentHP"] <= 0 ) {
          return "skip"
        }
        if ( skillSide == 2 && p2Team[skillIDX]["currentHP"] <= 0 ) {
          return "skip"
        }


        if ( skillIDX < 3 ) {
          return Math.floor(Math.random() * 20)
        } else {
          return "skip"
        }
      },
  },
  "dodge" : {
      "events" : ["soultRollAccuracy"],
      "soultRollAccuracy" : function soultRollAccuracy(p1Team, p2Team, targetSide, targetIDX, turnOrder, skillOrder, skillSide, skillIDX, crits) {


        if ( skillSide == 1 && p1Team[skillIDX]["currentHP"] <= 0 ) {
          return "skip"
        }
        if ( skillSide == 2 && p2Team[skillIDX]["currentHP"] <= 0 ) {
          return "skip"
        }



        if ( skillIDX == targetIDX && (targetSide == skillSide) ) {
          return [0]
        } else {
          return "skip"
        }
      },
  },
  "eyeSeeYou" : {
      "events" : ["naRollAccuracy", "techRollAccuracy", "soultRollAccuracy"],
      "naRollAccuracy" : function naRollAccuracy(p1Team, p2Team, targetSide, targetIDX, turnOrder, skillOrder, skillSide, skillIDX, crits) {


        if ( skillSide == 1 && p1Team[skillIDX]["currentHP"] <= 0 ) {
          return "skip"
        }
        if ( skillSide == 2 && p2Team[skillIDX]["currentHP"] <= 0 ) {
          return "skip"
        }



        if ( turnOrder[0]["order"] == skillOrder &&  !(skillSide == targetSide) ) {
          return [999]
        } else {
          return "skip"
        }
      },
      "techRollAccuracy" : function techRollAccuracy(p1Team, p2Team, targetSide, targetIDX, turnOrder, skillOrder, skillSide, skillIDX, crits) {


        if ( skillSide == 1 && p1Team[skillIDX]["currentHP"] <= 0 ) {
          return "skip"
        }
        if ( skillSide == 2 && p2Team[skillIDX]["currentHP"] <= 0 ) {
          return "skip"
        }



        if ( turnOrder[0]["order"] == skillOrder &&  !(skillSide == targetSide) ) {
          return [999]
        } else {
          return "skip"
        }
      },
      "soultRollAccuracy" : function soultRollAccuracy(p1Team, p2Team, targetSide, targetIDX, turnOrder, skillOrder, skillSide, skillIDX, crits) {


        if ( skillSide == 1 && p1Team[skillIDX]["currentHP"] <= 0 ) {
          return "skip"
        }
        if ( skillSide == 2 && p2Team[skillIDX]["currentHP"] <= 0 ) {
          return "skip"
        }



        if ( turnOrder[0]["order"] == skillOrder &&  !(skillSide == targetSide) ) {
          return [999]
        } else {
          return "skip"
        }
      },
  },
  "rubberneck" : {
      "events" : ["naDamage", "techDamage"],
      "naDamage":  function naDamage(p1Team, p2Team, targetSide, targetIDX, turnOrder, pendingDamage, skillOrder, skillSide, skillIDX, crits) {

        var d1
        var userSTR = turnOrder[0]["str"]
        var targetDEF = 0
        var targetGuard = 0
        var targetCode = ""
        
        var critRoll = Math.floor(Math.random() * 20)
        var isCrit = 0
        var critMult = 1
        
        var isMiss = 0
          
        
        if ( targetSide == 1 ) {
          targetDEF = p1Team[targetIDX]["def"]
          targetGuard = p1Team[targetIDX]["guard"]
          targetCode = p1Team[targetIDX]["code"]
        } else {
          targetDEF = p2Team[targetIDX]["def"]
          targetGuard = p2Team[targetIDX]["guard"]
          targetCode = p2Team[targetIDX]["code"]
        }
      
        
      
        var randMult = Math.random() * 0.2 + 0.9
        var finalMult = Math.round(randMult * 100) / 100 //Use this- not randMult!
      
        d1 = Math.floor(((userSTR / 2) + (bp / 2) - (targetDEF / 4)) * critMult * finalMult * res * targetGuard)




        if (skillSide == targetSide && skillSide == 1 && crits > 0) {

          p1Team[targetIDX]["currentHP"] -= d1



          return [p1Team, p2Team]
          
        } else if (skillSide == targetSide && skillSide == 2 && crits > 0 ) {

          p2Team[targetIDX]["currentHP"] -= d1

          return [p1Team, p2Team]

        }else{
          return "skip"
        }
        
      },
      "techDamage":  function techDamage(p1Team, p2Team, targetSide, targetIDX, turnOrder, pendingDamage, skillOrder, skillSide, skillIDX, crits) {
        var d1
        var userSTR = turnOrder[0]["str"]
        var targetDEF = 0
        var targetGuard = 0
        var targetCode = ""
        
        var critRoll = Math.floor(Math.random() * 20)
        var isCrit = 0
        var critMult = 1
        
        var isMiss = 0
          
        
        if ( targetSide == 1 ) {
          targetDEF = p1Team[targetIDX]["def"]
          targetGuard = p1Team[targetIDX]["guard"]
          targetCode = p1Team[targetIDX]["code"]
        } else {
          targetDEF = p2Team[targetIDX]["def"]
          targetGuard = p2Team[targetIDX]["guard"]
          targetCode = p2Team[targetIDX]["code"]
        }
      
        
      
        var randMult = Math.random() * 0.2 + 0.9
        var finalMult = Math.round(randMult * 100) / 100 //Use this- not randMult!
      
        d1 = Math.floor(((userSTR / 2) + (bp / 2) - (targetDEF / 4)) * critMult * finalMult * res * targetGuard)


        if (skillSide == targetSide && skillSide == 1 && crits > 0) {

          p1Team[targetIDX]["currentHP"] -= d1

          return [p1Team, p2Team]
          
        } else if (skillSide == targetSide && skillSide == 2 && crits > 0 ) {

          p2Team[targetIDX]["currentHP"] -= d1

          return [p1Team, p2Team]

        }else{
          return "skip"
        }
        
      },
  },
  "blocker" : {
    "events" : ["rotatedWheel"],
    "rotatedWheel" : function rotatedWheel(p1Team, p2Team, turnOrder, skillOrder, skillSide, skillIDX, rotateSide, rotateAmount) {

      if ( skillSide == 1 && ( (skillIDX + rotateAmount > 2 && skillIDX + rotateAmount < 6) || (skillIDX + rotateAmount < 0 && skillIDX + rotateAmount > -3) ) && rotateSide == 1  ) {
        
        p1Team[skillIDX]["skillData"] = 0

      } else if ( skillSide == 2 && ( (skillIDX + rotateAmount > 2 && skillIDX + rotateAmount < 6) || (skillIDX + rotateAmount < 0 && skillIDX + rotateAmount > -3) ) && rotateSide == 2  ) {
        
        p2Team[skillIDX]["skillData"] = 0

      }




      if ( skillSide == 1 && ( (skillIDX + rotateAmount > 5 && skillIDX + rotateAmount < 9) || (skillIDX + rotateAmount < 3 && skillIDX + rotateAmount > -1) ) && rotateSide == 1 && p1Team[skillIDX]["skillData"] == 0 ) {
        
        p1Team[skillIDX]["guard"] = 0.5
        p1Team[skillIDX]["skillData"] = 1

        return [p1Team, p2Team]
      } else if ( skillSide == 2 && ( (skillIDX + rotateAmount > 5 && skillIDX + rotateAmount < 9) || (skillIDX + rotateAmount < 3 && skillIDX + rotateAmount > -1) ) && rotateSide == 2 && p2Team[skillIDX]["skillData"] == 0 ) {
        
        p2Team[skillIDX]["guard"] = 0.5
        p2Team[skillIDX]["skillData"] = 1

        return [p1Team, p2Team]
      } else {
        return "skip"
      }
    },
  },
  "oldnessZone" : {
      "events" : ["naRollAccuracy", "techRollAccuracy", "soultRollAccuracy"],
      "naRollAccuracy" : function naRollAccuracy(p1Team, p2Team, targetSide, targetIDX, turnOrder, skillOrder, skillSide, skillIDX, crits) {


        if ( skillSide == 1 && p1Team[skillIDX]["currentHP"] <= 0 ) {
          return "skip"
        }
        if ( skillSide == 2 && p2Team[skillIDX]["currentHP"] <= 0 ) {
          return "skip"
        }



        if ( skillIDX < 3 ) {
          return [999]
        } else {
          return "skip"
        }
      },
      "techRollAccuracy" : function techRollAccuracy(p1Team, p2Team, targetSide, targetIDX, turnOrder, skillOrder, skillSide, skillIDX, crits) {


        if ( skillSide == 1 && p1Team[skillIDX]["currentHP"] <= 0 ) {
          return "skip"
        }
        if ( skillSide == 2 && p2Team[skillIDX]["currentHP"] <= 0 ) {
          return "skip"
        }



        if ( skillIDX < 3 ) {
          return [999]
        } else {
          return "skip"
        }
      },
      "soultRollAccuracy" : function soultRollAccuracy(p1Team, p2Team, targetSide, targetIDX, turnOrder, skillOrder, skillSide, skillIDX, crits) {


        if ( skillSide == 1 && p1Team[skillIDX]["currentHP"] <= 0 ) {
          return "skip"
        }
        if ( skillSide == 2 && p2Team[skillIDX]["currentHP"] <= 0 ) {
          return "skip"
        }



        if ( skillIDX < 3 ) {
          return [999]
        } else {
          return "skip"
        }
      },
  },
  "greatLegs" : {
    "events": ["turnEnd"],
    "turnEnd":  function turnEnd(p1Team, p2Team, turnOrder, skillOrder, skillSide, skillIDX) {

      if ( skillSide == 1 && p1Team[skillIDX]["currentHP"] <= 0 ) {
        return "skip"
      }
      if ( skillSide == 2 && p2Team[skillIDX]["currentHP"] <= 0 ) {
        return "skip"
      }

      if ( skillIDX >= 3 && (skillSide == 1) ) {

        p1Team[0]["currentHP"] += p1Team[0]["hp"] * 0.02
        if ( p1Team[0]["currentHP"] > p1Team[0]["hp"] ) {
          p1Team[0]["currentHP"] = p1Team[0]["hp"]
        }
        
        p1Team[1]["currentHP"] += p1Team[1]["hp"] * 0.02
        if ( p1Team[1]["currentHP"] > p1Team[1]["hp"] ) {
          p1Team[1]["currentHP"] = p1Team[1]["hp"]
        }

        p1Team[2]["currentHP"] += p1Team[2]["hp"] * 0.02
        if ( p1Team[2]["currentHP"] > p1Team[2]["hp"] ) {
          p1Team[2]["currentHP"] = p1Team[2]["hp"]
        }
      
        return [p1Team, p2Team]
      } else if ( skillIDX >= 3 && (skillSide == 2) ) {

        p2Team[0]["currentHP"] += p2Team[0]["hp"] * 0.02
        if ( p2Team[0]["currentHP"] > p2Team[0]["hp"] ) {
          p2Team[0]["currentHP"] = p2Team[0]["hp"]
        }

        p2Team[1]["currentHP"] += p2Team[1]["hp"] * 0.02
        if ( p2Team[1]["currentHP"] > p2Team[1]["hp"] ) {
          p2Team[1]["currentHP"] = p2Team[1]["hp"]
        }

        p2Team[2]["currentHP"] += p2Team[2]["hp"] * 0.02
        if ( p2Team[2]["currentHP"] > p2Team[2]["hp"] ) {
          p2Team[2]["currentHP"] = p2Team[2]["hp"]
        }


        return [p1Team, p2Team]
      }  else {
        return "skip"
      }
      
    
    },
  },
  "tongueTwister" : {
    "events" : ["naCalc", "techCalc"],
    "naCalc":  function techCalc(p1Team, p2Team, targetSide, targetIDX, turnOrder, type, attribute, bp, res, skillOrder, skillSide, skillIDX) {
      if ( turnOrder[0]["order"] == skillOrder &&  !(skillSide == targetSide)) {
        var d1
        var userSTR = turnOrder[0]["str"]
        var targetDEF = 0
        var targetGuard = 0
        var targetCode = ""
        
        var critRoll = Math.floor(Math.random() * 20)
        var isCrit = 0
        var critMult = 1
        
        var isMiss = 0
          
        
        if ( targetSide == 1 ) {
          targetDEF = p1Team[targetIDX]["def"]
          targetGuard = p1Team[targetIDX]["guard"]
          targetCode = p1Team[targetIDX]["code"]
        } else {
          targetDEF = p2Team[targetIDX]["def"]
          targetGuard = p2Team[targetIDX]["guard"]
          targetCode = p2Team[targetIDX]["code"]
        }
        
        if ( critRoll == 0 ) {
          isCrit = 1
          targetDEF = 0
          critMult = 1.875
        }
      
        
      
        var randMult = Math.random() * 0.2 + 0.9
        var finalMult = Math.round(randMult * 100) / 100 //Use this- not randMult!
      
        d1 = Math.floor(((userSTR / 2) + (bp / 2) - (targetDEF / 4)) * critMult * finalMult * res * targetGuard)
    
      
        
      
        return [d1, isCrit, isMiss]
      } else {
        return "skip"
      }
      
    
    },
    "techCalc":  function techCalc(p1Team, p2Team, targetSide, targetIDX, turnOrder, type, attribute, bp, res, skillOrder, skillSide, skillIDX) {
      if ( turnOrder[0]["order"] == skillOrder &&  !(skillSide == targetSide)) {
        var d1


        var userSPR = turnOrder[0]["spr"]
        var targetDEF = 0
        var targetGuard = 0
        var targetCode = ""

        var critRoll = Math.floor(Math.random() * 20)
        var isCrit = 0
        var critMult = 1

        var isMiss = 0

        if ( critRoll == 0 ) {
          isCrit = 1
          targetDEF = 0
          critMult = 1.25
        }

        if ( targetSide == 1 ) {
          targetDEF = p1Team[targetIDX]["def"]
          targetGuard = p1Team[targetIDX]["guard"]
          targetCode = p1Team[targetIDX]["code"]
        } else {
          targetDEF = p2Team[targetIDX]["def"]
          targetGuard = p2Team[targetIDX]["guard"]
          targetCode = p2Team[targetIDX]["code"]
        }
        

        if (type == "damage") {

            var randMult = Math.random() * 0.2 + 0.9
            var finalMult = Math.round(randMult * 100) / 100 //Use this- not randMult!

            d1 = Math.floor(((userSPR / 2) + (bp / 2) - (targetDEF / 4)) * finalMult * res)


        } else if (type == "drain") {  

            var randMult = Math.random() * 0.2 + 0.9
            var finalMult = Math.round(randMult * 100) / 100 //Use this- not randMult!

            d1 = Math.floor(((userSPR / 2) + (bp / 2) - (targetDEF / 4)) * finalMult * res)


        } else {

            var randMult = Math.random() * 0.2 + 0.9
            var finalMult = Math.round(randMult * 100) / 100 //Use this- not randMult!

            d1 = Math.floor(((userSPR / 2) + (bp / 2) - (targetDEF / 4)) * finalMult )


        }



        var missRoll = Math.floor(Math.random() * 25)

        if ( missRoll == 0 ) {
          d1 = 0
          isMiss = 1
        }

        return [d1, isCrit, isMiss]


      } else {
        return "skip"
      }
      
    },
  },
  "bonyBond" : {
      "events" : ["battleStart"],
      "battleStart":  function battleStart(p1Team, p2Team, skillOrder, skillSide, skillIDX) { 

        if ( skillSide == 1 && p1Team[skillIDX]["currentHP"] <= 0 ) {
          return "skip"
        }
        if ( skillSide == 2 && p2Team[skillIDX]["currentHP"] <= 0 ) {
          return "skip"
        }
        
        for ( var i = 0; i < 5; i++ ) {
          
          if ( p1Team[i]["army"] == "bony" ) {
            p1Team[i]["def"] += 50
          }

          if ( p2Team[i]["army"] == "bony" ) {
            p2Team[i]["def"] += 50
          }

        }

        return [p1Team, p2Team]


      },
  },
  "thickCrust" : {
      "events" : ["turnEnd"],
      "turnEnd":  function turnEnd(p1Team, p2Team, turnOrder, skillOrder, skillSide, skillIDX) { 
        
        if ( skillSide == 1 && skillIDX == 1 && p1Team[skillIDX]["skillData"] == 0 ) {

          p1Team[skillIDX]["skillData"] = 1
          p1Team[skillIDX]["def"] += 50

          return [p1Team, p2Team]

        } else if ( skillSide == 2 && skillIDX == 1 && p2Team[skillIDX]["skillData"] == 0 ) {

          p2Team[skillIDX]["skillData"] = 1
          p2Team[skillIDX]["def"] += 50

          return [p1Team, p2Team]

        } else if ( skillSide == 1 && skillIDX != 1 ) {

          p1Team[skillIDX]["skillData"] = 0
          p1Team[skillIDX]["def"] -= 50

          return [p1Team, p2Team]

        } else if ( skillSide == 2 && skillIDX != 1 ) {

          p2Team[skillIDX]["skillData"] = 0
          p2Team[skillIDX]["def"] -= 50

          return [p1Team, p2Team]

        } else {
          return "skip"
        }

      },
  },
  "soothingRhythm" : {
    "events" : ["loafRoll"],
    "loafRoll": function loafRoll (p1Team, p2Team, targetSide, targetIDX, turnOrder, skillOrder, skillSide, skillIDX) {

      if ( skillSide == 1 && p1Team[skillIDX]["currentHP"] <= 0 ) {
        return "skip"
      }
      if ( skillSide == 2 && p2Team[skillIDX]["currentHP"] <= 0 ) {
        return "skip"
      }


      if ( skillIDX < 3 ) {

        return Math.floor(Math.random() * 20)

      } else {
        return "skip"
      }
    },
  },
  "sunShield" : {
    "events" : ["techDamage"],
    "techDamage":  function techDamage(p1Team, p2Team, targetSide, targetIDX, turnOrder, pendingDamage, skillOrder, skillSide, skillIDX, crits) {
      if ( skillSide == targetSide ) {
        if ( targetSide == 1 && p1Team[skillIDX]["guard"] < 1 ) {

          turnOrder[0]["currentHP"] -= pendingDamage

          return [p1Team, p2Team]

        } else if ( targetSide == 2 && p2Team[skillIDX]["guard"] < 1 ) {

          turnOrder[0]["currentHP"] -= pendingDamage

          return [p1Team, p2Team]

        } else {
          return "skip"
        }
      } else {
        return "skip"
      }
      
    },
  },
  "allOrNothing" : {
    events : ["naRollCrit", "techRollCrit", "soultRollCrit"],
    "naRollCrit" : function naRollCrit(p1Team, p2Team, targetSide, targetIDX, turnOrder, skillOrder, skillSide, skillIDX) {
      if ( ( targetIDX == skillIDX && targetSide == skillSide ) || ( turnOrder[0]["displayName"] == "Jibanyan S") ) {
        return Math.floor(Math.random() * 10)
      } else {
        return "skip"
      }
    },
    "techRollCrit" : function naRollCrit(p1Team, p2Team, targetSide, targetIDX, turnOrder, skillOrder, skillSide, skillIDX) {
      if ( ( targetIDX == skillIDX && targetSide == skillSide ) || ( turnOrder[0]["displayName"] == "Jibanyan S") ) {
        return Math.floor(Math.random() * 10)
      } else {
        return "skip"
      }
    },
    "soultRollCrit" : function naRollCrit(p1Team, p2Team, targetSide, targetIDX, turnOrder, skillOrder, skillSide, skillIDX) {
      if ( ( targetIDX == skillIDX && targetSide == skillSide ) || ( turnOrder[0]["displayName"] == "Jibanyan S") ) {
        return Math.floor(Math.random() * 10)
      } else {
        return "skip"
      }
    },
  }
}

module.exports = SKILL_DATABASE