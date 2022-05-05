window.onload = function () {
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
        spk("Stopped Recording");

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
            console.log(val);
            console.log(current_speach);
            if (val == 1) {
                document.getElementById("lgn-mail").innerText = String(current_speach);
            }
            else if (val == 2) {
                document.getElementById("lgn-pass").innerText = String(current_speach);
            }
            else if (val == 3) {
                document.getElementById("rec-mail").innerText = String(current_speach);
            }
            else if (val == 4) {
                document.getElementById("mail-body").innerText = String(current_speach);
            }
        });
    }

    function showAudiobutts() {
        recordButton.style.display = "block";
        pauseButton.style.display = "block";
        stopButton.style.display = "block";
        upld.style.display = "block";
    }

    function hideAudiobutts() {
        recordButton.style.display = "none";
        pauseButton.style.display = "none";
        stopButton.style.display = "none";
        upld.style.display = "none";
    }

    function hideInputButts(exc) {
        loginMail.disabled = true;
        loginPassword.disabled = true;
        recieverMail.disabled = true;
        emailText.disabled = true;
        exc.disabled = false;
    }

    function showInputButts() {
        loginMail.disabled = false;
        loginPassword.disabled = false;
        recieverMail.disabled = false;
        emailText.disabled = false;
        exc.disabled = false;
    }

    function login_Mail() {
        showAudiobutts();
        hideInputButts(loginMail);
        val = 1;
        spk("You are now Recording Your Login Mail");
    }
    
    function login_Password() {
        showAudiobutts();
        hideInputButts(loginPassword);
        spk("You are now Recording Your Login Password");
        alert("Remeber to input the 16 digit application specefic password. Google has now revoked the less secure login.");
        val = 2;
    }
    
    function reciever_Mail() {
        showAudiobutts();
        hideInputButts(recieverMail);
        spk("You are now Recording Reciever's Mail");
        val = 3;
    }
    
    function email_Text() {
        showAudiobutts();
        hideInputButts(emailText);
        spk("You are now Recording Your Email Text");
        val = 4;
    }

    function send_Mail() {
        spk("The Email will be sent");
        var fd = {"Log_Mail" : log_ml, "Log_Pass" : log_pass, "Rec_Mail" : log_ml, "Eml_Text" : eml_txt};
        fetch("/mail", {
            method: "POST",
            body: JSON.stringify(fd)
        }).then();
    }

    function finalise() {
        hideAudiobutts();
        showInputButts();
        if (val == 1) {
            log_ml = current_speach;
        }
        if (val == 2) {
            log_pass = current_speach;
        }
        if (val == 3) {
            rec_ml = current_speach;
        }
        if (val == 4) {
            eml_txt = current_speach;
        }
    }

    function spk(txt) {
        speak = new SpeechSynthesisUtterance();
        speak.lang = 'en-US';
        speak.text = txt;
        window.speechSynthesis.speak(speak);
    }
}

