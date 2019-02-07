function getLastPathSegment() {
    return decodeURIComponent(new RegExp('[^\\/]+(?=\\/$|$)').exec(window.location.href) || [null, '']) || null;
}

function loadCalls(code) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            document.getElementById("calls").innerHTML = this.responseText;
        }
    };
    xhttp.open("GET", "https://api.cardcastgame.com/v1/decks/" + code + "/calls", true);
    xhttp.send();
}

function loadResponses(code) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            document.getElementById("responses").innerHTML = this.responseText;
        }
    };
    xhttp.open("GET", "https://api.cardcastgame.com/v1/decks/" + code + "/responses", true);
    xhttp.send();
}

var code = getLastPathSegment();
console.log(code);

loadCalls(code);
loadResponses(code);

