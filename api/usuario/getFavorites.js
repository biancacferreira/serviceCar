const bcrypt = require('bcrypt-nodejs')
const { response } = require('express')

module.exports = app => {
    const getFavorites = async(req, res) =>{
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
        const favorites = await app.dataBase('favorito')
        .join('cadempresa', 'cadempresa.id', '=', 'favorito.idempresafav')
        .select('cadempresa.id', 'cadempresa.nomeEmpresa', 'cadempresa.telefone', 'cadempresa.cidade',
        'cadempresa.email', 'cadempresa.especialidade')
        .where({idusuario: usuario.id})
        .catch(err => res.status(204).json({error: "Nenhum favorito"}))

        return res.status(200).json({
            favorites: favorites
        })
    }
    return {getFavorites}
}
