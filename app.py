from flask import Flask, render_template, request, jsonify
import smtplib
import ssl
import speech_recognition as sr
filename = "audio.wav"
r = sr.Recognizer()

app = Flask(__name__)


@app.route('/')
def start():
    return render_template("index.html")


def process(text):
    ans = ""
    for i in text:
        if i != ' ':
            ans += i
    match = "attherate"
    for i in range(0, len(ans)-len(match)):
        if ans[i:i+len(match):] == match:
            ans = ans[:i:] + "@" + ans[i+len(match)::]
    return ans


@app.route('/convert', methods=["POST"])
def conv():
    if request.method == 'POST':
        data = request.files['audio_data']
        with open("audio.wav", 'wb') as f:
            data.save(f)
        filename = "audio.wav"

    ex = {}
    with sr.AudioFile(filename) as source:
        audio_data = r.record(source)
        text = r.recognize_google(audio_data)
        text = process(text)
        ex["data"] = text

    return jsonify(ex)


@app.route("/mail", methods=["POST"])
def ml():
    if request.method == "POST":
        data = request.get_json(force=True)
        log_mail = data["Log_Mail"]
        log_pass = data["Log_Pass"]
        rec_mail = data["Rec_Mail"]
        mail_txt = data["Eml_Text"]
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(log_mail, log_pass)
            server.sendmail(log_mail, rec_mail, mail_txt)
    return jsonify(0);

if __name__ == "__main__":
    app.run(debug=True)
