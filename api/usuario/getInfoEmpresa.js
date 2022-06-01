const bcrypt = require('bcrypt-nodejs')
const { response } = require('express')

module.exports = app => {
    const getInfo = async(req, res) =>{
        console.log("Chamou getInfoEmpresa")
        var token = req.headers.authorization
        // verifica se o token foi informado
        if(!req.headers.authorization){
            return res.json({
                error: "Token inválido"
            })
        }
        //verifica o usuário através do token
        const usuario = await app.dataBase('userlogin')
            .where({token: token})
            .first()

        // busca se a empresa é favorita do usuário
        const favorito = await app.dataBase('favorito')
            .where({idusuario: usuario.id, idempresa: req.params.idEmpresa})

        var favorite;
        //se for favorito retorna true, se não retorna false
        if(!favorito){
            favorite = false;
        }
        favorite = true;
        // busca os serviços da empresa
        const servicos = await app.dataBase('servicoscadastrados')
            .where({idempresa: req.params.idEmpresa})

        return res.status(201).json({
            services: servicos,
            favorite: favorite
        })
    }
    return {getInfo}
}