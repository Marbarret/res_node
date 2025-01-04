const isValidCPF = (cpf) => cpf.length === 11 && !isNaN(cpf);

const isValidDocument = (document) => {
    const { document_type, number } = document;
    if (document_type === 'CPF') return isValidCPF(number);
    if (document_type === 'CNPJ') return number.length === 14 && !isNaN(number);
    return false;
};

module.exports = { 
    isValidCPF, 
    isValidDocument 
};