const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", 
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendVerificationEmail = async (to, verificationCode) => {
    const mailOptions = {
        from: `"Seu Projeto" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: "Código de Verificação",
        text: `Seu código de verificação é: ${verificationCode}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("E-mail enviado com sucesso!");
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
        throw new Error("Erro ao enviar e-mail de verificação.");
    }
};

module.exports = { sendVerificationEmail };