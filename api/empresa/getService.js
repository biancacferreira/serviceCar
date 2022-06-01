const bcrypt = require('bcrypt-nodejs')
const { response } = require('express')

module.exports = app => {
    const getService = async(req, res) =>{
        var token = JSON.parse(req.params.token)
        // verifica se o token foi informado
        if(!req.params.token){
            return res.json({
                error: "Token inválido"
            })
        }
        // verifica a empresa através do token
        const usuario = await app.dataBase('empresalogin')
            .where({token: token})
            .first()
        // se não encontrar retorna erro
        if(!usuario){
            return res.json({
                error: "Não foi possível autenticar o usuário"
            })
        }
        //busca todos os serviços que a empresa possui cadastrado
        const servicos = await app.dataBase('servicoscadastrados')
            .where('idempresa', usuario.idEmpresa)
    
        return res.json({
            servicos
        })
    }

    return {getService}
}

