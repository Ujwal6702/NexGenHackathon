from fastapi import FastAPI, HTTPException
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import pyotp


async def generateAuthenticationKey():
    return pyotp.random_base32()



async def sendMail(mail, subject, body):
    try:
        sender_email = "nexgenhackathon@gmail.com"
        receiver_email = mail
        password = "ivco skca aznw dgvs"  

        message = MIMEMultipart()
        message["From"] = sender_email
        message["To"] = receiver_email
        message["Subject"] = subject

        message.attach(MIMEText(body, "plain"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, password)
            server.sendmail(sender_email, receiver_email, message.as_string())
        return True
    except:
        return False

reqid = [0]
ids = {}
verify_data = {}




async def otpMail(mail, name, password):
    reqid[0] += 1
    totp = pyotp.TOTP(generateAuthenticationKey(), interval=300)
    body = f"""
        Dear User,

        Thank you for using our service. Here is your One Time Password (OTP):

        OTP: {totp.now()}

        Please do not share this OTP with anyone. Our team will never ask for your OTP.

        If you didn't request this OTP, please ignore this email.

        Best regards,
        Your Team
        """
    ids[reqid[0]] = totp
    if sendMail(mail, "One Time Password (OTP) for NexGen Hackathon", body):
        verify_data[totp] = [mail, name, password]
        return {"message": "OTP sent successfully", "request_id": totp}
    else:
        return {"message": "Failed to send OTP", "request_id": None}


app = FastAPI()



@app.post("/register/")
async def register_user(email:str, name:str, password:str):
    return otpMail(email, name, password)
    
