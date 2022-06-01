const bcrypt = require('bcrypt-nodejs')
const { response } = require('express')

module.exports = app => {
    const getFavorite = async(req, res) =>{
        console.log("chamou getfavorite")
        // verifica se o token foi informado
        if(!req.headers.authorization){
            return res.status(400).send("Token inválido")  
        }
        // verifica o usuário através do token
        const usuario = await app.dataBase('userlogin')
        .where({token: req.headers.authorization})
        .first()

        //se não encontrar retorna erro
        if(!usuario){
            return res.status(204).json({error : "Token não encontrado"})
        }

        //consulta a empresa favorita
        const favorite = await app.dataBase('favorito')
        .where({idusuario: usuario.id, idempresafav: req.params.idEmpresa})

        // se encontrar retorna que a empresa é favorita
        if(favorite.length > 0 ){
            return res.status(200).json({succes: "Favorito"})
        }
        console.log("não achou")
        // se não encontrar retorna que não é fevorito
        return res.status(204).json({error: "Não é favorito"})

    }
    return {getFavorite}
}