const bcrypt = require('bcrypt-nodejs')
const { response } = require('express')

module.exports = app => {
    const saveFavorito = async(req, res) =>{
        var token = req.headers.authorization
        console.log("Chamou favorito")
        // verifica se foi informado token
        if(!req.headers.authorization){
            return res.json({
                error: "Token inválido"
            })
        }

        // consulta o usuário através do token
        const usuario = await app.dataBase('userlogin')
            .where({token: token})
            .first()

        //se não encontrar retorna erro
        if(!usuario){
            return res.json({
                error: "Não foi possível autenticar o usuário"
            })
        }

        // insere o favorito na tabela e caso houver erro retorna uma mensagem, se não retorna que foi salvo
        const favorito = await app.dataBase('favorito')
                        .insert({idusuario: usuario.id, idempresafav: req.body.idCompanie})
                        .catch(err => res.status(500).json({
                            error: "Não foi possivel favoritar."
                        }))
        return res.status(201).json({
            success: "Favorito salvo com sucesso"
        })
        
    }
    return {saveFavorito}
}