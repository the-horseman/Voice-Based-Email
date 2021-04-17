import speech_recognition as sr
import webbrowser as wb
import smtplib,ssl
import pyttsx3

r1=sr.Recognizer()
engine=pyttsx3.init()
engine.setProperty('rate',150)
Login_Email = ""
Login_Password = ""
Sender_Email = ""
Receiver_Email = ""
Email_text = ""
port = 465

def record_audio():
    with sr.Microphone() as source:
        print('Speak now :) ')
        r = sr.Recognizer()
        r.adjust_for_ambient_noise(source)
        audio = r.listen(source)
    return audio

def recognise_audio():
    try:
        something =  str(r1.recognize_google(record_audio(),language = 'en-in')).lower()
        return something
    except:
        print("Try again!!!")
        return recognise_audio()

def speak_phrase(s):
    print(s)
    engine.say("You said "+s)
    engine.runAndWait()

def login_mail():
    Login_Email = ""
    print("Please input the Login Email => ")
    Login_Emai = recognise_audio()
    for i in Login_Emai.split(" "):
        Login_Email = Login_Email+i
    speak_phrase(Login_Email)
    print("Is there any correction")
    s2 = recognise_audio()
    speak_phrase(s2)
    if "no" in s2:
        return Login_Email
    else:
        return login_mail()

def login_pass():
    Login_Password = ""
    print("Please input the Login Password => ")
    Login_Passwor = recognise_audio()
    for i in Login_Passwor.split(" "):
        Login_Password = Login_Password+i
    speak_phrase(Login_Password)
    print("Is there any correction?")
    s2 = recognise_audio()
    speak_phrase(s2)
    if 'no' in s2:
        return Login_Password
    else:
        return login_pass()

def sender_mail():
    Sender_Email=""
    print("Please input the Sender's Email => ")
    Sender_Emai =  recognise_audio()
    for i in Sender_Emai.split(" "):
        Sender_Email = Sender_Email+i
    speak_phrase(Sender_Email)
    print("Is there any correction")
    s2 = recognise_audio()
    speak_phrase(s2)
    if 'no' in s2:
        return Sender_Email
    else:
        return sender_mail()

def receiv_mail():
    Receiver_Email = ""
    print("Please input the Receiver's Email => ")
    Receiver_Emai =  recognise_audio()
    for i in Receiver_Emai.split(" "):
        Receiver_Email = Receiver_Email+i
    speak_phrase(Receiver_Email)
    print("Is there any correction")
    s2 = recognise_audio()
    speak_phrase(s2)
    if 'no' in s2:
        return Receiver_Email
    else:
        return receiv_mail()

def mail_text():
    print("Please input the Email Text => ")
    Email_text = recognise_audio()
    print("Is there any correction")
    s2 = recognise_audio()
    if 'no' in s2:
        return Email_text
    else:
        return mail_text()


print('Try Saying => "Open my gmail"')
engine.say('Try Saying => "Open my gmail"')
engine.runAndWait()
s = recognise_audio()
speak_phrase(s)
s2 = ''
if 'gmail' in s:
    url = "https://mail.google.com/mail/u/1/#inbox"
    print("You said ",s)
    Login_Email = login_mail()
    Login_Password = login_pass()

    context = ssl.create_default_context()
    
    print("Your gmail will be opened in the end...")
    speak_phrase("Your gmail will be opened in the end...")
    print('Do You want to write a new Mail ?')
    speak_phrase('Do You want to write a new Mail ?')
    s1 = recognise_audio()
    speak_phrase(s1)
    if 'yes' in s1:
        Sender_Email = sender_mail()
        Receiver_Email = receiv_mail()
        Email_text = mail_text()

        with smtplib.SMTP_SSL("smtp.gmail.com",port,context=context) as server:
            server.login(Login_Email,Login_Password)
            server.sendmail(Sender_Email,Receiver_Email,Email_text)

    wb.get().open_new(url)
