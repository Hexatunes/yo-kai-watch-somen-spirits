const SKILL_DATABASE = {
  "windPlay" : {
  "events": ["techCalc"],
  "techCalc":  function techCalc(p1Team, p2Team, targetSide, targetIDX, turnOrder, type, element, bp, res, skillOrder, skillSide) {
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
 "extremeCritical" : {
  "events": ["naCalc"],
  "naCalc":  function techCalc(p1Team, p2Team, targetSide, targetIDX, turnOrder, type, element, bp, res, skillOrder, skillSide) {
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
    
      var missRoll = Math.floor(Math.random() * 20)
    
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
 "toadallySaved" : {
  "events": ["naDamage"],
  "naDamage":  function naDamage(p1Team, p2Team, targetSide, targetIDX, turnOrder, pendingDamage, skillOrder, skillSide, userIDX) {
    if (skillSide == targetSide) {
      if ( (targetSide == 1) && (p1Team[targetIDX]["currentHP"] <= pendingDamage) && (p1Team[userIDX]["currentHP"] > 0) && ((p1Team[0]["displayName"] == "Toadal Dude") || (p1Team[1]["displayName"] == "Toadal Dude") || (p1Team[2]["displayName"] == "Toadal Dude")) ) {
        p1Team[userIDX]["currentHP"] -= pendingDamage
        return [p1Team, p2Team]
      } else if ( (targetSide == 2) && (p2Team[targetIDX]["currentHP"] <= pendingDamage) && (p2Team[userIDX]["currentHP"] > 0) && (p2Team[targetIDX]["currentHP"] <= pendingDamage) && ((p2Team[0]["displayName"] == "Toadal Dude") || (p2Team[1]["displayName"] == "Toadal Dude") || (p2Team[2]["displayName"] == "Toadal Dude")) ) {
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
 "caring" : {
  "events": ["naDamage", "naCalc", "techCalc"],
  "naDamage":  function naDamage(p1Team, p2Team, targetSide, targetIDX, turnOrder, pendingDamage, skillOrder, skillSide, userIDX) {
    
    
   },
 },
}

module.exports = SKILL_DATABASE