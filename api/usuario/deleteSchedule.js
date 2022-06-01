const bcrypt = require('bcrypt-nodejs')
const { response } = require('express')

module.exports = app => {
    const deleteSchedule = async(req, res) =>{
        var token = req.headers.authorization
        console.log("Chamou para deletar")
        //verifica se foi informado o token
        if(!req.headers.authorization){
            return res.json({
                error:"Informações inválidas"
            })
        }
        if(!req.params.idAgenda){
             return res.json({
                 error: "Informações inválidas"
             })
        }
         // consulta o usuario atraves do token
         const usuario = await app.dataBase('userlogin')
         .where({token: token})
         .first()

        console.log(req.params.idAgenda)
         const agenda = await app.dataBase('agenda')
         .where({id: req.params.idAgenda})

         console.log(agenda[0].idempresa)
         const agendadDeletada = await app.dataBase('servicoscancelados')
         .insert({idusuario: agenda[0].idusuario, idempresa: agenda[0].idempresa, idservico: agenda[0].idservico,
            dataservico: agenda[0].dataservico, horaservico: agenda[0].horaservico
        })
        console.log("salvou")
         const deletarAgenda = await app.dataBase('agenda')
         .where({id: req.params.idAgenda})
         .del()
         .catch(err => res.status(500).json({
             error: "Não foi possivel excluir."
         }))

         return res.status(200).json({
             success: "Serviço cancelado"
         })
    }
    return {deleteSchedule}
}