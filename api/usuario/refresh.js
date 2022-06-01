const bcrypt = require('bcrypt-nodejs')
const { response } = require('express')

module.exports = app => {
    const refresh = async(req, res) =>{
        // verifica se foi informado o token
        if(!req.headers.authorization){
            return res.status(400).send("Token inválido")  
        }
        // verifica o usuario atraves do token
        const usuario = await app.dataBase('userlogin')
        .where({token: req.headers.authorization})
        .first()
        //se não encontrar retorna erro
        if(!usuario){
            return res.status(400).send("Token inválido")
        }

        // verifica as informações do usuário
        const info = await app.dataBase('cadusers')
        .where({id: usuario.idUser})
        .first()

        // se não encontrar retorna erro
        if(!usuario){
            return res.status(204).json({error : "Token não encontrado"})
        }
      

        return res.status(200).json({email: usuario.userLogin,
                                    name: info.nomeCompleto,
                                    phone: info.telefone
        })

    }

    return {refresh}
}