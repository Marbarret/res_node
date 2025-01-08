const message = {
    success: {
        USER_CREATED: 'Usuário criado com sucesso',
        USER_UPDATE: 'Usuário atualizado com sucesso.',
        VERIFICATION_SUCCESSFUL: 'Verificação realizada com sucesso.',
        USER_REMOVE_SUCCESSFUL: 'Usuário removido com sucesso',
        USER_VERIFICATION_CODE: (code) => 'Código de verificação: ',
        RESEND_SUCCESSFUL: 'Código reenviado com sucesso.',
        //DEPENDENTE
        DEPENDENT_ADD: 'Dependente adicionado com sucesso.',
        DEPENDENT_UPDATE: 'Dependente atualizado com sucesso!',
        DEPENDENT_DELETE: 'Dependente removido com sucesso!'
    },
    error: {
        INVALID_DOCUMENT: 'O tipo de documento deve ser CPF ou CNPJ.',
        DOC_ALREADY_EXISTS: 'Documento já cadastrado.',
        RES_REQUIRED_DOCUMENT: 'Dados do responsavel são obrigatórias.',
        FIND_ALL_USER_ERROR: 'Erro ao buscar usuários',
        FIND_USER_ERROR: 'Usuário não encontrado',
        INVALID_DOC_TYPE: (document_type) => '${document_type} deve ter o número correto de caracteres.',
        ERROR_CREATED_USER: 'Erro ao criar usuário',
        NO_CHANGE: 'Nenhuma alteração válida foi enviada.',
        UPDATE_USER_ERROR: 'Erro ao atualizar usuário.',
        PARTIAL_UPDATE_ERROR: 'Erro de atualização parcial',
        INVALID_VERIFICATION_CODE: 'Código de verificação inválido',
        INVALID_CODE_DOCUMENT: 'Número do documento e código de verificação são obrigatórios.',
        ERROR_VERIFYING_USER: 'Erro ao verificar usuário',
        USER_INVALID_VERIFICATION: 'Usuário não verificado. Complete o processo de verificação.',
        INVALID_EMAIL: 'Erro ao validar e-mail',
        EMAIL_NOT_SENT: 'Erro ao enviar e-mail',
        INVALID_EMAIL_AND_CODE: 'E-mail ou código de verificação inválidos',
        REQUIRED_EMAIL: 'Email é obrigatório.',
        RESEND_CODE_FAILURE: 'Erro ao reenviar o código.',
        UPDATE_CODE_FAILURE: 'Erro ao atualizar código de verificação.',
        // DEPENDENTE
        ERROR_DEPENDENT_UPDATE: 'Erro ao atualizar dependente',
        PARTIAL_DEPENDENT_ERROR: 'Dependente não atualizado parcialmente com sucesso!',
        REMOVE_DEPENDENT_ERROR: 'Dependente não removido'
    },
};

module.exports = message;