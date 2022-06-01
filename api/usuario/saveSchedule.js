const bcrypt = require('bcrypt-nodejs')
const { response } = require('express')

module.exports = app => {
    const saveSchedule = async(req, res) =>{
        var token = req.headers.authorization
        // verifica se foi informado todos os campos
        if(!req.headers.authorization || !req.body.data.idService || !req.body.data.idCompanie
            || !req.body.data.date || !req.body.data.hourSchedule){
            return res.json({
                error: "Informações inválidas"
            })
        }
        // consulta o usuario atraves do token
        const usuario = await app.dataBase('userlogin')
            .where({token: token})
            .first()

        // se não encontrar retorna erro
        if(!usuario){
            return res.json({
                error: "Não foi possível autenticar o usuário"
            })
        }
        // salva a agenda no banco e retorna sucesso se criado e erro se não
        app.dataBase('agenda')
        .insert({idusuario: usuario.id, idempresa: req.body.data.idCompanie,
        idservico: req.body.data.idService, dataservico: req.body.data.date,
        horaservico: req.body.data.hourSchedule, statusagenda: '1'}) 
        .then(_ => res.status(201).send())
        .catch(err => res.status(500).json(err))
    }
    return {saveSchedule}
}