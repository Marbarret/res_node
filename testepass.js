const bcrypt = require('bcrypt');

const testPassword = async (plainPassword, hashedPassword) => {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('Resultado da comparação:', isMatch);
};

// Exemplo de uso:
const hashedPassword = '$2b$10$WNtAzgspyUj0ssbXuhUwKOflb.p16xeovPk9syAKdVo39URZqHo2m'; // O hash armazenado
const plainPassword = 'testeSenhaNova'; // A senha que você deseja testar

testPassword(plainPassword, hashedPassword);
