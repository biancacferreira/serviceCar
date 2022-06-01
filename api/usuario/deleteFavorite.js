const bcrypt = require('bcrypt-nodejs')
const { response } = require('express')

module.exports = app => {
    const deleteFavorite = async(req, res) =>{
        console.log('chamou del favorite')
        var token = req.headers.authorization

        //verifica se foi informado token
        if(!req.headers.authorization){
            return res.json({
                error: "Token inválido"
            })
        }
        //busca as informações do usuário através do token
        const usuario = await app.dataBase('userlogin')
            .where({token: token})
            .first()

        //se não encontrar retorna erro
        if(!usuario){
            return res.json({
                error: "Não foi possível autenticar o usuário"
            })
        }

        //deleta o favorito através do id do usuário informado e o id da empresa
        const favorito = await app.dataBase('favorito')
                        .where({idusuario: usuario.id, idempresafav: req.body.idCompanie})
                        .del()
                        .catch(err => res.status(500).json({
                            error: "Não foi possivel excluir."
                        }))
        //retorna sucesso se deletar
        return res.status(201).json({
            success: "Favorito deletado"
        })
        
    }
    return {deleteFavorite}
}