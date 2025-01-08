const generateVerificationCode = () => crypto.randomInt(1000, 9999).toString();
const emailSender = require('../utils/emailSender');

const sendVerification = async (user, method) => {
    const verificationCode = generateVerificationCode();
    user.verification = {
        method,
        code: verificationCode,
        expiresAt: Date.now() + 10 * 60 * 1000
    };

    if (method === 'sms') {
        await emailSender.sendVerificationSMS(user.responsible.phoneNumber, verificationCode);
    } else if (method === 'email') {
        await emailSender.sendVerificationEmail(user.responsible.email, verificationCode);
    }
};

module.exports = sendVerification;