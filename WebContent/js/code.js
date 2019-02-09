const callsContainer = document.getElementById("calls");
const responsesContainer = document.getElementById("responses");

function getLastPathSegment() {
    return decodeURIComponent(new RegExp('[^\\/]+(?=\\/$|$)').exec(window.location.href) || [null, '']) || null;
}

function doRequest(url, done, error) {
    const xhttp = new XMLHttpRequest();
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
        const calls = xhttp.responseText;
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
    document.getElementById("loader").style.display = "none";

    console.debug(xhttp);

    const error = document.getElementById("error");
    error.style.display = null;
    if (xhttp.status === 400) error.innerHTML = "404: Not found";
    else error.innerHTML = xhttp.status;
}

function loaded(code, calls, responses) {
    addLinks("Download original JSON", JSON.stringify, code, "_original.json", "application/json", calls, responses);
    addLinks("Download simplified JSON", toSimplified, code, "_simplified.json", "application/json", calls, responses);
    addLinks("Download as text", toText, code, "_text.txt", "text/plain", calls, responses);

    document.getElementById("content").style.display = null;
    document.getElementById("loader").style.display = "none";
}

function addLinks(text, transformer, code, suffix, mime, calls, responses) {
    callsContainer.appendChild(createLinkElm(text, "calls_" + code + suffix, transformer(calls), mime));
    responsesContainer.appendChild(createLinkElm(text, "responses_" + code + suffix, transformer(responses), mime));
}

function toSimplified(json) {
    const array = [];
    for (let i = 0; i < json.length; i++)
        array.push(json[i].text.join("_"));
    return JSON.stringify(array);
}

function toText(json) {
    let str = "";
    for (let i = 0; i < json.length; i++)
        str += json[i].text.join("_") + "\r\n";
    return str;
}

function generateLink(blob, mime) {
    return window.URL.createObjectURL(new Blob([blob], {type: mime}));
}

function createLinkElm(text, download, blob, mime) {
    const span = document.createElement("span");
    span.innerHTML = text;
    span.className = "mdc-button__label";

    const button = document.createElement("button");
    button.appendChild(span);
    button.className = "mdc-button mdc-button--outlined";
    mdc.ripple.MDCRipple.attachTo(button);

    const a = document.createElement("a");
    a.appendChild(button);
    a.className = "mb10";
    a.download = download;
    a.href = generateLink(blob, mime);

    return a;
}

const code = getLastPathSegment();
console.debug(code);

document.getElementById("code").innerHTML = code;

load(code);

