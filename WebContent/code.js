var callsContainer = document.getElementById("calls");
var responsesContainer = document.getElementById("responses");

function getLastPathSegment() {
    return decodeURIComponent(new RegExp('[^\\/]+(?=\\/$|$)').exec(window.location.href) || [null, '']) || null;
}

function doRequest(url, done, error) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) done(this);
            else error(this);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function load(code) {
    doRequest("https://api.cardcastgame.com/v1/decks/" + code + "/calls", function (xhttp) {
        var calls = xhttp.responseText;
        doRequest("https://api.cardcastgame.com/v1/decks/" + code + "/responses", function (xhttp) {
            loaded(code, JSON.parse(calls), JSON.parse(xhttp.responseText))
        }, function (xhttp) {
            error(xhttp);
        })
    }, function (xhttp) {
        error(xhttp);
    })
}

function error(xhttp) {
    console.error(xhttp); // TODO
}

function loaded(code, calls, responses) {
    addLinks("Download original JSON", JSON.stringify, code, "_original.json", "application/json", calls, responses);
    addLinks("Download simplified JSON", toSimplified, code, "_simplified.json", "application/json", calls, responses);
    addLinks("Download as text", toText, code, "_text.txt", "text/plain", calls, responses);
}

function addLinks(text, transformer, code, suffix, mime, calls, responses) {
    callsContainer.appendChild(createLinkElm(text, "calls_" + code + suffix, transformer(calls), mime));
    responsesContainer.appendChild(createLinkElm(text, "responses_" + code + suffix, transformer(responses), mime));
}

function toSimplified(json) {
    var array = [];
    for (var i = 0; i < json.length; i++)
        array.push(json[i].text.join("_"));
    return JSON.stringify(array);
}

function toText(json) {
    var str = "";
    for (var i = 0; i < json.length; i++)
        str += json[i].text.join("_") + "\r\n";
    return str;
}

function generateLink(blob, mime) {
    return window.URL.createObjectURL(new Blob([blob], {type: mime}));
}

function createLinkElm(text, download, blob, mime) {
    var a = document.createElement("a");
    a.innerHTML = text;
    a.download = download;
    a.href = generateLink(blob, mime);
    return a;
}

var code = getLastPathSegment();
console.log(code);

load(code);

