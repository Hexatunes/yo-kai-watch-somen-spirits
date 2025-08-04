var minutes = 15
var seconds = 0

function countdown() {
    seconds -= 1
    if ( seconds == -1 ) {
        seconds = 59
        minutes -= 1
    }
    if ( seconds < 10 ) {
        document.getElementById("countdown").innerHTML = minutes + " : 0" + seconds
    } else {
        document.getElementById("countdown").innerHTML = minutes + " : " + seconds
    }
    setTimeout(countdown, 1000)
}

document.getElementById("countdown").innerHTML = minutes + " : 0" + seconds
setTimeout(countdown, 1000)