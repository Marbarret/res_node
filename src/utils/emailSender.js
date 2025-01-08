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
    const emailHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f9f9f9;
                    color: #333;
                    margin: 0;
                    padding: 20px;
                }
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: #ffffff;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 20px;
                }
                .header {
                    text-align: center;
                    padding-bottom: 20px;
                }
                .code {
                    font-size: 24px;
                    font-weight: bold;
                    color: #2c3e50;
                    text-align: center;
                    margin: 20px 0;
                }
                .footer {
                    text-align: center;
                    font-size: 12px;
                    color: #999;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>Seu Código de Verificação</h1>
                </div>
                <p>Olá,</p>
                <p>Você solicitou a verificação da sua conta. Use o código abaixo para concluir o processo:</p>
                <div class="code">${verificationCode}</div>
                <p>Se você não solicitou este código, ignore este email.</p>
                <div class="footer">
                    <p>&copy; 2024 Busease. Todos os direitos reservados.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    const mailOptions = {
        from: `"BUSEASE" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: "Código de Verificação",
        html: emailHTML
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
        throw new Error("Erro ao enviar e-mail de verificação.");
    }
};

module.exports = { sendVerificationEmail };