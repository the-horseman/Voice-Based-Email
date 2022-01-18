URL = window.URL || window.webkitURL;

let speak = new SpeechSynthesisUtterance();
var log_ml = ""
var log_pass = ""
var rec_ml = ""
var eml_txt = ""
var val = 0
var gumStream;
var rec;
var input;
var current_speach

var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext

var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");
var au = document.getElementById("audio")
var upld = document.getElementById("upload")
var instruct = document.getElementById("instruct")
var loginMail = document.getElementById("loginMail");
var loginPassword = document.getElementById("loginPassword");
var recieverMail = document.getElementById("recieverMail")
var emailText = document.getElementById("emailText")
var sendMail = document.getElementById("sendMail")

recordButton.addEventListener("click", startRecording);
upld.addEventListener("click", finalise);
stopButton.addEventListener("click", stopRecording);
pauseButton.addEventListener("click", pauseRecording);
loginMail.addEventListener("click", login_Mail);
loginPassword.addEventListener("click", login_Password);
recieverMail.addEventListener("click", reciever_Mail);
emailText.addEventListener("click", email_Text);
sendMail.addEventListener("click", send_Mail);

function startRecording() {
    instruct.innerText = "Recording Has Started";
    spk("Recording");
    speak.onend = function (blah) {
        var constraints = { audio: true, video: false }

        recordButton.disabled = true;
        stopButton.disabled = false;
        pauseButton.disabled = false;

        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {

            audioContext = new AudioContext();

            gumStream = stream;

            input = audioContext.createMediaStreamSource(stream);

            rec = new Recorder(input, { numChannels: 1 })

            rec.record()

        }).catch(function (err) {
            console.log("Error Occured");
        });
    }
}

function pauseRecording() {
    instruct.innerText = "Recording has been paused";
    if (rec.recording) {
        rec.stop();
        pauseButton.innerHTML = "Resume";
    } else {
        rec.record()
        pauseButton.innerHTML = "Pause";

    }
}

function stopRecording() {
    console.log("stopButton clicked");

    stopButton.disabled = true;
    recordButton.disabled = false;
    pauseButton.disabled = true;

    pauseButton.innerHTML = "Pause";

    rec.stop();
    // spk("Stopped Recording");

    gumStream.getAudioTracks()[0].stop();

    rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {

    var url = URL.createObjectURL(blob);
    au.src = url

    var filename = new Date().toISOString();
    var fd = new FormData();
    fd.append("audio_data", blob, filename);
    fetch("/convert", {
        method: "POST",
        body: fd
    }).then((result) => {
        return result.json();
    }).then((data) => {
        current_speach = data["data"];
        // spk("You spoke : " + current_speach);
        instruct.innerText = "You spoke : " + current_speach;
    });
}

function login_Mail() {
    instruct.innerText = "You are now Recording Your Login Mail";
    // spk("You are now Recording Your Login Mail");
    val = 1;
}

function login_Password() {
    instruct.innerText = "You are now Recording Your Login Password";
    // spk("You are now Recording Your Login Password");
    val = 2;
}

function reciever_Mail() {
    instruct.innerText = "You are now Recording Reciever's Mail";
    // spk("You are now Recording Reciever's Mail");
    val = 3;
}

function email_Text() {
    instruct.innerText = "You are now Recording Your Email Text";
    // spk("You are now Recording Your Email Text");
    val = 4;
}

function send_Mail() {
    // instruct.innerText = "The Email will be sent";
    // spk("The Email will be sent");
    var fd = new FormData();
    fd.append("Log_Mail",log_ml);
    fd.append("Log_Pass",log_pass);
    fd.append("Rec_Mail",rec_ml);
    fd.append("Eml_Text",eml_txt);
    fetch("/convert", {
        method: "POST",
        body: fd
    }).then();
    instruct.innerText = log_ml + "\n" + log_pass + "\n" + rec_ml + "\n" + eml_txt;
}

function finalise() {
    if (val == 1) {
        log_ml = current_speach;
    }
    if (val == 2) {
        log_pass = current_speach;
    }
    if (val == 3) {
        rec_ml = current_speach;
    }
    if (val == 3) {
        eml_txt = current_speach;
    }
}

function spk(txt) {
    speak = new SpeechSynthesisUtterance();
    speak.lang = 'en-US';
    speak.text = txt;
    window.speechSynthesis.speak(speak);
}