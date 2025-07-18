const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/send', upload.single('preuve'), async (req, res) => {
    const { nom, email, destinataire } = req.body;
    const file = req.file;

    if (!nom || !email || !file) {
        return res.status(400).send('Champs requis manquants.');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: `"Rc Date" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_RECEIVER,
            subject: 'Nouvelle réservation Rc Date',
            text: `Nom complet : ${nom}
Email : ${email}
Email destinataire : ${destinataire}`,
            attachments: [
                {
                    filename: file.originalname,
                    content: file.buffer,
                },
            ],
        });

        res.send('Email envoyé avec succès');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de l’envoi de l’email');
    }
});

app.listen(port, () => {
    console.log(`Serveur lancé sur le port ${port}`);
});