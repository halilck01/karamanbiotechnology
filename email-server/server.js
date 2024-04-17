const express = require('express');
const cors = require('cors');
const app = express();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 3002;


app.use(cors({
    origin: ['https://karamanbiotech.com', 'https://www.karamanbiotech.com'],
    methods: ['GET', 'POST'], // İzin verilen HTTP metodları
    allowedHeaders: ['Content-Type'], // İzin verilen başlıklar
    credentials: true // Kimlik bilgilerini paylaşma izni
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} request to ${req.url}`);
    next();
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});


app.post('/send-email', (req, res) => {
    console.log('Send-email route çağrıldı');
    const { firstname, lastname, email, message } = req.body;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'cengizhankaraman2880@gmail.com',
        subject: `New message from ${firstname} ${lastname}`,
        text: `You have received a new message from ${firstname} ${lastname}
        \n\nE-Mail Address: ${email}
        \n\nMessage:${message}`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            res.status(500).json({ error: 'Error sending email', detail: error.toString() });
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).json({ message: 'Email sent successfully' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});