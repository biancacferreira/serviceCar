const bcrypt = require('bcrypt-nodejs')
const { response } = require('express')

module.exports = app => {
    const deleteService = async(req, res) =>{
       var token = JSON.parse(req.body.token)
       //var token = req.body.token
       //  verifica se o token foi informado
        if(!req.body.token){
            return res.json({
                error: "Token inválido"
            })
        }
        // busca as informações da empresa através do token
        const usuario = await app.dataBase('empresalogin')
            .where({token: token})
            .first()

        // se não encontrar retorna erro
        if(!usuario){
            return res.json({
                error: "Não foi possível autenticar o usuário"
            })
        }
        //deleta o serviço através do id da empresa e o id do serviço
        const servico = await app.dataBase('servicoscadastrados')
            .where({idempresa: usuario.idEmpresa, idservico: req.params.id})
            .del()
            .then(rowsDeleted =>{
                if(rowsDeleted > 0){
                    // se foi deletado retorna sucesso
                   res.status(204).send()
                }else{
                    //se não encontrar o serviço retorna erro
                    const msg = `Não foi encontrado o serviço`
                    res.status(400).send(msg)
                }
            })
            .catch(err => res.status(400).json(err))
    }
    return {deleteService}
}

