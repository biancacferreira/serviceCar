const bcrypt = require('bcrypt-nodejs')
const { response } = require('express')

module.exports = app => {
    const getEmpresa = async(req, res) =>{
        
        console.log("Chamou getEmpresa")
        var token = req.headers.authorization
        // verifica se o token foi informado
        if(!req.headers.authorization){
            return res.json({
                error: "Token inválido"
            })
        }
        // consulta as informações do usuário através to token
        const usuario = await app.dataBase('userlogin')
            .where({token: token})
            .first()

        //se não encontrar retorna erro
        if(!usuario){
            return res.json({
                error: "Não foi possível autenticar o usuário"
            })
        }
        var data;
        //se houver filtro, consulta pela especialidade da empresa
        if(req.params.speciality != '' && req.params.speciality != null){       
            data =  await app.dataBase('cadempresa')
            .select("id", "nomeEmpresa", "telefone", "cidade", "email", "especialidade")
            .where('especialidade', req.params.speciality)   
            if(data.length > 0){
                return res.status(200).json({
                   data
                })
            }
         }
         // se não houver filtro, retorna todas as empresas
        data = await app.dataBase('cadempresa')
        .select("id", "nomeEmpresa", "telefone", "cidade", "email", "especialidade")

        // se encontrar algo, retorna sucesso
         if(data.length > 0){
             return res.status(200).json({
                data
             })
         }else{
             return res.status(204).json({
                 error: "Não há empresas cadastradas com essa especialidade."
             })
         }
    }
    return {getEmpresa}
}

